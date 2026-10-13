import { ArrowRight, ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { links } from "@/content/sobre/shared";
import type { FaqItem } from "@/content/sobre/types";
import { Container, SectionHeader, SmartLink, buttonStyles } from "./primitives";

/**
 * Acordeão no padrão WAI-ARIA:
 * - cada pergunta é um <button> dentro de um <h3>, com aria-expanded/aria-controls;
 * - Enter/Espaço alternam; ↑ ↓ Home End movem o foco entre perguntas;
 * - o painel fechado fica `invisible`, saindo da ordem de tabulação e do leitor de tela.
 */
export function SobreFaq({ faq }: { faq: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = faq.length - 1;
    const targets: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    buttonsRef.current[target]?.focus();
  };

  return (
    <section id="perguntas" aria-labelledby="perguntas-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            id="perguntas-titulo"
            eyebrow="Perguntas frequentes"
            title="Dúvidas comuns sobre o Galinha GSB"
            lead="Respostas curtas sobre o portal, os conteúdos e os canais de atendimento."
          />
          <div className="mt-8 rounded-3xl bg-muted/60 p-6">
            <MessageCircleQuestion className="h-6 w-6 text-primary dark:text-primary-glow" aria-hidden="true" />
            <p className="mt-3 font-display text-lg">Não encontrou o que procurava?</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Envie sua pergunta pela página de contato.</p>
            <SmartLink link={links.contato} className={`${buttonStyles.outline} mt-4`}>
              Fazer uma pergunta
            </SmartLink>
          </div>
        </div>

        <div className="divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-[var(--shadow-soft)] md:px-7">
          {faq.map((item, index) => {
            const isOpen = open.has(index);
            const buttonId = `${baseId}-q${index}`;
            const panelId = `${baseId}-a${index}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    ref={(el) => {
                      buttonsRef.current[index] = el;
                    }}
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className="flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left font-display text-lg leading-snug transition hover:text-primary dark:hover:text-primary-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-xl"
                  >
                    {item.question}
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition motion-reduce:transition-none ${
                        isOpen ? "rotate-180 bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 pr-10 text-base leading-relaxed text-muted-foreground">
                      <p>{item.answer}</p>
                      {item.link && (
                        <SmartLink link={item.link} className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary dark:text-primary-glow hover:underline">
                          {item.link.label}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </SmartLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
