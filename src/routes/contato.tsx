import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { whatsappHref, type SiteSettings } from "@/lib/mock-store";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { Instagram, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Galinha GSB" },
      { name: "description", content: "Fale com a Galinha GSB por WhatsApp, Instagram ou e-mail." },
      { property: "og:title", content: "Contato — Galinha GSB" },
      { property: "og:description", content: "Fale conosco para conhecer o plantel e comprar aves da raça GSB." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
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

  // Antes o formulário só mostrava "Mensagem enviada!" sem enviar nada.
  // O projeto não tem serviço de e-mail, então a mensagem é montada e aberta
  // no WhatsApp do criador (ou no e-mail, se não houver WhatsApp configurado).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Informe seu nome."); return; }
    const emailTrim = email.trim();
    if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) { setError("Digite um e-mail válido."); return; }
    if (!message.trim()) { setError("Escreva uma mensagem."); return; }
    setError("");
    const text = [
      `Olá! Meu nome é ${name.trim()}.`,
      message.trim(),
      phone.trim() && `Telefone: ${phone.trim()}`,
      emailTrim && `E-mail: ${emailTrim}`,
      "(mensagem enviada pelo formulário do site)",
    ].filter(Boolean).join("\n\n");
    const hasWhatsapp = Boolean((s.whatsappLink || s.whatsapp || "").replace(/\D/g, ""));
    const target = hasWhatsapp
      ? whatsappHref(s as SiteSettings, text)
      : `mailto:${s.email}?subject=${encodeURIComponent("Contato pelo site — " + name.trim())}&body=${encodeURIComponent(text)}`;
    trackEvent(hasWhatsapp ? "generate_lead" : "contact_click", { method: hasWhatsapp ? "whatsapp" : "email", link_location: "/contato#formulario" });
    window.open(target, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const instagramUrl = s.instagram
    ? /^https?:\/\//i.test(s.instagram)
      ? s.instagram
      : `https://www.instagram.com/${s.instagram.replace(/^@/, "").trim()}`
    : "";

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
            {s.instagram && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition hover:bg-muted"><Instagram className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-semibold">{s.instagram}</div></div></a>}
            {s.youtube && <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition hover:bg-muted"><Youtube className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">YouTube</div><div className="font-semibold">{s.youtube.replace(/^https?:\/\/(www\.)?youtube\.com\//,"youtube.com/")}</div></div></a>}
            {s.address && <div className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><div className="text-xs text-muted-foreground">Endereço</div><div className="font-semibold">{s.address}</div></div></div>}
            {s.email && <a href={`mailto:${s.email}`} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] transition hover:bg-muted"><Mail className="h-5 w-5 text-primary" /><div><div className="text-xs text-muted-foreground">E-mail</div><div className="font-semibold break-all">{s.email}</div></div></a>}
          </div>
        </div>
        {sent ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-card p-8 shadow-[var(--shadow-card)] text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary text-2xl">✓</div>
            <h2 className="mt-4 font-display text-2xl">Sua mensagem está pronta</h2>
            <p className="mt-2 text-sm text-muted-foreground">Abrimos o WhatsApp com o texto preenchido — é só tocar em enviar por lá. Se nada abriu, use o botão de WhatsApp ao lado ou escreva para {s.email || "o nosso e-mail"}.</p>
            <button onClick={() => { setSent(false); setName(""); setEmail(""); setPhone(""); setMessage(""); }} className="mt-6 rounded-full border px-6 py-2 text-sm font-semibold hover:bg-muted">Enviar outra mensagem</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-3xl bg-card p-8 shadow-[var(--shadow-card)]">
            <h2 id="formulario" className="font-display text-2xl">Envie uma mensagem</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ao enviar, sua mensagem abre pronta no WhatsApp do criador.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label className={labelCls}>Nome completo *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome do interessado" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>E-mail (opcional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className={inputCls} />
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
              <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Enviar pelo WhatsApp</button>
            </div>
          </form>
        )}
      </section>
    </SiteLayout>
  );
}