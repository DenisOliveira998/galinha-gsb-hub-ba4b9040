import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .replace(/-/g, "_")
    .toUpperCase();

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const cats = await prisma.categoryItem.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return cats.map((c) => ({
    id: c.id,
    label: c.label,
    image: c.image,
    images: c.images.map((i) => i.url),
  }));
});

export const createCategory = createServerFn({ method: "POST" })
  .validator(z.object({ label: z.string().min(1), image: z.string().optional() }))
  .handler(async ({ data }) => {
    const base = slugify(data.label) || "CATEGORIA";
    const existing = await prisma.categoryItem.findMany({ select: { id: true } });
    const taken = new Set(existing.map((e) => e.id));
    let id = base;
    let n = 2;
    while (taken.has(id)) id = `${base}_${n++}`;

    const maxOrder = await prisma.categoryItem.aggregate({ _max: { order: true } });
    const category = await prisma.categoryItem.create({
      data: {
        id,
        label: data.label.trim(),
        image: data.image,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
    return category;
  });

export const updateCategory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), label: z.string().optional(), image: z.string().optional() }))
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    return prisma.categoryItem.update({ where: { id }, data: rest });
  });

// Bloqueia a exclusão se ainda houver anúncios usando essa categoria —
// o admin deve recategorizar antes de remover (mesma regra definida no
// prompt de gerenciamento dinâmico de categorias).
export const deleteCategory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const count = await prisma.post.count({ where: { categoryId: data.id } });
    if (count > 0) {
      return { ok: false, error: `Existem ${count} anúncio(s) nesta categoria. Recategorize antes de excluir.` };
    }
    await prisma.categoryItem.delete({ where: { id: data.id } });
    return { ok: true };
  });

// Troca a ordem entre a categoria e sua vizinha (dir: -1 sobe, 1 desce).
export const moveCategory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), dir: z.union([z.literal(-1), z.literal(1)]) }))
  .handler(async ({ data }) => {
    const cats = await prisma.categoryItem.findMany({ orderBy: { order: "asc" } });
    const i = cats.findIndex((c) => c.id === data.id);
    const j = i + data.dir;
    if (i < 0 || j < 0 || j >= cats.length) return { ok: false };
    await prisma.$transaction([
      prisma.categoryItem.update({ where: { id: cats[i].id }, data: { order: cats[j].order } }),
      prisma.categoryItem.update({ where: { id: cats[j].id }, data: { order: cats[i].order } }),
    ]);
    return { ok: true };
  });
