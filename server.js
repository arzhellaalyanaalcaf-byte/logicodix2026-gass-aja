/**
 * BanjirEuy — server lokal tanpa dependensi (cukup Node.js 18+).
 * - Menyajikan file statis dari folder /public
 * - Meneruskan /api/cuaca  -> api/cuaca.js (proxy BMKG)
 * - Meneruskan /api/chat   -> api/chat.js  (proxy AI)
 * Handler di folder /api juga dipakai apa adanya oleh Vercel saat deploy.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// --- muat .env sederhana (tanpa paket dotenv) ---
(function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
})();

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const routes = {
  '/api/cuaca': require('./api/cuaca'),
  '/api/chat': require('./api/chat'),
  '/api/status': require('./api/status'),
  '/api/wilayah': require('./api/wilayah'),
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};

function serveStatic(req, res, pathname) {
  let filePath = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(pathname)));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  if (pathname === '/' || !path.extname(filePath)) filePath = path.join(PUBLIC_DIR, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const handler = routes[url.pathname];
  if (handler) {
    req.query = Object.fromEntries(url.searchParams);
    try { await handler(req, res); }
    catch (e) {
      console.error(e);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Terjadi kesalahan pada server.' }));
    }
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  const ai = process.env.GEMINI_API_KEY ? 'Gemini' : process.env.OPENAI_API_KEY ? 'OpenAI-compatible' : 'belum diatur (mode offline)';
  console.log(`\n  🌧️  BanjirEuy berjalan di http://localhost:${PORT}`);
  console.log(`  🤖  Penyedia AI: ${ai}`);
  console.log(`  ☁️  Data cuaca: api.bmkg.go.id (via /api/cuaca)\n`);
});
