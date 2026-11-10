import { icon } from '../components/icons.js';
import { heroScene, featureIcon, wxIcon, badgeArt, homeSchool, logo } from '../components/illus.js';
import { rainLayer, esc } from '../ui.js';
import { get } from '../store.js';
import { TIM } from '../data/content.js';
import { fetchCuaca, isNight, risk, next24, perluPilihLokasi, todayYmd, resolveLokasi } from '../weather.js';

const FITUR = [
  ['edukasi', 'Edukasi Banjir', 'Tujuh materi ringkas tentang pengertian, penyebab, dan dampak banjir, hingga langkah sebelum, saat, dan setelah banjir.'],
  ['starter', 'Starter Pack', 'Checklist tas siaga yang tersimpan otomatis dan bisa diunduh sebagai PDF.'],
  ['simulasi', 'Simulasi Situasi', 'Latihan mengambil keputusan yang tepat dalam 5 situasi banjir yang bisa kamu alami.'],
  ['kuis', 'Kuis Interaktif', '10 soal dengan pembahasan langsung untuk mengukur pemahamanmu.'],
  ['cuaca', 'Pantau Cuaca', 'Prakiraan cuaca resmi BMKG hingga tingkat kelurahan di seluruh Indonesia.'],
  ['ai', 'Tanya Kak Euy', 'Asisten AI yang siap menjawab pertanyaan seputar banjir dan informasi cuaca.'],
];

function inisial(nama) {
  return String(nama).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
}

