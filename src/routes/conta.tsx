import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — Galinha GSB" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});