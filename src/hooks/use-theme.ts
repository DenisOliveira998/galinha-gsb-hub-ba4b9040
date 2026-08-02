import { useSyncExternalStore } from "react";

const KEY = "gsb-theme";
export type Theme = "light" | "dark";

const listeners = new Set<() => void>();
let current: Theme = "light";

function emit() {
  listeners.forEach((l) => l());
}

/** Lê o tema realmente aplicado no <html> (definido pelo script inline no head). */
function readDom(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(cb: () => void) {
  if (listeners.size === 0 && typeof document !== "undefined") {
    current = readDom();
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setTheme(next: Theme) {
  current = next;
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage indisponível: tema continua válido na sessão */
    }
  }
  emit();
}

/**
 * Tema visual — totalmente independente do store de configurações do site.
 * Um erro nas configurações (ou em qualquer provider) não afeta o dark mode.
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => "light" as Theme,
  );

  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}

/** Script executado antes da hidratação para evitar flash e perda do tema. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=localStorage.getItem('${KEY}');var d=k?k==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
