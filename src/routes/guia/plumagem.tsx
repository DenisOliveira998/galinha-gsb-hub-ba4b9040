import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/plumagem")({
  head: () => ({
    meta: [
      { title: "Plumagens da Galinha GSB — Cores e Padroes da Sertaneja Balao" },
      { name: "description", content: "Conheca todos os padroes de plumagem da Galinha GSB Sertaneja Balao: solidas, dilucoes, pintadas, mil-flores, mottled, caboclo, perdiz e muito mais." },
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

        <Section title="Como a plumagem muda do pintinho ao adulto">
          <p>
            Um dos maiores erros ao comprar pintinhos GSB e tentar prever a plumagem adulta com base na penugem de nascimento. A penugem inicial e transitoria e frequentemente nao corresponde ao padrao que se desenvolve depois. O mottled, por exemplo, pode nascer aparentemente escuro ou claro; o mil-flores pode mostrar so a cor de fundo nas primeiras semanas.
          </p>
          <p>
            A plumagem definitiva comeca a se definir na primeira muda, que ocorre progressivamente entre 4 e 12 semanas. Mesmo assim, o padrao completo — incluindo reflexos metalicos, definicao de marcacoes e saturacao das cores — frequentemente so se apresenta totalmente na segunda muda, por volta de 12 a 18 meses de vida.
          </p>
          <p>
            Comprar pintinhos com expectativa de cor especifica exige confiar no historico dos reprodutores e na descricao do criador, nao na aparencia dos filhotes no nascimento. Criadores que divulgam fotos dos pais com regularidade facilitam essa avaliacao.
          </p>
        </Section>

        <Section title="Mottled — padrao escuro com marcacoes claras">
          <p>
            O mottled e um padrao de plumagem escura com marcacoes claras distribuidas nas penas. Na GSB, e um dos padroes mais valorizados esteticamente. A qualidade do mottled e avaliada pela definicao e regularidade das marcacoes, alem da coerencia entre diferentes regioes do corpo da ave.
          </p>
          <p>
            A tendencia ao mottled aumenta com a idade — aves mais velhas frequentemente mostram marcacoes mais extensas que as mesmas aves jovens. Isso precisa ser levado em conta ao selecionar reprodutores: uma ave jovem com mottled discreto pode ter descendentes com padrao mais pronunciado conforme amadurece.
          </p>
          <p>
            Geneticamente, o mottled resulta de um alelo recessivo. Para obter pintinhos mottled com regularidade, ambos os pais precisam carregar o gene ou expressar o padrao. Acasalamentos entre aves mottled e aves sem o padrao podem produzir descendentes sem a expressao visual do mottled, ainda que alguns sejam portadores.
          </p>
        </Section>

        <Section title="Mil-flores e pintado">
          <p>
            O padrao mil-flores combina tres cores nas penas, geralmente com ponta clara sobre fundo escuro com marcacao intermediaria. E um padrao visualmente complexo que exige acasalamentos planejados para ser preservado com consistencia. Ja o pintado apresenta distribuicao de manchas mais irregulares e variadas, com menor previsibilidade de heranca.
          </p>
          <p>
            Ambos os padroes exigem atencao a uniformidade do conjunto ao avaliar um lote — aves com marcacoes muito irregulares entre si, oriundas do mesmo acasalamento, podem ser sinal de cruzamentos nao planejados no plantel de origem. Pedir fotos dos irmaos de ninhada, quando possivel, ajuda a avaliar a consistencia do lote.
          </p>
        </Section>

        <Section title="Laceado, spangled, columbia e splash">
          <p>
            O laceado e caracterizado por uma borda mais clara ou mais escura em torno de cada pena, criando um efeito de escamas. O spangled apresenta marcacao pontual na ponta de cada pena. O columbia tem distribuicao de cor concentrada no pescoco e cauda, com o restante do corpo em tom mais claro. O splash exibe manchas irregulares de cor sobre fundo claro.
          </p>
          <p>
            Esses padroes sao menos comuns na GSB e frequentemente resultam de acasalamentos especificos ou de linhagens particulares. Criadores que trabalham com essas variedades tendem a manter acasalamentos separados para preservar o padrao de forma mais previsivel.
          </p>
        </Section>

        <Section title="Tradicionais: caboclo, lebre, perdiz e betula">
          <p>
            Esses padroes sao associados a aparencia mais rustica e proxima das aves crioulas originais. O caboclo apresenta tonalidade amarelada ou dourada, com frequencia associada ao macho com plumagem de pescoco mais intensa. A lebre tem padrao pardacento com listras sutis, de aspecto neutro e pouco chamativo. A perdiz remete ao padrao das perdizes silvestres, com marcacoes finas e distribuicao que varia entre machos e femeas. A betula combina preto e branco de forma mais definida, com contraste claro.
          </p>
          <p>
            Para criadores que trabalham com selecao de linhagem de longo prazo, esses padroes tradicionais podem ser mais previsíveis geneticamente quando os acasalamentos sao planejados e os registros mantidos com consistencia ao longo de geracoes.
          </p>
        </Section>

        <Section title="Reflexo metalico e saturacao de cor">
          <p>
            Muitas plumagens da GSB apresentam reflexo metalico em luz natural — verde, roxo, cobre ou dourado, dependendo do padrao. Esse reflexo e mais perceptivel em adultos com saude e nutricao adequadas e em boa fase de plumagem (fora da muda).
          </p>
          <p>
            A ausencia de reflexo nao significa necessariamente plumagem fora do padrao, mas pode indicar estresse nutricional, parasitismo, fase de muda ou saude comprometida. Ao avaliar uma ave para compra, sempre faca isso em luz natural adequada — fotos tiradas em ambiente escuro ou com flash podem mascarar ou exagerar os reflexos.
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
            <li>Compare a plumagem dos pais com a dos filhotes ao longo de multiplas geracoes antes de confiar em previsoes de cor.</li>
            <li>Avalie a plumagem como parte do conjunto da ave, nunca como unico criterio de selecao.</li>
          </ul>
        </Section>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
