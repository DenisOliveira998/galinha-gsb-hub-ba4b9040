import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { listPublishedBlogSummaries } from "@/lib/blog";
import { SITE_URL, DEFAULT_OG_IMAGE, plainText } from "@/lib/seo";
import { AUTHOR } from "@/lib/author";

// Página de autor: mostra ao Google (e ao revisor do AdSense) quem escreve o
// conteúdo, com a experiência real do criador e a lista dos artigos dele.
// Os fatos da biografia vêm da página /sobre — não acrescentar nada que não
// seja verdade sobre o Leonardo.

export const Route = createFileRoute("/autor/leonardo-reis")({
  loader: async () => {
    const posts = await listPublishedBlogSummaries().catch(() => []);
    // Foto do autor cadastrada no admin (Autores), se houver.
    const avatar = posts.find((p) => p.author?.name?.toLowerCase().includes("leonardo"))?.author?.avatar ?? null;
    return { posts, avatar };
  },
  head: ({ loaderData }) => {
    const url = `${SITE_URL}${AUTHOR.path}`;
    const title = "Leonardo Reis — Criador de Galinha GSB (Sertaneja Balão)";
    const desc =
      "Leonardo Reis cria galinhas da raça Sertaneja Balão (GSB) há mais de 10 anos e escreve o blog e o Guia da GSB a partir da experiência com o próprio plantel.";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      inLanguage: "pt-BR",
      mainEntity: {
        "@type": "Person",
        name: AUTHOR.name,
        url,
        jobTitle: AUTHOR.role,
        description: desc,
        ...(loaderData?.avatar ? { image: loaderData.avatar } : {}),
        worksFor: { "@type": "Organization", name: "Galinha GSB", url: SITE_URL, logo: DEFAULT_OG_IMAGE },
        knowsAbout: [
          "Galinha Sertaneja Balão",
          "Galinha GSB",
          "Seleção de reprodutores",
          "Incubação de ovos férteis",
          "Criação de pintinhos",
          "Manejo de aves de grande porte",
        ],
      },
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { property: "og:image", content: loaderData?.avatar || DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: AuthorPage,
});

const GUIA_TEMAS = [
  { to: "/guia/origem", label: "Origem e formação histórica" },
  { to: "/guia/caracteristicas", label: "Características e padrão da raça" },
  { to: "/guia/plumagem", label: "Plumagens e cores" },
  { to: "/guia/selecao", label: "Seleção de reprodutores" },
  { to: "/guia/reproducao", label: "Reprodução e incubação" },
  { to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" },
  { to: "/guia/alimentacao", label: "Manejo e alimentação" },
  { to: "/guia/sanidade", label: "Sanidade e observação diária" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function AuthorPage() {
  const { posts, avatar } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-12 md:flex-row md:items-center md:px-8 md:py-16">
          {avatar ? (
            <img src={avatar} alt={AUTHOR.name} className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-primary-glow/30 md:h-28 md:w-28" />
          ) : (
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-primary-glow/20 ring-4 ring-primary-glow/30 md:h-28 md:w-28">
              <UserCircle2 className="h-12 w-12 opacity-80" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest opacity-70">Autor</span>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">{AUTHOR.name}</h1>
            <p className="mt-2 max-w-2xl text-sm opacity-85 md:text-base">{AUTHOR.role} há mais de 10 anos · autor do blog e do Guia da GSB</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-10 text-base leading-relaxed text-muted-foreground md:px-8 md:py-14 md:text-lg">
        <h2 className="font-display text-2xl text-foreground">Sobre o autor</h2>
        <p>
          <strong className="text-foreground">Leonardo Reis</strong> cria galinhas da raça Sertanejo Balão há mais de dez anos.
          Começou com um pequeno lote adquirido de um criador da região e, desde então, seleciona os reprodutores linhagem
          por linhagem. Os animais do plantel têm procedência documentada e histórico de seleção.
        </p>
        <p>
          Tudo o que está no catálogo — ovos férteis, pintinhos, galinhas e galos reprodutores — vem do plantel dele,
          sem intermediários nem revenda de terceiros. Quem entra em contato fala diretamente com ele.
        </p>

        <h2 className="pt-4 font-display text-2xl text-foreground">Como os conteúdos são escritos</h2>
        <p>
          Os artigos do blog e o Guia da GSB são escritos a partir do que Leonardo aprendeu na prática com o próprio
          plantel, complementados pela literatura técnica disponível sobre avicultura de raças locais. O objetivo é ser uma
          referência confiável sobre a Sertanejo Balão, uma raça que ainda tem pouco material publicado em português.
        </p>
        <p className="rounded-2xl bg-muted p-4 text-sm md:text-base">
          O conteúdo é informativo e não substitui a orientação de um médico-veterinário ou zootecnista, principalmente em
          casos de doença, vacinação e uso de medicamentos.
        </p>

        <h2 className="pt-4 font-display text-2xl text-foreground">Temas do Guia da GSB</h2>
        <ul className="grid gap-2 text-base sm:grid-cols-2">
          {GUIA_TEMAS.map((t) => (
            <li key={t.to}>
              <Link to={t.to as any} className="text-primary hover:underline">{t.label}</Link>
            </li>
          ))}
        </ul>

        <p className="pt-2 text-base">
          Quer falar com o Leonardo? Veja a página de <Link to="/contato" className="text-primary hover:underline">contato</Link> ou
          conheça a <Link to="/sobre" className="text-primary hover:underline">história do plantel</Link>.
        </p>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-14 md:px-8">
          <h2 className="font-display text-2xl">Artigos publicados ({posts.length})</h2>
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-baseline justify-between gap-4 px-4 py-3 transition hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground">{plainText(p.title)}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </SiteLayout>
  );
}
