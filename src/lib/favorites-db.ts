import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// ---------------------------------------------------------------------------
// Favoritos persistidos no banco (Lovable Cloud).
// A identidade é uma "chave de dono": o id do cliente logado (mock) ou uma
// chave anônima gerada e guardada no navegador. Ela vai no header x-owner-key,
// que as políticas de acesso exigem para ler/gravar a lista.
// ---------------------------------------------------------------------------

const OWNER_KEY_STORAGE = "gsb-favorites-owner";

let ownerKey = "";

export function setOwnerKey(key: string) {
  ownerKey = key;
}

/** Chave anônima do dispositivo (criada uma única vez). */
export function getAnonOwnerKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(OWNER_KEY_STORAGE);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(OWNER_KEY_STORAGE, key);
  }
  return key;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function createFavoritesClient() {
  return createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (SUPABASE_KEY!.startsWith("sb_") && headers.get("Authorization") === `Bearer ${SUPABASE_KEY}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", SUPABASE_KEY!);
        if (ownerKey) headers.set("x-owner-key", ownerKey);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

let _client: ReturnType<typeof createFavoritesClient> | undefined;

function client() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  if (!_client) _client = createFavoritesClient();
  return _client;
}

/** Lê todos os favoritos do dono atual. */
export async function fetchFavorites(): Promise<string[]> {
  const c = client();
  if (!c || !ownerKey) return [];
  const { data, error } = await c
    .from("favorites")
    .select("post_id")
    .eq("owner_key", ownerKey)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[favoritos] falha ao carregar", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.post_id);
}

export async function addFavoriteRemote(postId: string) {
  const c = client();
  if (!c || !ownerKey) return;
  const { error } = await c
    .from("favorites")
    .upsert({ owner_key: ownerKey, post_id: postId }, { onConflict: "owner_key,post_id", ignoreDuplicates: true });
  if (error) console.error("[favoritos] falha ao salvar", error.message);
}

export async function removeFavoriteRemote(postId: string) {
  const c = client();
  if (!c || !ownerKey) return;
  const { error } = await c
    .from("favorites")
    .delete()
    .eq("owner_key", ownerKey)
    .eq("post_id", postId);
  if (error) console.error("[favoritos] falha ao remover", error.message);
}

export async function addManyFavoritesRemote(postIds: string[]) {
  const c = client();
  if (!c || !ownerKey || postIds.length === 0) return;
  const { error } = await c
    .from("favorites")
    .upsert(
      postIds.map((post_id) => ({ owner_key: ownerKey, post_id })),
      { onConflict: "owner_key,post_id", ignoreDuplicates: true },
    );
  if (error) console.error("[favoritos] falha ao sincronizar", error.message);
}
