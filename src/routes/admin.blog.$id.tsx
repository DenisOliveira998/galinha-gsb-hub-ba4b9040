import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/blog/$id")({
  component: EditBlog,
});

function EditBlog() {
  const { id } = Route.useParams();
  const post = useStore((s) => s.blog.find((b) => b.id === id));
  const update = useStore((s) => s.updateBlog);
  const router = useRouter();
  if (!post) return <AdminShell title="Editar"><p>Post não encontrado.</p></AdminShell>;
  return (
    <AdminShell title={`Editar: ${post.title}`}>
      <BlogForm initial={post} onSubmit={(v) => { update(id, v); router.navigate({ to: "/admin/blog" }); }} />
    </AdminShell>
  );
}