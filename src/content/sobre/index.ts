import type { SobreContent } from "./types";
import { productionContent } from "./production";

/**
 * Conteúdo da página /sobre.
 *
 *   VITE_SOBRE_REVIEW=true  → destaca campos pendentes mesmo no build
 *   Em `vite dev` o modo revisão fica ligado automaticamente.
 *
 * O pacote original trazia uma persona fictícia de demonstração ativada por
 * variável de ambiente; ela foi deixada de fora do projeto de propósito, para
 * nunca correr o risco de ir ao ar num site real.
 */
export const SOBRE_MODE: SobreContent["mode"] = "production";

export const SOBRE_REVIEW: boolean =
  import.meta.env.DEV === true || import.meta.env.VITE_SOBRE_REVIEW === "true";

export const sobreContent: SobreContent = productionContent;

/** Texto entre colchetes = pendente de confirmação. */
export function isPending(value: string | null | undefined): boolean {
  if (!value) return true;
  return /^\[.+\]$/.test(value.trim());
}

/**
 * Lista os caminhos de todos os campos pendentes, incluindo fotos não
 * verificadas e links não conferidos. Útil para revisão antes do deploy.
 */
export function findPendingFields(content: SobreContent): string[] {
  const out: string[] = [];
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") {
      if (/^\[.+\]$/.test(node.trim())) out.push(`${path}: ${node}`);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`));
      return;
    }
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      if ("placeholderLabel" in record && record.verified === false) {
        out.push(`${path}: imagem sem confirmação (${String(record.placeholderLabel)})`);
      } else if ("href" in record && record.verified === false) {
        out.push(`${path}: link não verificado (${String(record.href)})`);
      }
      for (const [key, child] of Object.entries(record)) {
        if (key === "placeholderLabel") continue;
        walk(child, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(content, "");
  return out;
}

export type { SobreContent } from "./types";
