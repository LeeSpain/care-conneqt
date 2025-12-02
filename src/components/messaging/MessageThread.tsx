import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Conversation, PlatformMessage, useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface MessageThreadProps {
  conversation: Conversation;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function MessageThread({ conversation, onBack, showBackButton }: MessageThreadProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { fetchMessages, sendMessage, markAsRead } = useMessaging();
  const [messages, setMessages] = useState<PlatformMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const msgs = await fetchMessages(conversation.id);
      setMessages(msgs);
      await markAsRead(conversation.id);
    } finally {
      setLoading(false);
    }
  }, [conversation.id, fetchMessages, markAsRead]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Real-time subscription for this conversation
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'platform_messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          // Get sender profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: profile
          } as PlatformMessage;

          setMessages(prev => [...prev, newMessage]);
          
          // Mark as read if from someone else
          if (payload.new.sender_id !== user?.id) {
            markAsRead(conversation.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, user?.id, markAsRead]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(conversation.id, input.trim());
      setInput('');
      textareaRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) {
      return format(d, 'HH:mm');
    } else if (isYesterday(d)) {
      return t('messaging.yesterday', 'Yesterday') + ' ' + format(d, 'HH:mm');
    }
    return format(d, 'dd/MM/yyyy HH:mm');
  };

  const getOtherParticipant = () => {
    return conversation.participants?.find(p => p.user_id !== user?.id);
  };

  const getConversationTitle = () => {
    if (conversation.title) return conversation.title;
    const other = getOtherParticipant();
    if (other?.profile) {
      const { first_name, last_name } = other.profile;
      if (first_name || last_name) {
        return `${first_name || ''} ${last_name || ''}`.trim();
      }
    }
    return t('messaging.conversation', 'Conversation');
  };

  const getSenderName = (message: PlatformMessage) => {
    if (message.sender_id === user?.id) return t('messaging.you', 'You');
    if (message.sender) {
      const { first_name, last_name } = message.sender;
      if (first_name || last_name) {
        return `${first_name || ''} ${last_name || ''}`.trim();
      }
    }
    return t('messaging.unknownUser', 'Unknown');
  };

  const getInitials = (message: PlatformMessage) => {
    const name = getSenderName(message);
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'justify-end')}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-16 w-48 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarImage src={getOtherParticipant()?.profile?.avatar_url || undefined} />
          <AvatarFallback>
            {getConversationTitle().slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{getConversationTitle()}</h3>
          {conversation.type === 'group' && (
            <p className="text-xs text-muted-foreground">
              {conversation.participants?.length} {t('messaging.participants', 'participants')}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t('messaging.startConversationHint', 'Send a message to start the conversation')}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.sender_id === user?.id;
              const showAvatar = 
                index === 0 || 
                messages[index - 1].sender_id !== message.sender_id;

              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
                >
                  {showAvatar ? (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={message.sender?.avatar_url || undefined} />
                      <AvatarFallback>{getInitials(message)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 shrink-0" />
                  )}
                  <div
                    className={cn(
                      'max-w-[70%] rounded-lg px-3 py-2',
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.message_type === 'system' ? (
                      <p className="text-sm italic text-muted-foreground">
                        {message.message}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                        <p
                          className={cn(
                            'text-xs mt-1',
                            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}
                        >
                          {formatMessageTime(message.created_at)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder={t('messaging.typeMessage', 'Type a message...')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="min-h-[40px] max-h-[120px] resize-none"
          />
          <Button onClick={handleSend} disabled={!input.trim() || sending}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
