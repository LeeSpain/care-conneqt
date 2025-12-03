import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Search,
  Printer,
  ExternalLink,
  Clock,
  Target,
  Zap,
  BookMarked,
  GraduationCap,
  ArrowRight,
  Star,
  Play,
  AlertCircle,
  Globe,
  Lock,
  Database,
  Workflow,
  PhoneCall,
  Mail,
  Calendar,
  Bell,
  Activity,
  PieChart,
  DollarSign,
  UserCheck,
  Home,
  Briefcase,
  Heart,
  Stethoscope,
  ClipboardList,
  FileBarChart,
  Megaphone,
  LifeBuoy,
  Cog,
  Link2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminGuide = () => {
  const { t } = useTranslation('dashboard-admin');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const sections = [
    { id: 'getting-started', icon: BookOpen, label: 'Getting Started', category: 'Introduction' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard Overview', category: 'Introduction' },
    { id: 'people', icon: Users, label: 'People Management', category: 'Core Features' },
    { id: 'commercial', icon: Building2, label: 'Commercial Partners', category: 'Core Features' },
    { id: 'catalog', icon: Package, label: 'Catalog Management', category: 'Core Features' },
    { id: 'finance', icon: CreditCard, label: 'Finance Control Centre', category: 'Core Features' },
    { id: 'ai', icon: Bot, label: 'AI Management', category: 'Advanced' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics & Reports', category: 'Advanced' },
    { id: 'sales', icon: TrendingUp, label: 'Sales & Leads', category: 'Advanced' },
    { id: 'communications', icon: MessageSquare, label: 'Communications', category: 'Advanced' },
    { id: 'system', icon: Settings, label: 'System Configuration', category: 'Administration' },
    { id: 'security', icon: Shield, label: 'Security & Compliance', category: 'Administration' },
    { id: 'lee', icon: Brain, label: 'LEE "The Brain"', category: 'Tools' },
    { id: 'daily-report', icon: FileText, label: 'Daily Report', category: 'Tools' },
    { id: 'workflows', icon: Workflow, label: 'Workflows & Automation', category: 'Tools' },
    { id: 'best-practices', icon: Lightbulb, label: 'Best Practices', category: 'Reference' },
    { id: 'shortcuts', icon: Keyboard, label: 'Keyboard Shortcuts', category: 'Reference' },
    { id: 'glossary', icon: BookMarked, label: 'Glossary', category: 'Reference' },
    { id: 'faq', icon: HelpCircle, label: 'FAQ', category: 'Reference' },
  ];

  const categories = ['Introduction', 'Core Features', 'Advanced', 'Administration', 'Tools', 'Reference'];

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(s => 
      s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const QuickNavCard = ({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="group p-4 border rounded-xl bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 text-left"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );

  const StepCard = ({ number, title, description, tips }: { number: number, title: string, description: string, tips?: string[] }) => (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {number}
      </div>
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border last:hidden" />
      <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        {tips && tips.length > 0 && (
          <div className="mt-3 space-y-1">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const FeatureTable = ({ features }: { features: { name: string, description: string, path: string }[] }) => (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left py-3 px-4 font-semibold">Feature</th>
            <th className="text-left py-3 px-4 font-semibold">Description</th>
            <th className="text-left py-3 px-4 font-semibold">Navigation Path</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {features.map((f, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4 font-medium">{f.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{f.description}</td>
              <td className="py-3 px-4">
                <code className="text-xs bg-muted px-2 py-1 rounded">{f.path}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const InfoBox = ({ type, title, children }: { type: 'tip' | 'warning' | 'info' | 'success', title: string, children: React.ReactNode }) => {
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
            <p className="font-semibold text-sm">{title}</p>
            <div className="text-sm text-muted-foreground mt-1">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ id, icon: Icon, title, description, badge }: { id: string, icon: any, title: string, description: string, badge?: string }) => (
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
        {badge && <Badge variant="outline" className="shrink-0">{badge}</Badge>}
      </div>
    </CardHeader>
  );

  return (
    <AdminDashboardLayout title="Admin Platform Guide">
      <div className="flex gap-6">
        {/* Sticky Table of Contents */}
        <aside className="hidden xl:block w-72 shrink-0">
          <Card className="sticky top-6 overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Contents
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.print()}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search guide..." 
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <nav className="py-2">
                  {categories.map(category => {
                    const categorySections = filteredSections.filter(s => s.category === category);
                    if (categorySections.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-2">
                        <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
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
                            <span className="truncate">{section.label}</span>
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
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">Version 2.0</Badge>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Care Conneqt Admin Platform Guide</h1>
                    <p className="text-lg text-white/80 mt-2 max-w-2xl">
                      Your comprehensive reference for mastering the Care Conneqt platform. From basic operations to advanced configurations, everything you need is here.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Clock className="h-4 w-4" />
                      <span>~45 min read</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <FileText className="h-4 w-4" />
                      <span>19 sections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Star className="h-4 w-4" />
                      <span>Last updated: Dec 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6 bg-gradient-to-b from-muted/50 to-background">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Quick Navigation
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <QuickNavCard 
                  icon={Play} 
                  title="Getting Started" 
                  description="New to the platform? Start here" 
                  onClick={() => scrollToSection('getting-started')} 
                />
                <QuickNavCard 
                  icon={Brain} 
                  title="LEE AI Assistant" 
                  description="Use natural language commands" 
                  onClick={() => scrollToSection('lee')} 
                />
                <QuickNavCard 
                  icon={CreditCard} 
                  title="Finance Centre" 
                  description="Revenue, invoices, subscriptions" 
                  onClick={() => scrollToSection('finance')} 
                />
                <QuickNavCard 
                  icon={HelpCircle} 
                  title="FAQ" 
                  description="Common questions answered" 
                  onClick={() => scrollToSection('faq')} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="getting-started"
                icon={BookOpen}
                title="Getting Started"
                description="Essential information to begin using the admin platform effectively"
                badge="Start Here"
              />
              <CardContent className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Your Role as Administrator
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      As a platform administrator, you have <strong>full access</strong> to manage all aspects of Care Conneqt. This includes user management, facility oversight, financial operations, AI configuration, and system settings. Your decisions directly impact the platform's operation and user experience.
                    </p>
                    <div className="grid gap-2">
                      {[
                        { icon: Users, text: 'Manage all users, staff, and members' },
                        { icon: Building2, text: 'Oversee facilities and commercial partners' },
                        { icon: CreditCard, text: 'Control financial operations and billing' },
                        { icon: Bot, text: 'Configure AI agents and automation' },
                        { icon: Shield, text: 'Ensure security and compliance' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <item.icon className="h-4 w-4 text-primary" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-primary" />
                      Platform Architecture
                    </h4>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="font-medium">Frontend</span>
                          <span className="text-muted-foreground">React + TypeScript</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-secondary" />
                          <span className="font-medium">Backend</span>
                          <span className="text-muted-foreground">Supabase (PostgreSQL)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-success" />
                          <span className="font-medium">AI</span>
                          <span className="text-muted-foreground">Multiple specialized agents</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-warning" />
                          <span className="font-medium">Payments</span>
                          <span className="text-muted-foreground">Stripe integration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" />
                    First Steps (Recommended Order)
                  </h4>
                  <div className="space-y-0">
                    <StepCard 
                      number={1} 
                      title="Explore the Dashboard"
                      description="Familiarize yourself with the main dashboard. Review the MRR/ARR cards, check any pending alerts, and understand the activity panels showing recent leads, orders, and signups."
                      tips={['Click on any metric card to drill down', 'Use the Daily Report button for executive summaries']}
                    />
                    <StepCard 
                      number={2} 
                      title="Review Current Users"
                      description="Navigate to People → All Users to see who has access to the platform. Understand the different roles (admin, nurse, member, family_carer, facility_admin, company_admin, insurance_admin)."
                      tips={['Filter users by role to understand distribution', 'Check for any pending invitations']}
                    />
                    <StepCard 
                      number={3} 
                      title="Configure AI Agents"
                      description="Visit AI Management → AI Agents to review and customize the AI assistants. Each agent serves a specific purpose - Clara for members, Ineke for nurses, Isabella for facilities, and LEE for you."
                      tips={['Update system prompts to match your organization tone', 'Review and enable relevant functions for each agent']}
                    />
                    <StepCard 
                      number={4} 
                      title="Set Up Integrations"
                      description="Go to System Settings → Integrations to configure Stripe for payments. Ensure webhooks are properly set up for real-time payment processing."
                      tips={['Test payment flow in Stripe test mode first', 'Verify webhook endpoints are receiving events']}
                    />
                  </div>
                </div>

                <InfoBox type="tip" title="Pro Tip: Use LEE for Everything">
                  LEE "The Brain" is your AI orchestrator. Instead of navigating through menus, just click on LEE in the header and ask what you need. For example: "Show me all critical alerts" or "Schedule a meeting with the nursing team for tomorrow at 2pm". LEE can execute over 36 different administrative actions!
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Dashboard Overview */}
          <section id="dashboard" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="dashboard"
                icon={LayoutDashboard}
                title="Dashboard Overview"
                description="Understanding your CEO control center and key metrics"
              />
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  The admin dashboard is designed as an executive control center, providing real-time visibility into all platform operations. Every widget is clickable and leads to more detailed information.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Financial Widgets
                    </h4>
                    <div className="space-y-2">
                      {[
                        { title: 'MRR Card', desc: 'Monthly Recurring Revenue with trend indicator' },
                        { title: 'ARR Card', desc: 'Annual Recurring Revenue projection' },
                        { title: 'Outstanding Invoices', desc: 'Unpaid invoices requiring attention' },
                        { title: 'Today\'s Revenue', desc: 'Real-time revenue for current day' },
                      ].map((w, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium text-sm">{w.title}</span>
                            <p className="text-xs text-muted-foreground">{w.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Operational Widgets
                    </h4>
                    <div className="space-y-2">
                      {[
                        { title: 'Critical Alerts', desc: 'Urgent alerts needing immediate action' },
                        { title: 'Recent Leads', desc: 'Latest sales leads from all sources' },
                        { title: 'AI Conversations', desc: 'Today\'s AI interactions with satisfaction scores' },
                        { title: 'System Health', desc: 'Platform uptime and integration status' },
                      ].map((w, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium text-sm">{w.title}</span>
                            <p className="text-xs text-muted-foreground">{w.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="info" title="Dashboard Customization">
                  The dashboard automatically adjusts based on the time of day and shows relevant greeting messages. Critical alerts always appear prominently regardless of other content. Widget data refreshes every 30 seconds for real-time accuracy.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* People Management */}
          <section id="people" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="people"
                icon={Users}
                title="People Management"
                description="Comprehensive user, staff, and member administration"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { name: 'All Users', description: 'Complete user directory with search and filters', path: 'People → All Users' },
                  { name: 'Staff', description: 'Nurses and admin personnel management', path: 'People → Staff' },
                  { name: 'Members', description: 'Care recipient profiles and subscriptions', path: 'People → Members' },
                  { name: 'Family Carers', description: 'Family member accounts linked to members', path: 'People → Family Carers' },
                  { name: 'Assignments Hub', description: 'Nurse-member assignment workload balancing', path: 'People → Assignments Hub' },
                ]} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">User Roles Explained</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { role: 'admin', desc: 'Full platform access (you)', color: 'bg-primary' },
                        { role: 'nurse', desc: 'Care providers managing members', color: 'bg-secondary' },
                        { role: 'member', desc: 'Care recipients using services', color: 'bg-success' },
                        { role: 'family_carer', desc: 'Family members monitoring loved ones', color: 'bg-info' },
                        { role: 'facility_admin', desc: 'Care facility administrators', color: 'bg-warning' },
                        { role: 'company_admin', desc: 'Care company managers', color: 'bg-destructive' },
                        { role: 'insurance_admin', desc: 'Insurance company staff', color: 'bg-muted-foreground' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", r.color)} />
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.role}</code>
                          <span className="text-muted-foreground">{r.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Common Actions</h4>
                    <div className="space-y-2">
                      {[
                        'Add users via "Add User" button on each page',
                        'Edit roles through user profile dropdown',
                        'Deactivate (don\'t delete) to preserve audit trail',
                        'Bulk assign nurses via Assignments Hub',
                        'Send invitations to new family carers',
                        'Reset passwords from user profile menu',
                      ].map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="warning" title="Important: Account Deletion">
                  Never delete user accounts unless absolutely necessary. Deactivation preserves all historical data, audit trails, and maintains data integrity for compliance. Deleted accounts cannot be recovered and may cause orphaned records.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Commercial Partners */}
          <section id="commercial" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="commercial"
                icon={Building2}
                title="Commercial Partners"
                description="Managing B2B relationships with facilities, companies, and insurers"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Home, title: 'Care Facilities', desc: 'Nursing homes, assisted living facilities, residential care centers. Manage residents, staff, rooms, and facility-specific billing.', path: 'Commercial → Care Facilities' },
                    { icon: Briefcase, title: 'Care Companies', desc: 'Home care agencies, domiciliary services, care providers. Track clients, assign carers, manage service areas.', path: 'Commercial → Care Companies' },
                    { icon: Shield, title: 'Insurance Companies', desc: 'Health and care insurers. Manage policies, covered members, claims processing, and premium tracking.', path: 'Commercial → Insurance' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <p.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h5 className="font-semibold">{p.title}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground">{p.desc}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">{p.path}</code>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Partner Detail Pages Include:</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      'Staff management with roles and permissions',
                      'Client/resident assignment and tracking',
                      'Financial overview and billing history',
                      'Service area and coverage configuration',
                      'Contract and subscription management',
                      'Activity logs and audit trail',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>{item}</span>
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
                id="catalog"
                icon={Package}
                title="Catalog Management"
                description="Products, services, and pricing plan configuration"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">Products (Devices)</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Physical devices shipped to members:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Vivago smartwatches</li>
                      <li>• Dosell medication dispensers</li>
                      <li>• Smart scales & thermometers</li>
                      <li>• SOS pendants & fall detectors</li>
                      <li>• Health monitors</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">Services (Add-ons)</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Value-added services for members:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Family dashboard access</li>
                      <li>• 24/7 nurse support</li>
                      <li>• Emergency response</li>
                      <li>• Care coordinator</li>
                      <li>• Medication management</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">Pricing Plans</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Subscription plan bundles:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Essential (basic monitoring)</li>
                      <li>• Plus (with family access)</li>
                      <li>• Premium (full features)</li>
                      <li>• Pick & Mix (custom)</li>
                      <li>• Enterprise (facilities)</li>
                    </ul>
                  </div>
                </div>

                <InfoBox type="tip" title="Adding New Products">
                  When adding products, ensure you upload high-quality images (recommended 800x600px), write compelling descriptions, and set accurate pricing. Products appear on the public pricing page immediately after activation.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Finance Control Centre */}
          <section id="finance" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="finance"
                icon={CreditCard}
                title="Finance Control Centre"
                description="Complete revenue tracking, billing, and financial operations"
                badge="Critical"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { name: 'Revenue Dashboard', description: 'MRR, ARR, and revenue breakdown by customer segment', path: 'Finance → Dashboard' },
                  { name: 'Subscriptions', description: 'Active subscription management and renewals', path: 'Finance → Subscriptions' },
                  { name: 'Invoices', description: 'Invoice generation, tracking, and payment status', path: 'Finance → Invoices' },
                  { name: 'Transactions', description: 'Complete payment history with Stripe integration', path: 'Finance → Transactions' },
                  { name: 'Credits & Refunds', description: 'Issue credits, process refunds, manage disputes', path: 'Finance → Credits' },
                  { name: 'Financial Reports', description: 'Exportable reports for accounting and audits', path: 'Finance → Reports' },
                ]} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Customer Segments</h4>
                    <p className="text-sm text-muted-foreground mb-3">Revenue is tracked separately for each customer type:</p>
                    <div className="space-y-2">
                      {[
                        { type: 'Members', desc: 'Individual care recipients' },
                        { type: 'Facilities', desc: 'Care facility contracts' },
                        { type: 'Care Companies', desc: 'Home care agency agreements' },
                        { type: 'Insurance', desc: 'Insurance company partnerships' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-xs">{s.type}</Badge>
                          <span className="text-muted-foreground">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Key Metrics</h4>
                    <div className="space-y-2">
                      {[
                        { metric: 'MRR', desc: 'Monthly Recurring Revenue' },
                        { metric: 'ARR', desc: 'Annual Recurring Revenue (MRR × 12)' },
                        { metric: 'Churn Rate', desc: 'Subscription cancellation rate' },
                        { metric: 'LTV', desc: 'Customer Lifetime Value' },
                        { metric: 'ARPU', desc: 'Average Revenue Per User' },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{m.metric}</code>
                          <span className="text-muted-foreground">{m.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="warning" title="Processing Refunds">
                  Refunds should be processed through the Finance → Credits page. Always document the reason. Refunds over €500 require additional verification. Stripe processes refunds within 5-10 business days to the original payment method.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* AI Management */}
          <section id="ai" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="ai"
                icon={Bot}
                title="AI Management"
                description="Configure and monitor the platform's AI agents"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Clara (Sales)', icon: Sparkles, desc: 'Public-facing sales assistant on website. Captures leads, answers product questions, guides visitors to pricing.', color: 'from-blue-500/20 to-blue-600/10' },
                    { name: 'Clara (Member)', icon: Heart, desc: 'Member wellbeing companion. Provides emotional support, explains device data, schedules nurse calls.', color: 'from-pink-500/20 to-pink-600/10' },
                    { name: 'Clara (Family)', icon: Users, desc: 'Family carer support. Explains alerts, provides member updates, connects families with care team.', color: 'from-purple-500/20 to-purple-600/10' },
                    { name: 'Ineke (Nurse)', icon: Stethoscope, desc: 'Clinical nurse assistant. Provides medical context, manages clinical notes, handles escalations.', color: 'from-green-500/20 to-green-600/10' },
                    { name: 'Isabella (Facility)', icon: Building2, desc: 'Facility operations assistant. Manages facility data, staff schedules, compliance reports.', color: 'from-orange-500/20 to-orange-600/10' },
                    { name: 'LEE (Admin)', icon: Brain, desc: 'Master admin orchestrator. Executes 36+ admin actions via natural language commands.', color: 'from-primary/20 to-secondary/10' },
                  ].map((agent, i) => (
                    <div key={i} className={cn("p-4 rounded-xl border bg-gradient-to-br", agent.color)}>
                      <div className="flex items-center gap-2 mb-2">
                        <agent.icon className="h-5 w-5 text-primary" />
                        <h5 className="font-semibold text-sm">{agent.name}</h5>
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Agent Configuration Options</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      'System prompt customization',
                      'Model selection (GPT-4, Gemini)',
                      'Temperature and response style',
                      'Function enabling/disabling',
                      'Knowledge base management',
                      'Escalation rules configuration',
                      'Language preferences',
                      'Business hours settings',
                    ].map((option, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Analytics & Reports */}
          <section id="analytics" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="analytics"
                icon={BarChart3}
                title="Analytics & Reports"
                description="Platform insights, performance metrics, and reporting"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-xl">
                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-primary" />
                      Platform Analytics
                    </h5>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• User growth and registration trends</li>
                      <li>• Engagement metrics and DAU/MAU</li>
                      <li>• Feature adoption rates</li>
                      <li>• Geographic distribution</li>
                      <li>• Device and browser analytics</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <h5 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      System Health
                    </h5>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Real-time uptime monitoring</li>
                      <li>• API response times</li>
                      <li>• Database performance</li>
                      <li>• Integration health checks</li>
                      <li>• Error rate tracking</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sales & Leads */}
          <section id="sales" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="sales"
                icon={TrendingUp}
                title="Sales & Leads"
                description="Lead pipeline management and conversion tracking"
              />
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Lead Pipeline Stages</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { stage: 'New', color: 'bg-blue-500' },
                      { stage: 'Contacted', color: 'bg-yellow-500' },
                      { stage: 'Qualified', color: 'bg-orange-500' },
                      { stage: 'Proposal', color: 'bg-purple-500' },
                      { stage: 'Won', color: 'bg-green-500' },
                      { stage: 'Lost', color: 'bg-red-500' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", s.color)} />
                        <Badge variant="outline">{s.stage}</Badge>
                        {i < 5 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Pricing Page Leads</h5>
                    <p className="text-xs text-muted-foreground">Captured when visitors complete the pricing wizard checkout process</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Institutional Registrations</h5>
                    <p className="text-xs text-muted-foreground">B2B leads from the institutional care registration form</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold text-sm mb-2">Clara Conversations</h5>
                    <p className="text-xs text-muted-foreground">Leads captured from Clara AI chat interactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Communications */}
          <section id="communications" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="communications"
                icon={MessageSquare}
                title="Communications"
                description="Platform messaging, announcements, and support"
              />
              <CardContent className="space-y-6">
                <FeatureTable features={[
                  { name: 'Messages', description: 'Direct messaging with any platform user', path: 'Communications → Messages' },
                  { name: 'Broadcasts', description: 'Send messages to multiple users by role', path: 'Communications → Messages → Broadcast' },
                  { name: 'Announcements', description: 'Platform-wide announcements with targeting', path: 'Communications → Announcements' },
                  { name: 'Support Tickets', description: 'Customer support ticket management', path: 'Communications → Support' },
                ]} />

                <InfoBox type="tip" title="Broadcast Messages">
                  Use broadcasts sparingly and target appropriately. You can filter recipients by role (all nurses, all members, etc.) or by facility. Broadcast messages appear in recipients' message inbox with a special indicator.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* System Configuration */}
          <section id="system" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="system"
                icon={Settings}
                title="System Configuration"
                description="Platform-wide settings and integration management"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Cog className="h-4 w-4 text-primary" />
                      General Settings
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Platform name and branding</li>
                      <li>• Default language (EN/ES/NL)</li>
                      <li>• Timezone configuration</li>
                      <li>• Date/time format preferences</li>
                      <li>• Email notification settings</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      Integrations
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Stripe payment processing</li>
                      <li>• Webhook configuration</li>
                      <li>• API key management</li>
                      <li>• Third-party connections</li>
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
                id="security"
                icon={Shield}
                title="Security & Compliance"
                description="Data protection, access control, and regulatory compliance"
                badge="Important"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Security Features
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Row-Level Security (RLS) on all tables</li>
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Session timeout configuration</li>
                      <li>• Password policy enforcement</li>
                      <li>• Audit logging for all actions</li>
                      <li>• Data encryption at rest and in transit</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      Data Handling
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• GDPR compliant data processing</li>
                      <li>• Data retention policies</li>
                      <li>• Right to deletion support</li>
                      <li>• Data export capabilities</li>
                      <li>• Consent management</li>
                    </ul>
                  </div>
                </div>

                <InfoBox type="warning" title="Healthcare Data Compliance">
                  Care Conneqt handles sensitive healthcare data. Ensure all staff understand their responsibilities under GDPR and relevant healthcare regulations. Never share login credentials, and always use secure channels for sensitive communications.
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
                    <h2 className="text-2xl font-bold">LEE "The Brain"</h2>
                    <p className="text-white/80">Your AI-powered administrative command center</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <p className="text-sm text-muted-foreground">
                  LEE is the most powerful tool in your admin arsenal. Instead of clicking through menus, simply tell LEE what you need in natural language. LEE can execute over <strong>36 different actions</strong> across all platform areas.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">What LEE Can Do</h4>
                    <div className="space-y-2">
                      {[
                        'Read system data and generate reports',
                        'Create, update, and manage records',
                        'Schedule appointments with confirmations',
                        'Set reminders and follow-ups',
                        'Send messages and notifications',
                        'Update lead and alert statuses',
                        'Look up users by name or role',
                        'Query financial data',
                      ].map((cap, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Example Commands</h4>
                    <div className="space-y-2">
                      {[
                        '"Show me today\'s statistics"',
                        '"Schedule a meeting with nurse Sarah tomorrow at 2pm"',
                        '"Update the lead for John Smith to qualified"',
                        '"Send a message to all facility admins about the new update"',
                        '"What are the current critical alerts?"',
                        '"Create a reminder to follow up with ABC Facility next Monday"',
                      ].map((cmd, i) => (
                        <div key={i} className="p-2 bg-secondary/10 rounded text-sm font-mono text-xs">{cmd}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <InfoBox type="success" title="Access LEE Anytime">
                  LEE is always available in the admin header bar. Click the LEE button to open the chat panel. Your conversation persists during your session, so you can refer back to previous queries and results.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Daily Report */}
          <section id="daily-report" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="daily-report"
                icon={FileText}
                title="Daily Report"
                description="Executive daily snapshot with historical comparison"
              />
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  The Daily Report provides a comprehensive executive summary of platform activity. Access it via the "Daily Report" button in the admin header.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-3">Report Sections</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Revenue snapshot (today, MRR, ARR)</li>
                      <li>• Critical alerts summary</li>
                      <li>• Activity metrics (leads, orders, signups)</li>
                      <li>• AI conversation analytics</li>
                      <li>• Pipeline overview</li>
                      <li>• Operational health indicators</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Navigate up to 7 days back</li>
                      <li>• Compare day-over-day metrics</li>
                      <li>• Quick actions for common tasks</li>
                      <li>• Print-friendly format</li>
                      <li>• Auto-refresh on current day</li>
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
                id="workflows"
                icon={Workflow}
                title="Workflows & Automation"
                description="Automated processes and system triggers"
              />
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Built-in Automations</h4>
                  <div className="grid gap-3">
                    {[
                      { trigger: 'New Order', action: 'Creates lead, sends confirmation email, notifies admin' },
                      { trigger: 'Member Signup', action: 'Creates profile, triggers onboarding flow, assigns nurse' },
                      { trigger: 'Critical Alert', action: 'Notifies assigned nurse, escalates after timeout' },
                      { trigger: 'Subscription Renewal', action: 'Generates invoice, processes payment, sends receipt' },
                      { trigger: 'AI Escalation', action: 'Creates support ticket, notifies human staff' },
                    ].map((w, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Badge variant="outline" className="shrink-0">{w.trigger}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">{w.action}</span>
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
                id="best-practices"
                icon={Lightbulb}
                title="Best Practices"
                description="Recommended workflows and administrative routines"
              />
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Daily Routine (10-15 min)
                    </h4>
                    <ol className="space-y-3 text-sm">
                      {[
                        'Check dashboard for critical alerts',
                        'Review the Daily Report',
                        'Process new leads and follow-ups',
                        'Address pending support tickets',
                        'Review AI escalations',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">{i + 1}</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Weekly Review (30-45 min)
                    </h4>
                    <ol className="space-y-3 text-sm">
                      {[
                        'Analyze platform analytics trends',
                        'Review revenue and conversion metrics',
                        'Check nurse-member assignment balance',
                        'Evaluate AI agent performance',
                        'Update pricing or catalog if needed',
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold shrink-0">{i + 1}</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <InfoBox type="tip" title="Weekly Tip">
                  Block 30 minutes every Friday afternoon for weekly review. Use the Daily Report's historical navigation to compare the week's metrics against the previous week. This helps identify trends before they become problems.
                </InfoBox>
              </CardContent>
            </Card>
          </section>

          {/* Keyboard Shortcuts */}
          <section id="shortcuts" className="scroll-mt-6">
            <Card>
              <SectionHeader 
                id="shortcuts"
                icon={Keyboard}
                title="Keyboard Shortcuts"
                description="Quick navigation and productivity shortcuts"
              />
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-semibold w-1/3">Shortcut</th>
                        <th className="text-left py-3 px-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { keys: ['Ctrl', 'K'], action: 'Open global search' },
                        { keys: ['Ctrl', '/'], action: 'Toggle sidebar' },
                        { keys: ['Esc'], action: 'Close dialogs and modals' },
                        { keys: ['Ctrl', 'Shift', 'L'], action: 'Open LEE assistant' },
                        { keys: ['Ctrl', 'D'], action: 'Open Daily Report' },
                        { keys: ['Ctrl', '.'], action: 'Quick actions menu' },
                      ].map((s, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {s.keys.map((key, j) => (
                                <span key={j}>
                                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{key}</kbd>
                                  {j < s.keys.length - 1 && <span className="mx-1 text-muted-foreground">+</span>}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{s.action}</td>
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
                id="glossary"
                icon={BookMarked}
                title="Glossary"
                description="Key terms and definitions"
              />
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { term: 'MRR', def: 'Monthly Recurring Revenue - total predictable revenue per month from subscriptions' },
                    { term: 'ARR', def: 'Annual Recurring Revenue - MRR multiplied by 12' },
                    { term: 'Lead', def: 'A potential customer who has shown interest in the platform' },
                    { term: 'Member', def: 'A care recipient using Care Conneqt services' },
                    { term: 'Family Carer', def: 'A family member linked to a member with monitoring access' },
                    { term: 'Facility', def: 'A care facility (nursing home, assisted living) using the platform' },
                    { term: 'RLS', def: 'Row-Level Security - database access control ensuring users only see their data' },
                    { term: 'Escalation', def: 'When an AI conversation is transferred to human staff' },
                    { term: 'Churn', def: 'Rate at which customers cancel subscriptions' },
                    { term: 'LTV', def: 'Lifetime Value - total revenue expected from a customer relationship' },
                  ].map((g, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <dt className="font-semibold text-sm">{g.term}</dt>
                      <dd className="text-sm text-muted-foreground mt-1">{g.def}</dd>
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
                id="faq"
                icon={HelpCircle}
                title="Frequently Asked Questions"
                description="Common questions and detailed answers"
              />
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    { q: 'How do I reset a user\'s password?', a: 'Navigate to People → All Users, find the user using the search function, click on their profile, and select "Reset Password" from the dropdown menu. The user will receive an email with reset instructions.' },
                    { q: 'Can I export financial reports?', a: 'Yes, every Finance page has an "Export CSV" button in the top right. You can export subscriptions, invoices, transactions, and credits. For comprehensive reports, use Finance → Reports.' },
                    { q: 'How do I configure AI agent responses?', a: 'Go to AI Management → AI Agents, select the agent you want to configure. You can modify the system prompt, adjust temperature settings, manage the knowledge base, and enable/disable specific functions.' },
                    { q: 'What happens in maintenance mode?', a: 'Users see a maintenance message and cannot access the platform. Admin access remains available so you can continue working. Enable maintenance mode via System Settings → Maintenance before planned outages.' },
                    { q: 'How do I add a new care facility?', a: 'Navigate to Commercial → Care Facilities and click "Add Facility". Fill in the facility details, bed capacity, and contact information. After creation, you can add staff members and start admitting residents.' },
                    { q: 'Can I undo a refund?', a: 'No, refunds processed through Stripe are final. If a refund was made in error, you would need to create a new invoice and collect payment again from the customer.' },
                    { q: 'How do lead sources work?', a: 'Leads are automatically captured from three sources: the pricing page checkout, the institutional registration form, and Clara AI conversations. Each lead includes source information for tracking.' },
                    { q: 'What\'s the difference between deactivating and deleting a user?', a: 'Deactivation disables login access but preserves all data for audit trails and compliance. Deletion permanently removes the user and may cause orphaned records. Always prefer deactivation.' },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-sm font-medium">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <LifeBuoy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Need more help?</p>
                    <p className="text-xs text-muted-foreground">Contact support or use LEE for instant assistance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => scrollToSection('lee')}>
                    <Brain className="h-4 w-4 mr-2" />
                    Ask LEE
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminGuide;
