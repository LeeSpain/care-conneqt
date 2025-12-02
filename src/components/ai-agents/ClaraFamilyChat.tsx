import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AgentBadge } from './AgentBadge';
import { HandoffIndicator } from './HandoffIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  agent?: 'clara' | 'ineke';
  isHandoff?: boolean;
}

interface ClaraFamilyChatProps {
  memberId?: string;
}

export function ClaraFamilyChat({ memberId }: ClaraFamilyChatProps) {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('claraFamily.greeting', 'Hello! I\'m Clara, here to help you stay connected with your loved one\'s care. What would you like to know?'), agent: 'clara' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHandingOff, setIsHandingOff] = useState(false);
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
      const { data, error } = await supabase.functions.invoke('clara-family-chat', {
        body: {
          messages: [...messages.filter(m => !m.isHandoff), userMessage].map(m => ({ role: m.role, content: m.content })),
          memberId,
          language: currentLanguage
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.handoff) {
        setIsHandingOff(true);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.handoff.message,
          agent: 'ineke',
          isHandoff: true
        }]);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsHandingOff(false);
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        agent: 'clara'
      }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsHandingOff(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-5 rounded-full shadow-2xl z-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold flex items-center gap-3"
      >
        <Heart className="h-5 w-5" />
        <span className="hidden sm:inline">Chat with Clara</span>
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'} shadow-2xl z-50 flex flex-col transition-all`}>
      <div className="p-3 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-500/20">
              <Heart className="h-4 w-4 text-purple-500" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Clara</h3>
            <p className="text-xs text-muted-foreground">Family support</p>
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
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.agent === 'ineke'
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-secondary'
                  }`}>
                    {message.role === 'assistant' && message.agent && (
                      <div className="mb-1">
                        <AgentBadge agent={message.agent} size="sm" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isHandingOff && <HandoffIndicator sourceAgent="clara" targetAgent="ineke" />}
              {isLoading && !isHandingOff && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-lg p-2.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
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
                placeholder="Ask about your loved one's care..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon" className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
