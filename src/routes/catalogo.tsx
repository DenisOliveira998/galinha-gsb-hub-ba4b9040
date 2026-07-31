import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Galinha GSB" },
      { name: "description", content: "Ovos férteis, galinhas e reprodutores da raça Sertanejo Balão disponíveis no criadouro Galinha GSB." },
      { property: "og:title", content: "Catálogo — Galinha GSB" },
      { property: "og:description", content: "Aves e ovos férteis da raça Sertanejo Balão." },
    ],
  }),
  component: () => <Outlet />,
});