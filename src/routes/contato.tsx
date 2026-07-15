import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useStore } from "@/lib/mock-store";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Galinha GSB" },
      { name: "description", content: "Fale com a Galinha GSB por WhatsApp, Instagram ou e-mail." },
      { property: "og:title", content: "Contato — Galinha GSB" },
      { property: "og:description", content: "Fale conosco para conhecer o plantel e comprar aves da raça GSB." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const s = useStore((x) => x.settings);
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Fale conosco</h1>
          <p className="mt-4 text-muted-foreground">Estamos à disposição para conversar sobre o plantel, tirar dúvidas sobre manejo e ajudar você a escolher os melhores exemplares.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><MessageCircle className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-semibold">{s.whatsapp}</div></div></div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><Instagram className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-semibold">{s.instagram}</div></div></div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><Mail className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">E-mail</div><div className="font-semibold">{s.email}</div></div></div>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]"
        >
          <h2 className="font-display text-2xl">Envie uma mensagem</h2>
          <div className="mt-6 space-y-4">
            <Field label="nome_completo" placeholder="Nome do interessado" />
            <Field label="email" placeholder="email@exemplo.com" type="email" />
            <Field label="telefone" placeholder="(00) 00000-0000" />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">mensagem</label>
              <textarea rows={4} placeholder="Escreva sua mensagem..." className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Enviar</button>
            {sent && <p className="text-sm text-primary">Mensagem simulada enviada! (mock — conecte ao backend depois)</p>}
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type={type} placeholder={placeholder} className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}