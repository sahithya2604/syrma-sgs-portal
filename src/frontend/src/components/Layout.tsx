import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useAppStore } from "../store";
import type { PanelType } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

interface NavItem {
  id: PanelType;
  label: string;
  icon: React.ReactNode;
  section: "panels" | "overview";
}

const navItems: NavItem[] = [
  {
    id: "client",
    label: "Client",
    icon: <Building2 className="w-4 h-4" />,
    section: "panels",
  },
  {
    id: "vendor",
    label: "Vendor",
    icon: <ShieldCheck className="w-4 h-4" />,
    section: "panels",
  },
  {
    id: "upload",
    label: "Upload",
    icon: <Upload className="w-4 h-4" />,
    section: "panels",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    section: "overview",
  },
];

export function Layout({ children, onLogout }: LayoutProps) {
  const { selectedPanel, setSelectedPanel } = useAppStore();

  const panelItems = navItems.filter((i) => i.section === "panels");
  const overviewItems = navItems.filter((i) => i.section === "overview");

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/logo.png"
            alt="Syrma SGS Logo"
            className="h-10 w-auto object-contain"
            data-ocid="header.logo"
          />
          <Separator orientation="vertical" className="h-5 mx-1" />
          <span className="text-xs text-muted-foreground font-body">
            Document Intelligence
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm h-8 px-3"
              data-ocid="header.logout_button"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
          <div className="px-4 py-4">
            <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Panels
            </p>
            <nav className="flex flex-col gap-1" data-ocid="sidebar.panels.nav">
              {panelItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPanel(item.id)}
                  data-ocid={`sidebar.nav.${item.id}`}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-smooth text-left",
                    selectedPanel === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <Separator className="mx-4" />

          <div className="px-4 py-4">
            <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Overview
            </p>
            <nav
              className="flex flex-col gap-1"
              data-ocid="sidebar.overview.nav"
            >
              {overviewItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPanel(item.id)}
                  data-ocid={`sidebar.nav.${item.id}`}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-smooth text-left",
                    selectedPanel === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto px-4 py-4 border-t border-sidebar-border">
            <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-200"
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="main.content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
