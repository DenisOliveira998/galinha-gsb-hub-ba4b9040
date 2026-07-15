import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: AdminGate,
});

function AdminGate() {
  const isAuth = useStore((s) => s.isAuthenticated);
  if (!isAuth) return <Navigate to="/admin/login" />;
  return <Outlet />;
}