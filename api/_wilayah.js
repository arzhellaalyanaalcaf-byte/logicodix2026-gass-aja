// Data kode wilayah Kemendagri (provinsi s.d. kelurahan/desa) untuk seluruh Indonesia.
// Dipakai oleh /api/wilayah. File berawalan "_" bukan endpoint.
const UA = 'BanjirEuy/1.0 (website edukasi kesiapsiagaan banjir; Logicodix 2026)';

// Sumber dataset kode wilayah (dicoba berurutan bila salah satu gagal)
const DATA_SOURCES = [
  (f) => `https://cdn.jsdelivr.net/npm/idn-area-data@4/data/${f}.csv`,
  (f) => `https://cdn.jsdelivr.net/gh/fityannugroho/idn-area-data@main/data/${f}.csv`,
  (f) => `https://raw.githubusercontent.com/fityannugroho/idn-area-data/main/data/${f}.csv`,
];

/* ---------------- utilitas ---------------- */
function parseCsv(text) {
  const rows = []; let row = []; let cur = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = ''; if (row.length > 1 || row[0] !== '') rows.push(row); row = [];
    } else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift().map((h) => h.trim().toLowerCase());
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
}

async function fetchWithTimeout(url, opt = {}, ms = 15000) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opt, signal: ctrl.signal }); } finally { clearTimeout(t); }
}

/* ---------------- dataset kode wilayah ---------------- */
let datasetPromise = null;
async function loadFile(name) {
  let lastErr;
  for (const src of DATA_SOURCES) {
    try {
      const r = await fetchWithTimeout(src(name), { headers: { 'User-Agent': UA } }, 20000);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const rows = parseCsv(await r.text());
      if (!rows.length || !('code' in rows[0]) || !('name' in rows[0])) throw new Error('format CSV tidak dikenali');
      return rows;
    } catch (e) { lastErr = e; }
  }
  throw new Error(`Gagal memuat data wilayah (${name}): ${lastErr?.message}`);
}
function loadDataset() {
  datasetPromise ??= (async () => {
    const [prov, reg, dis, vil] = await Promise.all(['provinces', 'regencies', 'districts', 'villages'].map(loadFile));
    const provById = new Map(prov.map((p) => [p.code, p]));
    const regById = new Map(reg.map((r) => [r.code, r]));
    const disById = new Map(dis.map((d) => [d.code, d]));
    return { provinces: prov, regencies: reg, provById, regById, disById, villages: vil, districts: dis };
  })().catch((e) => { datasetPromise = null; throw e; });
  return datasetPromise;
}


// "KOTA ADM. JAKARTA PUSAT" -> "Kota Adm. Jakarta Pusat"
function rapikan(nama) {
  const t = String(nama || '').toLowerCase().replace(/(^|[\s(.\-/])([a-z])/g, (m, p, c) => p + c.toUpperCase());
  return t.replace(/\bDki\b/g, 'DKI').replace(/\bDi\b/g, 'DI');
}

module.exports = { UA, loadDataset, parseCsv, fetchWithTimeout, rapikan };
