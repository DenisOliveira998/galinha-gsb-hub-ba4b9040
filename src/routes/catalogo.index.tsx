import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { StarsDisplay } from "@/components/site/star-rating";
import { listPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";
import { getRatingSummary } from "@/lib/ratings";

type CatalogSearch = { q?: string; cat?: string };

export const Route = createFileRoute("/catalogo/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — Galinha GSB" },
      { name: "description", content: "Veja todos os ovos férteis, galinhas e reprodutores disponíveis no plantel Galinha GSB — Sertanejo Balão." },
      { property: "og:title", content: "Catálogo — Galinha GSB" },
      { property: "og:description", content: "Ovos férteis, galinhas e reprodutores da raça Sertanejo Balão com procedência garantida." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Catálogo — Galinha GSB" },
      { name: "twitter:description", content: "Ovos férteis, galinhas e reprodutores da raça Sertanejo Balão com procedência garantida." },
    ],
  }),
  loader: async () => {
    const [postsRes, categoriesRes] = await Promise.allSettled([listPosts(), listCategories()]);
    const posts = postsRes.status === "fulfilled" ? postsRes.value : [];
    // Busca média de avaliações de todos os anúncios em paralelo
    const ratingsRes = await Promise.allSettled(
      posts.map((p) => getRatingSummary({ data: { postId: p.id } })),
    );
    const ratingsMap: Record<string, { average: number; count: number }> = {};
    posts.forEach((p, i) => {
      const r = ratingsRes[i];
      ratingsMap[p.id] = r.status === "fulfilled" ? r.value : { average: 0, count: 0 };
    });
    return {
      posts,
      categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : [],
      ratingsMap,
    };
  },
  component: Catalog,
});

function Catalog() {
  const { posts: allPosts, categories, ratingsMap } = Route.useLoaderData();
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
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="font-display text-3xl md:text-4xl">Catálogo</h1>
          <p className="mt-2 max-w-2xl text-sm opacity-85 md:text-base">Encontre ovos férteis, galinhas e reprodutores da raça GSB disponíveis no plantel.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {q && (
          <p className="mb-4 text-sm text-muted-foreground">
            Resultados para <span className="font-semibold text-foreground">"{q}"</span> —{" "}
            <button
              onClick={() =>
                navigate({
                  to: "/catalogo",
                  search: (prev: Record<string, unknown>) => ({ ...prev, q: undefined }),
                })
              }
              className="text-primary hover:underline"
            >
              limpar busca
            </button>
          </p>
        )}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          <FilterChip active={cat === "ALL"} onClick={() => setCat("ALL")}>Todos</FilterChip>
          {categories.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</FilterChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-muted p-10 text-center text-muted-foreground">
            {q ? "Nenhum anúncio encontrado para sua busca." : "Nenhum anúncio nesta categoria no momento."}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article key={p.id} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                {(p.status === "SOLD" || !p.inStock) && <SemEstoqueRibbon />}
                <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-4 text-left md:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary md:text-xs">{catLabel(p.category)}</div>
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-1.5 line-clamp-2 font-display text-base hover:text-primary md:text-lg">
                    {p.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-1.5"><StarsDisplay average={ratingsMap[p.id]?.average ?? 0} count={ratingsMap[p.id]?.count ?? 0} /></div>
                  {(p.status === "SOLD" || !p.inStock)
                    ? <div className="mt-3 text-sm font-semibold text-muted-foreground">Indisponível</div>
                    : p.price && <div className="mt-3 text-sm font-semibold md:text-base">R$ {p.price.toFixed(2)}</div>
                  }
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function SemEstoqueRibbon() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl">
      <div className="absolute right-[-66px] top-[49px] w-[280px] rotate-45 bg-[#1a5c2a] py-2.5 text-center text-[17px] font-bold uppercase tracking-widest text-white shadow-md">
        Sem Estoque
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}
    >
      {children}
    </button>
  );
}
