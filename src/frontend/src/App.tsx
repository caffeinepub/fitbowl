import { Toaster } from "@/components/ui/sonner";
import BottomNav from "./components/BottomNav";
import { AppProvider, useApp } from "./context/AppContext";
import { RouterProvider, useRouter } from "./context/RouterContext";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import DeliveryPage from "./pages/DeliveryPage";
import MealsPage from "./pages/MealsPage";
import NotificationsPage from "./pages/NotificationsPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import PaymentPage from "./pages/PaymentPage";
import PlansPage from "./pages/PlansPage";
import ProgressPage from "./pages/ProgressPage";
import WellnessPage from "./pages/WellnessPage";

function AppRoutes() {
  const { isOnboarded } = useApp();
  const { currentRoute } = useRouter();

  const renderPage = () => {
    if (currentRoute === "/admin") return <AdminPanel />;
    if (!isOnboarded) return <OnboardingFlow />;
    switch (currentRoute) {
      case "/":
        return <Dashboard />;
      case "/plans":
        return <PlansPage />;
      case "/meals":
        return <MealsPage />;
      case "/wellness":
        return <WellnessPage />;
      case "/delivery":
        return <DeliveryPage />;
      case "/progress":
        return <ProgressPage />;
      case "/notifications":
        return <NotificationsPage />;
      case "/payment":
        return <PaymentPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      <BottomNav />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </RouterProvider>
  );
}
