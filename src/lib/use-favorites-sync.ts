import { useEffect } from "react";
import { useStore } from "@/lib/mock-store";
import { useShop } from "@/lib/shop-store";
import {
  addManyFavoritesRemote,
  fetchFavorites,
  getAnonOwnerKey,
  setOwnerKey,
} from "@/lib/favorites-db";

/**
 * Sincroniza a lista de favoritos com o banco. Roda uma vez por sessão (e
 * novamente quando o cliente entra/sai da conta): mescla o que estava salvo
 * localmente com o que está no banco, e mantém a store como cache local.
 */
export function useFavoritesSync() {
  const currentCustomerId = useShop((s) => s.currentCustomerId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const key = currentCustomerId ? `customer:${currentCustomerId}` : getAnonOwnerKey();
    setOwnerKey(key);

    (async () => {
      const local = useStore.getState().favorites ?? [];
      const remote = await fetchFavorites();
      if (cancelled) return;

      // Envia ao banco o que só existia neste navegador.
      const missing = local.filter((id) => !remote.includes(id));
      if (missing.length) await addManyFavoritesRemote(missing);
      if (cancelled) return;

      const merged = Array.from(new Set([...missing, ...remote]));
      useStore.setState({ favorites: merged });
    })();

    return () => {
      cancelled = true;
    };
  }, [currentCustomerId]);
}
