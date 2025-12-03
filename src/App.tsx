import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FloatingClara } from "@/components/FloatingClara";

// Public pages (lazy loaded for performance)
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const PersonalCare = lazy(() => import("./pages/PersonalCare"));
const Pricing = lazy(() => import("./pages/Pricing"));
const InstitutionalCare = lazy(() => import("./pages/InstitutionalCare"));
const Devices = lazy(() => import("./pages/Devices"));
const OurNurses = lazy(() => import("./pages/OurNurses"));
const Guide = lazy(() => import("./pages/Guide"));
const Conneqtivity = lazy(() => import("./pages/Conneqtivity"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

// Keep NotFound eager (small and needed for 404s)
import NotFound from "./pages/NotFound";

// Dashboard pages (lazy loaded)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MemberOnboarding = lazy(() => import("./pages/onboarding/MemberOnboarding"));

// Member pages
const MemberHome = lazy(() => import("./pages/dashboard/member/MemberHome"));
const MemberSettings = lazy(() => import("./pages/dashboard/member/MemberSettings"));
const MemberMessages = lazy(() => import("./pages/dashboard/member/MemberMessages"));
const DeviceManagement = lazy(() => import("./pages/dashboard/DeviceManagement"));
const FamilyInvitations = lazy(() => import("./pages/dashboard/FamilyInvitations"));
const SchedulePage = lazy(() => import("./pages/dashboard/SchedulePage"));
const CareTeamPage = lazy(() => import("./pages/dashboard/CareTeamPage"));
const SubscriptionsPage = lazy(() => import("./pages/dashboard/SubscriptionsPage"));

// Family Carer pages
const FamilyHome = lazy(() => import("./pages/dashboard/family/FamilyHome"));
const FamilySettings = lazy(() => import("./pages/dashboard/family/FamilySettings"));
const FamilyMembers = lazy(() => import("./pages/dashboard/family/FamilyMembers"));
const FamilyMessages = lazy(() => import("./pages/dashboard/family/FamilyMessages"));

// Facility Admin pages
const FacilityHome = lazy(() => import("./pages/dashboard/facility/FacilityHome"));
const FacilitySettings = lazy(() => import("./pages/dashboard/facility/FacilitySettings"));
const FacilityResidents = lazy(() => import("./pages/dashboard/facility/FacilityResidents"));
const FacilityStaff = lazy(() => import("./pages/dashboard/facility/FacilityStaff"));
const FacilityReports = lazy(() => import("./pages/dashboard/facility/FacilityReports"));
const FacilityMessages = lazy(() => import("./pages/dashboard/facility/FacilityMessages"));

// Nurse pages
const NurseHome = lazy(() => import("./pages/dashboard/nurse/NurseHome"));
const NurseSettings = lazy(() => import("./pages/dashboard/nurse/NurseSettings"));
const NurseMembers = lazy(() => import("./pages/dashboard/nurse/NurseMembers"));
const NurseMemberDetail = lazy(() => import("./pages/dashboard/nurse/NurseMemberDetail"));
const NurseAlerts = lazy(() => import("./pages/dashboard/nurse/NurseAlerts"));
const NurseMessages = lazy(() => import("./pages/dashboard/nurse/NurseMessages"));
const NurseHealthMonitoring = lazy(() => import("./pages/dashboard/nurse/NurseHealthMonitoring"));
const NurseTasks = lazy(() => import("./pages/dashboard/NurseTasks"));

// Admin pages
const AdminHome = lazy(() => import("./pages/dashboard/admin/AdminHome"));
const Users = lazy(() => import("./pages/dashboard/admin/Users"));
const Staff = lazy(() => import("./pages/dashboard/admin/Staff"));
const Nurses = lazy(() => import("./pages/dashboard/admin/Nurses"));
const Members = lazy(() => import("./pages/dashboard/admin/Members"));
const AssignmentsHub = lazy(() => import("./pages/dashboard/admin/AssignmentsHub"));
const FamilyCarers = lazy(() => import("./pages/dashboard/admin/FamilyCarers"));
const Facilities = lazy(() => import("./pages/dashboard/admin/Facilities"));
const FacilityDetail = lazy(() => import("./pages/dashboard/admin/FacilityDetail"));
const CommercialOverview = lazy(() => import("./pages/dashboard/admin/commercial/CommercialOverview"));
const CareCompanies = lazy(() => import("./pages/dashboard/admin/commercial/CareCompanies"));
const CompanyDetail = lazy(() => import("./pages/dashboard/admin/commercial/CompanyDetail"));
const InsuranceCompanies = lazy(() => import("./pages/dashboard/admin/commercial/InsuranceCompanies"));
const InsuranceDetail = lazy(() => import("./pages/dashboard/admin/commercial/InsuranceDetail"));
const PlatformAnalytics = lazy(() => import("./pages/dashboard/admin/PlatformAnalytics"));
const AIAnalytics = lazy(() => import("./pages/dashboard/admin/AIAnalytics"));
const Announcements = lazy(() => import("./pages/dashboard/admin/Announcements"));
const SupportTickets = lazy(() => import("./pages/dashboard/admin/SupportTickets"));
const SystemSettings = lazy(() => import("./pages/dashboard/admin/SystemSettings"));
const SystemHealth = lazy(() => import("./pages/dashboard/admin/SystemHealth"));
const UserManagement = lazy(() => import("./pages/dashboard/settings/UserManagement"));
const AIAgentsSettings = lazy(() => import("./pages/dashboard/settings/AIAgentsSettings"));
const ClaraSettings = lazy(() => import("./pages/dashboard/settings/ai-agents/ClaraSettings"));
const InekeSettings = lazy(() => import("./pages/dashboard/settings/ai-agents/InekeSettings"));
const ClaraMemberSettings = lazy(() => import("./pages/dashboard/settings/ai-agents/ClaraMemberSettings"));
const ClaraFamilySettings = lazy(() => import("./pages/dashboard/settings/ai-agents/ClaraFamilySettings"));
const IsabellaSettings = lazy(() => import("./pages/dashboard/settings/ai-agents/IsabellaSettings"));
const LeeSettings = lazy(() => import("./pages/dashboard/settings/ai-agents/LeeSettings"));
const Products = lazy(() => import("./pages/dashboard/admin/Products"));
const ProductForm = lazy(() => import("./pages/dashboard/admin/ProductForm"));
const PricingPlans = lazy(() => import("./pages/dashboard/admin/PricingPlans"));
const PricingPlanForm = lazy(() => import("./pages/dashboard/admin/PricingPlanForm"));
const Integrations = lazy(() => import("./pages/dashboard/admin/Integrations"));
const Sales = lazy(() => import("./pages/dashboard/admin/Sales"));
const InstitutionalRegistrations = lazy(() => import("./pages/dashboard/admin/InstitutionalRegistrations"));
const ClaraAnalytics = lazy(() => import("./pages/dashboard/admin/ClaraAnalytics"));
const LeadsDashboard = lazy(() => import("./pages/dashboard/admin/LeadsDashboard"));
const LeadsList = lazy(() => import("./pages/dashboard/admin/LeadsList"));
const LeadDetail = lazy(() => import("./pages/dashboard/admin/LeadDetail"));
const AdminMessages = lazy(() => import("./pages/dashboard/admin/AdminMessages"));

// Shared pages
const AIChatPage = lazy(() => import("./pages/dashboard/AIChatPage"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

// Configure QueryClient with optimized settings for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - increased for better caching
      gcTime: 10 * 60 * 1000, // 10 minutes - longer cache retention
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnMount: 'always', // Changed from true for better control
      retry: 1, // Reduced retries for faster error feedback
      retryDelay: 1000, // 1 second between retries
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <ScrollToTop />
            <FloatingClara />
            <Routes>
            {/* Public routes - lazy loaded with suspense */}
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Index /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><Pricing /></Suspense>} />
            <Route path="/personal-care" element={<Suspense fallback={<PageLoader />}><PersonalCare /></Suspense>} />
            <Route path="/institutional-care" element={<Suspense fallback={<PageLoader />}><InstitutionalCare /></Suspense>} />
            <Route path="/devices" element={<Suspense fallback={<PageLoader />}><Devices /></Suspense>} />
            <Route path="/our-nurses" element={<Suspense fallback={<PageLoader />}><OurNurses /></Suspense>} />
            <Route path="/guide" element={<Suspense fallback={<PageLoader />}><Guide /></Suspense>} />
            <Route path="/conneqtivity" element={<Suspense fallback={<PageLoader />}><Conneqtivity /></Suspense>} />
            <Route path="/order-confirmation" element={<Suspense fallback={<PageLoader />}><OrderConfirmation /></Suspense>} />
            <Route path="/auth/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/auth/signup" element={<Suspense fallback={<PageLoader />}><Signup /></Suspense>} />
            <Route path="/auth/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
            
            {/* Dashboard routes - lazy loaded with suspense */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <MemberOnboarding />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/devices" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <DeviceManagement />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Member routes */}
            <Route path="/dashboard/member" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <MemberHome />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/settings" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <MemberSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/devices" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <DeviceManagement />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/family" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <FamilyInvitations />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/schedule" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <SchedulePage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/care-team" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <CareTeamPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/subscriptions" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <SubscriptionsPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/ai-chat" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/member/messages" element={
              <ProtectedRoute requiredRole="member">
                <Suspense fallback={<PageLoader />}>
                  <MemberMessages />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Nurse routes */}
            <Route path="/dashboard/nurse" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseHome />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/settings" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/members" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseMembers />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/members/:memberId" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseMemberDetail />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/tasks" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseTasks />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/alerts" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseAlerts />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/messages" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseMessages />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/health" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <NurseHealthMonitoring />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/schedule" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <SchedulePage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/nurse/ai-chat" element={
              <ProtectedRoute requiredRole="nurse">
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Family Carer routes */}
            <Route path="/dashboard/family" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <FamilyHome />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/settings" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <FamilySettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/members" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <FamilyMembers />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/schedule" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <SchedulePage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/care-team" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <CareTeamPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/ai-chat" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/family/messages" element={
              <ProtectedRoute requiredRole="family_carer">
                <Suspense fallback={<PageLoader />}>
                  <FamilyMessages />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Facility Admin routes */}
            <Route path="/dashboard/facility" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityHome />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/settings" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilitySettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/residents" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityResidents />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/staff" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityStaff />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/reports" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityReports />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/schedule" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <SchedulePage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/ai-chat" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/facility/messages" element={
              <ProtectedRoute requiredRole="facility_admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityMessages />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AdminHome />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Users />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/staff" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Staff />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/nurses" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Nurses />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/members" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Members />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/assignments" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AssignmentsHub />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/family-carers" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <FamilyCarers />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <CommercialOverview />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/facilities" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Facilities />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/facilities/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityDetail />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/companies" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <CareCompanies />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/companies/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <CompanyDetail />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/insurance" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <InsuranceCompanies />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/commercial/insurance/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <InsuranceDetail />
                </Suspense>
              </ProtectedRoute>
            } />
            {/* Redirect old facilities routes to new commercial paths */}
            <Route path="/dashboard/admin/facilities" element={<Navigate to="/dashboard/admin/commercial/facilities" replace />} />
            <Route path="/dashboard/admin/facilities/:id" element={<Navigate to="/dashboard/admin/commercial/facilities/:id" replace />} />
            <Route path="/dashboard/admin/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <PlatformAnalytics />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AIAnalytics />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/system-health" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <SystemHealth />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/announcements" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Announcements />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/messages" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AdminMessages />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/support" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <SupportTickets />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/system-settings" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <SystemSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <UserManagement />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AIAgentsSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/clara" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ClaraSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/ineke" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <InekeSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/clara-member" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ClaraMemberSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/clara-family" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ClaraFamilySettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/isabella" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <IsabellaSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-agents/lee" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <LeeSettings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/products" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Products />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/products/new" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ProductForm />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/products/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ProductForm />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/pricing-plans" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <PricingPlans />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/pricing-plans/new" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <PricingPlanForm />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/pricing-plans/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <PricingPlanForm />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/integrations" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Integrations />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/sales" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Sales />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/leads" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <LeadsDashboard />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/leads/list" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <LeadsList />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/leads/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <LeadDetail />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/institutional-registrations" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <InstitutionalRegistrations />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/clara-analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <ClaraAnalytics />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/ai-chat" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            
            {/* Shared routes */}
            <Route path="/dashboard/ai-chat" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AIChatPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/settings/profile" element={<Navigate to="/settings" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Suspense>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
