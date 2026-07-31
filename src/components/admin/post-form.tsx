import { useState } from "react";
import { CATEGORY_LABELS, CATEGORY_PLACEHOLDERS, type Category, type FaqItem, type Post, type PostStatus } from "@/lib/mock-store";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { ImageDropzone } from "./image-dropzone";

type FormValue = Omit<Post, "id" | "slug" | "createdAt">;

export function PostForm({ initial, onSubmit }: { initial?: Post; onSubmit: (v: FormValue) => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "OVOS_FERTEIS");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial?.price?.toString() ?? "");
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? "DRAFT");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [newUrl, setNewUrl] = useState("");
  const [faq, setFaq] = useState<FaqItem[]>(initial?.faq ?? []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      category,
      description,
      price: price ? parseFloat(price) : undefined,
      status,
      images: images.length ? images : [CATEGORY_PLACEHOLDERS[category]],
      faq: faq.filter((f) => f.question.trim() || f.answer.trim()),
    });
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    setImages(next);
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <Card>
        <Field label="titulo">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="input" placeholder="Ovos férteis GSB — dúzia" />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </Field>
          <Field label="status">
            <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className="input">
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </Field>
        </div>
        <Field label="preco_opcional">
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" className="input" placeholder="0.00" />
        </Field>
        <Field label="descricao">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="input" placeholder="Descreva o anúncio..." />
        </Field>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Imagens</h3>
          <span className="text-xs text-muted-foreground">Se vazio, será usado o placeholder da categoria automaticamente.</span>
        </div>
        <div className="mb-3">
          <ImageDropzone
            variant="plus"
            label="Adicionar imagem"
            onFiles={(urls) => setImages((prev) => [...prev, ...urls])}
          />
        </div>
        <ImageDropzone
          label="Clique para escolher ou arraste várias imagens — um campo é criado para cada uma"
          onFiles={(urls) => setImages((prev) => [...prev, ...urls])}
        />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {images.map((url, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border">
              <div className="px-3 pt-2 text-xs font-semibold text-muted-foreground">Imagem {i + 1}</div>
              <img src={url} alt="" className="aspect-square w-full object-cover" />
              <button type="button" aria-label="Remover imagem" onClick={() => setImages(images.filter((_, k) => k !== i))} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-destructive text-destructive-foreground transition hover:brightness-110"><X className="h-3 w-3" /></button>
              <div className="absolute bottom-2 left-2 flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded-md bg-card px-2 py-1 text-xs">←</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded-md bg-card px-2 py-1 text-xs">→</button>
              </div>
              <div className="p-2">
                <ImageDropzone
                  multiple={false}
                  variant="plus"
                  label="Trocar"
                  onFiles={(urls) => urls[0] && setImages((prev) => prev.map((u, k) => (k === i ? urls[0] : u)))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="input flex-1" placeholder="Ou cole a URL de uma imagem" />
          <button
            type="button"
            onClick={() => { if (newUrl.trim()) { setImages([...images, newUrl.trim()]); setNewUrl(""); } }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-105"
          >
            <Upload className="h-4 w-4" /> Adicionar
          </button>
        </div>
      </Card>

      <Card>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg">Perguntas e respostas</h3>
          <button
            type="button"
            onClick={() =>
              setFaq((prev) => [...prev, { id: crypto.randomUUID(), question: "", answer: "" }])
            }
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-105"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Aparecem automaticamente na página pública deste anúncio.
        </p>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <div key={f.id} className="rounded-2xl border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Pergunta {i + 1}</span>
                <button
                  type="button"
                  title="Remover pergunta"
                  aria-label="Remover pergunta"
                  onClick={() => setFaq((prev) => prev.filter((x) => x.id !== f.id))}
                  className="rounded-lg border border-destructive/40 p-1.5 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                value={f.question}
                onChange={(e) => setFaq((prev) => prev.map((x) => (x.id === f.id ? { ...x, question: e.target.value } : x)))}
                className="input"
                placeholder="Pergunta"
              />
              <textarea
                value={f.answer}
                onChange={(e) => setFaq((prev) => prev.map((x) => (x.id === f.id ? { ...x, answer: e.target.value } : x)))}
                rows={3}
                className="input mt-2"
                placeholder="Resposta"
              />
            </div>
          ))}
          {faq.length === 0 && (
            <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              Nenhuma pergunta cadastrada. Use o botão “+ Adicionar”.
            </p>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Salvar</button>
      </div>

      <style>{`.input{width:100%;border-radius:1rem;border:1px solid var(--color-border);background:var(--color-background);padding:.75rem 1rem;font-size:.875rem;outline:none}.input:focus{box-shadow:0 0 0 2px var(--color-ring)}`}</style>
    </form>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] space-y-4">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}