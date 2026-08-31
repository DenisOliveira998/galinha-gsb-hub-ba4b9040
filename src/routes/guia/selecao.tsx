import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout } from "./origem";

export const Route = createFileRoute("/guia/selecao")({
  head: () => ({
    meta: [
      { title: "Selecao de Reprodutores GSB — Como Formar um Plantel de Galinha Sertaneja Balao" },
      { name: "description", content: "Aprenda a selecionar reprodutores GSB de qualidade: criterios de conformacao, procedencia, controle de consanguinidade, registro de acasalamentos e formacao do plantel." },
      { property: "og:title", content: "Selecao de Reprodutores GSB — Formacao do Plantel" },
      { property: "og:description", content: "Criterios para selecionar reprodutores GSB, reconhecer boa procedencia e formar um plantel consistente." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: SelecaoPage,
});

function SelecaoPage() {
  return (
    <SiteLayout>
      <GuiaArticleLayout
        tag="Plantel"
        title="Selecao de reprodutores e formacao do plantel GSB"
        intro="Formar um plantel consistente exige escolher aves que se complementem. O melhor reprodutor nao e necessariamente o maior; e o individuo que reune estrutura, saude, fertilidade, temperamento e caracteristicas desejadas para a proxima geracao."
        prev={{ to: "/guia/plumagem", label: "Plumagens e cores" }}
        next={{ to: "/guia/reproducao", label: "Reproducao e incubacao" }}
      >
        <Section title="Como reconhecer uma GSB de boa procedencia">
          <p>
            Boa procedencia nao e sinonimo de preco alto ou de fotografia bonita. Ela e construida por transparencia, historico do plantel, consistencia dos exemplares e disposicao do criador em explicar o que esta vendendo.
          </p>
          <p><strong>Antes de comprar, peca:</strong></p>
          <ul>
            <li>Fotos e videos recentes dos reprodutores e matrizes que originam os ovos ou pintinhos.</li>
            <li>Idade aproximada das aves, fase de postura e, quando disponivel, peso dos reprodutores adultos.</li>
            <li>Informacao sobre variedade de plumagem e se o acasalamento foi planejado para preservar determinada caracteristica.</li>
            <li>Historico sanitario e manejo basico do plantel.</li>
            <li>Explicacao clara sobre o que e garantido na venda — e o que nao pode ser garantido, especialmente em ovos ferteis.</li>
          </ul>
        </Section>

        <Section title="Sinais visuais rapidos ao comprar">
          <p><strong>Bom sinal:</strong></p>
          <ul>
            <li>Corpo largo e arredondado.</li>
            <li>Pernas fortes e, no padrao do portal, amarelas.</li>
            <li>Ave ativa, alerta e respirando normalmente.</li>
            <li>Plumagem limpa e bem implantada.</li>
            <li>Vendedor mostra origem e responde perguntas.</li>
          </ul>
          <p><strong>Sinal de atencao:</strong></p>
          <ul>
            <li>Corpo excessivamente longo, estreito ou sem volume.</li>
            <li>Desvios de aprumo, apoio ruim ou cor fora do padrao adotado.</li>
            <li>Apatia, secrecoes, ruidos respiratorios ou dificuldade para andar.</li>
            <li>Penas muito quebradas, falhas extensas sem explicacao de muda.</li>
            <li>Anuncio sem historico, sem imagens reais ou respostas evasivas.</li>
          </ul>
        </Section>

        <Section title="Criterios prioritarios de selecao">
          <ul>
            <li><strong>Estrutura e aprumos:</strong> a ave precisa sustentar o proprio peso com seguranca.</li>
            <li><strong>Conformacao:</strong> corpo compacto, profundo e arredondado deve aparecer de forma natural.</li>
            <li><strong>Saude e vigor:</strong> crescimento, atividade, respiracao e condicao de penas devem ser observados.</li>
            <li><strong>Fertilidade e reproducao:</strong> macho deve demonstrar capacidade de cobertura; femeas devem manter boa condicao corporal e postura compativel com a linhagem.</li>
            <li><strong>Temperamento:</strong> docilidade facilita manejo e reduz acidentes.</li>
            <li><strong>Plumagem e cor:</strong> selecionar depois que os criterios funcionais estiverem atendidos.</li>
          </ul>
        </Section>

        <Section title="Evite selecionar apenas pelo extremo">
          <p>
            Buscar somente a ave mais pesada ou mais alta pode aumentar desproporcionoes. Em uma raca cujo tipo desejado e arredondado e compacto, peso deve vir acompanhado de largura, profundidade, musculatura e boa locomocao.
          </p>
        </Section>

        <Section title="Registro de acasalamentos">
          <p>
            Mesmo em criacao domestica, anotar quais aves foram acasaladas e quais caracteristicas apareceram nos descendentes melhora muito a selecao. Um caderno simples ou planilha com identificacao, data de nascimento, peso, cor, postura, fertilidade e observacoes de conformacao permite comparar geracoes e reduzir decisoes baseadas apenas na memoria.
          </p>
        </Section>

        <Section title="Controle de consanguinidade">
          <p>
            Populacoes pequenas podem acumular parentesco rapidamente. Quando possivel, controle a origem dos reprodutores e evite repetir continuamente acasalamentos muito proximos sem objetivo e acompanhamento. A diversidade genetica ajuda a preservar vigor e fertilidade.
          </p>
        </Section>

        <Callout>
          A selecao e um processo continuo. Resultados consistentes aparecem ao longo de geracoes — nao em um unico acasalamento. Paciencia, observacao e registro sao as principais ferramentas do criador.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
