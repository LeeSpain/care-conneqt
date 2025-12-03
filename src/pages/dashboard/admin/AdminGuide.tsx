import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Shield,
  Search,
  Printer,
  Clock,
  Target,
  Zap,
  GraduationCap,
  ArrowRight,
  Star,
  Play,
  Lock,
  Database,
  Workflow,
  Calendar,
  Activity,
  DollarSign,
  Home,
  Briefcase,
  Heart,
  Cog,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminGuide = () => {
  const { t } = useTranslation('dashboard-admin');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const sections = [
    { id: 'getting-started', icon: BookOpen, labelKey: 'adminGuide.sections.gettingStarted', categoryKey: 'adminGuide.categories.introduction' },
    { id: 'dashboard', icon: LayoutDashboard, labelKey: 'adminGuide.sections.dashboard', categoryKey: 'adminGuide.categories.introduction' },
    { id: 'people', icon: Users, labelKey: 'adminGuide.sections.people', categoryKey: 'adminGuide.categories.coreFeatures' },
    { id: 'commercial', icon: Building2, labelKey: 'adminGuide.sections.commercial', categoryKey: 'adminGuide.categories.coreFeatures' },
    { id: 'catalog', icon: Package, labelKey: 'adminGuide.sections.catalog', categoryKey: 'adminGuide.categories.coreFeatures' },
    { id: 'finance', icon: CreditCard, labelKey: 'adminGuide.sections.finance', categoryKey: 'adminGuide.categories.coreFeatures' },
    { id: 'ai', icon: Bot, labelKey: 'adminGuide.sections.ai', categoryKey: 'adminGuide.categories.advanced' },
    { id: 'analytics', icon: BarChart3, labelKey: 'adminGuide.sections.analytics', categoryKey: 'adminGuide.categories.advanced' },
    { id: 'sales', icon: TrendingUp, labelKey: 'adminGuide.sections.sales', categoryKey: 'adminGuide.categories.advanced' },
    { id: 'communications', icon: MessageSquare, labelKey: 'adminGuide.sections.communications', categoryKey: 'adminGuide.categories.advanced' },
    { id: 'system', icon: Settings, labelKey: 'adminGuide.sections.system', categoryKey: 'adminGuide.categories.administration' },
    { id: 'security', icon: Shield, labelKey: 'adminGuide.sections.security', categoryKey: 'adminGuide.categories.administration' },
    { id: 'lee', icon: Brain, labelKey: 'adminGuide.sections.lee', categoryKey: 'adminGuide.categories.tools' },
    { id: 'daily-report', icon: FileText, labelKey: 'adminGuide.sections.dailyReport', categoryKey: 'adminGuide.categories.tools' },
    { id: 'workflows', icon: Workflow, labelKey: 'adminGuide.sections.workflows', categoryKey: 'adminGuide.categories.tools' },
    { id: 'best-practices', icon: Lightbulb, labelKey: 'adminGuide.sections.bestPractices', categoryKey: 'adminGuide.categories.reference' },
    { id: 'shortcuts', icon: Keyboard, labelKey: 'adminGuide.sections.shortcuts', categoryKey: 'adminGuide.categories.reference' },
    { id: 'glossary', icon: BookOpen, labelKey: 'adminGuide.sections.glossary', categoryKey: 'adminGuide.categories.reference' },
    { id: 'faq', icon: HelpCircle, labelKey: 'adminGuide.sections.faq', categoryKey: 'adminGuide.categories.reference' },
  ];

  const categoryKeys = [
    'adminGuide.categories.introduction',
    'adminGuide.categories.coreFeatures',
    'adminGuide.categories.advanced',
    'adminGuide.categories.administration',
    'adminGuide.categories.tools',
    'adminGuide.categories.reference'
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(s => 
      t(s.labelKey).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, t]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    if (!expandedSections.includes(id)) {
      setExpandedSections([...expandedSections, id]);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const QuickNavCard = ({ icon: Icon, titleKey, descKey, onClick }: { icon: any, titleKey: string, descKey: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="group p-4 border rounded-xl bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 text-left"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{t(titleKey)}</h4>
          <p className="text-xs text-muted-foreground mt-1">{t(descKey)}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );

  const StepCard = ({ number, titleKey, descKey, tipKeys }: { number: number, titleKey: string, descKey: string, tipKeys?: string[] }) => (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {number}
      </div>
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border last:hidden" />
      <div className="space-y-2">
        <h4 className="font-semibold">{t(titleKey)}</h4>
        <p className="text-sm text-muted-foreground">{t(descKey)}</p>
        {tipKeys && tipKeys.length > 0 && (
          <div className="mt-3 space-y-1">
            {tipKeys.map((tipKey, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{t(tipKey)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const FeatureTable = ({ features }: { features: { nameKey: string, descKey: string, path: string }[] }) => (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left py-3 px-4 font-semibold">{t('adminGuide.table.feature')}</th>
            <th className="text-left py-3 px-4 font-semibold">{t('adminGuide.table.description')}</th>
            <th className="text-left py-3 px-4 font-semibold">{t('adminGuide.table.path')}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {features.map((f, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4 font-medium">{t(f.nameKey)}</td>
              <td className="py-3 px-4 text-muted-foreground">{t(f.descKey)}</td>
              <td className="py-3 px-4">
                <code className="text-xs bg-muted px-2 py-1 rounded">{f.path}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const InfoBox = ({ type, titleKey, children }: { type: 'tip' | 'warning' | 'info' | 'success', titleKey: string, children: React.ReactNode }) => {
    const styles = {
      tip: { bg: 'bg-primary/5', border: 'border-primary/20', icon: Lightbulb, iconColor: 'text-primary' },
      warning: { bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle, iconColor: 'text-warning' },
      info: { bg: 'bg-info/10', border: 'border-info/30', icon: Info, iconColor: 'text-info' },
      success: { bg: 'bg-success/10', border: 'border-success/30', icon: CheckCircle2, iconColor: 'text-success' },
    };
    const { bg, border, icon: Icon, iconColor } = styles[type];
    
    return (
      <div className={cn("rounded-lg p-4 border", bg, border)}>
        <div className="flex gap-3">
          <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
          <div>
            <p className="font-semibold text-sm">{t(titleKey)}</p>
            <div className="text-sm text-muted-foreground mt-1">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, titleKey, descKey, badge }: { icon: any, titleKey: string, descKey: string, badge?: string }) => (
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{t(titleKey)}</CardTitle>
            <CardDescription className="mt-1">{t(descKey)}</CardDescription>
          </div>
        </div>
        {badge && <Badge variant="outline" className="shrink-0">{badge}</Badge>}
      </div>
    </CardHeader>
  );

  return (
    <AdminDashboardLayout title={t('adminGuide.pageTitle')}>
      <div className="flex gap-6">
        {/* Sticky Table of Contents */}
        <aside className="hidden xl:block w-72 shrink-0">
          <Card className="sticky top-6 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {t('adminGuide.contents')}
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('adminGuide.searchPlaceholder')} 
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <nav className="py-2">
                  {categoryKeys.map(categoryKey => {
                    const categorySections = filteredSections.filter(s => s.categoryKey === categoryKey);
                    if (categorySections.length === 0) return null;
                    
                    return (
                      <div key={categoryKey} className="mb-2">
                        <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {t(categoryKey)}
                        </div>
                        {categorySections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left",
                              activeSection === section.id
                                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <section.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{t(section.labelKey)}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </nav>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8 max-w-5xl">
          {/* Hero Section */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">{t('adminGuide.hero.version')}</Badge>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{t('adminGuide.hero.title')}</h1>
                    <p className="text-lg text-white/80 mt-2 max-w-2xl">
                      {t('adminGuide.hero.description')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock className="h-4 w-4" />
                      <span>{t('adminGuide.hero.readTime')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <FileText className="h-4 w-4" />
                      <span>{t('adminGuide.hero.sections')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Star className="h-4 w-4" />
                      <span>{t('adminGuide.hero.lastUpdated')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6 bg-gradient-to-b from-muted/50 to-background">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                {t('adminGuide.quickNav.title')}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <QuickNavCard 
                  icon={Play} 
                  titleKey="adminGuide.quickNav.gettingStarted" 
                  descKey="adminGuide.quickNav.gettingStartedDesc" 
                  onClick={() => scrollToSection('getting-started')} 
                />
                <QuickNavCard 
                  icon={Brain} 
                  titleKey="adminGuide.quickNav.lee" 
                  descKey="adminGuide.quickNav.leeDesc" 
                  onClick={() => scrollToSection('lee')} 
                />
                <QuickNavCard 
                  icon={CreditCard} 
                  titleKey="adminGuide.quickNav.finance" 
                  descKey="adminGuide.quickNav.financeDesc" 
                  onClick={() => scrollToSection('finance')} 
                />
                <QuickNavCard 
                  icon={HelpCircle} 
                  titleKey="adminGuide.quickNav.faq" 
                  descKey="adminGuide.quickNav.faqDesc" 
                  onClick={() => scrollToSection('faq')} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={BookOpen}
                titleKey="adminGuide.gettingStarted.title"
                descKey="adminGuide.gettingStarted.description"
                badge={t('adminGuide.gettingStarted.badge')}
              />
              <CardContent className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      {t('adminGuide.gettingStarted.roleTitle')}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('adminGuide.gettingStarted.roleDescription')}
                    </p>
                    <div className="grid gap-2">
                      {[
                        { icon: Users, textKey: 'adminGuide.gettingStarted.keyAreas.users' },
                        { icon: Building2, textKey: 'adminGuide.gettingStarted.keyAreas.facilities' },
                        { icon: CreditCard, textKey: 'adminGuide.gettingStarted.keyAreas.finance' },
                        { icon: Bot, textKey: 'adminGuide.gettingStarted.keyAreas.ai' },
                        { icon: Shield, textKey: 'adminGuide.gettingStarted.keyAreas.security' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <item.icon className="h-4 w-4 text-primary" />
                          <span>{t(item.textKey)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-primary" />
                      {t('adminGuide.gettingStarted.architectureTitle')}
                    </h4>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="space-y-3 text-sm">
                        {[
                          { color: 'bg-primary', labelKey: 'adminGuide.gettingStarted.architecture.frontend', valueKey: 'adminGuide.gettingStarted.architecture.frontendValue' },
                          { color: 'bg-secondary', labelKey: 'adminGuide.gettingStarted.architecture.backend', valueKey: 'adminGuide.gettingStarted.architecture.backendValue' },
                          { color: 'bg-success', labelKey: 'adminGuide.gettingStarted.architecture.ai', valueKey: 'adminGuide.gettingStarted.architecture.aiValue' },
                          { color: 'bg-warning', labelKey: 'adminGuide.gettingStarted.architecture.payments', valueKey: 'adminGuide.gettingStarted.architecture.paymentsValue' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={cn("w-3 h-3 rounded-full", item.color)} />
                            <span className="font-medium">{t(item.labelKey)}</span>
                            <span className="text-muted-foreground">{t(item.valueKey)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    {t('adminGuide.gettingStarted.firstSteps.title')}
                  </h4>
                  <div className="space-y-0">
                    <StepCard 
                      number={1} 
                      titleKey="adminGuide.gettingStarted.firstSteps.step1.title"
                      descKey="adminGuide.gettingStarted.firstSteps.step1.description"
                      tipKeys={['adminGuide.gettingStarted.firstSteps.step1.tip1', 'adminGuide.gettingStarted.firstSteps.step1.tip2']}
                    />
                    <StepCard 
                      number={2} 
                      titleKey="adminGuide.gettingStarted.firstSteps.step2.title"
                      descKey="adminGuide.gettingStarted.firstSteps.step2.description"
                      tipKeys={['adminGuide.gettingStarted.firstSteps.step2.tip1', 'adminGuide.gettingStarted.firstSteps.step2.tip2']}
                    />
                    <StepCard 
                      number={3} 
                      titleKey="adminGuide.gettingStarted.firstSteps.step3.title"
                      descKey="adminGuide.gettingStarted.firstSteps.step3.description"
                      tipKeys={['adminGuide.gettingStarted.firstSteps.step3.tip1', 'adminGuide.gettingStarted.firstSteps.step3.tip2']}
                    />
                    <StepCard 
                      number={4} 
                      titleKey="adminGuide.gettingStarted.firstSteps.step4.title"
                      descKey="adminGuide.gettingStarted.firstSteps.step4.description"
                      tipKeys={['adminGuide.gettingStarted.firstSteps.step4.tip1', 'adminGuide.gettingStarted.firstSteps.step4.tip2']}
                    />
                  </div>
                </div>

                <InfoBox type="tip" titleKey="adminGuide.gettingStarted.proTip.title">
                  {t('adminGuide.gettingStarted.proTip.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={LayoutDashboard}
                titleKey="adminGuide.dashboard.title"
                descKey="adminGuide.dashboard.description"
              />
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.dashboard.intro')}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      {t('adminGuide.dashboard.financial.title')}
                    </h4>
                    <div className="space-y-2">
                      {['mrr', 'arr', 'invoices', 'todayRevenue'].map((widget, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium text-sm">{t(`adminGuide.dashboard.financial.widgets.${widget}`)}</span>
                            <p className="text-xs text-muted-foreground">{t(`adminGuide.dashboard.financial.widgets.${widget}Desc`)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      {t('adminGuide.dashboard.operational.title')}
                    </h4>
                    <div className="space-y-2">
                      {['alerts', 'leads', 'aiConversations', 'health'].map((widget, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium text-sm">{t(`adminGuide.dashboard.operational.widgets.${widget}`)}</span>
                            <p className="text-xs text-muted-foreground">{t(`adminGuide.dashboard.operational.widgets.${widget}Desc`)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="info" titleKey="adminGuide.dashboard.customization.title">
                  {t('adminGuide.dashboard.customization.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* People Management */}
          <section id="people" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Users}
                titleKey="adminGuide.people.title"
                descKey="adminGuide.people.description"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { nameKey: 'adminGuide.people.features.allUsers', descKey: 'adminGuide.people.features.allUsersDesc', path: 'People → All Users' },
                  { nameKey: 'adminGuide.people.features.staff', descKey: 'adminGuide.people.features.staffDesc', path: 'People → Staff' },
                  { nameKey: 'adminGuide.people.features.members', descKey: 'adminGuide.people.features.membersDesc', path: 'People → Members' },
                  { nameKey: 'adminGuide.people.features.family', descKey: 'adminGuide.people.features.familyDesc', path: 'People → Family Carers' },
                  { nameKey: 'adminGuide.people.features.assignments', descKey: 'adminGuide.people.features.assignmentsDesc', path: 'People → Assignments Hub' },
                ]} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.people.roles.title')}</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { role: 'admin', color: 'bg-primary' },
                        { role: 'nurse', color: 'bg-secondary' },
                        { role: 'member', color: 'bg-success' },
                        { role: 'family_carer', color: 'bg-info' },
                        { role: 'facility_admin', color: 'bg-warning' },
                        { role: 'company_admin', color: 'bg-destructive' },
                        { role: 'insurance_admin', color: 'bg-muted-foreground' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", r.color)} />
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.role}</code>
                          <span className="text-muted-foreground">{t(`adminGuide.people.roles.${r.role}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.people.actions.title')}</h4>
                    <div className="space-y-2">
                      {['addUsers', 'editRoles', 'deactivate', 'bulkAssign', 'sendInvitations', 'resetPasswords'].map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{t(`adminGuide.people.actions.${action}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="warning" titleKey="adminGuide.people.warning.title">
                  {t('adminGuide.people.warning.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Commercial Partners */}
          <section id="commercial" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Building2}
                titleKey="adminGuide.commercial.title"
                descKey="adminGuide.commercial.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Home, typeKey: 'facilities' },
                    { icon: Briefcase, typeKey: 'companies' },
                    { icon: Shield, typeKey: 'insurance' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <p.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h5 className="font-semibold">{t(`adminGuide.commercial.types.${p.typeKey}.title`)}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(`adminGuide.commercial.types.${p.typeKey}.description`)}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">{t(`adminGuide.commercial.types.${p.typeKey}.path`)}</code>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{t('adminGuide.commercial.details.title')}</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {['staff', 'clients', 'financial', 'serviceArea', 'contracts', 'audit'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>{t(`adminGuide.commercial.details.${item}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Catalog Management */}
          <section id="catalog" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Package}
                titleKey="adminGuide.catalog.title"
                descKey="adminGuide.catalog.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">{t('adminGuide.catalog.products.title')}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{t('adminGuide.catalog.products.description')}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {['watches', 'dispensers', 'scales', 'pendants', 'monitors'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.catalog.products.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">{t('adminGuide.catalog.services.title')}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{t('adminGuide.catalog.services.description')}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {['familyDashboard', 'nurseSupport', 'emergency', 'coordinator', 'medication'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.catalog.services.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">{t('adminGuide.catalog.pricing.title')}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{t('adminGuide.catalog.pricing.description')}</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {['essential', 'plus', 'premium', 'pickMix', 'enterprise'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.catalog.pricing.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <InfoBox type="tip" titleKey="adminGuide.catalog.tip.title">
                  {t('adminGuide.catalog.tip.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Finance Control Centre */}
          <section id="finance" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={CreditCard}
                titleKey="adminGuide.finance.title"
                descKey="adminGuide.finance.description"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { nameKey: 'adminGuide.finance.areas.dashboard', descKey: 'adminGuide.finance.areas.dashboardDesc', path: 'Finance → Revenue Dashboard' },
                  { nameKey: 'adminGuide.finance.areas.subscriptions', descKey: 'adminGuide.finance.areas.subscriptionsDesc', path: 'Finance → Subscriptions' },
                  { nameKey: 'adminGuide.finance.areas.invoices', descKey: 'adminGuide.finance.areas.invoicesDesc', path: 'Finance → Invoices' },
                  { nameKey: 'adminGuide.finance.areas.transactions', descKey: 'adminGuide.finance.areas.transactionsDesc', path: 'Finance → Transactions' },
                  { nameKey: 'adminGuide.finance.areas.credits', descKey: 'adminGuide.finance.areas.creditsDesc', path: 'Finance → Credits & Refunds' },
                ]} />

                <InfoBox type="info" titleKey="adminGuide.finance.note.title">
                  {t('adminGuide.finance.note.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* AI Management */}
          <section id="ai" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Bot}
                titleKey="adminGuide.ai.title"
                descKey="adminGuide.ai.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { name: 'Clara Sales', roleKey: 'claraSales' },
                    { name: 'Clara Member', roleKey: 'claraMember' },
                    { name: 'Clara Family', roleKey: 'claraFamily' },
                    { name: 'Ineke', roleKey: 'ineke' },
                    { name: 'Isabella', roleKey: 'isabella' },
                    { name: 'LEE', roleKey: 'lee' },
                  ].map((agent, i) => (
                    <div key={i} className="p-3 border rounded-lg flex items-center gap-3">
                      <Bot className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{t(`adminGuide.ai.agents.${agent.roleKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <InfoBox type="tip" titleKey="adminGuide.ai.config.title">
                  {t('adminGuide.ai.config.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Analytics & Reports */}
          <section id="analytics" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={BarChart3}
                titleKey="adminGuide.analytics.title"
                descKey="adminGuide.analytics.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {['platform', 'health', 'aiAnalytics'].map((item, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">{t(`adminGuide.analytics.${item}.title`)}</h5>
                      <p className="text-xs text-muted-foreground">{t(`adminGuide.analytics.${item}.description`)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sales & Leads */}
          <section id="sales" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={TrendingUp}
                titleKey="adminGuide.sales.title"
                descKey="adminGuide.sales.description"
              />
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">{t('adminGuide.sales.pipeline.title')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((stage, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline">{t(`adminGuide.sales.pipeline.stages.${stage}`)}</Badge>
                        {i < 5 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {['pricing', 'institutional', 'clara'].map((source, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">{t(`adminGuide.sales.sources.${source}.title`)}</h5>
                      <p className="text-xs text-muted-foreground">{t(`adminGuide.sales.sources.${source}.description`)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Communications */}
          <section id="communications" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={MessageSquare}
                titleKey="adminGuide.communications.title"
                descKey="adminGuide.communications.description"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { nameKey: 'adminGuide.communications.features.messages', descKey: 'adminGuide.communications.features.messagesDesc', path: 'Communications → Messages' },
                  { nameKey: 'adminGuide.communications.features.broadcasts', descKey: 'adminGuide.communications.features.broadcastsDesc', path: 'Communications → Messages → Broadcast' },
                  { nameKey: 'adminGuide.communications.features.announcements', descKey: 'adminGuide.communications.features.announcementsDesc', path: 'Communications → Announcements' },
                  { nameKey: 'adminGuide.communications.features.support', descKey: 'adminGuide.communications.features.supportDesc', path: 'Communications → Support' },
                ]} />

                <InfoBox type="tip" titleKey="adminGuide.communications.tip.title">
                  {t('adminGuide.communications.tip.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* System Configuration */}
          <section id="system" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Settings}
                titleKey="adminGuide.system.title"
                descKey="adminGuide.system.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Cog className="h-4 w-4 text-primary" />
                      {t('adminGuide.system.settings.title')}
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['platform', 'language', 'timezone', 'dateFormat', 'email'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.system.settings.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      {t('adminGuide.system.integrations.title')}
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['stripe', 'webhooks', 'apiKeys', 'thirdParty'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.system.integrations.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Security & Compliance */}
          <section id="security" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Shield}
                titleKey="adminGuide.security.title"
                descKey="adminGuide.security.description"
                badge={t('adminGuide.security.badge')}
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      {t('adminGuide.security.features.title')}
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['rls', 'rbac', 'session', 'password', 'audit', 'encryption'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.security.features.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      {t('adminGuide.security.data.title')}
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['gdpr', 'retention', 'deletion', 'export', 'consent'].map((item, i) => (
                        <li key={i}>• {t(`adminGuide.security.data.items.${item}`)}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <InfoBox type="warning" titleKey="adminGuide.security.warning.title">
                  {t('adminGuide.security.warning.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* LEE "The Brain" */}
          <section id="lee" className="scroll-mt-6">
            <Card className="border-secondary/30 overflow-hidden">
              <div className="bg-gradient-to-r from-secondary via-secondary/90 to-primary/80 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20">
                    <Brain className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{t('adminGuide.lee.title')}</h2>
                    <p className="text-white/80">{t('adminGuide.lee.subtitle')}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.lee.intro')}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.lee.capabilities.title')}</h4>
                    <div className="space-y-2">
                      {['read', 'create', 'schedule', 'reminders', 'messages', 'leads', 'users', 'finance'].map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{t(`adminGuide.lee.capabilities.${cap}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.lee.examples.title')}</h4>
                    <div className="space-y-2">
                      {['stats', 'schedule', 'updateLead', 'sendMessage', 'alerts', 'reminder'].map((example, i) => (
                        <div key={i} className="p-2 bg-secondary/10 rounded text-sm font-mono text-xs">{t(`adminGuide.lee.examples.${example}`)}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="success" titleKey="adminGuide.lee.access.title">
                  {t('adminGuide.lee.access.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Daily Report */}
          <section id="daily-report" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={FileText}
                titleKey="adminGuide.dailyReport.title"
                descKey="adminGuide.dailyReport.description"
              />
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  {t('adminGuide.dailyReport.intro')}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.dailyReport.sections.title')}</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['revenue', 'alerts', 'activity', 'ai', 'pipeline', 'health'].map((section, i) => (
                        <li key={i}>• {t(`adminGuide.dailyReport.sections.${section}`)}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('adminGuide.dailyReport.features.title')}</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      {['navigate', 'compare', 'quickActions', 'print', 'autoRefresh'].map((feature, i) => (
                        <li key={i}>• {t(`adminGuide.dailyReport.features.${feature}`)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Workflows & Automation */}
          <section id="workflows" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Workflow}
                titleKey="adminGuide.workflows.title"
                descKey="adminGuide.workflows.description"
              />
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">{t('adminGuide.workflows.automations.title')}</h4>
                  <div className="grid gap-3">
                    {['newOrder', 'memberSignup', 'criticalAlert', 'renewal', 'aiEscalation'].map((workflow, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Badge variant="outline" className="shrink-0">{t(`adminGuide.workflows.automations.${workflow}.trigger`)}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{t(`adminGuide.workflows.automations.${workflow}.action`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Lightbulb}
                titleKey="adminGuide.bestPractices.title"
                descKey="adminGuide.bestPractices.description"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {t('adminGuide.bestPractices.daily.title')}
                    </h4>
                    <ol className="space-y-3 text-sm">
                      {['dashboard', 'dailyReport', 'leads', 'tickets', 'aiEscalations'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{i + 1}</span>
                          <span className="text-muted-foreground">{t(`adminGuide.bestPractices.daily.${item}`)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {t('adminGuide.bestPractices.weekly.title')}
                    </h4>
                    <ol className="space-y-3 text-sm">
                      {['analytics', 'revenue', 'assignments', 'aiPerformance', 'catalog'].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold shrink-0">{i + 1}</span>
                          <span className="text-muted-foreground">{t(`adminGuide.bestPractices.weekly.${item}`)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <InfoBox type="tip" titleKey="adminGuide.bestPractices.tip.title">
                  {t('adminGuide.bestPractices.tip.description')}
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Keyboard Shortcuts */}
          <section id="shortcuts" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={Keyboard}
                titleKey="adminGuide.shortcuts.title"
                descKey="adminGuide.shortcuts.description"
              />
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold">{t('adminGuide.shortcuts.table.shortcut')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('adminGuide.shortcuts.table.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { keys: ['⌘', 'K'], actionKey: 'search' },
                        { keys: ['⌘', 'B'], actionKey: 'sidebar' },
                        { keys: ['Esc'], actionKey: 'close' },
                        { keys: ['⌘', 'Enter'], actionKey: 'submit' },
                        { keys: ['⌘', '/'], actionKey: 'help' },
                      ].map((shortcut, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {shortcut.keys.map((key, j) => (
                                <kbd key={j} className="px-2 py-1 bg-muted rounded text-xs font-mono">{key}</kbd>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{t(`adminGuide.shortcuts.actions.${shortcut.actionKey}`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Glossary */}
          <section id="glossary" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={BookOpen}
                titleKey="adminGuide.glossary.title"
                descKey="adminGuide.glossary.description"
              />
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {['mrr', 'arr', 'rls', 'rbac', 'aiAgent', 'lead', 'member', 'familyCarer'].map((term, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <h5 className="font-semibold text-sm">{t(`adminGuide.glossary.terms.${term}.term`)}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{t(`adminGuide.glossary.terms.${term}.definition`)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                icon={HelpCircle}
                titleKey="adminGuide.faq.title"
                descKey="adminGuide.faq.description"
              />
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {['reset', 'export', 'ai', 'maintenance', 'roles', 'billing'].map((faq, i) => (
                    <AccordionItem key={i} value={faq}>
                      <AccordionTrigger className="text-left">{t(`adminGuide.faq.questions.${faq}`)}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {t(`adminGuide.faq.answers.${faq}`)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <Card className="bg-muted/30">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('adminGuide.footer.text')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('adminGuide.footer.contact')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminGuide;
