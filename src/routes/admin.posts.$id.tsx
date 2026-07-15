import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/posts/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const post = useStore((s) => s.posts.find((p) => p.id === id));
  const update = useStore((s) => s.updatePost);
  const router = useRouter();
  if (!post) return <AdminShell title="Editar"><p>Anúncio não encontrado.</p></AdminShell>;
  return (
    <AdminShell title={`Editar: ${post.title}`}>
      <PostForm
        initial={post}
        onSubmit={(v) => {
          update(id, v);
          router.navigate({ to: "/admin/posts" });
        }}
      />
    </AdminShell>
  );
}