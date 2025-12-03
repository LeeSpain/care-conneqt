import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { MemberSidebar } from '@/components/MemberSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ClaraHeaderChat } from '@/components/ai-agents/ClaraHeaderChat';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MemberDashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const MemberDashboardLayout = ({ children, title }: MemberDashboardLayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState<string | undefined>();

  useEffect(() => {
    const fetchMemberId = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setMemberId(data.id);
    };
    fetchMemberId();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`
    : 'U';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MemberSidebar />
        
        <div className="flex-1 flex flex-col w-full">
          <header className="sticky top-0 z-40 border-b bg-card">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger className="md:mr-2" />
              
              <div className="flex-1 flex items-center justify-center">
                <ClaraHeaderChat memberId={memberId} />
              </div>

              <LanguageSwitcher />

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.email || ''} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard/member/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/member/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
