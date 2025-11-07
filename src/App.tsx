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
import DeviceManagement from "./pages/dashboard/DeviceManagement";
import FamilyInvitations from "./pages/dashboard/FamilyInvitations";
import SchedulePage from "./pages/dashboard/SchedulePage";
import CareTeamPage from "./pages/dashboard/CareTeamPage";
import SubscriptionsPage from "./pages/dashboard/SubscriptionsPage";
import AIChatPage from "./pages/dashboard/AIChatPage";
import Settings from "./pages/dashboard/Settings";
import PersonalCare from "./pages/PersonalCare";
import InstitutionalCare from "./pages/InstitutionalCare";
import Devices from "./pages/Devices";
import OurNurses from "./pages/OurNurses";
import Guide from "./pages/Guide";
import Conneqtivity from "./pages/Conneqtivity";
import NurseMembers from "./pages/dashboard/nurse/NurseMembers";
import NurseMemberDetail from "./pages/dashboard/nurse/NurseMemberDetail";
import NurseAlerts from "./pages/dashboard/nurse/NurseAlerts";
import NurseMessages from "./pages/dashboard/nurse/NurseMessages";
import NurseHealthMonitoring from "./pages/dashboard/nurse/NurseHealthMonitoring";
import NurseTasks from "./pages/dashboard/NurseTasks";

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
            
            {/* Member-only routes */}
            <Route path="/dashboard/devices" element={<ProtectedRoute requiredRole="member"><DeviceManagement /></ProtectedRoute>} />
            <Route path="/dashboard/family" element={<ProtectedRoute requiredRole="member"><FamilyInvitations /></ProtectedRoute>} />
            <Route path="/dashboard/schedule" element={<ProtectedRoute requiredRole="member"><SchedulePage /></ProtectedRoute>} />
            <Route path="/dashboard/care-team" element={<ProtectedRoute requiredRole="member"><CareTeamPage /></ProtectedRoute>} />
            <Route path="/dashboard/subscriptions" element={<ProtectedRoute requiredRole="member"><SubscriptionsPage /></ProtectedRoute>} />
            
            {/* Nurse-only routes */}
            <Route path="/dashboard/nurse/members" element={<ProtectedRoute requiredRole="nurse"><NurseMembers /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/members/:memberId" element={<ProtectedRoute requiredRole="nurse"><NurseMemberDetail /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/tasks" element={<ProtectedRoute requiredRole="nurse"><NurseTasks /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/alerts" element={<ProtectedRoute requiredRole="nurse"><NurseAlerts /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/messages" element={<ProtectedRoute requiredRole="nurse"><NurseMessages /></ProtectedRoute>} />
            <Route path="/dashboard/nurse/health" element={<ProtectedRoute requiredRole="nurse"><NurseHealthMonitoring /></ProtectedRoute>} />
            
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
