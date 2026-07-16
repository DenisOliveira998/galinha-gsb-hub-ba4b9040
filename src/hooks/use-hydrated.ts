import { useEffect, useState } from "react";

// Returns true after the first client render. Use to gate UI that reads
// values only known on the client (localStorage-backed stores, etc.) so we
// don't cause SSR/CSR hydration mismatches.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}