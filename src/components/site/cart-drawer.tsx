import { Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { buildOrderMessage, cartCount, cartTotal, useShop } from "@/lib/shop-store";
import { useStore, whatsappHref } from "@/lib/mock-store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const cart = useShop((s) => s.cart);
  const updateQuantity = useShop((s) => s.updateQuantity);
  const removeFromCart = useShop((s) => s.removeFromCart);
  const total = cartTotal(cart);
  const count = cartCount(cart);
  const settings = useStore((s) => s.settings);
  const whatsappUrl = whatsappHref(settings, buildOrderMessage(cart));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Carrinho de compras"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background text-foreground shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg">Seu carrinho</h2>
            <span className="text-sm text-muted-foreground">({count})</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
              <div>
                <ShoppingBag className="mx-auto h-10 w-10 opacity-40" />
                <p className="mt-3">Seu carrinho está vazio.</p>
                <Link
                  to="/catalogo"
                  onClick={onClose}
                  className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.postId}
                  className="flex gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-20 flex-none rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to="/catalogo/$slug"
                      params={{ slug: item.slug }}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1 text-sm text-primary">
                      R$ {item.price.toFixed(2)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.postId, item.quantity - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full border hover:bg-muted"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.postId, item.quantity + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full border hover:bg-muted"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.postId)}
                        className="ml-auto grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="border-t bg-card px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-display text-2xl text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" /> Entrar em contato
              </a>
              <Link
                to="/carrinho"
                onClick={onClose}
                className="w-full rounded-full border px-6 py-3 text-center text-sm font-semibold hover:bg-muted"
              >
                Ver carrinho completo
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}