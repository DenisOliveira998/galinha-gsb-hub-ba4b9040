/** Preço no formato brasileiro: 35 → "R$ 35,00", 1500 → "R$ 1.500,00". */
export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Descrições de produto salvas como texto puro (com quebras de linha e
 * listas "* item") eram jogadas direto como HTML e viravam um bloco único com
 * asteriscos soltos. Converte em <p> e <ul>. Se já for HTML, devolve igual.
 */
export function plainTextToHtml(text: string | null | undefined): string {
  const src = (text ?? "").trim();
  if (!src || /<\/?[a-z][\s\S]*?>/i.test(src)) return src;
  return src
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length && lines.every((l) => /^[*•-]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${escapeHtml(l.replace(/^[*•-]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      return `<p>${lines.map(escapeHtml).join("<br />")}</p>`;
    })
    .join("");
}

/**
 * Resumo curto de produto para cartões: tira HTML e marcadores, pula a 1ª
 * linha quando ela é só um título ("Galo GSB Reprodutor à Venda") e linhas
 * terminadas em ":" ("Destaques do galo:").
 */
export function productExcerpt(title: string, description: string | null | undefined, max = 140): string {
  const name = title.replace(/<[^>]*>/g, "").trim().toLowerCase();
  const lines = (description ?? "")
    .replace(/<[^>]*>/g, "\n")
    .split("\n")
    .map((l) => l.replace(/^[*•-]\s+/, "").trim())
    .filter(Boolean)
    .filter((l) => !/:$/.test(l)); // "Destaques do galo:"
  const looksLikeHeading = (l: string) => l.length < 60 && !/[.!?…]$/.test(l);
  if (lines.length > 1 && (lines[0].toLowerCase().includes(name) || looksLikeHeading(lines[0]))) lines.shift();
  const text = lines.join(" ").replace(/\s+/g, " ");
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : max).replace(/[\s,.;:—-]+$/, "")}…`;
}
