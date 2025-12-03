import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  CreditCard, 
  Bot, 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Brain, 
  FileText, 
  Lightbulb,
  Keyboard,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminGuide = () => {
  const { t } = useTranslation('dashboard-admin');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', icon: BookOpen, label: t('adminGuide.sections.gettingStarted', 'Getting Started') },
    { id: 'dashboard', icon: LayoutDashboard, label: t('adminGuide.sections.dashboard', 'Dashboard Overview') },
    { id: 'people', icon: Users, label: t('adminGuide.sections.people', 'People Management') },
    { id: 'commercial', icon: Building2, label: t('adminGuide.sections.commercial', 'Commercial Partners') },
    { id: 'catalog', icon: Package, label: t('adminGuide.sections.catalog', 'Catalog Management') },
    { id: 'finance', icon: CreditCard, label: t('adminGuide.sections.finance', 'Finance Control Centre') },
    { id: 'ai', icon: Bot, label: t('adminGuide.sections.ai', 'AI Management') },
    { id: 'analytics', icon: BarChart3, label: t('adminGuide.sections.analytics', 'Analytics & Reports') },
    { id: 'sales', icon: TrendingUp, label: t('adminGuide.sections.sales', 'Sales & Leads') },
    { id: 'communications', icon: MessageSquare, label: t('adminGuide.sections.communications', 'Communications') },
    { id: 'system', icon: Settings, label: t('adminGuide.sections.system', 'System Configuration') },
    { id: 'lee', icon: Brain, label: t('adminGuide.sections.lee', 'LEE "The Brain"') },
    { id: 'daily-report', icon: FileText, label: t('adminGuide.sections.dailyReport', 'Daily Report') },
    { id: 'best-practices', icon: Lightbulb, label: t('adminGuide.sections.bestPractices', 'Best Practices') },
    { id: 'shortcuts', icon: Keyboard, label: t('adminGuide.sections.shortcuts', 'Keyboard Shortcuts') },
    { id: 'faq', icon: HelpCircle, label: t('adminGuide.sections.faq', 'FAQ') },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AdminDashboardLayout title={t('adminGuide.title', 'Admin Platform Guide')}>
      <div className="flex gap-6">
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {t('adminGuide.tableOfContents', 'Table of Contents')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <nav className="space-y-1 px-3 pb-4">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left",
                        activeSection === section.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8 max-w-4xl">
          {/* Hero Section */}
          <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">{t('adminGuide.version', 'v1.0')}</Badge>
              </div>
              <CardTitle className="text-2xl">{t('adminGuide.heroTitle', 'Care Conneqt Admin Platform Guide')}</CardTitle>
              <CardDescription className="text-base">
                {t('adminGuide.heroDescription', 'Your complete reference for managing the Care Conneqt platform. This guide covers all administrative functions, workflows, and best practices.')}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('adminGuide.gettingStarted.title', 'Getting Started')}
                </CardTitle>
                <CardDescription>{t('adminGuide.gettingStarted.description', 'Essential information to begin using the admin platform')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">{t('adminGuide.gettingStarted.roleTitle', 'Your Role as Administrator')}</h4>
                  <p className="text-muted-foreground text-sm">
                    {t('adminGuide.gettingStarted.roleDescription', 'As a platform administrator, you have full access to manage all aspects of Care Conneqt including users, facilities, commercial partners, finances, AI agents, and system configuration.')}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.gettingStarted.keyAreasTitle', 'Key Areas')}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { icon: Users, title: t('adminGuide.gettingStarted.areas.people', 'People'), desc: t('adminGuide.gettingStarted.areas.peopleDesc', 'Manage users, staff, members, and families') },
                      { icon: Building2, title: t('adminGuide.gettingStarted.areas.commercial', 'Commercial'), desc: t('adminGuide.gettingStarted.areas.commercialDesc', 'Facilities, care companies, insurance partners') },
                      { icon: CreditCard, title: t('adminGuide.gettingStarted.areas.finance', 'Finance'), desc: t('adminGuide.gettingStarted.areas.financeDesc', 'Revenue, subscriptions, invoices, credits') },
                      { icon: Bot, title: t('adminGuide.gettingStarted.areas.ai', 'AI'), desc: t('adminGuide.gettingStarted.areas.aiDesc', 'Configure and monitor AI agents') },
                    ].map((area) => (
                      <div key={area.title} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                        <area.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{area.title}</p>
                          <p className="text-xs text-muted-foreground">{area.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('adminGuide.gettingStarted.tipTitle', 'Pro Tip')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('adminGuide.gettingStarted.tipDescription', 'Use LEE "The Brain" in the header to execute administrative tasks using natural language commands. Just click on LEE and ask what you need!')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  {t('adminGuide.dashboard.title', 'Dashboard Overview')}
                </CardTitle>
                <CardDescription>{t('adminGuide.dashboard.description', 'Understanding your CEO control center')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.dashboard.intro', 'The admin dashboard provides executive-level visibility into all platform operations at a glance.')}
                </p>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.dashboard.widgetsTitle', 'Dashboard Widgets')}</h4>
                  <div className="space-y-3">
                    {[
                      { title: t('adminGuide.dashboard.widgets.mrr', 'MRR/ARR Cards'), desc: t('adminGuide.dashboard.widgets.mrrDesc', 'Monthly and Annual Recurring Revenue snapshots') },
                      { title: t('adminGuide.dashboard.widgets.alerts', 'Critical Alerts'), desc: t('adminGuide.dashboard.widgets.alertsDesc', 'Pending alerts requiring immediate attention') },
                      { title: t('adminGuide.dashboard.widgets.activity', 'Activity Panels'), desc: t('adminGuide.dashboard.widgets.activityDesc', 'Recent leads, orders, and signups') },
                      { title: t('adminGuide.dashboard.widgets.ai', 'AI Metrics'), desc: t('adminGuide.dashboard.widgets.aiDesc', 'Conversation counts, satisfaction scores, escalations') },
                      { title: t('adminGuide.dashboard.widgets.health', 'System Health'), desc: t('adminGuide.dashboard.widgets.healthDesc', 'Platform status and integration health') },
                    ].map((widget, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <span className="font-medium text-sm">{widget.title}:</span>
                          <span className="text-sm text-muted-foreground ml-1">{widget.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* People Management */}
          <section id="people" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t('adminGuide.people.title', 'People Management')}
                </CardTitle>
                <CardDescription>{t('adminGuide.people.description', 'Managing users, staff, members, and family carers')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">{t('adminGuide.people.table.feature', 'Feature')}</th>
                        <th className="text-left py-2 font-semibold">{t('adminGuide.people.table.description', 'Description')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="py-2 font-medium">{t('adminGuide.people.features.allUsers', 'All Users')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.people.features.allUsersDesc', 'View and manage all platform users')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.people.features.staff', 'Staff')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.people.features.staffDesc', 'Manage nurses and admin staff, roles, departments')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.people.features.members', 'Members')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.people.features.membersDesc', 'View and manage care recipients')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.people.features.family', 'Family Carers')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.people.features.familyDesc', 'Manage family member accounts and permissions')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.people.features.assignments', 'Assignments Hub')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.people.features.assignmentsDesc', 'Assign nurses to members, manage workloads')}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.people.commonTasksTitle', 'Common Tasks')}</h4>
                  <div className="space-y-2">
                    {[
                      t('adminGuide.people.tasks.addUser', 'Add new users via the "Add User" button on respective pages'),
                      t('adminGuide.people.tasks.editRoles', 'Edit roles and permissions through user profile settings'),
                      t('adminGuide.people.tasks.deactivate', 'Deactivate accounts rather than deleting to preserve history'),
                      t('adminGuide.people.tasks.assign', 'Use Assignments Hub for nurse-member workload balancing'),
                    ].map((task, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Commercial Partners */}
          <section id="commercial" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t('adminGuide.commercial.title', 'Commercial Partners')}
                </CardTitle>
                <CardDescription>{t('adminGuide.commercial.description', 'Managing B2B relationships')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { title: t('adminGuide.commercial.types.facilities', 'Care Facilities'), desc: t('adminGuide.commercial.types.facilitiesDesc', 'Nursing homes, assisted living, residential care') },
                    { title: t('adminGuide.commercial.types.companies', 'Care Companies'), desc: t('adminGuide.commercial.types.companiesDesc', 'Home care agencies, domiciliary services') },
                    { title: t('adminGuide.commercial.types.insurance', 'Insurance'), desc: t('adminGuide.commercial.types.insuranceDesc', 'Health and care insurance partners') },
                  ].map((type) => (
                    <div key={type.title} className="p-4 border rounded-lg">
                      <h5 className="font-semibold text-sm mb-1">{type.title}</h5>
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.commercial.management', 'Each partner type has dedicated management pages where you can add, edit, and view details including staff, clients/residents, and financial tracking.')}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Catalog Management */}
          <section id="catalog" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t('adminGuide.catalog.title', 'Catalog Management')}
                </CardTitle>
                <CardDescription>{t('adminGuide.catalog.description', 'Managing products, services, and pricing')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Package className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('adminGuide.catalog.products.title', 'Products (Devices)')}</p>
                      <p className="text-xs text-muted-foreground">{t('adminGuide.catalog.products.desc', 'Physical devices like smartwatches, medication dispensers, sensors')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Settings className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('adminGuide.catalog.services.title', 'Services')}</p>
                      <p className="text-xs text-muted-foreground">{t('adminGuide.catalog.services.desc', 'Service add-ons like nurse support, family dashboard, emergency response')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('adminGuide.catalog.pricing.title', 'Pricing Plans')}</p>
                      <p className="text-xs text-muted-foreground">{t('adminGuide.catalog.pricing.desc', 'Subscription plans with bundled products and services')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Finance Control Centre */}
          <section id="finance" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {t('adminGuide.finance.title', 'Finance Control Centre')}
                </CardTitle>
                <CardDescription>{t('adminGuide.finance.description', 'Complete financial management')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">{t('adminGuide.finance.table.area', 'Area')}</th>
                        <th className="text-left py-2 font-semibold">{t('adminGuide.finance.table.purpose', 'Purpose')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="py-2 font-medium">{t('adminGuide.finance.areas.dashboard', 'Revenue Dashboard')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.finance.areas.dashboardDesc', 'MRR, ARR, revenue by customer segment')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.finance.areas.subscriptions', 'Subscriptions')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.finance.areas.subscriptionsDesc', 'Active subscription management')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.finance.areas.invoices', 'Invoices')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.finance.areas.invoicesDesc', 'Invoice generation and tracking')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.finance.areas.transactions', 'Transactions')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.finance.areas.transactionsDesc', 'Payment history and details')}</td></tr>
                      <tr><td className="py-2 font-medium">{t('adminGuide.finance.areas.credits', 'Credits & Refunds')}</td><td className="py-2 text-muted-foreground">{t('adminGuide.finance.areas.creditsDesc', 'Issue credits, process refunds')}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{t('adminGuide.finance.noteTitle', 'Important')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('adminGuide.finance.noteDescription', 'Finance data is segmented by customer type (Member, Facility, Care Company, Insurance). Use filters to view specific segments.')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* AI Management */}
          <section id="ai" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  {t('adminGuide.ai.title', 'AI Management')}
                </CardTitle>
                <CardDescription>{t('adminGuide.ai.description', 'Configuring and monitoring AI agents')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.ai.agentsTitle', 'AI Agents')}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { name: 'Clara (Sales)', desc: t('adminGuide.ai.agents.claraSales', 'Public-facing sales assistant') },
                      { name: 'Clara (Member)', desc: t('adminGuide.ai.agents.claraMember', 'Member wellbeing companion') },
                      { name: 'Clara (Family)', desc: t('adminGuide.ai.agents.claraFamily', 'Family carer support') },
                      { name: 'Ineke (Nurse)', desc: t('adminGuide.ai.agents.ineke', 'Clinical nurse assistant') },
                      { name: 'Isabella (Facility)', desc: t('adminGuide.ai.agents.isabella', 'Facility operations assistant') },
                      { name: 'LEE (Admin)', desc: t('adminGuide.ai.agents.lee', 'Master admin orchestrator') },
                    ].map((agent) => (
                      <div key={agent.name} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Bot className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.ai.configNote', 'Each agent can be configured with custom system prompts, knowledge bases, and enabled functions via AI Agents settings.')}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Analytics & Reports */}
          <section id="analytics" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t('adminGuide.analytics.title', 'Analytics & Reports')}
                </CardTitle>
                <CardDescription>{t('adminGuide.analytics.description', 'Platform insights and monitoring')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">{t('adminGuide.analytics.platform', 'Platform Analytics')}:</span>
                      <span className="text-sm text-muted-foreground ml-1">{t('adminGuide.analytics.platformDesc', 'User growth, engagement, activity trends')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">{t('adminGuide.analytics.health', 'System Health')}:</span>
                      <span className="text-sm text-muted-foreground ml-1">{t('adminGuide.analytics.healthDesc', 'Server status, API performance, uptime')}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium text-sm">{t('adminGuide.analytics.aiAnalytics', 'AI Analytics')}:</span>
                      <span className="text-sm text-muted-foreground ml-1">{t('adminGuide.analytics.aiAnalyticsDesc', 'Conversation metrics, satisfaction scores, escalations')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sales & Leads */}
          <section id="sales" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('adminGuide.sales.title', 'Sales & Leads')}
                </CardTitle>
                <CardDescription>{t('adminGuide.sales.description', 'Managing the sales pipeline')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.sales.pipelineTitle', 'Lead Pipeline Stages')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map((stage) => (
                      <Badge key={stage} variant="outline">{stage}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.sales.sourcesTitle', 'Lead Sources')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{t('adminGuide.sales.sources.pricing', 'Personal care pricing page conversions')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{t('adminGuide.sales.sources.institutional', 'Institutional registration form submissions')}</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{t('adminGuide.sales.sources.clara', 'Clara AI conversation interactions')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Communications */}
          <section id="communications" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {t('adminGuide.communications.title', 'Communications')}
                </CardTitle>
                <CardDescription>{t('adminGuide.communications.description', 'Platform messaging and announcements')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{t('adminGuide.communications.messages.title', 'Messages')}</p>
                    <p className="text-xs text-muted-foreground">{t('adminGuide.communications.messages.desc', 'Direct messaging with users, broadcast to groups by role')}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{t('adminGuide.communications.announcements.title', 'Announcements')}</p>
                    <p className="text-xs text-muted-foreground">{t('adminGuide.communications.announcements.desc', 'Platform-wide announcements with role targeting, scheduling, expiry')}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">{t('adminGuide.communications.support.title', 'Support Tickets')}</p>
                    <p className="text-xs text-muted-foreground">{t('adminGuide.communications.support.desc', 'Customer support ticket management and resolution')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* System Configuration */}
          <section id="system" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  {t('adminGuide.system.title', 'System Configuration')}
                </CardTitle>
                <CardDescription>{t('adminGuide.system.description', 'Platform settings and integrations')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      {t('adminGuide.system.settings.title', 'System Settings')}
                    </h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>{t('adminGuide.system.settings.items.platform', 'Platform name and branding')}</li>
                      <li>{t('adminGuide.system.settings.items.language', 'Default language and timezone')}</li>
                      <li>{t('adminGuide.system.settings.items.security', 'Security policies')}</li>
                      <li>{t('adminGuide.system.settings.items.maintenance', 'Maintenance mode')}</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {t('adminGuide.system.integrations.title', 'Integrations')}
                    </h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>{t('adminGuide.system.integrations.items.stripe', 'Stripe payment processing')}</li>
                      <li>{t('adminGuide.system.integrations.items.webhooks', 'Webhook configuration')}</li>
                      <li>{t('adminGuide.system.integrations.items.api', 'API connections')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* LEE "The Brain" */}
          <section id="lee" className="scroll-mt-6">
            <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  {t('adminGuide.lee.title', 'LEE "The Brain"')}
                </CardTitle>
                <CardDescription>{t('adminGuide.lee.description', 'Your AI orchestrator assistant')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.lee.intro', 'LEE is your master AI orchestrator, capable of executing administrative tasks through natural language commands. Access LEE via the button in the header.')}
                </p>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.lee.capabilitiesTitle', 'Capabilities')}</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      t('adminGuide.lee.capabilities.read', 'Read system data and generate reports'),
                      t('adminGuide.lee.capabilities.create', 'Create and update records'),
                      t('adminGuide.lee.capabilities.schedule', 'Schedule appointments and set reminders'),
                      t('adminGuide.lee.capabilities.message', 'Send messages and notifications'),
                      t('adminGuide.lee.capabilities.leads', 'Update lead statuses'),
                      t('adminGuide.lee.capabilities.alerts', 'Manage alerts and escalations'),
                    ].map((cap, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.lee.examplesTitle', 'Example Commands')}</h4>
                  <div className="space-y-2">
                    {[
                      t('adminGuide.lee.examples.stats', '"Show me today\'s statistics"'),
                      t('adminGuide.lee.examples.schedule', '"Schedule a meeting with the nursing team for Wednesday at 3pm"'),
                      t('adminGuide.lee.examples.leads', '"Update lead status for John Smith to qualified"'),
                      t('adminGuide.lee.examples.alerts', '"Show me all critical alerts"'),
                    ].map((example, i) => (
                      <div key={i} className="p-2 bg-secondary/10 rounded text-sm font-mono">{example}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Daily Report */}
          <section id="daily-report" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('adminGuide.dailyReport.title', 'Daily Report')}
                </CardTitle>
                <CardDescription>{t('adminGuide.dailyReport.description', 'Executive daily snapshot')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.dailyReport.intro', 'The Daily Report provides a comprehensive snapshot of platform activity for the selected day. Navigate up to 7 days back to compare metrics.')}
                </p>
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.dailyReport.sectionsTitle', 'Report Sections')}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t('adminGuide.dailyReport.sections.revenue', 'Revenue metrics (orders, subscriptions)')}</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t('adminGuide.dailyReport.sections.users', 'User activity (signups, active users)')}</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t('adminGuide.dailyReport.sections.alerts', 'Alert summary and resolutions')}</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t('adminGuide.dailyReport.sections.ai', 'AI conversation metrics')}</li>
                    <li className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" />{t('adminGuide.dailyReport.sections.leads', 'Lead pipeline activity')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {t('adminGuide.bestPractices.title', 'Best Practices')}
                </CardTitle>
                <CardDescription>{t('adminGuide.bestPractices.description', 'Recommended workflows and routines')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.bestPractices.dailyTitle', 'Daily Routine')}</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>{t('adminGuide.bestPractices.daily.dashboard', 'Check dashboard for critical alerts')}</li>
                    <li>{t('adminGuide.bestPractices.daily.leads', 'Review new leads and follow-ups')}</li>
                    <li>{t('adminGuide.bestPractices.daily.tickets', 'Address pending support tickets')}</li>
                    <li>{t('adminGuide.bestPractices.daily.ai', 'Monitor AI escalations')}</li>
                  </ol>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-3">{t('adminGuide.bestPractices.weeklyTitle', 'Weekly Review')}</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>{t('adminGuide.bestPractices.weekly.analytics', 'Review platform analytics trends')}</li>
                    <li>{t('adminGuide.bestPractices.weekly.revenue', 'Analyze revenue and conversion rates')}</li>
                    <li>{t('adminGuide.bestPractices.weekly.assignments', 'Review nurse-member assignments balance')}</li>
                    <li>{t('adminGuide.bestPractices.weekly.ai', 'Check AI agent performance metrics')}</li>
                  </ol>
                </div>
                <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-info shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {t('adminGuide.bestPractices.tip', 'Use the Daily Report feature to quickly review yesterday\'s metrics and compare week-over-week trends.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Keyboard Shortcuts */}
          <section id="shortcuts" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  {t('adminGuide.shortcuts.title', 'Keyboard Shortcuts')}
                </CardTitle>
                <CardDescription>{t('adminGuide.shortcuts.description', 'Quick navigation and actions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">{t('adminGuide.shortcuts.table.shortcut', 'Shortcut')}</th>
                        <th className="text-left py-2 font-semibold">{t('adminGuide.shortcuts.table.action', 'Action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + K</kbd></td><td className="py-2 text-muted-foreground">{t('adminGuide.shortcuts.actions.search', 'Open search')}</td></tr>
                      <tr><td className="py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl + /</kbd></td><td className="py-2 text-muted-foreground">{t('adminGuide.shortcuts.actions.sidebar', 'Toggle sidebar')}</td></tr>
                      <tr><td className="py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd></td><td className="py-2 text-muted-foreground">{t('adminGuide.shortcuts.actions.close', 'Close dialogs/modals')}</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {t('adminGuide.faq.title', 'Frequently Asked Questions')}
                </CardTitle>
                <CardDescription>{t('adminGuide.faq.description', 'Common questions and answers')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { q: t('adminGuide.faq.questions.reset', 'How do I reset a user\'s password?'), a: t('adminGuide.faq.answers.reset', 'Go to People > All Users, find the user, and use the "Reset Password" option in their profile menu.') },
                  { q: t('adminGuide.faq.questions.export', 'Can I export financial reports?'), a: t('adminGuide.faq.answers.export', 'Yes, use the "Export CSV" button available on each Finance page to download data.') },
                  { q: t('adminGuide.faq.questions.ai', 'How do I configure AI agent responses?'), a: t('adminGuide.faq.answers.ai', 'Navigate to AI Management > AI Agents, select the agent, and modify the system prompt or knowledge base.') },
                  { q: t('adminGuide.faq.questions.maintenance', 'What happens in maintenance mode?'), a: t('adminGuide.faq.answers.maintenance', 'Users see a maintenance message. Admin access remains available. Enable via System Settings > Maintenance.') },
                ].map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-semibold text-sm">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                    {i < 3 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminGuide;
