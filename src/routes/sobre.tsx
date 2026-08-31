import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Galinha GSB" },
      { name: "description", content: "Conheça a história do plantel Galinha GSB e a raça Sertanejo Balão." },
      { property: "og:title", content: "Sobre — Galinha GSB" },
      { property: "og:description", content: "Conheça a história do plantel Galinha GSB e a raça Sertanejo Balão." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Sobre — Galinha GSB" },
      { name: "twitter:description", content: "Conheça a história do plantel Galinha GSB e a raça Sertanejo Balão." },
    ],
  }),
  component: About,
});

function About() {
  const { data: s = EMPTY_SETTINGS } = useSettingsQuery();
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <span className="rounded-full bg-primary-glow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">Nossa história</span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Sobre a Galinha GSB</h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{s.aboutText}</p>

      </section>
    </SiteLayout>
  );
}