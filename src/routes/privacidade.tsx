import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL_DOCS } from "@/lib/legal-content";

const doc = LEGAL_DOCS["privacidade"];

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: `${doc.title} — Galinha GSB` },
      { name: "description", content: doc.description },
      { property: "og:title", content: `${doc.title} — Galinha GSB` },
      { property: "og:description", content: doc.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LegalPage doc={doc} />,
});
