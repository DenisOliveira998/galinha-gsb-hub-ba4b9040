import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useBlogPostsQuery } from "@/lib/hooks/use-blog";
import { FileText, Newspaper, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: posts = [] } = usePostsQuery();
  const { data: blog = [] } = useBlogPostsQuery();
  const published = posts.filter((p) => p.status === "PUBLISHED").length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Anúncios publicados" value={published} icon={FileText} />
        <Stat label="Rascunhos" value={posts.filter((p) => p.status === "DRAFT").length} icon={FileText} />
        <Stat label="Posts do blog" value={blog.length} icon={Newspaper} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link to="/admin/posts" className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]">
          <div>
            <div className="text-sm text-muted-foreground">Gerenciar</div>
            <div className="font-display text-xl">Anúncios do catálogo</div>
          </div>
          <Plus className="h-5 w-5 text-primary" />
        </Link>
        <Link to="/admin/blog" className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]">
          <div>
            <div className="text-sm text-muted-foreground">Gerenciar</div>
            <div className="font-display text-xl">Posts do blog</div>
          </div>
          <Plus className="h-5 w-5 text-primary" />
        </Link>
      </div>
      <div className="mt-8 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Últimos anúncios</h3>
          <Link to="/admin/posts" className="text-sm text-primary">Ver todos</Link>
        </div>
        <div className="divide-y">
          {posts.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.status}</div>
              </div>
              <Link to="/admin/posts/$id" params={{ id: p.id }} className="text-xs text-primary hover:underline">Editar</Link>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">Nenhum anúncio cadastrado ainda.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof FileText }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
    </div>
  );
}
