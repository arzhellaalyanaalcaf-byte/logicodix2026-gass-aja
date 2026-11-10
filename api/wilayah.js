/**
 * GET /api/wilayah — data wilayah seluruh Indonesia untuk memilih lokasi cuaca.
 *   ?tingkat=provinsi
 *   ?tingkat=kabupaten&induk=32
 *   ?tingkat=kecamatan&induk=32.73
 *   ?tingkat=kelurahan&induk=32.73.12
 *   ?cari=gumuruh            -> maks. 15 kelurahan/desa yang cocok (boleh "gumuruh bandung")
 * Kode bertitik (format Kemendagri) = kode adm4 yang dipakai API BMKG.
 */
const { sendJson, getQuery, clientIp, rateLimiter } = require('./_util');
const { loadDataset, rapikan } = require('./_wilayah');

const limit = rateLimiter(90, 60 * 1000);
const KODE = /^\d{2}(\.\d{2}(\.\d{2})?)?$/;
const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const urut = (a, b) => a.nama.localeCompare(b.nama, 'id');

module.exports = async function handler(req, res) {
  if (!limit(clientIp(req))) return sendJson(res, 429, { error: 'Terlalu banyak permintaan, coba lagi sebentar.' });
  const { tingkat, induk = '', cari } = getQuery(req);
  let ds;
  try { ds = await loadDataset(); } catch (e) { return sendJson(res, 502, { error: e.message }); }
  const cache = { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' };

  if (typeof cari === 'string') {
    const tokens = norm(cari).split(' ').filter((t) => t.length >= 2).slice(0, 4);
    if (!tokens.length) return sendJson(res, 200, { hasil: [] });
    const [first, ...rest] = tokens;
    const hasil = [];
    for (const v of ds.villages) {
      const vn = norm(v.name);
      let skor = vn === first ? 3 : vn.startsWith(first) ? 2 : vn.includes(first) ? 1 : 0;
      if (!skor) continue;
      const p = v.code.split('.');
      const dis = ds.disById.get(`${p[0]}.${p[1]}.${p[2]}`); const reg = ds.regById.get(`${p[0]}.${p[1]}`); const prov = ds.provById.get(p[0]);
      if (rest.length) {
        const konteks = norm(`${v.name} ${dis?.name} ${reg?.name} ${prov?.name}`);
        if (!rest.every((t) => konteks.includes(t))) continue;
        skor += 1;
      }
      hasil.push({ kode: v.code, nama: rapikan(v.name), kecamatan: rapikan(dis?.name), kabupaten: rapikan(reg?.name), provinsi: rapikan(prov?.name), skor });
    }
    hasil.sort((a, b) => b.skor - a.skor || a.nama.length - b.nama.length || urut(a, b));
    return sendJson(res, 200, { hasil: hasil.slice(0, 15).map(({ skor, ...r }) => r) }, cache);
  }

  if (tingkat === 'provinsi') {
    return sendJson(res, 200, { data: ds.provinces.map((p) => ({ kode: p.code, nama: rapikan(p.name) })).sort(urut) }, cache);
  }
  if (!KODE.test(induk)) return sendJson(res, 400, { error: 'Parameter induk tidak valid.' });
  const map = {
    kabupaten: [ds.regencies, 1],
    kecamatan: [ds.districts, 2],
    kelurahan: [ds.villages, 3],
  }[tingkat];
  if (!map) return sendJson(res, 400, { error: 'Parameter tingkat tidak dikenal.' });
  const [rows, depth] = map;
  if (induk.split('.').length !== depth) return sendJson(res, 400, { error: 'Kode induk tidak sesuai tingkat.' });
  const data = rows.filter((r) => r.code.startsWith(`${induk}.`) && r.code.split('.').length === depth + 1)
    .map((r) => ({ kode: r.code, nama: rapikan(r.name) })).sort(urut);
  return sendJson(res, 200, { data }, cache);
};
