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
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<ProtectedRoute><MemberOnboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/devices" element={<ProtectedRoute><DeviceManagement /></ProtectedRoute>} />
            <Route path="/dashboard/family" element={<ProtectedRoute><FamilyInvitations /></ProtectedRoute>} />
            <Route path="/dashboard/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
            <Route path="/dashboard/care-team" element={<ProtectedRoute><CareTeamPage /></ProtectedRoute>} />
            <Route path="/dashboard/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
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
