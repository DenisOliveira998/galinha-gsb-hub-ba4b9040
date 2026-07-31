import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp, Tag } from "lucide-react";
import { categoryLabel, useCategories, useStore } from "@/lib/mock-store";

/** Termos mais pesquisados (mock — trocar por métricas reais depois). */
const POPULAR = [
  "ovos férteis",
  "galinha sertanejo balão",
  "pintinhos",
  "reprodutor",
  "linhagem pura",
];

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function SearchBox() {
  const navigate = useNavigate();
  const categories = useCategories();
  const posts = useStore((s) => s.posts).filter((p) => p.status !== "DRAFT");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const term = norm(query.trim());

  const catMatches = useMemo(
    () => (term ? categories.filter((c) => norm(c.label).includes(term)).slice(0, 4) : []),
    [categories, term],
  );
  const postMatches = useMemo(
    () =>
      term
        ? posts
            .filter((p) =>
              norm(`${p.title} ${p.description} ${categoryLabel(categories, p.category)}`).includes(term),
            )
            .slice(0, 5)
        : [],
    [posts, categories, term],
  );
  const popular = useMemo(
    () => (term ? POPULAR.filter((p) => norm(p).includes(term)).slice(0, 3) : POPULAR),
    [term],
  );

  const goSearch = (value: string) => {
    setOpen(false);
    navigate({ to: "/catalogo", search: { q: value || undefined } });
  };

  const empty = term && !catMatches.length && !postMatches.length && !popular.length;

  return (
    <div ref={boxRef} className="relative ml-2 flex-1 max-w-md">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goSearch(query.trim());
        }}
      >
        <label className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 ring-1 ring-primary-foreground/20 focus-within:ring-primary-glow/60">
          <Search className="h-4 w-4 opacity-80" />
          <input
            type="search"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder="Buscar por nome ou categoria..."
            aria-label="Buscar no catálogo"
            className="w-full bg-transparent text-sm placeholder:text-primary-foreground/60 focus:outline-none"
          />
        </label>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-[var(--shadow-card)]">
          <div className="max-h-[70vh] overflow-y-auto py-2">
            {catMatches.length > 0 && (
              <Section title="Categorias">
                {catMatches.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/catalogo", search: { cat: c.id } });
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </Section>
            )}

            {postMatches.length > 0 && (
              <Section title="Anúncios">
                {postMatches.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/catalogo/$slug", params: { slug: p.slug } });
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    <img src={p.images[0]} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{p.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {categoryLabel(categories, p.category)}
                        {p.price ? ` · R$ ${p.price.toFixed(2)}` : ""}
                      </span>
                    </span>
                  </button>
                ))}
              </Section>
            )}

            {popular.length > 0 && (
              <Section title="Mais pesquisados">
                {popular.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setQuery(t);
                      goSearch(t);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{t}</span>
                  </button>
                ))}
              </Section>
            )}

            {empty && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nada encontrado para “{query.trim()}”.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}