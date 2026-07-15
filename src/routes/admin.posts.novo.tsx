import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/posts/novo")({
  component: NewPost,
});

function NewPost() {
  const add = useStore((s) => s.addPost);
  const router = useRouter();
  return (
    <AdminShell title="Novo anúncio">
      <PostForm
        onSubmit={(v) => {
          add(v);
          router.navigate({ to: "/admin/posts" });
        }}
      />
    </AdminShell>
  );
}