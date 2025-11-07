import { Home, Calendar, UserCog, Package, Users, CreditCard, MessageSquare, Settings, ClipboardList, AlertTriangle, Mail, Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('common');
  const { roles } = useAuth();

  const isNurse = roles.includes('nurse');

  const navigationItems = isNurse ? [
    { title: t('sidebar.dashboard'), url: "/dashboard", icon: Home },
    { title: t('sidebar.myMembers'), url: "/dashboard/nurse/members", icon: Users },
    { title: t('sidebar.tasks'), url: "/dashboard/nurse/tasks", icon: ClipboardList },
    { title: t('sidebar.alerts'), url: "/dashboard/nurse/alerts", icon: AlertTriangle },
    { title: t('sidebar.messages'), url: "/dashboard/nurse/messages", icon: Mail },
    { title: t('sidebar.healthMonitoring'), url: "/dashboard/nurse/health", icon: Activity },
    { title: t('sidebar.aiGuardian'), url: "/dashboard/ai-chat", icon: MessageSquare },
    { title: t('sidebar.settings'), url: "/settings", icon: Settings },
  ] : [
    { title: t('sidebar.dashboard'), url: "/dashboard", icon: Home },
    { title: t('sidebar.schedule'), url: "/dashboard/schedule", icon: Calendar },
    { title: t('sidebar.careTeam'), url: "/dashboard/care-team", icon: UserCog },
    { title: t('sidebar.devices'), url: "/dashboard/devices", icon: Package },
    { title: t('sidebar.family'), url: "/dashboard/family", icon: Users },
    { title: t('sidebar.subscription'), url: "/dashboard/subscriptions", icon: CreditCard },
    { title: t('sidebar.aiGuardian'), url: "/dashboard/ai-chat", icon: MessageSquare },
    { title: t('sidebar.settings'), url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, hsl(215 85% 35%), hsl(185 75% 45%))' }}
          >
            <Logo size="md" className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground font-['Poppins']">
              Care Conneqt
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={
                        active 
                          ? "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20" 
                          : "hover:bg-sidebar-accent text-sidebar-foreground/80"
                      }
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs text-sidebar-foreground/50">
            © 2025 Care Conneqt
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
