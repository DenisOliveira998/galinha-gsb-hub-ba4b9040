import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { ShoppingBag, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { useShop } from "@/lib/shop-store";
import { FavoriteButton } from "@/components/site/favorite-button";
import { StarsDisplay } from "@/components/site/star-rating";
import { listPosts } from "@/lib/posts";
import { listCategories } from "@/lib/categories";

type CatalogSearch = { q?: string; cat?: string };

export const Route = createFileRoute("/catalogo/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
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
  const addToCart = useShop((s) => s.addToCart);
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
                <FavoriteButton postId={p.id} title={p.title} className="absolute right-3 top-3 z-10" />
                <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  {p.status === "SOLD" && (
                    <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Vendido</span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-4 text-left md:p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary md:text-xs">{catLabel(p.category)}</div>
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-1.5 line-clamp-2 font-display text-base hover:text-primary md:text-lg">
                    {p.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-1.5"><StarsDisplay average={0} count={0} /></div>
                  {p.price && <div className="mt-3 text-sm font-semibold md:text-base">R$ {p.price.toFixed(2)}</div>}
                  {p.status !== "SOLD" && (
                    <div className="mt-auto flex flex-col gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p);
                          toast.success("Adicionado ao carrinho", { description: p.title });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
                      >
                        <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(p);
                          navigate({ to: "/checkout" });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105"
                      >
                        <Zap className="h-4 w-4" /> Comprar agora
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
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
