import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Conversation } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onNewConversation?: () => void;
  loading?: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewConversation,
  loading
}: ConversationListProps) {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title;
    
    // For direct conversations, show the other participant's name
    const otherParticipant = conversation.participants?.find(
      p => p.user_id !== user?.id
    );
    
    if (otherParticipant?.profile) {
      const { first_name, last_name, email } = otherParticipant.profile;
      if (first_name || last_name) {
        return `${first_name || ''} ${last_name || ''}`.trim();
      }
      return email || t('messaging.unknownUser', 'Unknown User');
    }
    
    return t('messaging.conversation', 'Conversation');
  };

  const getConversationAvatar = (conversation: Conversation) => {
    const otherParticipant = conversation.participants?.find(
      p => p.user_id !== user?.id
    );
    return otherParticipant?.profile?.avatar_url;
  };

  const getInitials = (conversation: Conversation) => {
    const title = getConversationTitle(conversation);
    return title
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!search) return true;
    const title = getConversationTitle(conv).toLowerCase();
    const lastMessage = conv.last_message?.message?.toLowerCase() || '';
    return title.includes(search.toLowerCase()) || lastMessage.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{t('messaging.messages', 'Messages')}</h2>
          {onNewConversation && (
            <Button size="sm" variant="ghost" onClick={onNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('messaging.searchConversations', 'Search conversations...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {search
                ? t('messaging.noResults', 'No conversations found')
                : t('messaging.noConversations', 'No messages yet')}
            </p>
            {!search && onNewConversation && (
              <Button variant="link" onClick={onNewConversation} className="mt-2">
                {t('messaging.startConversation', 'Start a conversation')}
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation)}
                className={cn(
                  'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                  selectedId === conversation.id && 'bg-muted'
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getConversationAvatar(conversation) || undefined} />
                    <AvatarFallback>{getInitials(conversation)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {getConversationTitle(conversation)}
                      </span>
                      {conversation.last_message_at && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(conversation.last_message_at), {
                            addSuffix: false
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message?.message || t('messaging.noMessages', 'No messages')}
                      </p>
                      {(conversation.unread_count || 0) > 0 && (
                        <Badge variant="default" className="shrink-0">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
