/**
 * GET /api/cuaca?adm4=31.71.01.1001
 * Proxy ke API Prakiraan Cuaca publik BMKG:
 *   https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode}
 * - Validasi format kode wilayah tingkat IV (kelurahan/desa)
 * - Cache 10 menit di memori agar tidak membebani BMKG (batas 60 req/menit/IP)
 * - Data dirapikan menjadi: lokasi, kondisi terkini, per-jam, dan ringkasan harian
 * Sumber data wajib dicantumkan: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
 */
const { sendJson, getQuery, clientIp, rateLimiter } = require('./_util');

const BMKG_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map();
const limit = rateLimiter(30, 60 * 1000);

const toNum = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));

// "2026-11-09 13:00:00" -> komponen tanggal lokal tanpa konversi zona waktu
function splitLocal(s) {
  const [d, t = '00:00:00'] = String(s).split(' ');
  return { date: d, time: t.slice(0, 5).replace(':', '.') };
}

// Kategori intensitas hujan harian (BMKG): ringan 5–20, sedang 20–50, lebat 50–100,
// sangat lebat 100–150, ekstrem >150 mm/hari.
function kategoriHujan(mm) {
  if (mm == null) return { level: 0, label: 'Tidak ada data' };
  if (mm < 0.5) return { level: 0, label: 'Tidak hujan' };
  if (mm < 5) return { level: 0, label: 'Hujan sangat ringan' };
  if (mm < 20) return { level: 0, label: 'Hujan ringan' };
  if (mm < 50) return { level: 2, label: 'Hujan sedang' };
  if (mm < 100) return { level: 3, label: 'Hujan lebat' };
  if (mm < 150) return { level: 4, label: 'Hujan sangat lebat' };
  return { level: 4, label: 'Hujan ekstrem' };
}

function normalize(raw) {
  const lokRaw = raw?.lokasi || raw?.data?.[0]?.lokasi || {};
  const lokasi = {
    adm4: lokRaw.adm4, desa: lokRaw.desa, kecamatan: lokRaw.kecamatan,
    kotkab: lokRaw.kotkab, provinsi: lokRaw.provinsi,
    lat: toNum(lokRaw.lat), lon: toNum(lokRaw.lon), timezone: lokRaw.timezone,
  };
  const days = raw?.data?.[0]?.cuaca;
  if (!Array.isArray(days)) throw new Error('Format data BMKG tidak dikenali');

  const hourly = [];
  for (const day of days) {
    if (!Array.isArray(day)) continue;
    for (const e of day) {
      const { date, time } = splitLocal(e.local_datetime || e.datetime);
      hourly.push({
        local: e.local_datetime, utc: e.utc_datetime || e.datetime, date, time,
        t: toNum(e.t), hu: toNum(e.hu), tcc: toNum(e.tcc), tp: toNum(e.tp),
        weather: toNum(e.weather), desc: e.weather_desc || '-', descEn: e.weather_desc_en || '',
        ws: toNum(e.ws), wd: e.wd || '-', wdDeg: toNum(e.wd_deg), wdTo: e.wd_to || '',
        vs: toNum(e.vs), vsText: e.vs_text || '', image: e.image || null,
        analysis: e.analysis_date || null,
      });
    }
  }
  hourly.sort((a, b) => String(a.local).localeCompare(String(b.local)));

  // Ringkasan per tanggal
  const byDate = new Map();
  for (const h of hourly) {
    if (!byDate.has(h.date)) byDate.set(h.date, []);
    byDate.get(h.date).push(h);
  }
  const daily = [...byDate.entries()].map(([date, list]) => {
    const temps = list.map((x) => x.t).filter((x) => x != null);
    const hums = list.map((x) => x.hu).filter((x) => x != null);
    const rain = list.reduce((s, x) => s + (x.tp || 0), 0);
    const counts = {};
    for (const x of list) counts[x.desc] = (counts[x.desc] || 0) + 1;
    // Cuaca dominan: utamakan kejadian hujan bila ada (lebih relevan untuk kesiapsiagaan)
    const rainy = list.filter((x) => x.weather >= 60);
    const dominant = rainy.length >= 2 || (rainy.length && rain >= 5)
      ? rainy.sort((a, b) => b.weather - a.weather)[0]
      : list.slice().sort((a, b) => counts[b.desc] - counts[a.desc])[0];
    return {
      date,
      tMin: temps.length ? Math.min(...temps) : null,
      tMax: temps.length ? Math.max(...temps) : null,
      huMin: hums.length ? Math.min(...hums) : null,
      huMax: hums.length ? Math.max(...hums) : null,
      rainTotal: Math.round(rain * 10) / 10,
      rainHours: list.filter((x) => (x.tp || 0) >= 1 || x.weather >= 60).map((x) => x.time),
      kategori: kategoriHujan(rain),
      dominant: { desc: dominant?.desc, weather: dominant?.weather, image: dominant?.image },
      slots: list.length,
    };
  });

  // Kondisi "saat ini" = slot prakiraan terdekat dengan waktu sekarang (UTC)
  const now = Date.now();
  let current = hourly[0];
  let best = Infinity;
  for (const h of hourly) {
    const ts = Date.parse(String(h.utc).replace(' ', 'T') + (String(h.utc).endsWith('Z') ? '' : 'Z'));
    const diff = Math.abs(ts - now);
    if (!isNaN(ts) && diff < best) { best = diff; current = h; }
  }

  return {
    sumber: 'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)',
    sumberUrl: 'https://data.bmkg.go.id/prakiraan-cuaca/',
    analysisDate: hourly.find((h) => h.analysis)?.analysis || null,
    fetchedAt: new Date().toISOString(),
    lokasi, current, hourly, daily,
  };
}

module.exports = async function handler(req, res) {
  const { adm4 = '31.71.01.1001' } = getQuery(req);
  if (!/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4)) {
    return sendJson(res, 400, { error: 'Kode wilayah (adm4) tidak valid. Contoh: 31.71.01.1001' });
  }
  if (!limit(clientIp(req))) return sendJson(res, 429, { error: 'Terlalu banyak permintaan, coba lagi sebentar.' });

  const hit = cache.get(adm4);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return sendJson(res, 200, { ...hit.data, cached: true }, { 'Cache-Control': 's-maxage=600' });
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch(`${BMKG_URL}?adm4=${encodeURIComponent(adm4)}`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json', 'User-Agent': 'BanjirEuy/1.0 (edukasi kesiapsiagaan banjir)' },
    });
    clearTimeout(timer);
    if (!r.ok) {
      if (hit) return sendJson(res, 200, { ...hit.data, cached: true, stale: true });
      return sendJson(res, 502, { error: `BMKG merespons dengan status ${r.status}` });
    }
    const data = normalize(await r.json());
    cache.set(adm4, { at: Date.now(), data });
    return sendJson(res, 200, data, { 'Cache-Control': 's-maxage=600' });
  } catch (e) {
    if (hit) return sendJson(res, 200, { ...hit.data, cached: true, stale: true });
    return sendJson(res, 502, { error: 'Gagal mengambil data dari BMKG. Periksa koneksi internet.', detail: String(e.message || e) });
  }
};

module.exports.normalize = normalize;
module.exports.kategoriHujan = kategoriHujan;
