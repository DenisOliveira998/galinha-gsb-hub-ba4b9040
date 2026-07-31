import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Heart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { ratingAverage, useCategoryLabel, useStore } from "@/lib/mock-store";
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
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const list = hydrated ? posts.filter((p) => (favorites ?? []).includes(p.id)) : [];
  const [selected, setSelected] = useState<string[]>([]);
  const ids = useMemo(() => list.map((p) => p.id).join(","), [list]);

  useEffect(() => {
    const valid = new Set(ids ? ids.split(",") : []);
    setSelected((prev) => prev.filter((id) => valid.has(id)));
  }, [ids]);

  const toggleSelected = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const allSelected = list.length > 0 && selected.length === list.length;

  const removeSelected = () => {
    const n = selected.length;
    const removed = [...selected];
    removed.forEach((id) => toggleFavorite(id));
    setSelected([]);
    toast.success(n === 1 ? "1 anúncio removido" : `${n} anúncios removidos`, {
      action: {
        label: "Desfazer",
        onClick: () => {
          const favs = useStore.getState().favorites ?? [];
          removed.filter((id) => !favs.includes(id)).forEach((id) => toggleFavorite(id));
          toast.success("Remoção desfeita");
        },
      },
    });
  };

  const remove = (id: string, title: string) => {
    toggleFavorite(id);
    toast.success("Removido dos favoritos", {
      description: title,
      action: {
        label: "Desfazer",
        onClick: () => {
          if (!(useStore.getState().favorites ?? []).includes(id)) toggleFavorite(id);
          toast.success("Remoção desfeita");
        },
      },
    });
  };

  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="flex items-center gap-2 font-display text-3xl md:text-4xl">
            <Heart className="h-7 w-7" /> Favoritos
          </h1>
          <p className="mt-2 text-sm opacity-85 md:text-base">
            Anúncios salvos ficam guardados na sua lista e voltam automaticamente na próxima visita.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {list.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {list.length} {list.length === 1 ? "anúncio salvo" : "anúncios salvos"}
                {selected.length > 0 ? ` · ${selected.length} selecionado(s)` : ""}
              </p>
              <button
                type="button"
                onClick={() => setSelected(allSelected ? [] : list.map((p) => p.id))}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
              >
                <Check className="h-3.5 w-3.5" /> {allSelected ? "Desmarcar todos" : "Selecionar todos"}
              </button>
              {selected.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={removeSelected}
                    className="inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition hover:opacity-90"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover selecionados ({selected.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected([])}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5" /> Limpar seleção
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                const removed = list.map((p) => p.id);
                removed.forEach((id) => toggleFavorite(id));
                setSelected([]);
                toast.success("Lista de favoritos limpa", {
                  action: {
                    label: "Desfazer",
                    onClick: () => {
                      const favs = useStore.getState().favorites ?? [];
                      removed.filter((id) => !favs.includes(id)).forEach((id) => toggleFavorite(id));
                      toast.success("Lista restaurada");
                    },
                  },
                });
              }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" /> Limpar lista
            </button>
          </div>
        )}
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
                <article key={p.id} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] ${selected.includes(p.id) ? "ring-2 ring-primary" : ""}`}>
                  <FavoriteButton postId={p.id} title={p.title} className="absolute right-3 top-3 z-10" />
                  <label className="absolute left-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-background/85 px-2.5 py-1.5 text-xs font-semibold shadow-[var(--shadow-soft)] backdrop-blur-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    Selecionar
                  </label>
                  <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden">
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </Link>
                  <div className="flex flex-1 flex-col p-4 text-left">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary md:text-xs">{catLabel(p.category)}</div>
                    <Link to="/catalogo/$slug" params={{ slug: p.slug }} className="mt-1.5 line-clamp-2 font-display text-base hover:text-primary md:text-lg">
                      {p.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    <div className="mt-1.5"><StarsDisplay average={r.average} count={r.count} /></div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      {p.price ? (
                        <span className="text-sm font-semibold md:text-base">R$ {p.price.toFixed(2)}</span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => remove(p.id, p.title)}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remover
                      </button>
                    </div>
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