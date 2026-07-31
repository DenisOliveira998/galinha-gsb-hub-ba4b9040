import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { CATEGORY_LABELS, ratingAverage, useStore } from "@/lib/mock-store";
import { FavoriteButton } from "@/components/site/favorite-button";
import { StarsDisplay } from "@/components/site/star-rating";
import { useHydrated } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Galinha GSB" },
      { name: "description", content: "Sua lista de desejos com os anúncios salvos do criadouro Galinha GSB." },
      { property: "og:title", content: "Favoritos — Galinha GSB" },
      { property: "og:description", content: "Anúncios que você salvou para ver depois." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const hydrated = useHydrated();
  const posts = useStore((s) => s.posts);
  const favorites = useStore((s) => s.favorites);
  const ratings = useStore((s) => s.ratings);
  const list = hydrated ? posts.filter((p) => (favorites ?? []).includes(p.id)) : [];

  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="flex items-center gap-2 font-display text-3xl md:text-4xl">
            <Heart className="h-7 w-7" /> Favoritos
          </h1>
          <p className="mt-2 text-sm opacity-85 md:text-base">Anúncios que você salvou para ver depois.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {list.length === 0 ? (
          <div className="rounded-3xl bg-muted p-10 text-center text-muted-foreground">
            Você ainda não salvou nenhum anúncio.{" "}
            <Link to="/catalogo" className="font-semibold text-primary hover:underline">Ver catálogo</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const r = ratingAverage(ratings, p.id);
              return (
                <article key={p.id} className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                  <FavoriteButton postId={p.id} title={p.title} className="absolute right-3 top-3 z-10" />
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary md:text-xs">{CATEGORY_LABELS[p.category]}</div>
                    <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-1.5 line-clamp-2 font-display text-base hover:text-primary md:text-lg">
                      {p.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    <div className="mt-1.5"><StarsDisplay average={r.average} count={r.count} /></div>
                    {p.price && <div className="mt-auto pt-3 text-sm font-semibold md:text-base">R$ {p.price.toFixed(2)}</div>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}