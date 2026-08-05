import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Categorias ----------------------------------------------------
  const categories = [
    { id: "OVOS_FERTEIS", label: "Ovos férteis", order: 0 },
    { id: "PINTINHOS", label: "Galinhas", order: 1 },
    { id: "REPRODUTORES", label: "Reprodutores", order: 2 },
  ];
  for (const c of categories) {
    await prisma.categoryItem.upsert({ where: { id: c.id }, update: {}, create: c });
  }

  // ---- Posts/Anúncios --------------------------------------------------
  const posts = [
    {
      title: "Ovos férteis GSB — dúzia selecionada",
      slug: "ovos-ferteis-gsb-duzia",
      categoryId: "OVOS_FERTEIS",
      description:
        "Dúzia de ovos férteis da raça Sertanejo Balão, coletados de aves selecionadas. Alta taxa de eclosão e procedência garantida.",
      price: 120,
      status: "PUBLISHED" as const,
      image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=1200&q=80",
    },
    {
      title: "Pintinhos GSB — 15 dias",
      slug: "pintinhos-gsb-15-dias",
      categoryId: "PINTINHOS",
      description: "Pintinhos saudáveis com 15 dias de vida, vacinados e prontos para o novo criador.",
      price: 45,
      status: "PUBLISHED" as const,
      image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80",
    },
    {
      title: "Reprodutor GSB — linhagem pura",
      slug: "reprodutor-gsb-linhagem-pura",
      categoryId: "REPRODUTORES",
      description: "Galo reprodutor Sertanejo Balão de linhagem pura, excelente conformação e postura.",
      price: 550,
      status: "PUBLISHED" as const,
      image: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1200&q=80",
    },
  ];
  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        categoryId: p.categoryId,
        description: p.description,
        price: p.price,
        status: p.status,
        images: { create: [{ url: p.image, order: 0 }] },
      },
    });
  }

  // ---- Blog --------------------------------------------------------------
  await prisma.blogPost.upsert({
    where: { slug: "cuidados-pintinhos-primeiros-dias" },
    update: {},
    create: {
      title: "Como cuidar de pintinhos GSB nos primeiros dias",
      slug: "cuidados-pintinhos-primeiros-dias",
      excerpt: "Guia rápido com temperatura, alimentação e manejo para receber pintinhos saudáveis.",
      content:
        "Nos primeiros dias, o cuidado com temperatura, ração e água é decisivo para a sobrevivência dos pintinhos. Mantenha o pinteiro entre 32 e 35 °C na primeira semana...",
      coverImage: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&q=80",
      published: true,
    },
  });

  // ---- Hero slides ---------------------------------------------------
  const heroCount = await prisma.heroSlide.count();
  if (heroCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          image: "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=1600&q=80",
          title: "Conheça a raça GSB",
          subtitle: "Ovos férteis, galinhas e reprodutores da linhagem Sertanejo Balão.",
          ctaLabel: "Ver catálogo",
          ctaTo: "/catalogo",
          order: 0,
        },
        {
          image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80",
          title: "Tradição no plantel",
          subtitle: "Mais de 10 anos de dedicação à avicultura sertaneja.",
          ctaLabel: "Sobre a raça",
          ctaTo: "/sobre",
          order: 1,
        },
      ],
    });
  }

  // ---- Configurações do site -----------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      whatsapp: "(00) 00000-0000",
      whatsappLink: "https://wa.me/5500000000000",
      instagram: "@instagram_do_criador",
      email: "email@exemplo.com",
      aboutText:
        "A Galinha GSB (Sertanejo Balão) é uma raça tradicional brasileira, criada com dedicação em nosso plantel há muitos anos. Trabalhamos com procedência garantida, suporte ao criador e amor pela avicultura sertaneja.",
      brandColor: "#3F6B52",
    },
  });

  // ---- Admin -----------------------------------------------------------
  // Troque a senha abaixo antes de rodar em produção!
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@galinhagsb.com" },
    update: {},
    create: { email: "admin@galinhagsb.com", passwordHash },
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
