import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Brain, X, Send, Loader2, Minimize2, Maximize2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AgentBadge } from './AgentBadge';
import leeAvatar from '@/assets/lee-avatar.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentData {
  avatar_url: string | null;
  display_name: string;
}

interface Position {
  x: number;
  y: number;
}

export function LeeChat() {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('lee.greeting', 'Greetings. I am LEE The Brain, master AI orchestrator. I have full system access and can provide executive-level insights. How may I assist you?') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Dragging state
  const [position, setPosition] = useState<Position>(() => {
    const saved = localStorage.getItem('lee-chat-position');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { x: window.innerWidth - 200, y: 80 };
      }
    }
    return { x: window.innerWidth - 200, y: 80 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Fetch agent data on mount
  useEffect(() => {
    const fetchAgent = async () => {
      const { data } = await supabase
        .from('ai_agents')
        .select('avatar_url, display_name')
        .eq('name', 'lee-the-brain')
        .single();
      
      if (data) setAgent(data);
    };
    
    fetchAgent();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('lee-chat-position', JSON.stringify(position));
  }, [position]);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (elementRef.current) {
      const touch = e.touches[0];
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const newX = Math.max(0, Math.min(window.innerWidth - 200, touch.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, touch.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

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

  const avatarSrc = agent?.avatar_url || leeAvatar;

  if (!isOpen) {
    return (
      <div
        ref={elementRef}
        style={{ 
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 50,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <Button
          onClick={(e) => {
            if (!isDragging) setIsOpen(true);
            e.stopPropagation();
          }}
          className="h-12 px-4 rounded-full shadow-2xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 hover:from-amber-700 hover:via-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-3 border border-amber-400/30 transition-all hover:scale-105 select-none"
        >
          <Avatar className="h-8 w-8 ring-2 ring-white/30">
            <AvatarImage src={avatarSrc} alt="LEE The Brain" className="object-cover" />
            <AvatarFallback className="bg-amber-700">
              <Brain className="h-4 w-4 text-white" />
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm">LEE The Brain</span>
        </Button>
      </div>
    );
  }

  return (
    <Card 
      ref={elementRef}
      style={{ 
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 500),
        top: position.y,
        zIndex: 50
      }}
      className={`${isMinimized ? 'w-80 h-16' : 'w-[480px] h-[580px]'} shadow-2xl flex flex-col transition-all border-amber-500/40 bg-background/95 backdrop-blur-sm`}
    >
      {/* Professional Header with drag handle */}
      <div 
        className={`p-4 border-b bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 flex items-center justify-between rounded-t-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-white/60" />
          <Avatar className="h-10 w-10 ring-2 ring-white/40 shadow-lg">
            <AvatarImage src={avatarSrc} alt="LEE The Brain" className="object-cover" />
            <AvatarFallback className="bg-amber-700">
              <Brain className="h-5 w-5 text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">LEE The Brain</h3>
            <p className="text-xs text-white/80">Master AI Orchestrator • Full Access</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mr-2 flex-shrink-0 ring-2 ring-amber-500/30">
                      <AvatarImage src={avatarSrc} alt="LEE" className="object-cover" />
                      <AvatarFallback className="bg-amber-500/20">
                        <Brain className="h-4 w-4 text-amber-500" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                      : 'bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="mb-1.5">
                        <AgentBadge agent="lee" size="sm" />
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0 ring-2 ring-amber-500/30">
                    <AvatarImage src={avatarSrc} alt="LEE" className="object-cover" />
                    <AvatarFallback className="bg-amber-500/20">
                      <Brain className="h-4 w-4 text-amber-500" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      <span className="text-sm text-muted-foreground">LEE is thinking...</span>
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask LEE anything about the system..."
                disabled={isLoading}
                className="flex-1 text-sm bg-background border-amber-500/20 focus-visible:ring-amber-500/50"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !input.trim()} 
                size="icon" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}