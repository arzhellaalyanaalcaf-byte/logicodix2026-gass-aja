import { icon } from '../components/icons.js';
import { heroScene, featureIcon, wxIcon } from '../components/illus.js';
import { rainLayer } from '../ui.js';
import { get } from '../store.js';
import { fetchCuaca, isNight, risk, todayYmd, resolveLokasi } from '../weather.js';

export function render() {
  const html = `
  <section class="hero">
    <div class="hero-scene">${heroScene()}</div>
    ${rainLayer(90)}
    <div class="flash"></div>
    <div class="container">
      <div class="hero-copy">
        <span class="eyebrow">${icon('droplet')} Edukasi kesiapsiagaan banjir untuk siswa SMA</span>
        <h1 style="margin-top:16px">Siap Hadapi Banjir di <span class="hl">Sekolah<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 8 C50 2 150 2 198 7" stroke="#5b8ff2" stroke-width="4" fill="none" stroke-linecap="round"/></svg></span> dan Lingkungan Sekitar</h1>
        <p>Website edukasi interaktif untuk siswa SMA. Yuk, pelajari cara mencegah, mempersiapkan, dan bertindak saat banjir — lengkap dengan info cuaca langsung dari BMKG.</p>
        <div class="hero-cta">
          <a class="btn btn-primary btn-pill" href="#/beranda" data-start>Mulai Belajar ${icon('arrow', 'arrow')}</a>
          <a class="btn btn-ghost" href="#/cuaca">${icon('cloudRain')} Cek cuaca hari ini</a>
        </div>
        <div class="hero-trust">
          <div>${icon('book')} 7 materi singkat</div>
          <div>${icon('cloud')} Data live BMKG</div>
          <div>${icon('message')} Tanya Kak Euy (AI)</div>
        </div>
      </div>
      <div class="hero-art">
        <img class="hero-students" src="assets/img/siswa-grup.png" alt="Ilustrasi empat siswa SMA berjalan bersama dengan semangat" width="550" height="522">
      </div>
    </div>
  </section>

  <section class="landing-band">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Alur belajar</span>
        <h2>Lima langkah jadi siswa siaga banjir</h2>
        <p>Belajar santai 15–20 menit, dari memahami konsep sampai siap beraksi di sekolahmu.</p>
      </div>
      <div class="flow">
        ${[
    ['edukasi', 'LANGKAH 1', 'Pahami', 'Materi ringkas: apa, penyebab, dan dampak banjir.'],
    ['starter', 'LANGKAH 2', 'Siapkan', 'Checklist tas siaga yang bisa diunduh (PDF).'],
    ['simulasi', 'LANGKAH 3', 'Latihan', 'Ambil keputusan di situasi banjir di sekolah.'],
    ['kuis', 'LANGKAH 4', 'Uji Diri', '10 soal untuk mengukur pemahamanmu.'],
    ['ai', 'LANGKAH 5', 'Beraksi', 'Terapkan bersama teman di lingkungan sekolah.'],
  ].map(([k, tag, h, p], i) => `<div class="flow-step reveal" style="transition-delay:${i * 80}ms"><div class="num">${featureIcon[k]()}</div><span class="step-tag">${tag}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="landing-band" style="padding-top:0">
    <div class="container split">
      <div class="reveal">
        <span class="eyebrow">${icon('cloudRain')} Dashboard Cuaca BMKG</span>
        <h2 style="font-size:clamp(26px,3vw,34px);font-weight:800;margin-top:12px">Belajar membaca cuaca, bukan cuma menebak langit</h2>
        <p class="muted" style="margin-top:10px;font-size:16px">Prakiraan per 3 jam hingga tingkat kelurahan langsung dari API publik BMKG, dilengkapi indikator kewaspadaan banjir yang mudah dipahami.</p>
        <ul class="feature-list">
          <li><span class="tick">${icon('check')}</span><span><b>Cuaca hari ini & 3 hari ke depan</b><br><span class="muted">Suhu, kelembapan, angin, jarak pandang, dan curah hujan.</span></span></li>
          <li><span class="tick">${icon('check')}</span><span><b>Indikator kewaspadaan</b><br><span class="muted">Berdasarkan kategori intensitas hujan harian BMKG.</span></span></li>
          <li><span class="tick">${icon('check')}</span><span><b>Terhubung ke Kak Euy</b><br><span class="muted">Tanyakan "aman nggak pulang sekolah sore ini?" ke chatbot AI.</span></span></li>
        </ul>
        <a class="btn btn-outline" style="margin-top:24px" href="#/cuaca">Buka dashboard ${icon('arrow', 'arrow')}</a>
      </div>
      <div class="card weather-teaser reveal" id="teaser">
        <div class="skeleton" style="height:28px;width:60%"></div>
        <div class="skeleton" style="height:90px"></div>
        <div class="stat-row"><div class="skeleton" style="height:64px"></div><div class="skeleton" style="height:64px"></div><div class="skeleton" style="height:64px"></div></div>
      </div>
    </div>
  </section>

  <section class="landing-band" style="padding-top:0">
    <div class="container">
      <div class="cta-band reveal">
        <div class="cta-drops"><span style="width:120px;height:120px;right:30%;top:-40px"></span><span style="width:60px;height:60px;left:8%;bottom:20px"></span></div>
        <div>
          <h2>Satu siswa siaga bisa menyelamatkan satu kelas.</h2>
          <p>Mulai sekarang, gratis dan tanpa daftar akun. Progresmu tersimpan otomatis di perangkatmu.</p>
          <a class="btn btn-primary btn-pill" href="#/beranda" data-start>Mulai Belajar ${icon('arrow', 'arrow')}</a>
        </div>
        <img src="assets/img/siswi.png" alt="" style="max-width:150px">
      </div>
    </div>
  </section>`;

  return {
    html,
    async mount(el) {
      const box = el.querySelector('#teaser');
      try {
        const data = await fetchCuaca(await resolveLokasi());
        const c = data.current; const today = todayYmd(data);
        const d0 = data.daily.find((d) => d.date === today) || data.daily[0];
        const r = risk(d0, data.hourly.filter((h) => h.date === d0.date));
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div><div class="muted" style="font-size:13px;font-weight:700;display:flex;gap:6px;align-items:center">${icon('mapPin')} ${data.lokasi.desa}, ${data.lokasi.kotkab}${get().lokasiMode === 'auto' && get().geo ? ' · lokasimu' : ''}</div>
            <div style="font-size:13px" class="muted">Prakiraan pukul ${c.time}</div></div>
            <span class="badge-chip ${r.chip}">${r.label}</span>
          </div>
          <div style="display:flex;align-items:center;gap:16px">
            ${wxIcon(c.weather, isNight(c.time), 96)}
            <div><div style="font-size:52px;font-weight:800;color:var(--navy-800);line-height:1">${c.t}°</div><div style="font-weight:800;color:var(--navy-800)">${c.desc}</div></div>
          </div>
          <div class="stat-row">
            <div class="stat"><b>${c.hu}%</b><span>Kelembapan</span></div>
            <div class="stat"><b>${c.ws} <small style="font-size:12px">km/j</small></b><span>Angin</span></div>
            <div class="stat"><b>${d0.rainTotal} <small style="font-size:12px">mm</small></b><span>Hujan hari ini</span></div>
          </div>
          <div style="font-size:11.5px" class="muted">Sumber: BMKG · Ganti lokasi di halaman Cuaca</div>`;
      } catch (e) {
        box.innerHTML = `<div style="display:flex;gap:14px;align-items:center">${wxIcon(61, false, 80)}<div><b style="color:var(--navy-800)">Data BMKG belum bisa dimuat</b><p class="muted" style="font-size:13.5px">Pastikan server berjalan dan perangkat terhubung internet, lalu buka halaman Cuaca.</p></div></div>`;
      }
    },
  };
}
