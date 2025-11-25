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

// Public pages (loaded immediately)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PersonalCare from "./pages/PersonalCare";
import InstitutionalCare from "./pages/InstitutionalCare";
import Devices from "./pages/Devices";
import OurNurses from "./pages/OurNurses";
import Guide from "./pages/Guide";
import Conneqtivity from "./pages/Conneqtivity";

// Dashboard pages (lazy loaded)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MemberOnboarding = lazy(() => import("./pages/onboarding/MemberOnboarding"));

// Member pages
const MemberHome = lazy(() => import("./pages/dashboard/member/MemberHome"));
const MemberSettings = lazy(() => import("./pages/dashboard/member/MemberSettings"));
const DeviceManagement = lazy(() => import("./pages/dashboard/DeviceManagement"));
const FamilyInvitations = lazy(() => import("./pages/dashboard/FamilyInvitations"));
const SchedulePage = lazy(() => import("./pages/dashboard/SchedulePage"));
const CareTeamPage = lazy(() => import("./pages/dashboard/CareTeamPage"));
const SubscriptionsPage = lazy(() => import("./pages/dashboard/SubscriptionsPage"));

// Family Carer pages
const FamilyHome = lazy(() => import("./pages/dashboard/family/FamilyHome"));
const FamilySettings = lazy(() => import("./pages/dashboard/family/FamilySettings"));
const FamilyMembers = lazy(() => import("./pages/dashboard/family/FamilyMembers"));

// Facility Admin pages
const FacilityHome = lazy(() => import("./pages/dashboard/facility/FacilityHome"));
const FacilitySettings = lazy(() => import("./pages/dashboard/facility/FacilitySettings"));
const FacilityResidents = lazy(() => import("./pages/dashboard/facility/FacilityResidents"));
const FacilityStaff = lazy(() => import("./pages/dashboard/facility/FacilityStaff"));
const FacilityReports = lazy(() => import("./pages/dashboard/facility/FacilityReports"));

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
const Nurses = lazy(() => import("./pages/dashboard/admin/Nurses"));
const Members = lazy(() => import("./pages/dashboard/admin/Members"));
const FamilyCarers = lazy(() => import("./pages/dashboard/admin/FamilyCarers"));
const Facilities = lazy(() => import("./pages/dashboard/admin/Facilities"));
const FacilityDetail = lazy(() => import("./pages/dashboard/admin/FacilityDetail"));
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
const Products = lazy(() => import("./pages/dashboard/admin/Products"));
const PricingPlans = lazy(() => import("./pages/dashboard/admin/PricingPlans"));

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

// Configure QueryClient for responsive data updates
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute for responsive updates
      gcTime: 5 * 60 * 1000, // 5 minutes cache retention
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnMount: true, // Refetch when component mounts
      retry: 2, // Retry failed requests twice
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
            <Routes>
            {/* Public routes - no lazy loading */}
            <Route path="/" element={<Index />} />
            <Route path="/personal-care" element={<PersonalCare />} />
            <Route path="/institutional-care" element={<InstitutionalCare />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/our-nurses" element={<OurNurses />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/conneqtivity" element={<Conneqtivity />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            
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
            
            {/* Admin routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <AdminHome />
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
            <Route path="/dashboard/admin/family-carers" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <FamilyCarers />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/facilities" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Facilities />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/facilities/:id" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <FacilityDetail />
                </Suspense>
              </ProtectedRoute>
            } />
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
            <Route path="/dashboard/admin/products" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<PageLoader />}>
                  <Products />
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
