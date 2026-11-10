import { icon } from '../components/icons.js';
import { houseRain, topicArt } from '../components/illus.js';
import { KUIS } from '../data/content.js';
import { get, set } from '../store.js';
import { optionsHtml } from './simulasi.js';

function artFor(a = {}) {
  if (a.cuaca) return topicArt('cuaca');
  if (a.tas) return topicArt('sebelum');
  if (a.sun) return houseRain({ water: .15, sun: true });
  return houseRain({ water: a.water ?? .5 });
}

export function render() {
  let step = 0; let benar = 0; const answers = []; let answered = false;
  const html = `<div class="container section" id="quizRoot"></div>`;

  const view = () => {
    const k = KUIS[step];
    return `
      <div class="qa-head">
        <div><h1 class="page-title">Kuis Pemahaman</h1><p class="page-sub">Yuk, uji sejauh mana kamu memahami materi banjir!</p></div>
        <div class="progress-wrap" style="width:240px"><div class="progress"><span style="width:${((step + 1) / KUIS.length) * 100}%"></span></div><b>${step + 1} / ${KUIS.length}</b></div>
      </div>
      <div class="quiz-layout">
        <div class="quiz-art">${artFor(k.art)}</div>
        <div class="card quiz-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="qnum">PERTANYAAN ${step + 1}</span><span class="score-live">${icon('check')} ${benar} jawaban benar</span></div>
          <h2>${k.q}</h2>
          <div class="options">${optionsHtml(k.o, 'Kuis')}<div id="fb"></div></div>
          <div class="qa-actions" style="margin-top:16px"><button class="btn btn-primary" id="next" disabled>${step === KUIS.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'} ${icon('arrow', 'arrow')}</button></div>
        </div>
      </div>`;
  };

  return {
    html,
    mount(el) {
      const root = el.querySelector('#quizRoot');
      const draw = () => { answered = false; root.innerHTML = view(); };
      draw();
      root.addEventListener('click', (e) => {
        const opt = e.target.closest('.opt');
        if (opt && !answered) {
          answered = true;
          const k = KUIS[step]; const i = Number(opt.dataset.i); const ok = i === k.a;
          answers.push({ q: step, pick: i, ok });
          if (ok) benar++;
          root.querySelectorAll('.opt').forEach((b, idx) => { b.disabled = true; if (idx === k.a) b.classList.add('correct'); });
          opt.classList.add(ok ? 'selected' : 'wrong');
          root.querySelector('#fb').innerHTML = `<div class="feedback ${ok ? 'good' : 'bad'}">${icon(ok ? 'check' : 'info')}<div><b>${ok ? 'Benar!' : 'Belum tepat.'}</b>${k.e}</div></div>`;
          root.querySelector('.score-live').innerHTML = `${icon('check')} ${benar} jawaban benar`;
          root.querySelector('#next').disabled = false;
          root.querySelector('#next').focus();
        }
        if (e.target.closest('#next')) {
          if (step < KUIS.length - 1) { step++; draw(); return; }
          const skor = Math.round((benar / KUIS.length) * 100);
          const prev = get().kuis.best ?? 0;
          set({ kuis: { best: Math.max(prev, skor), last: skor, answers } });
          location.hash = '#/hasil';
        }
      });
    },
  };
}
