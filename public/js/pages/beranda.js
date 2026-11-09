import { icon } from '../components/icons.js';
import { homeSchool, featureIcon, wxIcon, badgeArt } from '../components/illus.js';
import { get, stats } from '../store.js';
import { LENCANA } from '../data/content.js';
import { fetchCuaca, isNight, risk, todayYmd, zonaLabel, resolveLokasi } from '../weather.js';
import { esc } from '../ui.js';
import { openChat } from '../components/chatbot.js';

export function render() {
  const s = get(); const st = stats();
  const nama = s.nama ? esc(s.nama.split(' ')[0]) : 'Siswa';
  const done = (k) => `<span class="done-tag" title="Selesai">${icon('check')}</span>`.repeat(k ? 1 : 0);
  const html = `
  <div class="container section" style="padding-top:0">
    <div class="home-hero">
      ${homeSchool()}
      <div style="position:relative;z-index:2">
        <h1>Halo, ${nama}! <span class="wave-hand" aria-hidden="true">👋</span></h1>
        <p class="page-sub">Yuk, tingkatkan kesiapsiagaanmu terhadap banjir.</p>
        <div class="home-progress"><span>Progres belajar</span><div class="progress"><span style="width:${st.progress}%"></span></div><span>${st.progress}%</span></div>
      </div>
    </div>

    <div class="feature-grid" style="margin-top:16px">
      <a class="f-card reveal" href="#/edukasi">${done(st.materi >= st.materiTotal)}${featureIcon.edukasi()}<h3>Edukasi</h3><p>Pelajari materi banjir secara ringkas.</p></a>
      <a class="f-card reveal" href="#/starter-pack" style="transition-delay:.06s">${done(st.checked >= st.checklistTotal)}${featureIcon.starter()}<h3>Starter Pack</h3><p>Cek perlengkapan penting saat banjir.</p></a>
      <a class="f-card reveal" href="#/kuis" style="transition-delay:.12s">${done(s.kuis.best != null)}${featureIcon.kuis()}<h3>Kuis</h3><p>Uji pemahamanmu dengan kuis interaktif.</p></a>
      <a class="f-card reveal" href="#/simulasi" style="transition-delay:.18s">${done(s.simulasi.best != null)}${featureIcon.simulasi()}<h3>Simulasi</h3><p>Latihan menghadapi situasi banjir.</p></a>
    </div>

    <div class="card info-today" id="infoToday">
      <div class="ico">${wxIcon(61, false, 64)}</div>
      <div class="txt"><h3>Info Hari Ini</h3><div class="skeleton" style="height:14px;width:70%;margin-top:8px"></div><div class="skeleton" style="height:14px;width:50%;margin-top:6px"></div></div>
      <a class="btn btn-outline btn-sm" href="#/cuaca">Lihat Detail ${icon('arrow', 'arrow')}</a>
    </div>

    <div class="home-grid2">
      <div class="card mini-card reveal">
        <h3>Lencana kamu <span class="badge-chip chip-blue">${st.lencanaCount}/${LENCANA.length}</span></h3>
        <div class="badge-row">
          ${LENCANA.map((b) => `<div class="badge-pill ${st.lencana[b.id] ? '' : 'locked'}" title="${b.desc}">${badgeArt[b.art]()}${b.nama}</div>`).join('')}
        </div>
        <p class="muted" style="font-size:13px;margin-top:12px">Selesaikan materi, checklist, simulasi, kuis, dan aksi nyata untuk membuka semua lencana.</p>
      </div>
      <div class="card mini-card ai-card reveal">
        <h3>Tanya Kak Euy ${icon('sparkle')}</h3>
        <p>Asisten AI yang siap menjawab pertanyaanmu soal banjir, tas siaga, sampai cara membaca cuaca BMKG.</p>
        <button class="btn btn-sm" id="askAi">Mulai ngobrol ${icon('arrow', 'arrow')}</button>
        <img src="assets/img/siswi.png" alt="">
      </div>
    </div>
  </div>`;

  return {
    html,
    async mount(el) {
      el.querySelector('#askAi').addEventListener('click', () => openChat());
      const box = el.querySelector('#infoToday');
      try {
        const data = await fetchCuaca(await resolveLokasi());
        const auto = get().lokasiMode === 'auto' && get().geo?.adm4 === data.lokasi.adm4;
        const today = todayYmd(data);
        const d0 = data.daily.find((d) => d.date === today) || data.daily[0];
        const hours = data.hourly.filter((h) => h.date === d0.date);
        const r = risk(d0, hours);
        const c = data.current;
        const rainy = d0.rainHours.length ? `Potensi hujan sekitar pukul ${d0.rainHours.slice(0, 4).join(', ')} ${zonaLabel(data.lokasi.timezone)}.` : 'Tidak ada potensi hujan signifikan hari ini.';
        box.innerHTML = `
          <div class="ico">${wxIcon(c.weather, isNight(c.time), 64)}</div>
          <div class="txt">
            <h3>Info Hari Ini <span class="badge-chip ${r.chip}">${r.label}</span></h3>
            <p><b>${auto ? '📍 ' : ''}${data.lokasi.desa}, ${data.lokasi.kotkab}${auto ? ' (lokasimu)' : ''}:</b> ${c.desc}, ${c.t}°C. ${rainy}</p>
            <p>${r.tip}</p>
            <div class="meta">Sumber: BMKG · prakiraan ${c.time} ${zonaLabel(data.lokasi.timezone)}</div>
          </div>
          <a class="btn btn-outline btn-sm" href="#/cuaca">Lihat Detail ${icon('arrow', 'arrow')}</a>`;
      } catch {
        box.querySelector('.txt').innerHTML = `<h3>Info Hari Ini</h3><p>Waspada hujan lebat di beberapa wilayah saat musim hujan. Pelajari kembali langkah-langkah saat banjir, ya!</p><div class="meta">Data BMKG belum dapat dimuat.</div>`;
      }
    },
  };
}
