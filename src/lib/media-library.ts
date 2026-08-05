import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

// ------------------------------------------------- Estoque de imagens (global)

export const listMediaLibrary = createServerFn({ method: "GET" }).handler(async () => {
  const items = await prisma.mediaLibraryItem.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => i.url);
});

// Adiciona ao estoque, ignorando duplicadas — espelha addMedia do mock-store.ts
export const addMedia = createServerFn({ method: "POST" })
  .validator(z.object({ images: z.array(z.string()) }))
  .handler(async ({ data }) => {
    const existing = await prisma.mediaLibraryItem.findMany({
      where: { url: { in: data.images } },
      select: { url: true },
    });
    const existingSet = new Set(existing.map((e) => e.url));
    const toCreate = data.images.filter((url) => url && !existingSet.has(url));
    if (toCreate.length) {
      await prisma.mediaLibraryItem.createMany({ data: toCreate.map((url) => ({ url })) });
    }
    return { ok: true, added: toCreate.length };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .validator(z.object({ url: z.string() }))
  .handler(async ({ data }) => {
    await prisma.mediaLibraryItem.deleteMany({ where: { url: data.url } });
    return { ok: true };
  });

// ------------------------------------------------- Imagens por categoria

export const addCategoryImages = createServerFn({ method: "POST" })
  .validator(z.object({ categoryId: z.string(), images: z.array(z.string()) }))
  .handler(async ({ data }) => {
    if (!data.images.length) return { ok: true };
    const max = await prisma.categoryImage.aggregate({
      where: { categoryId: data.categoryId },
      _max: { order: true },
    });
    let order = (max._max.order ?? -1) + 1;
    await prisma.categoryImage.createMany({
      data: data.images.map((url) => ({ categoryId: data.categoryId, url, order: order++ })),
    });
    await addMedia({ data: { images: data.images } });
    return { ok: true };
  });

export const deleteCategoryImage = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await prisma.categoryImage.delete({ where: { id: data.id } });
    return { ok: true };
  });
