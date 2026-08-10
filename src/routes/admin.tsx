import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Galinha GSB" }, { name: "robots", content: "noindex" }] }),

  // Roda no servidor (SSR) e no cliente (navegação SPA).
  // Se não houver cookie de sessão válido → redireciona para login.
  beforeLoad: async ({ location }) => {
    // A rota de login passa sem verificação para evitar loop de redirect.
    if (location.pathname === "/admin/login") return;

    const session = await getAdminSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }

    // Expõe a sessão para rotas filhas via useRouteContext()
    return { adminSession: session };
  },

  component: AdminGate,
});

function AdminGate() {
  return <Outlet />;
}
