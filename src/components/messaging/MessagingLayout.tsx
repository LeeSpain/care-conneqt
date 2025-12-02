import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessaging, Conversation } from '@/hooks/useMessaging';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';
import { ComposeDialog } from './ComposeDialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessagingLayoutProps {
  allowedRoles?: string[];
  contextType?: string;
  contextId?: string;
  className?: string;
}

export function MessagingLayout({
  allowedRoles,
  contextType,
  contextId,
  className
}: MessagingLayoutProps) {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  const { conversations, loading } = useMessaging();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleConversationCreated = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  // Mobile view - show either list or thread
  if (isMobile) {
    return (
      <div className={cn('h-full', className)}>
        {selectedConversation ? (
          <MessageThread
            conversation={selectedConversation}
            onBack={handleBack}
            showBackButton
          />
        ) : (
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={handleSelectConversation}
            onNewConversation={() => setComposeOpen(true)}
            loading={loading}
          />
        )}
        <ComposeDialog
          open={composeOpen}
          onOpenChange={setComposeOpen}
          onConversationCreated={handleConversationCreated}
          allowedRoles={allowedRoles}
          contextType={contextType}
          contextId={contextId}
        />
      </div>
    );
  }

  // Desktop view - side by side
  return (
    <div className={cn('h-full flex border rounded-lg overflow-hidden bg-card', className)}>
      {/* Conversation list */}
      <div className="w-80 border-r shrink-0">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={handleSelectConversation}
          onNewConversation={() => setComposeOpen(true)}
          loading={loading}
        />
      </div>

      {/* Message thread */}
      <div className="flex-1 min-w-0">
        {selectedConversation ? (
          <MessageThread conversation={selectedConversation} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {t('messaging.selectConversation', 'Select a conversation')}
            </p>
            <p className="text-sm">
              {t('messaging.selectHint', 'Choose from the list or start a new one')}
            </p>
          </div>
        )}
      </div>

      <ComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onConversationCreated={handleConversationCreated}
        allowedRoles={allowedRoles}
        contextType={contextType}
        contextId={contextId}
      />
    </div>
  );
}
