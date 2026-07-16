import { useState } from "react";
import type { BlogPost } from "@/lib/mock-store";

type V = Omit<BlogPost, "id" | "slug" | "createdAt">;

export function BlogForm({ initial, onSubmit }: { initial?: BlogPost; onSubmit: (v: V) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=80");
  const [published, setPublished] = useState(initial?.published ?? false);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ title, excerpt, content, coverImage, published }); }}
      className="max-w-3xl space-y-6"
    >
      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">
        <F label="titulo"><input value={title} onChange={(e) => setTitle(e.target.value)} required className="i" placeholder="Título do post" /></F>
        <F label="capa_url"><input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="i" placeholder="URL da capa" /></F>
        {coverImage && <img src={coverImage} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />}
        <F label="resumo"><textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="i" placeholder="Resumo curto" /></F>
        <F label="conteudo"><textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="i" placeholder="Conteúdo completo" /></F>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Publicado</label>
      </div>
      <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Salvar</button>
      <style>{`.i{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.75rem 1rem;font-size:.875rem;outline:none}.i:focus{box-shadow:0 0 0 2px var(--color-ring)}`}</style>
    </form>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}