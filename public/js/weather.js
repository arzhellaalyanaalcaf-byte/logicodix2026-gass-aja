// Layanan data cuaca: memanggil /api/cuaca (proxy BMKG) + utilitas interpretasi.
import { get } from './store.js';

/* Lokasi cuaca selalu dipilih manual oleh pengguna (tanpa deteksi GPS). */
export async function resolveLokasi() {
  return get().lokasi;
}

/* true bila pengguna belum pernah memilih lokasi */
export function perluPilihLokasi() {
  return !get().lokasiDipilih;
}
const memo = new Map();

export async function fetchCuaca(adm4, { force = false } = {}) {
  const key = `cuaca:${adm4}`;
  if (!force) {
    const m = memo.get(key);
    if (m && Date.now() - m.at < 10 * 60 * 1000) return m.data;
    try {
      const ss = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (ss && Date.now() - ss.at < 10 * 60 * 1000) { memo.set(key, ss); return ss.data; }
    } catch { /* abaikan */ }
  }
  const r = await fetch(`/api/cuaca?adm4=${encodeURIComponent(adm4)}`);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Gagal memuat (${r.status})`);
  try { window.__banjireuyCuaca = ringkasUntukAI(data); } catch { /* */ }
  const rec = { at: Date.now(), data };
  memo.set(key, rec);
  try { sessionStorage.setItem(key, JSON.stringify(rec)); } catch { /* penuh */ }
  return data;
}

export const isNight = (hhmm) => { const h = Number(String(hhmm).slice(0, 2)); return h >= 18 || h < 6; };

export function todayYmd(data) {
  // gunakan tanggal lokal wilayah (zona waktu WIB/WITA/WIT dari BMKG) bila ada
  const tz = data?.lokasi?.timezone;
  const off = typeof tz === 'string' && /^[+-]\d{4}$/.test(tz) ? (Number(tz.slice(0, 3)) * 60 + Math.sign(Number(tz.slice(0, 3)) || 1) * Number(tz.slice(3))) : 420;
  const d = new Date(Date.now() + off * 60000);
  return d.toISOString().slice(0, 10);
}

export const zonaLabel = (tz) => ({ '+0700': 'WIB', '+0800': 'WITA', '+0900': 'WIT' }[tz] || 'WIB');

/**
 * Indikator kewaspadaan banjir (edukatif) dari total hujan hari ini + kode cuaca terburuk.
 * Level 0–4 mengikuti kategori intensitas hujan harian BMKG.
 */
/* Slot prakiraan 24 jam ke depan, dihitung dari slot "saat ini" */
export function next24(data) {
  const start = Math.max(0, data.hourly.findIndex((h) => h.local === data.current?.local));
  const t0 = Date.parse(String(data.hourly[start]?.local).replace(' ', 'T'));
  return data.hourly.slice(start).filter((h) => {
    const t = Date.parse(String(h.local).replace(' ', 'T'));
    return isNaN(t0) || isNaN(t) || t - t0 < 24 * 3600e3;
  });
}

/* Hujan dalam bahasa sehari-hari, dari jumlah hujan satu slot prakiraan (mm) */
export function hujanAwam(tp, code) {
  if (tp == null) return { teks: '-', sub: '' };
  const mm = String(Math.round(tp * 10) / 10).replace('.', ',');
  if (tp < 0.1 && !(code >= 60)) return { teks: 'Tidak hujan', sub: 'Tidak ada air hujan' };
  if (tp < 1) return { teks: 'Gerimis tipis', sub: `Sekitar ${mm} mm air hujan` };
  if (tp < 5) return { teks: 'Hujan ringan', sub: `Sekitar ${mm} mm air hujan` };
  if (tp < 10) return { teks: 'Hujan sedang', sub: `Sekitar ${mm} mm air hujan` };
  if (tp < 20) return { teks: 'Hujan lebat', sub: `Sekitar ${mm} mm air hujan` };
  return { teks: 'Hujan sangat lebat', sub: `Sekitar ${mm} mm air hujan` };
}

/*
  Indikator kewaspadaan banjir (edukatif, bukan peringatan resmi).
  Mengikuti kategori curah hujan harian BMKG:
  di bawah 20 mm hujan ringan, 20 sampai 50 sedang, 50 sampai 100 lebat, 100 ke atas sangat lebat.
  hours = slot prakiraan yang dinilai (24 jam ke depan untuk hari ini, atau satu hari penuh untuk hari lain).
*/
export function risk(day, hours = []) {
  const list = hours.length ? hours : [];
  const rain = list.length ? list.reduce((s, h) => s + (h.tp || 0), 0) : (day?.rainTotal ?? 0);
  const codes = list.map((h) => h.weather ?? 0);
  const petir = codes.some((c) => c >= 95);
  const lebat = codes.some((c) => c === 63 || c === 65);
  const adaHujan = rain >= 1 || codes.some((c) => c >= 60);
  let level = rain >= 100 ? 3 : rain >= 50 ? 2 : rain >= 20 ? 1 : 0;
  if (petir || lebat) level = Math.max(level, 1);
  const total = Math.round(rain * 10) / 10;
  const map = [
    { label: 'Aman', color: '#16a34a', chip: 'chip-green', tip: adaHujan
      ? 'Mungkin turun hujan ringan, tapi potensi banjir rendah. Bawa payung atau jas hujan dan tetap jaga saluran air tetap bersih.'
      : 'Cuaca relatif bersahabat dan potensi banjir rendah. Tetap biasakan cek info cuaca setiap hari.' },
    { label: 'Waspada', color: '#f59e0b', chip: 'chip-amber', tip: petir
      ? 'Ada potensi hujan disertai petir. Hindari berteduh di bawah pohon, bawa jas hujan, dan jauhi genangan saat bepergian.'
      : 'Ada potensi hujan cukup deras yang bisa memicu genangan. Siapkan tas siaga dan hindari genangan saat bepergian.' },
    { label: 'Siaga', color: '#f97316', chip: 'chip-amber', tip: 'Potensi hujan lebat. Pantau info BMKG dan BPBD, jauhi bantaran sungai dan dataran rendah, dan rencanakan perjalanan yang aman.' },
    { label: 'Awas', color: '#e11d48', chip: 'chip-red', tip: 'Potensi hujan sangat lebat. Utamakan keselamatan, ikuti peringatan dini resmi BMKG dan BPBD, dan siap evakuasi bila diminta.' },
  ];
  const ket = total < 0.5 ? 'Tidak ada hujan berarti' : `Total hujan sekitar ${String(total).replace('.', ',')} mm`;
  return { level, total, ket, ...map[level] };
}

export function ringkasUntukAI(data) {
  if (!data?.current) return '';
  const l = data.lokasi; const c = data.current;
  const lines = [`Lokasi: ${l.desa}, Kec. ${l.kecamatan}, ${l.kotkab}, ${l.provinsi}.`,
    `Kondisi prakiraan terdekat (${c.local}): ${c.desc}, suhu ${c.t}°C, kelembapan ${c.hu}%, angin ${c.ws} km/jam dari ${c.wd}, curah hujan ${c.tp ?? 0} mm.`];
  for (const d of data.daily.slice(0, 4)) {
    lines.push(`${d.date}: ${d.dominant.desc}, suhu ${d.tMin}–${d.tMax}°C, total hujan ±${d.rainTotal} mm (${d.kategori.label})${d.rainHours.length ? `, jam hujan: ${d.rainHours.join(', ')}` : ''}.`);
  }
  const r = risk(null, next24(data));
  lines.push(`Indikator kewaspadaan banjir BanjirEuy untuk 24 jam ke depan: ${r.label} (${r.ket}). Ini indikator edukatif, bukan peringatan resmi.`);
  lines.push(`Sumber: BMKG, dianalisis ${data.analysisDate || '-'}.`);
  return lines.join('\n');
}
