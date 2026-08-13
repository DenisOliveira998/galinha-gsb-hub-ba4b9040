// ---------------------------------------------------------------------------
// Better Auth — configuração do servidor
// Provedores: Google OAuth + Email OTP (Resend)
// ---------------------------------------------------------------------------

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  // Segredo para assinar sessões — obrigatório em produção
  secret: process.env.BETTER_AUTH_SECRET,

  // Banco de dados via Prisma (TiDB / MySQL)
  database: prismaAdapter(prisma, { provider: "mysql" }),

  // Email + senha desativado aqui — mantemos nosso próprio loginCustomer
  // para compatibilidade com contas já cadastradas
  emailAndPassword: { enabled: false },

  // Provedor Google
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Plugin OTP — envia código de 6 dígitos via Resend
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail(email, otp, type);
      },
      expiresIn: 600, // 10 minutos
    }),
  ],

  // URL base — usada para montar o callback do Google OAuth
  baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),

  // Opções avançadas — desativa CSRF check (API usada via fetch, não via form HTML)
  advanced: {
    disableCSRFCheck: true,
  },

  // Origens confiáveis (evita CSRF)
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://galinha-blond.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],

  // Hook: ao criar usuário via Google/OTP, cria ou vincula registro na tabela customers
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const existing = await prisma.customer.findUnique({ where: { email: user.email } });
            if (existing) {
              if (!existing.userId) {
                await prisma.customer.update({
                  where: { email: user.email },
                  data: { userId: user.id, name: user.name || existing.name },
                });
              }
            } else {
              await prisma.customer.create({
                data: {
                  userId: user.id,
                  name: user.name || user.email.split("@")[0],
                  email: user.email,
                  passwordHash: null,
                },
              });
            }
          } catch (err) {
            console.error("[auth hook] Erro ao criar/vincular customer:", err);
          }
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Helper: envia e-mail com código OTP via Resend
// ---------------------------------------------------------------------------
async function sendOTPEmail(email: string, otp: string, type: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[sendOTPEmail] RESEND_API_KEY não configurada");
    return;
  }

  const isSignIn = type === "sign-in";
  const subject = isSignIn
    ? "Seu código de acesso — Galinha GSB"
    : "Confirme seu e-mail — Galinha GSB";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:420px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#2D5A3D">Galinha GSB</p>
      <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#1A2018">
        ${isSignIn ? "Seu código de acesso" : "Confirme seu e-mail"}
      </h1>
      <p style="margin:0 0 16px;color:#444;font-size:15px">Use o código abaixo para ${isSignIn ? "entrar na sua conta" : "confirmar seu cadastro"}:</p>
      <div style="background:#EBF2ED;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px">
        <span style="font-size:44px;font-weight:800;letter-spacing:12px;color:#2D5A3D;font-variant-numeric:tabular-nums">${otp}</span>
      </div>
      <p style="margin:0;color:#888;font-size:13px">Válido por <strong>10 minutos</strong>. Não compartilhe este código com ninguém.</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Galinha GSB <onboarding@resend.dev>",
        to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[sendOTPEmail] Resend erro:", res.status, body);
    }
  } catch (err) {
    console.error("[sendOTPEmail] Fetch error:", err);
  }
}
