import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Post } from "./mock-store";

// ---------------------------------------------------------------------------
// Cliente / carrinho / pedidos — estado mockado no navegador.
// Persistimos em localStorage para manter o carrinho na sessão. Quando o
// backend real (TiDB Cloud) for conectado, substituir estas ações por
// chamadas de API — a shape das entidades já espelha um modelo de banco.
// ---------------------------------------------------------------------------

export interface CartItem {
  postId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  // Só para mock — nunca fazer isso com senha real.
  password: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    notes?: string;
  };
  createdAt: string;
}

interface ShopState {
  cart: CartItem[];
  customers: Customer[];
  currentCustomerId: string | null;
  orders: Order[];
  addToCart: (post: Post, quantity?: number) => void;
  removeFromCart: (postId: string) => void;
  updateQuantity: (postId: string, quantity: number) => void;
  clearCart: () => void;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  loginCustomer: (email: string, password: string) => { ok: boolean; error?: string };
  /** Define a sessão após autenticação real no servidor (TiDB). */
  setSession: (id: string, name: string, email: string) => void;
  logoutCustomer: () => void;
  placeOrder: (customer: Order["customer"]) => Order;
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      customers: [],
      currentCustomerId: null,
      orders: [],
      addToCart: (post, quantity = 1) => {
        const existing = get().cart.find((i) => i.postId === post.id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.postId === post.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          });
          return;
        }
        set({
          cart: [
            ...get().cart,
            {
              postId: post.id,
              title: post.title,
              slug: post.slug,
              image: post.images[0],
              price: post.price ?? 0,
              quantity,
            },
          ],
        });
      },
      removeFromCart: (postId) =>
        set({ cart: get().cart.filter((i) => i.postId !== postId) }),
      updateQuantity: (postId, quantity) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter((i) => i.postId !== postId) });
          return;
        }
        set({
          cart: get().cart.map((i) =>
            i.postId === postId ? { ...i, quantity } : i,
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      register: (name, email, password) => {
        const emailNorm = email.trim().toLowerCase();
        if (!emailNorm || !password) return { ok: false, error: "Preencha e-mail e senha." };
        if (get().customers.some((c) => c.email === emailNorm)) {
          return { ok: false, error: "Já existe uma conta com este e-mail." };
        }
        const customer: Customer = {
          id: crypto.randomUUID(),
          name: name.trim() || emailNorm,
          email: emailNorm,
          password,
        };
        set({
          customers: [...get().customers, customer],
          currentCustomerId: customer.id,
        });
        return { ok: true };
      },
      loginCustomer: (email, password) => {
        const emailNorm = email.trim().toLowerCase();
        const found = get().customers.find(
          (c) => c.email === emailNorm && c.password === password,
        );
        if (!found) return { ok: false, error: "E-mail ou senha inválidos." };
        set({ currentCustomerId: found.id });
        return { ok: true };
      },
      setSession: (id, name, email) => {
        // Garante que o cliente existe no array local para que conta.index e
        // checkout possam encontrá-lo pelo id, sem precisar de senha local.
        const already = get().customers.some((c) => c.id === id);
        if (!already) {
          set({
            customers: [...get().customers, { id, name, email, password: "" }],
          });
        }
        set({ currentCustomerId: id });
      },
      logoutCustomer: () => set({ currentCustomerId: null }),
      placeOrder: (customer) => {
        const items = get().cart;
        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const order: Order = {
          id: crypto.randomUUID(),
          items,
          total,
          customer,
          createdAt: new Date().toISOString(),
        };
        set({ orders: [order, ...get().orders], cart: [] });
        return order;
      },
    }),
    {
      name: "gsb-shop",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // No-op storage during SSR.
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
    },
  ),
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.quantity, 0);
}

// Monta a URL do WhatsApp (wa.me) com a mensagem pré-preenchida a partir
// dos itens do carrinho. Ao integrar backend real, o número do vendedor
// deve vir das configurações da loja.
export function buildOrderMessage(items: CartItem[]): string {
  const total = cartTotal(items);
  const lines = items.map(
    (i) => `• ${i.title} — ${i.quantity}x (R$ ${(i.price * i.quantity).toFixed(2)})`,
  );
  return [
    "Olá! Gostaria de confirmar o pedido abaixo:",
    "",
    ...lines,
    "",
    `Total: R$ ${total.toFixed(2)}`,
  ].join("\n");
}
