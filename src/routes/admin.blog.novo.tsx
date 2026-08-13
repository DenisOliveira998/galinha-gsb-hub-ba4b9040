import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { useCreateBlogPostMutation } from "@/lib/hooks/use-blog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NewBlog,
});

function NewBlog() {
  const createMutation = useCreateBlogPostMutation();
  const router = useRouter();
  return (
    <AdminShell title="Novo post do blog">
      <BlogForm
        loading={createMutation.isPending}
        onSubmit={(v) => {
          if (createMutation.isPending) return;
          createMutation.mutate(v, {
            onSuccess: () => {
              toast.success("Post criado com sucesso");
              router.navigate({ to: "/admin/blog" });
            },
            onError: () => toast.error("Erro ao criar post. Tente novamente."),
          });
        }}
      />
    </AdminShell>
  );
}
