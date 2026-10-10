import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Egg, MessageCircle, ShieldCheck, Sprout, UserCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/site-layout";
import { listPublishedBlogSummaries } from "@/lib/blog";
import { useSettingsQuery, EMPTY_SETTINGS } from "@/lib/hooks/use-settings";
import { whatsappHref, type SiteSettings } from "@/lib/mock-store";
import { AUTHOR } from "@/lib/author";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

// Página Sobre. Todos os fatos aqui vêm do próprio criador (texto original da
// página). Não acrescentar números, prêmios, certificações ou datas que não
// sejam verdadeiros — informação falsa numa página pública engana o comprador
// e é motivo de reprovação no AdSense/Google.

export const Route = createFileRoute("/sobre")({
  loader: async () => {
    const posts = await listPublishedBlogSummaries().catch(() => []);
    const avatar = posts.find((p) => p.author?.name?.toLowerCase().includes("leonardo"))?.author?.avatar ?? null;
    return { avatar, postCount: posts.length };
  },
  head: () => {
    const title = "Sobre — Galinha GSB | Plantel Sertanejo Balão de Leonardo Reis";
    const desc =
      "Conheça o Galinha GSB e Leonardo Reis, criador da raça Sertanejo Balão há mais de 10 anos: plantel próprio, seleção linhagem por linhagem e venda direta, sem intermediários.";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: `${SITE_URL}/sobre`,
      inLanguage: "pt-BR",
      about: {
        "@type": "Organization",
        name: "Galinha GSB",
        url: SITE_URL,
        logo: DEFAULT_OG_IMAGE,
        founder: { "@type": "Person", name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
      },
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: "Sobre — Galinha GSB" },
        { name: "twitter:description", content: desc },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: About,
});

const PILARES = [
  {
    icon: Sprout,
    title: "Plantel próprio",
    text: "Ovos férteis, pintinhos, galinhas e galos reprodutores vêm todos do mesmo plantel. Não há revenda de aves de terceiros.",
  },
  {
    icon: ShieldCheck,
    title: "Seleção acompanhada",
    text: "Os reprodutores são selecionados linhagem por linhagem, com acompanhamento do plantel ao longo dos anos — sem atalhos.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento direto",
    text: "Quem responde as mensagens é o próprio criador — sem script de atendimento e sem pressa para fechar venda.",
  },
];

function About() {
  const { avatar, postCount } = Route.useLoaderData();
  const { data: s = EMPTY_SETTINGS } = useSettingsQuery();
  const wa = whatsappHref(s as SiteSettings, "Olá! Li a página Sobre e gostaria de conversar sobre o plantel.");

  return (
    <SiteLayout>
      <section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
          <span className="rounded-full bg-primary-glow/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-primary-glow/40">
            Nossa história
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">Sobre a Galinha GSB</h1>
          <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">
            Um criatório dedicado à raça Sertanejo Balão, conduzido por Leonardo Reis há mais de dez anos — com plantel
            próprio, seleção acompanhada de perto e conteúdo técnico sobre a raça em português.
          </p>
        </div>
      </section>

      {/* Quem cuida do plantel */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-[220px_1fr] md:px-8">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {avatar ? (
            <img src={avatar} alt={`${AUTHOR.name}, criador da Galinha GSB`} className="h-40 w-40 rounded-3xl object-cover shadow-[var(--shadow-card)]" />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-3xl bg-muted">
              <UserCircle2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <p className="mt-4 font-display text-xl">{AUTHOR.name}</p>
          <p className="text-sm text-muted-foreground">Criador e responsável pelo plantel</p>
          <Link to={AUTHOR.path as any} className="mt-2 text-sm font-semibold text-primary hover:underline">
            Ver página do autor →
          </Link>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <h2 className="font-display text-2xl text-foreground md:text-3xl">Quem cuida do plantel</h2>
          <p>
            Meu nome é <strong className="text-foreground">Leonardo Reis</strong> e crio galinhas da raça Sertanejo Balão há
            mais de dez anos. Comecei com um pequeno lote adquirido de um criador da região, e desde o início o que me chamou
            atenção na raça foi a combinação de rusticidade, temperamento tranquilo e aquela silhueta inconfundível — a
            plumagem solta, o peito largo, o porte de quem foi criado a campo aberto.
          </p>
          <p>
            Com o tempo fui selecionando os melhores reprodutores, acompanhando linhagem por linhagem, e o plantel foi
            crescendo de forma séria, sem atalhos. Hoje os animais que saem daqui têm procedência e histórico de seleção.
          </p>
        </div>
      </section>

      {/* Como trabalhamos */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl">Como trabalhamos</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PILARES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display text-lg">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            A Galinha GSB nasceu para juntar num só lugar o que já era feito de forma dispersa: publicar conteúdo técnico
            sobre a raça e disponibilizar animais do próprio plantel para quem quer criar com qualidade. Quando você entra em
            contato, fala diretamente com o criador.
          </p>
        </div>
      </section>

      {/* O que oferecemos + conteúdo */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-2 md:px-8">
        <div className="rounded-3xl border border-border p-6">
          <Egg className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-display text-xl">O que oferecemos</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Ovos férteis</li>
            <li>Pintinhos</li>
            <li>Galinhas</li>
            <li>Galos reprodutores</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            A disponibilidade muda conforme a época e a fase do plantel. Consulte o{" "}
            <Link to="/catalogo" className="font-semibold text-primary hover:underline">catálogo</Link> ou pergunte antes de comprar.
          </p>
        </div>
        <div className="rounded-3xl border border-border p-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-display text-xl">Conteúdo sobre a raça</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            No <Link to="/guia" className="font-semibold text-primary hover:underline">Guia da GSB</Link> e no{" "}
            <Link to="/blog" className="font-semibold text-primary hover:underline">blog</Link>
            {postCount > 0 ? ` (${postCount} artigos)` : ""} publico textos sobre manejo, alimentação, reprodução,
            características da raça e seleção de reprodutores. Escrevo a partir do que aprendi na prática, complementado pela
            literatura técnica sobre avicultura de raças locais.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A ideia não é substituir um médico-veterinário ou zootecnista — é dar ao criador uma referência confiável sobre a
            Sertanejo Balão, uma raça que ainda tem pouco material publicado em português.
          </p>
        </div>
      </section>

      {/* Contato */}
      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl bg-primary-deep p-8 text-primary-foreground md:p-10">
          <h2 className="font-display text-2xl md:text-3xl">Vamos conversar?</h2>
          <p className="mt-3 max-w-2xl text-sm opacity-85 md:text-base">
            Se você está começando com a GSB, quer reforçar o plantel com sangue selecionado ou entender melhor a raça antes
            de investir, fale comigo. Criador bom é aquele que vende para quem vai cuidar bem do animal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary-deep">
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp{s.whatsapp ? ` · ${s.whatsapp}` : ""}
            </a>
            {s.email && (
              <a href={`mailto:${s.email}`} className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-primary-foreground/40 hover:bg-primary-foreground/10">
                {s.email}
              </a>
            )}
            <Link to="/contato" className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-primary-foreground/40 hover:bg-primary-foreground/10">
              Página de contato
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
