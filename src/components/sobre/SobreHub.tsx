import { ArrowRight } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { SobreIcon } from "./icons";
import { Container, SectionHeader, SmartLink } from "./primitives";

export function SobreHub({ hub }: { hub: SobreContent["hub"] }) {
  return (
    <section id="conteudos" aria-labelledby="conteudos-titulo" className="scroll-mt-24 bg-muted/40 py-16 md:py-24">
      <Container>
        <SectionHeader id="conteudos-titulo" eyebrow="Nosso acervo" title="Conteúdos para cada etapa da criação" lead={hub.intro} />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hub.items.map((item) => (
            <li
              key={item.title}
              className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition focus-within:ring-2 focus-within:ring-ring motion-safe:hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-primary-glow transition group-hover:bg-primary group-hover:text-primary-foreground">
                <SobreIcon name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              {/* O link cobre o card inteiro via ::after, mantendo um único alvo de foco. */}
              <SmartLink
                link={item.link}
                className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-glow after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none"
              >
                {item.link.label}
                <ArrowRight className="h-4 w-4 transition motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </SmartLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
