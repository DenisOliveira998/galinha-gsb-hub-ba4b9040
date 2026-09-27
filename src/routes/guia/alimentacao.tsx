import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/alimentacao")({
  head: () => ({
    meta: [
      { title: "Alimentação e Manejo da Galinha GSB — Instalações e Ração por Fase" },
      { name: "description", content: "Guia completo de alimentação e manejo da Galinha GSB Sertaneja Balão: consumo de ração por fase, instalações adequadas ao grande porte, poleiros, ninhos, piso e sombreamento." },
      { property: "og:title", content: "Alimentação e Manejo da Galinha GSB" },
      { property: "og:description", content: "Consumo de ração por fase, instalações, poleiros, ninhos e manejo adaptado ao grande porte da Galinha GSB." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: AlimentacaoPage,
});

function AlimentacaoPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Manejo"
        title="Manejo, instalações e alimentação da Galinha GSB"
        intro="O grande porte da GSB exige instalações pensadas para estabilidade e conforto. O objetivo é permitir que a ave expresse seu tamanho sem transformar o próprio peso em risco de queda, lesão ou dificuldade de acesso à água e alimento."
        prev={{ to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" }}
        next={{ to: "/guia/sanidade", label: "Sanidade e observação diária" }}
      >
        <Section title="Instalações recomendadas">
          <InfoTable rows={[
            { label: "Poleiros", value: "Baixos e firmes; evitar alturas que aumentem o impacto de quedas. Para aves pesadas, quedas de poleiros altos podem causar lesões graves nas articulações." },
            { label: "Ninhos", value: "Reforçados, amplos e fáceis de entrar e sair. Ninhos pequenos ou de entrada estreita podem causar quebra de ovos e lesões nas fêmeas pesadas." },
            { label: "Piso", value: "Seco, com boa drenagem e aderência suficiente para aves pesadas. Piso liso aumenta o risco de escorregões e lesões." },
            { label: "Sombra", value: "Disponível durante as horas quentes do dia. Aves de grande porte geram mais calor metabólico e são mais sensíveis ao estresse térmico." },
            { label: "Água", value: "Sempre limpa e fresca, em quantidade suficiente para todo o lote. Em dias quentes, aves grandes consomem significativamente mais água." },
            { label: "Espaço", value: "Evitar superlotação; permitir caminhada e acesso simultâneo aos recursos. Densidade excessiva aumenta competição, agitação e risco de lesões." },
            { label: "Área externa", value: "Quando possível, acesso a ambiente de exploração, respeitando segurança contra predadores e clima. A GSB se beneficia de áreas maiores." },
          ]} />
        </Section>

        <Section title="Alimentação por fase — referência do guia">
          <InfoTable rows={[
            { label: "Pintinho — 1a semana", value: "~15 g/dia. Ração inicial com bom teor proteico (20 a 22% de proteína bruta). Água limpa e fresca essencial desde o primeiro dia." },
            { label: "Recria — até 4 meses", value: "Até 100 a 120 g/dia. Ração adequada à fase + complementos controlados. Transição gradual entre rações para evitar disbiose." },
            { label: "Adulta / postura", value: "~120 g/dia. Ração de postura, com atenção ao cálcio e condição corporal. Fêmeas em postura precisam de cálcio suficiente para formação da casca." },
          ]} />
          <p>
            O consumo real varia com tamanho, clima, qualidade da ração, nível de atividade e fase fisiológica. Aves em postura ativa consomem mais; aves em muda podem reduzir consumo temporariamente.
          </p>
        </Section>

        <Section title="Complementos alimentares">
          <p>
            Milho, farelo de soja, vegetais frescos e insetos podem ser utilizados como complementos, mas não devem substituir uma formulação balanceada. O uso excessivo de milho, por exemplo, pode desequilibrar a dieta e resultar em aves com excesso de gordura abdominal e menor produção de ovos.
          </p>
          <ul>
            <li><strong>Cálcio:</strong> fêmeas em postura precisam de calcário ou concha de ostra disponível. Deficiência de cálcio resulta em ovos de casca fina, quebra de ovos dentro da fêmea e enfraquecimento ósseo.</li>
            <li><strong>Proteína:</strong> essencial na fase de crescimento e durante a muda. Redução de proteína nessa fase atrasa o empenamento e o desenvolvimento.</li>
            <li><strong>Água:</strong> mais importante do que qualquer complemento. Falta de água por poucas horas em dia quente pode reduzir a postura por vários dias.</li>
          </ul>
        </Section>

        <Section title="Sinais de alimentação inadequada">
          <ul>
            <li>Plumagem opaca ou com falhas sem explicação de muda.</li>
            <li>Ovos de casca fina ou sem casca.</li>
            <li>Perda de peso visivelmente rápida.</li>
            <li>Redução brusca na postura sem outra causa aparente.</li>
            <li>Crescimento desuniforme entre aves da mesma idade.</li>
          </ul>
        </Section>

        <Callout>
          Para aves de grande porte como a GSB, erros de instalação — poleiros altos, piso escorregadio, espaço insuficiente — têm consequências mais graves do que em raças menores. Investir em instalações adequadas desde o início reduz perdas e custos de tratamento.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
