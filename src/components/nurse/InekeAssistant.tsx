import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { HeartPulse, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentData {
  avatar_url: string | null;
  display_name: string;
}

interface InekeAssistantProps {
  context?: {
    memberId?: string;
    alerts?: any[];
    tasks?: any[];
  };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const InekeAssistant = ({ context, isOpen: externalIsOpen, onOpenChange }: InekeAssistantProps) => {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0]; // 'en-US' -> 'en'
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('ineke.greeting')
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedScrollRef = useRef<HTMLDivElement>(null);

  // Fetch agent data on mount
  useEffect(() => {
    const fetchAgent = async () => {
      const { data } = await supabase
        .from('ai_agents')
        .select('avatar_url, display_name')
        .eq('name', 'ineke')
        .single();
      
      if (data) setAgent(data);
    };
    
    fetchAgent();
  }, []);

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: t('ineke.greeting')
    }]);
  }, [currentLanguage, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (expandedScrollRef.current) {
      expandedScrollRef.current.scrollTop = expandedScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ineke-chat', {
        body: {
          messages: [...messages, userMessage],
          context,
          language: currentLanguage
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (data.error.includes('unavailable')) {
          toast.error('Service temporarily unavailable. Please try again later.');
        } else {
          throw new Error(data.error);
        }
        return;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 px-6 rounded-full shadow-2xl z-50 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold flex items-center gap-3 transition-all hover:scale-105"
      >
        <div className="relative">
          <HeartPulse className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        <span className="hidden sm:inline">Chat with Ineke</span>
      </Button>
    );
  }

  const renderMessages = (isInDialog: boolean) => (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-secondary text-secondary-foreground rounded-lg p-3 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Centered Popup */}
          <Card className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMinimized ? 'w-96 h-16' : 'w-[600px] h-[700px]'} shadow-2xl z-50 flex flex-col transition-all animate-scale-in`}>
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                    {agent?.avatar_url ? (
                      <AvatarImage src={agent.avatar_url} alt={agent.display_name || "Ineke"} />
                    ) : (
                      <AvatarFallback className="bg-blue-500/20">
                        <HeartPulse className="h-6 w-6 text-blue-500" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ineke</h3>
                  <p className="text-sm text-muted-foreground">{t('ineke.available')}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(true)}
                  className="hover:bg-blue-500/10"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-blue-500/10"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {renderMessages(false)}
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t bg-background/50 backdrop-blur">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('ineke.placeholder')}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </>
      )}

      {/* Expanded Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col">
          {/* Dialog Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                  {agent?.avatar_url ? (
                    <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                  ) : (
                    <AvatarFallback className="bg-blue-500/20">
                      <HeartPulse className="h-6 w-6 text-blue-500" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-background" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Ineke</h2>
                <p className="text-sm text-muted-foreground">{t('ineke.available')} • Your AI Nursing Assistant</p>
              </div>
            </div>
          </div>

          {/* Dialog Messages */}
          <ScrollArea className="flex-1 p-6" ref={expandedScrollRef}>
            {renderMessages(true)}
          </ScrollArea>

          {/* Dialog Input */}
          <div className="p-6 border-t bg-background/50 backdrop-blur">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('ineke.placeholder')}
                disabled={isLoading}
                className="flex-1 h-12"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
