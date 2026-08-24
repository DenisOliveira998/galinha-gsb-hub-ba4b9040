import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin } from "./admin-auth";

// Registro único (id fixo "main") — cria com valores padrão se ainda
// não existir (primeiro acesso após a migração).
export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      aboutText:
        "A Galinha GSB — sigla para Sertanejo Balão — é uma raça genuinamente brasileira, desenvolvida ao longo de décadas por criadores do interior do país e reconhecida pela rusticidade, porte imponente e qualidade dos ovos. Leonardo Reis trabalha com a raça há mais de 10 anos, construindo um plantel selecionado com foco em linhagem pura, vigor e conformação racial. Cada lote de ovos férteis e cada ave que sai daqui tem origem documentada e passa por critérios rigorosos antes de chegar ao comprador.\n\nO Galinha GSB nasceu da necessidade de reunir em um só lugar informação confiável e acesso direto a material genético de procedência. O blog traz artigos práticos sobre manejo, incubação, nutrição e genética da raça — conteúdo escrito com base na experiência real de criação, sem copiar de outras fontes. O catálogo reúne ovos férteis, pintinhos, galinhas e reprodutores disponíveis no plantel, com descrições honestas sobre cada animal.\n\nSe você está começando com a raça ou quer renovar o plantel com material de qualidade, fale diretamente pelo WhatsApp. Respondemos todas as dúvidas antes da compra — sobre incubação, transporte, manejo e o que mais precisar. A missão aqui é simples: fortalecer a criação da GSB no Brasil, garantindo que a raça chegue nas mãos de quem vai cuidar bem dela.",
      heroTitle: "Conheça a importância da raça GSB",
      heroSubtitle:
        "Ovos férteis, galinhas e reprodutores da linhagem Sertanejo Balão — criados com dedicação, procedência garantida e suporte ao criador.",
    },
  });
  return settings;
});

const updateSettingsSchema = z.object({
  whatsapp: z.string().optional(),
  whatsappLink: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  email: z.string().optional(),
  aboutText: z.string().optional(),
  brandColor: z.string().optional(),
  siteDescription: z.string().optional(),
  adsensePublisherId: z.string().optional(),
  adsenseSlotHomeBanner: z.string().optional(),
  adsenseSlotHomeRectangle: z.string().optional(),
  adsenseSlotBlog: z.string().optional(),
  badgeImage: z.string().optional(),
  ogImage: z.string().optional(),
  heroEyebrow: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
});

export const updateSettings = createServerFn({ method: "POST" })
  .validator(updateSettingsSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    return prisma.siteSettings.update({ where: { id: "main" }, data });
  });
