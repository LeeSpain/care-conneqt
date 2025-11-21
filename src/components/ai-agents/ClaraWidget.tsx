import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, X, Send, Loader2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentData {
  avatar_url: string | null;
  display_name: string;
}

export const ClaraWidget = () => {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0]; // 'en-US' -> 'en'
  
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('clara.greeting')
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedScrollRef = useRef<HTMLDivElement>(null);

  // Fetch agent data on mount
  useEffect(() => {
    const fetchAgent = async () => {
      const { data } = await supabase
        .from('ai_agents')
        .select('avatar_url, display_name')
        .eq('name', 'clara')
        .single();
      
      if (data) setAgent(data);
    };
    
    fetchAgent();
  }, []);

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: t('clara.greeting')
    }]);
  }, [currentLanguage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      if (expandedScrollRef.current) {
        expandedScrollRef.current.scrollTop = expandedScrollRef.current.scrollHeight;
      }
    };
    
    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('clara-chat', {
        body: {
          messages: [...messages, userMessage],
          sessionId,
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {agent?.avatar_url ? (
                <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
              ) : (
                <AvatarFallback className="bg-purple-500/20">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold">Clara</h3>
              <p className="text-xs text-muted-foreground">AI Care Assistant • 24/7</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              title="Expand to full view"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
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
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Expanded Full-Page View */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {agent?.avatar_url ? (
                  <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                ) : (
                  <AvatarFallback className="bg-purple-500/20">
                    <MessageSquare className="h-6 w-6 text-purple-500" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <DialogTitle className="text-xl">Clara - AI Care Assistant</DialogTitle>
                <p className="text-sm text-muted-foreground">Available 24/7 to help you</p>
              </div>
            </div>
          </DialogHeader>

          {/* Messages in Expanded View */}
          <ScrollArea className="flex-1 p-6" ref={expandedScrollRef}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Clara is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input in Expanded View */}
          <div className="p-6 pt-4 border-t bg-muted/30">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 h-12 text-base"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="h-12 px-6"
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
