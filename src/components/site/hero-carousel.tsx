import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/mock-store";

export function HeroCarousel() {
  const slides = useStore((s) => s.heroSlides);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 10000);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    if (i >= slides.length) setI(0);
  }, [slides.length, i]);

  if (!slides.length) return null;
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);

  return (
    <section className="mx-auto max-w-7xl px-3 pt-3 md:px-8 md:pt-5">
      <div className="relative overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)] md:rounded-3xl">
        <div className="relative h-[150px] sm:h-[200px] md:h-[260px] lg:h-[300px]">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
              aria-hidden={idx !== i}
            >
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/45 via-primary-deep/15 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center gap-1 px-12 text-left text-primary-foreground md:gap-1.5 md:px-16">
                <h2 className="max-w-lg font-display text-lg leading-tight drop-shadow-sm sm:text-2xl md:text-3xl">{s.title}</h2>
                {s.subtitle && (
                  <p className="line-clamp-2 max-w-md text-[11px] opacity-90 drop-shadow-sm sm:text-xs md:text-sm">{s.subtitle}</p>
                )}
                {s.ctaLabel && (
                  <Link
                    to={s.ctaTo}
                    className="mt-1.5 inline-flex w-fit rounded-full bg-accent/90 px-4 py-1.5 text-xs font-semibold text-accent-foreground transition hover:bg-accent md:text-sm"
                  >
                    {s.ctaLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-foreground/15 text-primary-foreground backdrop-blur-sm transition hover:bg-foreground/25 md:left-3 md:h-9 md:w-9"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-foreground/15 text-primary-foreground backdrop-blur-sm transition hover:bg-foreground/25 md:right-3 md:h-9 md:w-9"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Ir para imagem ${idx + 1}`}
                  className={`h-1 rounded-full transition-all ${idx === i ? "w-4 bg-primary-foreground/90" : "w-1 bg-primary-foreground/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
