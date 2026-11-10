import { icon } from '../components/icons.js';
import { badgeArt } from '../components/illus.js';
import { confetti } from '../components/confetti.js';
import { KUIS, LENCANA } from '../data/content.js';
import { get, stats } from '../store.js';
import { modal } from '../ui.js';

export function openBadges() {
  const st = stats();
  modal(`<h2>Lencana Saya</h2><p class="muted" style="margin-top:4px">${st.lencanaCount} dari ${LENCANA.length} lencana sudah terbuka.</p>
    <div class="badge-grid">${LENCANA.map((b) => `<div class="badge-tile ${st.lencana[b.id] ? '' : 'locked'}">${badgeArt[b.art]()}<b>${b.nama}</b><small>${st.lencana[b.id] ? 'Terbuka ✓' : b.desc}</small></div>`).join('')}</div>`);
}

export function render() {
  const s = get(); const st = stats();
  const skor = s.kuis.last;
  if (skor == null) {
    return {
      html: `<div class="container section"><div class="card result-wrap" style="max-width:640px;margin:24px auto">
        ${badgeArt.trophy()}<h1>Belum ada hasil kuis</h1><p class="desc">Kerjakan kuis dulu untuk melihat skor dan pencapaianmu.</p>
        <div class="result-actions"><a class="btn btn-primary" href="#/kuis">Mulai Kuis ${icon('arrow', 'arrow')}</a></div></div></div>`,
    };
  }
  const judul = skor >= 80 ? 'Kamu Hebat!' : skor >= 60 ? 'Bagus, Terus Belajar!' : 'Jangan Menyerah!';
  const desc = skor >= 80 ? 'Kamu sudah memahami langkah-langkah menghadapi banjir dengan baik. Pertahankan, ya!'
    : skor >= 60 ? 'Pemahamanmu sudah cukup. Coba ulangi materi yang masih keliru supaya makin siap.'
      : 'Pelajari kembali materi edukasi, lalu coba kuisnya lagi. Kamu pasti bisa!';
  const lencanaUtama = st.lencana.kuis ? 'Juara Kuis' : st.lencanaCount ? `${st.lencanaCount} lencana` : 'Belum ada';
  const html = `
  <div class="container section" style="padding-top:0">
    <div class="card result-wrap">
      <canvas aria-hidden="true"></canvas>
      ${badgeArt.trophy()}
      <h1>${judul}</h1>
      <div class="score">Skor kamu <b>${skor}</b>/100</div>
      <p class="desc">${desc}</p>
      <div class="result-stats">
        <div class="r-stat">${badgeArt.star()}<div><span>Materi Selesai</span><b>${st.materi}/${st.materiTotal}</b></div></div>
        <div class="r-stat">${badgeArt.medal()}<div><span>Kuis</span><b>${skor}/100</b></div></div>
        <div class="r-stat">${badgeArt.shield()}<div><span>Lencana</span><b>${lencanaUtama}</b></div></div>
      </div>
      <div class="result-actions">
        <a class="btn btn-outline" href="#/kuis">${icon('rotate')} Ulangi Kuis</a>
        <button class="btn btn-primary" id="seeBadges">Lihat Lencana Saya</button>
        <a class="btn btn-ghost" href="#/aksi">Aksi Nyata ${icon('arrow', 'arrow')}</a>
      </div>
    </div>
    ${s.kuis.answers?.length ? `<div class="card review">
      <h3>Pembahasan jawabanmu</h3>
      ${s.kuis.answers.map((a) => { const k = KUIS[a.q]; return `<div class="review-item">${a.ok ? `<span style="color:var(--green-500)">${icon('check')}</span>` : `<span style="color:var(--red-500)">${icon('x')}</span>`}<div><b style="color:var(--navy-800)">${a.q + 1}. ${k.q}</b><div class="muted">Jawaban yang benar adalah <b>${k.o[k.a].replace(/\.$/, "")}</b>. ${k.e}</div></div></div>`; }).join('')}
    </div>` : ''}
  </div>`;
  return {
    html,
    mount(el) {
      if (skor >= 60) confetti(el.querySelector('canvas'));
      el.querySelector('#seeBadges').addEventListener('click', openBadges);
    },
  };
}
