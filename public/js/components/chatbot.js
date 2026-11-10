// Widget chatbot "Kak Euy" — memanggil /api/chat (kunci API tetap di server).
import { icon } from './icons.js';
import { esc, miniMd } from '../ui.js';
import { get } from '../store.js';

const HIST_KEY = 'banjireuy:chat';
const SUGGEST = [
  'Apa yang harus kulakukan kalau banjir saat di sekolah?',
  'Apa saja isi tas siaga?',
  'Gimana cara baca prakiraan cuaca BMKG?',
  'Kenapa sampah bisa bikin banjir?',
];

let panel; let fab; let bodyEl; let input; let sendBtn; let history = []; let busy = false; let provider = 'offline';

function save() { try { sessionStorage.setItem(HIST_KEY, JSON.stringify(history.slice(-20))); } catch { /* */ } }

function bubble(role, text, meta = '') {
  const el = document.createElement('div');
  el.className = `msg ${role === 'user' ? 'user' : 'bot'}`;
  el.innerHTML = role === 'user' ? esc(text) : miniMd(text) + (meta ? `<span class="meta">${esc(meta)}</span>` : '');
  bodyEl.appendChild(el);
  bodyEl.scrollTop = bodyEl.scrollHeight;
  return el;
}

function greet() {
  const nama = get().nama ? `, ${get().nama.split(' ')[0]}` : '';
  bubble('bot', `Halo${nama}! Aku **Kak Euy** 👋 Asisten AI BanjirEuy. Tanya apa saja soal banjir, tas siaga, atau cuaca hari ini, ya!`);
  const chips = document.createElement('div');
  chips.className = 'chips';
  chips.innerHTML = SUGGEST.map((s) => `<button type="button">${esc(s)}</button>`).join('');
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { chips.remove(); send(b.textContent); } });
  bodyEl.appendChild(chips);
}

async function send(text) {
  text = String(text || '').trim();
  if (!text || busy) return;
  busy = true; sendBtn.disabled = true;
  bodyEl.querySelector('.chips')?.remove();
  bubble('user', text);
  history.push({ role: 'user', content: text });
  input.value = ''; input.style.height = '44px';
  const typing = document.createElement('div');
  typing.className = 'msg bot typing'; typing.innerHTML = '<i></i><i></i><i></i>';
  bodyEl.appendChild(typing); bodyEl.scrollTop = bodyEl.scrollHeight;
  try {
    const r = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream: true, messages: history.slice(-12), context: { nama: get().nama, cuaca: window.__banjireuyCuaca || '' } }),
    });
    if (!r.ok || !r.body) { const d = await r.json().catch(() => ({})); throw new Error(d.error || 'Gagal terhubung'); }
    // Baca balasan NDJSON sedikit demi sedikit dan tampilkan langsung
    const reader = r.body.getReader(); const dec = new TextDecoder();
    let buf = ''; let text = ''; let el = null; let fin = {};
    const paint = () => {
      if (!el) { typing.remove(); el = bubble('bot', ''); el.classList.add('streaming'); }
      el.innerHTML = miniMd(text);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    };
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const ln = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!ln) continue;
        let o; try { o = JSON.parse(ln); } catch { continue; }
        if (o.t) { text += o.t; paint(); }
        if (o.done) fin = o;
      }
    }
    if (!text) throw new Error('Balasan kosong');
    el.classList.remove('streaming');
    provider = fin.provider || provider; setStatus();
    const meta = fin.provider === 'offline' ? (fin.warning || 'Mode offline · basis pengetahuan lokal') : (fin.warning || '');
    el.innerHTML = miniMd(text) + (meta ? `<span class="meta">${esc(meta)}</span>` : '');
    history.push({ role: 'assistant', content: text });
    save();
  } catch (e) {
    typing.remove();
    bubble('bot', `Maaf, aku belum bisa terhubung (${e.message}). Pastikan server BanjirEuy berjalan, lalu coba lagi.`);
    history.pop();
  } finally {
    busy = false; sendBtn.disabled = false; input.focus();
  }
}

function setStatus() {
  const s = panel?.querySelector('.chat-status');
  if (!s) return;
  s.innerHTML = provider === 'offline' ? '<i class="off"></i> Mode offline' : '<i></i> Online · didukung AI';
}

export function openChat(prefill) {
  if (!panel) return;
  panel.hidden = false; fab.hidden = true;
  if (prefill) send(prefill); else input.focus();
}

export function initChat() {
  fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Buka chat Kak Euy');
  fab.innerHTML = `<span class="fab-ava"><img src="assets/img/siswi.png" alt=""></span><span class="pulse"></span><span class="lbl">Tanya Kak Euy</span>`;
  panel = document.createElement('section');
  panel.className = 'chat-panel'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Chat dengan Kak Euy');
  panel.innerHTML = `
    <div class="chat-head">
      <span class="ava"><img src="assets/img/siswi.png" alt=""></span>
      <div><b>Kak Euy</b><small class="chat-status"><i></i> Memeriksa…</small></div>
      <button class="icon-btn" data-clear title="Mulai ulang" aria-label="Mulai ulang percakapan">${icon('rotate')}</button>
      <button class="icon-btn" data-close style="margin-left:0" aria-label="Tutup chat">${icon('x')}</button>
    </div>
    <div class="chat-body" aria-live="polite"></div>
    <form class="chat-form">
      <textarea rows="1" placeholder="Tulis pertanyaanmu…" aria-label="Pesan" maxlength="1000"></textarea>
      <button type="submit" aria-label="Kirim">${icon('send')}</button>
    </form>
    <div class="chat-disclaimer">Jawaban AI bisa keliru. Dalam keadaan darurat, ikuti arahan guru/petugas & hubungi 112.</div>`;
  document.body.append(fab, panel);
  bodyEl = panel.querySelector('.chat-body');
  input = panel.querySelector('textarea');
  sendBtn = panel.querySelector('button[type=submit]');

  try { history = JSON.parse(sessionStorage.getItem(HIST_KEY) || '[]'); } catch { history = []; }
  if (history.length) history.forEach((m) => bubble(m.role, m.content)); else greet();

  fab.addEventListener('click', () => openChat());
  panel.querySelector('[data-close]').addEventListener('click', () => { panel.hidden = true; fab.hidden = false; });
  panel.querySelector('[data-clear]').addEventListener('click', () => { history = []; save(); bodyEl.innerHTML = ''; greet(); });
  panel.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); } });
  input.addEventListener('input', () => { input.style.height = '44px'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });

  fetch('/api/status').then((r) => r.json()).then((d) => { provider = d.ai; setStatus(); }).catch(() => { provider = 'offline'; setStatus(); });
}
