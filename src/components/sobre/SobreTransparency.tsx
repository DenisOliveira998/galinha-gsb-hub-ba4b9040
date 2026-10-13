import { ArrowUpRight } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { SobreIcon } from "./icons";
import { Container, SectionHeader, SmartLink } from "./primitives";

export function SobreTransparency({ transparency }: { transparency: SobreContent["transparency"] }) {
  return (
    <section id="transparencia" aria-labelledby="transparencia-titulo" className="scroll-mt-24 bg-muted/40 py-16 md:py-24">
      <Container>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-10 lg:p-12">
          <SectionHeader
            id="transparencia-titulo"
            eyebrow="Transparência e responsabilidade"
            title="Quem somos, o que fazemos e como o site se mantém"
            lead={transparency.intro}
          />

          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {transparency.points.map((point) => (
              <li key={point.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary dark:text-primary-glow">
                  <SobreIcon name={point.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <nav aria-labelledby="documentos-titulo" className="mt-10 border-t border-border pt-8">
            <h3 id="documentos-titulo" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Documentos e páginas institucionais
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {transparency.links.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    link={link}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/10 hover:text-primary dark:hover:text-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
