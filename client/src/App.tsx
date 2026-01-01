import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { VaultProvider } from "./contexts/VaultContext";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Strategies from "./pages/Strategies";
import Activity from "./pages/Activity";
import Governance from "./pages/Governance";
import Settings from "./pages/Settings";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper component to conditionally apply layout
function AppRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Landing page doesn't use the sidebar layout
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/strategies" element={<Strategies />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <VaultProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </VaultProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
