import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Download, CheckSquare } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";

export const Route = createFileRoute("/guia-galinha-gsb")({
  head: () => ({
    meta: [
      { title: "Guia Completo da Galinha GSB — Sertaneja Balão" },
      {
        name: "description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, padrão morfológico, reprodução, alimentação, manejo e seleção de reprodutores. Conteúdo educativo em PDF gratuito.",
      },
      { property: "og:title", content: "Guia Completo da Galinha GSB — Sertaneja Balão" },
      {
        property: "og:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, padrão morfológico, reprodução, alimentação, manejo e seleção de reprodutores.",
      },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Guia Completo da Galinha GSB — Sertaneja Balão" },
      {
        name: "twitter:description",
        content:
          "Guia completo sobre a Galinha GSB Sertaneja Balão: origem, características, padrão morfológico, reprodução, alimentação, manejo e seleção de reprodutores.",
      },
    ],
  }),
  component: GuiaPage,
});

const PDF_URL = "/guia-completo-galinha-gsb-sertaneja-balao.pdf";

function GuiaPage() {
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
            Um material completo produzido pela equipe editorial do Portal Galinha GSB para reunir em um único lugar tudo o que você precisa saber sobre a Galinha Sertaneja Balão — da origem histórica à seleção de reprodutores.
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

      {/* Intro + sumário */}
      <section className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_280px]">
          {/* Texto introdutório */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="font-display text-2xl">O que você vai encontrar neste guia</h2>
            <p>
              Este guia foi integralmente escrito, organizado e desenvolvido pela equipe editorial do Portal de Notícias Galinha GSB. O objetivo é reunir em um único material informações claras, úteis e aprofundadas sobre a <strong>Galinha Sertaneja Balão (GSB)</strong> — tanto para quem está conhecendo a raça pela primeira vez quanto para criadores que desejam aprofundar seus conhecimentos sobre seleção, reprodução, manejo e características da GSB.
            </p>
            <p>
              Ao longo dos 15 capítulos, o leitor encontrará conteúdos sobre a origem da raça, características físicas, comportamento, alimentação, reprodução, incubação, criação de pintinhos, formação de plantel, escolha de reprodutores e muito mais.
            </p>
            <p>
              O Portal Galinha GSB estruturou este material para transformar informações que muitas vezes aparecem dispersas em diferentes fontes em um conteúdo organizado, acessível e de fácil consulta — disponível gratuitamente em PDF.
            </p>

            {/* CTA inline */}
            <div className="not-prose my-8 rounded-2xl bg-muted p-6">
              <p className="font-semibold">Acesse o guia completo agora</p>
              <p className="mt-1 text-sm text-muted-foreground">20 páginas · formato PDF · sem cadastro · 100% gratuito</p>
              <a
                href={PDF_URL}
                download="guia-completo-galinha-gsb-sertaneja-balao.pdf"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Baixar PDF Grátis
              </a>
            </div>
          </div>

          {/* Sumário lateral */}
          <aside className="rounded-2xl bg-muted p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sumário</p>
            <ol className="space-y-2 text-sm">
              {CHAPTERS.map((ch) => (
                <li key={ch.num} className="flex items-start gap-2">
                  <span className="mt-0.5 min-w-[1.4rem] font-mono text-xs font-bold text-primary opacity-60">{String(ch.num).padStart(2, "0")}</span>
                  <span className="leading-snug">{ch.title}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Capítulos em destaque */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Principais temas abordados</h2>
          <p className="mt-2 text-muted-foreground">Um resumo do que você encontra em cada capítulo do guia.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{h.tag}</div>
                <h3 className="font-display text-lg">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist rápido */}
      <section className="bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <h2 className="font-display text-2xl md:text-3xl">Checklist do criador — direto do guia</h2>
          <p className="mt-2 text-muted-foreground">Pontos essenciais para avaliar um reprodutor e conduzir a rotina do plantel.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChecklistCard title="Ao escolher um reprodutor" items={CHECKLIST_REPRODUTOR} />
            <ChecklistCard title="Ao comprar ovos férteis" items={CHECKLIST_OVOS} />
            <ChecklistCard title="Na rotina do plantel" items={CHECKLIST_ROTINA} />
          </div>
        </div>
      </section>

      {/* Glossário resumido */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-12">
          <h2 className="font-display text-2xl md:text-3xl">Glossário essencial da GSB</h2>
          <p className="mt-2 text-muted-foreground">Os termos mais usados na criação e avaliação da Galinha Sertaneja Balão.</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="rounded-xl border border-border bg-card px-4 py-3">
                <dt className="text-sm font-semibold">{g.term}</dt>
                <dd className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center md:px-8 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl">Pronto para aprofundar seus conhecimentos?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-85">
            O guia completo tem 20 páginas com tabelas, checklists, glossário e todos os 15 capítulos detalhados. Baixe gratuitamente em PDF.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={PDF_URL}
              download="guia-completo-galinha-gsb-sertaneja-balao.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow transition hover:bg-white/90"
            >
              <Download className="h-4 w-4" />
              Baixar Guia em PDF — Gratuito
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3 text-sm font-semibold opacity-80 transition hover:opacity-100"
            >
              Ver Catálogo
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="mb-3 font-semibold text-sm">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
            <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Dados ────────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { num: 1, title: "Origem e formação histórica" },
  { num: 2, title: "Características gerais da raça" },
  { num: 3, title: "Padrão morfológico detalhado" },
  { num: 4, title: "Macho e fêmea: diferenças práticas" },
  { num: 5, title: "Plumagens, cores e leitura visual" },
  { num: 6, title: "Como reconhecer boa procedência" },
  { num: 7, title: "Seleção de reprodutores e formação do plantel" },
  { num: 8, title: "Reprodução, fertilidade e incubação" },
  { num: 9, title: "Pintinhos e desenvolvimento" },
  { num: 10, title: "Manejo, instalações e alimentação" },
  { num: 11, title: "Sanidade e observação diária" },
  { num: 12, title: "Preparação para exposições e julgamento" },
  { num: 13, title: "Checklist rápido do criador" },
  { num: 14, title: "Glossário essencial" },
  { num: 15, title: "Considerações finais" },
];

const HIGHLIGHTS = [
  {
    tag: "Origem",
    title: "Sertão da Bahia e Baixa Grande",
    body: "A história da GSB está ligada ao sertão da Bahia, especialmente ao município de Baixa Grande. Famílias de criadores mantinham aves pesadas conhecidas regionalmente como 'galinhas balão' e, por volta da década de 1950, a seleção passou a ter direção mais definida, com preferência por exemplares maiores, robustos e de conformação própria.",
  },
  {
    tag: "Características gerais",
    title: "Ave rústica, gigante e dócil",
    body: "A GSB é uma ave rústica, de porte gigante, temperamento dócil e corpo marcadamente largo e arredondado. Fêmeas adultas pesam de 4 a 6 kg, machos de 6 a 8 kg. A produção anual de ovos das fêmeas varia de 160 a 260 unidades, com início de postura entre 5 e 6 meses.",
  },
  {
    tag: "Padrão morfológico",
    title: "Como avaliar a conformação da GSB",
    body: "O corpo deve ser compacto, largo, arredondado e harmônico, com quilha profunda e musculatura bem distribuída. Peito largo e profundo, aprumos firmes, pernas amarelas (no padrão adotado pelo portal) e plumagem bem implantada são os principais pontos de avaliação.",
  },
  {
    tag: "Plumagem",
    title: "Diversidade de cores e padrões",
    body: "A GSB apresenta grande variedade de plumagens: sólidas (preta, vermelha, branca), diluições (azul, palha, camurça, prata, ouro), pintadas (mottled, mil-flores, pintado, splash, laceado, spangled) e tradicionais de aparência rústica (caboclo, perdiz, lebre, bétula). Cor, porém, não substitui conformação na seleção.",
  },
  {
    tag: "Reprodução",
    title: "Fertilidade, incubação e cuidados",
    body: "O acasalamento deve ocorrer em piso firme, sem superlotação, com fêmeas em boa condição corporal. O guia recomenda incubação artificial ou uso de galinha de menor porte como mae adotiva, dado o risco de quebra de ovos sob uma ave muito pesada. Coletar ovos com frequência e armazenar em ambiente fresco são práticas essenciais.",
  },
  {
    tag: "Alimentação e manejo",
    title: "Instalações e consumo por fase",
    body: "Poleiros baixos e firmes, ninhos reforçados e piso seco com boa drenagem são indispensáveis para aves de grande porte. O consumo de ração vai de ~15 g/dia na primeira semana de vida até ~120 g/dia na fase adulta. Milho, farelo de soja e vegetais podem ser usados como complementos, mas não substituem ração balanceada.",
  },
  {
    tag: "Seleção",
    title: "Como formar um plantel consistente",
    body: "O melhor reprodutor não é necessariamente o maior: é o indivíduo que reúne estrutura, saúde, fertilidade, temperamento e características desejadas para a próxima geração. Registrar acasalamentos em um caderno simples já melhora muito a seleção e reduz decisões baseadas apenas na memória.",
  },
  {
    tag: "Sanidade",
    title: "Observação diária é a principal ferramenta",
    body: "Observar o lote todos os dias é uma das ferramentas sanitárias mais simples e eficazes. Atenção ao consumo de água e ração, postura corporal das aves, respiração, fezes, condição da cama, pés, aprumos, penas e pele. Mudanças repentinas na postura de ovos ou fertilidade também merecem atenção imediata.",
  },
];

const CHECKLIST_REPRODUTOR = [
  "Corpo largo e arredondado",
  "Peito profundo e musculoso",
  "Aprumos firmes e simétricos",
  "Pés e dedos bem formados",
  "Crista e barbelas proporcionais",
  "Plumagem íntegra e coerente",
  "Comportamento ativo e dócil",
  "Origem e parentesco conhecidos",
];

const CHECKLIST_OVOS = [
  "Fotos/vídeos atuais dos pais",
  "Data de coleta informada",
  "Ovos sem trincas visíveis",
  "Embalagem adequada para transporte",
  "Orientação de descanso após recebimento",
  "Política clara sobre fertilidade",
];

const CHECKLIST_ROTINA = [
  "Água fresca disponível",
  "Ração adequada à fase",
  "Sombra e ventilação garantidas",
  "Cama seca",
  "Poleiros baixos",
  "Observação de pés e aprumos",
  "Registro de acasalamentos",
  "Separação de aves doentes",
];

const GLOSSARY = [
  { term: "Aprumos", def: "Alinhamento e posicionamento dos membros, importantes para equilíbrio e locomoção." },
  { term: "Barbelas", def: "Estruturas carnudas pendentes abaixo do bico, avaliadas em conjunto com crista e lóbulos." },
  { term: "Conformação", def: "Forma e proporções gerais do corpo avaliadas em relação ao padrão da raça." },
  { term: "Dimorfismo sexual", def: "Diferenças visíveis entre machos e fêmeas, como porte, crista, barbelas e plumagem." },
  { term: "Empenamento", def: "Processo e padrão de desenvolvimento das penas ao longo da vida da ave." },
  { term: "Linhagem", def: "Grupo de animais relacionados e selecionados ao longo de gerações com características fixadas." },
  { term: "Mottled", def: "Padrão de plumagem escura com marcações claras distribuídas nas penas." },
  { term: "Quilha", def: "Osso do peito que serve de suporte para a musculatura peitoral — quanto mais profundo, maior o volume." },
  { term: "Selins", def: "Penas alongadas da região posterior do dorso dos galos, indicadoras de dimorfismo sexual." },
  { term: "Seleção", def: "Escolha planejada dos indivíduos que serão utilizados na reprodução para fixar características desejadas." },
  { term: "Choco", def: "Comportamento da fêmea de permanecer sobre os ovos para incubá-los naturalmente." },
  { term: "Eclosão", def: "Nascimento do pintinho após o período de incubação (natural ou artificial)." },
];
