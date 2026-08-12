/**
 * Cria a estrutura .vercel/output/ (Build Output API v3) a partir do
 * dist/ gerado pelo vite build, para que o Vercel sirva o site
 * corretamente com SSR + Prisma em Node.js runtime.
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';

const OUT = '.vercel/output';

// Limpa output anterior
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });

mkdirSync(`${OUT}/static`, { recursive: true });
mkdirSync(`${OUT}/functions/ssr.func`, { recursive: true });

// 1. Assets estáticos (JS/CSS/imagens)
cpSync('dist/client', `${OUT}/static`, { recursive: true });
console.log('✓ dist/client → .vercel/output/static');

// 2. Bundle do servidor SSR
cpSync('dist/server', `${OUT}/functions/ssr.func`, { recursive: true });
console.log('✓ dist/server → .vercel/output/functions/ssr.func');

// 3. Prisma client (binário nativo necessário em runtime)
const fnModules = `${OUT}/functions/ssr.func/node_modules`;
mkdirSync(fnModules, { recursive: true });
cpSync('node_modules/.prisma',        `${fnModules}/.prisma`,        { recursive: true });
cpSync('node_modules/@prisma/client', `${fnModules}/@prisma/client`, { recursive: true });
console.log('✓ Prisma client incluído na função');

// 4. Adapter Node.js → Fetch API (server.js exporta fetch handler)
writeFileSync(`${OUT}/functions/ssr.func/adapter.mjs`, `
import serverModule from './server.js';

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host     = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url      = new URL(req.url, \`\${protocol}://\${host}\`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v != null && k !== 'connection' && k !== 'keep-alive') {
      headers.append(k, Array.isArray(v) ? v.join(', ') : String(v));
    }
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body: body ?? undefined,
  });

  const response = await serverModule.fetch(request, {}, { waitUntil: () => {} });

  res.statusCode = response.status;
  for (const [k, v] of response.headers.entries()) res.setHeader(k, v);
  res.end(Buffer.from(await response.arrayBuffer()));
}
`);

// 5. Configuração da função Vercel (Node.js runtime)
writeFileSync(`${OUT}/functions/ssr.func/.vc-config.json`, JSON.stringify({
  runtime: 'nodejs20.x',
  handler: 'adapter.mjs',
  launcherType: 'Nodejs',
  maxDuration: 30,
}, null, 2));

// 6. Roteamento: assets estáticos do CDN, tudo mais → SSR
writeFileSync(`${OUT}/config.json`, JSON.stringify({
  version: 3,
  routes: [
    {
      src: '^/assets/(.+)',
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
      continue: true,
    },
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/ssr' },
  ],
}, null, 2));

console.log('✓ .vercel/output criado com sucesso');
