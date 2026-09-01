import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Galinha GSB | Plantel Sertanejo Balão de Leonardo Reis" },
      { name: "description", content: "Conheça Leonardo Reis, criador da raça Sertanejo Balão há mais de 10 anos. Plantel próprio com procedência garantida — ovos férteis, pintinhos, galinhas e reprodutores GSB." },
      { property: "og:title", content: "Sobre — Galinha GSB | Plantel Sertanejo Balão de Leonardo Reis" },
      { property: "og:description", content: "Conheça Leonardo Reis, criador da raça Sertanejo Balão há mais de 10 anos. Plantel próprio com procedência garantida." },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Sobre — Galinha GSB" },
      { name: "twitter:description", content: "Conheça Leonardo Reis, criador da raça Sertanejo Balão há mais de 10 anos." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <span className="rounded-full bg-primary-glow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">Nossa história</span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Sobre a Galinha GSB</h1>
          <p className="mt-4 max-w-2xl text-base opacity-80">
            O plantel de Leonardo Reis — criador da raça Sertanejo Balão com mais de 10 anos de experiência.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="space-y-7 text-lg leading-relaxed text-muted-foreground">
          <p>
            Meu nome é <strong className="text-foreground">Leonardo Reis</strong> e crio galinhas da raça Sertanejo Balão há mais de dez anos. Comecei com um pequeno lote adquirido de um criador da região, e desde o início o que me chamou atenção na raça foi a combinação de rusticidade, temperamento tranquilo e aquela silhueta inconfundível — a plumagem solta, o peito largo, o porte de quem foi criado a campo aberto. Com o tempo fui selecionando os melhores reprodutores, acompanhando linhagem por linhagem, e o plantel foi crescendo de forma séria, sem atalhos. Hoje os animais que saem daqui têm procedência documentada e histórico de seleção.
          </p>
          <p>
            O Galinha GSB nasceu da necessidade de juntar num só lugar o que eu já fazia de forma dispersa: publicar conteúdo técnico sobre a raça e disponibilizar animais do próprio plantel para quem quer criar com qualidade. Tudo que você encontra no catálogo — ovos férteis, pintinhos, galinhas e galos reprodutores — vem do meu plantel, diretamente. Não há intermediário, não há revenda de terceiros. Quando você entra em contato, fala diretamente comigo.
          </p>
          <p>
            No blog e no <strong className="text-foreground">Guia da GSB</strong> publico artigos sobre manejo, alimentação, reprodução, características da raça e seleção de reprodutores. Escrevo a partir do que aprendi na prática ao longo desses anos, complementado pela literatura técnica disponível sobre avicultura de raças locais. A ideia não é substituir um veterinário ou zootecnista — é dar ao criador iniciante e ao criador experiente uma referência confiável sobre a Sertanejo Balão especificamente, uma raça que ainda tem pouco material publicado em português.
          </p>
          <p>
            Se você está começando com a GSB, procura reforçar o plantel com sangue selecionado ou quer entender melhor a raça antes de investir, este é o lugar certo. Entre em contato pelo WhatsApp ou por e-mail — respondo pessoalmente, sem script de atendimento, e sem pressa de fechar venda. Criador bom é aquele que vende para quem vai cuidar bem do animal.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
