import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore, CATEGORY_LABELS, type Category } from "@/lib/mock-store";

export const Route = createFileRoute("/catalogo/")({
  component: Catalog,
});

function Catalog() {
  const posts = useStore((s) => s.posts).filter((p) => p.status !== "DRAFT");
  const [cat, setCat] = useState<Category | "ALL">("ALL");
  const filtered = cat === "ALL" ? posts : posts.filter((p) => p.category === cat);

  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <h1 className="font-display text-4xl md:text-5xl">Catálogo</h1>
          <p className="mt-3 max-w-2xl opacity-85">Encontre ovos férteis, pintinhos, matrizes e reprodutores da raça GSB disponíveis no plantel.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "ALL"} onClick={() => setCat("ALL")}>Todos</FilterChip>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{CATEGORY_LABELS[c]}</FilterChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl bg-muted p-10 text-center text-muted-foreground">Nenhum anúncio nesta categoria no momento.</div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {filtered.map((p) => (
              <Link key={p.id} to="/catalogo/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  {p.status === "SOLD" && (
                    <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">Vendido</span>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{CATEGORY_LABELS[p.category]}</div>
                  <h3 className="mt-2 font-display text-lg">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  {p.price && <div className="mt-3 font-semibold">R$ {p.price.toFixed(2)}</div>}
                </div>
              </Link>
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
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"}`}
    >
      {children}
    </button>
  );
}