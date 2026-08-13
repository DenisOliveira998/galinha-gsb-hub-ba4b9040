// ---------------------------------------------------------------------------
// Better Auth — cliente (lado do browser)
// ---------------------------------------------------------------------------

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // O baseURL é relativo quando não especificado — Better Auth usa a origem atual
  plugins: [emailOTPClient()],
});

export type AuthSession = typeof authClient.$Infer.Session;
