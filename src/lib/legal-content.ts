/** Textos padrão das páginas legais — genéricos e editáveis futuramente. */
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
    description: "Regras de uso do site Galinha GSB.",
    intro:
      "Ao acessar e utilizar este site, você concorda com os termos descritos abaixo. Caso não concorde, pedimos que não utilize o site.",
    sections: [
      { heading: "1. Objeto do site", body: "Este site apresenta informações, conteúdos e anúncios relacionados à criação da galinha da raça Sertanejo Balão (GSB), incluindo ovos férteis, aves e materiais informativos. As negociações são conduzidas diretamente entre o visitante e o criador, por WhatsApp ou outros canais informados." },
      { heading: "2. Informações de anúncios", body: "Buscamos manter preços, descrições e disponibilidade atualizados, porém eles podem mudar sem aviso prévio. Valores e condições devem sempre ser confirmados no contato direto antes da compra." },
      { heading: "3. Responsabilidades do usuário", body: "O usuário se compromete a utilizar o site de forma lícita, sem tentar burlar mecanismos de segurança, enviar conteúdo ofensivo em comentários ou avaliações, ou reproduzir textos e imagens sem autorização." },
      { heading: "4. Conteúdo de terceiros", body: "O site pode exibir anúncios, links afiliados e conteúdo de terceiros. Não nos responsabilizamos por práticas, produtos ou políticas desses terceiros." },
      { heading: "5. Alterações", body: "Estes termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página." },
    ],
  },
  privacidade: {
    slug: "/privacidade",
    title: "Política de Privacidade",
    description: "Como tratamos os dados dos visitantes do site Galinha GSB.",
    intro:
      "Esta política explica, de forma simples, quais dados coletamos, como usamos e quais são seus direitos, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).",
    sections: [
      { heading: "1. Dados coletados", body: "Coletamos apenas os dados que você fornece voluntariamente (como nome e mensagem em formulários, comentários e avaliações) e dados técnicos de navegação gerados automaticamente, como páginas visitadas e preferências salvas no seu navegador." },
      { heading: "2. Finalidade do uso", body: "Os dados são usados para responder contatos, exibir seus favoritos e preferências, melhorar o conteúdo do site e viabilizar a exibição de anúncios." },
      { heading: "3. Armazenamento local", body: "Recursos como lista de favoritos, carrinho e tema claro/escuro utilizam armazenamento no próprio navegador. Você pode limpar esses dados a qualquer momento pelas configurações do navegador." },
      { heading: "4. Compartilhamento", body: "Não vendemos dados pessoais. Podemos compartilhar informações estritamente necessárias com provedores de infraestrutura, análise e publicidade (como o Google), que possuem políticas próprias." },
      { heading: "5. Seus direitos", body: "Você pode solicitar acesso, correção ou exclusão dos seus dados pelos canais de contato informados no site." },
    ],
  },
  cookies: {
    slug: "/cookies",
    title: "Aviso de Cookies e LGPD",
    description: "Uso de cookies no site Galinha GSB e seus direitos segundo a LGPD.",
    intro:
      "Utilizamos cookies e tecnologias semelhantes para que o site funcione corretamente, lembrar suas preferências e mensurar audiência e anúncios.",
    sections: [
      { heading: "1. Cookies essenciais", body: "Necessários para o funcionamento básico: manter itens no carrinho, favoritos, sessão e preferência de tema." },
      { heading: "2. Cookies de desempenho e análise", body: "Ajudam a entender como o site é utilizado, de forma agregada, para melhorar a navegação." },
      { heading: "3. Cookies de publicidade", body: "Parceiros de publicidade, incluindo o Google, podem usar cookies para exibir anúncios mais relevantes com base nas suas visitas a este e a outros sites." },
      { heading: "4. Como gerenciar", body: "Você pode bloquear ou apagar cookies nas configurações do seu navegador. Alguns recursos do site podem deixar de funcionar corretamente sem eles." },
      { heading: "5. Consentimento (LGPD)", body: "Ao continuar navegando após o aviso exibido na primeira visita, você concorda com o uso de cookies conforme descrito nesta página e na Política de Privacidade." },
    ],
  },
  afiliados: {
    slug: "/afiliados",
    title: "Divulgação de Links Afiliados",
    description: "Aviso sobre links afiliados e comissões no site Galinha GSB.",
    intro:
      "Transparência é importante para nós: este site pode conter links de afiliados.",
    sections: [
      { heading: "1. O que são links afiliados", body: "São links para produtos ou serviços de terceiros. Se você clicar e realizar uma compra, podemos receber uma comissão, sem qualquer custo adicional para você." },
      { heading: "2. Independência editorial", body: "As recomendações refletem nossa experiência com a criação e o manejo das aves. A existência de comissão não altera o conteúdo apresentado." },
      { heading: "3. Responsabilidade da compra", body: "A compra é realizada no site do parceiro, sujeita aos termos, prazos, garantias e políticas dele. Não nos responsabilizamos por entregas, cobranças ou suporte de terceiros." },
    ],
  },
  publicidade: {
    slug: "/publicidade",
    title: "Anúncios e Google AdSense",
    description: "Aviso padrão sobre anúncios de terceiros e cookies do Google AdSense.",
    intro:
      "Este site pode exibir anúncios fornecidos por redes de publicidade de terceiros, incluindo o Google AdSense.",
    sections: [
      { heading: "1. Uso de cookies por terceiros", body: "Fornecedores terceirizados, incluindo o Google, utilizam cookies para veicular anúncios com base em visitas anteriores do usuário a este e/ou a outros sites." },
      { heading: "2. Cookie DART do Google", body: "O uso de cookies de publicidade pelo Google permite veicular anúncios personalizados aos usuários com base nas suas visitas." },
      { heading: "3. Como desativar", body: "Os usuários podem desativar a publicidade personalizada nas Configurações de anúncios do Google, ou desativar cookies de fornecedores terceirizados na página da iniciativa de publicidade em rede (www.aboutads.info)." },
      { heading: "4. Conteúdo dos anúncios", body: "Não temos controle sobre os anúncios exibidos por redes de terceiros e não nos responsabilizamos pelo conteúdo, ofertas ou práticas dos anunciantes." },
    ],
  },
};
