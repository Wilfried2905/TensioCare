import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { SubscriptionProvider } from "@/hooks/use-subscription";
import { DoctorLimitsProvider } from "@/hooks/use-doctor-limits";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Measurements from "@/pages/measurements";
import Medications from "@/pages/medications";
import SimpleChat from "@/components/messaging/simple-chat";
import Patients from "@/pages/patients";
import Consultations from "@/pages/consultations";
import Prescriptions from "@/pages/prescriptions";
import Reports from "@/pages/reports";
import Subscription from "@/pages/subscription";
import Users from "@/pages/users";
import Payments from "@/pages/payments";
import Subscriptions from "@/pages/subscriptions";
import Statistics from "@/pages/statistics";
import PaymentDashboard from "@/pages/payment-dashboard";
import PaymentAnalytics from "@/pages/payment-analytics";
import Monitoring from "@/pages/monitoring";
import Settings from "@/pages/settings";
import MainLayout from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/use-auth";

function AuthenticatedRoutes() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/measurements" component={Measurements} />
        <Route path="/medications" component={Medications} />
        <Route path="/messages" component={SimpleChat} />
        <Route path="/patients" component={Patients} />
        <Route path="/consultations" component={Consultations} />
        <Route path="/prescriptions" component={Prescriptions} />
        <Route path="/reports" component={Reports} />
        <Route path="/subscription" component={Subscription} />
        <Route path="/users" component={Users} />
        <Route path="/payments" component={Payments} />
        <Route path="/subscriptions" component={Subscriptions} />
        <Route path="/statistiques" component={Statistics} />
        <Route path="/payment-dashboard" component={PaymentDashboard} />
        <Route path="/payment-analytics" component={PaymentAnalytics} />
        <Route path="/monitoring" component={Monitoring} />
        <Route path="/settings" component={Settings} />
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
              <p className="text-gray-600">La page que vous cherchez n'existe pas.</p>
            </div>
          </div>
        </Route>
      </Switch>
    </MainLayout>
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="*">
        {!user ? <Login /> : <AuthenticatedRoutes />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <DoctorLimitsProvider>
              <Router />
              <Toaster />
            </DoctorLimitsProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
