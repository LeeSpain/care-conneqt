import { ReactNode, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Brain, Send, Sparkles, FileText, BookOpen } from "lucide-react";
import leeAvatar from "@/assets/lee-avatar.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { LeeActionResults } from "@/components/ai-agents/LeeActionResults";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  title: string;
}

interface ActionResult {
  action: string;
  result: any;
  error?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actionResults?: ActionResult[];
}

interface AgentData {
  avatar_url: string | null;
  display_name: string;
}

export const AdminDashboardLayout = ({ children, title }: AdminDashboardLayoutProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language.split('-')[0];
  
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset greeting message when language changes
  useEffect(() => {
    setMessages([
      { role: 'assistant', content: t('lee.greeting', 'Greetings. I am LEE The Brain, master AI orchestrator. How may I assist you today?') }
    ]);
  }, [currentLanguage, t]);

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    : "A";

  const cleanActionBlocks = (text: string): string => {
    return text
      .replace(/```action[\s\S]*?```/gi, '')
      .replace(/```json[\s\S]*?```/gi, '')
      .replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '')
      .trim();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('lee-chat', {
        body: {
          messages: [...messages, { role: 'user', content: userMessage }],
          language: currentLanguage,
        },
      });

      if (error) throw error;

      // Clean action blocks from message and store action results separately
      const cleanedMessage = cleanActionBlocks(data.message);
      const actionResults = data.action_results || [];

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanedMessage || 'Done.',
        actionResults: actionResults.length > 0 ? actionResults : undefined
      }]);
    } catch (error) {
      console.error('Lee chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('lee.error', 'I apologize, but I encountered an error. Please try again.')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarSrc = agent?.avatar_url || leeAvatar;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">{title}</h1>
            
            {/* Lee Assistant + Daily Report - centered in header */}
            <div className="flex-1 flex justify-center items-center gap-3">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button 
                    className="group relative flex items-center gap-3 h-11 pl-1.5 pr-4 rounded-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 border border-secondary/50 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-white/40 shadow-md">
                        <AvatarImage src={avatarSrc} alt={agent?.display_name || "Lee The Brain"} className="object-cover" />
                        <AvatarFallback className="bg-secondary-foreground/20 text-white text-xs">
                          <Brain className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-success rounded-full border-2 border-secondary animate-pulse" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-sm text-white leading-tight">{agent?.display_name || 'Lee "The Brain"'}</span>
                      <span className="text-[10px] text-white/70 leading-tight">{t('lee.subtitle', 'AI Orchestrator')}</span>
                    </div>
                    <Sparkles className="h-4 w-4 text-white/60 group-hover:text-white/90 transition-colors ml-1" />
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[420px] sm:w-[480px] flex flex-col p-0 border-l-secondary/30">
                  <SheetHeader className="px-5 py-4 border-b bg-gradient-to-br from-secondary via-secondary/95 to-primary/80">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-white/40 shadow-lg">
                          <AvatarImage src={avatarSrc} alt={agent?.display_name || "Lee The Brain"} className="object-cover" />
                          <AvatarFallback className="bg-secondary-foreground/20 text-white">
                            <Brain className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-secondary" />
                      </div>
                      <div className="flex-1">
                        <SheetTitle className="text-white text-left text-lg">{agent?.display_name || 'Lee "The Brain"'}</SheetTitle>
                        <p className="text-xs text-white/70 mt-0.5">{t('lee.subtitle', 'Master AI Orchestrator')}</p>
                      </div>
                      <Sparkles className="h-5 w-5 text-white/40" />
                    </div>
                  </SheetHeader>
                  
                  <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-muted/30">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                          {msg.role === 'assistant' && (
                            <Avatar className="h-7 w-7 mt-1 shrink-0">
                              <AvatarImage src={avatarSrc} alt="Lee" className="object-cover" />
                              <AvatarFallback className="bg-secondary text-white text-xs">
                                <Brain className="h-3 w-3" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col max-w-[80%]">
                            <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                              msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-br-md' 
                                : 'bg-background border border-border shadow-sm rounded-bl-md'
                            }`}>
                              {msg.content}
                            </div>
                            {msg.actionResults && msg.actionResults.length > 0 && (
                              <div className="mt-2">
                                <LeeActionResults results={msg.actionResults} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start gap-2">
                          <Avatar className="h-7 w-7 mt-1 shrink-0">
                            <AvatarImage src={avatarSrc} alt="Lee" className="object-cover" />
                            <AvatarFallback className="bg-secondary text-white text-xs">
                              <Brain className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-background border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex gap-1.5">
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t bg-background">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('lee.placeholder', 'Ask Lee anything...')}
                        disabled={isLoading}
                        className="flex-1 rounded-full bg-muted/50 border-border/50 focus-visible:ring-secondary"
                      />
                      <Button 
                        type="submit" 
                        size="icon" 
                        disabled={isLoading || !input.trim()} 
                        className="rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-md"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Daily Report Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/admin/daily-report')}
                className="h-10 px-4 rounded-full border-border/50 bg-background/50 hover:bg-muted/80 shadow-sm transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-2 text-secondary" />
                <span className="font-medium">{t('dailyReport.title', 'Daily Report')}</span>
              </Button>
              
              {/* Guide Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/admin/guide')}
                className="h-10 px-4 rounded-full border-border/50 bg-background/50 hover:bg-muted/80 shadow-sm transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">{t('adminGuide.title', 'Guide')}</span>
              </Button>
            </div>
            
            <LanguageSwitcher />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuLabel>
                  {profile?.first_name} {profile?.last_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings/profile")}>
                  {t('profile.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
