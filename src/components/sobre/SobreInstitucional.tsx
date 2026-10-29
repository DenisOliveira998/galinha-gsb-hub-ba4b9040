import { ArrowUpRight } from "lucide-react";
import { Container, SectionHeader, SmartLink, buttonStyles } from "./primitives";
import { links } from "@/content/sobre/shared";

// Seções acrescentadas quando a /sobre virou a página "Institucional"
// (out/2026). Todo dado da raça abaixo já está publicado no Guia da GSB ou
// em um artigo do blog — cada cartão aponta para a sua fonte. Não acrescente
// número que não esteja publicado e conferido lá.

type Fato = { tema: string; destaque: string; texto: string; fonte: { label: string; href: string } };

const FATOS: Fato[] = [
  {
    tema: "Origem",
    destaque: "Sertão da Bahia",
    texto:
      "Formada por criadores de Baixa Grande ao longo de gerações. O isolamento da região ajudou a preservar as aves, e nas últimas duas décadas a raça ganhou popularidade fora do sertão baiano.",
    fonte: { label: "Guia: origem e formação", href: "/guia/origem" },
  },
  {
    tema: "Porte",
    destaque: "6 a 8 kg",
    texto:
      "Faixa de referência para machos bem desenvolvidos; nas fêmeas, de 4 a 6 kg. Peso não é tudo: estrutura, aprumos e proporções contam na avaliação.",
    fonte: { label: "Artigo: GSB x Índio Gigante x Brahma", href: "/blog/sertaneja-balao-x-indio-gigante-x-brahma-qual-e-realmente-a-maior-galinha-do-brasil" },
  },
  {
    tema: "Silhueta",
    destaque: "Forma de balão",
    texto:
      "Peito largo, grande volume corporal e plumagem solta dão a forma arredondada que distingue a GSB das outras galinhas crioulas. A crista é do tipo serra nos dois sexos.",
    fonte: { label: "Artigo: o padrão da raça", href: "/blog/caracteristicas-da-galinha-gsb-o-padrao-completo-da-raca-parte-por-parte" },
  },
  {
    tema: "Temperamento",
    destaque: "Tranquila",
    texto:
      "Criadores costumam descrevê-la como dócil, ativa e fácil de manejar — o que ajuda quem está começando. A convivência diária deixa as aves ainda mais calmas.",
    fonte: { label: "Artigo: a GSB é mansa?", href: "/blog/galinha-sertaneja-balao-e-mansa-descubra-o-temperamento-da-gsb" },
  },
  {
    tema: "Postura",
    destaque: "160 a 260 ovos/ano",
    texto:
      "Média de uma fêmea adulta e saudável em boas condições de manejo. A postura começa entre 5 e 6 meses e vem em ciclos de 12 a 30 ovos.",
    fonte: { label: "Artigo: quantos ovos a GSB põe", href: "/blog/quantos-ovos-a-galinha-gsb-poe-por-ano-producao-media-e-como-aumentar" },
  },
  {
    tema: "Plumagem",
    destaque: "Cor final aos 12–18 meses",
    texto:
      "A plumagem definitiva começa a aparecer entre 4 e 12 semanas, mas brilho, marcações e cores só ficam completos na segunda muda.",
    fonte: { label: "Guia: plumagens e cores", href: "/guia/plumagem" },
  },
  {
    tema: "Machos e fêmeas",
    destaque: "8 a 12 semanas",
    texto:
      "As diferenças começam a surgir entre 4 e 6 semanas e ficam evidentes entre 8 e 12 — crista, barbelas, postura e tamanho.",
    fonte: { label: "Guia: pintinhos e desenvolvimento", href: "/guia/pintinhos" },
  },
  {
    tema: "Incubação",
    destaque: "37,5 a 37,8 °C",
    texto:
      "Temperatura usual na chocadeira. Como a GSB é muito pesada e pode quebrar os ovos, o Guia recomenda chocadeira ou uma galinha menor como mãe adotiva.",
    fonte: { label: "Guia: reprodução e incubação", href: "/guia/reproducao" },
  },
];

export function SobreFatosRaca() {
  return (
    <section id="raca-em-fatos" aria-labelledby="raca-em-fatos-titulo" className="scroll-mt-24 bg-muted/40 py-16 md:py-24">
      <Container>
        <SectionHeader
          id="raca-em-fatos-titulo"
          eyebrow="A raça em fatos"
          title="O que já sabemos sobre a Sertaneja Balão"
          lead="Um resumo do que o Guia da GSB e os artigos do blog explicam em detalhe. Cada item leva à fonte, onde o assunto é aprofundado."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FATOS.map((f) => (
            <li key={f.tema} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.tema}</p>
              <p className="mt-2 font-display text-2xl leading-tight text-primary dark:text-primary-glow">{f.destaque}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{f.texto}</p>
              <SmartLink
                link={f.fonte}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-primary-glow"
              >
                {f.fonte.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </SmartLink>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Números de raças locais variam conforme linhagem, idade, alimentação e manejo — trate-os como referência, não como
          garantia.
        </p>
      </Container>
    </section>
  );
}

const PASSOS = [
  {
    titulo: "Veja o que está disponível",
    texto:
      "O catálogo mostra ovos férteis, pintinhos, galinhas e galos reprodutores do próprio plantel. A disponibilidade muda conforme a época; itens esgotados continuam lá para você pedir aviso de reposição.",
    link: { ...links.catalogo, label: "Abrir o catálogo" },
  },
  {
    titulo: "Fale direto com o criador",
    texto:
      "O botão “Reservar” abre o WhatsApp com a mensagem pronta. Quem responde é o próprio Leonardo Reis — sem atendimento automático nem intermediários.",
    link: { ...links.contato, label: "Canais de contato" },
  },
  {
    titulo: "Combine a entrega ou a retirada",
    texto:
      "Aves vivas e ovos férteis não viajam como encomenda comum: o transporte segue regras sanitárias (com GTA quando exigida) e as condições da transportadora. Tudo é combinado antes, na conversa com o criador.",
    link: { label: "Artigo: transporte com segurança", href: "/blog/como-receber-pintinhos-e-ovos-ferteis-com-seguranca-guia-de-transporte" },
  },
  {
    titulo: "Prepare a chegada",
    texto:
      "Pintinhos precisam de aquecimento (32 a 35 °C na primeira semana), água limpa e ração inicial desde o primeiro dia. Ovos férteis rendem melhor quando vão à chocadeira em até 7 dias.",
    link: { ...links.guiaPintinhos, label: "Guia: pintinhos" },
  },
];

export function SobreComoComprar() {
  return (
    <section id="como-comprar" aria-labelledby="como-comprar-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <SectionHeader
          id="como-comprar-titulo"
          eyebrow="Como comprar"
          title="Do catálogo ao seu galinheiro"
          lead="A reserva, o pagamento e a entrega são combinados em conversa com o criador, que orienta cada etapa."
        />
        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="flex gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-display text-lg font-semibold text-accent-foreground"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl leading-snug">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{p.texto}</p>
                <SmartLink
                  link={p.link}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline dark:text-primary-glow"
                >
                  {p.link.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </SmartLink>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <SmartLink link={links.catalogo} className={buttonStyles.accent}>
            Ver aves e ovos disponíveis
          </SmartLink>
          <SmartLink link={links.contato} className={buttonStyles.outline}>
            Tirar uma dúvida antes
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}
