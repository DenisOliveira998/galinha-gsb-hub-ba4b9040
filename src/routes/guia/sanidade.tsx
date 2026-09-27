import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

export const Route = createFileRoute("/guia/sanidade")({
  head: () => ({
    meta: [
      { title: "Sanidade da Galinha GSB — Saúde e Observação Diária do Plantel" },
      { name: "description", content: "Como manter a saúde do plantel de Galinha GSB Sertaneja Balão: o que observar diariamente, sinais de alerta, vacinação, vermifugação e boas práticas sanitárias." },
      { property: "og:title", content: "Sanidade da Galinha GSB — Saúde do Plantel" },
      { property: "og:description", content: "Observação diária, sinais de alerta, vacinação e vermifugação para manter o plantel GSB saudável." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: SanidadePage,
});

function SanidadePage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Saúde"
        title="Sanidade e observação diária do plantel GSB"
        intro="Um criador atento percebe alterações antes que elas se tornem grandes problemas. Observar o lote diariamente é uma das ferramentas sanitárias mais simples e eficazes — e não custa nada além de alguns minutos de atenção."
        prev={{ to: "/guia/alimentacao", label: "Manejo e alimentação" }}
        next={null}
      >
        <Section title="O que observar todos os dias">
          <ul>
            <li><strong>Consumo de água e ração:</strong> queda repentina no consumo é um dos primeiros sinais de problema. Uma ave doente geralmente para de comer e beber antes de mostrar outros sintomas.</li>
            <li><strong>Atividade e postura corporal:</strong> aves saudáveis são ativas, curiosas e mantêm a postura ereta. Ave quieta, encurvada, afastada do lote ou com penas arrepiadas merece atenção imediata.</li>
            <li><strong>Respiração silenciosa, sem secreções:</strong> ruídos ao respirar (chiado, gorgolejo), secreção nasal ou ocular e abertura de bico para respirar são sinais de alerta.</li>
            <li><strong>Fezes e condição da cama:</strong> fezes muito líquidas, com sangue, esverdeadas ou com odor muito forte podem indicar problemas intestinais, parasitose ou doença infecciosa.</li>
            <li><strong>Pés, dedos e aprumos:</strong> principalmente em aves muito pesadas — inchaços, feridas, desvios ou dificuldade de apoio merecem atenção. Bumblefoot (bolha plantar) é comum em aves pesadas criadas em pisos inadequados.</li>
            <li><strong>Penas, pele e ectoparasitas:</strong> observe se há piolhos, ácaros ou outros parasitas externos. Penas quebradas em excesso, áreas sem penas e pele irritada são sinais.</li>
            <li><strong>Integridade de crista e barbelas:</strong> coloração pálida pode indicar anemia; coloração roxeada pode sugerir problemas circulatórios ou respiratórios.</li>
            <li><strong>Postura de ovos ou fertilidade:</strong> redução brusca sem causa aparente (clima, estresse, alimentação) merece investigação.</li>
          </ul>
        </Section>

        <Section title="Vacinação, vermifugação e tratamentos">
          <p>
            O guia recomenda vacinação básica e vermifugação regular conforme orientação veterinária. O programa ideal depende da região, do sistema de criação e dos riscos locais.
          </p>
          <p>
            Evite transformar calendários genéricos da internet em protocolo automático para todo plantel. O que funciona em uma região pode não ser necessário em outra, e o uso desnecessário de antiparasitários pode gerar resistência.
          </p>
          <p><strong>Princípios básicos:</strong></p>
          <ul>
            <li>Novos animais entrando no plantel devem passar por período de quarentena (mínimo 14 dias em espaço separado) antes de ter contato com os demais.</li>
            <li>Aves doentes ou com sintomas suspeitos devem ser separadas imediatamente para evitar contaminação do lote.</li>
            <li>Utensílios, bebedouros e comedouros devem ser lavados regularmente. Água estagnada é foco de proliferação de bactérias e algas.</li>
            <li>A cama (maravalha, palha ou similar) deve ser mantida seca. Cama úmida favorece proliferação de fungos, bactérias e parasitas.</li>
          </ul>
        </Section>

        <Section title="Biosseguridade básica">
          <p>
            Biosseguridade não é só para grandes aviários. Em qualquer escala, algumas práticas reduzem significativamente o risco de introdução de doenças:
          </p>
          <ul>
            <li>Não compartilhar equipamentos com outros criadores sem limpeza e desinfecção prévia.</li>
            <li>Controlar entrada de pessoas e animais no espaço das aves.</li>
            <li>Evitar comprar aves de origens desconhecidas sem histórico sanitário.</li>
            <li>Manter o espaço limpo e sem acumulo de dejetos — ambiente limpo é o melhor preventivo.</li>
          </ul>
        </Section>

        <Callout>
          Em caso de mortalidade inexplicável, queda brusca de postura ou doença se espalhando pelo lote, procure orientação veterinária. Não tente diagnosticar e tratar sozinho doenças complexas — o uso incorreto de medicamentos pode piorar o quadro e mascarar sintomas.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
