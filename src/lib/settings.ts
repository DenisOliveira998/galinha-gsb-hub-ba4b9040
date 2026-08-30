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
        "O Portal Galinha GSB é um site brasileiro especializado em notícias, informações e conteúdos sobre a Galinha Sertaneja Balão (GSB). Nosso objetivo é reunir em um só lugar conhecimento atualizado sobre a raça, abordando temas como criação, manejo, alimentação, reprodução, desenvolvimento, características, genética, seleção de aves e cuidados com o plantel.\n\nProduzimos conteúdos voltados tanto para criadores experientes quanto para pessoas que estão conhecendo a Galinha GSB pela primeira vez. Buscamos oferecer informações claras, úteis e acessíveis, ajudando o leitor a compreender melhor a raça e a tomar decisões mais conscientes antes de adquirir ovos férteis, pintinhos, galinhas ou galos reprodutores.\n\nAlém do trabalho editorial, o Portal Galinha GSB atua como um canal de direcionamento entre interessados e criadores da raça. Por meio de nossos parceiros e intermediadores, ajudamos o consumidor a encontrar criadores selecionados, consultar disponibilidade de aves e ovos férteis e obter informações importantes antes de realizar uma negociação.\n\nNosso propósito é contribuir para a valorização da Galinha Sertaneja Balão, ampliar o acesso à informação e aproximar consumidores de criadores que prezam pela procedência, qualidade do plantel e transparência no atendimento.\n\nO Portal Galinha GSB mantém seu compromisso com a produção de conteúdo informativo e com a divulgação responsável da raça, buscando se tornar uma das principais referências online sobre Galinha GSB e Sertaneja Balão no Brasil.",
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
