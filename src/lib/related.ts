// Links internos do fim dos posts do blog ("Leia também"): posts relacionados,
// o capítulo do Guia sobre o mesmo tema e o produto do catálogo que combina.
// Sem isso os posts só eram alcançados pela listagem do blog e pela home.

type Topic = {
  keywords: string[];
  guia: { to: string; label: string };
  // trecho do slug do produto que combina com o tema (ex.: "ovos" → ovos-ferteis-duzia)
  product?: string;
};

// Ordem importa: o primeiro tema que casar define o capítulo do Guia.
const TOPICS: Topic[] = [
  { keywords: ["chocar", "incubacao", "ovoscopia", "chocadeira", "eclosao"], guia: { to: "/guia/reproducao", label: "Reprodução, fertilidade e incubação" }, product: "ovos" },
  { keywords: ["ovos", "ovo", "postura"], guia: { to: "/guia/reproducao", label: "Reprodução, fertilidade e incubação" }, product: "ovos" },
  { keywords: ["saude", "doencas", "vacinacao", "sanidade"], guia: { to: "/guia/sanidade", label: "Sanidade e observação diária" } },
  { keywords: ["pintinho", "pintinhos", "crescimento", "receber", "transporte"], guia: { to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" }, product: "pintinho" },
  { keywords: ["alimentacao", "racao", "comida"], guia: { to: "/guia/alimentacao", label: "Manejo, instalações e alimentação" } },
  { keywords: ["galinheiro", "poleiro", "ninho", "quintal", "custa", "custos", "predadores"], guia: { to: "/guia/alimentacao", label: "Manejo, instalações e alimentação" } },
  { keywords: ["cores", "padroes", "plumagem", "variacoes"], guia: { to: "/guia/plumagem", label: "Plumagens, cores e leitura visual" } },
  { keywords: ["origem", "historia", "veio", "baixa", "bahia"], guia: { to: "/guia/origem", label: "Origem e formação histórica" } },
  { keywords: ["reprodutor", "reprodutores", "selecao", "galo"], guia: { to: "/guia/selecao", label: "Seleção de reprodutores e formação do plantel" }, product: "galo" },
  { keywords: ["caracteristicas", "padrao", "temperamento", "mansa", "maior", "gigante", "indio", "brahma"], guia: { to: "/guia/caracteristicas", label: "Características, padrão morfológico e dimorfismo" }, product: "galinha" },
];

const DEFAULT_TOPIC: Topic = {
  keywords: [],
  guia: { to: "/guia", label: "Guia completo da Galinha GSB" },
  product: "galinha",
};

// Palavras comuns a quase todo slug, que não dizem nada sobre o tema.
const STOPWORDS = new Set([
  "a", "o", "e", "de", "da", "do", "das", "dos", "para", "com", "no", "na", "em", "por", "que", "como",
  "galinha", "galinhas", "gsb", "sertaneja", "balao", "guia", "completo", "sobre", "sua", "seu", "ela", "mais",
]);

const words = (slug: string) => slug.split("-").filter((w) => w.length > 2 && !STOPWORDS.has(w));

export function topicFor(slug: string): Topic {
  const ws = new Set(slug.split("-"));
  return TOPICS.find((t) => t.keywords.some((k) => ws.has(k))) ?? DEFAULT_TOPIC;
}

/** Até `limit` posts parecidos: mesmo capítulo do Guia e mais palavras em comum no slug. */
export function relatedPosts<T extends { slug: string; createdAt: string }>(
  current: string,
  all: T[],
  limit = 3,
): T[] {
  const mine = new Set(words(current));
  const myGuia = topicFor(current).guia.to;
  return all
    .filter((p) => p.slug !== current)
    .map((p) => {
      const shared = words(p.slug).filter((w) => mine.has(w)).length;
      const sameGuia = topicFor(p.slug).guia.to === myGuia ? 2 : 0;
      return { p, score: shared + sameGuia };
    })
    .sort((a, b) => b.score - a.score || b.p.createdAt.localeCompare(a.p.createdAt))
    .slice(0, limit)
    .map((x) => x.p);
}

/** Produto publicado e em estoque que combina com o tema; senão qualquer um que combine. */
export function relatedProduct<T extends { slug: string; status: string; inStock?: boolean }>(
  current: string,
  products: T[],
): T | undefined {
  const key = topicFor(current).product;
  if (!key) return undefined;
  const matches = products.filter((p) => p.status === "PUBLISHED" && p.slug.includes(key));
  return matches.find((p) => p.inStock !== false) ?? matches[0];
}
