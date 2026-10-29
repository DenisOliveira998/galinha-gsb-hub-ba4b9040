import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, User, X } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTheme } from "@/hooks/use-theme";
import { whatsappHref } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { SearchBox } from "./search-box";
import { BarraSecoes } from "./barra-secoes";

const MOBILE_LINKS = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/blog", label: "Blog" },
  { to: "/guia", label: "Guia da GSB" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const { data: settings } = useSettingsQuery();
  const hydrated = useHydrated();
  const { theme, toggle: toggleTheme } = useTheme();
  // Menu sanduíche (celular/tablet): abaixo de lg a <nav> do topo fica oculta
  // e antes não havia como navegar a não ser pelo rodapé.
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <BarraSecoes />
      <header className="sticky top-0 z-40 bg-brand-green text-brand-green-foreground shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Galinha GSB" className="h-12 w-12 object-contain drop-shadow" />
            <div className="hidden leading-tight sm:block">
              <div className="font-display text-lg font-semibold">Galinha GSB</div>
              <div className="text-xs opacity-70">Balão Sertaneja</div>
            </div>
          </Link>

          <SearchBox />

          <nav className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>Início</Link>
            <Link to="/catalogo" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Catálogo</Link>
            <Link to="/sobre" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Sobre</Link>
            <Link to="/blog" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Blog</Link>
            <Link to="/guia" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Guia da GSB</Link>
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
              href={whatsappHref(settings ?? EMPTY_SETTINGS, "Olá! Preciso de ajuda.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              title="Falar no WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10 md:ml-1 md:flex md:w-auto md:gap-2 md:bg-accent md:px-4 md:text-sm md:font-semibold md:text-accent-foreground md:hover:bg-accent md:hover:brightness-105"
            >
              {/* WhatsApp — Simple Icons (CC0) */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <Link
              to="/conta/login"
              aria-label="Entrar"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-celular"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="menu-celular" aria-label="Menu principal" className="border-t border-primary-foreground/10 lg:hidden">
            <ul className="mx-auto max-w-7xl py-1 text-base">
              {MOBILE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to as any}
                    activeOptions={{ exact: l.to === "/" }}
                    className="block px-5 py-3 opacity-90 hover:bg-primary-foreground/10 hover:opacity-100"
                    activeProps={{ className: "bg-primary-foreground/10 font-semibold opacity-100" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}