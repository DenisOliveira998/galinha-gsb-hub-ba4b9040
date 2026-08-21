import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";

// Registro único (id fixo "main") — cria com valores padrão se ainda
// não existir (primeiro acesso após a migração).
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      aboutText:
        "A Galinha GSB (Sertanejo Balão) é uma raça tradicional brasileira, criada com dedicação em nosso plantel há muitos anos.",
    },
  });
  return settings;
});

const updateSettingsSchema = z.object({
  whatsapp: z.string().optional(),
  whatsappLink: z.string().optional(),
  instagram: z.string().optional(),
  email: z.string().optional(),
  aboutText: z.string().optional(),
  brandColor: z.string().optional(),
  siteDescription: z.string().optional(),
  adsensePublisherId: z.string().optional(),
  adsenseSlotHomeBanner: z.string().optional(),
  adsenseSlotHomeRectangle: z.string().optional(),
  adsenseSlotBlog: z.string().optional(),
  badgeImage: z.string().optional(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .validator(updateSettingsSchema)
  .handler(async ({ data }) => {
    return prisma.siteSettings.update({ where: { id: "main" }, data });
  });
