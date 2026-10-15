import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { GUIA_CHAPTERS, chapterByPath } from "@/lib/guia-map";
import { AUTHOR } from "@/lib/author";

export const Route = createFileRoute("/guia/origem")({
  head: () => ({
    meta: [
      { title: "Origem da Galinha GSB — História e Formação da Raça Sertaneja Balão" },
      { name: "description", content: "Conheça a origem da Galinha Sertaneja Balão (GSB): a história no sertão da Bahia, o município de Baixa Grande e como a seleção regional consolidou a raça ao longo de décadas." },
      { property: "og:title", content: "Origem da Galinha GSB — História da Raça Sertaneja Balão" },
      { property: "og:description", content: "A história da GSB no sertão da Bahia, Baixa Grande e a formação da raça por seleção regional." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: OrigemPage,
});

function OrigemPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="História"
        title="Origem e formação histórica da Galinha GSB"
        intro="A história da Galinha GSB está ligada ao sertão da Bahia e, especialmente, ao município de Baixa Grande. Famílias de criadores mantinham aves pesadas conhecidas regionalmente como galinhas balão e, por volta da década de 1950, a seleção começou a ganhar direção mais definida, com preferência por exemplares maiores, robustos e de conformação própria."
        prev={null}
        next={{ to: "/guia/caracteristicas", label: "Características e padrão morfológico" }}
      >
        <Section title="O nome Balão e sua origem">
          <p>
            O termo balão, que dá nome à raça, descreve a silhueta característica da ave — corpo arredondado, volumoso e profundo, que lembra visualmente um balão quando observado de frente ou de perfil. Esse visual é resultado de décadas de seleção por criadores que privilegiavam aves com grande volume de carne, peito largo e plumagem solta, dando ao conjunto aquela forma esférica que distingue a GSB de qualquer outra galinha crioula brasileira.
          </p>
          <p>
            O apelido era informal durante muito tempo, usado dentro das comunidades de criadores do sertão baiano. Com o crescimento do interesse pela raça fora da região, o nome foi incorporado ao padrão de forma mais sistemática, associando-se à designação geográfica Sertaneja para marcar a origem e o contexto de desenvolvimento da ave.
          </p>
        </Section>

        <Section title="Baixa Grande como núcleo de preservação">
          <p>
            A permanência dessas aves em Baixa Grande é associada às condições locais de clima, vegetação, relevo e ao sistema tradicional de criação. O material de referência do guia cita marcos históricos da formação do município — incluindo 1860, 1872 e 1885 — para contextualizar a continuidade das populações de aves na região.
          </p>
          <p>
            Esses marcos não significam que um padrão racial moderno já existisse naquele período; ajudam, sobretudo, a situar a longa presença de galinhas crioulas do tipo balão na comunidade. O clima semi-arido, os períodos de estiagem e a disponibilidade sazonal de recursos alimentares foram forças de seleção natural que contribuíram para a rusticidade que caracteriza a raça até hoje.
          </p>
          <p>
            O isolamento relativo da região nas primeiras décadas do século XX foi, paradoxalmente, um fator de preservação. Com poucos cruzamentos não planejados com raças comerciais, o tipo balão foi se mantendo e se consolidando nas propriedades familiares que o cultivavam.
          </p>
        </Section>

        <Section title="Da ave regional à seleção moderna">
          <p>
            A Galinha Balão Tradicional é resultado de uma longa formação de aves crioulas no Brasil: populações domésticas trazidas em diferentes períodos teriam se misturado, sido submetidas à seleção natural em ambientes regionais e, depois, a escolha dos próprios criadores. A combinação entre isolamento, adaptação local e seleção artificial foram forças importantes na fixação do tipo balão.
          </p>
          <p>
            Com o passar das gerações, os criadores intensificaram a seleção por peso, volume corporal, rusticidade, docilidade e aparência. Houve também aumento da diversidade de plumagens e de algumas características morfológicas ao longo das últimas décadas.
          </p>
          <p>
            Assim, a GSB atual deve ser entendida como uma população em processo de consolidação: tradição regional de um lado, seleção orientada e padronização contemporânea de outro.
          </p>
        </Section>

        <Section title="Diferença em relação a outras raças crioulas brasileiras">
          <p>
            O Brasil tem um patrimônio significativo de galinhas crioulas — Canela Preta, Pé Duro, Caipira, Peloco, entre outras. A GSB se diferencia dessas populações principalmente pelo porte: enquanto a maioria das galinhas crioulas brasileiras é de porte médio ou leve, a GSB foi selecionada para ser uma ave pesada, de condição cárnica pronunciada, com peso adulto que pode superar facilmente o das galinhas industriais de dupla aptidão.
          </p>
          <p>
            Além do porte, a silhueta globosa e a plumagem solta que forma o volume visual são marcas que não aparecem de forma tão pronunciada em outras raças crioulas. Esse conjunto de características é o que torna a GSB reconhecível mesmo para quem não é criador especializado.
          </p>
        </Section>

        <Section title="O processo de reconhecimento e padronização">
          <p>
            Raças crioulas brasileiras em geral carecem de padrão oficial consolidado por órgão de registro nacional. A GSB não é exceção — o que existe são descrições de padrão em desenvolvimento, discutidas entre criadores e entidades ligadas à avicultura alternativa. Diferentes grupos podem adotar critérios levemente distintos para peso, proporções ou plumagem aceita.
          </p>
          <p>
            Esse contexto não diminui o valor ou a identidade da raça, mas exige que o criador se informe sobre qual padrão está sendo adotado pela entidade ou exposição com a qual pretende trabalhar. O padrão descrito neste guia reflete os critérios observados no plantel de referência e na literatura disponível sobre a raça, mas não deve ser tratado como norma universal.
          </p>
        </Section>

        <Section title="Situação atual da raça">
          <p>
            Nas últimas duas décadas, a GSB ganhou popularidade fora do sertão baiano. Criadores de diferentes estados passaram a adquirir aves e ovos férteis para iniciar plantéis próprios, e o interesse pelo tipo balão cresceu junto com o movimento de valorização das raças locais e da avicultura alternativa no Brasil.
          </p>
          <p>
            Essa expansão traz oportunidades — mais criadores, mais seleção, mais diversidade genética disponível — mas também riscos: cruzamentos não documentados, venda de aves incorretamente identificadas e perda de rastreabilidade do plantel. Para o criador sério, isso reforça a importância de escolher aves com procedência documentada e criadores que trabalhem com seleção orientada.
          </p>
        </Section>

        <Callout>
          A GSB não é uma raça completamente fixada por um padrão único e universal. Diferentes entidades podem adotar critérios próprios. Ao buscar informações para exposições ou registros, sempre consulte o regulamento vigente da entidade responsável.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}

// ── Componentes compartilhados ────────────────────────────────────────────────

export function GuiaArticleLayout({
  tag,
  title,
  intro,
  children,
  prev,
  next,
}: {
  tag: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  prev: { to: string; label: string } | null;
  next: { to: string; label: string } | null;
}) {
  // Capítulo atual no mapa Guia ↔ blog (src/lib/guia-map.ts).
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const chapter = chapterByPath(pathname);
  return (
    <>
      <section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_80%_at_85%_25%,color-mix(in_oklab,var(--primary-glow)_24%,transparent),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-16">
          <Link to="/guia" className="mb-6 inline-flex items-center gap-1 text-sm text-primary-foreground/75 transition hover:text-primary-foreground">
            <ChevronLeft className="h-4 w-4" /> Guia da GSB
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-warm">
            {chapter ? `Capítulo ${chapter.num} de ${GUIA_CHAPTERS.length} — ${tag}` : tag}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 md:text-lg">{intro}</p>
          <p className="mt-6 text-sm text-primary-foreground/75">
            Por{" "}
            <Link to={AUTHOR.path as any} className="font-semibold underline-offset-2 hover:underline">
              {AUTHOR.name}
            </Link>
            , {AUTHOR.role.charAt(0).toLowerCase() + AUTHOR.role.slice(1)} há mais de 10 anos
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-p:text-[0.95rem]">
          {children}
        </div>

        {/* O capítulo é a referência resumida; os posts aprofundam o mesmo tema. */}
        {chapter && chapter.posts.length > 0 && (
          <aside aria-labelledby="aprofunde-titulo" className="mt-12 rounded-3xl border border-border bg-muted/40 p-6 md:p-8">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Aprofunde no blog
            </p>
            <h2 id="aprofunde-titulo" className="mt-2 font-display text-xl md:text-2xl">
              Artigos práticos sobre este tema
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Este capítulo resume o essencial. Os artigos abaixo detalham o assunto com exemplos, passo a passo e dúvidas comuns.
            </p>
            <ul className="mt-5 space-y-2">
              {chapter.posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] transition hover:text-primary md:text-base"
                  >
                    <span>{p.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Navegação entre capítulos */}
        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
          {prev ? (
            <Link to={prev.to as any} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition">
              <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              <span className="line-clamp-1">{prev.label}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={next.to as any} className="group ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition text-right">
              <span className="line-clamp-1">{next.label}</span>
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          ) : <div />}
        </nav>
      </article>
    </>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-2xl bg-muted p-5 text-sm text-muted-foreground leading-relaxed">
      {children}
    </div>
  );
}

export function InfoTable({ rows }: { rows: { label: string; femea?: string; macho?: string; value?: string }[] }) {
  const hasGender = rows[0]?.femea !== undefined;
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-2.5 text-left font-semibold">Característica</th>
            {hasGender ? (
              <>
                <th className="px-4 py-2.5 text-left font-semibold">Fêmea</th>
                <th className="px-4 py-2.5 text-left font-semibold">Macho</th>
              </>
            ) : (
              <th className="px-4 py-2.5 text-left font-semibold">Detalhe</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-medium text-foreground">{r.label}</td>
              {hasGender ? (
                <>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.femea}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.macho}</td>
                </>
              ) : (
                <td className="px-4 py-2.5 text-muted-foreground">{r.value}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
