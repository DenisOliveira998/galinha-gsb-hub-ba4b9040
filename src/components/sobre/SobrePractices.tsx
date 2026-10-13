import { ArrowRight, CircleCheck, Compass, TriangleAlert } from "lucide-react";
import type { PracticeKind, SobreContent } from "@/content/sobre/types";
import { SobreIcon } from "./icons";
import { Container, SectionHeader, SmartLink, SobreImage, canShowImage, useSobreReview } from "./primitives";

const kindLabel: Record<PracticeKind, string> = {
  pratica: "Prática do criatório",
  principio: "Princípio defendido pelo portal",
};

export function SobrePractices({ practices }: { practices: SobreContent["practices"] }) {
  const review = useSobreReview();
  // Em revisão o espaço reservado aparece; no build final, só foto real.
  const showImage = review || canShowImage(practices.image, review);
  return (
    <section id="como-trabalhamos" aria-labelledby="como-trabalhamos-titulo" className="scroll-mt-24 bg-muted/40 py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="como-trabalhamos-titulo"
            eyebrow="Como trabalhamos"
            title="Cuidado no dia a dia, clareza no que se afirma"
            lead={practices.intro}
          />
          <ul className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold" aria-label="Legenda">
            <li className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary dark:text-primary-glow">
              <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {kindLabel.pratica}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-accent-warm/30 px-3 py-1.5 text-foreground">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              {kindLabel.principio}
            </li>
          </ul>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {showImage && (
            <SobreImage
              image={practices.image}
              className="aspect-[4/3] rounded-3xl shadow-[var(--shadow-soft)] md:col-span-2 lg:col-span-1 lg:row-span-2 lg:aspect-auto"
            />
          )}

          {practices.items.map((item, index) => (
            <article
              key={item.title}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-primary-glow">
                  <SobreIcon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="font-display text-sm text-muted-foreground" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug">{item.title}</h3>
              <p
                className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  item.kind === "pratica" ? "bg-primary/10 text-primary dark:text-primary-glow" : "bg-accent-warm/30 text-foreground"
                }`}
              >
                {item.kind === "pratica" ? (
                  <CircleCheck className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Compass className="h-3 w-3" aria-hidden="true" />
                )}
                {kindLabel[item.kind]}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              {item.link && (
                <SmartLink
                  link={item.link}
                  className="group mt-4 inline-flex min-h-10 w-fit items-center gap-1.5 rounded text-sm font-semibold text-primary dark:text-primary-glow hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.link.label}
                  <ArrowRight className="h-4 w-4 transition motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
                </SmartLink>
              )}
            </article>
          ))}

          <aside className={`flex flex-col justify-center rounded-3xl border border-dashed border-border p-6 md:p-8 ${showImage ? "lg:col-span-2" : ""}`}>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <TriangleAlert className="h-4 w-4 text-accent" aria-hidden="true" />
              Sobre os números nos conteúdos
            </p>
            {/* Os artigos ainda trazem estimativas sem fonte (ex.: ovos por ano, custos);
                por isso o texto descreve o compromisso de revisão, não uma garantia. */}
            <p className="mt-3 font-display text-lg leading-relaxed md:text-xl">
              Índices de fertilidade, eclosão, peso e produção variam muito entre plantéis. Estamos revisando os artigos para que
              cada número venha com contexto e fonte — e para separar estimativas de medições feitas no plantel.
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
