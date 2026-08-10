import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { useCreatePostMutation } from "@/lib/hooks/use-posts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/novo")({
  component: NewPost,
});

function NewPost() {
  const createMutation = useCreatePostMutation();
  const router = useRouter();
  return (
    <AdminShell title="Novo anúncio">
      <PostForm
        onSubmit={(v) => {
          createMutation.mutate(v, {
            onSuccess: () => {
              toast.success("Anúncio criado com sucesso");
              router.navigate({ to: "/admin/posts" });
            },
            onError: () => toast.error("Erro ao criar anúncio. Tente novamente."),
          });
        }}
      />
    </AdminShell>
  );
}
