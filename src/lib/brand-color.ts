/**
 * Conversão de cor hexadecimal -> oklch e aplicação dinâmica dos tokens
 * da marca. Usado pelo seletor de cor do admin (Configurações -> Aparência).
 */

export const DEFAULT_BRAND_COLOR = "#3F6B52";

export function normalizeHex(input: string): string | null {
  let v = (input || "").trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(v)) v = v.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
  return "#" + v.toLowerCase();
}

type Oklch = { l: number; c: number; h: number };

export function hexToOklch(hex: string): Oklch {
  const v = normalizeHex(hex) ?? DEFAULT_BRAND_COLOR;
  const n = parseInt(v.slice(1), 16);
  const toLinear = (u: number) => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));
  const r = toLinear(((n >> 16) & 255) / 255);
  const g = toLinear(((n >> 8) & 255) / 255);
  const b = toLinear((n & 255) / 255);

  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

const fmt = ({ l, c, h }: Oklch) =>
  `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Tokens CSS derivados da cor principal escolhida no admin. */
export function brandTokens(hex: string): Record<string, string> {
  const base = hexToOklch(hex);
  const light = base.l > 0.72;
  const on = light ? "oklch(0.22 0.04 155)" : "oklch(0.98 0.02 95)";

  const primary = { l: clamp(base.l, 0.3, 0.78), c: base.c, h: base.h };
  const deep = { l: clamp(base.l * 0.92, 0.24, 0.72), c: base.c, h: base.h };
  const glow = { l: clamp(base.l * 1.4, 0.5, 0.82), c: clamp(base.c * 1.25, 0.02, 0.18), h: base.h };
  const sidebar = { l: clamp(base.l * 0.88, 0.22, 0.68), c: base.c, h: base.h };
  const sidebarAccent = { l: clamp(base.l * 1.08, 0.28, 0.75), c: base.c, h: base.h };

  return {
    "--primary": fmt(primary),
    "--primary-foreground": on,
    "--primary-deep": fmt(deep),
    "--primary-glow": fmt(glow),
    "--brand-green": fmt(deep),
    "--brand-green-foreground": on,
    "--ring": fmt(primary),
    "--sidebar": fmt(sidebar),
    "--sidebar-foreground": on,
    "--sidebar-primary": fmt(glow),
    "--sidebar-primary-foreground": on,
    "--sidebar-accent": fmt(sidebarAccent),
    "--sidebar-accent-foreground": on,
    "--sidebar-border": fmt(sidebarAccent),
    "--sidebar-ring": fmt(glow),
    "--gradient-hero": `linear-gradient(135deg, ${fmt(primary)}, ${fmt(deep)})`,
  };
}

/** Aplica os tokens no <html>, sobrepondo o tema padrão. */
export function applyBrandColor(hex: string) {
  if (typeof document === "undefined") return;
  const tokens = brandTokens(hex);
  for (const [k, v] of Object.entries(tokens)) {
    document.documentElement.style.setProperty(k, v);
  }
}
