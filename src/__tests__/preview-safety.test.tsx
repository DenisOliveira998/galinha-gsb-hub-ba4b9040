import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PreviewBoundary, SafeImagePreview } from "@/components/admin/preview-boundary";
import { BlogPreview } from "@/components/admin/blog-preview";
import { PostPreview } from "@/components/admin/post-preview";

function BrokenPreview(): never {
  throw new Error("preview quebrado");
}

describe("isolamento e fallbacks dos previews do admin", () => {
  it("isola uma falha sem remover o restante da página", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <div>
        <span>Painel continua visível</span>
        <PreviewBoundary><BrokenPreview /></PreviewBoundary>
      </div>,
    );
    expect(screen.getByText("Painel continua visível")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Não foi possível exibir");
    consoleError.mockRestore();
  });

  it("renderiza fallback quando a imagem está ausente", () => {
    render(<SafeImagePreview src={undefined} alt="Capa" className="h-24" />);
    expect(screen.getByText("Nenhuma imagem selecionada")).toBeInTheDocument();
  });

  it("aceita dados antigos, nulos ou incompletos nos previews", () => {
    expect(() => render(
      <>
        <BlogPreview images={undefined} blocks={undefined} />
        <PostPreview images={undefined} faq={undefined} />
      </>,
    )).not.toThrow();
  });
});