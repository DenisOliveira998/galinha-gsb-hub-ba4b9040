// Helpers de SEO compartilhados entre as rotas.

export const SITE_URL = "https://galinhagsb.com.br";
export const SITE_NAME = "Galinha GSB";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

/** Converte caminho relativo ("/logo.png") em URL absoluta — exigido por og:image. */
export function absUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Remove tags HTML e colapsa espaços/quebras de linha. */
export function plainText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Corta o texto no limite sem quebrar palavra no meio. */
export function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—-]+$/, "")}…`;
}

/** Título de página: adiciona " | Galinha GSB" só se couber em ~60 caracteres. */
export function pageTitle(title: string, max = 60): string {
  const suffix = ` | ${SITE_NAME}`;
  return title.length + suffix.length <= max ? `${title}${suffix}` : title;
}

/**
 * O conteúdo do editor (TipTap) pode ter <h1>; a página já tem o H1 do título.
 * Rebaixa h1 → h2 para manter um único H1 por página.
 */
export function demoteH1(html: string | null | undefined): string {
  return (html ?? "").replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
}

/**
 * Remove emojis dos subtítulos (h2–h6) do conteúdo dos posts ("🐣 Começando…"
 * vira "Começando…"). Emojis em títulos passam impressão de texto genérico e
 * poluem o sumário que o Google monta a partir dos subtítulos.
 */
export function stripHeadingEmojis(html: string | null | undefined): string {
  return (html ?? "").replace(/<(h[2-6])(\b[^>]*)>([\s\S]*?)<\/\1>/gi, (_m, tag: string, attrs: string, inner: string) => {
    const clean = inner
      .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
      .replace(/^((?:\s|&nbsp;|<[^>]+>)*)\s+/, "$1")
      .replace(/(>)\s+/, "$1")
      .replace(/\s+((?:<\/[^>]+>)*)$/, "$1");
    return `<${tag}${attrs}>${clean}</${tag}>`;
  });
}
