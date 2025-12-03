import { Home, Users, Settings, Bot, BarChart3, MessageSquare, ChevronDown, Briefcase, TrendingUp, Mail } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('dashboard-admin');
  const isCollapsed = state === "collapsed";
  const [openSections, setOpenSections] = useState<string[]>([]);

  const navigationItems = [
    { title: t('sidebar.dashboard'), url: "/dashboard/admin", icon: Home },
    {
      title: t('sidebar.people'),
      icon: Users,
      items: [
        { title: t('sidebar.allUsers'), url: "/dashboard/admin/users" },
        { title: t('sidebar.staff'), url: "/dashboard/admin/staff" },
        { title: t('sidebar.members'), url: "/dashboard/admin/members" },
        { title: t('sidebar.familyCarers'), url: "/dashboard/admin/family-carers" },
        { title: t('sidebar.assignmentsHub'), url: "/dashboard/admin/assignments" },
      ]
    },
    {
      title: t('sidebar.commercial'),
      icon: Briefcase,
      items: [
        { title: t('sidebar.overview'), url: "/dashboard/admin/commercial" },
        { title: t('sidebar.careFacilities'), url: "/dashboard/admin/commercial/facilities" },
        { title: t('sidebar.careCompanies'), url: "/dashboard/admin/commercial/companies" },
        { title: t('sidebar.insuranceCompanies'), url: "/dashboard/admin/commercial/insurance" },
      ]
    },
    {
      title: t('sidebar.catalog'),
      icon: MessageSquare,
      items: [
        { title: t('sidebar.products'), url: "/dashboard/admin/products" },
        { title: t('sidebar.services'), url: "/dashboard/admin/services" },
        { title: t('sidebar.pricingPlans'), url: "/dashboard/admin/pricing-plans" },
      ]
    },
    { 
      title: t('sidebar.aiManagement'), 
      icon: Bot,
      items: [
        { title: t('sidebar.aiAgents'), url: "/dashboard/admin/ai-agents" },
        { title: t('sidebar.aiAnalytics'), url: "/dashboard/admin/ai-analytics" },
        { title: t('sidebar.aiGuardianChat'), url: "/dashboard/admin/ai-chat" },
      ]
    },
    { 
      title: t('sidebar.analyticsReports'), 
      icon: BarChart3,
      items: [
        { title: t('sidebar.platformAnalytics'), url: "/dashboard/admin/analytics" },
        { title: t('sidebar.systemHealth'), url: "/dashboard/admin/system-health" },
      ]
    },
    { 
      title: t('sidebar.salesLeads'), 
      icon: TrendingUp,
      items: [
        { title: t('sidebar.leadsDashboard'), url: "/dashboard/admin/leads" },
        { title: t('sidebar.allLeads'), url: "/dashboard/admin/leads/list" },
        { title: t('sidebar.claraSessions'), url: "/dashboard/admin/clara-analytics" },
        { title: t('sidebar.orders'), url: "/dashboard/admin/sales" },
        { title: t('sidebar.registrations'), url: "/dashboard/admin/institutional-registrations" },
      ]
    },
    { 
      title: t('sidebar.communications'), 
      icon: Mail,
      items: [
        { title: t('sidebar.messages'), url: "/dashboard/admin/messages" },
        { title: t('sidebar.announcements'), url: "/dashboard/admin/announcements" },
        { title: t('sidebar.supportTickets'), url: "/dashboard/admin/support" },
      ]
    },
    { title: t('sidebar.systemSettings'), url: "/dashboard/admin/system-settings", icon: Settings },
    { title: t('sidebar.integrations'), url: "/dashboard/admin/integrations", icon: Settings },
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
            <span className="font-semibold text-lg">{t('sidebar.adminPanel')}</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.management')}</SidebarGroupLabel>
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
                              className="text-sm !text-secondary hover:!text-secondary/80"
                            >
                              <NavLink to={subItem.url} className="!text-secondary hover:!text-secondary/80">
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
            © 2025 CareConneqt
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
