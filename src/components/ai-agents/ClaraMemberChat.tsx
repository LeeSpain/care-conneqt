import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Sparkles, MinusCircle, PlusCircle, Maximize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AgentBadge } from './AgentBadge';
import { HandoffIndicator } from './HandoffIndicator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ClaraMemberChatProps {
  memberId?: string;
}

export function ClaraMemberChat({ memberId }: ClaraMemberChatProps) {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHandingOff, setIsHandingOff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedScrollRef = useRef<HTMLDivElement>(null);

  // Fetch agent data only when chat is opened
  useEffect(() => {
    if (!isOpen || agent) return;
    
    const fetchAgent = async () => {
      const { data } = await supabase
        .from('ai_agents')
        .select('avatar_url, display_name')
        .eq('name', 'clara-member')
        .single();
      
      if (data) setAgent(data);
    };
    
    fetchAgent();
  }, [isOpen, agent]);

  // Update initial greeting when language changes
  useEffect(() => {
    const greeting = t('claraMember.greeting', 'Hello! I\'m Clara, your personal care companion. How can I help you today?');
    if (greeting && !greeting.includes('claraMember.greeting')) {
      setMessages([{
        role: 'assistant',
        content: greeting,
        agent: 'clara'
      }]);
    }
  }, [currentLanguage, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      if (expandedScrollRef.current) {
        expandedScrollRef.current.scrollTop = expandedScrollRef.current.scrollHeight;
      }
    };
    
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
      const { data, error } = await supabase.functions.invoke('clara-member-chat', {
        body: {
          messages: [...messages.filter(m => !m.isHandoff), userMessage].map(m => ({ role: m.role, content: m.content })),
          memberId,
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
          toast.error(data.error);
        }
        return;
      }

      // If there was a handoff, show Ineke's response first
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
      toast.error('Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsHandingOff(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: Message, index: number) => (
    <div
      key={index}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
            : message.agent === 'ineke'
            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-foreground border border-emerald-500/20'
            : 'bg-gradient-to-br from-secondary/20 to-secondary/10 text-foreground border border-secondary/20'
        }`}
      >
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
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                  C
                </AvatarFallback>
              )}
            </Avatar>
            <span className={`text-xs font-semibold ${message.agent === 'ineke' ? 'text-emerald-600' : 'text-primary'}`}>
              {message.agent === 'ineke' ? 'Ineke' : 'Clara'}
            </span>
            {message.isHandoff && (
              <span className="text-xs text-muted-foreground">(Nurse AI)</span>
            )}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );

  // Closed state - beautiful trigger button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-auto px-6 py-4 rounded-2xl shadow-2xl z-40 bg-gradient-to-br from-primary via-secondary to-primary hover:scale-105 transition-all duration-300 border-2 border-primary/30 group animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white/50 shadow-lg">
              {agent?.avatar_url ? (
                <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-white/90 to-white/70 text-primary font-bold text-lg">
                  C
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{t('clara.chatWith', 'Chat with Clara')}</span>
              <Sparkles className="h-4 w-4 text-white/90 animate-pulse" />
            </div>
            <p className="text-xs text-white/80">{t('clara.available', 'Available 24/7')}</p>
          </div>
        </div>
      </Button>
    );
  }

  return (
    <>
      <Card className={`fixed bottom-6 right-6 w-96 shadow-2xl z-40 flex flex-col transition-all duration-300 border-2 border-primary/20 animate-scale-in ${
        isMinimized ? 'h-20' : 'h-[600px]'
      }`}>
        {/* Header with Avatar */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-lg">
                {agent?.avatar_url ? (
                  <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                    C
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Clara</h3>
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-xs text-muted-foreground">{t('clara.subtitle', 'Your Care Companion • Available 24/7')}</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="hover:bg-primary/10"
              title="Expand to full view"
            >
              <Maximize2 className="h-5 w-5 text-primary" />
            </Button>
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
                {messages.map((message, index) => renderMessage(message, index))}
                {isHandingOff && (
                  <HandoffIndicator sourceAgent="clara" targetAgent="ineke" />
                )}
                {isLoading && !isHandingOff && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-4 border border-secondary/20">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">{t('clara.typing', 'Clara is typing...')}</span>
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
                  placeholder={t('clara.placeholder', 'Type a message...')}
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
                {t('clara.powered', 'Powered by Conneqtivity AI')}
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Expanded Full-Page View */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-lg">
                {agent?.avatar_url ? (
                  <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg">
                    C
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl">Clara</DialogTitle>
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-muted-foreground">{t('clara.subtitle', 'Your Care Companion • Available 24/7')}</p>
              </div>
            </div>
          </DialogHeader>

          {/* Messages in Expanded View */}
          <ScrollArea className="flex-1 p-6" ref={expandedScrollRef}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message, index) => renderMessage(message, index))}
              {isHandingOff && (
                <HandoffIndicator sourceAgent="clara" targetAgent="ineke" />
              )}
              {isLoading && !isHandingOff && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-4 border border-secondary/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">{t('clara.typing', 'Clara is typing...')}</span>
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
                placeholder={t('clara.placeholder', 'Type a message...')}
                disabled={isLoading}
                className="flex-1 h-12 text-base rounded-full border-primary/20 focus:border-primary/40"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="h-12 px-8 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {t('clara.powered', 'Powered by Conneqtivity AI')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
