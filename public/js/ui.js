import { icon } from './components/icons.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Markdown mini & aman: **tebal**, baris baru, daftar bernomor/berpoin */
export function miniMd(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/^#{1,6}\s*/gm, '');
}

export function toast(msg, ico = 'check') {
  $('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon(ico)}<span>${esc(msg)}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

export function modal(html, { onMount } = {}) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="icon-btn close" aria-label="Tutup">${icon('x')}</button>${html}</div>`;
  const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('.close')) close(); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(bg);
  onMount?.(bg.querySelector('.modal'), close);
  bg.querySelector('input,button:not(.close)')?.focus();
  return close;
}

/** Hujan CSS: buat n tetes dengan posisi & kecepatan acak */
export function rainLayer(n = 70, cls = '') {
  let html = `<div class="rain-layer ${cls}" aria-hidden="true">`;
  for (let i = 0; i < n; i++) {
    const left = (Math.random() * 110).toFixed(1);
    const h = (14 + Math.random() * 22).toFixed(0);
    const dur = (0.55 + Math.random() * 0.6).toFixed(2);
    const delay = (Math.random() * -2).toFixed(2);
    const op = (0.35 + Math.random() * 0.6).toFixed(2);
    html += `<i style="left:${left}%;height:${h}px;animation-duration:${dur}s;animation-delay:${delay}s;opacity:${op}"></i>`;
  }
  return html + '</div>';
}

let io;
export function observeReveal(root = document) {
  io ??= new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.reveal', root).forEach((el) => io.observe(el));
}

export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function fmtTanggal(ymd, long = false) {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return long ? `${HARI[dt.getDay()]}, ${d} ${BULAN[m - 1]} ${y}` : `${d} ${BULAN[m - 1]}`;
}
export function namaHari(ymd, todayYmd) {
  if (ymd === todayYmd) return 'Hari ini';
  const [y, m, d] = ymd.split('-').map(Number);
  const [ty, tm, td] = todayYmd.split('-').map(Number);
  const diff = Math.round((new Date(y, m - 1, d) - new Date(ty, tm - 1, td)) / 86400000);
  if (diff === 1) return 'Besok';
  if (diff === 2) return 'Lusa';
  return HARI[new Date(y, m - 1, d).getDay()];
}
