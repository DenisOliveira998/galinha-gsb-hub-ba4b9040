import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, CATEGORY_LABELS, type Category } from "@/lib/mock-store";
import { useShop } from "@/lib/shop-store";

type CatalogSearch = { q?: string };

export const Route = createFileRoute("/catalogo/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: Catalog,
});

function Catalog() {
  const posts = useStore((s) => s.posts).filter((p) => p.status !== "DRAFT");
  const addToCart = useShop((s) => s.addToCart);
  const navigate = useNavigate();
  const { q } = Route.useSearch();
  const [cat, setCat] = useState<Category | "ALL">("ALL");

  const filtered = useMemo(() => {
    const term = (q ?? "").trim().toLowerCase();
    return posts.filter((p) => {
      if (cat !== "ALL" && p.category !== cat) return false;
      if (!term) return true;
      const haystack = `${p.title} ${p.description} ${CATEGORY_LABELS[p.category]}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [posts, cat, q]);

  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <h1 className="font-display text-4xl md:text-5xl">Catálogo</h1>
          <p className="mt-3 max-w-2xl opacity-85">Encontre ovos férteis, pintinhos, matrizes e reprodutores da raça GSB disponíveis no plantel.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
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
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{CATEGORY_LABELS[c]}</FilterChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-muted p-10 text-center text-muted-foreground">
            {q ? "Nenhum anúncio encontrado para sua busca." : "Nenhum anúncio nesta categoria no momento."}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {filtered.map((p) => (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  {p.status === "SOLD" && (
                    <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Vendido</span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABELS[p.category]}</div>
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-2 font-display text-lg hover:text-primary">
                    {p.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  {p.price && <div className="mt-3 font-semibold">R$ {p.price.toFixed(2)}</div>}
                  {p.status !== "SOLD" && (
                    <div className="mt-4 flex flex-col gap-2">
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