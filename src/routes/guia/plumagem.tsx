import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/plumagem")({
  head: () => ({
    meta: [
      { title: "Plumagens da Galinha GSB — Cores e Padroes da Sertaneja Balao" },
      { name: "description", content: "Conheça todos os padroes de plumagem da Galinha GSB Sertaneja Balao: solidas, dilucoes, pintadas, mil-flores, mottled, caboclo, perdiz e muito mais." },
      { property: "og:title", content: "Plumagens da Galinha GSB — Cores e Padroes" },
      { property: "og:description", content: "Todos os padroes de plumagem da Galinha GSB: solidas, dilucoes, pintadas e tradicionais." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: PlumagemPage,
});

function PlumagemPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Visual"
        title="Plumagens, cores e leitura visual da GSB"
        intro="A diversidade de plumagens e uma das caracteristicas que mais chama atencao na GSB. Sao descritos padroes como pintado, mil-flores, betula, lebre, mottled e amarelo/caboclo, alem de grupos solidos, dilucoes e desenhos compostos como azul, palha, camurca, prata, ouro, columbia, laceado, spangled, splash e perdiz."
        prev={{ to: "/guia/caracteristicas", label: "Caracteristicas e padrao morfologico" }}
        next={{ to: "/guia/selecao", label: "Selecao de reprodutores" }}
      >
        <Section title="Grupos de plumagem e como avaliar">
          <InfoTable rows={[
            { label: "Solidas / base", value: "Preta, vermelha, branca. Avaliar uniformidade da cor, brilho e ausencia de manchas nao desejadas para a variedade." },
            { label: "Dilucoes e tons", value: "Azul/cinza, palha, camurca, prata, ouro. Observar regularidade do tom e coerencia entre regioes do corpo." },
            { label: "Pintadas / compostas", value: "Mottled, mil-flores, pintado, splash, laceado, spangled. Verificar definicao do desenho e repeticao visual das marcacoes." },
            { label: "Tradicionais de aparencia rustica", value: "Caboclo, perdiz, lebre, betula. Avaliar equilibrio do conjunto e fidelidade ao desenho selecionado pelo criador." },
          ]} />
        </Section>

        <Section title="Mottled — padrao escuro com marcacoes claras">
          <p>
            O mottled e um padrao de plumagem escura com marcacoes claras distribuidas nas penas. Na GSB, e um dos padroes mais valorizados esteticamente. A qualidade do mottled e avaliada pela definicao e regularidade das marcacoes, alem da coerencia entre diferentes regioes do corpo da ave.
          </p>
        </Section>

        <Section title="Mil-flores e pintado">
          <p>
            O padrao mil-flores combina tres cores nas penas, geralmente com ponta clara sobre fundo escuro com marcacao intermediaria. Ja o pintado apresenta distribuicao de manchas mais irregulares. Ambos exigem atencao a uniformidade do conjunto — uma ave com marcacoes muito irregulares pode ser sinal de cruzamentos nao planejados.
          </p>
        </Section>

        <Section title="Tradicionais: caboclo, lebre, perdiz e betula">
          <p>
            Esses padroes sao associados a aparencia mais rustica e proxima das aves crioulas originais. O caboclo apresenta tonalidade amarelada/dourada; a lebre tem padrao pardacento com listras; a perdiz remete ao padrao das perdizes silvestres com marcacoes sutis; a betula combina preto e branco de forma mais definida.
          </p>
          <p>
            Para criadores que trabalham com selecao de linhagem, esses padroes tradicionais podem ser mais previsíveis geneticamente quando os acasalamentos sao bem planejados.
          </p>
        </Section>

        <Callout>
          Cor nao substitui conformacao. Uma plumagem rara pode aumentar o interesse por um exemplar, mas ela nao corrige corpo alongado, aprumos fracos, baixa vitalidade ou problemas reprodutivos. Para formacao de linhagem, a cor deve ser selecionada dentro de um conjunto ja funcional.
        </Callout>

        <Section title="Como avaliar a plumagem na pratica">
          <ul>
            <li>Observe a ave em luz natural — muitas cores e reflexos metalicos so aparecem com boa iluminacao.</li>
            <li>Verifique o estado geral das penas: penas quebradas, falhas extensas ou plumagem opaca podem indicar deficiencia nutricional, parasitas ou estresse.</li>
            <li>Em periodos de muda, a aparencia da ave muda temporariamente — nao avalie plumagem de ave em muda completa.</li>
            <li>Avalie a plumagem como parte do conjunto, nunca como unico criterio de selecao.</li>
          </ul>
        </Section>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
