import { Quote } from "lucide-react";
import type { SobreContent } from "@/content/sobre/types";
import { Container, PendingValue, SectionHeader, useShowValue } from "./primitives";

export function SobreStory({ story }: { story: SobreContent["story"] }) {
  const show = useShowValue();

  return (
    <section id="historia" aria-labelledby="historia-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader id="historia-titulo" eyebrow={story.eyebrow} title={story.title} lead={story.lead} />
          <figure className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <Quote className="h-6 w-6 text-accent" aria-hidden="true" />
            <blockquote className="mt-3 font-display text-lg leading-relaxed">{story.closing}</blockquote>
          </figure>
        </div>

        <ol className="relative space-y-10 border-l-2 border-border pl-8 md:pl-10">
          {story.chapters.map((chapter, index) => (
            <li key={chapter.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[calc(2rem+9px)] top-1 grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background md:-left-[calc(2.5rem+9px)]"
              />
              {show(chapter.marker) && (
                <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-primary-glow">
                  <PendingValue value={chapter.marker} />
                </p>
              )}
              <h3 className="mt-1.5 font-display text-xl md:text-2xl">
                <span className="sr-only">Capítulo {index + 1}: </span>
                {chapter.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">{chapter.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
