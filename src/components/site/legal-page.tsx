import { SiteLayout } from "@/components/site/site-layout";
import { PageHero } from "@/components/site/page-kit";
import type { LegalDoc } from "@/lib/legal-content";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <SiteLayout>
      <PageHero eyebrow="Informações do site" title={doc.title} intro={doc.description} />
      <article className="mx-auto max-w-3xl px-4 py-12 text-left md:px-8 md:py-16">
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{doc.intro}</p>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {doc.sections.map((s) => (
            <section key={s.heading} className="py-6">
              <h2 className="font-display text-xl md:text-2xl">{s.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{s.body}</p>
            </section>
          ))}
        </div>

      </article>
    </SiteLayout>
  );
}
