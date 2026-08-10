import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { useBlogPostsQuery, useUpdateBlogPostMutation } from "@/lib/hooks/use-blog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/$id")({
  component: EditBlog,
});

function EditBlog() {
  const { id } = Route.useParams();
  const { data: blog = [], isLoading } = useBlogPostsQuery();
  const updateMutation = useUpdateBlogPostMutation();
  const router = useRouter();

  if (isLoading) {
    return (
      <AdminShell title="Editar">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando post…
        </div>
      </AdminShell>
    );
  }

  const post = blog.find((b) => b.id === id);
  if (!post) {
    return <AdminShell title="Editar"><p className="text-sm text-muted-foreground">Post não encontrado.</p></AdminShell>;
  }

  return (
    <AdminShell title={`Editar: ${post.title}`}>
      <BlogForm
        initial={post}
        onSubmit={(v) => {
          updateMutation.mutate(
            { id, ...v },
            {
              onSuccess: () => {
                toast.success("Post atualizado com sucesso");
                router.navigate({ to: "/admin/blog" });
              },
              onError: () => toast.error("Erro ao atualizar post. Tente novamente."),
            },
          );
        }}
      />
    </AdminShell>
  );
}
