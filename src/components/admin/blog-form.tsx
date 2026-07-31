import { useState } from "react";
import type { BlogBlock, BlogPost } from "@/lib/mock-store";
import { ImageDropzone } from "./image-dropzone";
import { MediaPickerDialog } from "./media-picker";
import { BlogPreview } from "./blog-preview";
import { ArrowDown, ArrowUp, ClipboardPaste, Images, ImagePlus, Type, X } from "lucide-react";

type V = Omit<BlogPost, "id" | "slug" | "createdAt">;

type Picking = { kind: "cover" } | { kind: "gallery"; index: number | "new" } | { kind: "block"; id: string };

export function BlogForm({ initial, onSubmit }: { initial?: BlogPost; onSubmit: (v: V) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [blocks, setBlocks] = useState<BlogBlock[]>(initial?.blocks ?? []);
  const [picking, setPicking] = useState<Picking | null>(null);

  const addBlock = (type: BlogBlock["type"]) =>
    setBlocks((prev) => [...prev, { id: crypto.randomUUID(), type, text: "", image: "" }]);
  const patchBlock = (id: string, patch: Partial<BlogBlock>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    setBlocks(next);
  };
  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  const pasteInto = async (apply: (t: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) apply(text.trim());
    } catch {
      /* clipboard bloqueado pelo navegador */
    }
  };

  const applyPicked = (image: string) => {
    if (!picking) return;
    if (picking.kind === "cover") setCoverImage(image);
    else if (picking.kind === "gallery") {
      if (picking.index === "new") setImages((prev) => [...prev, image]);
      else setImages((prev) => prev.map((u, k) => (k === picking.index ? image : u)));
    } else patchBlock(picking.id, { image });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          excerpt,
          content,
          coverImage,
          published,
          images,
          blocks: blocks.filter((b) => (b.type === "text" ? b.text?.trim() : b.image?.trim())),
        });
      }}
      className="space-y-6 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6 lg:space-y-0"
    >
      <div className="min-w-0 space-y-6">
      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
        <F label="titulo"><input value={title} onChange={(e) => setTitle(e.target.value)} required className="i" placeholder="Título do post" /></F>
        <F label="resumo"><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="i" placeholder="Resumo curto" /></F>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publicado</label>
      </div>

      {/* -------------------------------------------------------- Capa */}
      <div className="rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-[var(--shadow-soft)] space-y-3">
        <h3 className="font-display text-lg">Capa do post</h3>
        <p className="text-xs text-muted-foreground">Imagem principal, exibida no topo do post e nas listagens.</p>
        <div className="flex flex-wrap gap-2">
          <ImageDropzone variant="plus" multiple={false} label="Enviar capa" onFiles={(urls) => urls[0] && setCoverImage(urls[0])} />
          <button type="button" onClick={() => setPicking({ kind: "cover" })} className="btn-ghost"><Images className="h-4 w-4" /> Usar imagem do estoque</button>
        </div>
        <ImageDropzone multiple={false} onFiles={(urls) => urls[0] && setCoverImage(urls[0])} label="Clique para escolher ou arraste a imagem de capa" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="i" placeholder="Ou cole a URL da capa" />
          <button type="button" title="Colar da área de transferência" onClick={() => void pasteInto(setCoverImage)} className="btn-ghost shrink-0"><ClipboardPaste className="h-4 w-4" /> Colar</button>
        </div>
        {coverImage && (
          <div className="relative">
            <img src={coverImage} alt="Pré-visualização da capa" className="aspect-[16/9] w-full rounded-2xl object-cover" />
            <button type="button" aria-label="Remover capa" onClick={() => setCoverImage("")} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-destructive text-destructive-foreground hover:brightness-110"><X className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {/* --------------------------------------------- Imagens numeradas */}
      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">Imagens do post</h3>
          <span className="text-xs text-muted-foreground">Imagem 1, 2, 3… exibidas na galeria do post.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImageDropzone variant="plus" multiple label="Adicionar imagem" onFiles={(urls) => setImages((prev) => [...prev, ...urls])} />
          <button type="button" onClick={() => setPicking({ kind: "gallery", index: "new" })} className="btn-ghost"><Images className="h-4 w-4" /> Usar imagem do estoque</button>
        </div>
        <ImageDropzone multiple label="Clique para escolher ou arraste várias imagens — um campo é criado para cada uma" onFiles={(urls) => setImages((prev) => [...prev, ...urls])} />
        <div className="grid gap-3 md:grid-cols-3">
          {images.map((url, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl border">
              <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button type="button" aria-label="Remover imagem" onClick={() => setImages(images.filter((_, k) => k !== i))} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-destructive text-destructive-foreground"><X className="h-3 w-3" /></button>
              <div className="flex gap-1 p-2">
                <button type="button" aria-label="Mover para cima" onClick={() => moveImage(i, -1)} className="rounded-lg border p-1.5"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button type="button" aria-label="Mover para baixo" onClick={() => moveImage(i, 1)} className="rounded-lg border p-1.5"><ArrowDown className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => setPicking({ kind: "gallery", index: i })} className="rounded-lg border p-1.5" title="Usar imagem do estoque"><Images className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------ Conteúdo */}
      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
        <h3 className="font-display text-lg">Conteúdo</h3>
        <F label="texto_introdutorio">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="i" placeholder="Texto de abertura do post" />
        </F>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => addBlock("text")} className="btn-ghost"><Type className="h-4 w-4" /> Adicionar bloco de texto</button>
          <button type="button" onClick={() => addBlock("image")} className="btn-ghost"><ImagePlus className="h-4 w-4" /> Adicionar bloco de imagem</button>
        </div>

        <div className="space-y-3">
          {blocks.map((b, i) => (
            <div key={b.id} className="rounded-2xl border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {b.type === "text" ? "Texto" : "Imagem"} — bloco {i + 1}
                </span>
                <div className="flex gap-1">
                  <button type="button" aria-label="Mover para cima" disabled={i === 0} onClick={() => moveBlock(i, -1)} className="rounded-lg border p-1.5 disabled:opacity-40"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" aria-label="Mover para baixo" disabled={i === blocks.length - 1} onClick={() => moveBlock(i, 1)} className="rounded-lg border p-1.5 disabled:opacity-40"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button type="button" aria-label="Remover bloco" onClick={() => setBlocks((prev) => prev.filter((x) => x.id !== b.id))} className="rounded-lg border border-destructive/40 p-1.5 text-destructive"><X className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              {b.type === "text" ? (
                <textarea value={b.text ?? ""} onChange={(e) => patchBlock(b.id, { text: e.target.value })} rows={5} className="i" placeholder="Parágrafo do post" />
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <ImageDropzone variant="plus" multiple={false} label="Enviar imagem" onFiles={(urls) => urls[0] && patchBlock(b.id, { image: urls[0] })} />
                    <button type="button" onClick={() => setPicking({ kind: "block", id: b.id })} className="btn-ghost"><Images className="h-4 w-4" /> Estoque</button>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input value={b.image ?? ""} onChange={(e) => patchBlock(b.id, { image: e.target.value })} className="i" placeholder="Ou cole a URL da imagem" />
                    <button type="button" title="Colar da área de transferência" onClick={() => void pasteInto((t) => patchBlock(b.id, { image: t }))} className="btn-ghost shrink-0"><ClipboardPaste className="h-4 w-4" /> Colar</button>
                  </div>
                  {b.image && <img src={b.image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />}
                </div>
              )}
            </div>
          ))}
          {blocks.length === 0 && (
            <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              Nenhum bloco adicionado. Use os botões acima para intercalar texto e imagens no corpo do post.
            </p>
          )}
        </div>
      </div>

      <MediaPickerDialog open={picking !== null} onClose={() => setPicking(null)} onSelect={applyPicked} />

      <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Salvar</button>
      </div>

      <aside className="lg:sticky lg:top-24">
        <BlogPreview
          title={title}
          excerpt={excerpt}
          content={content}
          coverImage={coverImage}
          images={images}
          blocks={blocks}
        />
      </aside>
      <style>{`.i{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.75rem 1rem;font-size:.875rem;outline:none}.i:focus{box-shadow:0 0 0 2px var(--color-ring)}.btn-ghost{display:inline-flex;align-items:center;gap:.5rem;border-radius:9999px;border:1px solid var(--color-border);padding:.5rem 1rem;font-size:.875rem;font-weight:600}.btn-ghost:hover{background:var(--color-muted)}`}</style>
    </form>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}
