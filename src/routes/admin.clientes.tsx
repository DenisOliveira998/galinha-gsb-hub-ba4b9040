import { createFileRoute } from "@tanstack/react-router";
import { Users, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listCustomers } from "@/lib/orders";

export const Route = createFileRoute("/admin/clientes")({
  loader: async () => {
    const customers = await listCustomers();
    return { customers };
  },
  component: Clientes,
});

function Clientes() {
  const { customers } = Route.useLoaderData();
  const [copied, setCopied] = useState<string | null>(null);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const all = customers.map((c) => c.email).join(", ");
    navigator.clipboard.writeText(all);
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AdminShell title="Clientes">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-display text-lg">{customers.length} cliente{customers.length !== 1 ? "s" : ""} cadastrado{customers.length !== 1 ? "s" : ""}</span>
        </div>
        {customers.length > 0 && (
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            {copied === "all" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied === "all" ? "Copiado!" : "Copiar todos os e-mails"}
          </button>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-card shadow-[var(--shadow-soft)] overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cadastro</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {c.email}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => copyEmail(c.email)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-muted"
                    >
                      {copied === c.email
                        ? <><Check className="h-3 w-3 text-green-600" /> Copiado</>
                        : <><Copy className="h-3 w-3" /> Copiar</>
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
