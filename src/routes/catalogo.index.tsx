import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { CONTAINER, CtaBand, FilterChips, PageHero, ProductCard } from "@/components/site/page-kit";
import { AUTHOR } from "@/lib/author";
import { listPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

type CatalogSearch = { q?: string; cat?: string };

export const Route = createFileRoute("/catalogo/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  head: ({ match }) => {
    const hasFilter = !!(match?.search?.cat || match?.search?.q);
    return {
      meta: [
        { title: "Catálogo — Galinha GSB" },
        { name: "description", content: "Veja todos os ovos férteis, galinhas e reprodutores disponíveis no plantel Galinha GSB — Sertanejo Balão." },
        { property: "og:title", content: "Catálogo — Galinha GSB" },
        { property: "og:description", content: "Ovos férteis, galinhas e reprodutores da raça Sertanejo Balão com procedência conhecida." },
        { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "Catálogo — Galinha GSB" },
        { name: "twitter:description", content: "Ovos férteis, galinhas e reprodutores da raça Sertanejo Balão com procedência conhecida." },
        ...(hasFilter ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      // canonical (sempre /catalogo, sem filtros) vem do __root.tsx
    };
  },
  loader: async () => {
    const [postsRes, categoriesRes] = await Promise.allSettled([listPosts(), listCategories()]);
    return {
      posts: postsRes.status === "fulfilled" ? postsRes.value : [],
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
    };
  },
  component: Catalog,
});

function Catalog() {
  const { posts: allPosts, categories } = Route.useLoaderData();
  const posts = allPosts.filter((p) => p.status !== "DRAFT");
  const navigate = useNavigate();
  const { q, cat: catParam } = Route.useSearch();
  const cat = catParam ?? "ALL";
  const setCat = (c: string) =>
    navigate({
      to: "/catalogo",
      search: (prev: Record<string, unknown>) => ({ ...prev, cat: c === "ALL" ? undefined : c }),
    });

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const filtered = useMemo(() => {
    const term = (q ?? "").trim().toLowerCase();
    return posts.filter((p) => {
      if (cat !== "ALL" && p.category !== cat) return false;
      if (!term) return true;
      const haystack = `${p.title} ${p.description} ${catLabel(p.category)}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [posts, cat, q, categories]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Catálogo"
        title="Aves e ovos do plantel"
        intro={`Ovos férteis, pintinhos, galinhas e reprodutores do criatório do ${AUTHOR.name}. A disponibilidade muda conforme a época — itens esgotados continuam aqui para você pedir aviso de reposição.`}
      />

      <section className={`${CONTAINER} pt-10 md:pt-14`}>
        {q && (
          <p className="mb-5 text-sm text-muted-foreground">
            Resultados para <span className="font-semibold text-foreground">"{q}"</span> —{" "}
            <button
              onClick={() =>
                navigate({
                  to: "/catalogo",
                  search: (prev: Record<string, unknown>) => ({ ...prev, q: undefined }),
                })
              }
              className="font-semibold text-primary hover:underline"
            >
              limpar busca
            </button>
          </p>
        )}
        <FilterChips
          label="Filtrar por categoria"
          value={cat}
          onChange={setCat}
          options={[{ id: "ALL", label: "Todos" }, ...categories.map((c) => ({ id: c.id, label: c.label }))]}
        />

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            {q ? "Nenhum item encontrado para essa busca." : "Nenhum item nesta categoria no momento."}
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((p) => (
              <li key={p.id}>
                <ProductCard p={p} category={catLabel(p.category)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CtaBand
        title="Não encontrou o que procura?"
        text="Pergunte ao criador sobre a próxima ninhada, idade das aves, envio ou retirada."
        message="Olá! Vim pelo catálogo do site e tenho uma dúvida."
      />
    </SiteLayout>
  );
}
