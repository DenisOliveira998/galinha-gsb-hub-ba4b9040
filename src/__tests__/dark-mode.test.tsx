import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useTheme, setTheme, THEME_INIT_SCRIPT } from "@/hooks/use-theme";

function ThemeProbe() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="alternar">
      {theme}
    </button>
  );
}

function runInitScript() {
  // Reproduz o script inline do <head> (executado antes da hidratação).
  new Function(THEME_INIT_SCRIPT)();
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
  setTheme("light");
});

describe("dark mode", () => {
  it("alterna a classe .dark no <html> e persiste a escolha", async () => {
    render(<ThemeProbe />);
    expect(screen.getByLabelText("alternar")).toHaveTextContent("light");

    await act(async () => {
      screen.getByLabelText("alternar").click();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("gsb-theme")).toBe("dark");
    expect(screen.getByLabelText("alternar")).toHaveTextContent("dark");
  });

  it("restaura o tema salvo antes da hidratação (sem flash)", () => {
    localStorage.setItem("gsb-theme", "dark");
    runInitScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("respeita a preferência do sistema quando não há escolha salva", () => {
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as unknown as MediaQueryList);
    runInitScript();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    spy.mockRestore();
  });

  it("continua funcionando mesmo se o store de configurações falhar", async () => {
    vi.resetModules();
    vi.doMock("@/lib/mock-store", () => {
      throw new Error("store quebrado");
    });
    const { useTheme: freshUseTheme } = await import("@/hooks/use-theme");
    function Probe() {
      const { theme, toggle } = freshUseTheme();
      return <button onClick={toggle} aria-label="p2">{theme}</button>;
    }
    render(<Probe />);
    await act(async () => {
      screen.getByLabelText("p2").click();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    vi.doUnmock("@/lib/mock-store");
  });

  it("todos os componentes compartilham o mesmo estado de tema (site e admin)", async () => {
    render(
      <div>
        <ThemeProbe />
        <ThemeProbe />
      </div>,
    );
    const [site, admin] = screen.getAllByLabelText("alternar");
    await act(async () => {
      site.click();
    });
    expect(site).toHaveTextContent("dark");
    expect(admin).toHaveTextContent("dark");
  });
});
