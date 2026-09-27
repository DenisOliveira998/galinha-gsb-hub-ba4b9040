import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

export const Route = createFileRoute("/guia/reproducao")({
  head: () => ({
    meta: [
      { title: "Reprodução da Galinha GSB — Fertilidade, Ovos Férteis e Incubação" },
      { name: "description", content: "Tudo sobre reprodução da Galinha GSB Sertaneja Balão: acasalamento, coleta de ovos férteis, armazenamento, incubação artificial e cuidados para maximizar fertilidade e eclosão." },
      { property: "og:title", content: "Reprodução da Galinha GSB — Ovos Férteis e Incubação" },
      { property: "og:description", content: "Acasalamento, coleta de ovos férteis, incubação artificial e cuidados para garantir boa eclosão da Galinha GSB." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ReproducaoPage,
});

function ReproducaoPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Reprodução"
        title="Reprodução, fertilidade e incubação da Galinha GSB"
        intro="A reprodução da GSB deve considerar o porte elevado das aves. O acasalamento precisa ocorrer em piso firme, sem excesso de lotação e com fêmeas em condição corporal adequada. Machos muito pesados ou com aprumos ruins podem reduzir a eficiência de cobertura."
        prev={{ to: "/guia/selecao", label: "Seleção de reprodutores" }}
        next={{ to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" }}
      >
        <Section title="Condições ideais para o acasalamento">
          <ul>
            <li>Piso firme e seco, com boa aderência — evitar superfícies escorregadias que dificultem a cobertura de aves pesadas.</li>
            <li>Sem superlotação: o excesso de fêmeas por macho ou de aves no mesmo espaço pode reduzir as taxas de fertilidade.</li>
            <li>Fêmeas em boa condição corporal — nem muito magras, nem com excesso de gordura abdominal.</li>
            <li>Machos com aprumos firmes e vigor observado — machos com dificuldade de locomoção cobrem menos.</li>
            <li>Observar o comportamento do macho: vigor sem agressividade excessiva às fêmeas.</li>
          </ul>
        </Section>

        <Section title="Ovos férteis — o que observar antes de incubar">
          <ul>
            <li>Coletar ovos com frequência para reduzir sujeira, trincas e exposição prolongada ao calor.</li>
            <li>Evitar ovos rachados, deformados ou com casca muito comprometida para incubação.</li>
            <li>Armazenar por curto período em ambiente fresco e estável antes de colocar na chocadeira.</li>
            <li>Identificar lote e data de coleta para comparar fertilidade entre acasalamentos.</li>
            <li>Ovos muito pequenos, muito grandes ou de formato muito irregular tendem a ter menor taxa de eclosão.</li>
          </ul>
        </Section>

        <Section title="Armazenamento antes da incubação">
          <p>
            O período ideal de armazenamento antes de incubar é de 3 a 7 dias. Quanto mais tempo o ovo fica armazenado antes de ir para a chocadeira, menor tende a ser a taxa de eclosão. O ambiente de armazenamento deve ser fresco (entre 15 e 18 graus Celsius, idealmente), com umidade controlada e longe de variações bruscas de temperatura.
          </p>
          <p>
            Ovos armazenados devem ser mantidos com a ponta fina voltada para baixo e, quando o período for mais longo, virados levemente todos os dias para evitar que a gema grude na membrana interna.
          </p>
        </Section>

        <Section title="Incubação artificial x incubação natural">
          <p>
            O guia recomenda preferir incubação artificial ou uma galinha de menor porte como mãe adotiva, devido ao risco de quebra dos ovos sob uma ave muito pesada como a GSB. Na chocadeira, o resultado depende não apenas da genética, mas também de:
          </p>
          <ul>
            <li><strong>Temperatura:</strong> normalmente entre 37,5 e 37,8 graus Celsius para incubação em chocadeira elétrica.</li>
            <li><strong>Umidade:</strong> em torno de 55 a 60% nos primeiros 18 dias e 65 a 70% nos últimos 3 dias (período de eclosão).</li>
            <li><strong>Ventilação:</strong> essencial para troca de gases — ovos em desenvolvimento respiram.</li>
            <li><strong>Viragem:</strong> deve ocorrer no mínimo 3 vezes ao dia até o 18o dia; a maioria das chocadeiras automáticas faz isso continuamente.</li>
            <li><strong>Conservação prévia dos ovos:</strong> ovos mal armazenados reduzem a taxa de eclosão independentemente da qualidade da chocadeira.</li>
          </ul>
        </Section>

        <Section title="Ovoscopia — verificando o desenvolvimento">
          <p>
            A ovoscopia consiste em iluminar o ovo por trás com uma fonte de luz para visualizar o desenvolvimento do embrião. Pode ser feita por volta do 7o dia para identificar ovos inférteis (claros) ou com embriões mortos (escuros sem movimento/rede de vasos). Retirando esses ovos cedo, reduz-se o risco de explosão e contaminação dos demais.
          </p>
        </Section>

        <Callout>
          Fertilidade não é garantida nem por ovos caros nem por reprodutores de aparência impecável. Acasalamento planejado, condições adequadas e boas práticas de coleta e incubação fazem mais diferença do que qualquer outro fator isolado.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
