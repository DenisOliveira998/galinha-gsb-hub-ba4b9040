import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

const cartItemSchema = z.object({
  postId: z.string(),
  title: z.string(),
  slug: z.string(),
  image: z.string(),
  price: z.number(),
  quantity: z.number(),
});

// Espelha placeOrder() do shop-store.ts — grava um snapshot do pedido no
// banco (histórico consultável no admin), mesmo o checkout finalizando
// via WhatsApp sem gateway de pagamento.
export const placeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      customerId: z.string().optional(),
      items: z.array(cartItemSchema),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const total = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        itemsJson: data.items,
        total,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        notes: data.notes,
      },
    });
    return order;
  });

// Lista pedidos para o admin (histórico de vendas).
export const listOrders = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
});
