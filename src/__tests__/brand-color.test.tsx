import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { normalizeHex, brandTokens, applyBrandColor, DEFAULT_BRAND_COLOR } from "@/lib/brand-color";
import { PostPreview } from "@/components/admin/post-preview";

beforeEach(() => {
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});

describe("validação da cor hexadecimal", () => {
  it("aceita #RRGGBB e normaliza para minúsculas com #", () => {
    expect(normalizeHex("#2D5A3D")).toBe("#2d5a3d");
    expect(normalizeHex("2D5A3D")).toBe("#2d5a3d");
    expect(normalizeHex("  #2d5a3d  ")).toBe("#2d5a3d");
  });

  it("expande a forma curta #RGB", () => {
    expect(normalizeHex("#2a5")).toBe("#22aa55");
    expect(normalizeHex("FFF")).toBe("#ffffff");
  });

  it("rejeita valores inválidos", () => {
    for (const bad of ["", "#", "#12", "#12345", "#1234567", "vermelho", "#gggggg"]) {
      expect(normalizeHex(bad)).toBeNull();
    }
  });

  it("gera tokens válidos mesmo com entrada inválida (fallback no padrão)", () => {
    const tokens = brandTokens("não-é-cor");
    expect(tokens["--primary"]).toMatch(/^oklch\(/);
    expect(tokens).toEqual(brandTokens(DEFAULT_BRAND_COLOR));
  });

  it("aplica os tokens no <html> sem quebrar o dark mode", () => {
    document.documentElement.classList.add("dark");
    applyBrandColor("#2a5");
    expect(document.documentElement.style.getPropertyValue("--primary")).toMatch(/^oklch\(/);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    // Tokens de fundo/texto do tema não são sobrescritos pela cor da marca.
    expect(document.documentElement.style.getPropertyValue("--background")).toBe("");
    expect(document.documentElement.style.getPropertyValue("--foreground")).toBe("");
  });
});

describe("pré-visualização do anúncio", () => {
  it("renderiza título, categoria, preço e FAQ", () => {
    render(
      <PostPreview
        title="Ovos férteis GSB"
        categoryLabel="Ovos Férteis"
        description="Dúzia selecionada"
        price="120.5"
        status="PUBLISHED"
        images={["https://exemplo.com/1.jpg", "https://exemplo.com/2.jpg"]}
        faq={[{ id: "1", question: "Entrega?", answer: "Sim" }]}
      />,
    );
    expect(screen.getByText("Ovos férteis GSB")).toBeInTheDocument();
    expect(screen.getByText("Ovos Férteis")).toBeInTheDocument();
    expect(screen.getByText("Publicado")).toBeInTheDocument();
    expect(screen.getByText("Entrega?")).toBeInTheDocument();
  });

  it("não quebra sem imagens nem campos preenchidos", () => {
    expect(() =>
      render(
        <PostPreview
          title=""
          categoryLabel="Galinhas"
          description=""
          price=""
          status="DRAFT"
          images={[]}
          faq={[]}
        />,
      ),
    ).not.toThrow();
  });
});