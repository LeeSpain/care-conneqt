import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Sparkles, MinusCircle, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ClaraFixedChat = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.split('-')[0]; // 'en-US' -> 'en'
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Clara, your CareConneqt assistant. I'm here to help you learn about our services, pricing, and get started. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
          language: currentLanguage,
          context: {
            page: 'homepage'
          }
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

  // Closed state - beautiful trigger button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-6 h-auto px-6 py-4 rounded-2xl shadow-2xl z-40 bg-gradient-to-br from-primary via-secondary to-primary hover:scale-105 transition-all duration-300 border-2 border-primary/30 group animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/50 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-primary font-bold text-lg">
                C
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Chat with Clara</span>
              <Sparkles className="h-4 w-4 text-white/90 animate-pulse" />
            </div>
            <p className="text-xs text-white/80">AI Assistant • Available Now</p>
          </div>
        </div>
      </Button>
    );
  }

  return (
    <Card className={`fixed top-24 right-6 w-96 shadow-2xl z-40 flex flex-col transition-all duration-300 border-2 border-primary/20 animate-scale-in ${
      isMinimized ? 'h-20' : 'h-[600px]'
    }`}>
      {/* Header with Avatar */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          {/* Beautiful Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                C
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">Clara</h3>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">AI Care Assistant • Available 24/7</p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-primary/10"
          >
            {isMinimized ? (
              <PlusCircle className="h-5 w-5 text-primary" />
            ) : (
              <MinusCircle className="h-5 w-5 text-primary" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-primary/10"
          >
            <MinusCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                        : 'bg-gradient-to-br from-secondary/20 to-secondary/10 text-foreground border border-secondary/20'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                            C
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-primary">Clara</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-4 border border-secondary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Clara is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about our care services..."
                disabled={isLoading}
                className="flex-1 rounded-full border-primary/20 focus:border-primary/40 bg-background"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="rounded-full h-10 w-10 bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by AI • Instant responses
            </p>
          </div>
        </>
      )}
    </Card>
  );
};
