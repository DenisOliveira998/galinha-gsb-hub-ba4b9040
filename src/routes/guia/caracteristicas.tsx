import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/caracteristicas")({
  head: () => ({
    meta: [
      { title: "Caracteristicas da Galinha GSB — Padrao Morfologico e Dimorfismo Sexual" },
      { name: "description", content: "Tudo sobre as caracteristicas da Galinha Sertaneja Balao: porte gigante, padrao morfologico detalhado, diferencas entre macho e femea e como avaliar cada parte da ave." },
      { property: "og:title", content: "Caracteristicas da Galinha GSB — Padrao Morfologico" },
      { property: "og:description", content: "Porte gigante, conformacao arredondada e padrao morfologico detalhado da Galinha Sertaneja Balao." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaracteristicasPage,
});

function CaracteristicasPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Raca"
        title="Caracteristicas gerais, padrao morfologico e dimorfismo da GSB"
        intro="A GSB e descrita como uma ave rustica, de porte gigante, temperamento docil e corpo marcadamente largo e arredondado. Seu valor para o criador esta na combinacao entre presenca ornamental, producao de carne e capacidade de contribuir para o melhoramento de planteis caipiras."
        prev={{ to: "/guia/origem", label: "Origem e formacao historica" }}
        next={{ to: "/guia/plumagem", label: "Plumagens e cores" }}
      >
        <Section title="Dados de referencia da raca">
          <InfoTable rows={[
            { label: "Peso adulto", femea: "4 a 6 kg", macho: "6 a 8 kg" },
            { label: "Inicio da postura", femea: "5 a 6 meses", macho: "—" },
            { label: "Producao anual de ovos", femea: "160 a 260 ovos", macho: "—" },
            { label: "Formato corporal", femea: "Largo, compacto e arredondado", macho: "Largo, robusto e arredondado" },
            { label: "Temperamento", femea: "Docil e de facil manejo", macho: "Docil; observar comportamento individual" },
            { label: "Cor das pernas (padrao do portal)", femea: "Amarela", macho: "Amarela" },
          ]} />
        </Section>

        <Section title="O que da a aparencia de balao">
          <p>
            O efeito visual nao vem apenas do peso. Ele resulta da combinacao entre tronco largo, profundidade de peito, quilha com espaco para musculatura, coxas e sobrecoxas desenvolvidas, plumagem volumosa e proporcoes harmonicas.
          </p>
          <p>
            Uma ave simplesmente alta ou comprida pode ser grande sem apresentar o tipo corporal caracteristico da GSB. A rusticidade ajuda a ave a lidar com diferentes condicoes, mas nao elimina a necessidade de agua limpa, sombra, alimentacao equilibrada, controle sanitario e espaco.
          </p>
        </Section>

        <Section title="Padrao morfologico detalhado — como avaliar cada parte">
          <p>O melhor metodo e observar a ave por partes e, depois, voltar ao conjunto.</p>
          <InfoTable rows={[
            { label: "Corpo", value: "Compacto, largo, arredondado e harmonico. Quilha profunda e musculatura bem distribuida. Evitar animais excessivamente longos ou desproporcionais." },
            { label: "Asas", value: "Tamanho medio e bom encaixe junto ao corpo. Asas frouxas, muito afastadas ou com deformidades merecem atencao." },
            { label: "Cabeca", value: "Grande, pesada e arredondada, proporcional ao porte. O conjunto cabeca-crista-barbelas deve transmitir vigor sem perder harmonia." },
            { label: "Olhos", value: "Vivos, atentos e expressivos. Diferentes tonalidades de iris sao descritas; valorizam-se olhos bem posicionados na linha do bico." },
            { label: "Bico", value: "Medio, forte e bem encaixado. Deve permitir alimentacao normal e nao apresentar deformacoes." },
            { label: "Crista", value: "Simples, tipo serra, vermelha e bem implantada. No macho tende a ser mais volumosa; na femea, mais discreta." },
            { label: "Barbelas", value: "Duplas, simetricas e de coloracao intensa. No macho sao normalmente maiores e mais distendidas." },
            { label: "Pescoco", value: "Forte, de tamanho medio e bem encaixado ao tronco. Pescoco excessivamente longo pode prejudicar a harmonia do tipo balao." },
            { label: "Peito", value: "Largo, profundo e musculoso. E uma das areas que mais contribuem para a sensacao de volume e robustez." },
            { label: "Aprumos", value: "Pernas firmes e simetricas, sustentando o corpo sem desvios. Observar a ave parada e em movimento." },
            { label: "Canelas", value: "No padrao do portal: amarelas, fortes e proporcionais." },
            { label: "Cauda", value: "Curta e reta, integrada ao formato corporal. Mudancas temporarias de posicao podem ocorrer em femeas proximas a postura." },
            { label: "Pes e dedos", value: "Grandes, fortes e bem formados, sem torcoes ou deformidades aparentes." },
            { label: "Plumagem", value: "Bem implantada, limpa, volumosa e coerente com a variedade. Condicao da pena influencia a aparencia geral." },
          ]} />
        </Section>

        <Section title="Defeitos de conformacao que merecem atencao">
          <p>Nem toda diferenca estetica e um defeito grave. O objetivo da selecao e distinguir variacao natural, caracteristicas ainda em consolidacao e problemas estruturais que comprometem a conformacao, o bem-estar ou a reproducao.</p>
          <ul>
            <li><strong>Coluna e harmonia corporal:</strong> desvios acentuados de coluna (como hipercifose) sao considerados problemas graves. Mesmo fora de exposicoes, desvios estruturais importantes podem interferir na locomocao, no equilibrio e no acasalamento.</li>
            <li><strong>Asas e encaixe:</strong> as asas devem permanecer bem apoiadas ao corpo. Alteracoes importantes de encaixe ou conformacoes anormais sao sinais para nao priorizar o exemplar como reprodutor sem avaliacao cuidadosa.</li>
            <li><strong>Aprumos e pes:</strong> observe a ave de frente, de tras e andando. Dedos muito tortos, dificuldade de apoio, jarretes muito aproximados ou desvios angulares podem ser agravados pelo porte elevado.</li>
          </ul>
        </Section>

        <Section title="Diferencas praticas entre macho e femea">
          <InfoTable rows={[
            { label: "Porte", femea: "Mais compacta, mantendo volume corporal", macho: "Mais alto, pesado e imponente" },
            { label: "Crista", femea: "Menor e mais discreta", macho: "Maior e mais evidente" },
            { label: "Barbelas", femea: "Menores a medias", macho: "Mais volumosas e pendentes" },
            { label: "Plumagem", femea: "Penas mais arredondadas no dorso, conjunto mais uniforme", macho: "Selins e penas de pescoco mais marcantes; brilho metalico pode ser evidente" },
            { label: "Cauda", femea: "Curta; posicao pode variar no periodo de postura", macho: "Curta, com penas sexuais do macho" },
            { label: "Comportamento", femea: "Postura, choco em algumas linhagens e capacidade maternal variavel", macho: "Cobertura das femeas; observar vigor sem agressividade excessiva" },
          ]} />
          <p>
            O dimorfismo sexual tambem ajuda a identificar desequilibrios. Um macho deve apresentar caracteristicas masculinas claras sem parecer excessivamente esticado; a femea deve conservar a conformacao arredondada sem perder funcionalidade.
          </p>
        </Section>

        <Callout>
          Em aves de grande porte, erros de piso, poleiro ou excesso de peso podem ter impacto maior sobre articulacoes e aprumos. A rusticidade da GSB nao dispensa cuidados basicos de instalacao e manejo.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
