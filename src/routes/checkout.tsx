import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { useStore, whatsappHref } from "@/lib/mock-store";
import { buildOrderMessage } from "@/lib/shop-store";
import { SiteLayout } from "@/components/site/site-layout";
import { useHydrated } from "@/hooks/use-hydrated";
import { cartTotal, useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Galinha GSB" }, { name: "robots", content: "noindex" }] }),
  component: Checkout,
});

type Step = "review" | "shipping" | "confirm";

function TextField({ label, value, onChange, type = "text", required, className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; className?: string }) {
  return (
    <label className={className}>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function Steps({ current }: { current: Step }) {
  const items: { id: Step; label: string }[] = [
    { id: "review", label: "Carrinho" },
    { id: "shipping", label: "Entrega" },
    { id: "confirm", label: "Confirmação" },
  ];
  const idx = items.findIndex((i) => i.id === current);
  return (
    <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
      {items.map((it, i) => (
        <li key={it.id} className="flex items-center gap-2">
          <span className={`grid h-6 w-6 place-items-center rounded-full ${i <= idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
          <span className={i <= idx ? "text-foreground" : "text-muted-foreground"}>{it.label}</span>
          {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
        </li>
      ))}
    </ol>
  );
}

function Checkout() {
  const hydrated = useHydrated();
  const cart = useShop((s) => s.cart);
  const settings = useStore((s) => s.settings);
  const currentCustomerId = useShop((s) => s.currentCustomerId);
  const customers = useShop((s) => s.customers);
  const placeOrder = useShop((s) => s.placeOrder);
  const me = customers.find((c) => c.id === currentCustomerId);
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("review");
  const [form, setForm] = useState({
    name: me?.name ?? "", email: me?.email ?? "", phone: "",
    address: "", city: "", state: "", zip: "", notes: "",
  });
  const total = cartTotal(cart);

  if (hydrated && cart.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="font-display text-3xl">Seu carrinho está vazio</h1>
          <p className="mt-2 text-muted-foreground">Adicione produtos para prosseguir.</p>
          <Link to="/catalogo" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Ver catálogo</Link>
        </div>
      </SiteLayout>
    );
  }

  const [formError, setFormError] = useState("");

  const validateShipping = (): string | null => {
    if (!form.name.trim()) return "Informe o nome completo.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) return "Digite um e-mail válido.";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) return "Telefone inválido — mínimo 10 dígitos (DDD + número).";
    const cepDigits = form.zip.replace(/\D/g, "");
    if (cepDigits.length !== 8) return "CEP inválido — deve ter 8 dígitos.";
    if (!form.address.trim()) return "Informe o endereço.";
    if (!form.city.trim()) return "Informe a cidade.";
    if (!form.state.trim()) return "Informe o estado.";
    return null;
  };

  const submit = () => {
    const err = validateShipping();
    if (err) { setFormError(err); setStep("shipping"); return; }
    setFormError("");
    const order = placeOrder(form);
    navigate({ to: "/checkout/confirmado", search: { id: order.id } });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl">Finalizar compra</h1>
        <Steps current={step} />
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-card p-6 shadow-[var(--shadow-soft)]">
            {step === "review" && (
              <>
                <h2 className="font-display text-lg">Revisão do carrinho</h2>
                <ul className="mt-4 divide-y">
                  {cart.map((i) => (
                    <li key={i.postId} className="flex items-center gap-3 py-3">
                      <img src={i.image} alt={i.title} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{i.title}</div>
                        <div className="text-xs text-muted-foreground">Quantidade: {i.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">R$ {(i.price * i.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setStep("shipping")} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105">
                  Continuar <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {step === "shipping" && (
              <>
                <h2 className="font-display text-lg">Dados de entrega e contato</h2>
                <form onSubmit={(e) => { e.preventDefault(); const err = validateShipping(); if (err) { setFormError(err); return; } setFormError(""); setStep("confirm"); }} className="mt-4 grid gap-4 md:grid-cols-2">
                  <TextField label="Nome completo" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <TextField label="E-mail" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <TextField label="Telefone / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                  <TextField label="CEP" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} required />
                  <TextField label="Endereço" value={form.address} onChange={(v) => setForm({ ...form, address: v })} className="md:col-span-2" required />
                  <TextField label="Cidade" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
                  <TextField label="Estado" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
                  <label className="md:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Observações</span>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="mt-1 w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  {formError && <p className="md:col-span-2 text-sm text-destructive">{formError}</p>}
                  <div className="md:col-span-2 flex items-center justify-between">
                    <button type="button" onClick={() => setStep("review")} className="text-sm text-muted-foreground hover:text-foreground">← Voltar</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">Revisar pedido <ChevronRight className="h-4 w-4" /></button>
                  </div>
                </form>
              </>
            )}
            {step === "confirm" && (
              <>
                <h2 className="font-display text-lg">Confirmar pedido</h2>
                <div className="mt-4 grid gap-2 text-sm">
                  <div><span className="text-muted-foreground">Nome:</span> {form.name}</div>
                  <div><span className="text-muted-foreground">E-mail:</span> {form.email}</div>
                  <div><span className="text-muted-foreground">Telefone:</span> {form.phone}</div>
                  <div><span className="text-muted-foreground">Endereço:</span> {form.address}, {form.city}/{form.state} — CEP {form.zip}</div>
                  {form.notes && <div><span className="text-muted-foreground">Obs.:</span> {form.notes}</div>}
                </div>
                <p className="mt-6 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">Pagamento simulado — nenhum gateway real é acionado. O pedido fica registrado no seu navegador para demonstração.</p>
                {formError && <p className="mt-2 text-sm text-destructive">{formError}</p>}
                <div className="mt-6 flex items-center justify-between">
                  <button onClick={() => setStep("shipping")} className="text-sm text-muted-foreground hover:text-foreground">← Voltar</button>
                  <button onClick={submit} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105">
                    <Check className="h-4 w-4" /> Confirmar pedido
                  </button>
                </div>
              </>
            )}
          </div>
          <aside className="h-fit rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="font-display text-lg">Resumo</h2>
            <div className="mt-4 space-y-2 text-sm">
              {cart.map((i) => (
                <div key={i.postId} className="flex justify-between gap-2">
                  <span className="line-clamp-1 text-muted-foreground">{i.quantity}× {i.title}</span>
                  <span>R$ {(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 font-display text-xl"><span>Total</span><span className="text-primary">R$ {total.toFixed(2)}</span></div>
            <a
              href={whatsappHref(settings, buildOrderMessage(cart))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted"
            >
              Falar no WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
