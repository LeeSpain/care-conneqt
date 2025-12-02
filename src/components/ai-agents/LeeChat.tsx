import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AgentBadge } from './AgentBadge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function LeeChat() {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('lee.greeting', 'Greetings. I am LEE The Brain, master AI orchestrator. I have full system access and can provide executive-level insights. How may I assist you?') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const { data, error } = await supabase.functions.invoke('lee-chat', {
        body: {
          messages: [...messages, userMessage],
          language: currentLanguage
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-5 rounded-full shadow-2xl z-50 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold flex items-center gap-3"
      >
        <Brain className="h-5 w-5" />
        <span className="hidden sm:inline">LEE The Brain</span>
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 ${isMinimized ? 'w-80 h-14' : 'w-[450px] h-[550px]'} shadow-2xl z-50 flex flex-col transition-all border-amber-500/30`}>
      <div className="p-3 border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-amber-500/30">
            <AvatarFallback className="bg-amber-500/20">
              <Brain className="h-4 w-4 text-amber-500" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">LEE The Brain</h3>
            <p className="text-xs text-muted-foreground">Master AI • Full access</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-3" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-2.5 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-amber-500/5 border border-amber-500/20'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="mb-1">
                        <AgentBadge agent="lee" size="sm" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask LEE anything about the system..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon" className="bg-gradient-to-r from-amber-500 to-orange-500">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
