import { icon } from '../components/icons.js';
import { topicArt, wxIcon, floodTypeArt } from '../components/illus.js';
import { MATERI, SUMBER, FOTO_BANJIR } from '../data/materi.js';
import { get, set } from '../store.js';
import { toast, esc } from '../ui.js';

/* ---------- foto jenis banjir (gambar ilustrasi jadi cadangan bila foto gagal dimuat) ---------- */
function fotoHtml(key) {
  const f = FOTO_BANJIR[key];
  if (!f) return `<figure class="acc-art"><div class="acc-ph no-photo">${floodTypeArt(key)}</div></figure>`;
  return `<figure class="acc-art">
    <div class="acc-ph"><img src="${f.src}" alt="${esc(f.ket)}" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('no-photo')">${floodTypeArt(key)}</div>
    <figcaption>${esc(f.ket)}<a href="${f.halaman}" target="_blank" rel="noopener">Foto ${esc(f.kredit)} · ${esc(f.lisensi)}</a></figcaption>
  </figure>`;
}

/* ---------- renderer tiap jenis blok ---------- */
const BLOK = {
  teks: (b) => `<p class="mb-text">${b.isi}</p>${b.tautan ? `<a class="mb-link" href="${b.tautan[0]}">${b.tautan[1]} ${icon('arrow', 'arrow')}</a>` : ''}`,

  alur: (b) => `<ol class="mb-flow" style="--n:${b.langkah.length}">
    ${b.langkah.map(([ic, h, p], i) => `<li style="--i:${i}"><span class="mb-flow-dot">${icon(ic)}<em>${i + 1}</em></span><b>${h}</b><span>${p}</span></li>`).join('')}
  </ol>`,

  tab: (b, uid) => `<div class="mb-acc" data-acc>
    <p class="mb-acc-hint">${icon('sparkle')} Klik salah satu untuk melihat penjelasannya</p>
    ${b.item.map(([ic, h, p, art], i) => `<div class="acc-item">
      <button class="acc-head" aria-expanded="false" aria-controls="${uid}-${i}">
        <span class="acc-ic">${icon(ic)}</span><span class="acc-title">${h}</span><span class="acc-chev">${icon('chevronDown')}</span>
      </button>
      <div class="acc-body" id="${uid}-${i}"><div><div class="acc-inner ${art ? 'has-art' : ''}">${art ? fotoHtml(art) : ''}<p>${p}</p></div></div></div>
    </div>`).join('')}
  </div>`,

  daftar: (b) => `<div class="mb-list ${b.warna === 'oranye' ? 'warm' : ''}">
    ${b.item.map(([ic, h, p]) => `<div class="mb-row"><span class="mb-ic">${icon(ic)}</span><div><b>${h}</b><p>${p}</p></div></div>`).join('')}
  </div>`,

  cek: (b) => `<div class="mb-dodont">
    <div class="do"><h4>${icon('check')} Lakukan</h4>${b.lakukan.map((t) => `<p>${icon('check')}<span>${t}</span></p>`).join('')}</div>
    <div class="dont"><h4>${icon('x')} Hindari</h4>${b.hindari.map((t) => `<p>${icon('x')}<span>${t}</span></p>`).join('')}</div>
  </div>`,

  fakta: (b) => `<div class="mb-fact">
    <svg class="mb-bulb" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="17" r="11" fill="#fde68a"/><path d="M14 17a6 6 0 0 1 6-6" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="15" y="27" width="10" height="7" rx="2" fill="#cbd5e1"/></svg>
    <div><span>Tahukah Kamu?</span><p>${b.isi}</p></div></div>`,

  ingat: (b) => `<blockquote class="mb-quote"><span aria-hidden="true">“</span><p>${b.isi}</p></blockquote>`,

  simbol: (b) => `<div class="mb-symbols">${b.item.map(([c, l]) => `<figure>${wxIcon(c, false, 64)}<figcaption>${l}</figcaption></figure>`).join('')}</div>
    ${b.catatan ? `<p class="mb-note">${b.catatan}</p>` : ''}`,

  skala: (b) => `<p class="mb-text">${b.isi}</p>
    <div class="mb-scale">
      ${[['Ringan', '5 sampai 20 mm', '#bfdbfe'], ['Sedang', '20 sampai 50 mm', '#60a5fa'], ['Lebat', '50 sampai 100 mm', '#2563eb'], ['Sangat lebat', '100 sampai 150 mm', '#1e3a8a'], ['Ekstrem', 'lebih dari 150 mm', '#581c87']]
    .map(([n, v, c]) => `<div><i style="background:${c}"></i><b>${n}</b><span>${v} per hari</span></div>`).join('')}
    </div>`,

  level: (b) => `<p class="mb-text">${b.isi}</p>
    <div class="mb-levels">
      ${[['rgb(102,255,51)', 'Hijau', 'Tidak ada peringatan'], ['rgb(255,255,0)', 'Kuning', 'Waspada'], ['rgb(255,192,0)', 'Oranye', 'Siaga'], ['rgb(255,0,0)', 'Merah', 'Awas']]
    .map(([c, w, s]) => `<div><i style="background:${c}"></i><b>${s}</b><span>${w}</span></div>`).join('')}
    </div>
    <p class="mb-note">Sesuai Peraturan BMKG Nomor 9 Tahun 2022, Pasal 7.</p>`,
};

