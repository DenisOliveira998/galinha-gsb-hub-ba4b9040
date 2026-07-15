import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Galinha GSB" },
      { name: "description", content: "Dicas de manejo, curiosidades e novidades sobre a raça Sertanejo Balão." },
      { property: "og:title", content: "Blog — Galinha GSB" },
      { property: "og:description", content: "Dicas de manejo e novidades sobre a raça GSB." },
    ],
  }),
  component: () => <Outlet />,
});