import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/alimentacao")({
  head: () => ({
    meta: [
      { title: "Alimentacao e Manejo da Galinha GSB — Instalacoes e Racao por Fase" },
      { name: "description", content: "Guia completo de alimentacao e manejo da Galinha GSB Sertaneja Balao: consumo de racao por fase, instalacoes adequadas ao grande porte, poleiros, ninhos, piso e sombreamento." },
      { property: "og:title", content: "Alimentacao e Manejo da Galinha GSB" },
      { property: "og:description", content: "Consumo de racao por fase, instalacoes, poleiros, ninhos e manejo adaptado ao grande porte da Galinha GSB." },
      { property: "og:image", content: "/logo.png" },
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
        title="Manejo, instalacoes e alimentacao da Galinha GSB"
        intro="O grande porte da GSB exige instalacoes pensadas para estabilidade e conforto. O objetivo e permitir que a ave expresse seu tamanho sem transformar o proprio peso em risco de queda, lesao ou dificuldade de acesso a agua e alimento."
        prev={{ to: "/guia/pintinhos", label: "Pintinhos e desenvolvimento" }}
        next={{ to: "/guia/sanidade", label: "Sanidade e observacao diaria" }}
      >
        <Section title="Instalacoes recomendadas">
          <InfoTable rows={[
            { label: "Poleiros", value: "Baixos e firmes; evitar alturas que aumentem o impacto de quedas. Para aves pesadas, quedas de poleiros altos podem causar lesoes graves nas articulacoes." },
            { label: "Ninhos", value: "Reforçados, amplos e faceis de entrar e sair. Ninhos pequenos ou de entrada estreita podem causar quebra de ovos e lesoes nas femeas pesadas." },
            { label: "Piso", value: "Seco, com boa drenagem e aderencia suficiente para aves pesadas. Piso liso aumenta o risco de escorregoes e lesoes." },
            { label: "Sombra", value: "Disponivel durante as horas quentes do dia. Aves de grande porte geram mais calor metabolico e sao mais sensiveis ao estresse termico." },
            { label: "Agua", value: "Sempre limpa e fresca, em quantidade suficiente para todo o lote. Em dias quentes, aves grandes consomem significativamente mais agua." },
            { label: "Espaco", value: "Evitar superlotacao; permitir caminhada e acesso simultaneo aos recursos. Densidade excessiva aumenta competicao, agitacao e risco de lesoes." },
            { label: "Area externa", value: "Quando possivel, acesso a ambiente de exploracao, respeitando seguranca contra predadores e clima. A GSB se beneficia de areas maiores." },
          ]} />
        </Section>

        <Section title="Alimentacao por fase — referencia do guia">
          <InfoTable rows={[
            { label: "Pintinho — 1a semana", value: "~15 g/dia. Racao inicial com bom teor proteico (20 a 22% de proteina bruta). Agua limpa e fresca essencial desde o primeiro dia." },
            { label: "Recria — ate 4 meses", value: "Ate 100 a 120 g/dia. Racao adequada a fase + complementos controlados. Transicao gradual entre racoes para evitar disbiose." },
            { label: "Adulta / postura", value: "~120 g/dia. Racao de postura, com atencao a calcio e condicao corporal. Femeas em postura precisam de calcio suficiente para formacao da casca." },
          ]} />
          <p>
            O consumo real varia com tamanho, clima, qualidade da racao, nivel de atividade e fase fisiologica. Aves em postura ativa consomem mais; aves em muda podem reduzir consumo temporariamente.
          </p>
        </Section>

        <Section title="Complementos alimentares">
          <p>
            Milho, farelo de soja, vegetais frescos e insetos podem ser utilizados como complementos, mas nao devem substituir uma formulacao balanceada. O uso excessivo de milho, por exemplo, pode desequilibrar a dieta e resultar em aves com excesso de gordura abdominal e menor producao de ovos.
          </p>
          <ul>
            <li><strong>Calcio:</strong> femeas em postura precisam de calcario ou concha de ostra disponivel. Deficiencia de calcio resulta em ovos de casca fina, quebra de ovos dentro da femea e enfraquecimento osseo.</li>
            <li><strong>Proteina:</strong> essencial na fase de crescimento e durante a muda. Reducao de proteina nessa fase atrasa o empenamento e o desenvolvimento.</li>
            <li><strong>Agua:</strong> mais importante do que qualquer complemento. Falta de agua por poucas horas em dia quente pode reduzir a postura por varios dias.</li>
          </ul>
        </Section>

        <Section title="Sinais de alimentacao inadequada">
          <ul>
            <li>Plumagem opaca ou com falhas sem explicacao de muda.</li>
            <li>Ovos de casca fina ou sem casca.</li>
            <li>Perda de peso visivelmente rapida.</li>
            <li>Reducao brusca na postura sem outra causa aparente.</li>
            <li>Crescimento desuniforme entre aves da mesma idade.</li>
          </ul>
        </Section>

        <Callout>
          Para aves de grande porte como a GSB, erros de instalacao — poleiros altos, piso escorregadio, espaco insuficiente — tem consequencias mais graves do que em racas menores. Investir em instalacoes adequadas desde o inicio reduz perdas e custos de tratamento.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
