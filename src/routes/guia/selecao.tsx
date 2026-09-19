import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

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
            <li>Explicacao clara sobre o que e garantido na venda e o que nao pode ser garantido, especialmente em ovos ferteis.</li>
          </ul>
        </Section>

        <Section title="Sinais visuais rapidos ao comprar">
          <p><strong>Bom sinal:</strong></p>
          <ul>
            <li>Corpo largo e arredondado, volume proporcional para a idade.</li>
            <li>Pernas fortes e, no padrao do portal, amarelas.</li>
            <li>Ave ativa, alerta e respirando normalmente.</li>
            <li>Plumagem limpa e bem implantada.</li>
            <li>Vendedor mostra origem e responde perguntas com clareza.</li>
          </ul>
          <p><strong>Sinal de atencao:</strong></p>
          <ul>
            <li>Corpo excessivamente longo, estreito ou sem volume.</li>
            <li>Desvios de aprumo, apoio ruim ou cor fora do padrao adotado.</li>
            <li>Apatia, secrecoes, ruidos respiratorios ou dificuldade para andar.</li>
            <li>Penas muito quebradas, falhas extensas sem explicacao de muda.</li>
            <li>Anuncio sem historico, sem imagens reais ou com respostas evasivas.</li>
          </ul>
        </Section>

        <Section title="Criterios prioritarios de selecao">
          <ul>
            <li><strong>Estrutura e aprumos:</strong> a ave precisa sustentar o proprio peso com seguranca e sem dificuldade de locomocao.</li>
            <li><strong>Conformacao:</strong> corpo compacto, profundo e arredondado deve aparecer de forma natural, sem exageros ou desproporoes.</li>
            <li><strong>Saude e vigor:</strong> crescimento consistente, atividade normal, respiracao sem ruidos e penas em bom estado.</li>
            <li><strong>Fertilidade e reproducao:</strong> macho deve demonstrar capacidade de cobertura sem lesionar femeas; femeas devem manter boa condicao corporal e postura compativel com a linhagem.</li>
            <li><strong>Temperamento:</strong> docilidade facilita manejo diario e reduz acidentes, especialmente em aves de grande porte.</li>
            <li><strong>Plumagem e cor:</strong> selecionar depois que os criterios funcionais estiverem satisfeitos — a plumagem e o ultimo filtro, nao o primeiro.</li>
          </ul>
        </Section>

        <Section title="Proporcao entre machos e femeas">
          <p>
            A proporcao adequada entre machos e femeas impacta diretamente a fertilidade dos ovos e a saude das femeas. Uma proporcao muito alta de machos gera disputa, estresse e lesoes nas femeas. Uma proporcao muito baixa pode resultar em ovos inferteis.
          </p>
          <InfoTable rows={[
            { label: "Proporcao recomendada", value: "1 macho para 8 a 12 femeas em piquete misto." },
            { label: "Proporcao minima funcional", value: "1 macho para 5 a 6 femeas — abaixo disso, risco de lesoes nas femeas." },
            { label: "Macho unico em grupo pequeno", value: "Monitorar sinais de estresse nas femeas: penas danificadas nas costas e cabeca sao indicativo de excesso de cobertura." },
            { label: "Periodo de descanso do macho", value: "Machos muito frequentemente usados tem queda de fertilidade. Rodizio entre machos melhora resultados em planteis maiores." },
          ]} />
        </Section>

        <Section title="Evite selecionar apenas pelo extremo">
          <p>
            Buscar somente a ave mais pesada ou mais alta pode aumentar desproporoes indesejadas. Em uma raca cujo tipo desejado e arredondado e compacto, peso deve vir acompanhado de largura, profundidade, musculatura adequada e boa locomocao.
          </p>
          <p>
            Aves muito pesadas com aprumos comprometidos tem maior risco de problemas articulares com o avan como da idade e podem ter dificuldade de cobertura natural. Selecionar o extremo de peso sem observar estrutura pode piorar esse aspecto ao longo das geracoes.
          </p>
        </Section>

        <Section title="Quando renovar os reprodutores">
          <p>
            Reprodutores GSB podem ser usados com eficiencia por varios anos, mas a fertilidade e a producao de ovos tendem a cair progressivamente. Uma referencia pratica para planteis de selecao:
          </p>
          <ul>
            <li>Femeas reprodutoras: manter ate 2 a 3 anos de vida, avaliando producao e saude individualmente.</li>
            <li>Machos reprodutores: avaliar fertilidade e comportamento anualmente. Machos muito velhos podem ter queda de libido e fertilidade mesmo com boa saude aparente.</li>
            <li>Renovacao parcial: substituir 25 a 33% do plantel a cada ano permite manter diversidade de idades e reduzir o impacto de qualquer perda individual.</li>
          </ul>
        </Section>

        <Section title="Registro de acasalamentos">
          <p>
            Mesmo em criacao domestica, anotar quais aves foram acasaladas e quais caracteristicas apareceram nos descendentes melhora muito a selecao ao longo do tempo. Um caderno simples ou planilha com identificacao, data de nascimento, peso, cor, postura, fertilidade e observacoes de conformacao permite comparar geracoes e reduzir decisoes baseadas apenas na memoria.
          </p>
          <p>
            Um sistema minimo de registro inclui: identificacao do casal (ou trio), data do acasalamento, numero de ovos incubados, taxa de eclosao, numero de pintinhos criados e descricao dos melhores e piores da ninhada. Esse historico se torna valioso especialmente a partir da segunda e terceira geracoes.
          </p>
        </Section>

        <Section title="Como introduzir sangue novo no plantel">
          <p>
            Em algum momento, todo plantel fechado precisara de sangue novo para evitar reducao de vigor e fertilidade por consanguinidade acumulada. A introducao deve ser planejada e nao urgente — sangue novo introduzido em crise sanitaria aumenta o risco de trazer doencas junto.
          </p>
          <p>
            O ideal e adquirir aves de criador confiavel, fazer quarentena de pelo menos 30 dias antes de qualquer contato com o plantel existente, e avaliar os descendentes dos acasalamentos cruzados antes de descartar ou manter os novos individuos no plantel definitivo.
          </p>
          <p>
            A quarentena deve ser em local separado, sem compartilhamento de agua, comedouros ou ferramentas. Observe sinais clinicos durante todo o periodo antes de qualquer integracao.
          </p>
        </Section>

        <Section title="Controle de consanguinidade">
          <p>
            Populacoes pequenas podem acumular parentesco rapidamente. Quando possivel, controle a origem dos reprodutores e evite repetir continuamente acasalamentos muito proximos sem objetivo e acompanhamento. A queda de vigor por consanguinidade (inbreeding depression) se manifesta tipicamente como menor eclodibilidade, pintinhos mais frageis e menor resistencia sanitaria geral.
          </p>
          <p>
            Uma forma pratica de controle e manter pelo menos dois ou tres machos de origens distintas e alternar os acasalamentos a cada geracao. Em planteis maiores, a divisao em familias com cruzamento rotativo entre familias e uma estrategia mais estruturada para o mesmo objetivo.
          </p>
        </Section>

        <Callout>
          A selecao e um processo continuo. Resultados consistentes aparecem ao longo de geracoes — nao em um unico acasalamento. Paciencia, observacao e registro sao as principais ferramentas do criador sério.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
