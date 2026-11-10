import { icon } from '../components/icons.js';
import { wxIcon } from '../components/illus.js';
import { get, set } from '../store.js';
import { fetchCuaca, isNight, risk, next24, hujanAwam, todayYmd, zonaLabel, ringkasUntukAI } from '../weather.js';
import { fmtTanggal, namaHari, rainLayer, toast, esc } from '../ui.js';
import { openChat } from '../components/chatbot.js';

function fmtAnalisis(s) {
  if (!s) return '-';
  const [d, t = ''] = String(s).replace('T', ' ').split(' ');
  return `${fmtTanggal(d, true)} pukul ${t.slice(0, 5).replace(':', '.')}`;
}

const RISK_COLORS = ['#16a34a', '#facc15', '#f97316', '#e11d48'];

function gauge(level) {
  // setengah lingkaran 4 segmen (Aman, Waspada, Siaga, Awas) + jarum
  const cx = 130; const cy = 120; const r = 96;
  const seg = (i) => {
    const a0 = Math.PI + (i * Math.PI) / 4 + 0.03; const a1 = Math.PI + ((i + 1) * Math.PI) / 4 - 0.03;
    const p = (a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}" stroke="${RISK_COLORS[i]}" stroke-width="18" fill="none" stroke-linecap="round" opacity="${i <= level ? 1 : .25}"/>`;
  };
  const ang = -90 + (level + 0.5) * 45;
  return `<svg class="gauge" viewBox="0 0 260 140" role="img" aria-label="Indikator kewaspadaan level ${level} dari 3">
    ${[0, 1, 2, 3].map(seg).join('')}
    <g style="transform-origin:${cx}px ${cy}px;transform:rotate(-90deg);transition:transform 1.2s cubic-bezier(.2,.8,.2,1)" data-needle="${ang}">
      <path d="M${cx - 5} ${cy} L${cx} ${cy - 80} L${cx + 5} ${cy}Z" fill="#0f2a63"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="10" fill="#0f2a63"/><circle cx="${cx}" cy="${cy}" r="4" fill="#fff"/>
  </svg>`;
}

