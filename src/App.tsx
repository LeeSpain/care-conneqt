import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import MemberOnboarding from "./pages/onboarding/MemberOnboarding";

// Member pages
import MemberHome from "./pages/dashboard/member/MemberHome";
import MemberSettings from "./pages/dashboard/member/MemberSettings";
import DeviceManagement from "./pages/dashboard/DeviceManagement";
import FamilyInvitations from "./pages/dashboard/FamilyInvitations";
import SchedulePage from "./pages/dashboard/SchedulePage";
import CareTeamPage from "./pages/dashboard/CareTeamPage";
import SubscriptionsPage from "./pages/dashboard/SubscriptionsPage";

// Family Carer pages
import FamilyHome from "./pages/dashboard/family/FamilyHome";
import FamilySettings from "./pages/dashboard/family/FamilySettings";

// Facility Admin pages
import FacilityHome from "./pages/dashboard/facility/FacilityHome";
import FacilitySettings from "./pages/dashboard/facility/FacilitySettings";

// Nurse pages
import NurseHome from "./pages/dashboard/nurse/NurseHome";
import NurseSettings from "./pages/dashboard/nurse/NurseSettings";
import NurseMembers from "./pages/dashboard/nurse/NurseMembers";
import NurseMemberDetail from "./pages/dashboard/nurse/NurseMemberDetail";
import NurseAlerts from "./pages/dashboard/nurse/NurseAlerts";
import NurseMessages from "./pages/dashboard/nurse/NurseMessages";
import NurseHealthMonitoring from "./pages/dashboard/nurse/NurseHealthMonitoring";
import NurseTasks from "./pages/dashboard/NurseTasks";

// Admin pages
import AdminHome from "./pages/dashboard/admin/AdminHome";
import Nurses from "./pages/dashboard/admin/Nurses";
import Members from "./pages/dashboard/admin/Members";
import FamilyCarers from "./pages/dashboard/admin/FamilyCarers";
import Facilities from "./pages/dashboard/admin/Facilities";
import FacilityDetail from "./pages/dashboard/admin/FacilityDetail";
import PlatformAnalytics from "./pages/dashboard/admin/PlatformAnalytics";
import AIAnalytics from "./pages/dashboard/admin/AIAnalytics";
import Announcements from "./pages/dashboard/admin/Announcements";
import SupportTickets from "./pages/dashboard/admin/SupportTickets";
import SystemSettings from "./pages/dashboard/admin/SystemSettings";
import UserManagement from "./pages/dashboard/settings/UserManagement";
import AIAgentsSettings from "./pages/dashboard/settings/AIAgentsSettings";
import ClaraSettings from "./pages/dashboard/settings/ai-agents/ClaraSettings";
import InekeSettings from "./pages/dashboard/settings/ai-agents/InekeSettings";

// Shared pages
import AIChatPage from "./pages/dashboard/AIChatPage";
import Settings from "./pages/dashboard/Settings";

