import { ArrowRight, ArrowUpRight, Globe, Mail } from "lucide-react";
import type { ComponentType } from "react";
import type { ContactChannel, SobreContent } from "@/content/sobre/types";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "./icons";
import { Container, SmartLink, buttonStyles } from "./primitives";

const channelIcon: Record<ContactChannel["kind"], ComponentType<{ className?: string }>> = {
  whatsapp: (p) => <WhatsAppIcon {...p} />,
  email: (p) => <Mail aria-hidden="true" {...p} />,
  instagram: (p) => <InstagramIcon {...p} />,
  youtube: (p) => <YouTubeIcon {...p} />,
  page: (p) => <Globe aria-hidden="true" {...p} />,
};

export function SobreCta({ cta, contacts }: { cta: SobreContent["cta"]; contacts: ContactChannel[] }) {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="scroll-mt-24 pb-20 pt-4 md:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-primary-deep p-7 text-primary-foreground shadow-[var(--shadow-card)] md:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2 id="contato-titulo" className="text-balance font-display text-3xl leading-tight md:text-4xl">
                {cta.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">{cta.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SmartLink link={cta.primary} className={buttonStyles.accent}>
                  {cta.primary.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </SmartLink>
                <SmartLink link={cta.secondary} className={buttonStyles.ghostInverted}>
                  {cta.secondary.label}
                </SmartLink>
              </div>
            </div>

            {contacts.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Canais oficiais</h3>
                <ul className="mt-3 space-y-2.5">
                  {contacts.map((channel) => {
                    const Icon = channelIcon[channel.kind];
                    return (
                      <li key={channel.href}>
                        <SmartLink
                          link={{ href: channel.href }}
                          className="group flex min-h-14 items-center gap-3 rounded-2xl bg-primary-foreground/5 px-4 py-3 ring-1 ring-primary-foreground/15 transition hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-glow"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-foreground/10">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs text-primary-foreground/70">{channel.label}</span>
                            <span className="block truncate text-sm font-semibold">{channel.value}</span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 opacity-60 transition group-hover:opacity-100" aria-hidden="true" />
                        </SmartLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
