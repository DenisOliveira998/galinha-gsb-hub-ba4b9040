import type { SobreContent } from "@/content/sobre/types";
import { SobreIcon } from "./icons";
import { Container, SectionHeader } from "./primitives";

const cardClass =
  "flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition motion-safe:hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] md:p-7";

export function SobrePurpose({ purpose }: { purpose: SobreContent["purpose"] }) {
  return (
    <section id="proposito" aria-labelledby="proposito-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <SectionHeader
          id="proposito-titulo"
          eyebrow="Nosso propósito"
          title="O que nos move"
          lead="Três ideias simples orientam o que publicamos e a forma como nos relacionamos com quem cria ou quer criar a raça."
          align="center"
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          <li className={cardClass}>
            <CardIcon name="target" />
            <h3 className="mt-5 font-display text-2xl">Missão</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{purpose.mission}</p>
          </li>
          <li className={cardClass}>
            <CardIcon name="telescope" />
            <h3 className="mt-5 font-display text-2xl">Visão</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{purpose.vision}</p>
          </li>
          <li className={cardClass}>
            <CardIcon name="heart-handshake" />
            <h3 className="mt-5 font-display text-2xl">Valores</h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Nossos valores">
              {purpose.values.map((value) => (
                <li key={value} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                  {value}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </Container>
    </section>
  );
}

function CardIcon({ name }: { name: "target" | "telescope" | "heart-handshake" }) {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-primary-glow">
      <SobreIcon name={name} className="h-6 w-6" />
    </span>
  );
}
