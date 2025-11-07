import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Send, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  member_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
  };
  recipient: {
    first_name: string;
    last_name: string;
  };
}

interface Conversation {
  userId: string;
  userName: string;
  memberId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function NurseMessages() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    
    const channel = supabase
      .channel('nurse-messages-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'care_messages',
          filter: `recipient_id=eq.${user?.id}`
        },
        () => {
          fetchConversations();
          if (selectedConversation) {
            fetchMessages(selectedConversation.userId, selectedConversation.memberId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select(`
        member_id,
        members:member_id (
          user_id,
          profiles:user_id (
            first_name,
            last_name
          )
        )
      `)
      .eq('nurse_id', user.id);

    if (assignments) {
      const convos = await Promise.all(
        assignments.map(async (assignment: any) => {
          const { data: lastMsg } = await supabase
            .from('care_messages')
            .select('*, sender:sender_id(first_name, last_name), recipient:recipient_id(first_name, last_name)')
            .eq('member_id', assignment.member_id)
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from('care_messages')
            .select('*', { count: 'exact', head: true })
            .eq('member_id', assignment.member_id)
            .eq('recipient_id', user.id)
            .eq('is_read', false);

          return {
            userId: assignment.members.user_id,
            userName: `${assignment.members.profiles.first_name} ${assignment.members.profiles.last_name}`,
            memberId: assignment.member_id,
            lastMessage: lastMsg?.message || 'No messages yet',
            lastMessageTime: lastMsg?.created_at || new Date().toISOString(),
            unreadCount: count || 0
          };
        })
      );

      setConversations(convos);
    }
    setLoading(false);
  };

  const fetchMessages = async (userId: string, memberId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('care_messages')
      .select('*')
      .eq('member_id', memberId)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: true });

    if (data) {
      const messagesWithProfiles = await Promise.all(
        data.map(async (msg: any) => {
          const { data: sender } = await supabase.from('profiles').select('first_name, last_name').eq('id', msg.sender_id).single();
          const { data: recipient } = await supabase.from('profiles').select('first_name, last_name').eq('id', msg.recipient_id).single();
          return { ...msg, sender, recipient };
        })
      );
      setMessages(messagesWithProfiles as Message[]);
    }

    // Mark messages as read
    await supabase
      .from('care_messages')
      .update({ is_read: true })
      .eq('member_id', memberId)
      .eq('recipient_id', user.id)
      .eq('is_read', false);

    fetchConversations();
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const { error } = await supabase
      .from('care_messages')
      .insert({
        sender_id: user.id,
        recipient_id: selectedConversation.userId,
        member_id: selectedConversation.memberId,
        message: newMessage.trim()
      });

    if (error) {
      toast.error('Failed to send message');
    } else {
      setNewMessage('');
      fetchMessages(selectedConversation.userId, selectedConversation.memberId);
      fetchConversations();
    }
  };

  return (
    <DashboardLayout title="Messages">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No conversations</p>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.userId}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.userId === convo.userId
                      ? 'bg-primary/10'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setSelectedConversation(convo);
                    fetchMessages(convo.userId, convo.memberId);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{convo.userName}</p>
                    {convo.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {convo.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(convo.lastMessageTime), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedConversation ? selectedConversation.userName : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[calc(100vh-24rem)]">
                  {messages.map((msg) => {
                    const isSentByMe = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSentByMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(msg.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={3}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
