import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import { ClientPanel } from "../pages/ClientPanel";
import { DashboardPanel } from "../pages/DashboardPanel";
import { LoginPage } from "../pages/LoginPage";
import { UploadPanel } from "../pages/UploadPanel";
import { VendorPanel } from "../pages/VendorPanel";
import { useAppStore } from "../store";

function RootComponent() {
  const selectedPanel = useAppStore((s) => s.selectedPanel);
  const { isAuthenticated, isInitializing, logout } = useAuth();

  // Show nothing while checking stored session
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onSuccess={() => {}} />
        <Toaster position="bottom-right" richColors />
      </>
    );
  }

  return (
    <>
      <Layout onLogout={logout}>
        {selectedPanel === "dashboard" && <DashboardPanel />}
        {selectedPanel === "client" && <ClientPanel />}
        {selectedPanel === "vendor" && <VendorPanel />}
        {selectedPanel === "upload" && <UploadPanel />}
        {!selectedPanel && <Outlet />}
      </Layout>
      <Toaster position="bottom-right" richColors />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
