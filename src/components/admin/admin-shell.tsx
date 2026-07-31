import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore } from "@/lib/mock-store";
import { Egg, LayoutDashboard, FileText, Newspaper, Settings, LogOut, GalleryHorizontal } from "lucide-react";

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const logout = useStore((s) => s.logout);
  const router = useRouter();

  const nav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/posts", label: "Anúncios", icon: FileText },
    { to: "/admin/blog", label: "Blog", icon: Newspaper },
    { to: "/admin/carrossel", label: "Mídia do Site", icon: GalleryHorizontal },
    { to: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary/30">
            <Egg className="h-4 w-4" />
          </span>
          <div className="text-sm">
            <div className="font-display font-semibold">Galinha GSB</div>
            <div className="text-xs opacity-70">Painel admin</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to as string}
              activeOptions={n.exact ? { exact: true } : undefined}
              activeProps={{ className: "bg-sidebar-accent" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-90 hover:bg-sidebar-accent"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            router.navigate({ to: "/admin/login" });
          }}
          className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <div className="flex-1">
        <header className="border-b bg-card px-6 py-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}