/** Dua grafik kecil (small multiples) dengan sumbu-x bersama: suhu (garis) & hujan (batang). */
function charts(slots, nowLocal, tz) {
  const W = 1000; const padL = 40; const padR = 14; const n = slots.length;
  const x = (i) => padL + ((W - padL - padR) * (i + 0.5)) / n;
  const temps = slots.map((s) => s.t ?? 0);
  const tMin = Math.floor(Math.min(...temps) - 1); const tMax = Math.ceil(Math.max(...temps) + 1);
  const yT = (v) => 20 + (1 - (v - tMin) / (tMax - tMin || 1)) * 70; // area 20..90
  const rains = slots.map((s) => s.tp ?? 0);
  const rMax = Math.max(2, Math.ceil(Math.max(...rains)));
  const baseR = 200; const hR = 64;
  const yR = (v) => baseR - (v / rMax) * hR;
  const linePath = slots.map((s, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${yT(s.t).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${x(n - 1).toFixed(1)} 90 L${x(0).toFixed(1)} 90Z`;
  const bw = Math.min(26, ((W - padL - padR) / n) * 0.55);
  const nowIdx = slots.findIndex((s) => s.local === nowLocal);
  let days = ''; let prev = '';
  slots.forEach((s, i) => { if (s.date !== prev) { if (i) days += `<line x1="${(x(i) - (x(1) - x(0)) / 2).toFixed(1)}" y1="14" x2="${(x(i) - (x(1) - x(0)) / 2).toFixed(1)}" y2="${baseR}" stroke="#dde7f5" stroke-dasharray="3 4"/>`; days += `<text x="${(x(i) - (x(1) - x(0)) / 2 + 4).toFixed(1)}" y="11" font-size="10.5" font-weight="700" fill="#8090a8">${fmtTanggal(s.date)}</text>`; prev = s.date; } });
  return `<svg viewBox="0 0 ${W} 236" role="img" aria-label="Grafik suhu dan curah hujan per 3 jam">
    <defs><linearGradient id="tgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6fea" stop-opacity=".18"/><stop offset="1" stop-color="#2f6fea" stop-opacity="0"/></linearGradient></defs>
    ${days}
    <text x="4" y="11" font-size="10.5" font-weight="700" fill="#5d6b85">°C</text>
    <text x="4" y="${yT(tMax - 1) + 4}" font-size="10" fill="#8090a8">${tMax - 1}</text>
    <text x="4" y="${yT(tMin + 1) + 4}" font-size="10" fill="#8090a8">${tMin + 1}</text>
    <line x1="${padL}" y1="90" x2="${W - padR}" y2="90" stroke="#e6edf7"/>
    <path d="${areaPath}" fill="url(#tgrad)"/>
    <path d="${linePath}" fill="none" stroke="#1a56db" stroke-width="2" stroke-linejoin="round" class="draw-line"/>
    ${slots.map((s, i) => `<circle cx="${x(i).toFixed(1)}" cy="${yT(s.t).toFixed(1)}" r="${i === nowIdx ? 5 : 3.5}" fill="${i === nowIdx ? '#1a56db' : '#fff'}" stroke="#1a56db" stroke-width="2"/>`).join('')}
    ${slots.map((s, i) => (i % 2 === 0 || i === nowIdx ? `<text x="${x(i).toFixed(1)}" y="${(yT(s.t) - 9).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#33415c">${s.t}°</text>` : '')).join('')}
    <text x="4" y="${baseR - hR + 4}" font-size="10.5" font-weight="700" fill="#5d6b85">mm</text>
    <text x="4" y="${baseR - hR + 18}" font-size="10" fill="#8090a8">${rMax}</text>
    <line x1="${padL}" y1="${baseR}" x2="${W - padR}" y2="${baseR}" stroke="#c7d6ee"/>
    ${slots.map((s, i) => { const v = s.tp ?? 0; const h = Math.max(v > 0 ? 3 : 0, baseR - yR(v)); return h ? `<path d="M${(x(i) - bw / 2).toFixed(1)} ${baseR} V${(baseR - h + 4).toFixed(1)} q0 -4 4 -4 H${(x(i) + bw / 2 - 4).toFixed(1)} q4 0 4 4 V${baseR}Z" fill="#5b8ff2"/>` : ''; }).join('')}
    ${slots.map((s, i) => `<text x="${x(i).toFixed(1)}" y="${baseR + 16}" text-anchor="middle" font-size="10.5" font-weight="${i === nowIdx ? 800 : 600}" fill="${i === nowIdx ? '#1a56db' : '#5d6b85'}">${s.time}</text>`).join('')}
    <line class="xhair" x1="0" y1="16" x2="0" y2="${baseR}" stroke="#0f2a63" stroke-opacity=".35" stroke-dasharray="3 3" style="display:none"/>
    ${slots.map((s, i) => `<rect class="hit" data-i="${i}" x="${(x(i) - (W - padL - padR) / n / 2).toFixed(1)}" y="0" width="${((W - padL - padR) / n).toFixed(1)}" height="236" fill="transparent"/>`).join('')}
  </svg>
  <div class="chart-tip" hidden></div>`;
}

function nowCardClass(c) {
  if (c.weather >= 95) return 'storm';
  if (c.weather >= 60) return 'rainy';
  if (isNight(c.time)) return 'night';
  return '';
}

function dashboard(data) {
  const tz = zonaLabel(data.lokasi.timezone);
  const today = todayYmd(data);
  const c = data.current;
  const d0 = data.daily.find((d) => d.date === today) || data.daily[0];
  const r = risk(d0, next24(data));
  const startIdx = Math.max(0, data.hourly.findIndex((h) => h.local === c.local));
  const next = data.hourly.slice(startIdx, startIdx + 8);
  const chartSlots = data.hourly.slice(startIdx, startIdx + 16);
  const windArrow = c.wdDeg != null ? `<svg viewBox="0 0 24 24" width="14" height="14" style="transform:rotate(${(c.wdDeg + 180) % 360}deg)" aria-hidden="true"><path d="M12 3 l5 14 -5 -3 -5 3z" fill="currentColor"/></svg>` : '';
  const days = data.daily.filter((d) => d.date >= today);
  const hj = hujanAwam(c.tp, c.weather);
  return `
    <div class="wx-grid">
      <div class="wx-now ${nowCardClass(c)}">
        ${c.weather >= 60 ? rainLayer(55) : ''}
        <div style="position:relative;z-index:2">
          <div class="loc">${icon('mapPin')} ${esc(data.lokasi.desa)}, Kec. ${esc(data.lokasi.kecamatan)}</div>
          <div class="when">${esc(data.lokasi.kotkab)}, ${esc(data.lokasi.provinsi)}</div>
          <div class="big"><div class="temp">${c.t}<sup>°C</sup></div></div>
          <div class="cond">${esc(c.desc)}</div>
          <div class="when">Prakiraan ${fmtTanggal(c.date, true)} · pukul ${c.time} ${tz}</div>
        </div>
        <div class="wx-icon">${wxIcon(c.weather, isNight(c.time), 130)}</div>
        <div class="wx-metrics">
          <div class="wx-metric"><span>${icon('droplet')} Kelembapan</span><b>${c.hu ?? '-'}%</b></div>
          <div class="wx-metric"><span>${icon('wind')} Angin</span><b>${c.ws ?? '-'} <small style="font-size:11px">km/j</small></b><span style="margin-top:2px">${windArrow} dari ${esc(c.wd)}</span></div>
          <div class="wx-metric"><span>${icon('cloudRain')} Hujan</span><b style="font-size:clamp(17px,1.6vw,21px);line-height:1.25">${hj.teks}</b><span style="margin-top:2px">${hj.sub}</span></div>
          <div class="wx-metric"><span>${icon('cloud')} Tutupan awan</span><b>${c.tcc ?? '-'}%</b></div>
        </div>
      </div>
      <div class="card risk-card">
        <h3>Indikator Kewaspadaan Banjir <span class="badge-chip ${r.chip}">${r.label}</span></h3>
        ${gauge(r.level)}
        <div class="gauge-label"><b style="color:${r.color}">${r.label}</b><span>24 jam ke depan · ${r.ket}</span></div>
        <div class="risk-tips">${r.tip}</div>
        <button class="btn btn-ghost btn-sm" id="askWx" style="margin-top:10px;align-self:flex-start">${icon('message')} Tanya Kak Euy soal cuaca ini</button>
        <p class="risk-note">Indikator edukatif dari jumlah hujan prakiraan BMKG untuk 24 jam ke depan, mengikuti kategori hujan harian BMKG. Ini bukan peringatan dini resmi, jadi tetap ikuti informasi BMKG dan BPBD setempat.</p>
      </div>
    </div>

    <div class="card wx-hourly">
      <h3><span>Prakiraan per 3 jam ke depan</span><span class="muted" style="font-size:12.5px;font-weight:600">Arahkan kursor ke grafik untuk detail</span></h3>
      <div class="hour-strip">
        ${next.map((h, i) => `<div class="hour ${i === 0 ? 'now' : ''}"><small>${i === 0 ? 'Sekarang' : h.time}</small>${wxIcon(h.weather, isNight(h.time), 42)}<b>${h.t}°</b><span class="rainmm">${String(h.tp ?? 0).replace('.', ',')} mm</span></div>`).join('')}
      </div>
      <div class="chart-wrap" style="position:relative">${charts(chartSlots, c.local, tz)}</div>
      <p class="muted" style="font-size:12px;margin-top:6px">Grafik atas menunjukkan suhu udara (°C), grafik bawah menunjukkan jumlah hujan yang diprakirakan tiap 3 jam (mm). Data terbuka BMKG memang tersedia per 3 jam. Waktu dalam ${tz}.</p>
    </div>

    <div class="card wx-days">
      <h3><span>Prakiraan harian</span><span class="muted" style="font-size:12.5px;font-weight:600">${days.length} hari data BMKG</span></h3>
      <div class="day-grid">
        ${days.map((d) => { const rr = risk(d, data.hourly.filter((h) => h.date === d.date)); return `<div class="day">
          <div class="d-top"><div><h4>${namaHari(d.date, today)}</h4><div class="d-date">${fmtTanggal(d.date, true)}</div></div>${wxIcon(d.dominant.weather, false, 56)}</div>
          <div class="d-desc">${esc(d.dominant.desc)}</div>
          <div class="d-temp"><b>${d.tMax}°</b><span>/ ${d.tMin}°C</span></div>
          <div class="d-meta">
            <div><span>Kelembapan</span><b>${d.huMin === d.huMax ? d.huMin : `${d.huMin}–${d.huMax}`}%</b></div>
            <div><span>Total hujan</span><b>${d.rainTotal} mm</b></div>
            <div><span>Kategori</span><span class="badge-chip ${rr.chip}" style="padding:2px 8px">${d.kategori.label}</span></div>
            <div><span>Jam hujan</span><b>${d.rainHours.length ? d.rainHours.slice(0, 4).join(', ') : '-'}</b></div>
          </div></div>`; }).join('')}
      </div>
    </div>

    <div class="card wx-learn">
      <div><b>Kategori hujan harian (BMKG)</b>
        <div class="scale-bar"><i style="background:#bfdbfe"></i><i style="background:#60a5fa"></i><i style="background:#2563eb"></i><i style="background:#1e3a8a"></i><i style="background:#581c87"></i></div>
        Ringan 5–20 · Sedang 20–50 · Lebat 50–100 · Sangat lebat 100–150 · Ekstrem &gt;150 mm</div>
      <div><b>Tutupan awan (tcc)</b>Persentase langit yang tertutup awan. Mendekati 100% berarti langit hampir seluruhnya berawan.</div>
      <div><b>Angin</b>Arah menunjukkan dari mana angin bertiup. Kecepatan dalam km/jam.</div>
      <div><b>Prakiraan per 3 jam</b>BMKG memperbarui prakiraan secara berkala; selalu cek versi terbaru sebelum beraktivitas.</div>
    </div>

    <div class="wx-source">
      <span>Sumber data <b>BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</b> melalui <a href="https://data.bmkg.go.id/prakiraan-cuaca/" target="_blank" rel="noopener">data.bmkg.go.id ${icon('external').replace('<svg', '<svg width="12" height="12" style="display:inline;vertical-align:-1px"')}</a></span>
      <span>Dianalisis BMKG pada ${esc(fmtAnalisis(data.analysisDate))} · Kode wilayah ${esc(data.lokasi.adm4 || '')}${data.stale ? ' · <b>data cache</b>' : ''}</span>
    </div>`;
}

export function render() {
  const html = `
  <div class="container section">
    <div class="qa-head">
      <div>
        <span class="eyebrow">${icon('cloudRain')} Data live BMKG</span>
        <h1 class="page-title" style="margin-top:10px">Pantau Cuaca</h1>
        <p class="page-sub">Cuaca hari ini dan prakiraan beberapa hari ke depan untuk kelurahan/desa mana pun di Indonesia.</p>
      </div>
      <div class="wx-toolbar">
        <div class="wx-search" id="wxSearch">
          ${icon('search')}
          <input id="wxQ" type="search" placeholder="Cari kelurahan atau desa" autocomplete="off" aria-label="Cari kelurahan atau desa">
          <div class="wx-sugg" id="wxSugg" hidden></div>
        </div>
        <button class="btn btn-ghost" type="button" id="btnPilih">${icon('layers')} Pilih wilayah</button>
        <button class="icon-btn" type="button" id="wxRefresh" title="Muat ulang" aria-label="Muat ulang data">${icon('refresh')}</button>
      </div>
    </div>
    <div class="card wx-picker" id="wxPicker" hidden>
      <div class="field"><label for="selProv">Provinsi</label><select id="selProv"><option value="">Memuat…</option></select></div>
      <div class="field"><label for="selKab">Kabupaten/Kota</label><select id="selKab" disabled><option value="">Pilih provinsi dulu</option></select></div>
      <div class="field"><label for="selKec">Kecamatan</label><select id="selKec" disabled><option value="">Pilih kab/kota dulu</option></select></div>
      <div class="field"><label for="selKel">Kelurahan/Desa</label><select id="selKel" disabled><option value="">Pilih kecamatan dulu</option></select></div>
      <button class="btn btn-primary" id="btnTampil" disabled>Tampilkan ${icon('arrow', 'arrow')}</button>
    </div>
    <div id="wxBody">${loading()}</div>
  </div>`;

  return {
    html,
    mount(el) {
      const body = el.querySelector('#wxBody');
      let current = null;

      const show = async (adm4, force = false) => {
        body.innerHTML = loading();
        try {
          const data = await fetchCuaca(adm4, { force });
          current = data;
          const nama = `${data.lokasi.desa}, ${data.lokasi.kotkab}`;
          set({ lokasi: adm4, lokasiNama: nama, cuacaDilihat: true });
          window.__banjireuyCuaca = ringkasUntukAI(data);
          body.innerHTML = dashboard(data);
          requestAnimationFrame(() => body.querySelectorAll('[data-needle]').forEach((n) => { n.style.transform = `rotate(${n.dataset.needle}deg)`; }));
          bindChart(body, data);
          body.querySelector('#askWx')?.addEventListener('click', () => openChat('Berdasarkan data cuaca BMKG di lokasiku, apakah aman pulang sekolah sore ini dan apa yang perlu kusiapkan?'));
          if (force) toast('Data cuaca diperbarui.');
        } catch (e) {
          body.innerHTML = `<div class="card wx-error" style="margin-top:20px">${wxIcon(4, false, 64)}<h3>Data BMKG belum bisa dimuat</h3>
            <p class="muted" style="max-width:520px;margin:6px auto 16px">${esc(e.message)}. Pastikan kamu menjalankan website lewat server (<code>npm start</code>) dan perangkat terhubung internet.</p>
            <button class="btn btn-primary" id="retry">${icon('refresh')} Coba lagi</button></div>`;
          body.querySelector('#retry').addEventListener('click', () => show(adm4, true));
        }
      };

      const useManual = (adm4) => { set({ lokasiDipilih: true }); picker.hidden = true; show(adm4); window.scrollTo({ top: 0, behavior: 'smooth' }); };

      /* belum pernah memilih lokasi -> langsung minta pilih */
      const pilihDulu = () => {
        bukaPicker();
        body.innerHTML = `<div class="card wx-choose">${icon('mapPin')}<h3>Pilih lokasimu dulu, yuk</h3>
          <p class="muted">Ketik nama kelurahan atau desamu di kolom pencarian, atau pilih bertahap dari provinsi sampai kelurahan.</p></div>`;
        setTimeout(() => el.querySelector('#wxQ')?.focus({ preventScroll: true }), 50);
      };

      el.querySelector('#wxRefresh').addEventListener('click', () => { if (get().lokasiDipilih) show(current?.lokasi?.adm4 || get().lokasi, true); else pilihDulu(); });

      /* ---------- pencarian kelurahan/desa ---------- */
      const q = el.querySelector('#wxQ'); const sugg = el.querySelector('#wxSugg');
      let timer; let lastQ = '';
      const closeSugg = () => { sugg.hidden = true; };
      q.addEventListener('input', () => {
        clearTimeout(timer);
        const v = q.value.trim();
        if (v.length < 3) { closeSugg(); return; }
        timer = setTimeout(async () => {
          lastQ = v;
          sugg.hidden = false; sugg.innerHTML = '<div class="sugg-empty">Mencari…</div>';
          try {
            const r = await fetch(`/api/wilayah?cari=${encodeURIComponent(v)}`);
            const d = await r.json();
            if (v !== lastQ) return;
            if (!r.ok) throw new Error(d.error);
            sugg.innerHTML = d.hasil.length
              ? d.hasil.map((h) => `<button type="button" data-kode="${h.kode}"><b>${esc(h.nama)}</b><span>Kec. ${esc(h.kecamatan)}, ${esc(h.kabupaten)}, ${esc(h.provinsi)}</span></button>`).join('')
              : '<div class="sugg-empty">Tidak ditemukan. Coba ejaan lain atau gunakan "Pilih wilayah".</div>';
          } catch (e) { sugg.innerHTML = `<div class="sugg-empty">Data wilayah belum bisa dimuat (${esc(e.message || 'periksa internet')}).</div>`; }
        }, 300);
      });
      sugg.addEventListener('click', (e) => {
        const b = e.target.closest('[data-kode]'); if (!b) return;
        q.value = b.querySelector('b').textContent; closeSugg(); useManual(b.dataset.kode);
      });
      q.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSugg();
        if (e.key === 'Enter') { e.preventDefault(); sugg.querySelector('[data-kode]')?.click(); }
      });
      document.addEventListener('click', (e) => { if (!e.target.closest('#wxSearch')) closeSugg(); });

      /* ---------- pilihan bertingkat ---------- */
      const picker = el.querySelector('#wxPicker');
      const sel = { prov: el.querySelector('#selProv'), kab: el.querySelector('#selKab'), kec: el.querySelector('#selKec'), kel: el.querySelector('#selKel') };
      const btnTampil = el.querySelector('#btnTampil');
      const fill = async (selEl, url, placeholder) => {
        selEl.disabled = true; selEl.innerHTML = '<option value="">Memuat…</option>';
        try {
          const r = await fetch(url); const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          selEl.innerHTML = `<option value="">${placeholder}</option>${d.data.map((x) => `<option value="${x.kode}">${esc(x.nama)}</option>`).join('')}`;
          selEl.disabled = false;
        } catch (e) { selEl.innerHTML = `<option value="">Gagal memuat (${esc(e.message || 'internet')})</option>`; }
      };
      const reset = (...list) => list.forEach(([s, t]) => { s.disabled = true; s.innerHTML = `<option value="">${t}</option>`; });
      let provLoaded = false;
      function bukaPicker(toggle = false) {
        picker.hidden = toggle ? !picker.hidden : false;
        if (!picker.hidden && !provLoaded) { provLoaded = true; fill(sel.prov, '/api/wilayah?tingkat=provinsi', 'Pilih provinsi'); }
      }
      el.querySelector('#btnPilih').addEventListener('click', () => bukaPicker(true));
      sel.prov.addEventListener('change', () => {
        reset([sel.kab, 'Pilih provinsi dulu'], [sel.kec, 'Pilih kab/kota dulu'], [sel.kel, 'Pilih kecamatan dulu']); btnTampil.disabled = true;
        if (sel.prov.value) fill(sel.kab, `/api/wilayah?tingkat=kabupaten&induk=${sel.prov.value}`, 'Pilih kabupaten/kota');
      });
      sel.kab.addEventListener('change', () => {
        reset([sel.kec, 'Pilih kab/kota dulu'], [sel.kel, 'Pilih kecamatan dulu']); btnTampil.disabled = true;
        if (sel.kab.value) fill(sel.kec, `/api/wilayah?tingkat=kecamatan&induk=${sel.kab.value}`, 'Pilih kecamatan');
      });
      sel.kec.addEventListener('change', () => {
        reset([sel.kel, 'Pilih kecamatan dulu']); btnTampil.disabled = true;
        if (sel.kec.value) fill(sel.kel, `/api/wilayah?tingkat=kelurahan&induk=${sel.kec.value}`, 'Pilih kelurahan/desa');
      });
      sel.kel.addEventListener('change', () => { btnTampil.disabled = !sel.kel.value; });
      btnTampil.addEventListener('click', () => { if (sel.kel.value) { picker.hidden = true; useManual(sel.kel.value); } });

      if (get().lokasiDipilih) show(get().lokasi); else pilihDulu();
    },
  };
}

function loading() {
  return `<div class="wx-grid"><div class="skeleton" style="height:300px;border-radius:22px"></div><div class="skeleton" style="height:300px;border-radius:16px"></div></div>
    <div class="skeleton" style="height:260px;border-radius:16px;margin-top:16px"></div>`;
}

function bindChart(root, data) {
  const wrap = root.querySelector('.chart-wrap'); if (!wrap) return;
  const svg = wrap.querySelector('svg'); const tip = wrap.querySelector('.chart-tip'); const xh = svg.querySelector('.xhair');
  const startIdx = Math.max(0, data.hourly.findIndex((h) => h.local === data.current.local));
  const slots = data.hourly.slice(startIdx, startIdx + 16);
  const show = (rect) => {
    const i = Number(rect.dataset.i); const h = slots[i];
    const cx = Number(rect.getAttribute('x')) + Number(rect.getAttribute('width')) / 2;
    xh.setAttribute('x1', cx); xh.setAttribute('x2', cx); xh.style.display = '';
    tip.innerHTML = `<b>${fmtTanggal(h.date)} · ${h.time}</b><div>${esc(h.desc)}</div><div>Suhu <b>${h.t}°C</b> · RH <b>${h.hu}%</b></div><div>Hujan <b>${h.tp ?? 0} mm</b> · Angin ${h.ws} km/j</div>`;
    tip.hidden = false;
    const sb = svg.getBoundingClientRect(); const wb = wrap.getBoundingClientRect();
    const px = (cx / 1000) * sb.width + (sb.left - wb.left) + wrap.scrollLeft;
    tip.style.left = `${Math.min(Math.max(px - 80, 4), wrap.scrollWidth - 170)}px`;
  };
  svg.querySelectorAll('.hit').forEach((r) => {
    r.addEventListener('mouseenter', () => show(r));
    r.addEventListener('click', () => show(r));
  });
  svg.addEventListener('mouseleave', () => { tip.hidden = true; xh.style.display = 'none'; });
}
