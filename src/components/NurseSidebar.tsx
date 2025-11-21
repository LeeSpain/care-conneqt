import { Home, Users, ClipboardList, AlertTriangle, Mail, Activity, MessageSquare, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

export function NurseSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('common');

  const navigationItems = [
    { title: t('sidebar.dashboard'), url: "/dashboard/nurse", icon: Home },
    { title: t('sidebar.myMembers'), url: "/dashboard/nurse/members", icon: Users },
    { title: t('sidebar.tasks'), url: "/dashboard/nurse/tasks", icon: ClipboardList },
    { title: t('sidebar.alerts'), url: "/dashboard/nurse/alerts", icon: AlertTriangle },
    { title: t('sidebar.messages'), url: "/dashboard/nurse/messages", icon: Mail },
    { title: t('sidebar.healthMonitoring'), url: "/dashboard/nurse/health", icon: Activity },
    { title: t('sidebar.aiGuardian'), url: "/dashboard/ai-chat", icon: MessageSquare },
    { title: t('sidebar.settings'), url: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/nurse") {
      return location.pathname === "/dashboard/nurse";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Logo size="lg" variant="nurse" />
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground font-['Poppins']">
              Care Conneqt Pro
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Care Management"}
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
