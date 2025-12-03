import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, X, Send, Loader2, Minimize2, Maximize2, Sparkles } from 'lucide-react';
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

interface AgentData {
  avatar_url: string | null;
  display_name: string;
}

interface ClaraFamilyChatProps {
  memberId?: string;
}

export function ClaraFamilyChat({ memberId }: ClaraFamilyChatProps) {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('claraFamily.greeting', 'Hello! I\'m Clara, here to help you stay connected with your loved one\'s care. What would you like to know?'), agent: 'clara' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHandingOff, setIsHandingOff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch agent data when chat opens
  useEffect(() => {
    if (!isOpen || agent) return;
    
    const fetchAgent = async () => {
      const { data } = await supabase
        .from('ai_agents')
        .select('avatar_url, display_name')
        .eq('name', 'clara-family')
        .single();
      
      if (data) setAgent(data);
    };
    
    fetchAgent();
  }, [isOpen, agent]);

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
        className="fixed bottom-6 right-6 h-auto px-6 py-4 rounded-2xl shadow-2xl z-50 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-fuchsia-500 hover:scale-105 transition-all border-2 border-fuchsia-400/30"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/50 shadow-lg">
              {agent?.avatar_url ? (
                <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-fuchsia-500 font-bold text-lg">
                  C
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Clara</span>
              <Sparkles className="h-4 w-4 text-white/90 animate-pulse" />
            </div>
            <p className="text-xs text-white/80">Family Support</p>
          </div>
        </div>
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 ${isMinimized ? 'w-80 h-20' : 'w-96 h-[600px]'} shadow-2xl z-50 flex flex-col transition-all border-2 border-fuchsia-500/20`}>
      <div className="p-4 border-b bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-fuchsia-500/10 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-fuchsia-500/30 shadow-lg">
              {agent?.avatar_url ? (
                <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white font-bold text-lg">
                  C
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">Clara</h3>
              <Sparkles className="h-4 w-4 text-fuchsia-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground">{t('claraFamily.subtitle')}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-fuchsia-500/10" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-fuchsia-500/10" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white'
                      : message.agent === 'ineke'
                      ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20'
                      : 'bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          {message.agent === 'ineke' ? (
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs">
                              I
                            </AvatarFallback>
                          ) : agent?.avatar_url ? (
                            <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white text-xs">
                              C
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className={`text-xs font-semibold ${message.agent === 'ineke' ? 'text-emerald-600' : 'text-fuchsia-600'}`}>
                          {message.agent === 'ineke' ? 'Ineke' : 'Clara'}
                        </span>
                        {message.isHandoff && (
                          <span className="text-xs text-muted-foreground">(Nurse AI)</span>
                        )}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isHandingOff && <HandoffIndicator sourceAgent="clara" targetAgent="ineke" />}
              {isLoading && !isHandingOff && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-4 border border-secondary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-fuchsia-500" />
                      <span className="text-xs text-muted-foreground">{t('claraFamily.typing')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t('claraFamily.placeholder')}
                disabled={isLoading}
                className="flex-1 rounded-full border-fuchsia-500/20 focus:border-fuchsia-500/40 bg-background"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()} 
                size="icon" 
                className="rounded-full h-10 w-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t('clara.powered')}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
