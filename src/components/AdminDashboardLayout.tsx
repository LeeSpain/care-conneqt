import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Brain, Send, Sparkles } from "lucide-react";
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
import { useEffect, useRef } from "react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  title: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('lee.greeting', 'Greetings. I am LEE The Brain, master AI orchestrator. How may I assist you today?') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
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
            
            {/* Lee Assistant - centered in header */}
            <div className="flex-1 flex justify-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-10 px-4 gap-2.5 bg-secondary hover:bg-secondary/90 border-secondary text-white transition-all"
                  >
                    <div className="relative">
                      <Avatar className="h-6 w-6 ring-2 ring-white/30">
                        <AvatarImage src={avatarSrc} alt="Lee The Brain" className="object-cover" />
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                          <Brain className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-success rounded-full border-2 border-secondary" />
                    </div>
                    <span className="font-medium text-sm text-white">Lee "The Brain"</span>
                    <Sparkles className="h-3.5 w-3.5 text-white/80" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[450px] flex flex-col p-0">
                  <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-secondary to-primary">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-white/30">
                        <AvatarImage src={avatarSrc} alt="Lee The Brain" className="object-cover" />
                        <AvatarFallback className="bg-primary text-white">
                          <Brain className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <SheetTitle className="text-white text-left">Lee "The Brain"</SheetTitle>
                        <p className="text-xs text-white/80">{t('lee.subtitle', 'Master AI Orchestrator')}</p>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  <ScrollArea ref={scrollRef} className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <div className="flex gap-1">
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('lee.placeholder', 'Ask Lee anything...')}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </SheetContent>
              </Sheet>
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
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
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
