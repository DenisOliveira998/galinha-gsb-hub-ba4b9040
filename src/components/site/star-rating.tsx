import { Star } from "lucide-react";
import { useState } from "react";

/** Estrelas somente leitura com suporte a decimais (ex: 4.3 → estrela parcialmente preenchida). */
export function StarsDisplay({
  average,
  count,
  size = "sm",
}: {
  average: number;
  count: number;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? 18 : 14;
  return (
    <div className="flex items-center gap-1 text-left">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => {
          // Quanto desta estrela está preenchido: 0 a 1
          const fill = Math.min(1, Math.max(0, average - (n - 1)));
          const pct = Math.round(fill * 100);
          const id = `sg-${n}-${dim}`;
          return (
            <svg key={n} width={dim} height={dim} viewBox="0 0 24 24" style={{ display: "block" }}>
              <defs>
                <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${pct}%`} stopColor="var(--color-accent-warm)" />
                  <stop offset={`${pct}%`} stopColor="currentColor" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${id})`}
                stroke={pct > 0 ? "var(--color-accent-warm)" : "currentColor"}
                strokeOpacity={pct > 0 ? 1 : 0.35}
                strokeWidth="1.5"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          );
        })}
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
