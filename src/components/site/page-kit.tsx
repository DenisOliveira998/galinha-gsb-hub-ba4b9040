import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { whatsappHref, type SiteSettings } from "@/lib/mock-store";
import { plainText } from "@/lib/seo";
import { formatBRL } from "@/lib/format";

// Kit visual compartilhado, extraído da home (out/2026). Todas as páginas usam
// as mesmas peças: topo verde-escuro, etiqueta, títulos em Fraunces, cartões de
// produto, filtros em pílula e a chamada final para o WhatsApp do criador.

export const CONTAINER = "mx-auto w-full max-w-6xl px-4 md:px-8";
export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.16em]";

export function useWhatsapp() {
  const { data: s = EMPTY_SETTINGS } = useSettingsQuery();
  const settings = s as SiteSettings;
  return { settings, href: (text?: string) => whatsappHref(settings, text) };
}

/** Topo verde-escuro das páginas internas. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Botões ou links abaixo do texto. */
  children?: ReactNode;
  /** Coluna à direita (imagem, cartão etc.). */
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_80%_at_85%_30%,color-mix(in_oklab,var(--primary-glow)_24%,transparent),transparent_70%)]"
      />
      <div className={`relative ${CONTAINER} grid items-center gap-8 py-12 md:py-16 ${aside ? "md:grid-cols-[1.2fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          {eyebrow && <p className={`${EYEBROW} text-accent-warm`}>{eyebrow}</p>}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.06] tracking-tight md:text-5xl">{title}</h1>
          {intro && <div className="mt-4 text-base leading-relaxed text-primary-foreground/85 md:text-lg">{intro}</div>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

/** Botões no padrão da home. */
export const btn = {
  accent:
    "inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  outlineOnDark:
    "inline-flex min-h-11 items-center justify-center rounded-full border border-primary-foreground/35 px-6 py-2.5 text-sm font-semibold transition hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-warm",
  outline:
    "inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
};

/** Cabeçalho de seção: etiqueta + título + texto + link à direita. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className={`${EYEBROW} text-primary`}>{eyebrow}</p>}
        <h2 id={id} className="mt-2 font-display text-3xl leading-tight md:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export const textLink = "text-sm font-semibold text-primary underline-offset-4 hover:underline";

/** Filtros em pílula. */
export function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            value === o.id ? "bg-primary-deep text-primary-foreground" : "border border-border bg-card hover:bg-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type ProductLike = {
  id: string;
  slug: string;
  title: string;
  images: string[];
  price?: number | null;
  status: string;
  inStock?: boolean;
};

/** Cartão de produto da home: selo de estado, foto recortada, preço e ação pelo WhatsApp. */
export function ProductCard({ p, category }: { p: ProductLike; category?: string }) {
  const { href } = useWhatsapp();
  const esgotado = p.status === "SOLD" || p.inStock === false;
  const nome = plainText(p.title);
  const acao = href(esgotado ? `Olá! Gostaria de ser avisado quando houver reposição de: ${nome}` : `Olá! Gostaria de reservar: ${nome}`);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="group relative block bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            esgotado ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          }`}
        >
          {esgotado ? "Esgotado" : "Disponível"}
        </span>
        <img
          src={p.images[0]}
          alt={nome}
          loading="lazy"
          decoding="async"
          className={`aspect-square w-full object-contain p-4 transition duration-500 group-hover:scale-[1.04] ${esgotado ? "opacity-70" : ""}`}
        />
      </Link>
      <div className="flex flex-1 flex-col p-3 md:p-4">
        {category && <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>}
        <h3 className="mt-0.5 font-display text-base leading-snug md:text-lg">
          <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="hover:text-primary">
            {nome}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          {p.price ? <span className="text-sm font-semibold tabular-nums md:text-base">{formatBRL(p.price)}</span> : <span />}
          <a
            href={acao}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              esgotado ? "border border-border hover:bg-muted" : "bg-accent text-accent-foreground hover:brightness-105"
            }`}
          >
            {esgotado ? "Avise-me" : "Reservar"}
          </a>
        </div>
      </div>
    </article>
  );
}

/** Chamada final para falar com o criador. */
export function CtaBand({
  title = "Quer reservar a próxima ninhada?",
  text = "Fale direto com o criador para reservar ovos e pintinhos ou tirar dúvidas de manejo.",
  message = "Olá! Vim pelo site e gostaria de conversar sobre a Sertaneja Balão.",
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  const { settings, href } = useWhatsapp();
  return (
    <section className={`${CONTAINER} py-14 md:py-20`}>
      <div className="flex flex-col gap-6 rounded-3xl bg-primary-deep p-7 text-primary-foreground md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <h2 className="font-display text-2xl leading-tight md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-primary-foreground/80 md:text-base">{text}</p>
          {settings.whatsapp && <p className="mt-3 font-display text-lg text-accent-warm">{settings.whatsapp}</p>}
        </div>
        <a href={href(message)} target="_blank" rel="noopener noreferrer" className={`${btn.accent} shrink-0 focus-visible:ring-accent-warm`}>
          Chamar no WhatsApp
        </a>
      </div>
    </section>
  );
}
