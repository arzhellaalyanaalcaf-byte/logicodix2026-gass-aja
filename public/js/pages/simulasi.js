import { icon } from '../components/icons.js';
import { simScene, badgeArt } from '../components/illus.js';
import { SIMULASI } from '../data/content.js';
import { get, set } from '../store.js';
import { toast } from '../ui.js';

export function optionsHtml(opsi, name) {
  return opsi.map((o, i) => `<button class="opt" data-i="${i}" aria-label="${name} pilihan ${i + 1}"><span class="radio">${icon('check')}</span><span>${o.t ?? o}</span></button>`).join('');
}

export function render() {
  let step = 0; let skor = 0; let answered = false;
  const html = `<div class="container section" id="simRoot"></div>`;

  const view = () => {
    const sc = SIMULASI[step];
    return `
      <div class="qa-head">
        <div><span class="eyebrow">Simulasi</span><h1 class="page-title" style="margin-top:10px">Apa yang Harus Kamu Lakukan?</h1><p class="page-sub">Pilih tindakan yang paling tepat dalam situasi berikut.</p></div>
        <div class="progress-wrap" style="width:220px"><div class="progress"><span style="width:${((step + 1) / SIMULASI.length) * 100}%"></span></div><b>${step + 1} / ${SIMULASI.length}</b></div>
      </div>
      <div class="sim-layout">
        <div class="sim-scene">${simScene(sc.scene)}<div class="sim-caption"><span class="tag">${sc.tag}</span><div>${sc.cerita}</div></div></div>
        <div class="options">
          ${optionsHtml(sc.opsi, 'Simulasi')}
          <div id="fb"></div>
          <div class="qa-actions"><button class="btn btn-primary" id="next" disabled>${step === SIMULASI.length - 1 ? 'Lihat hasil' : 'Lanjut'} ${icon('arrow', 'arrow')}</button></div>
        </div>
      </div>`;
  };

  const summary = () => {
    const best = Math.max(skor, get().simulasi.best ?? 0);
    set({ simulasi: { best, last: skor } });
    if (skor >= 4) toast('Lencana "Pengambil Keputusan" terbuka!', 'sparkle');
    return `
      <div class="card result-wrap" style="max-width:720px;margin:24px auto 0">
        <div style="width:96px;margin:0 auto">${badgeArt.map()}</div>
        <h1>${skor >= 4 ? 'Keputusanmu Tepat!' : skor >= 3 ? 'Sudah Cukup Baik!' : 'Ayo Coba Lagi!'}</h1>
        <div class="score">Skor simulasimu <b>${skor}/${SIMULASI.length}</b></div>
        <p class="desc">${skor >= 4 ? 'Kamu mampu mengambil keputusan yang aman saat banjir, di rumah, di sekolah, maupun di jalan. Pertahankan!' : 'Ingat prinsip utamanya. Tetap tenang, ikuti arahan orang tua, guru, atau petugas, jauhi arus dan listrik, serta utamakan keselamatan.'}</p>
        <div class="result-actions"><button class="btn btn-outline" id="again">${icon('rotate')} Ulangi Simulasi</button><a class="btn btn-primary" href="#/kuis">Lanjut ke Kuis ${icon('arrow', 'arrow')}</a></div>
      </div>`;
  };

  return {
    html,
    mount(el) {
      const root = el.querySelector('#simRoot');
      const draw = () => { answered = false; root.innerHTML = view(); root.firstElementChild.scrollIntoView?.({ block: 'nearest' }); };
      draw();
      root.addEventListener('click', (e) => {
        const opt = e.target.closest('.opt');
        if (opt && !answered) {
          answered = true;
          const sc = SIMULASI[step]; const i = Number(opt.dataset.i); const pick = sc.opsi[i];
          root.querySelectorAll('.opt').forEach((b, k) => {
            b.disabled = true;
            if (sc.opsi[k].benar) b.classList.add('correct');
          });
          if (pick.benar) { skor++; opt.classList.add('selected', 'correct'); } else opt.classList.add('wrong');
          const benar = sc.opsi.find((o) => o.benar);
          root.querySelector('#fb').innerHTML = pick.benar
            ? `<div class="feedback good">${icon('check')}<div><b>Tindakan tepat!</b>${pick.alasan}</div></div>`
            : `<div class="feedback bad">${icon('alert')}<div><b>Kurang tepat.</b>${pick.alasan} <br><b style="margin-top:6px">Yang sebaiknya dilakukan adalah</b> ${benar.t.charAt(0).toLowerCase() + benar.t.slice(1)}</div></div>`;
          root.querySelector('#next').disabled = false;
          root.querySelector('#next').focus();
        }
        if (e.target.closest('#next')) {
          if (step < SIMULASI.length - 1) { step++; draw(); } else { root.innerHTML = summary(); }
        }
        if (e.target.closest('#again')) { step = 0; skor = 0; draw(); }
      });
    },
  };
}