export function render() {
  const html = `
  <section class="hero" id="top" data-section="top">
    <div class="hero-scene">${heroScene()}</div>
    ${rainLayer(90)}
    <div class="flash"></div>
    <div class="container">
      <div class="hero-copy">
        <span class="eyebrow">${icon('droplet')} Edukasi kesiapsiagaan banjir untuk siswa SMA/SMK/Sederajat</span>
        <h1 style="margin-top:16px">Siap Siaga Hadapi <span class="hl">Banjir<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 8 C50 2 150 2 198 7" stroke="#5b8ff2" stroke-width="4" fill="none" stroke-linecap="round"/></svg></span>, di Mana pun Kamu Berada</h1>
        <p>Website edukasi interaktif untuk siswa SMA/SMK/Sederajat. Pahami penyebab banjir, siapkan diri dan keluarga, latih keputusanmu saat darurat, dan pantau cuaca langsung dari BMKG.</p>
        <div class="hero-cta">
          <a class="btn btn-primary btn-pill" href="#/beranda" data-start>${get().nama ? 'Lanjutkan Belajar' : 'Mulai Belajar'} ${icon('arrow', 'arrow')}</a>
        </div>
        <div class="hero-trust">
          <div>${icon('book')} 7 materi singkat</div>
          <div>${icon('cloud')} Data live BMKG</div>
          <div>${icon('message')} Tanya Kak Euy (AI)</div>
        </div>
      </div>
      <div class="hero-art">
        <img class="hero-students" src="assets/img/siswa-grup.png" alt="Ilustrasi empat pelajar berjalan bersama dengan semangat" width="550" height="522">
      </div>
    </div>
  </section>

  <!-- ===== FITUR ===== -->
  <section class="landing-band" id="fitur" data-section="fitur">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Fitur</span>
        <h2>Semua yang kamu butuhkan untuk siaga banjir</h2>
        <p>Cukup luangkan 15–20 menit untuk memahami konsepnya, menyiapkan perlengkapan, melatih keputusanmu, dan menguji pemahamanmu.</p>
      </div>
      <div class="fitur-grid">
        ${FITUR.map(([k, h, p], i) => `
          <div class="fitur-card reveal" style="transition-delay:${(i % 3) * 80}ms">
            <div class="fitur-ico">${featureIcon[k]()}</div>
            <div><h3>${h}</h3><p>${p}</p></div>
          </div>`).join('')}
      </div>
      <div class="fitur-flow reveal">
        ${['Pahami', 'Siapkan', 'Latihan', 'Uji diri', 'Beraksi'].map((t, i) => `<span><b>${i + 1}</b>${t}</span>`).join(`<i>${icon('arrow')}</i>`)}
      </div>
    </div>
  </section>

  <!-- ===== PANTAU CUACA ===== -->
  <section class="landing-band band-soft" id="pantau-cuaca" data-section="pantau-cuaca">
    <div class="container split">
      <div class="reveal">
        <span class="eyebrow">${icon('cloudRain')} Pantau Cuaca</span>
        <h2 class="band-title">Belajar membaca cuaca, bukan cuma menebak langit</h2>
        <p class="muted band-lead">Prakiraan per 3 jam hingga tingkat kelurahan langsung dari API publik BMKG, dilengkapi indikator kewaspadaan banjir yang mudah dipahami.</p>
        <ul class="feature-list">
          <li><span class="tick">${icon('check')}</span><span><b>Cuaca hari ini & beberapa hari ke depan</b><br><span class="muted">Suhu, kelembapan, angin, dan perkiraan hujan.</span></span></li>
          <li><span class="tick">${icon('check')}</span><span><b>Pilih lokasi mana pun</b><br><span class="muted">Cari kelurahan atau desa di seluruh Indonesia, pilihanmu tersimpan otomatis.</span></span></li>
          <li><span class="tick">${icon('check')}</span><span><b>Indikator kewaspadaan banjir</b><br><span class="muted">Berdasarkan kategori intensitas hujan harian BMKG.</span></span></li>
        </ul>
        <a class="btn btn-primary" style="margin-top:26px" href="#/cuaca">Buka Pantau Cuaca ${icon('arrow', 'arrow')}</a>
      </div>
      <div class="card weather-teaser reveal" id="teaser">
        <div class="skeleton" style="height:28px;width:60%"></div>
        <div class="skeleton" style="height:90px"></div>
        <div class="stat-row"><div class="skeleton" style="height:64px"></div><div class="skeleton" style="height:64px"></div><div class="skeleton" style="height:64px"></div></div>
      </div>
    </div>
  </section>

  <!-- ===== TENTANG KAMI ===== -->
  <section class="landing-band" id="tentang" data-section="tentang">
    <div class="container">
      <div class="about reveal">
        <div class="about-text">
          <span class="eyebrow">Tentang Kami</span>
          <h2 class="band-title">Dari mahasiswa meteorologi, untuk generasi muda yang lebih siaga</h2>
          <p class="band-lead muted">BanjirEuy lahir dari keresahan kami. Banjir terus berulang setiap musim hujan, tetapi banyak remaja belum tahu apa yang harus dilakukan ketika banjir datang, baik di rumah, di jalan, maupun di sekolah. Padahal informasi cuaca resmi dari BMKG sudah tersedia hingga tingkat kelurahan.</p>
          <p class="band-lead muted">Kami menggabungkan edukasi kebencanaan, data cuaca nyata, dan teknologi AI agar belajar siaga banjir terasa dekat, praktis, dan menyenangkan.</p>
          <div class="about-points">
            <div>${badgeArt.book()}<span><b>Misi</b>Membangun budaya siaga banjir sejak usia remaja.</span></div>
            <div>${badgeArt.cloud()}<span><b>Pendekatan</b>Belajar berbasis data cuaca resmi BMKG.</span></div>
          </div>
        </div>
        <div class="about-badge">
          <div class="about-logo">${logo(64)}<span>Banjir<b>Euy</b></span><small>Siaga banjir dimulai dari diri sendiri</small></div>
          <div class="about-tag"><b>Logicodix 2026</b><span>Hackathon · Smart &amp; Fun Education</span></div>
          ${homeSchool()}
        </div>
      </div>

      <div class="section-head reveal" style="margin-top:64px">
        <h2 style="font-size:clamp(24px,2.6vw,34px)">Tim Pengembang</h2>
        <p>Orang-orang di balik BanjirEuy.</p>
      </div>
      <div class="tim-grid">
        ${TIM.map((t, i) => `
          <div class="tim-card reveal" style="transition-delay:${i * 80}ms">
            <div class="tim-foto">${t.foto ? `<img src="${esc(t.foto)}" alt="Foto ${esc(t.nama)}" loading="lazy">` : `<span>${esc(inisial(t.nama))}</span>`}</div>
            <h3>${esc(t.nama)}</h3>
            ${t.peran ? `<p class="tim-peran">${esc(t.peran)}</p>` : ''}
            <p class="tim-peran">${esc(t.asal)}</p>
          </div>`).join('')}
      </div>
    </div>
  </section>`;

  return {
    html,
    async mount(el) {
      const box = el.querySelector('#teaser');
      try {
        const adm = await resolveLokasi();
        if (perluPilihLokasi()) {
          box.innerHTML = `<div style="display:flex;gap:14px;align-items:center">${icon('mapPin')}<div><b style="color:var(--navy-800)">Pilih lokasimu dulu</b><p class="muted" style="font-size:14px">Buka <a href="#/cuaca">Pantau Cuaca</a> lalu pilih kelurahan atau desamu, nanti cuacanya muncul di sini.</p></div></div>`;
          return;
        }
        const data = await fetchCuaca(adm);
        const c = data.current; const today = todayYmd(data);
        const d0 = data.daily.find((d) => d.date === today) || data.daily[0];
        const r = risk(d0, next24(data));
        box.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
            <div><div class="muted" style="font-size:14px;font-weight:700;display:flex;gap:6px;align-items:center">${icon('mapPin')} ${esc(data.lokasi.desa)}, ${esc(data.lokasi.kotkab)}</div>
            <div style="font-size:13.5px" class="muted">Prakiraan pukul ${c.time}</div></div>
            <span class="badge-chip ${r.chip}">${r.label}</span>
          </div>
          <div style="display:flex;align-items:center;gap:16px">
            ${wxIcon(c.weather, isNight(c.time), 104)}
            <div><div style="font-size:60px;font-weight:800;color:var(--navy-800);line-height:1">${c.t}°</div><div style="font-weight:800;color:var(--navy-800);font-size:18px">${esc(c.desc)}</div></div>
          </div>
          <div class="stat-row">
            <div class="stat"><b>${c.hu}%</b><span>Kelembapan</span></div>
            <div class="stat"><b>${c.ws} <small style="font-size:13px">km/j</small></b><span>Angin</span></div>
            <div class="stat"><b>${d0.rainTotal} <small style="font-size:13px">mm</small></b><span>Hujan hari ini</span></div>
          </div>
          <div style="font-size:12.5px" class="muted">Sumber data BMKG. Lokasi bisa diganti di halaman Pantau Cuaca.</div>`;
      } catch {
        box.innerHTML = `<div style="display:flex;gap:14px;align-items:center">${wxIcon(61, false, 80)}<div><b style="color:var(--navy-800)">Data BMKG belum bisa dimuat</b><p class="muted" style="font-size:14px">Pastikan server berjalan dan perangkat terhubung internet, lalu buka halaman Pantau Cuaca.</p></div></div>`;
      }
    },
  };
}
