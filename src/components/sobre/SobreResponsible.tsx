import { ArrowRight, Info } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { Container, PendingValue, SectionHeader, SmartLink, SobreImage, buttonStyles, useShowValue } from "./primitives";

export function SobreResponsible({ responsible }: { responsible: SobreContent["responsible"] }) {
  const show = useShowValue();
  const details = responsible.details.filter((detail) => show(detail.value));

  return (
    <section id="quem-somos" aria-labelledby="quem-somos-titulo" className="scroll-mt-24 bg-muted/40 py-16 md:py-24">
      <Container>
        <SectionHeader
          id="quem-somos-titulo"
          eyebrow="Responsável"
          title="Quem está por trás do projeto"
          lead="Um site útil precisa de alguém que responda por ele. Aqui está quem cuida do conteúdo e do trabalho apresentado no portal."
        />

        <article
          aria-labelledby="responsavel-nome"
          className="mt-10 grid overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-card)] md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]"
        >
          <SobreImage image={responsible.photo} className="aspect-[4/5] md:aspect-auto md:min-h-full" />

          <div className="p-6 md:p-10">
            {responsible.isFictional && (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-dashed border-accent bg-accent/10 px-3 py-1.5 text-xs font-semibold">
                <Info className="h-4 w-4 text-accent" aria-hidden="true" />
                Persona fictícia · conteúdo de demonstração
              </p>
            )}
            <h3 id="responsavel-nome" className="font-display text-3xl md:text-4xl">
              {responsible.name}
            </h3>
            <p className="mt-1.5 text-sm font-semibold text-primary dark:text-primary-glow md:text-base">{responsible.role}</p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {responsible.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            {details.length > 0 && (
              <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-2">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{detail.label}</dt>
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                      <PendingValue value={detail.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {responsible.values && responsible.values.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">O que orienta o trabalho</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {responsible.values.map((value) => (
                    <li key={value} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:text-primary-glow">
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <SmartLink link={responsible.articlesLink} className={buttonStyles.primary}>
                {responsible.articlesLink.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </SmartLink>
              <SmartLink link={responsible.contactLink} className={buttonStyles.outline}>
                {responsible.contactLink.label}
              </SmartLink>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}
