import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Calendar, MessageSquare, Settings } from "lucide-react";
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

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard/family", icon: Home },
    { title: "Family Members", url: "/dashboard/family/members", icon: Users },
    { title: "Schedule", url: "/dashboard/schedule", icon: Calendar },
    { title: "Messages", url: "/dashboard/care-team", icon: MessageSquare },
    { title: "Settings", url: "/dashboard/family/settings", icon: Settings },
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
