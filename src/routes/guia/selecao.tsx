import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { GuiaArticleLayout, Section, Callout, InfoTable } from "./origem";

export const Route = createFileRoute("/guia/selecao")({
  head: () => ({
    meta: [
      { title: "Seleção de Reprodutores GSB — Como Formar um Plantel de Galinha Sertaneja Balão" },
      { name: "description", content: "Aprenda a selecionar reprodutores GSB de qualidade: critérios de conformação, procedência, controle de consanguinidade, registro de acasalamentos e formação do plantel." },
      { property: "og:title", content: "Seleção de Reprodutores GSB — Formação do Plantel" },
      { property: "og:description", content: "Critérios para selecionar reprodutores GSB, reconhecer boa procedência e formar um plantel consistente." },
      { property: "og:image", content: "https://galinhagsb.com.br/logo.png" },
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
        title="Seleção de reprodutores e formação do plantel GSB"
        intro="Formar um plantel consistente exige escolher aves que se complementem. O melhor reprodutor não é necessariamente o maior; é o indivíduo que reúne estrutura, saúde, fertilidade, temperamento e características desejadas para a próxima geração."
        prev={{ to: "/guia/plumagem", label: "Plumagens e cores" }}
        next={{ to: "/guia/reproducao", label: "Reprodução e incubação" }}
      >
        <Section title="Como reconhecer uma GSB de boa procedência">
          <p>
            Boa procedência não é sinônimo de preço alto ou de fotografia bonita. Ela é construída por transparência, histórico do plantel, consistência dos exemplares e disposição do criador em explicar o que está vendendo.
          </p>
          <p><strong>Antes de comprar, peca:</strong></p>
          <ul>
            <li>Fotos e vídeos recentes dos reprodutores e matrizes que originam os ovos ou pintinhos.</li>
            <li>Idade aproximada das aves, fase de postura e, quando disponível, peso dos reprodutores adultos.</li>
            <li>Informação sobre variedade de plumagem e se o acasalamento foi planejado para preservar determinada característica.</li>
            <li>Histórico sanitário e manejo básico do plantel.</li>
            <li>Explicação clara sobre o que é garantido na venda e o que não pode ser garantido, especialmente em ovos férteis.</li>
          </ul>
        </Section>

        <Section title="Sinais visuais rápidos ao comprar">
          <p><strong>Bom sinal:</strong></p>
          <ul>
            <li>Corpo largo e arredondado, volume proporcional para a idade.</li>
            <li>Pernas fortes e, no padrão do portal, amarelas.</li>
            <li>Ave ativa, alerta e respirando normalmente.</li>
            <li>Plumagem limpa e bem implantada.</li>
            <li>Vendedor mostra origem e responde perguntas com clareza.</li>
          </ul>
          <p><strong>Sinal de atenção:</strong></p>
          <ul>
            <li>Corpo excessivamente longo, estreito ou sem volume.</li>
            <li>Desvios de aprumo, apoio ruim ou cor fora do padrão adotado.</li>
            <li>Apatia, secreções, ruídos respiratórios ou dificuldade para andar.</li>
            <li>Penas muito quebradas, falhas extensas sem explicação de muda.</li>
            <li>Anúncio sem histórico, sem imagens reais ou com respostas evasivas.</li>
          </ul>
        </Section>

        <Section title="Critérios prioritários de seleção">
          <ul>
            <li><strong>Estrutura e aprumos:</strong> a ave precisa sustentar o próprio peso com segurança e sem dificuldade de locomoção.</li>
            <li><strong>Conformação:</strong> corpo compacto, profundo e arredondado deve aparecer de forma natural, sem exageros ou desproporções.</li>
            <li><strong>Saúde e vigor:</strong> crescimento consistente, atividade normal, respiração sem ruídos e penas em bom estado.</li>
            <li><strong>Fertilidade e reprodução:</strong> macho deve demonstrar capacidade de cobertura sem lesionar fêmeas; fêmeas devem manter boa condição corporal e postura compatível com a linhagem.</li>
            <li><strong>Temperamento:</strong> docilidade facilita manejo diário e reduz acidentes, especialmente em aves de grande porte.</li>
            <li><strong>Plumagem e cor:</strong> selecionar depois que os critérios funcionais estiverem satisfeitos — a plumagem é o último filtro, não o primeiro.</li>
          </ul>
        </Section>

        <Section title="Proporção entre machos e fêmeas">
          <p>
            A proporção adequada entre machos e fêmeas impacta diretamente a fertilidade dos ovos e a saúde das fêmeas. Uma proporção muito alta de machos gera disputa, estresse e lesões nas fêmeas. Uma proporção muito baixa pode resultar em ovos inférteis.
          </p>
          <InfoTable rows={[
            { label: "Proporção recomendada", value: "1 macho para 8 a 12 fêmeas em piquete misto." },
            { label: "Proporção mínima funcional", value: "1 macho para 5 a 6 fêmeas — abaixo disso, risco de lesões nas fêmeas." },
            { label: "Macho único em grupo pequeno", value: "Monitorar sinais de estresse nas fêmeas: penas danificadas nas costas e cabeça são indicativo de excesso de cobertura." },
            { label: "Período de descanso do macho", value: "Machos muito frequentemente usados têm queda de fertilidade. Rodízio entre machos melhora resultados em plantéis maiores." },
          ]} />
        </Section>

        <Section title="Evite selecionar apenas pelo extremo">
          <p>
            Buscar somente a ave mais pesada ou mais alta pode aumentar desproporções indesejadas. Em uma raça cujo tipo desejado é arredondado e compacto, peso deve vir acompanhado de largura, profundidade, musculatura adequada e boa locomoção.
          </p>
          <p>
            Aves muito pesadas com aprumos comprometidos têm maior risco de problemas articulares com o avanço da idade e podem ter dificuldade de cobertura natural. Selecionar o extremo de peso sem observar estrutura pode piorar esse aspecto ao longo das gerações.
          </p>
        </Section>

        <Section title="Quando renovar os reprodutores">
          <p>
            Reprodutores GSB podem ser usados com eficiência por vários anos, mas a fertilidade e a produção de ovos tendem a cair progressivamente. Uma referência prática para plantéis de seleção:
          </p>
          <ul>
            <li>Fêmeas reprodutoras: manter até 2 a 3 anos de vida, avaliando produção e saúde individualmente.</li>
            <li>Machos reprodutores: avaliar fertilidade e comportamento anualmente. Machos muito velhos podem ter queda de libido e fertilidade mesmo com boa saúde aparente.</li>
            <li>Renovação parcial: substituir 25 a 33% do plantel a cada ano permite manter diversidade de idades e reduzir o impacto de qualquer perda individual.</li>
          </ul>
        </Section>

        <Section title="Registro de acasalamentos">
          <p>
            Mesmo em criação doméstica, anotar quais aves foram acasaladas e quais características apareceram nos descendentes melhora muito a seleção ao longo do tempo. Um caderno simples ou planilha com identificação, data de nascimento, peso, cor, postura, fertilidade e observações de conformação permite comparar gerações e reduzir decisões baseadas apenas na memória.
          </p>
          <p>
            Um sistema mínimo de registro inclui: identificação do casal (ou trio), data do acasalamento, número de ovos incubados, taxa de eclosão, número de pintinhos criados e descrição dos melhores e piores da ninhada. Esse histórico se torna valioso especialmente a partir da segunda e terceira gerações.
          </p>
        </Section>

        <Section title="Como introduzir sangue novo no plantel">
          <p>
            Em algum momento, todo plantel fechado precisará de sangue novo para evitar redução de vigor e fertilidade por consanguinidade acumulada. A introdução deve ser planejada e não urgente — sangue novo introduzido em crise sanitária aumenta o risco de trazer doenças junto.
          </p>
          <p>
            O ideal é adquirir aves de criador confiável, fazer quarentena de pelo menos 30 dias antes de qualquer contato com o plantel existente, e avaliar os descendentes dos acasalamentos cruzados antes de descartar ou manter os novos indivíduos no plantel definitivo.
          </p>
          <p>
            A quarentena deve ser em local separado, sem compartilhamento de água, comedouros ou ferramentas. Observe sinais clínicos durante todo o período antes de qualquer integração.
          </p>
        </Section>

        <Section title="Controle de consanguinidade">
          <p>
            Populações pequenas podem acumular parentesco rapidamente. Quando possível, controle a origem dos reprodutores e evite repetir continuamente acasalamentos muito próximos sem objetivo e acompanhamento. A queda de vigor por consanguinidade (inbreeding depression) se manifesta tipicamente como menor eclodibilidade, pintinhos mais frágeis e menor resistência sanitária geral.
          </p>
          <p>
            Uma forma prática de controle é manter pelo menos dois ou três machos de origens distintas e alternar os acasalamentos a cada geração. Em plantéis maiores, a divisão em famílias com cruzamento rotativo entre famílias é uma estratégia mais estruturada para o mesmo objetivo.
          </p>
        </Section>

        <Callout>
          A seleção é um processo contínuo. Resultados consistentes aparecem ao longo de gerações — não em um único acasalamento. Paciência, observação e registro são as principais ferramentas do criador sério.
        </Callout>
      </GuiaArticleLayout>
    </SiteLayout>
  );
}
