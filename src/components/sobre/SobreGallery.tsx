import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { galleryCategoryLabels } from "@/content/sobre/shared";
import type { GalleryCategory, GalleryItem, SobreContent } from "@/content/sobre/types";
import { Container, SectionHeader, SobreImage, canShowImage, useSobreReview } from "./primitives";

/** Itens exibidos: tudo em revisão (com espaços reservados); só fotos publicáveis no build final. */
export function getGalleryItems(gallery: SobreContent["gallery"], review: boolean): GalleryItem[] {
  return review ? gallery.items : gallery.items.filter((item) => canShowImage(item, review));
}

type Filter = GalleryCategory | "todas";

export function SobreGallery({ gallery }: { gallery: SobreContent["gallery"] }) {
  const review = useSobreReview();
  const [filter, setFilter] = useState<Filter>("todas");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(() => getGalleryItems(gallery, review), [gallery, review]);
  const categories = useMemo(
    () => (Object.keys(galleryCategoryLabels) as GalleryCategory[]).filter((c) => items.some((i) => i.category === c)),
    [items],
  );
  const visible = filter === "todas" ? items : items.filter((i) => i.category === filter);

  // Só abre no visualizador o que realmente tem foto exibível.
  const viewable = visible.filter((item) => canShowImage(item, review));

  if (items.length === 0) return null;

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <SectionHeader id="galeria-titulo" eyebrow="Galeria do projeto" title="Um olhar sobre a criação" lead={gallery.intro} />

        {categories.length > 1 && (
          <div role="group" aria-label="Filtrar fotos por categoria" className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
            {(["todas", ...categories] as Filter[]).map((value) => {
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(value)}
                  className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {value === "todas" ? "Todas" : galleryCategoryLabels[value]}
                </button>
              );
            })}
          </div>
        )}

        <ul className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visible.map((item) => {
            const viewIndex = viewable.indexOf(item);
            return (
              <li key={item.id}>
                <figure className="group overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  <div className="relative">
                    <SobreImage image={item} className="aspect-[4/3]" imgClassName="transition duration-500 motion-safe:group-hover:scale-[1.03]" />
                    {viewIndex >= 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenIndex(viewIndex)}
                        className="absolute inset-0 grid place-items-end p-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        <span className="sr-only">Ampliar foto: {item.alt}</span>
                        <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground opacity-0 shadow-[var(--shadow-soft)] transition group-hover:opacity-100 group-focus-within:opacity-100">
                          <Expand className="h-4 w-4" />
                        </span>
                      </button>
                    )}
                  </div>
                  <figcaption className="p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary dark:text-primary-glow">{galleryCategoryLabels[item.category]}</span>
                    {item.caption && <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.caption}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </Container>

      <Lightbox items={viewable} index={openIndex} onChange={setOpenIndex} />
    </section>
  );
}

/**
 * Visualizador com <dialog> nativo: foco preso no modal, Esc fecha,
 * setas navegam e o foco volta ao botão de origem ao fechar.
 */
function Lightbox({
  items,
  index,
  onChange,
}: {
  items: GalleryItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null && !!items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      // showModal foca o primeiro botão; o esperado é começar em "Fechar".
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const close = () => {
    onChange(null);
    returnFocusRef.current?.focus();
  };
  const step = (delta: number) => {
    if (index === null) return;
    onChange((index + delta + items.length) % items.length);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const item = index !== null ? (items[index] ?? null) : null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Visualizador de fotos"
      onClose={() => index !== null && close()}
      onKeyDown={onKeyDown}
      onClick={(event) => event.target === event.currentTarget && close()}
      className="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none overflow-visible rounded-3xl bg-transparent p-0 text-primary-foreground backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {item && (
        <figure className="relative">
          <img
            src={item.src ?? undefined}
            alt={item.alt}
            className="max-h-[78vh] w-full rounded-3xl bg-black/40 object-contain"
          />
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span>
              <span className="font-semibold">{galleryCategoryLabels[item.category]}</span>
              {item.caption && <span className="opacity-80"> — {item.caption}</span>}
            </span>
            <span className="opacity-70" aria-live="polite">
              {(index ?? 0) + 1} de {items.length}
            </span>
          </figcaption>

          <div className="absolute right-3 top-3 flex gap-2">
            {items.length > 1 && (
              <>
                <LightboxButton label="Foto anterior" onClick={() => step(-1)}>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </LightboxButton>
                <LightboxButton label="Próxima foto" onClick={() => step(1)}>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </LightboxButton>
              </>
            )}
            <LightboxButton ref={closeRef} label="Fechar visualizador" onClick={close}>
              <X className="h-5 w-5" aria-hidden="true" />
            </LightboxButton>
          </div>
        </figure>
      )}
    </dialog>
  );
}

const LightboxButton = forwardRef<HTMLButtonElement, { label: string; onClick: () => void; children: ReactNode }>(
  function LightboxButton({ label, onClick, children }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className="grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {children}
      </button>
    );
  },
);
