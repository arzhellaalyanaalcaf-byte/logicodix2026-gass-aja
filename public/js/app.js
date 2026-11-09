// =============================================================
// BanjirEuy — router SPA (hash), navbar, dan inisialisasi.
// =============================================================
import { icon } from './components/icons.js';
import { logo } from './components/illus.js';
import { initChat } from './components/chatbot.js';
import { get, set, reset, subscribe, stats } from './store.js';
import { $, modal, observeReveal, toast, esc } from './ui.js';
import { openBadges } from './pages/hasil.js';
import { fetchCuaca, risk, todayYmd, resolveLokasi } from './weather.js';

import * as landing from './pages/landing.js';
import * as beranda from './pages/beranda.js';
import * as edukasi from './pages/edukasi.js';
import * as starter from './pages/starter.js';
import * as simulasi from './pages/simulasi.js';
import * as kuis from './pages/kuis.js';
import * as hasil from './pages/hasil.js';
import * as aksi from './pages/aksi.js';
import * as cuaca from './pages/cuaca.js';

const ROUTES = {
  '': { page: landing, title: 'Siap Hadapi Banjir' },
  beranda: { page: beranda, title: 'Beranda', nav: 'beranda' },
  edukasi: { page: edukasi, title: 'Edukasi', nav: 'edukasi' },
  'starter-pack': { page: starter, title: 'Starter Pack', nav: 'starter-pack' },
  kuis: { page: kuis, title: 'Kuis', nav: 'kuis' },
  simulasi: { page: simulasi, title: 'Simulasi', nav: 'simulasi' },
  hasil: { page: hasil, title: 'Hasil & Pencapaian', nav: 'kuis' },
  aksi: { page: aksi, title: 'Aksi Nyata', nav: 'aksi' },
  cuaca: { page: cuaca, title: 'Cuaca BMKG', nav: 'cuaca' },
};

const NAV = [
  ['beranda', 'Beranda'], ['edukasi', 'Edukasi'], ['starter-pack', 'Starter Pack'], ['kuis', 'Kuis'],
  ['simulasi', 'Simulasi'], ['cuaca', 'Cuaca'], ['aksi', 'Aksi Nyata'],
];

function navHtml() {
  return `
  <div class="container">
    <a class="brand" href="#/">${logo()}<span>Banjir<b>Euy</b></span></a>
    <nav class="nav-links" id="navLinks" aria-label="Navigasi utama">
      ${NAV.map(([k, l]) => `<a href="#/${k}" data-nav="${k}" data-label="${l}">${l}</a>`).join('')}
    </nav>
    <div class="nav-actions" id="navActions"></div>
    <button class="icon-btn burger" id="burger" aria-label="Buka menu">${icon('menu')}</button>
  </div>`;
}

function actionsHtml() {
  const s = get();
  if (!s.nama) return `<button class="btn btn-primary btn-sm" id="loginBtn">Masuk</button>`;
  return `
    <div class="rel"><button class="icon-btn" id="bellBtn" aria-label="Notifikasi">${icon('bell')}${s.notifRead ? '' : '<span class="dot"></span>'}</button>
      <div class="dropdown" id="bellDd"><h4>Notifikasi</h4><div id="notifList"><div class="dd-item">Memuat info cuaca…</div></div></div></div>
    <div class="rel"><button class="avatar" id="avaBtn" aria-label="Menu akun" title="${esc(s.nama)}">${esc(s.nama.trim()[0]?.toUpperCase() || 'S')}</button>
      <div class="dropdown" id="avaDd" style="width:250px">
        <h4>${esc(s.nama)}</h4>
        <button class="dd-item" data-act="badges">${icon('shield')}<span><strong>Lencana saya</strong>${stats().lencanaCount} terbuka</span></button>
        <button class="dd-item" data-act="rename">${icon('user')}<span><strong>Ganti nama</strong></span></button>
        <button class="dd-item" data-act="reset">${icon('rotate')}<span><strong>Reset progres</strong>Hapus data di perangkat ini</span></button>
      </div></div>`;
}

