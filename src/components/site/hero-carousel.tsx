import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
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
    <div className="relative w-full max-w-full overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)] ring-4 ring-primary-glow/30">
      <div className="relative aspect-[4/3] w-full bg-muted sm:aspect-[16/10] md:aspect-[16/9]">
        {slides.map((s, idx) => (
          <img
            key={s.id}
            src={s.image}
            alt={s.title || "Galinha Sertanejo Balão"}
            aria-hidden={idx !== i}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 block h-full w-full object-cover object-center transition-opacity duration-700 ${idx === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Imagem anterior"
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-muted-foreground/30 text-primary-foreground backdrop-blur-sm transition hover:bg-muted-foreground/45 md:left-3 md:h-9 md:w-9"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próxima imagem"
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-muted-foreground/30 text-primary-foreground backdrop-blur-sm transition hover:bg-muted-foreground/45 md:right-3 md:h-9 md:w-9"
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
  );
}
