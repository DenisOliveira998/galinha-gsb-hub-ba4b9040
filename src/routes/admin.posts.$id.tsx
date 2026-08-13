import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { usePostsQuery, useUpdatePostMutation } from "@/lib/hooks/use-posts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const { data: posts = [], isLoading } = usePostsQuery();
  const updateMutation = useUpdatePostMutation();
  const router = useRouter();

  if (isLoading) {
    return (
      <AdminShell title="Editar">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando anúncio…
        </div>
      </AdminShell>
    );
  }

  const post = posts.find((p) => p.id === id);
  if (!post) {
    return <AdminShell title="Editar"><p className="text-sm text-muted-foreground">Anúncio não encontrado.</p></AdminShell>;
  }

  return (
    <AdminShell title={`Editar: ${post.title}`}>
      <PostForm
        initial={post}
        loading={updateMutation.isPending}
        onSubmit={(v) => {
          if (updateMutation.isPending) return;
          updateMutation.mutate(
            { id, ...v },
            {
              onSuccess: () => {
                toast.success("Anúncio atualizado com sucesso");
                router.navigate({ to: "/admin/posts" });
              },
              onError: () => toast.error("Erro ao atualizar anúncio. Tente novamente."),
            },
          );
        }}
      />
    </AdminShell>
  );
}