function askName(after) {
  modal(`<h2>Kenalan dulu, yuk!</h2>
    <p class="muted" style="margin-top:6px">Nama panggilanmu dipakai untuk menyapa dan tercetak di checklist PDF. Disimpan hanya di perangkat ini.</p>
    <form id="nameForm"><div class="field"><label for="nm">Nama panggilan</label><input id="nm" maxlength="30" placeholder="contoh: Rafi" value="${esc(get().nama)}" autocomplete="nickname" required></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px"><button type="button" class="btn btn-ghost" id="skip">Lewati</button><button class="btn btn-primary" type="submit">Lanjut ${icon('arrow', 'arrow')}</button></div></form>`, {
    onMount(m, close) {
      m.querySelector('#nm').focus();
      m.querySelector('#skip').addEventListener('click', () => { if (!get().nama) set({ nama: 'Siswa' }); close(); after?.(); });
      m.querySelector('#nameForm').addEventListener('submit', (e) => { e.preventDefault(); set({ nama: m.querySelector('#nm').value.trim().slice(0, 30) || 'Siswa' }); close(); after?.(); });
    },
  });
}

async function loadNotif() {
  const list = $('#notifList'); if (!list) return;
  const items = [];
  try {
    const data = await fetchCuaca(await resolveLokasi());
    const t = todayYmd(data); const d0 = data.daily.find((d) => d.date === t) || data.daily[0];
    const r = risk(d0, data.hourly.filter((h) => h.date === d0.date));
    items.push(`<a class="dd-item" href="#/cuaca">${icon('cloudRain')}<span><strong>Cuaca hari ini: ${r.label}</strong>${esc(data.lokasi.desa)} · ${esc(d0.dominant.desc)}, ±${d0.rainTotal} mm</span></a>`);
    const tmr = data.daily.find((d) => d.date > t);
    if (tmr) items.push(`<a class="dd-item" href="#/cuaca">${icon('calendar')}<span><strong>Besok: ${esc(tmr.dominant.desc)}</strong>Suhu ${tmr.tMin}–${tmr.tMax}°C · ${tmr.kategori.label}</span></a>`);
  } catch { items.push(`<div class="dd-item">${icon('info')}<span>Info cuaca belum tersedia.</span></div>`); }
  const st = stats();
  if (st.materi < st.materiTotal) items.push(`<a class="dd-item" href="#/edukasi">${icon('book')}<span><strong>Lanjutkan materi</strong>${st.materi}/${st.materiTotal} materi selesai</span></a>`);
  if (st.checked < st.checklistTotal) items.push(`<a class="dd-item" href="#/starter-pack">${icon('clipboard')}<span><strong>Lengkapi tas siaga</strong>${st.checked}/${st.checklistTotal} barang siap</span></a>`);
  list.innerHTML = items.join('');
}

function bindActions() {
  const box = $('#navActions');
  box.innerHTML = actionsHtml();
  $('#loginBtn')?.addEventListener('click', () => askName(() => { location.hash = '#/beranda'; }));
  const toggle = (btn, dd) => btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown.open').forEach((d) => d !== dd && d.classList.remove('open'));
    dd.classList.toggle('open');
    if (dd.id === 'bellDd' && dd.classList.contains('open')) { loadNotif(); if (!get().notifRead) { set({ notifRead: true }); btn.querySelector('.dot')?.remove(); } }
  });
  toggle($('#bellBtn'), $('#bellDd'));
  toggle($('#avaBtn'), $('#avaDd'));
  $('#avaDd')?.addEventListener('click', (e) => {
    const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
    $('#avaDd').classList.remove('open');
    if (a === 'badges') openBadges();
    if (a === 'rename') askName(() => { bindActions(); route(); });
    if (a === 'reset' && confirm('Hapus semua progres belajar di perangkat ini?')) { reset(); toast('Progres direset.'); location.hash = '#/'; bindActions(); }
  });
}


function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [key, ...params] = raw.split('/');
  const r = ROUTES[key] ?? ROUTES[''];
  // tanpa nama: arahkan ke sapaan dulu, tapi tetap tampilkan halaman
  document.title = `${r.title} · BanjirEuy`;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === r.nav));
  $('#navLinks').classList.remove('open');

  const view = r.page.render({ params });
  const app = $('#app');
  app.innerHTML = `<div class="page">${view.html}</div>`;
  window.scrollTo({ top: 0 });
  view.mount?.(app.firstElementChild);
  observeReveal(app);
}

function init() {
  $('#nav').innerHTML = navHtml();
  bindActions();
  $('#burger').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.rel')) document.querySelectorAll('.dropdown.open').forEach((d) => d.classList.remove('open'));
    const start = e.target.closest('[data-start]');
    if (start && !get().nama) { e.preventDefault(); askName(() => { location.hash = '#/beranda'; }); }
  });
  subscribe(() => { /* jaga avatar tetap sinkron */ const ava = $('#avaBtn'); if (!ava && get().nama) bindActions(); });
  window.addEventListener('hashchange', route);
  initChat();
  route();
}

init();
