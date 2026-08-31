import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

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
            A primeira semana de vida e o periodo de maior mortalidade em pintinhos. O ambiente deve ser:
          </p>
          <ul>
            <li>Seco e protegido de correntes de ar — pintinhos nao regulam bem a temperatura corporal nos primeiros dias.</li>
            <li>Com fonte de calor adequada a idade: a temperatura no nivel dos pintinhos deve ficar em torno de 32 a 35 graus Celsius na primeira semana, diminuindo gradualmente nas semanas seguintes.</li>
            <li>Acao imediata com racao inicial completa — boa concentracao proteica (normalmente 20 a 22% de proteina bruta) e agua limpa e fresca desde o nascimento.</li>
            <li>Bebedouro que nao permita que o pintinho se molhe excessivamente — pintinho molhado resfria rapido e pode morrer de hipotermia mesmo com aquecedor.</li>
          </ul>
          <p>
            Observe se todos comem, bebem e se movimentam normalmente. Pintinhos que ficam agrupados sob a fonte de calor estao com frio; os que se afastam estao com calor. O ideal e que se distribuam pelo espaco de forma uniforme.
          </p>
        </Section>

        <Section title="Recria — da segunda semana ate o inicio da fase adulta">
          <p>
            A medida que crescem, os jovens precisam de espaco. Lotacao excessiva favorece competicao, sujeira, lesoes e pior desenvolvimento. Sinais de superlotacao incluem bicos e penas danificadas (resultado de bicos), crescimento irregular entre aves e maior frequencia de doencas respiratorias.
          </p>
          <p>
            O acompanhamento do peso deve ser usado como ferramenta de comparacao entre irmaos e lotes, nunca como unico criterio de selecao. Um pintinho que cresce mais devagar pode ter conformacao excelente — e um que cresce rapido pode ter problemas de aprumo pelo excesso de peso precoce.
          </p>
        </Section>

        <Section title="Variacao no empenamento">
          <p>
            E comum haver variacao no ritmo de empenamento entre pintinhos da mesma ninhada. Alguns se cobrem de penas mais rapido, outros ficam mais tempo com areas de penugem. Isso nao e necessariamente sinal de problema — mas aves com empenamento muito atrasado merecem atencao sanitaria e nutricional.
          </p>
        </Section>

        <Section title="Selecao gradual — quando e como descartar">
          <p>
            Evite descartar precocemente apenas por diferencas de plumagem ou crescimento em uma unica fase. Algumas caracteristicas se definem com a maturidade. Um pintinho mais escuro pode ter a plumagem esperada quando adulto; um menor pode compensar no desenvolvimento tardio.
          </p>
          <p>
            Problemas estruturais claros — como dedos muito tortos, dificuldade persistente de apoio, desvios graves de coluna — devem ser registrados desde cedo para evitar que sejam usados inadvertidamente na reproducao.
          </p>
        </Section>

        <Callout>
          Em pintinhos GSB, o grande porte adulto comeca a se delinear na recria. Acompanhe conformacao e aprumos desde cedo — aves de porte elevado com problemas de aprumo que se agravam com o peso sao mais dificeis de corrigir na fase adulta.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
