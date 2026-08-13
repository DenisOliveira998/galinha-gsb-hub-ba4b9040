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
// Copiamos em dois lugares: dentro de node_modules/ (para imports externos)
// e na raiz da função (para quando o Prisma está bundlado e resolve relativo ao bundle)
const fnModules = `${OUT}/functions/ssr.func/node_modules`;
mkdirSync(fnModules, { recursive: true });
cpSync('node_modules/.prisma',        `${fnModules}/.prisma`,                        { recursive: true });
cpSync('node_modules/@prisma/client', `${fnModules}/@prisma/client`,                 { recursive: true });
cpSync('node_modules/.prisma',        `${OUT}/functions/ssr.func/.prisma`,            { recursive: true });
console.log('✓ Prisma client incluído na função (node_modules + raiz)');

// 4. Adapter Node.js → Fetch API (ESM — .mjs, compatível com Node.js 20 Vercel)
writeFileSync(`${OUT}/functions/ssr.func/adapter.mjs`, `
import serverModule from './server.js';

export default async function handler(req, res) {
  // Captura console.error do server.ts para expor o erro real no HTML (debug temporário)
  const errorLogs = [];
  const _orig = console.error.bind(console);
  console.error = (...args) => {
    errorLogs.push(args.map(a =>
      a instanceof Error ? (a.stack || a.message) : String(a)
    ).join('\\n'));
    _orig(...args);
  };

  try {
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
    console.error = _orig;

    res.statusCode = response.status;
    for (const [k, v] of response.headers.entries()) res.setHeader(k, v);

    const bodyBuf = Buffer.from(await response.arrayBuffer());

    // Em caso de 500, anexa o erro real como comentário HTML para diagnóstico
    if (response.status >= 500 && errorLogs.length > 0) {
      const errText = errorLogs.join(' | ').replace(/-->/g, '-->');
      const debug = Buffer.from('\\n<!-- SSR_ERROR: ' + errText + ' -->', 'utf-8');
      res.end(Buffer.concat([bodyBuf, debug]));
    } else {
      res.end(bodyBuf);
    }
  } catch (e) {
    console.error = _orig;
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<pre style="padding:2rem;font-family:monospace">Adapter error:\\n' +
      (e.stack || e.message || String(e)) + '</pre>');
  }
}
`);

// 5. Grava .env na função para que o Prisma leia DATABASE_URL em runtime
//    (o build roda no CI da Vercel que tem acesso às env vars do projeto)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  writeFileSync(`${OUT}/functions/ssr.func/.env`, `DATABASE_URL="${dbUrl}"\n`);
  console.log('✓ .env gravado na função com DATABASE_URL');
} else {
  console.warn('⚠ DATABASE_URL não encontrada no ambiente de build — .env não gerado');
}

// 6. Configuração da função Vercel (Node.js runtime)
writeFileSync(`${OUT}/functions/ssr.func/.vc-config.json`, JSON.stringify({
  runtime: 'nodejs20.x',
  handler: 'adapter.mjs',
  launcherType: 'Nodejs',
  maxDuration: 30,
}, null, 2));

// 7. Roteamento: assets estáticos do CDN, tudo mais → SSR
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
