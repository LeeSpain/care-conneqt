import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Calendar, MessageSquare, Settings, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function FamilySidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('common');

  const navigationItems = [
    { title: t('sidebar.dashboard', 'Dashboard'), url: "/dashboard/family", icon: Home },
    { title: t('sidebar.familyMembers', 'Family Members'), url: "/dashboard/family/members", icon: Users },
    { title: t('sidebar.messages', 'Messages'), url: "/dashboard/family/messages", icon: Mail },
    { title: t('sidebar.schedule', 'Schedule'), url: "/dashboard/family/schedule", icon: Calendar },
    { title: t('sidebar.aiGuardian', 'AI Guardian'), url: "/dashboard/family/ai-chat", icon: MessageSquare },
    { title: t('sidebar.settings', 'Settings'), url: "/dashboard/family/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8" />
          {!isCollapsed && <span className="font-semibold text-lg">Conneqt</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Family Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground">
            © 2024 Conneqt Care. All rights reserved.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