// Public pages
import PersonalCare from "./pages/PersonalCare";
import InstitutionalCare from "./pages/InstitutionalCare";
import Devices from "./pages/Devices";
import OurNurses from "./pages/OurNurses";
import Guide from "./pages/Guide";
import Conneqtivity from "./pages/Conneqtivity";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
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
            <Route path="/onboarding" element={<ProtectedRoute><MemberOnboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Member routes */}
            <Route path="/dashboard/member" element={<ProtectedRoute requiredRole="member"><MemberHome /></ProtectedRoute>} />
            <Route path="/dashboard/member/settings" element={<ProtectedRoute requiredRole="member"><MemberSettings /></ProtectedRoute>} />
            <Route path="/dashboard/member/devices" element={<ProtectedRoute requiredRole="member"><DeviceManagement /></ProtectedRoute>} />
            <Route path="/dashboard/member/family" element={<ProtectedRoute requiredRole="member"><FamilyInvitations /></ProtectedRoute>} />
            <Route path="/dashboard/member/schedule" element={<ProtectedRoute requiredRole="member"><SchedulePage /></ProtectedRoute>} />
            <Route path="/dashboard/member/care-team" element={<ProtectedRoute requiredRole="member"><CareTeamPage /></ProtectedRoute>} />
            <Route path="/dashboard/member/subscriptions" element={<ProtectedRoute requiredRole="member"><SubscriptionsPage /></ProtectedRoute>} />
            
            {/* Nurse routes */}
            <Route path="/dashboard/nurse" element={<ProtectedRoute requiredRole="nurse"><NurseHome /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/settings" element={<ProtectedRoute requiredRole="nurse"><NurseSettings /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/members" element={<ProtectedRoute requiredRole="nurse"><NurseMembers /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/members/:memberId" element={<ProtectedRoute requiredRole="nurse"><NurseMemberDetail /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/tasks" element={<ProtectedRoute requiredRole="nurse"><NurseTasks /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/alerts" element={<ProtectedRoute requiredRole="nurse"><NurseAlerts /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/messages" element={<ProtectedRoute requiredRole="nurse"><NurseMessages /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/health" element={<ProtectedRoute requiredRole="nurse"><NurseHealthMonitoring /></ProtectedRoute>} />
            
            {/* Family Carer routes */}
            <Route path="/dashboard/family" element={<ProtectedRoute requiredRole="family_carer"><FamilyHome /></ProtectedRoute>} />
            <Route path="/dashboard/family/settings" element={<ProtectedRoute requiredRole="family_carer"><FamilySettings /></ProtectedRoute>} />
            <Route path="/dashboard/family/members" element={<ProtectedRoute requiredRole="family_carer"><FamilyInvitations /></ProtectedRoute>} />
            
            {/* Facility Admin routes */}
            <Route path="/dashboard/facility" element={<ProtectedRoute requiredRole="facility_admin"><FacilityHome /></ProtectedRoute>} />
            <Route path="/dashboard/facility/settings" element={<ProtectedRoute requiredRole="facility_admin"><FacilitySettings /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><AdminHome /></ProtectedRoute>} />
            <Route path="/dashboard/admin/nurses" element={<ProtectedRoute requiredRole="admin"><Nurses /></ProtectedRoute>} />
            <Route path="/dashboard/admin/members" element={<ProtectedRoute requiredRole="admin"><Members /></ProtectedRoute>} />
            <Route path="/dashboard/admin/family-carers" element={<ProtectedRoute requiredRole="admin"><FamilyCarers /></ProtectedRoute>} />
            <Route path="/dashboard/admin/facilities" element={<ProtectedRoute requiredRole="admin"><Facilities /></ProtectedRoute>} />
            <Route path="/dashboard/admin/facilities/:id" element={<ProtectedRoute requiredRole="admin"><FacilityDetail /></ProtectedRoute>} />
            <Route path="/dashboard/admin/analytics" element={<ProtectedRoute requiredRole="admin"><PlatformAnalytics /></ProtectedRoute>} />
            <Route path="/dashboard/admin/ai-analytics" element={<ProtectedRoute requiredRole="admin"><AIAnalytics /></ProtectedRoute>} />
            <Route path="/dashboard/admin/announcements" element={<ProtectedRoute requiredRole="admin"><Announcements /></ProtectedRoute>} />
            <Route path="/dashboard/admin/support" element={<ProtectedRoute requiredRole="admin"><SupportTickets /></ProtectedRoute>} />
            <Route path="/dashboard/admin/system-settings" element={<ProtectedRoute requiredRole="admin"><SystemSettings /></ProtectedRoute>} />
            <Route path="/dashboard/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/dashboard/admin/ai-agents" element={<ProtectedRoute requiredRole="admin"><AIAgentsSettings /></ProtectedRoute>} />
            <Route path="/dashboard/admin/ai-agents/clara" element={<ProtectedRoute requiredRole="admin"><ClaraSettings /></ProtectedRoute>} />
            <Route path="/dashboard/admin/ai-agents/ineke" element={<ProtectedRoute requiredRole="admin"><InekeSettings /></ProtectedRoute>} />
            
            {/* Shared routes */}
            <Route path="/dashboard/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
