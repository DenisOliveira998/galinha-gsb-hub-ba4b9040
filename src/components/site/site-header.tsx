import { Link } from "@tanstack/react-router";
import { Egg, Heart, MessageCircle, Moon, ShoppingBag, Sun, User } from "lucide-react";
import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTheme } from "@/hooks/use-theme";
import { cartCount, useShop } from "@/lib/shop-store";
import { useStore, whatsappHref } from "@/lib/mock-store";
import { CartDrawer } from "./cart-drawer";
import { SearchBox } from "./search-box";

export function SiteHeader() {
  const cart = useShop((s) => s.cart);
  const settings = useStore((s) => s.settings);
  const currentCustomerId = useShop((s) => s.currentCustomerId);
  const favorites = useStore((s) => s.favorites);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(cart) : 0;
  const favCount = hydrated ? (favorites ?? []).length : 0;
  const [cartOpen, setCartOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-green text-brand-green-foreground shadow-[var(--shadow-soft)]">
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

          <SearchBox />

          <nav className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>Início</Link>
            <Link to="/catalogo" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Catálogo</Link>
            <Link to="/favoritos" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Favoritos</Link>
            <Link to="/sobre" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Sobre</Link>
            <Link to="/blog" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Blog</Link>
            <Link to="/contato" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Contato</Link>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              {hydrated && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a
              href={whatsappHref(settings, "Olá! Preciso de ajuda.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              title="Falar no WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <Link
              to="/favoritos"
              aria-label="Meus favoritos"
              title="Meus favoritos"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <Heart className="h-5 w-5" />
              {favCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {favCount}
                </span>
              )}
            </Link>
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