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
