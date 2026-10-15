import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { PageHero, btn } from "@/components/site/page-kit";
import { CicloCriacao } from "@/components/site/ciclo-criacao";
import { GUIA_CHAPTERS, GUIA_FAQ_POST, chapterByPath } from "@/lib/guia-map";
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
      <PageHero
        eyebrow="Guia da GSB"
        title="Guia da Galinha Sertaneja Balão"
        intro="Criação, manejo e características da raça em 8 temas — da origem histórica à seleção de reprodutores, escritos por quem cria a GSB."
      >
        <a href={PDF_URL} download="guia-completo-galinha-gsb-sertaneja-balao.pdf" className={`${btn.accent} gap-2 focus-visible:ring-accent-warm`}>
          <Download className="h-4 w-4" />
          Baixar o guia em PDF
        </a>
        <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className={btn.outlineOnDark}>
          Ler no navegador
        </a>
      </PageHero>

      {/* Introdução */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
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

      {/* Do ovo à galinha adulta — fases da criação ligadas aos capítulos */}
      <CicloCriacao className="mx-auto max-w-6xl px-4 pb-4 md:px-8" />

      {/* Cards de temas */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Temas do guia</h2>
          <p className="mt-2 text-muted-foreground">Selecione um tema para ler o conteúdo completo.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <Link
                key={t.slug}
                to={t.to as any}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">{t.tag}</div>
                  <div className="mt-1 font-display text-base font-semibold group-hover:text-primary">{t.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.summary}</p>
                  {(() => {
                    const ch = chapterByPath(t.to);
                    return ch && ch.posts.length > 0 ? (
                      <p className="mt-2 text-[11px] font-semibold text-primary/80">
                        Capítulo {ch.num} · {ch.posts.length} {ch.posts.length === 1 ? "artigo" : "artigos"} no blog
                      </p>
                    ) : null;
                  })()}
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hub: cada capítulo do Guia e os posts do blog que o aprofundam */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Artigos do blog por capítulo</h2>
          <p className="mt-2 text-muted-foreground">
            Cada capítulo do guia resume um tema. Os artigos do blog aprofundam esses mesmos temas com exemplos práticos e respostas a dúvidas específicas.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {GUIA_CHAPTERS.map((ch) => (
              <div key={ch.to}>
                <Link to={ch.to as any} className="font-display text-base font-semibold hover:text-primary">
                  {ch.num}. {ch.label}
                </Link>
                <ul className="mt-2 space-y-1.5 border-l-2 border-border pl-4">
                  {ch.posts.map((p) => (
                    <li key={p.slug}>
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-sm text-muted-foreground hover:text-primary hover:underline">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Dúvidas rápidas sobre a raça?{" "}
            <Link to="/blog/$slug" params={{ slug: GUIA_FAQ_POST.slug }} className="font-semibold text-primary hover:underline">
              {GUIA_FAQ_POST.title}
            </Link>
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:px-8 md:py-14">
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
