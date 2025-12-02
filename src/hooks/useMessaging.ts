import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';
  title: string | null;
  context_type: string | null;
  context_id: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: PlatformMessage;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'owner' | 'participant';
  joined_at: string;
  last_read_at: string | null;
  notifications_enabled: boolean;
  profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export interface PlatformMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'system' | 'notification';
  attachments: any[];
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export function useMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user's conversations
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (partError) throw partError;

      if (!participations?.length) {
        setConversations([]);
        return;
      }

      const conversationIds = participations.map(p => p.conversation_id);

      // Get conversations with last message
      const { data: convos, error: convoError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convoError) throw convoError;

      // Get participants for each conversation
      const { data: allParticipants, error: allPartError } = await supabase
        .from('conversation_participants')
        .select('*')
        .in('conversation_id', conversationIds);

      if (allPartError) throw allPartError;

      // Get profiles for participants
      const participantUserIds = [...new Set(allParticipants?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, email')
        .in('id', participantUserIds);

      // Get last message for each conversation
      const { data: lastMessages } = await supabase
        .from('platform_messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      // Get unread counts
      const { data: unreadCounts } = await supabase
        .from('platform_messages')
        .select('conversation_id')
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      // Map everything together
      const enrichedConversations: Conversation[] = convos?.map(convo => {
        const participants = allParticipants
          ?.filter(p => p.conversation_id === convo.id)
          .map(p => ({
            ...p,
            role: p.role as 'owner' | 'participant',
            profile: profiles?.find(prof => prof.id === p.user_id)
          })) || [];

        const lastMsg = lastMessages?.find(m => m.conversation_id === convo.id);
        const unreadCount = unreadCounts?.filter(u => u.conversation_id === convo.id).length || 0;

        return {
          ...convo,
          type: convo.type as 'direct' | 'group' | 'support',
          participants,
          last_message: lastMsg ? {
            ...lastMsg,
            message_type: lastMsg.message_type as 'text' | 'system' | 'notification',
            attachments: lastMsg.attachments as any[]
          } : undefined,
          unread_count: unreadCount
        };
      }) || [];

      setConversations(enrichedConversations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string): Promise<PlatformMessage[]> => {
    const { data: messages, error } = await supabase
      .from('platform_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Get sender profiles
    const senderIds = [...new Set(messages?.map(m => m.sender_id) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', senderIds);

    return messages?.map(m => ({
      ...m,
      message_type: m.message_type as 'text' | 'system' | 'notification',
      attachments: m.attachments as any[],
      sender: profiles?.find(p => p.id === m.sender_id)
    })) || [];
  }, []);

  const sendMessage = useCallback(async (conversationId: string, message: string) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('platform_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message,
        message_type: 'text'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }, [user]);

  const createConversation = useCallback(async (
    participantIds: string[],
    type: 'direct' | 'group' | 'support' = 'direct',
    title?: string,
    contextType?: string,
    contextId?: string
  ) => {
    if (!user) throw new Error('Not authenticated');

    // For direct conversations, check if one already exists
    if (type === 'direct' && participantIds.length === 1) {
      const existingConvo = await findExistingDirectConversation(participantIds[0]);
      if (existingConvo) return { ...existingConvo, type: existingConvo.type as 'direct' | 'group' | 'support' };
    }

    // Create new conversation
    const { data: convoData, error: convoError } = await supabase
      .from('conversations')
      .insert({
        type,
        title,
        context_type: contextType,
        context_id: contextId
      })
      .select()
      .single();

    if (convoError) throw convoError;
    
    const convo = { ...convoData, type: convoData.type as 'direct' | 'group' | 'support' };

    // Add all participants including current user
    const allParticipants = [...new Set([user.id, ...participantIds])];
    const participantRecords = allParticipants.map((userId, index) => ({
      conversation_id: convo.id,
      user_id: userId,
      role: index === 0 ? 'owner' : 'participant'
    }));

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participantRecords);

    if (partError) throw partError;

    await fetchConversations();
    return convo;
  }, [user, fetchConversations]);

  const findExistingDirectConversation = useCallback(async (otherUserId: string) => {
    if (!user) return null;

    // Find conversations where both users are participants
    const { data: myConvos } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (!myConvos?.length) return null;

    const { data: sharedConvos } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', otherUserId)
      .in('conversation_id', myConvos.map(c => c.conversation_id));

    if (!sharedConvos?.length) return null;

    // Check if any is a direct conversation with only 2 participants
    for (const convo of sharedConvos) {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', convo.conversation_id);

      if (participants?.length === 2) {
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', convo.conversation_id)
          .eq('type', 'direct')
          .single();

        if (data) return data;
      }
    }

    return null;
  }, [user]);

  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    await supabase
      .from('platform_messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .eq('is_read', false);

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);

    await fetchConversations();
  }, [user, fetchConversations]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messaging-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'platform_messages'
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead
  };
}
