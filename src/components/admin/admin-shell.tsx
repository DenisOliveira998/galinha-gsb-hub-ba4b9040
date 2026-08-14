import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { adminLogout } from "@/lib/admin-auth";
import { ExternalLink, FileText, GalleryHorizontal, LayoutDashboard, LogOut, MessageSquare, Newspaper, Settings, ShoppingBag, Tags, UserCircle2, Users } from "lucide-react";

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();

  const nav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/posts", label: "Anúncios", icon: FileText },
    { to: "/admin/categorias", label: "Categorias", icon: Tags },
    { to: "/admin/blog", label: "Blog", icon: Newspaper },
    { to: "/admin/autores", label: "Autores", icon: UserCircle2 },
    { to: "/admin/comentarios", label: "Comentários", icon: MessageSquare },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { to: "/admin/clientes", label: "Clientes", icon: Users },
    { to: "/admin/carrossel", label: "Mídia do Site", icon: GalleryHorizontal },
    { to: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground md:flex">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6">
          <img src="/logo.png" alt="Galinha GSB" className="h-9 w-9 rounded-xl object-contain" />
          <div className="text-sm">
            <div className="font-display font-semibold">Galinha GSB</div>
            <div className="text-xs opacity-70">Painel admin</div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Rodapé: ver site + sair */}
        <div className="m-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent"
          >
            <ExternalLink className="h-4 w-4" /> Ver site
          </a>
          <button
            onClick={async () => {
              await adminLogout();
              router.navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b bg-card px-6 py-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
