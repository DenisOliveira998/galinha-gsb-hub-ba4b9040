import { SiteLayout } from "@/components/site/site-layout";
import type { LegalDoc } from "@/lib/legal-content";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-10 text-left md:px-8 md:py-14">
          <span className="rounded-full bg-primary-glow/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">
            Informações legais
          </span>
          <h1 className="mt-3 font-display text-2xl md:text-4xl">{doc.title}</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-85">{doc.description}</p>
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-4 py-10 text-left md:px-8">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{doc.intro}</p>
        <div className="mt-8 space-y-6">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-lg md:text-xl">{s.heading}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>

      </article>
    </SiteLayout>
  );
}
