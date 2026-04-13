import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import { mockCommunities } from "@/lib/mock-data";

interface AppLayoutProps {
  children: React.ReactNode;
}

function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/" || path === "/settings") return null;

  const crumbs: { label: string; href?: string }[] = [];

  if (path.startsWith("/communities")) {
    crumbs.push({ label: "Comunidades", href: "/communities" });

    if (path === "/communities/new") {
      crumbs.push({ label: "Nueva comunidad" });
    } else {
      const match = path.match(/\/communities\/(.+)/);
      if (match) {
        const community = mockCommunities.find(c => c.id === match[1]);
        crumbs.push({ label: community?.name || "Comunidad" });
      }
    }
  }

  if (crumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3" />}
          {crumb.href ? (
            <a href={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</a>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const showNewButton = location.pathname !== "/communities/new";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border/50 px-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <Breadcrumbs />
            </div>
            {showNewButton && (
              <button
                onClick={() => navigate("/communities/new")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva comunidad
              </button>
            )}
          </header>
          <main className="flex-1 p-6 mesh-bg">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
