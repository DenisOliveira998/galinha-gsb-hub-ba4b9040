import { Link } from "@tanstack/react-router";
import { Moon, Sun, User } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useTheme } from "@/hooks/use-theme";
import { whatsappHref } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { SearchBox } from "./search-box";

export function SiteHeader() {
  const { data: settings } = useSettingsQuery();
  const hydrated = useHydrated();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-green text-brand-green-foreground shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Galinha GSB" className="h-12 w-12 object-contain drop-shadow" />
            <div className="hidden leading-tight sm:block">
              <div className="font-display text-lg font-semibold">Galinha GSB</div>
              <div className="text-xs opacity-70">Sertanejo Balão</div>
            </div>
          </Link>

          <SearchBox />

          <nav className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>Início</Link>
            <Link to="/catalogo" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>Catálogo</Link>
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
              href={whatsappHref(settings ?? EMPTY_SETTINGS, "Olá! Preciso de ajuda.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              title="Falar no WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            </a>
            <Link
              to="/conta/login"
              aria-label="Entrar"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}