import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { BrandPanel, Container, PendingValue, SmartLink, SobreImage, buttonStyles, useShowValue, useSobreReview } from "./primitives";

export function SobreHero({ hero, logo }: { hero: SobreContent["hero"]; logo: string }) {
  const show = useShowValue();
  const review = useSobreReview();
  const facts = hero.facts.filter((fact) => show(fact.value));

  return (
    <section aria-labelledby="sobre-titulo" className="relative overflow-hidden bg-primary-deep text-primary-foreground">
      {/* Brilhos decorativos — sem imagens extras, só gradiente. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="absolute -bottom-48 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Container className="relative pb-14 pt-8 md:pb-20 md:pt-12">
        <nav aria-label="Trilha de navegação" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-primary-foreground/75">
            <li>
              <Link to="/" className="inline-flex min-h-6 items-center rounded hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow">
                Início
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="font-semibold text-primary-foreground">
              Sobre Nós
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div>
            <span className="inline-block rounded-full bg-primary-glow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">
              {hero.eyebrow}
            </span>
            <h1 id="sobre-titulo" className="mt-5 text-balance font-display text-4xl leading-[1.08] md:text-5xl lg:text-[3.5rem]">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-primary-foreground/95 md:text-xl">
              {hero.subtitle}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/80">{hero.intro}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <SmartLink link={hero.primaryCta} className={buttonStyles.accent}>
                {hero.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </SmartLink>
              <SmartLink link={hero.secondaryCta} className={buttonStyles.ghostInverted}>
                {hero.secondaryCta.label}
              </SmartLink>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[2.25rem] border border-primary-foreground/15 md:-inset-4" />
            <SobreImage
              image={hero.image}
              priority
              className="aspect-[4/5] rounded-[2rem] shadow-[var(--shadow-card)] ring-1 ring-primary-foreground/15"
              // Em revisão mostra o espaço reservado identificado; no build final, a marca.
              fallback={review ? undefined : <BrandPanel logo={logo} tone="inverted" />}
            />
          </figure>
        </div>

        {facts.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-primary-foreground/15 ring-1 ring-primary-foreground/15 md:mt-16 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-primary-deep/95 p-4 md:p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/65">{fact.label}</dt>
                <dd className="mt-1 font-display text-base leading-snug md:text-lg">
                  <PendingValue value={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
    </section>
  );
}
