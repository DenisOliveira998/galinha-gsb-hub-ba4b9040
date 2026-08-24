/** Textos das páginas legais — específicos ao site Galinha GSB. */
export interface LegalDoc {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
}

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  termos: {
    slug: "/termos",
    title: "Termos de Uso",
    description: "Condições de uso do site Galinha GSB — portal sobre a raça Sertanejo Balão.",
    intro:
      "Ao acessar e utilizar o site Galinha GSB (galinhagsb.com.br), você concorda com as condições descritas abaixo. Caso não concorde com algum item, pedimos que não utilize o site.",
    sections: [
      {
        heading: "1. O que é este site",
        body: "O Galinha GSB é um portal informativo sobre a raça Sertanejo Balão (GSB) e um espaço de venda direta de ovos férteis, pintinhos, galinhas e reprodutores mantidos no plantel do criador Leonardo Reis. O conteúdo inclui artigos sobre manejo, nutrição, genética e história da raça, além de um catálogo de animais disponíveis para aquisição.",
      },
      {
        heading: "2. Natureza dos produtos",
        body: "Ovos férteis são produtos biológicos. A taxa de eclosão varia conforme as condições de incubação, transporte e manejo realizados pelo comprador. Não garantimos índices mínimos de eclosão após a entrega dos ovos. Aves vivas estão sujeitas à variabilidade natural da criação. Qualquer condição específica deve ser tratada diretamente no contato antes da compra.",
      },
      {
        heading: "3. Como funcionam as negociações",
        body: "As negociações são conduzidas diretamente via WhatsApp (+55 31 98625-0673) ou pelo formulário de contato do site. Preços, disponibilidade e condições de envio são definidos no momento do contato e podem mudar sem aviso prévio. O fechamento de uma compra só ocorre após confirmação expressa de ambas as partes pelo canal de comunicação.",
      },
      {
        heading: "4. Responsabilidades do usuário",
        body: "Você se compromete a usar o site de forma lícita: não tentar burlar mecanismos de segurança, não publicar comentários ou avaliações ofensivas, e não reproduzir textos, fotos ou vídeos do site sem autorização prévia do responsável.",
      },
      {
        heading: "5. Conteúdo de terceiros e links afiliados",
        body: "O site pode exibir anúncios do Google AdSense e links de afiliados para produtos de terceiros. O Galinha GSB não se responsabiliza por práticas, preços, prazos ou políticas desses parceiros. As recomendações de produtos refletem a experiência do criador com a raça GSB e não são influenciadas pelo recebimento de comissões.",
      },
      {
        heading: "6. Propriedade intelectual",
        body: "Textos, fotografias, vídeos e demais conteúdos publicados no site são de autoria própria, salvo quando indicado de outra forma. É proibida a reprodução total ou parcial sem autorização por escrito de Leonardo Reis.",
      },
      {
        heading: "7. Alterações",
        body: "Estes termos podem ser atualizados sempre que necessário. A versão vigente é a publicada nesta página, com data de última atualização indicada no rodapé.",
      },
    ],
  },

  privacidade: {
    slug: "/privacidade",
    title: "Política de Privacidade",
    description: "Como o site Galinha GSB coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
    intro:
      "Esta política explica, de forma direta, como o site Galinha GSB coleta, usa e protege seus dados. O controlador responsável é Leonardo Reis, operador do site galinhagsb.com.br, acessível pelo e-mail galinhabalaosertanejo@gmail.com ou pelo WhatsApp +55 31 98625-0673. Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).",
    sections: [
      {
        heading: "1. Dados que coletamos",
        body: "Coletamos apenas o que você fornece voluntariamente: nome, e-mail e mensagem quando você usa o formulário de contato; nome e texto quando você publica um comentário ou avaliação em anúncios. Além disso, ferramentas de análise e publicidade coletam dados técnicos de navegação automaticamente, como páginas visitadas, tempo de permanência, tipo de dispositivo e endereço IP anonimizado.",
      },
      {
        heading: "2. Como usamos os dados",
        body: "Os dados fornecidos voluntariamente são usados exclusivamente para responder ao seu contato ou publicar seu comentário. Os dados de navegação são usados para entender como o site é acessado (análise de audiência) e para exibir anúncios relevantes. Não usamos seus dados para envio de e-mails em massa, newsletters ou campanhas de marketing sem sua solicitação.",
      },
      {
        heading: "3. Parceiros e tecnologias de terceiros",
        body: "O site utiliza o Google AdSense para exibição de anúncios. O Google pode usar o cookie DART e tecnologias similares para personalizar os anúncios com base nas suas visitas a este e a outros sites. O Google tem política de privacidade própria, disponível em policies.google.com/privacy. Podemos utilizar também ferramentas de análise de audiência, como o Google Analytics, que processa dados de forma agregada e anonimizada.",
      },
      {
        heading: "4. Armazenamento local no seu navegador",
        body: "Recursos como carrinho de compras, lista de favoritos e preferência de tema claro/escuro são salvos diretamente no seu navegador (localStorage), sem transmissão para nossos servidores. Você pode apagar esses dados a qualquer momento nas configurações do navegador.",
      },
      {
        heading: "5. Compartilhamento de dados",
        body: "Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Compartilhamos informações técnicas estritamente necessárias com provedores de infraestrutura (hospedagem, banco de dados) e parceiros de publicidade (Google), que possuem políticas de privacidade próprias e estão sujeitos às mesmas obrigações legais.",
      },
      {
        heading: "6. Seus direitos segundo a LGPD",
        body: "Você tem direito a: confirmar a existência de tratamento dos seus dados; acessar os dados que temos sobre você; corrigir dados incompletos ou desatualizados; solicitar a exclusão dos dados que forneceu voluntariamente; revogar consentimentos dados anteriormente. Para exercer qualquer desses direitos, entre em contato pelo e-mail galinhabalaosertanejo@gmail.com.",
      },
      {
        heading: "7. Retenção e segurança",
        body: "Os dados fornecidos em formulários e comentários são mantidos enquanto o conteúdo ao qual estão associados existir no site. Adotamos medidas técnicas razoáveis para proteger as informações contra acesso não autorizado. Em caso de incidente de segurança que afete dados pessoais, notificaremos os titulares e a ANPD conforme exigido pela LGPD.",
      },
    ],
  },

  cookies: {
    slug: "/cookies",
    title: "Aviso de Cookies e LGPD",
    description: "Quais cookies o site Galinha GSB utiliza, para que servem e como você pode gerenciá-los.",
    intro:
      "O site Galinha GSB utiliza cookies — pequenos arquivos de texto armazenados no seu navegador — para que o site funcione corretamente, para lembrar suas preferências e para mensurar audiência e anúncios. Esta página explica cada tipo de cookie usado e como você pode controlá-los.",
    sections: [
      {
        heading: "1. Cookies essenciais",
        body: "São necessários para o funcionamento básico do site e não podem ser desativados sem comprometer a experiência. Exemplos: manter os itens no carrinho de compras entre visitas, salvar sua lista de favoritos, manter a sessão ativa quando você faz login e lembrar sua preferência de tema claro ou escuro. Esses dados ficam armazenados no seu navegador (localStorage/sessionStorage) e não são transmitidos a servidores externos.",
      },
      {
        heading: "2. Cookies de análise de audiência",
        body: "Usamos ferramentas de análise para entender como os visitantes navegam pelo site — quais páginas são mais acessadas, de onde vêm os usuários e quanto tempo permanecem em cada seção. Esses dados são processados de forma agregada e anonimizada, sem identificar visitantes individualmente. A ferramenta pode incluir o Google Analytics.",
      },
      {
        heading: "3. Cookies de publicidade (Google AdSense e DoubleClick)",
        body: "O site exibe anúncios por meio do Google AdSense. O Google utiliza o cookie DART (também chamado de cookie DoubleClick) para veicular anúncios personalizados com base nas suas visitas a este e a outros sites. Esse cookie não coleta informações pessoalmente identificáveis — age com base no histórico de navegação para exibir anúncios mais relevantes ao seu perfil.",
      },
      {
        heading: "4. Como gerenciar seus cookies",
        body: "Você pode bloquear ou apagar cookies a qualquer momento nas configurações do seu navegador. Para desativar especificamente a publicidade personalizada do Google, acesse adssettings.google.com. Para opt-out de cookies de redes de publicidade de terceiros, acesse aboutads.info/choices. Lembre-se: desativar cookies essenciais pode impedir o funcionamento do carrinho, dos favoritos e do login.",
      },
      {
        heading: "5. Consentimento e seus direitos (LGPD)",
        body: "Ao continuar navegando após o aviso exibido na sua primeira visita, você concorda com o uso dos cookies descritos nesta página. Você pode retirar esse consentimento a qualquer momento gerenciando os cookies no seu navegador. Para dúvidas ou solicitações relacionadas a dados pessoais, entre em contato pelo e-mail galinhabalaosertanejo@gmail.com.",
      },
    ],
  },

  afiliados: {
    slug: "/afiliados",
    title: "Divulgação de Links Afiliados",
    description: "Como o site Galinha GSB usa links afiliados e como isso afeta (ou não) nossas recomendações.",
    intro:
      "O site Galinha GSB pode conter links de afiliados para produtos e serviços de terceiros. Esta página explica como funcionam esses links e garante que nossas recomendações são independentes de qualquer relação comercial.",
    sections: [
      {
        heading: "1. O que são links afiliados",
        body: "Links afiliados são endereços rastreáveis que, quando você clica e realiza uma compra no site parceiro, podem gerar uma pequena comissão para o Galinha GSB. Esse valor é pago pelo parceiro e não acrescenta nenhum custo ao preço que você pagaria sem o link.",
      },
      {
        heading: "2. O que recomendamos e por quê",
        body: "As recomendações publicadas no Galinha GSB — sejam rações, incubadoras, equipamentos de manejo ou insumos para criação de aves — refletem a experiência prática de Leonardo Reis com a criação da raça GSB ao longo de mais de 10 anos. A existência ou não de comissão não determina se um produto aparece no site: só recomendamos o que usamos ou avaliamos como útil para criadores da raça.",
      },
      {
        heading: "3. Transparência editorial",
        body: "Quando um artigo ou indicação inclui links afiliados, isso é informado no próprio conteúdo. Nossa opinião sobre um produto não muda pelo fato de recebermos comissão — se algo não nos agrada, não aparece como recomendação, independentemente de acordos comerciais.",
      },
      {
        heading: "4. Responsabilidade pela compra",
        body: "A compra é realizada diretamente no site do parceiro, sob os termos, prazos, políticas de devolução e garantias dele. O Galinha GSB não participa da transação e não se responsabiliza por cobranças, entregas, qualidade do produto ou atendimento pós-venda do parceiro.",
      },
    ],
  },

  publicidade: {
    slug: "/publicidade",
    title: "Anúncios e Google AdSense",
    description: "Como o Google AdSense funciona no site Galinha GSB e como você pode controlar os anúncios que vê.",
    intro:
      "O site Galinha GSB (galinhagsb.com.br) utiliza o Google AdSense para exibir anúncios. Esta página explica como o AdSense funciona, quais dados ele coleta e como você pode gerenciar ou desativar a publicidade personalizada.",
    sections: [
      {
        heading: "1. Como o Google AdSense funciona",
        body: "O Google AdSense é uma rede de publicidade que exibe anúncios relevantes para cada visitante com base no seu histórico de navegação e em informações de contexto da página. Os anúncios são selecionados automaticamente pelo Google — o Galinha GSB não escolhe quais marcas ou produtos aparecem.",
      },
      {
        heading: "2. O cookie DART e publicidade personalizada",
        body: "Para personalizar os anúncios, o Google utiliza o cookie DART (também chamado de cookie DoubleClick). Esse cookie registra visitas a sites que usam serviços do Google e usa esse histórico para exibir anúncios alinhados com os interesses do usuário. O cookie não coleta nome, e-mail ou outros dados pessoais identificáveis.",
      },
      {
        heading: "3. Como desativar a publicidade personalizada",
        body: "Se preferir não receber anúncios personalizados, você pode ajustar suas preferências em adssettings.google.com. Também é possível desativar cookies de redes de publicidade de terceiros em aboutads.info/choices. Desativar a personalização não elimina os anúncios — eles continuam aparecendo, porém de forma genérica.",
      },
      {
        heading: "4. Política de privacidade do Google",
        body: "O Google tem política de privacidade própria que rege o uso de dados pelo AdSense, Analytics e demais serviços. Você pode consultá-la em policies.google.com/privacy. O Galinha GSB não tem acesso aos dados individuais coletados pelo Google sobre os visitantes do site.",
      },
      {
        heading: "5. Conteúdo dos anúncios",
        body: "Não temos controle editorial sobre os anúncios exibidos pela rede do Google. Se você visualizar um anúncio inadequado ou enganoso, pode reportá-lo diretamente ao Google pelo ícone de informações (i) que aparece em cada anúncio.",
      },
    ],
  },
};
