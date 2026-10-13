import { ArrowUpRight } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { BrandPanel, Container, SectionHeader, SmartLink, SobreImage, canShowImage, useSobreReview } from "./primitives";

export function SobreBreed({ breed, logo }: { breed: SobreContent["breed"]; logo: string }) {
  const review = useSobreReview();
  return (
    <section id="a-raca" aria-labelledby="a-raca-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <figure className="relative lg:sticky lg:top-28">
          <SobreImage
            image={breed.image}
            className="aspect-[4/5] rounded-3xl shadow-[var(--shadow-card)]"
            fallback={review ? undefined : <BrandPanel logo={logo} />}
          />
          {(review || canShowImage(breed.image, review)) && (
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-card/90 p-4 text-sm leading-relaxed shadow-[var(--shadow-soft)] backdrop-blur">
              <span className="font-display text-base">Sertaneja Balão (GSB)</span>
              <span className="block text-muted-foreground">Raça de galinha formada pela seleção de criadores brasileiros.</span>
            </figcaption>
          )}
        </figure>

        <div>
          <SectionHeader id="a-raca-titulo" eyebrow="A raça" title={breed.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {breed.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <ul className="mt-8 space-y-4">
            {breed.highlights.map((item) => (
              <li key={item.title} className="rounded-2xl border-l-4 border-accent bg-card py-4 pl-5 pr-4 shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-lg">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Continue no Guia da GSB</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {breed.links.map((link) => (
                <li key={link.href}>
                  <SmartLink
                    link={link}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary dark:text-primary-glow transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
