import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/guia/origem")({
  head: () => ({
    meta: [
      { title: "Origem da Galinha GSB — Historia e Formacao da Raca Sertaneja Balao" },
      { name: "description", content: "Conheca a origem da Galinha Sertaneja Balao (GSB): a historia no sertao da Bahia, o municipio de Baixa Grande e como a selecao regional consolidou a raca ao longo de decadas." },
      { property: "og:title", content: "Origem da Galinha GSB — Historia da Raca Sertaneja Balao" },
      { property: "og:description", content: "A historia da GSB no sertao da Bahia, Baixa Grande e a formacao da raca por selecao regional." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: OrigemPage,
});

function OrigemPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Historia"
        title="Origem e formacao historica da Galinha GSB"
        intro="A historia da Galinha GSB esta ligada ao sertao da Bahia e, especialmente, ao municipio de Baixa Grande. Familias de criadores mantinham aves pesadas conhecidas regionalmente como galinhas balao e, por volta da decada de 1950, a selecao comecou a ganhar direcao mais definida, com preferencia por exemplares maiores, robustos e de conformacao propria."
        prev={null}
        next={{ to: "/guia/caracteristicas", label: "Caracteristicas e padrao morfologico" }}
      >
        <Section title="Baixa Grande como nucleo de preservacao">
          <p>
            A permanencia dessas aves em Baixa Grande e associada as condicoes locais de clima, vegetacao, relevo e ao sistema tradicional de criacao. O material de referencia do guia cita marcos historicos da formacao do municipio — incluindo 1860, 1872 e 1885 — para contextualizar a continuidade das populacoes de aves na regiao.
          </p>
          <p>
            Esses marcos nao significam que um padrao racial moderno ja existisse naquele periodo; ajudam, sobretudo, a situar a longa presenca de galinhas crioulas do tipo balao na comunidade.
          </p>
        </Section>

        <Section title="Da ave regional a selecao moderna">
          <p>
            A Galinha Balao Tradicional e resultado de uma longa formacao de aves crioulas no Brasil: populacoes domesticas trazidas em diferentes periodos teriam se misturado, sido submetidas a selecao natural em ambientes regionais e, depois, a escolha dos proprios criadores. A combinacao entre isolamento, adaptacao local e selecao artificial foram forcas importantes na fixacao do tipo balao.
          </p>
          <p>
            Com o passar das geracoes, os criadores intensificaram a selecao por peso, volume corporal, rusticidade, docilidade e aparencia. Houve tambem aumento da diversidade de plumagens e de algumas caracteristicas morfologicas ao longo das ultimas decadas.
          </p>
          <p>
            Assim, a GSB atual deve ser entendida como uma populacao em processo de consolidacao: tradicao regional de um lado, selecao orientada e padronizacao contemporanea de outro.
          </p>
        </Section>

        <Callout>
          A GSB nao e uma raca completamente fixada por um padrao unico e universal. Diferentes entidades podem adotar criterios proprios. Ao buscar informacoes para exposicoes ou registros, sempre consulte o regulamento vigente da entidade responsavel.
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
  return (
    <>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
          <Link to="/guia" className="mb-4 inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition">
            <ChevronLeft className="h-3 w-3" /> Voltar ao Guia
          </Link>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest opacity-60">{tag}</div>
          <h1 className="font-display text-2xl leading-tight md:text-3xl lg:text-4xl">{title}</h1>
          <p className="mt-4 text-sm opacity-80 md:text-base leading-relaxed">{intro}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-p:text-[0.95rem]">
          {children}
        </div>

        {/* Navegacao entre capitulos */}
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
            <th className="px-4 py-2.5 text-left font-semibold">Caracteristica</th>
            {hasGender ? (
              <>
                <th className="px-4 py-2.5 text-left font-semibold">Femea</th>
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
