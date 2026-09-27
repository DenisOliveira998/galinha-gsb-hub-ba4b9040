import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/plumagem")({
  head: () => ({
    meta: [
      { title: "Plumagens da Galinha GSB — Cores e Padrões da Sertaneja Balão" },
      { name: "description", content: "Conheça todos os padrões de plumagem da Galinha GSB Sertaneja Balão: sólidas, diluições, pintadas, mil-flores, mottled, caboclo, perdiz e muito mais." },
      { property: "og:title", content: "Plumagens da Galinha GSB — Cores e Padrões" },
      { property: "og:description", content: "Todos os padrões de plumagem da Galinha GSB: sólidas, diluições, pintadas e tradicionais." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
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
        intro="A diversidade de plumagens é uma das características que mais chama atenção na GSB. São descritos padrões como pintado, mil-flores, betula, lebre, mottled e amarelo/caboclo, além de grupos sólidos, diluições e desenhos compostos como azul, palha, camurça, prata, ouro, columbia, laceado, spangled, splash e perdiz."
        prev={{ to: "/guia/caracteristicas", label: "Características e padrão morfológico" }}
        next={{ to: "/guia/selecao", label: "Seleção de reprodutores" }}
      >
        <Section title="Grupos de plumagem e como avaliar">
          <InfoTable rows={[
            { label: "Sólidas / base", value: "Preta, vermelha, branca. Avaliar uniformidade da cor, brilho e ausência de manchas não desejadas para a variedade." },
            { label: "Dilucoes e tons", value: "Azul/cinza, palha, camurça, prata, ouro. Observar regularidade do tom e coerência entre regiões do corpo." },
            { label: "Pintadas / compostas", value: "Mottled, mil-flores, pintado, splash, laceado, spangled. Verificar definição do desenho e repetição visual das marcações." },
            { label: "Tradicionais de aparência rústica", value: "Caboclo, perdiz, lebre, betula. Avaliar equilíbrio do conjunto e fidelidade ao desenho selecionado pelo criador." },
          ]} />
        </Section>

        <Section title="Como a plumagem muda do pintinho ao adulto">
          <p>
            Um dos maiores erros ao comprar pintinhos GSB é tentar prever a plumagem adulta com base na penugem de nascimento. A penugem inicial é transitória e frequentemente não corresponde ao padrão que se desenvolve depois. O mottled, por exemplo, pode nascer aparentemente escuro ou claro; o mil-flores pode mostrar só a cor de fundo nas primeiras semanas.
          </p>
          <p>
            A plumagem definitiva começa a se definir na primeira muda, que ocorre progressivamente entre 4 e 12 semanas. Mesmo assim, o padrão completo — incluindo reflexos metálicos, definição de marcações e saturação das cores — frequentemente só se apresenta totalmente na segunda muda, por volta de 12 a 18 meses de vida.
          </p>
          <p>
            Comprar pintinhos com expectativa de cor específica exige confiar no histórico dos reprodutores e na descrição do criador, não na aparência dos filhotes no nascimento. Criadores que divulgam fotos dos pais com regularidade facilitam essa avaliação.
          </p>
        </Section>

        <Section title="Mottled — padrão escuro com marcações claras">
          <p>
            O mottled é um padrão de plumagem escura com marcações claras distribuídas nas penas. Na GSB, é um dos padrões mais valorizados esteticamente. A qualidade do mottled é avaliada pela definição e regularidade das marcações, além da coerência entre diferentes regiões do corpo da ave.
          </p>
          <p>
            A tendência ao mottled aumenta com a idade — aves mais velhas frequentemente mostram marcações mais extensas que as mesmas aves jovens. Isso precisa ser levado em conta ao selecionar reprodutores: uma ave jovem com mottled discreto pode ter descendentes com padrão mais pronunciado conforme amadurece.
          </p>
          <p>
            Geneticamente, o mottled resulta de um alelo recessivo. Para obter pintinhos mottled com regularidade, ambos os pais precisam carregar o gene ou expressar o padrão. Acasalamentos entre aves mottled e aves sem o padrão podem produzir descendentes sem a expressão visual do mottled, ainda que alguns sejam portadores.
          </p>
        </Section>

        <Section title="Mil-flores e pintado">
          <p>
            O padrão mil-flores combina três cores nas penas, geralmente com ponta clara sobre fundo escuro com marcação intermediária. É um padrão visualmente complexo que exige acasalamentos planejados para ser preservado com consistência. Já o pintado apresenta distribuição de manchas mais irregulares e variadas, com menor previsibilidade de herança.
          </p>
          <p>
            Ambos os padrões exigem atenção à uniformidade do conjunto ao avaliar um lote — aves com marcações muito irregulares entre si, oriundas do mesmo acasalamento, podem ser sinal de cruzamentos não planejados no plantel de origem. Pedir fotos dos irmãos de ninhada, quando possível, ajuda a avaliar a consistência do lote.
          </p>
        </Section>

        <Section title="Laceado, spangled, columbia e splash">
          <p>
            O laceado é caracterizado por uma borda mais clara ou mais escura em torno de cada pena, criando um efeito de escamas. O spangled apresenta marcação pontual na ponta de cada pena. O columbia tem distribuição de cor concentrada no pescoço e cauda, com o restante do corpo em tom mais claro. O splash exibe manchas irregulares de cor sobre fundo claro.
          </p>
          <p>
            Esses padrões são menos comuns na GSB e frequentemente resultam de acasalamentos específicos ou de linhagens particulares. Criadores que trabalham com essas variedades tendem a manter acasalamentos separados para preservar o padrão de forma mais previsível.
          </p>
        </Section>

        <Section title="Tradicionais: caboclo, lebre, perdiz e betula">
          <p>
            Esses padrões são associados à aparência mais rústica e próxima das aves crioulas originais. O caboclo apresenta tonalidade amarelada ou dourada, com frequência associada ao macho com plumagem de pescoço mais intensa. A lebre tem padrão pardacento com listras sutis, de aspecto neutro e pouco chamativo. A perdiz remete ao padrão das perdizes silvestres, com marcações finas e distribuição que varia entre machos e fêmeas. A betula combina preto e branco de forma mais definida, com contraste claro.
          </p>
          <p>
            Para criadores que trabalham com seleção de linhagem de longo prazo, esses padrões tradicionais podem ser mais previsíveis geneticamente quando os acasalamentos são planejados e os registros mantidos com consistência ao longo de gerações.
          </p>
        </Section>

        <Section title="Reflexo metálico e saturação de cor">
          <p>
            Muitas plumagens da GSB apresentam reflexo metálico em luz natural — verde, roxo, cobre ou dourado, dependendo do padrão. Esse reflexo é mais perceptível em adultos com saúde e nutrição adequadas e em boa fase de plumagem (fora da muda).
          </p>
          <p>
            A ausência de reflexo não significa necessariamente plumagem fora do padrão, mas pode indicar estresse nutricional, parasitismo, fase de muda ou saúde comprometida. Ao avaliar uma ave para compra, sempre faça isso em luz natural adequada — fotos tiradas em ambiente escuro ou com flash podem mascarar ou exagerar os reflexos.
          </p>
        </Section>

        <Callout>
          Cor não substitui conformação. Uma plumagem rara pode aumentar o interesse por um exemplar, mas ela não corrige corpo alongado, aprumos fracos, baixa vitalidade ou problemas reprodutivos. Para formação de linhagem, a cor deve ser selecionada dentro de um conjunto já funcional.
        </Callout>

        <Section title="Como avaliar a plumagem na prática">
          <ul>
            <li>Observe a ave em luz natural — muitas cores e reflexos metálicos só aparecem com boa iluminação.</li>
            <li>Verifique o estado geral das penas: penas quebradas, falhas extensas ou plumagem opaca podem indicar deficiência nutricional, parasitas ou estresse.</li>
            <li>Em períodos de muda, a aparência da ave muda temporariamente — não avalie plumagem de ave em muda completa.</li>
            <li>Compare a plumagem dos pais com a dos filhotes ao longo de múltiplas gerações antes de confiar em previsões de cor.</li>
            <li>Avalie a plumagem como parte do conjunto da ave, nunca como único critério de seleção.</li>
          </ul>
        </Section>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
