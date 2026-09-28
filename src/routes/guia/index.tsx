import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { AUTHOR } from "@/lib/author";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guia da Galinha GSB — Visão Geral | Sertaneja Balão" },
      {
        name: "description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, padrão morfológico, reprodução, alimentação, manejo e seleção de reprodutores. PDF gratuito.",
      },
      { property: "og:title", content: "Guia da Galinha GSB — Visão Geral" },
      {
        property: "og:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, reprodução, alimentação e manejo.",
      },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Guia da Galinha GSB — Visão Geral" },
      {
        name: "twitter:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, reprodução, alimentação e manejo.",
      },
    ],
  }),
  component: GuiaIndexPage,
});

const PDF_URL = "/guia-completo-galinha-gsb-sertaneja-balao.pdf";

function GuiaIndexPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-70">
            <BookOpen className="h-4 w-4" />
            Material educativo — Portal Galinha GSB · 2026
          </div>
          <h1 className="font-display text-3xl leading-tight md:text-4xl lg:text-5xl">
            Guia da Galinha GSB: criação, manejo e características da Sertaneja Balão
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
            Um material completo produzido pelo Portal Galinha GSB com tudo o que você precisa saber sobre a Galinha Sertaneja Balão — da origem histórica à seleção de reprodutores.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={PDF_URL}
              download="guia-completo-galinha-gsb-sertaneja-balao.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition hover:bg-white/90"
            >
              <Download className="h-4 w-4" />
              Baixar Guia em PDF — Gratuito
            </a>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold opacity-80 transition hover:opacity-100"
            >
              Ler no navegador
            </a>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="font-display text-2xl">O que você vai encontrar neste guia</h2>
          <p>
            Este guia foi escrito e organizado por{" "}
            <Link to={AUTHOR.path as any} className="font-semibold text-primary hover:underline">{AUTHOR.name}</Link>, criador da raça Sertaneja Balão há mais de 10 anos, a partir da experiência com o próprio plantel e da literatura técnica disponível. O objetivo é reunir em um único material informações claras, úteis e aprofundadas sobre a <strong>Galinha Sertaneja Balão (GSB)</strong> — tanto para quem está conhecendo a raça pela primeira vez quanto para criadores que desejam aprofundar seus conhecimentos sobre seleção, reprodução, manejo e características.
          </p>
          <p>
            O material é dividido em temas para facilitar a consulta. Aqui no site estão os 8 temas principais; clique no que mais te interessa. O PDF completo reúne os 15 capítulos, incluindo guia de compra, exposições, checklist e glossário.
          </p>
        </div>
      </section>

      {/* Cards de temas */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Temas do guia</h2>
          <p className="mt-2 text-muted-foreground">Selecione um tema para ler o conteúdo completo.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <Link
                key={t.slug}
                to={t.to as any}
                className="group flex items-start gap-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] hover:ring-1 hover:ring-primary/20"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{t.tag}</div>
                  <div className="mt-1 font-display text-base font-semibold group-hover:text-primary">{t.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.summary}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center md:px-8 md:py-14">
          <h2 className="font-display text-2xl">Prefere ler tudo de uma vez?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            O guia completo tem 20 páginas com tabelas, checklists, glossário e todos os 15 capítulos. Disponível em PDF gratuito.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={PDF_URL}
              download="guia-completo-galinha-gsb-sertaneja-balao.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Baixar PDF Grátis
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const TOPICS = [
  {
    slug: "origem",
    to: "/guia/origem",
    tag: "História",
    title: "Origem e formação histórica",
    summary: "A história da GSB no sertão da Bahia, o município de Baixa Grande e como a seleção regional formou a raça ao longo de décadas.",
  },
  {
    slug: "características",
    to: "/guia/caracteristicas",
    tag: "Raça",
    title: "Características, padrão morfológico e dimorfismo",
    summary: "Porte gigante, temperamento dócil, conformação arredondada — como avaliar cada parte da ave e as diferenças entre macho e femea.",
  },
  {
    slug: "plumagem",
    to: "/guia/plumagem",
    tag: "Visual",
    title: "Plumagens, cores e leitura visual",
    summary: "Padrões sólidos, diluições, pintados e tradicionais — como identificar e avaliar cada variedade de plumagem da GSB.",
  },
  {
    slug: "seleção",
    to: "/guia/selecao",
    tag: "Plantel",
    title: "Seleção de reprodutores e formação do plantel",
    summary: "Como escolher os melhores reprodutores, reconhecer boa procedência, evitar consanguinidade e registrar acasalamentos.",
  },
  {
    slug: "reprodução",
    to: "/guia/reproducao",
    tag: "Reprodução",
    title: "Reprodução, fertilidade e incubação",
    summary: "Acasalamento, coleta de ovos férteis, incubação artificial e cuidados para garantir boa eclosão e fertilidade do plantel.",
  },
  {
    slug: "pintinhos",
    to: "/guia/pintinhos",
    tag: "Criação",
    title: "Pintinhos e desenvolvimento",
    summary: "Os primeiros dias de vida, ambiente ideal, alimentação por fase, acompanhamento de crescimento e seleção gradual.",
  },
  {
    slug: "alimentação",
    to: "/guia/alimentacao",
    tag: "Manejo",
    title: "Manejo, instalações e alimentação",
    summary: "Poleiros, ninhos, piso, sombreamento, consumo de ração por fase e como adaptar as instalações ao grande porte da GSB.",
  },
  {
    slug: "sanidade",
    to: "/guia/sanidade",
    tag: "Saúde",
    title: "Sanidade e observação diária",
    summary: "O que observar todos os dias, sinais de alerta, vacinação, vermifugação e como manter o plantel saudável.",
  },
];
