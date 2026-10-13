import { BookOpen, ClipboardCheck, Dna, Eye, Feather, FileDown, FileText, HeartHandshake, House, Leaf, Mail, Megaphone, MessagesSquare, RefreshCw, Scale, ShieldCheck, Sprout, Stethoscope, Store, Target, Telescope, UserRound, Users, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import type { IconName } from "@/content/sobre/types";

/** Mapa nome → ícone. O conteúdo guarda só o nome, para continuar serializável. */
export const sobreIcons: Record<IconName, LucideIcon> = {
  eye: Eye,
  wheat: Wheat,
  house: House,
  dna: Dna,
  messages: MessagesSquare,
  target: Target,
  telescope: Telescope,
  "heart-handshake": HeartHandshake,
  "book-open": BookOpen,
  "file-down": FileDown,
  store: Store,
  sprout: Sprout,
  stethoscope: Stethoscope,
  mail: Mail,
  "shield-check": ShieldCheck,
  user: UserRound,
  "file-text": FileText,
  refresh: RefreshCw,
  scale: Scale,
  megaphone: Megaphone,
  feather: Feather,
  leaf: Leaf,
  users: Users,
  "clipboard-check": ClipboardCheck,
};

export function SobreIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = sobreIcons[name];
  return <Icon className={className} aria-hidden="true" />;
}

/*
 * Ícones de marca desenhados à parte: o lucide marcou os ícones de marcas
 * como obsoletos, e o site já usa um SVG próprio para o WhatsApp.
 */
type BrandProps = SVGProps<SVGSVGElement>;

export function WhatsAppIcon(props: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41" />
    </svg>
  );
}

export function InstagramIcon(props: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon(props: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
