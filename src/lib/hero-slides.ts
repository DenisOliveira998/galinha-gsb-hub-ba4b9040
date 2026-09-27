import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin } from "./admin-auth";
import { cached, invalidateAfter } from "./server-cache";

const SLIDES_KEY = "hero:slides";
const SLIDES_TTL = 5 * 60_000; // 5 min

export const listHeroSlides = createServerFn({ method: "GET" }).handler(async () =>
  cached(SLIDES_KEY, SLIDES_TTL, () =>
    prisma.heroSlide.findMany({ orderBy: { order: "asc" } }),
  ),
);

const slideSchema = z.object({
  image: z.string(),
  title: z.string().default(""),
  subtitle: z.string().default(""),
  ctaLabel: z.string().default("Ver catálogo"),
  ctaTo: z.string().default("/catalogo"),
});

export const addHeroSlide = createServerFn({ method: "POST" })
  .validator(slideSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return invalidateAfter(SLIDES_KEY, async () => {
      const max = await prisma.heroSlide.aggregate({ _max: { order: true } });
      return prisma.heroSlide.create({ data: { ...data, order: (max._max.order ?? -1) + 1 } });
    });
  });

// Cria um slide (com valores padrão) para cada imagem enviada de uma vez —
// espelha addHeroSlides do mock-store.ts, usado no upload múltiplo.
export const addHeroSlidesBulk = createServerFn({ method: "POST" })
  .validator(z.object({ images: z.array(z.string()) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return invalidateAfter(SLIDES_KEY, async () => {
      if (!data.images.length) return { ok: true, count: 0 };
      const max = await prisma.heroSlide.aggregate({ _max: { order: true } });
      let order = (max._max.order ?? -1) + 1;
      await prisma.heroSlide.createMany({
        data: data.images.map((image) => ({
          image,
          title: "Novo destaque",
          subtitle: "",
          ctaLabel: "Ver catálogo",
          ctaTo: "/catalogo",
          order: order++,
        })),
      });
      return { ok: true, count: data.images.length };
    });
  });

export const updateHeroSlide = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }).merge(slideSchema.partial()))
  .handler(async ({ data }) => {
    await requireAdmin();
    return invalidateAfter(SLIDES_KEY, async () => {
      const { id, ...rest } = data;
      return prisma.heroSlide.update({ where: { id }, data: rest });
    });
  });

export const deleteHeroSlide = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return invalidateAfter(SLIDES_KEY, async () => {
      await prisma.heroSlide.delete({ where: { id: data.id } });
      return { ok: true };
    });
  });

// Troca a ordem entre o slide e seu vizinho (dir: -1 sobe, 1 desce).
export const moveHeroSlide = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), dir: z.union([z.literal(-1), z.literal(1)]) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    return invalidateAfter(SLIDES_KEY, async () => {
      const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
      const i = slides.findIndex((s) => s.id === data.id);
      const j = i + data.dir;
      if (i < 0 || j < 0 || j >= slides.length) return { ok: false };
      await prisma.$transaction([
        prisma.heroSlide.update({ where: { id: slides[i].id }, data: { order: slides[j].order } }),
        prisma.heroSlide.update({ where: { id: slides[j].id }, data: { order: slides[i].order } }),
      ]);
      return { ok: true };
    });
  });
