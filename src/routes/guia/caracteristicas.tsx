import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/caracteristicas")({
  head: () => ({
    meta: [
      { title: "Características da Galinha GSB — Padrão Morfológico e Dimorfismo Sexual" },
      { name: "description", content: "Tudo sobre as características da Galinha Sertaneja Balão: porte gigante, padrão morfológico detalhado, diferenças entre macho e femea e como avaliar cada parte da ave." },
      { property: "og:title", content: "Características da Galinha GSB — Padrão Morfológico" },
      { property: "og:description", content: "Porte gigante, conformação arredondada e padrão morfológico detalhado da Galinha Sertaneja Balão." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaracteristicasPage,
});

function CaracteristicasPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Raça"
        title="Características gerais, padrão morfológico e dimorfismo da GSB"
        intro="A GSB é descrita como uma ave rústica, de porte gigante, temperamento dócil e corpo marcadamente largo e arredondado. Seu valor para o criador está na combinação entre presença ornamental, produção de carne e capacidade de contribuir para o melhoramento de plantéis caipiras."
        prev={{ to: "/guia/origem", label: "Origem e formação histórica" }}
        next={{ to: "/guia/plumagem", label: "Plumagens e cores" }}
      >
        <Section title="Dados de referência da raça">
          <InfoTable rows={[
            { label: "Peso adulto", femea: "4 a 6 kg", macho: "6 a 8 kg" },
            { label: "Início da postura", femea: "5 a 6 meses", macho: "—" },
            { label: "Produção anual de ovos", femea: "160 a 260 ovos", macho: "—" },
            { label: "Formato corporal", femea: "Largo, compacto e arredondado", macho: "Largo, robusto e arredondado" },
            { label: "Temperamento", femea: "Dócil e de fácil manejo", macho: "Dócil; observar comportamento individual" },
            { label: "Cor das pernas (padrão do portal)", femea: "Amarela", macho: "Amarela" },
          ]} />
        </Section>

        <Section title="O que dá a aparência de balão">
          <p>
            O efeito visual não vem apenas do peso. Ele resulta da combinação entre tronco largo, profundidade de peito, quilha com espaço para musculatura, coxas e sobrecoxas desenvolvidas, plumagem volumosa e proporções harmônicas.
          </p>
          <p>
            Uma ave simplesmente alta ou comprida pode ser grande sem apresentar o tipo corporal característico da GSB. A rusticidade ajuda a ave a lidar com diferentes condições, mas não elimina a necessidade de água limpa, sombra, alimentação equilibrada, controle sanitário e espaço.
          </p>
        </Section>

        <Section title="Padrão morfológico detalhado — como avaliar cada parte">
          <p>O melhor método é observar a ave por partes e, depois, voltar ao conjunto.</p>
          <InfoTable rows={[
            { label: "Corpo", value: "Compacto, largo, arredondado e harmônico. Quilha profunda e musculatura bem distribuída. Evitar animais excessivamente longos ou desproporcionais." },
            { label: "Asas", value: "Tamanho médio e bom encaixe junto ao corpo. Asas frouxas, muito afastadas ou com deformidades merecem atenção." },
            { label: "Cabeça", value: "Grande, pesada e arredondada, proporcional ao porte. O conjunto cabeca-crista-barbelas deve transmitir vigor sem perder harmonia." },
            { label: "Olhos", value: "Vivos, atentos e expressivos. Diferentes tonalidades de íris são descritas; valorizam-se olhos bem posicionados na linha do bico." },
            { label: "Bico", value: "Médio, forte e bem encaixado. Deve permitir alimentação normal e não apresentar deformações." },
            { label: "Crista", value: "Simples, tipo serra, vermelha e bem implantada. No macho tende a ser mais volumosa; na femea, mais discreta." },
            { label: "Barbelas", value: "Duplas, simétricas e de coloração intensa. No macho são normalmente maiores e mais distendidas." },
            { label: "Pescoço", value: "Forte, de tamanho médio e bem encaixado ao tronco. Pescoço excessivamente longo pode prejudicar a harmonia do tipo balão." },
            { label: "Peito", value: "Largo, profundo e musculoso. É uma das áreas que mais contribuem para a sensação de volume e robustez." },
            { label: "Aprumos", value: "Pernas firmes e simétricas, sustentando o corpo sem desvios. Observar a ave parada e em movimento." },
            { label: "Canelas", value: "No padrão do portal: amarelas, fortes e proporcionais." },
            { label: "Cauda", value: "Curta e reta, integrada ao formato corporal. Mudanças temporárias de posição podem ocorrer em fêmeas próximas a postura." },
            { label: "Pés e dedos", value: "Grandes, fortes e bem formados, sem torções ou deformidades aparentes." },
            { label: "Plumagem", value: "Bem implantada, limpa, volumosa e coerente com a variedade. Condição da pena influencia a aparência geral." },
          ]} />
        </Section>

        <Section title="Defeitos de conformação que merecem atenção">
          <p>Nem toda diferença estética é um defeito grave. O objetivo da seleção é distinguir variação natural, características ainda em consolidação e problemas estruturais que comprometem a conformação, o bem-estar ou a reprodução.</p>
          <ul>
            <li><strong>Coluna e harmonia corporal:</strong> desvios acentuados de coluna (como hipercifose) são considerados problemas graves. Mesmo fora de exposições, desvios estruturais importantes podem interferir na locomoção, no equilíbrio e no acasalamento.</li>
            <li><strong>Asas e encaixe:</strong> as asas devem permanecer bem apoiadas ao corpo. Alterações importantes de encaixe ou conformações anormais são sinais para não priorizar o exemplar como reprodutor sem avaliação cuidadosa.</li>
            <li><strong>Aprumos e pés:</strong> observe a ave de frente, de trás e andando. Dedos muito tortos, dificuldade de apoio, jarretes muito aproximados ou desvios angulares podem ser agravados pelo porte elevado.</li>
          </ul>
        </Section>

        <Section title="Diferenças práticas entre macho e femea">
          <InfoTable rows={[
            { label: "Porte", femea: "Mais compacta, mantendo volume corporal", macho: "Mais alto, pesado e imponente" },
            { label: "Crista", femea: "Menor e mais discreta", macho: "Maior e mais evidente" },
            { label: "Barbelas", femea: "Menores a médias", macho: "Mais volumosas e pendentes" },
            { label: "Plumagem", femea: "Penas mais arredondadas no dorso, conjunto mais uniforme", macho: "Selins e penas de pescoço mais marcantes; brilho metálico pode ser evidente" },
            { label: "Cauda", femea: "Curta; posição pode variar no período de postura", macho: "Curta, com penas sexuais do macho" },
            { label: "Comportamento", femea: "Postura, choco em algumas linhagens e capacidade maternal variável", macho: "Cobertura das fêmeas; observar vigor sem agressividade excessiva" },
          ]} />
          <p>
            O dimorfismo sexual também ajuda a identificar desequilíbrios. Um macho deve apresentar características masculinas claras sem parecer excessivamente esticado; a fêmea deve conservar a conformação arredondada sem perder funcionalidade.
          </p>
        </Section>

        <Callout>
          Em aves de grande porte, erros de piso, poleiro ou excesso de peso podem ter impacto maior sobre articulações e aprumos. A rusticidade da GSB não dispensa cuidados básicos de instalação e manejo.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
