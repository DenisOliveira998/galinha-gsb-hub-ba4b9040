import { ClipboardList, Info } from "lucide-react";
import { useEffect, useMemo } from "react";
import { findPendingFields } from "@/content/sobre";
import type { SobreContent } from "@/content/sobre/types";
import { SobreBreed } from "./SobreBreed";
import { SobreCta } from "./SobreCta";
import { SobreEditorial } from "./SobreEditorial";
import { SobreFaq } from "./SobreFaq";
import { SobreGallery, getGalleryItems } from "./SobreGallery";
import { SobreHero } from "./SobreHero";
import { SobreHub } from "./SobreHub";
import { SobreComoComprar, SobreFatosRaca } from "./SobreInstitucional";
import { CicloCriacao } from "@/components/site/ciclo-criacao";
import { SobrePractices } from "./SobrePractices";
import { SobrePurpose } from "./SobrePurpose";
import { SobreResponsible } from "./SobreResponsible";
import { SobreStory } from "./SobreStory";
import { SobreTransparency } from "./SobreTransparency";
import { Container, SobreReviewContext } from "./primitives";

const sectionNav = [
  { href: "#historia", label: "História" },
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#proposito", label: "Propósito" },
  { href: "#a-raca", label: "A raça" },
  { href: "#raca-em-fatos", label: "A raça em fatos" },
  { href: "#como-trabalhamos", label: "Como trabalhamos" },
  { href: "#do-ovo-a-adulta", label: "Do ovo à adulta" },
  { href: "#como-comprar", label: "Como comprar" },
  { href: "#compromisso-editorial", label: "Editorial" },
  { href: "#conteudos", label: "Conteúdos" },
  { href: "#galeria", label: "Galeria" },
  { href: "#transparencia", label: "Transparência" },
  { href: "#perguntas", label: "Perguntas" },
  { href: "#contato", label: "Contato" },
];

/**
 * Página "Sobre" completa. Renderiza dentro do layout raiz do site
 * (cabeçalho, rodapé e banner de cookies continuam vindo de __root).
 *
 * @param review  destaca pendências e mostra fotos ainda não confirmadas.
 *                Conteúdo de demonstração força o modo revisão.
 */
export function SobrePage({ content, review }: { content: SobreContent; review: boolean }) {
  const isDemo = content.mode === "demo";
  const reviewMode = review || isDemo;
  const pending = useMemo(() => (reviewMode && !isDemo ? findPendingFields(content) : []), [content, reviewMode, isDemo]);

  useEffect(() => {
    if (pending.length > 0) {
      console.warn(`[sobre] ${pending.length} campo(s) pendente(s) de confirmação:\n- ${pending.join("\n- ")}`);
    }
  }, [pending]);

  return (
    <SobreReviewContext.Provider value={reviewMode}>
      <div className="bg-background text-foreground">
        {isDemo && content.demoNotice && (
          <div role="note" className="border-b border-accent/50 bg-accent-warm text-accent-warm-foreground">
            <Container className="flex items-start gap-3 py-3 text-sm leading-relaxed">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                <strong className="font-semibold">Conteúdo de demonstração. </strong>
                {content.demoNotice.replace(/^Versão de demonstração\.\s*/, "")}
              </p>
            </Container>
          </div>
        )}

        {pending.length > 0 && (
          <div className="border-b border-dashed border-accent bg-accent/10">
            <Container className="py-3">
              <details className="text-sm">
                <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
                  <ClipboardList className="h-4 w-4 text-accent" aria-hidden="true" />
                  Modo revisão: {pending.length} item(ns) aguardando confirmação
                  <span className="font-normal text-muted-foreground">— clique para ver (não aparece no build final)</span>
                </summary>
                <ul className="mt-3 max-h-64 list-disc space-y-1 overflow-auto pl-6 font-mono text-xs text-muted-foreground">
                  {pending.map((item) => (
                    <li key={item} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </Container>
          </div>
        )}

        <SobreHero hero={content.hero} logo={content.organization.logo} />

        <nav aria-label="Nesta página" className="border-b border-border bg-background">
          <Container>
            <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 py-3 text-sm [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
              {sectionNav
                .filter((item) => item.href !== "#galeria" || getGalleryItems(content.gallery, reviewMode).length > 0)
                .map((item) => (
                <li key={item.href} className="shrink-0">
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center rounded-full px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>

        <SobreStory story={content.story} />
        <SobreResponsible responsible={content.responsible} />
        <SobrePurpose purpose={content.purpose} />
        {/* Institucional (out/2026): quem somos → a raça → como cuidamos →
            como comprar → como escrevemos → onde aprofundar. */}
        <SobreBreed breed={content.breed} logo={content.organization.logo} />
        <SobreFatosRaca />
        <SobrePractices practices={content.practices} />
        <CicloCriacao id="do-ovo-a-adulta" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 md:px-8 md:py-24" />
        <SobreComoComprar />
        <SobreEditorial editorial={content.editorial} />
        <SobreHub hub={content.hub} />
        <SobreGallery gallery={content.gallery} />
        <SobreTransparency transparency={content.transparency} />
        <SobreFaq faq={content.faq} />
        <SobreCta cta={content.cta} contacts={content.contacts} />
      </div>
    </SobreReviewContext.Provider>
  );
}
