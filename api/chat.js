/**
 * POST /api/chat
 * body: { messages: [{ role: 'user'|'assistant', content: string }], context?: { cuaca?: string, nama?: string } }
 *
 * Penyedia AI (dipilih otomatis dari environment variable):
 *   1. Google Gemini   -> GEMINI_API_KEY (+ GEMINI_MODEL opsional)
 *   2. OpenAI-compatible (Groq, OpenRouter, OpenAI, dll) -> OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL
 *   3. Tanpa kunci API -> mode offline (jawaban dari basis pengetahuan lokal, ditandai jelas)
 * Kunci API hanya dibaca di server, tidak pernah dikirim ke browser.
 */
const { sendJson, readJsonBody, clientIp, rateLimiter } = require('./_util');
const { jawabOffline } = require('./_offline');

const limit = rateLimiter(12, 60 * 1000); // 12 pesan/menit/IP agar kuota API aman
const MAX_MSG = 12;
const MAX_CHARS = 1200;

const SYSTEM_PROMPT = `Kamu adalah "Kak Euy", asisten AI di website edukasi BanjirEuy untuk siswa SMA/SMK/sederajat di Indonesia.
Tugasmu: membantu siswa memahami banjir, kesiapsiagaan bencana, cara membaca informasi cuaca BMKG, dan langkah aman sebelum, saat, dan setelah banjir di mana pun mereka berada, baik di rumah, di jalan, maupun di sekolah.

Gaya bahasa:
- Bahasa Indonesia yang santai, ramah, dan jelas seperti kakak kelas yang peduli. Boleh sesekali menyelipkan kata "euy".
- Jawaban ringkas (umumnya 2–6 kalimat atau poin singkat). Gunakan daftar bernomor untuk langkah-langkah.
- Jangan gunakan tabel atau heading markdown. Boleh **tebal** untuk kata kunci.
- Jangan pernah memakai tanda titik dua (:) maupun tanda pisah panjang (—). Tulis kalimat pengantar tanpa titik dua, misalnya "Berikut langkah yang bisa kamu lakukan." lalu daftar bernomor.

Aturan keselamatan:
- Jika pengguna menggambarkan keadaan darurat yang sedang terjadi (air naik cepat, terjebak, ada korban), SEGERA minta mereka mengikuti arahan guru/petugas, menuju tempat tinggi yang aman, dan menghubungi 112 (darurat), 115 (Basarnas), atau 117 (BNPB). Utamakan keselamatan di atas penjelasan.
- Jangan pernah menyarankan bermain, berenang, atau berkendara menembus genangan/arus banjir.
- Jangan mengarang data cuaca. Gunakan hanya data cuaca dari bagian KONTEKS bila tersedia, dan sebutkan sumbernya BMKG. Ingatkan bahwa peringatan resmi tetap mengacu ke BMKG dan BPBD setempat.
- Jika pertanyaan di luar topik banjir, cuaca, lingkungan, atau kebencanaan, jawab singkat dengan sopan lalu arahkan kembali ke topik kesiapsiagaan.
- Jangan meminta atau menyimpan data pribadi.`;

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MSG)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

function buildSystem(context) {
  let s = SYSTEM_PROMPT;
  if (context && typeof context === 'object') {
    const parts = [];
    if (typeof context.nama === 'string' && context.nama.trim()) parts.push(`Nama panggilan pengguna: ${context.nama.trim().slice(0, 40)}`);
    if (typeof context.cuaca === 'string' && context.cuaca.trim()) parts.push(`Data cuaca terkini dari BMKG yang sedang dilihat pengguna:\n${context.cuaca.trim().slice(0, 1500)}`);
    if (parts.length) s += `\n\nKONTEKS:\n${parts.join('\n')}`;
  }
  return s;
}

async function callGemini(messages, system) {
  const key = process.env.GEMINI_API_KEY;
  const preferred = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const candidates = [...new Set([preferred, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'])];
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 1024 },
  };
  let lastErr;
  for (const model of candidates) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok) {
      const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
      if (text) return { text, model };
      lastErr = new Error('Respons AI kosong (mungkin terblokir filter keamanan).');
      continue;
    }
    lastErr = new Error(data.error?.message || `Gemini error ${r.status}`);
    lastErr.status = r.status;
    if (![404, 429, 500, 503].includes(r.status)) break; // coba model lain hanya untuk error tertentu
  }
  throw lastErr;
}

