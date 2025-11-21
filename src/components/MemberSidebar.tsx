import { Home, Calendar, UserCog, Package, Users, CreditCard, MessageSquare, Settings, Activity, Heart } from "lucide-react";
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

export function MemberSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation('common');

  const navigationItems = [
    { title: t('sidebar.dashboard'), url: "/dashboard/member", icon: Home },
    { title: t('sidebar.schedule'), url: "/dashboard/member/schedule", icon: Calendar },
    { title: t('sidebar.careTeam'), url: "/dashboard/member/care-team", icon: UserCog },
    { title: t('sidebar.devices'), url: "/dashboard/member/devices", icon: Activity },
    { title: t('sidebar.family'), url: "/dashboard/member/family", icon: Heart },
    { title: t('sidebar.subscription'), url: "/dashboard/member/subscriptions", icon: CreditCard },
    { title: t('sidebar.aiGuardian'), url: "/dashboard/ai-chat", icon: MessageSquare },
    { title: t('sidebar.settings'), url: "/dashboard/member/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/member") {
      return location.pathname === "/dashboard/member";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Logo size="lg" />
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
            {!isCollapsed && "My Care"}
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
