import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Heart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/site-layout";
import { FavoriteButton } from "@/components/site/favorite-button";
import { StarsDisplay } from "@/components/site/star-rating";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useFavoritesQuery, useToggleFavoriteMutation } from "@/lib/hooks/use-favorites";
import { useRatingSummaryQuery } from "@/lib/hooks/use-ratings";
import { listCategories } from "@/lib/categories";

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
  loader: async () => {
    const categories = await listCategories().catch(() => []);
    return { categories };
  },
  component: Favoritos,
});

function Favoritos() {
  const { categories } = Route.useLoaderData();
  const { data: allPosts = [] } = usePostsQuery();
  const { data: favoriteIds = [] } = useFavoritesQuery();
  const toggleMutation = useToggleFavoriteMutation();

  const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const list = useMemo(
    () => allPosts.filter((p) => favoriteIds.includes(p.id) && p.status !== "DRAFT"),
    [allPosts, favoriteIds],
  );

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
    selected.forEach((id) => toggleMutation.mutate(id));
    setSelected([]);
    toast.success(n === 1 ? "1 anúncio removido" : `${n} anúncios removidos`);
  };

  const remove = (id: string, title: string) => {
    toggleMutation.mutate(id, {
      onSuccess: () =>
        toast.success("Removido dos favoritos", { description: title }),
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
                list.forEach((p) => toggleMutation.mutate(p.id));
                setSelected([]);
                toast.success("Lista de favoritos limpa");
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
            {list.map((p) => (
              <FavCard
                key={p.id}
                post={p}
                catLabel={catLabel}
                selected={selected.includes(p.id)}
                onToggleSelect={() => toggleSelected(p.id)}
                onRemove={() => remove(p.id, p.title)}
              />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

type Post = ReturnType<typeof usePostsQuery>["data"] extends (infer T)[] | undefined ? T : never;

function FavCard({
  post: p,
  catLabel,
  selected,
  onToggleSelect,
  onRemove,
}: {
  post: NonNullable<Post>;
  catLabel: (id: string) => string;
  selected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
}) {
  const { data: summary } = useRatingSummaryQuery(p.id);
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card text-left shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] ${selected ? "ring-2 ring-primary" : ""}`}>
      <FavoriteButton postId={p.id} title={p.title} className="absolute right-3 top-3 z-10" />
      <label className="absolute left-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-background/85 px-2.5 py-1.5 text-xs font-semibold shadow-[var(--shadow-soft)] backdrop-blur-sm">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
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
        <div className="mt-1.5">
          <StarsDisplay average={summary?.average ?? 0} count={summary?.count ?? 0} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {p.price ? (
            <span className="text-sm font-semibold md:text-base">R$ {p.price.toFixed(2)}</span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remover
          </button>
        </div>
      </div>
    </article>
  );
}
