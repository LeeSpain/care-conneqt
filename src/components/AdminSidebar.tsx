import { Home, Users, Settings, Bot, BarChart3, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
import { Logo } from "@/components/Logo";

export function AdminSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard/admin", icon: Home },
    { title: "User Management", url: "/dashboard/admin/users", icon: Users },
    { title: "AI Agents", url: "/dashboard/admin/ai-agents", icon: Bot },
    { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
    { title: "Facilities", url: "/dashboard/admin/facilities", icon: Building2 },
    { title: "System Settings", url: "/dashboard/admin/system-settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo size={isCollapsed ? "sm" : "md"} />
          {!isCollapsed && (
            <span className="font-semibold text-lg">Admin Panel</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground">
            © 2024 CareConneqt
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
