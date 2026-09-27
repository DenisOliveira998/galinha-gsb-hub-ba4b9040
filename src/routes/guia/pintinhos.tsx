import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/pintinhos")({
  head: () => ({
    meta: [
      { title: "Pintinhos GSB — Criação e Desenvolvimento da Galinha Sertaneja Balão" },
      { name: "description", content: "Como criar pintinhos GSB Sertaneja Balão: ambiente na primeira semana, alimentação por fase, acompanhamento de crescimento, recria e seleção gradual." },
      { property: "og:title", content: "Pintinhos GSB — Criação e Desenvolvimento" },
      { property: "og:description", content: "Ambiente ideal, alimentação por fase, acompanhamento de crescimento e seleção gradual de pintinhos GSB." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: PintinhosPage,
});

function PintinhosPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Criação"
        title="Pintinhos GSB: desenvolvimento, ambiente e cuidados"
        intro="Os primeiros meses definem grande parte do potencial futuro da ave. O criador deve acompanhar crescimento, uniformidade, aprumos e vitalidade desde o primeiro dia, pois problemas detectados cedo são mais fáceis de contornar."
        prev={{ to: "/guia/reproducao", label: "Reprodução e incubação" }}
        next={{ to: "/guia/alimentacao", label: "Manejo e alimentação" }}
      >
        <Section title="Primeira semana — os cuidados mais críticos">
          <p>
            A primeira semana de vida é o período de maior mortalidade em pintinhos. O ambiente deve ser seco e protegido de correntes de ar, pois pintinhos não regulam bem a temperatura corporal nos primeiros dias. Ofereça água limpa e fresca desde o nascimento, além de ração inicial completa com boa concentração proteica — normalmente entre 20 e 22% de proteína bruta.
          </p>
          <p>
            O bebedouro deve ser do tipo que não permita ao pintinho se molhar. Pintinho molhado resfria rapidamente e pode morrer de hipotermia mesmo com aquecedor ligado. Verifique os bebedouros duas vezes ao dia na primeira semana.
          </p>
          <p>
            Observe se todos os pintinhos comem, bebem e se movimentam normalmente. Pintinhos agrupados sob a fonte de calor estão com frio; os que se afastam dela estão com calor. O ideal é que se distribuam pelo espaço de forma uniforme, com comportamento ativo e vocalização suave.
          </p>
        </Section>

        <Section title="Controle de temperatura semana a semana">
          <p>
            A temperatura no nível dos pintinhos deve ser ajustada progressivamente. Uma das causas mais comuns de mortalidade nas primeiras semanas é o erro de temperatura — tanto por frio quanto por calor excessivo.
          </p>
          <InfoTable rows={[
            { label: "Semana 1", value: "32 a 35°C no nível dos pintinhos. Fonte de calor centralizada, espaço para afastamento." },
            { label: "Semana 2", value: "29 a 32°C. Observe se os pintinhos continuam se distribuindo de forma uniforme." },
            { label: "Semana 3", value: "26 a 29°C. Começam a se afastar mais da fonte — sinal de maior controle térmico." },
            { label: "Semana 4", value: "23 a 26°C. Em climas quentes, a fonte pode ser desligada durante o dia." },
            { label: "Semana 5 em diante", value: "Temperatura ambiente. Pintinhos bem emplumados toleram variação normal do ambiente externo." },
          ]} />
          <p>
            Esses valores são referências gerais. Ajuste sempre observando o comportamento — o comportamento dos pintinhos é o melhor termômetro disponível.
          </p>
        </Section>

        <Section title="Alimentação por fase de desenvolvimento">
          <p>
            A GSB é uma raça de porte elevado, e a alimentação deve suportar esse crescimento sem forçar ganho de peso rápido que comprometa aprumos e ossos. Dividir a criação em fases distintas facilita o ajuste nutricional:
          </p>
          <ul>
            <li><strong>Fase inicial (0 a 4 semanas):</strong> ração pre-inicial ou inicial para frangos de corte, rica em proteína e energia. O foco é suprir o crescimento rápido das primeiras semanas sem deficiências.</li>
            <li><strong>Fase de crescimento (4 a 8 semanas):</strong> ração de crescimento com proteína um pouco menor (18 a 20%). Nessa fase, começa a ser possível observar as primeiras diferenças de conformação entre os indivíduos.</li>
            <li><strong>Recria (8 semanas até a maturidade):</strong> ração de recria ou produção para galinhas (14 a 16% de proteína). Se o criador tiver acesso a pasto e complemento natural, essa fase pode ser parcialmente suprida com forragem, grãos e insetos.</li>
          </ul>
          <p>
            Água limpa e constante em todas as fases. Restringir água é um dos piores erros possíveis — impacta crescimento, saúde e fertilidade futura.
          </p>
        </Section>

        <Section title="Recria — da segunda semana até o início da fase adulta">
          <p>
            À medida que crescem, os jovens precisam de espaço. Lotação excessiva favorece competição por comida e água, sujeira, lesões por bicagem e pior desenvolvimento geral. Sinais de superlotação incluem penas e bicos danificados, crescimento irregular entre aves do mesmo lote e maior frequência de doenças respiratórias.
          </p>
          <p>
            Para aves em crescimento, uma referência prática é de pelo menos 0,5 a 1 metro quadrado por ave no pinteiro coberto, e o dobro disso se houver área ao ar livre. Em climas quentes, mais espaço e ventilação são prioritários.
          </p>
          <p>
            O acompanhamento do peso deve ser usado como ferramenta de comparação entre irmãos e lotes, nunca como único critério de seleção. Um pintinho que cresce mais devagar pode ter conformação excelente; um que cresce rápido pode ter problemas de aprumo pelo excesso de peso precoce sobre estrutura óssea ainda em formação.
          </p>
        </Section>

        <Section title="Como diferenciar machos de fêmeas na recria">
          <p>
            Na GSB, as diferenças entre machos e fêmeas começam a aparecer por volta das 4 a 6 semanas, mas ficam mais evidentes entre 8 e 12 semanas. Os machos costumam mostrar:
          </p>
          <ul>
            <li>Crista e barbela se desenvolvendo mais rápido e com cor mais intensa.</li>
            <li>Corpo proporcionalmente mais alto e com ossatura mais robusta.</li>
            <li>Penas de sela e caudais com formato diferente das fêmeas, especialmente nas plumagens padrão.</li>
            <li>Comportamento mais territorial e vocal progressivamente.</li>
          </ul>
          <p>
            Identificar machos cedo ajuda a planejar o número de reprodutores que serão mantidos e os que serão destinados a outros fins, evitando competição excessiva no piquete durante a recria.
          </p>
        </Section>

        <Section title="Transição do pinteiro para área externa">
          <p>
            A saída para área externa deve ser gradual e considerar a idade, o empenamento e as condições climáticas. Aves com menos de 4 semanas não devem ser expostas à chuva, vento frio ou sol direto intenso por períodos prolongados.
          </p>
          <p>
            A transição ideal é feita em dias de clima ameno, com acesso ao pinteiro coberto durante a noite nas primeiras semanas. Piquetes com cobertura parcial, proteção lateral contra vento e sombra são importantes para que a transição seja segura e positiva para o desenvolvimento.
          </p>
          <p>
            O contato precoce com solo e vegetação também tem benefícios sanitários — exposição gradual a microrganismos do ambiente ajuda a fortalecer o sistema imune das aves. Mas esse contato precisa ser controlado: áreas de piquete muito sujas ou com alta carga parasitária devem ser rotacionadas ou tratadas.
          </p>
        </Section>

        <Section title="Variação no empenamento">
          <p>
            É comum haver variação no ritmo de empenamento entre pintinhos da mesma ninhada. Alguns se cobrem de penas mais rápido, outros ficam mais tempo com áreas de penugem. Isso não é necessariamente sinal de problema — mas aves com empenamento muito atrasado em relação ao restante do lote merecem atenção sanitária e nutricional.
          </p>
          <p>
            Deficiências de proteína, vitaminas do complexo B e biotina podem retardar o empenamento. Se o atraso for generalizado no lote, vale revisar a qualidade da ração utilizada. Se for isolado em poucos indivíduos, observe saúde geral e vitalidade dessas aves especificamente.
          </p>
        </Section>

        <Section title="Seleção gradual — quando e como descartar">
          <p>
            Evite descartar precocemente apenas por diferenças de plumagem ou crescimento em uma única fase. Algumas características só se definem com a maturidade. Um pintinho mais escuro pode ter a plumagem esperada quando adulto; um menor pode compensar no desenvolvimento tardio típico da raça.
          </p>
          <p>
            Problemas estruturais claros — como dedos muito tortos, dificuldade persistente de apoio, desvios graves de coluna, incapacidade de se alimentar normalmente — devem ser registrados desde cedo para evitar que aves com esses problemas sejam usadas inadvertidamente na reprodução.
          </p>
          <p>
            Uma abordagem prática é fazer três rodadas de seleção: a primeira entre 6 e 8 semanas (descartando problemas estruturais e sanitários graves); a segunda entre 12 e 16 semanas (avaliando conformação e desenvolvimento geral); e a terceira na maturidade, antes de definir os reprodutores.
          </p>
        </Section>

        <Callout>
          Em pintinhos GSB, o grande porte adulto começa a se delinear na recria. Acompanhe conformação e aprumos desde cedo — aves de porte elevado com problemas de aprumo que se agravam com o peso são mais difíceis de corrigir na fase adulta.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
