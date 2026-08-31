import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

export const Route = createFileRoute("/guia/reproducao")({
  head: () => ({
    meta: [
      { title: "Reproducao da Galinha GSB — Fertilidade, Ovos Ferteis e Incubacao" },
      { name: "description", content: "Tudo sobre reproducao da Galinha GSB Sertaneja Balao: acasalamento, coleta de ovos ferteis, armazenamento, incubacao artificial e cuidados para maximizar fertilidade e eclosaо." },
      { property: "og:title", content: "Reproducao da Galinha GSB — Ovos Ferteis e Incubacao" },
      { property: "og:description", content: "Acasalamento, coleta de ovos ferteis, incubacao artificial e cuidados para garantir boa eclosaо da Galinha GSB." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ReproducaoPage,
});

function ReproducaoPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Reproducao"
        title="Reproducao, fertilidade e incubacao da Galinha GSB"
        intro="A reproducao da GSB deve considerar o porte elevado das aves. O acasalamento precisa ocorrer em piso firme, sem excesso de lotacao e com femeas em condicao corporal adequada. Machos muito pesados ou com aprumos ruins podem reduzir a eficiencia de cobertura."
        prev={{ to: "/guia/selecao", label: "Selecao de reprodutores" }}
        next={{ to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" }}
      >
        <Section title="Condicoes ideais para o acasalamento">
          <ul>
            <li>Piso firme e seco, com boa aderencia — evitar superficies escorregadias que dificultem a cobertura de aves pesadas.</li>
            <li>Sem superlotacao: o excesso de femeas por macho ou de aves no mesmo espaco pode reduzir as taxas de fertilidade.</li>
            <li>Femeas em boa condicao corporal — nem muito magras, nem com excesso de gordura abdominal.</li>
            <li>Machos com aprumos firmes e vigor observado — machos com dificuldade de locomocao cobrem menos.</li>
            <li>Observar o comportamento do macho: vigor sem agressividade excessiva as femeas.</li>
          </ul>
        </Section>

        <Section title="Ovos ferteis — o que observar antes de incubar">
          <ul>
            <li>Coletar ovos com frequencia para reduzir sujeira, trincas e exposicao prolongada ao calor.</li>
            <li>Evitar ovos rachados, deformados ou com casca muito comprometida para incubacao.</li>
            <li>Armazenar por curto periodo em ambiente fresco e estavel antes de colocar na chocadeira.</li>
            <li>Identificar lote e data de coleta para comparar fertilidade entre acasalamentos.</li>
            <li>Ovos muito pequenos, muito grandes ou de formato muito irregular tendem a ter menor taxa de eclosao.</li>
          </ul>
        </Section>

        <Section title="Armazenamento antes da incubacao">
          <p>
            O periodo ideal de armazenamento antes de incubar e de 3 a 7 dias. Quanto mais tempo o ovo fica armazenado antes de ir para a chocadeira, menor tende a ser a taxa de eclosao. O ambiente de armazenamento deve ser fresco (entre 15 e 18 graus Celsius, idealmente), com umidade controlada e longe de variacoes bruscas de temperatura.
          </p>
          <p>
            Ovos armazenados devem ser mantidos com a ponta fina voltada para baixo e, quando o periodo for mais longo, virados levemente todos os dias para evitar que a gema grude na membrana interna.
          </p>
        </Section>

        <Section title="Incubacao artificial x incubacao natural">
          <p>
            O guia recomenda preferir incubacao artificial ou uma galinha de menor porte como mae adotiva, devido ao risco de quebra dos ovos sob uma ave muito pesada como a GSB. Na chocadeira, o resultado depende nao apenas da genetica, mas tambem de:
          </p>
          <ul>
            <li><strong>Temperatura:</strong> normalmente entre 37,5 e 37,8 graus Celsius para incubacao em chocadeira eletrica.</li>
            <li><strong>Umidade:</strong> em torno de 55 a 60% nos primeiros 18 dias e 65 a 70% nos ultimos 3 dias (periodo de eclosao).</li>
            <li><strong>Ventilacao:</strong> essencial para troca de gases — ovos em desenvolvimento respiram.</li>
            <li><strong>Viragem:</strong> deve ocorrer no minimo 3 vezes ao dia ate o 18o dia; a maioria das chocadeiras automaticas faz isso continuamente.</li>
            <li><strong>Conservacao previa dos ovos:</strong> ovos mal armazenados reduzem a taxa de eclosao independentemente da qualidade da chocadeira.</li>
          </ul>
        </Section>

        <Section title="Ovoscopia — verificando o desenvolvimento">
          <p>
            A ovoscopia consiste em iluminar o ovo por tras com uma fonte de luz para visualizar o desenvolvimento do embriao. Pode ser feita por volta do 7o dia para identificar ovos inferteis (claros) ou com embrioes mortos (escuros sem movimento/rede de vasos). Retirando esses ovos cedo, reduz-se o risco de explosao e contaminacao dos demais.
          </p>
        </Section>

        <Callout>
          Fertilidade nao e garantida nem por ovos caros nem por reprodutores de aparencia impecavel. Acasalamento planejado, condicoes adequadas e boas praticas de coleta e incubacao fazem mais diferenca do que qualquer outro fator isolado.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