function lessonHtml(m, i) {
  const done = get().materiDone.includes(m.id);
  return `
    <header class="lesson-hero">
      <div class="lesson-hero-text">
        <span class="lesson-chip">Materi ${i + 1} dari ${MATERI.length}${done ? ` · ${icon('check')} Selesai` : ''}</span>
        <h2>${m.judul}</h2>
        <p>${m.lead}</p>
      </div>
      <div class="lesson-hero-art">${topicArt(m.art)}</div>
    </header>
    <div class="lesson-content">
      ${m.blok.map((b, k) => `
        <section class="mb mb-${b.tipe}" style="animation-delay:${k * 70}ms">
          ${b.judul ? `<h3>${b.judul}</h3>` : ''}
          ${BLOK[b.tipe](b, `${m.id}-${k}`)}
        </section>`).join('')}
    </div>
    <nav class="lesson-nav">
      <button class="btn btn-ghost" data-nav="${i - 1}" ${i === 0 ? 'disabled' : ''}>${icon('arrowLeft')} Sebelumnya</button>
      ${i < MATERI.length - 1
    ? `<button class="btn btn-primary" data-nav="${i + 1}">Selesai, lanjut materi berikutnya ${icon('arrow', 'arrow')}</button>`
    : `<a class="btn btn-primary" href="#/starter-pack" data-finish>Selesai, lanjut ke Starter Pack ${icon('arrow', 'arrow')}</a>`}
    </nav>`;
}

function railHtml(active) {
  const done = get().materiDone;
  return `<div class="rail-head"><span>Daftar materi</span><b>${done.length}/${MATERI.length}</b></div>
    <div class="rail-bar"><span style="width:${(done.length / MATERI.length) * 100}%"></span></div>
    <ol class="rail">${MATERI.map((m, i) => `
      <li class="${i === active ? 'active' : ''} ${done.includes(m.id) ? 'done' : ''}">
        <button data-i="${i}"><span class="rail-dot">${done.includes(m.id) ? icon('check') : i + 1}</span><span class="rail-txt">${m.judul}</span></button>
      </li>`).join('')}</ol>`;
}

function sumberHtml() {
  const pakai = {};
  MATERI.forEach((m, i) => (m.sumber || []).forEach((k) => { (pakai[k] ||= []).push(i); }));
  const keys = Object.keys(SUMBER).filter((k) => pakai[k]);
  return `<section class="ref-section reveal" aria-labelledby="refTitle">
    <span class="eyebrow">${icon('book')} Referensi</span>
    <h2 id="refTitle">Sumber Materi</h2>
    <p class="muted">Materi edukasi BanjirEuy disusun dari sumber resmi lembaga pemerintah berikut. Klik judulnya untuk membaca langsung.</p>
    <ol class="ref-list">${keys.map((k, n) => { const s = SUMBER[k]; return `<li>
      <span class="ref-no">${n + 1}</span>
      <div><span class="ref-lembaga">${esc(s.lembaga)}${s.tahun ? ` · ${s.tahun}` : ''}</span>
      <a href="${s.url}" target="_blank" rel="noopener">${esc(s.judul)} ${icon('external')}</a>
      <span class="ref-used">Dipakai di materi ${pakai[k].map((i) => `<em>${MATERI[i].judul}</em>`).join('')}</span></div>
    </li>`; }).join('')}</ol>
    <div class="ref-foto">
      <h3>Kredit Foto</h3>
      <p class="muted">Foto jenis banjir diambil dari Wikimedia Commons dengan lisensi bebas.</p>
      <div class="ref-foto-grid">${Object.values(FOTO_BANJIR).map((f) => `<a href="${f.halaman}" target="_blank" rel="noopener"><b>${esc(f.ket)}</b><span>${esc(f.kredit)} · ${esc(f.lisensi)}</span></a>`).join('')}</div>
    </div>
  </section>`;
}

export function render({ params }) {
  let idx = Math.max(0, MATERI.findIndex((m) => m.id === params[0]));
  const html = `
  <div class="container section">
    <span class="eyebrow">${icon('book')} Edukasi</span>
    <h1 class="page-title" style="margin-top:10px">Edukasi Banjir</h1>
    <p class="page-sub">Pilih topik dan pelajari pelan-pelan. Progresmu tersimpan otomatis.</p>
    <div class="edu-layout">
      <nav class="topic-rail" id="topics" aria-label="Daftar materi">${railHtml(idx)}</nav>
      <article class="lesson2" id="lesson">${lessonHtml(MATERI[idx], idx)}</article>
    </div>
    ${sumberHtml()}
  </div>`;

  return {
    html,
    mount(el) {
      const topics = el.querySelector('#topics');
      const lesson = el.querySelector('#lesson');
      const markDone = (i) => {
        const id = MATERI[i].id; const s = get();
        if (!s.materiDone.includes(id)) {
          set({ materiDone: [...s.materiDone, id] });
          if (get().materiDone.length === MATERI.length) toast('Lencana "Pembelajar Banjir" terbuka!', 'sparkle');
        }
      };
      const go = (i) => {
        idx = i;
        lesson.innerHTML = lessonHtml(MATERI[i], i);
        lesson.classList.remove('swap'); void lesson.offsetWidth; lesson.classList.add('swap');
        topics.innerHTML = railHtml(i);
        history.replaceState(null, '', `#/edukasi/${MATERI[i].id}`);
        lesson.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      topics.addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) go(Number(b.dataset.i)); });
      lesson.addEventListener('click', (e) => {
        const head = e.target.closest('.acc-head');
        if (head) {
          const item = head.parentElement; const open = !item.classList.contains('open');
          item.classList.toggle('open', open); head.setAttribute('aria-expanded', open);
          return;
        }
        const n = e.target.closest('[data-nav]');
        if (n) { const to = Number(n.dataset.nav); if (to > idx) markDone(idx); go(to); }
        if (e.target.closest('[data-finish]')) markDone(idx);
      });
    },
  };
}
