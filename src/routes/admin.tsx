import { createFileRoute, Outlet, Navigate, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: AdminGate,
});

function AdminGate() {
  const isAuth = useStore((s) => s.isAuthenticated);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Allow login route through the gate to avoid a redirect loop / blank screen.
  if (pathname === "/admin/login") return <Outlet />;
  if (!isAuth) return <Navigate to="/admin/login" />;
  return <Outlet />;
}