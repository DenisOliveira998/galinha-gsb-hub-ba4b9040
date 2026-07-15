import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { useStore } from "@/lib/mock-store";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NewBlog,
});

function NewBlog() {
  const add = useStore((s) => s.addBlog);
  const router = useRouter();
  return (
    <AdminShell title="Novo post do blog">
      <BlogForm onSubmit={(v) => { add(v); router.navigate({ to: "/admin/blog" }); }} />
    </AdminShell>
  );
}