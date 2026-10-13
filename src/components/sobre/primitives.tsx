import { Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { isPending } from "@/content/sobre";
import type { ImageAsset, LinkItem } from "@/content/sobre/types";

/* ------------------------------------------------------------------ */
/* Modo revisão                                                        */
/* ------------------------------------------------------------------ */

export const SobreReviewContext = createContext(false);

export function useSobreReview() {
  return useContext(SobreReviewContext);
}

/**
 * Exibe um valor do conteúdo. Se estiver pendente ("[...]"):
 * - modo revisão → marcação âmbar tracejada;
 * - produção final → não renderiza nada.
 */
export function PendingValue({ value }: { value: string | undefined }) {
  const review = useSobreReview();
  if (!value) return null;
  if (!isPending(value)) return <>{value}</>;
  if (!review) return null;
  return (
    <mark
      className="rounded-md border border-dashed border-accent bg-accent/15 px-1.5 py-0.5 text-[0.85em] font-semibold text-inherit"
      title="Campo pendente de confirmação"
    >
      {value}
    </mark>
  );
}

/** true quando a imagem pode aparecer: verificada, ou qualquer foto em modo revisão. */
export function canShowImage(image: ImageAsset, review: boolean) {
  return !!image.src && (image.verified || review);
}

/** true quando o valor pode aparecer (não pendente, ou pendente em revisão). */
export function useShowValue() {
  const review = useSobreReview();
  return (value: string | undefined) => !!value && (!isPending(value) || review);
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 md:px-8 ${className}`}>{children}</div>;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "default",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "default" | "inverted";
}) {
  const centered = align === "center";
  const inverted = tone === "inverted";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
            inverted ? "text-primary-foreground/80" : "text-primary dark:text-primary-glow"
          }`}
        >
          <span aria-hidden="true" className={`h-px w-6 ${inverted ? "bg-primary-foreground/50" : "bg-primary/60"}`} />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="mt-3 font-display text-3xl leading-tight md:text-4xl">
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-4 text-base leading-relaxed md:text-lg ${
            inverted ? "text-primary-foreground/85" : "text-muted-foreground"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Links e botões                                                      */
/* ------------------------------------------------------------------ */

const EXTERNAL = /^(https?:|mailto:|tel:)|\.pdf$/i;

type SmartLinkProps = {
  link: Pick<LinkItem, "href" | "external">;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/**
 * Rotas internas usam o <Link> do TanStack Router (prefetch + navegação SPA);
 * âncoras, PDFs, e-mail e sites externos usam <a>.
 */
export function SmartLink({ link, className, children, ...rest }: SmartLinkProps) {
  const { href } = link;
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  if (link.external || EXTERNAL.test(href)) {
    const newTab = !href.startsWith("mailto:") && !href.startsWith("tel:");
    return (
      <a
        href={href}
        className={className}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {newTab && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    );
  }
  return (
    // As rotas vêm do arquivo de conteúdo como string; o cast mantém a
    // navegação tipada do router sem exigir um tipo por rota no conteúdo.
    <Link to={href as "/"} className={className} {...rest}>
      {children}
    </Link>
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-6";

export const buttonStyles = {
  /** Laranja do site — mesmo estilo de "Ver catálogo" na home. */
  accent: `${buttonBase} bg-accent text-accent-foreground shadow-[var(--shadow-soft)] hover:brightness-105`,
  primary: `${buttonBase} bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-110`,
  outline: `${buttonBase} border border-border bg-card text-foreground hover:bg-muted`,
  /** Para fundos verdes (hero e chamada final). */
  ghostInverted: `${buttonBase} border border-primary-foreground/25 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10`,
};

/* ------------------------------------------------------------------ */
/* Imagens                                                             */
/* ------------------------------------------------------------------ */

/**
 * Exibe uma imagem do conteúdo respeitando as regras de verificação:
 * - foto verificada → sempre;
 * - foto não verificada → só em modo revisão (com selo "origem a confirmar");
 * - sem foto ou erro de carregamento → `fallback` ou espaço reservado.
 */
export function SobreImage({
  image,
  className = "",
  imgClassName = "",
  priority = false,
  fallback,
}: {
  image: ImageAsset;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  fallback?: ReactNode;
}) {
  const review = useSobreReview();
  const [failed, setFailed] = useState(false);
  const canShow = !failed && canShowImage(image, review);

  if (!canShow) {
    return <div className={`relative overflow-hidden ${className}`}>{fallback ?? <ImagePlaceholder label={image.placeholderLabel} />}</div>;
  }

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <img
        src={image.src ?? undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {!image.verified && review && (
        <span className="absolute left-3 top-3 rounded-full border border-dashed border-accent bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-[var(--shadow-soft)]">
          Origem a confirmar
        </span>
      )}
    </div>
  );
}

/**
 * Painel com a marca, usado no build final quando ainda não existe foto real
 * publicável — evita tanto o "foto em breve" quanto imagens que simulem registro.
 */
export function BrandPanel({ logo, tone = "light" }: { logo: string; tone?: "light" | "inverted" }) {
  const inverted = tone === "inverted";
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center ${
        inverted ? "bg-gradient-to-b from-primary-foreground/10 to-primary-foreground/[0.03]" : "bg-secondary/70 text-secondary-foreground"
      }`}
    >
      <div
        className={`grid h-40 w-40 place-items-center rounded-full md:h-48 md:w-48 ${
          inverted ? "bg-primary-foreground/10 ring-1 ring-primary-foreground/20" : "bg-card shadow-[var(--shadow-soft)]"
        }`}
      >
        <img src={logo} alt="" width={160} height={160} loading="lazy" className="h-28 w-28 object-contain drop-shadow-xl md:h-32 md:w-32" />
      </div>
      <p className="font-display text-xl">Galinha GSB</p>
      <p className="text-xs uppercase tracking-wider opacity-70">Sertaneja Balão</p>
    </div>
  );
}

export function ImagePlaceholder({ label }: { label: string }) {
  const review = useSobreReview();
  const pending = isPending(label);
  const text = pending ? (review ? label : "Fotografia em breve") : label;
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted p-6 text-center text-muted-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--muted-foreground) 22%, transparent) 1px, transparent 0)",
        backgroundSize: "18px 18px",
      }}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary dark:text-primary-glow shadow-[var(--shadow-soft)]">
        <Camera className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="max-w-[16rem] text-xs font-semibold uppercase leading-relaxed tracking-wider">
        {pending && review ? <PendingValue value={label} /> : text}
      </span>
      {!pending && <span className="text-[11px] opacity-80">Espaço reservado para foto real</span>}
    </div>
  );
}
