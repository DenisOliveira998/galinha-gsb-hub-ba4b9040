import { Star } from "lucide-react";
import { useState } from "react";

/** Estrelas somente leitura (usado nos cards). */
export function StarsDisplay({
  average,
  count,
  size = "sm",
}: {
  average: number;
  count: number;
  size?: "sm" | "md";
}) {
  const cls = size === "md" ? "h-4.5 w-4.5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1 text-left">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`${cls} ${n <= Math.round(average) ? "fill-accent-warm text-accent-warm" : "text-muted-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Estrelas interativas (página de detalhe). */
export function StarsInput({
  value,
  onRate,
}: {
  value: number;
  onRate: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Avaliar com ${n} estrela${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onRate(n)}
          className="rounded-full p-0.5 transition hover:scale-110"
        >
          <Star
            className={`h-6 w-6 ${n <= active ? "fill-accent-warm text-accent-warm" : "text-muted-foreground/40"}`}
          />
        </button>
      ))}
    </div>
  );
}