async function callOpenAICompatible(messages, system) {
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const r = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model, max_tokens: 800, messages: [{ role: 'system', content: system }, ...messages] }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error?.message || `AI error ${r.status}`); e.status = r.status; throw e; }
  return { text: (data.choices?.[0]?.message?.content || '').trim(), model };
}

/**
 * Streaming Gemini (SSE): mengirim potongan teks ke klien begitu dihasilkan,
 * sehingga jawaban mulai tampil dalam ~1 detik walau jawaban lengkap butuh lebih lama.
 * onChunk dipanggil untuk tiap potongan teks. Melempar error bila gagal sebelum ada teks.
 */
async function streamGemini(messages, system, onChunk) {
  const key = process.env.GEMINI_API_KEY;
  const preferred = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const candidates = [...new Set([preferred, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'])];
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: 1024 },
  };
  let lastErr;
  for (const model of candidates) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
    });
    if (!r.ok || !r.body) {
      const data = await r.json().catch(() => ({}));
      lastErr = new Error(data.error?.message || `Gemini error ${r.status}`); lastErr.status = r.status;
      if ([404, 429, 500, 503].includes(r.status)) continue; // coba model berikutnya
      throw lastErr;
    }
    const reader = r.body.getReader(); const dec = new TextDecoder();
    let buf = ''; let any = false;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, idx).trim(); buf = buf.slice(idx + 1);
        if (!line.startsWith('data:')) continue;
        try {
          const j = JSON.parse(line.slice(5));
          const t = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
          if (t) { any = true; onChunk(t); }
        } catch { /* potongan tidak lengkap */ }
      }
    }
    if (any) return { model };
    lastErr = new Error('Respons AI kosong (mungkin terblokir filter keamanan).');
  }
  throw lastErr;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Gunakan metode POST' });
  if (!limit(clientIp(req))) return sendJson(res, 429, { error: 'Pelan-pelan ya, euy! Tunggu sebentar sebelum bertanya lagi.' });

  let body;
  try { body = await readJsonBody(req); } catch { return sendJson(res, 413, { error: 'Pesan terlalu panjang.' }); }
  const messages = sanitizeMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return sendJson(res, 400, { error: 'Pesan tidak valid.' });
  }
  const system = buildSystem(body.context);
  const lastUser = messages[messages.length - 1].content;

  // Mode streaming (dipakai widget chat): balasan berupa NDJSON baris per baris
  if (body.stream) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    const line = (o) => res.write(`${JSON.stringify(o)}\n`);
    let sent = false;
    try {
      if (process.env.GEMINI_API_KEY) {
        const out = await streamGemini(messages, system, (t) => { sent = true; line({ t }); });
        line({ done: true, provider: 'gemini', model: out.model });
      } else if (process.env.OPENAI_API_KEY) {
        const out = await callOpenAICompatible(messages, system);
        line({ t: out.text }); line({ done: true, provider: 'openai-compatible', model: out.model });
      } else {
        line({ t: jawabOffline(lastUser) }); line({ done: true, provider: 'offline' });
      }
    } catch (e) {
      console.error('[chat]', e.message);
      if (!sent) line({ t: jawabOffline(lastUser) });
      line({ done: true, provider: sent ? 'gemini' : 'offline', warning: e.status === 429 ? 'Kuota AI sedang habis, jawaban diambil dari basis pengetahuan lokal.' : (sent ? 'Jawaban terpotong karena gangguan koneksi.' : 'Layanan AI sedang tidak tersedia, jawaban diambil dari basis pengetahuan lokal.') });
    }
    return res.end();
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const out = await callGemini(messages, system);
      return sendJson(res, 200, { reply: out.text, provider: 'gemini', model: out.model });
    }
    if (process.env.OPENAI_API_KEY) {
      const out = await callOpenAICompatible(messages, system);
      return sendJson(res, 200, { reply: out.text, provider: 'openai-compatible', model: out.model });
    }
    return sendJson(res, 200, { reply: jawabOffline(lastUser), provider: 'offline' });
  } catch (e) {
    console.error('[chat]', e.message);
    // Tetap beri jawaban berguna saat layanan AI gagal / kuota habis
    return sendJson(res, 200, {
      reply: jawabOffline(lastUser),
      provider: 'offline',
      warning: e.status === 429 ? 'Kuota AI sedang habis, jawaban diambil dari basis pengetahuan lokal.' : 'Layanan AI sedang tidak tersedia, jawaban diambil dari basis pengetahuan lokal.',
    });
  }
};
