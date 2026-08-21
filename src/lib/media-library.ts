import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin } from "./admin-auth";

// ------------------------------------------------- Estoque de imagens (global)

export const listMediaLibrary = createServerFn({ method: "GET" }).handler(async () => {
  const items = await prisma.mediaLibraryItem.findMany({ orderBy: { createdAt: "desc" } });
  return items.map((i) => i.url);
});

// Adiciona ao estoque, ignorando duplicadas — espelha addMedia do mock-store.ts
export const addMedia = createServerFn({ method: "POST" })
  .validator(z.object({ images: z.array(z.string()) }))
  .handler(async ({ data }) => {
    await requireAdmin();
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
    await requireAdmin();
    await prisma.mediaLibraryItem.deleteMany({ where: { url: data.url } });
    return { ok: true };
  });

// ------------------------------------------------- Imagens por categoria

export const addCategoryImages = createServerFn({ method: "POST" })
  .validator(z.object({ categoryId: z.string(), images: z.array(z.string()) }))
  .handler(async ({ data }) => {
    await requireAdmin();
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
    await requireAdmin();
    await prisma.categoryImage.delete({ where: { id: data.id } });
    return { ok: true };
  });

// Atualiza a URL de uma imagem de categoria pelo ID
export const updateCategoryImage = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), url: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return prisma.categoryImage.update({ where: { id: data.id }, data: { url: data.url } });
  });

// Troca a ordem entre uma imagem e sua vizinha dentro da mesma categoria
export const moveCategoryImage = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), dir: z.union([z.literal(-1), z.literal(1)]) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const image = await prisma.categoryImage.findUniqueOrThrow({ where: { id: data.id } });
    const siblings = await prisma.categoryImage.findMany({
      where: { categoryId: image.categoryId },
      orderBy: { order: "asc" },
    });
    const i = siblings.findIndex((s) => s.id === data.id);
    const j = i + data.dir;
    if (i < 0 || j < 0 || j >= siblings.length) return { ok: false };
    await prisma.$transaction([
      prisma.categoryImage.update({ where: { id: siblings[i].id }, data: { order: siblings[j].order } }),
      prisma.categoryImage.update({ where: { id: siblings[j].id }, data: { order: siblings[i].order } }),
    ]);
    return { ok: true };
  });
