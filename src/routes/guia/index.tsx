import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guia da Galinha GSB — Visao Geral | Sertaneja Balao" },
      {
        name: "description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balao: origem, caracteristicas, padrao morfologico, reproducao, alimentacao, manejo e selecao de reprodutores. PDF gratuito.",
      },
      { property: "og:title", content: "Guia da Galinha GSB — Visao Geral" },
      {
        property: "og:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balao: origem, caracteristicas, reproducao, alimentacao e manejo.",
      },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Guia da Galinha GSB — Visao Geral" },
      {
        name: "twitter:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balao: origem, caracteristicas, reproducao, alimentacao e manejo.",
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
            Guia da Galinha GSB: criacao, manejo e caracteristicas da Sertaneja Balao
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
            Um material completo produzido pelo Portal Galinha GSB com tudo o que voce precisa saber sobre a Galinha Sertaneja Balao — da origem historica a selecao de reprodutores.
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

      {/* Introducao */}
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="font-display text-2xl">O que voce vai encontrar neste guia</h2>
          <p>
            Este guia foi integralmente escrito, organizado e desenvolvido pela equipe editorial do Portal de Noticias Galinha GSB. O objetivo e reunir em um unico material informacoes claras, uteis e aprofundadas sobre a <strong>Galinha Sertaneja Balao (GSB)</strong> — tanto para quem esta conhecendo a raca pela primeira vez quanto para criadores que desejam aprofundar seus conhecimentos sobre selecao, reproducao, manejo e caracteristicas.
          </p>
          <p>
            O material e dividido em temas para facilitar a consulta. Clique no tema que mais te interessa ou baixe o PDF completo com todos os 15 capitulos.
          </p>
        </div>
      </section>

      {/* Cards de temas */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Temas do guia</h2>
          <p className="mt-2 text-muted-foreground">Selecione um tema para ler o conteudo completo.</p>

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
            O guia completo tem 20 paginas com tabelas, checklists, glossario e todos os 15 capitulos. Disponivel em PDF gratuito.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href={PDF_URL}
              download="guia-completo-galinha-gsb-sertaneja-balao.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Baixar PDF Gratis
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Ver Catalogo
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
    tag: "Historia",
    title: "Origem e formacao historica",
    summary: "A historia da GSB no sertao da Bahia, o municipio de Baixa Grande e como a selecao regional formou a raca ao longo de decadas.",
  },
  {
    slug: "caracteristicas",
    to: "/guia/caracteristicas",
    tag: "Raca",
    title: "Caracteristicas, padrao morfologico e dimorfismo",
    summary: "Porte gigante, temperamento docil, conformacao arredondada — como avaliar cada parte da ave e as diferencas entre macho e femea.",
  },
  {
    slug: "plumagem",
    to: "/guia/plumagem",
    tag: "Visual",
    title: "Plumagens, cores e leitura visual",
    summary: "Padroes solidos, dilucoes, pintados e tradicionais — como identificar e avaliar cada variedade de plumagem da GSB.",
  },
  {
    slug: "selecao",
    to: "/guia/selecao",
    tag: "Plantel",
    title: "Selecao de reprodutores e formacao do plantel",
    summary: "Como escolher os melhores reprodutores, reconhecer boa procedencia, evitar consanguinidade e registrar acasalamentos.",
  },
  {
    slug: "reproducao",
    to: "/guia/reproducao",
    tag: "Reproducao",
    title: "Reproducao, fertilidade e incubacao",
    summary: "Acasalamento, coleta de ovos ferteis, incubacao artificial e cuidados para garantir boa eclosaо e fertilidade do plantel.",
  },
  {
    slug: "pintinhos",
    to: "/guia/pintinhos",
    tag: "Criacao",
    title: "Pintinhos e desenvolvimento",
    summary: "Os primeiros dias de vida, ambiente ideal, alimentacao por fase, acompanhamento de crescimento e selecao gradual.",
  },
  {
    slug: "alimentacao",
    to: "/guia/alimentacao",
    tag: "Manejo",
    title: "Manejo, instalacoes e alimentacao",
    summary: "Poleiros, ninhos, piso, sombreamento, consumo de racao por fase e como adaptar as instalacoes ao grande porte da GSB.",
  },
  {
    slug: "sanidade",
    to: "/guia/sanidade",
    tag: "Saude",
    title: "Sanidade e observacao diaria",
    summary: "O que observar todos os dias, sinais de alerta, vacinacao, vermifugacao e como manter o plantel saudavel.",
  },
];
