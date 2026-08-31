import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

export const Route = createFileRoute("/guia/sanidade")({
  head: () => ({
    meta: [
      { title: "Sanidade da Galinha GSB — Saude e Observacao Diaria do Plantel" },
      { name: "description", content: "Como manter a saude do plantel de Galinha GSB Sertaneja Balao: o que observar diariamente, sinais de alerta, vacinacao, vermifugacao e boas praticas sanitarias." },
      { property: "og:title", content: "Sanidade da Galinha GSB — Saude do Plantel" },
      { property: "og:description", content: "Observacao diaria, sinais de alerta, vacinacao e vermifugacao para manter o plantel GSB saudavel." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: SanidadePage,
});

function SanidadePage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Saude"
        title="Sanidade e observacao diaria do plantel GSB"
        intro="Um criador atento percebe alteracoes antes que elas se tornem grandes problemas. Observar o lote diariamente e uma das ferramentas sanitarias mais simples e eficazes — e nao custa nada alem de alguns minutos de atencao."
        prev={{ to: "/guia/alimentacao", label: "Manejo e alimentacao" }}
        next={null}
      >
        <Section title="O que observar todos os dias">
          <ul>
            <li><strong>Consumo de agua e racao:</strong> queda repentina no consumo e um dos primeiros sinais de problema. Uma ave doente geralmente para de comer e beber antes de mostrar outros sintomas.</li>
            <li><strong>Atividade e postura corporal:</strong> aves saudaveis sao ativas, curiosas e mantem a postura ereta. Ave quieta, encurvada, afastada do lote ou com penas arrepiadas merece atencao imediata.</li>
            <li><strong>Respiracao silenciosa, sem secrecoes:</strong> ruidos ao respirar (chiado, gorgoleo), secrecao nasal ou ocular e abertura de bico para respirar sao sinais de alerta.</li>
            <li><strong>Fezes e condicao da cama:</strong> fezes muito liquidas, com sangue, esverdeadas ou com odor muito forte podem indicar problemas intestinais, parasitose ou doenca infecciosa.</li>
            <li><strong>Pes, dedos e aprumos:</strong> principalmente em aves muito pesadas — inchacos, feridas, desvios ou dificuldade de apoio merecem atencao. Bumblefoot (bolha plantar) e comum em aves pesadas criadas em pisos inadequados.</li>
            <li><strong>Penas, pele e ectoparasitas:</strong> observe se ha piolhos, acaros ou outros parasitas externos. Penas quebradas em excesso, areas sem penas e pele irritada sao sinais.</li>
            <li><strong>Integridade de crista e barbelas:</strong> coloracao palida pode indicar anemia; coloracao roxeada pode sugerir problemas circulatorios ou respiratorios.</li>
            <li><strong>Postura de ovos ou fertilidade:</strong> reducao brusca sem causa aparente (clima, estresse, alimentacao) merece investigacao.</li>
          </ul>
        </Section>

        <Section title="Vacinacao, vermifugacao e tratamentos">
          <p>
            O guia recomenda vacinacao basica e vermifugacao regular conforme orientacao veterinaria. O programa ideal depende da regiao, do sistema de criacao e dos riscos locais.
          </p>
          <p>
            Evite transformar calendarios genericos da internet em protocolo automatico para todo plantel. O que funciona em uma regiao pode nao ser necessario em outra, e o uso desnecessario de antiparasitarios pode gerar resistencia.
          </p>
          <p><strong>Principios basicos:</strong></p>
          <ul>
            <li>Novos animais entrando no plantel devem passar por periodo de quarentena (minimo 14 dias em espaco separado) antes de ter contato com os demais.</li>
            <li>Aves doentes ou com sintomas suspeitos devem ser separadas imediatamente para evitar contaminacao do lote.</li>
            <li>Utensilios, bebedouros e comedouros devem ser lavados regularmente. Agua estagnada e foco de proliferacao de bacterias e algas.</li>
            <li>A cama (maravalha, palha ou similar) deve ser mantida seca. Cama umida favorece proliferacao de fungos, bacterias e parasitas.</li>
          </ul>
        </Section>

        <Section title="Bioseguridade basica">
          <p>
            Bioseguridade nao e so para grandes aviarios. Em qualquer escala, algumas praticas reduzem significativamente o risco de introducao de doencas:
          </p>
          <ul>
            <li>Nao compartilhar equipamentos com outros criadores sem limpeza e desinfeccao previa.</li>
            <li>Controlar entrada de pessoas e animais no espaco das aves.</li>
            <li>Evitar comprar aves de origens desconhecidas sem historico sanitario.</li>
            <li>Manter o espaco limpo e sem acumulo de dejetos — ambiente limpo e o melhor preventivo.</li>
          </ul>
        </Section>

        <Callout>
          Em caso de mortalidade inexplicavel, queda brusca de postura ou doenca se espalhando pelo lote, procure orientacao veterinaria. Nao tente diagnosticar e tratar sozinho doencas complexas — o uso incorreto de medicamentos pode piorar o quadro e mascarar sintomas.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
