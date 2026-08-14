import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { listAuthors, createAuthor, updateAuthor, deleteAuthor } from "@/lib/authors";

export const Route = createFileRoute("/admin/autores")({
  component: Autores,
});

type Author = { id: string; name: string; avatar: string | null; bio: string | null };

function useAuthorsQuery() {
  return useQuery({ queryKey: ["authors"], queryFn: () => listAuthors() });
}

const EMPTY: Omit<Author, "id"> = { name: "", avatar: null, bio: null };

function Autores() {
  const qc = useQueryClient();
  const { data: authors = [], isLoading } = useAuthorsQuery();
  const [editing, setEditing] = useState<Author | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);

  const createM = useMutation({
    mutationFn: (d: typeof EMPTY) => createAuthor({ data: { name: d.name, avatar: d.avatar ?? undefined, bio: d.bio ?? undefined } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["authors"] }); close(); toast.success("Autor criado"); },
    onError: () => toast.error("Erro ao criar autor"),
  });

  const updateM = useMutation({
    mutationFn: (d: Author) => updateAuthor({ data: { id: d.id, name: d.name, avatar: d.avatar ?? undefined, bio: d.bio ?? undefined } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["authors"] }); close(); toast.success("Autor atualizado"); },
    onError: () => toast.error("Erro ao atualizar autor"),
  });

  const deleteM = useMutation({
    mutationFn: (id: string) => deleteAuthor({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["authors"] }); toast.success("Autor removido"); },
    onError: () => toast.error("Erro ao remover autor"),
  });

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(a: Author) { setEditing(a); setForm({ name: a.name, avatar: a.avatar, bio: a.bio }); setOpen(true); }
  function close() { setOpen(false); setEditing(null); setForm(EMPTY); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Nome obrigatório"); return; }
    if (editing) updateM.mutate({ ...editing, ...form });
    else createM.mutate(form);
  }

  const busy = createM.isPending || updateM.isPending;

  return (
    <AdminShell title="Autores">
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{authors.length} {authors.length === 1 ? "autor" : "autores"} cadastrados</p>
          <button onClick={openNew} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Novo autor
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : authors.length === 0 ? (
          <div className="rounded-2xl bg-muted p-10 text-center text-sm text-muted-foreground">
            Nenhum autor cadastrado. Crie o primeiro!
          </div>
        ) : (
          <div className="space-y-3">
            {authors.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                {a.avatar ? (
                  <img src={a.avatar} alt={a.name} className="h-11 w-11 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{a.name}</p>
                  {a.bio && <p className="text-xs text-muted-foreground line-clamp-1">{a.bio}</p>}
                </div>
                <button onClick={() => openEdit(a)} className="rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-muted flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Editar
                </button>
                <button
                  onClick={() => deleteM.mutate(a.id)}
                  disabled={deleteM.isPending}
                  className="grid h-8 w-8 place-items-center rounded-full border border-destructive/40 text-destructive hover:bg-destructive/10 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg">{editing ? "Editar autor" : "Novo autor"}</h2>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Foto (URL ou upload)</label>
              <div className="mt-1">
                {form.avatar ? (
                  <div className="flex items-center gap-3">
                    <img src={form.avatar} alt="avatar" className="h-14 w-14 rounded-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, avatar: null })} className="text-xs text-destructive hover:underline">Remover</button>
                  </div>
                ) : (
                  <ImageDropzone
                    multiple={false}
                    onFiles={(urls) => urls[0] && setForm({ ...form, avatar: urls[0] })}
                    label="Foto do autor"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio (opcional)</label>
              <textarea
                value={form.bio ?? ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value || null })}
                rows={3}
                className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Breve descrição do autor…"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={busy} className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {busy ? "Salvando…" : editing ? "Salvar alterações" : "Criar autor"}
              </button>
              <button type="button" onClick={close} className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
