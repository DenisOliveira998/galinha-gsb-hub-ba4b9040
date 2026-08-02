import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) return walk(p);
    return /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

describe("campos legados removidos (heroImage)", () => {
  it("nenhum componente/rota lê a propriedade heroImage", () => {
    const offenders = walk(SRC).filter((file) => {
      if (file.includes("__tests__")) return false;
      const code = readFileSync(file, "utf8");
      // A única menção permitida é o `delete` da migração do store.
      return /heroImage/.test(code.replace(/delete persisted\.settings\.heroImage;/g, ""));
    });
    expect(offenders).toEqual([]);
  });

  it("migra um estado antigo (v6 com heroImage) sem quebrar o store", async () => {
    localStorage.setItem(
      "gsb-store",
      JSON.stringify({
        version: 6,
        state: {
          posts: [],
          blog: [],
          settings: {
            whatsapp: "(11) 90000-0000",
            heroImage: "https://exemplo.com/legado.jpg",
          },
          heroSlides: [],
        },
      }),
    );
    vi.resetModules();
    const { useStore } = await import("@/lib/mock-store");
    const settings = useStore.getState().settings;

    expect(settings).toBeDefined();
    expect("heroImage" in settings).toBe(false);
    // Campos válidos do usuário sobrevivem e os novos ganham default.
    expect(settings.whatsapp).toBe("(11) 90000-0000");
    expect(settings.brandColor).toMatch(/^#/);
  });

  it("BrandTheme não quebra o render quando as configurações estão incompletas", async () => {
    vi.resetModules();
    const { useStore } = await import("@/lib/mock-store");
    useStore.setState({ settings: {} as never });
    const { BrandTheme } = await import("@/components/site/brand-theme");

    expect(() =>
      render(
        <div>
          <BrandTheme />
          <span>conteúdo do site</span>
        </div>,
      ),
    ).not.toThrow();
  });
});

afterEach(() => {
  localStorage.clear();
});

beforeEach(() => {
  document.documentElement.className = "";
});
