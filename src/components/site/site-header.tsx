import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Egg, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartCount, useShop } from "@/lib/shop-store";
import { CartDrawer } from "./cart-drawer";

export function SiteHeader() {
  const cart = useShop((s) => s.cart);
  const currentCustomerId = useShop((s) => s.currentCustomerId);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(cart) : 0;
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchParam = useRouterState({
    select: (s) => (s.location.search as { q?: string })?.q ?? "",
  });
  const [query, setQuery] = useState(searchParam);

  // Sync input with the URL when the user navigates.
  useEffect(() => {
    setQuery(searchParam);
  }, [searchParam]);

  // Debounced live-search: push q to /catalogo as the user types.
  useEffect(() => {
    const t = setTimeout(() => {
      if (query === searchParam) return;
      if (query.trim().length === 0 && !pathname.startsWith("/catalogo")) return;
      navigate({
        to: "/catalogo",
        search: (prev: Record<string, unknown>) => ({ ...prev, q: query || undefined }),
      });
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-primary-deep text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-glow/20 ring-1 ring-primary-glow/40">
              <Egg className="h-5 w-5" />
            </span>
            <div className="hidden leading-tight sm:block">
              <div className="font-display text-lg font-semibold">Galinha GSB</div>
              <div className="text-xs opacity-70">Sertanejo Balão</div>
            </div>
          </Link>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({
                to: "/catalogo",
                search: (prev: Record<string, unknown>) => ({ ...prev, q: query || undefined }),
              });
            }}
            className="ml-2 flex-1 max-w-md"
          >
            <label className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 ring-1 ring-primary-foreground/20 focus-within:ring-primary-glow/60">
              <Search className="h-4 w-4 opacity-80" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou categoria..."
                aria-label="Buscar no catálogo"
                className="w-full bg-transparent text-sm placeholder:text-primary-foreground/60 focus:outline-none"
              />
            </label>
          </form>

          <nav className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>Início</Link>
            <Link to="/catalogo" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Catálogo</Link>
            <Link to="/sobre" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Sobre</Link>
            <Link to="/blog" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Blog</Link>
            <Link to="/contato" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Contato</Link>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Link
              to={currentCustomerId ? "/conta" : "/conta/login"}
              aria-label={currentCustomerId ? "Minha conta" : "Entrar"}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrinho"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}