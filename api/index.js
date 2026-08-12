// Vercel serverless function — adapts the TanStack Start Fetch API handler
// to Node.js req/res so Prisma (Node runtime) works correctly.
import server from '../dist/server/server.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined && key !== 'connection' && key !== 'keep-alive') {
      headers.append(key, Array.isArray(value) ? value.join(', ') : String(value));
    }
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length) body = Buffer.concat(chunks);
  }

  const request = new Request(url, {
    method: req.method,
    headers,
    body: body ?? undefined,
  });

  const response = await server.fetch(request, {}, { waitUntil: () => {} });

  res.statusCode = response.status;
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  const responseBody = Buffer.from(await response.arrayBuffer());
  res.end(responseBody);
}
