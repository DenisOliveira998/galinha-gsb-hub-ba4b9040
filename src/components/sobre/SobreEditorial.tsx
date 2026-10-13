import { ArrowRight, CircleCheck, FileClock } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { Container, SectionHeader, SmartLink, buttonStyles } from "./primitives";

export function SobreEditorial({ editorial }: { editorial: SobreContent["editorial"] }) {
  const policyPublished = editorial.status === "vigente" && editorial.policyLink?.verified;

  return (
    <section id="compromisso-editorial" aria-labelledby="editorial-titulo" className="scroll-mt-24 bg-secondary/60 py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeader id="editorial-titulo" eyebrow="Nosso compromisso com a informação" title={editorial.title} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {editorial.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          {policyPublished && editorial.policyLink ? (
            <p className="mt-6 text-sm">
              <SmartLink link={editorial.policyLink} className="inline-flex min-h-10 items-center font-semibold text-primary dark:text-primary-glow hover:underline">
                Leia a política editorial completa
              </SmartLink>
            </p>
          ) : (
            <p className="mt-6 inline-flex items-start gap-2.5 rounded-2xl border border-dashed border-accent bg-card px-4 py-3 text-sm leading-relaxed">
              <FileClock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-foreground">Proposta em validação.</strong>{" "}
                <span className="text-muted-foreground">
                  Estes compromissos ainda não constituem uma política editorial publicada.
                </span>
              </span>
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <SmartLink link={editorial.blogLink} className={buttonStyles.primary}>
              {editorial.blogLink.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </SmartLink>
            {editorial.disclosureLinks.map((link) => (
              <SmartLink key={link.href} link={link} className="inline-flex min-h-10 items-center text-sm font-semibold text-primary dark:text-primary-glow hover:underline">
                {link.label}
              </SmartLink>
            ))}
          </div>
        </div>

        <ol className="grid content-start gap-3 sm:grid-cols-2" aria-label="Compromissos editoriais">
          {editorial.commitments.map((commitment, index) => (
            <li key={commitment} className="flex gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] md:p-5">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-primary-glow" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                <span className="sr-only">{index + 1}. </span>
                {commitment}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
