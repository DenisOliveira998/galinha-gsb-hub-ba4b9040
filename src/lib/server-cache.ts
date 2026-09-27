/**
 * Cache em memória no servidor com TTL.
 *
 * Funciona enquanto a instância serverless está quente (Vercel reutiliza
 * instâncias entre requisições). Reduz chamadas ao TiDB Cloud para dados
 * que mudam raramente (posts, blog, slides, settings, categorias).
 *
 * Invalidação manual: chamar `invalidate(key)` ou `invalidatePrefix(prefix)`
 * nas mutations para garantir consistência imediata após escrita.
 */

interface CacheEntry {
  data: unknown;
  exp: number;
}

const _store = new Map<string, CacheEntry>();

/**
 * Lê do cache se válido, senão executa `fn`, armazena e retorna.
 * @param key   Chave única de cache
 * @param ttlMs Tempo de vida em milissegundos
 * @param fn    Função assíncrona que busca os dados reais
 */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = _store.get(key);
  if (hit && hit.exp > now) return hit.data as T;
  const data = await fn();
  _store.set(key, { data, exp: now + ttlMs });
  return data;
}

/** Remove uma entrada específica do cache. */
export function invalidate(key: string): void {
  _store.delete(key);
}

/** Remove todas as entradas cujas chaves começam com `prefix`. */
export function invalidatePrefix(prefix: string): void {
  for (const k of _store.keys()) {
    if (k.startsWith(prefix)) _store.delete(k);
  }
}

/**
 * Executa a escrita no banco e SÓ DEPOIS limpa o cache (mesmo se der erro).
 * Limpar antes da escrita deixava uma janela em que uma leitura simultânea
 * guardava de novo o dado antigo no cache.
 */
export async function invalidateAfter<T>(prefix: string, write: () => Promise<T>): Promise<T> {
  try {
    return await write();
  } finally {
    invalidatePrefix(prefix);
  }
}
