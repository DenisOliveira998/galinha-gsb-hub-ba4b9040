import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/pintinhos")({
  head: () => ({
    meta: [
      { title: "Pintinhos GSB — Criacao e Desenvolvimento da Galinha Sertaneja Balao" },
      { name: "description", content: "Como criar pintinhos GSB Sertaneja Balao: ambiente na primeira semana, alimentacao por fase, acompanhamento de crescimento, recria e selecao gradual." },
      { property: "og:title", content: "Pintinhos GSB — Criacao e Desenvolvimento" },
      { property: "og:description", content: "Ambiente ideal, alimentacao por fase, acompanhamento de crescimento e selecao gradual de pintinhos GSB." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: PintinhosPage,
});

function PintinhosPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Criacao"
        title="Pintinhos GSB: desenvolvimento, ambiente e cuidados"
        intro="Os primeiros meses definem grande parte do potencial futuro da ave. O criador deve acompanhar crescimento, uniformidade, aprumos e vitalidade desde o primeiro dia, pois problemas detectados cedo sao mais faceis de contornar."
        prev={{ to: "/guia/reproducao", label: "Reproducao e incubacao" }}
        next={{ to: "/guia/alimentacao", label: "Manejo e alimentacao" }}
      >
        <Section title="Primeira semana — os cuidados mais criticos">
          <p>
            A primeira semana de vida e o periodo de maior mortalidade em pintinhos. O ambiente deve ser seco e protegido de correntes de ar, pois pintinhos nao regulam bem a temperatura corporal nos primeiros dias. Oferea agua limpa e fresca desde o nascimento, alem de racao inicial completa com boa concentracao proteica — normalmente entre 20 e 22% de proteina bruta.
          </p>
          <p>
            O bebedouro deve ser do tipo que nao permita ao pintinho se molhar. Pintinho molhado resfria rapidamente e pode morrer de hipotermia mesmo com aquecedor ligado. Verifique os bebedouros duas vezes ao dia na primeira semana.
          </p>
          <p>
            Observe se todos os pintinhos comem, bebem e se movimentam normalmente. Pintinhos agrupados sob a fonte de calor estao com frio; os que se afastam dela estao com calor. O ideal e que se distribuam pelo espaco de forma uniforme, com comportamento ativo e vocalizacao suave.
          </p>
        </Section>

        <Section title="Controle de temperatura semana a semana">
          <p>
            A temperatura no nivel dos pintinhos deve ser ajustada progressivamente. Uma das causas mais comuns de mortalidade nas primeiras semanas e o erro de temperatura — tanto por frio quanto por calor excessivo.
          </p>
          <InfoTable rows={[
            { label: "Semana 1", value: "32 a 35°C no nivel dos pintinhos. Fonte de calor centralizada, espaco para afastamento." },
            { label: "Semana 2", value: "29 a 32°C. Observe se os pintinhos continuam se distribuindo de forma uniforme." },
            { label: "Semana 3", value: "26 a 29°C. Comecam a se afastar mais da fonte — sinal de maior controle termico." },
            { label: "Semana 4", value: "23 a 26°C. Em climas quentes, a fonte pode ser desligada durante o dia." },
            { label: "Semana 5 em diante", value: "Temperatura ambiente. Pintinhos bem emplumados toleram variacao normal do ambiente externo." },
          ]} />
          <p>
            Esses valores sao referencias gerais. Ajuste sempre observando o comportamento — o comportamento dos pintinhos e o melhor termometro disponivel.
          </p>
        </Section>

        <Section title="Alimentacao por fase de desenvolvimento">
          <p>
            A GSB e uma raca de porte elevado, e a alimentacao deve suportar esse crescimento sem forcar ganho de peso rapido que comprometa aprumos e ossos. Dividir a criacao em fases distintas facilita o ajuste nutricional:
          </p>
          <ul>
            <li><strong>Fase inicial (0 a 4 semanas):</strong> racao pre-inicial ou inicial para frangos de corte, rica em proteina e energia. O foco e suprir o crescimento rapido das primeiras semanas sem deficiencias.</li>
            <li><strong>Fase de crescimento (4 a 8 semanas):</strong> racao de crescimento com proteina um pouco menor (18 a 20%). Nessa fase, comeca a ser possivel observar as primeiras diferencas de conformacao entre os individuos.</li>
            <li><strong>Recria (8 semanas ate a maturidade):</strong> racao de recria ou producao para galinhas (14 a 16% de proteina). Se o criador tiver acesso a pasto e complemento natural, essa fase pode ser parcialmente suprida com forragem, graos e insetos.</li>
          </ul>
          <p>
            Agua limpa e constante em todas as fases. Restringir agua e um dos piores erros possiveis — impacta crescimento, saude e fertilidade futura.
          </p>
        </Section>

        <Section title="Recria — da segunda semana ate o inicio da fase adulta">
          <p>
            A medida que crescem, os jovens precisam de espaco. Lotacao excessiva favorece competicao por comida e agua, sujeira, lesoes por bicagem e pior desenvolvimento geral. Sinais de superlotacao incluem penas e bicos danificados, crescimento irregular entre aves do mesmo lote e maior frequencia de doencas respiratorias.
          </p>
          <p>
            Para aves em crescimento, uma referencia pratica e de pelo menos 0,5 a 1 metro quadrado por ave no pinteiro coberto, e o dobro disso se houver area ao ar livre. Em climas quentes, mais espaco e ventilacao sao prioritarios.
          </p>
          <p>
            O acompanhamento do peso deve ser usado como ferramenta de comparacao entre irmaos e lotes, nunca como unico criterio de selecao. Um pintinho que cresce mais devagar pode ter conformacao excelente; um que cresce rapido pode ter problemas de aprumo pelo excesso de peso precoce sobre estrutura ossea ainda em formacao.
          </p>
        </Section>

        <Section title="Como diferenciar machos de femeas na recria">
          <p>
            Na GSB, as diferencas entre machos e femeas comecam a aparecer por volta das 4 a 6 semanas, mas ficam mais evidentes entre 8 e 12 semanas. Os machos costumam mostrar:
          </p>
          <ul>
            <li>Crista e barbela se desenvolvendo mais rapido e com cor mais intensa.</li>
            <li>Corpo proporcionalmente mais alto e com ossatura mais robusta.</li>
            <li>Penas de sela e caudais com formato diferente das femeas, especialmente nas plumagens padrao.</li>
            <li>Comportamento mais territorial e vocal progressivamente.</li>
          </ul>
          <p>
            Identificar machos cedo ajuda a planejar o numero de reprodutores que serao mantidos e os que serao destinados a outros fins, evitando competicao excessiva no piquete durante a recria.
          </p>
        </Section>

        <Section title="Transicao do pinteiro para area externa">
          <p>
            A saida para area externa deve ser gradual e considerar a idade, o empenamento e as condicoes climaticas. Aves com menos de 4 semanas nao devem ser expostas a chuva, vento frio ou sol direto intenso por periodos prolongados.
          </p>
          <p>
            A transicao ideal e feita em dias de clima ameno, com acesso ao pinteiro coberto durante a noite nas primeiras semanas. Piquetes com cobertura parcial, protecao lateral contra vento e sombra sao importantes para que a transicao seja segura e positiva para o desenvolvimento.
          </p>
          <p>
            O contato precoce com solo e vegetacao tambem tem beneficios sanitarios — exposicao gradual a microrganismos do ambiente ajuda a fortalecer o sistema imune das aves. Mas esse contato precisa ser controlado: areas de piquete muito sujas ou com alta carga parasitaria devem ser rotacionadas ou tratadas.
          </p>
        </Section>

        <Section title="Variacao no empenamento">
          <p>
            E comum haver variacao no ritmo de empenamento entre pintinhos da mesma ninhada. Alguns se cobrem de penas mais rapido, outros ficam mais tempo com areas de penugem. Isso nao e necessariamente sinal de problema — mas aves com empenamento muito atrasado em relacao ao restante do lote merecem atencao sanitaria e nutricional.
          </p>
          <p>
            Deficiencias de proteina, vitaminas do complexo B e biotina podem retardar o empenamento. Se o atraso for generalizado no lote, vale revisar a qualidade da racao utilizada. Se for isolado em poucos individuos, observe saude geral e vitalidade dessas aves especificamente.
          </p>
        </Section>

        <Section title="Selecao gradual — quando e como descartar">
          <p>
            Evite descartar precocemente apenas por diferencas de plumagem ou crescimento em uma unica fase. Algumas caracteristicas so se definem com a maturidade. Um pintinho mais escuro pode ter a plumagem esperada quando adulto; um menor pode compensar no desenvolvimento tardio tipico da raca.
          </p>
          <p>
            Problemas estruturais claros — como dedos muito tortos, dificuldade persistente de apoio, desvios graves de coluna, incapacidade de se alimentar normalmente — devem ser registrados desde cedo para evitar que aves com esses problemas sejam usadas inadvertidamente na reproducao.
          </p>
          <p>
            Uma abordagem pratica e fazer tres rodadas de selecao: a primeira entre 6 e 8 semanas (descartando problemas estruturais e sanitarios graves); a segunda entre 12 e 16 semanas (avaliando conformacao e desenvolvimento geral); e a terceira na maturidade, antes de definir os reprodutores.
          </p>
        </Section>

        <Callout>
          Em pintinhos GSB, o grande porte adulto comeca a se delinear na recria. Acompanhe conformacao e aprumos desde cedo — aves de porte elevado com problemas de aprumo que se agravam com o peso sao mais dificeis de corrigir na fase adulta.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
