import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { whatsappHref } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { Instagram, Mail, MessageCircle, Youtube } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Galinha GSB" },
      { name: "description", content: "Fale com a Galinha GSB por WhatsApp, Instagram ou e-mail." },
      { property: "og:title", content: "Contato — Galinha GSB" },
      { property: "og:description", content: "Fale conosco para conhecer o plantel e comprar aves da raça GSB." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contato — Galinha GSB" },
      { name: "twitter:description", content: "Fale conosco para conhecer o plantel e comprar aves da raça GSB." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: s = EMPTY_SETTINGS } = useSettingsQuery();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Informe seu nome."); return; }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) { setError("Digite um e-mail válido."); return; }
    if (!message.trim()) { setError("Escreva uma mensagem."); return; }
    setError("");
    setSent(true);
  };

  const inputCls = "mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Fale conosco</h1>
          <p className="mt-4 text-muted-foreground">Estamos à disposição para conversar sobre o plantel, tirar dúvidas sobre manejo e ajudar você a escolher os melhores exemplares.</p>
          <div className="mt-8 space-y-4">
            <a href={whatsappHref(s, "Olá! Vim pelo site e gostaria de mais informações.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition hover:bg-muted"><MessageCircle className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-semibold">{s.whatsapp}</div></div></a>
            {s.instagram && <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><Instagram className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-semibold">{s.instagram}</div><div className="text-xs text-muted-foreground mt-0.5">Busque o perfil no aplicativo do Instagram</div></div></div>}
            {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition hover:bg-muted"><Youtube className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">YouTube</div><div className="font-semibold">{s.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\//,"youtube.com/")}</div></div></a>}
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><Mail className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">E-mail</div><div className="font-semibold">{s.email}</div></div></div>
          </div>
        </div>
        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-card p-8 shadow-[var(--shadow-card)] text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary text-2xl">✓</div>
            <h2 className="mt-4 font-display text-2xl">Mensagem enviada!</h2>
            <p className="mt-2 text-sm text-muted-foreground">Obrigado por entrar em contato. Retornaremos em breve.</p>
            <button onClick={() => { setSent(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }} className="mt-6 rounded-full border px-6 py-2 text-sm font-semibold hover:bg-muted">Enviar outra mensagem</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-2xl">Envie uma mensagem</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className={labelCls}>Nome completo *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome do interessado" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>E-mail *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@exemplo.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telefone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Mensagem *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} placeholder="Escreva sua mensagem..." className={inputCls} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Enviar</button>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}