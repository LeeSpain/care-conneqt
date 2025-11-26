import { Home, Users, Settings, Bot, BarChart3, Building2, MessageSquare, ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "@/components/Logo";

export function AdminSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openSections, setOpenSections] = useState<string[]>([]);

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard/admin", icon: Home },
    { 
      title: "People", 
      icon: Users,
      items: [
        { title: "All Users", url: "/dashboard/admin/users" },
        { title: "Nurses", url: "/dashboard/admin/nurses" },
        { title: "Members", url: "/dashboard/admin/members" },
        { title: "Family Carers", url: "/dashboard/admin/family-carers" },
      ]
    },
    { title: "Facilities", url: "/dashboard/admin/facilities", icon: Building2 },
    {
      title: "Catalog",
      icon: MessageSquare,
      items: [
        { title: "Products", url: "/dashboard/admin/products" },
        { title: "Pricing Plans", url: "/dashboard/admin/pricing-plans" },
      ]
    },
    { 
      title: "AI Management", 
      icon: Bot,
      items: [
        { title: "AI Agents", url: "/dashboard/admin/ai-agents" },
        { title: "AI Analytics", url: "/dashboard/admin/ai-analytics" },
        { title: "AI Guardian Chat", url: "/dashboard/admin/ai-chat" },
      ]
    },
    { 
      title: "Analytics & Reports", 
      icon: BarChart3,
      items: [
        { title: "Platform Analytics", url: "/dashboard/admin/analytics" },
        { title: "System Health", url: "/dashboard/admin/system-health" },
      ]
    },
    { 
      title: "Sales & Revenue", 
      icon: MessageSquare,
      items: [
        { title: "Clara Sales", url: "/dashboard/admin/sales" },
        { title: "Clara Analytics", url: "/dashboard/admin/clara-analytics" },
      ]
    },
    { 
      title: "Communications", 
      icon: Settings,
      items: [
        { title: "Announcements", url: "/dashboard/admin/announcements" },
        { title: "Support Tickets", url: "/dashboard/admin/support" },
      ]
    },
    { title: "System Settings", url: "/dashboard/admin/system-settings", icon: Settings },
    { title: "Integrations", url: "/dashboard/admin/integrations", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const activeSection = navigationItems.find(item => 
      item.items?.some(sub => isActive(sub.url))
    );
    if (activeSection) {
      setOpenSections(prev => [...new Set([...prev, activeSection.title])]);
    }
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
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
              {navigationItems.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      open={openSections.includes(item.title)}
                      onOpenChange={() => toggleSection(item.title)}
                    >
                      <CollapsibleTrigger className="flex items-center gap-3 w-full px-2 py-2 text-sm font-semibold !text-white hover:bg-accent/50 rounded-md cursor-pointer transition-colors">
                        <item.icon className="h-4 w-4 flex-shrink-0 !text-white" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left !text-white">{item.title}</span>
                            <ChevronDown className={`h-4 w-4 !text-white transition-transform ${openSections.includes(item.title) ? 'rotate-180' : ''}`} />
                          </>
                        )}
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent className="ml-6 space-y-1 mt-1">
                          {item.items.map((subItem: any) => (
                            <SidebarMenuButton 
                              key={subItem.url} 
                              asChild 
                              isActive={isActive(subItem.url)}
                              className="text-sm !text-primary hover:!text-primary/80"
                            >
                              <NavLink to={subItem.url} className="!text-primary hover:!text-primary/80">
                                {subItem.title}
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
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
