import { icon } from '../components/icons.js';
import { aksiIcon, aksiBg } from '../components/illus.js';
import { get, set } from '../store.js';
import { toast } from '../ui.js';

export function render() {
  const s = get();
  const html = `
  <div class="container section" style="padding-top:0">
    <div class="aksi-hero">
      <div class="aksi-art">${aksiBg()}<img src="assets/img/siswi.png" alt="Ilustrasi siswi SMA tersenyum membawa buku"></div>
      <h1>Ayo, Mulai dari Lingkunganmu!</h1>
      <p class="page-sub">Ilmu yang kamu dapat akan lebih bermanfaat kalau dipraktikkan bersama, di rumah, di sekolah, dan di lingkungan sekitar.</p>
      <div class="aksi-cards">
        <div class="aksi-card reveal">${aksiIcon.tim()}<h3>Ajak Orang Terdekat</h3><p>Bahas kesiapsiagaan banjir bersama keluarga, teman, atau komunitas seperti karang taruna dan ekskul.</p></div>
        <div class="aksi-card reveal" style="transition-delay:.08s">${aksiIcon.rencana()}<h3>Susun Rencana Siaga</h3><p>Sepakati jalur evakuasi, titik kumpul, dan siapa menghubungi siapa saat banjir, di rumah maupun di sekolah.</p></div>
        <div class="aksi-card reveal" style="transition-delay:.16s">${aksiIcon.kecil()}<h3>Mulai dari Hal Kecil</h3><p>Jaga kebersihan, tidak membuang sampah sembarangan, dan rawat resapan air.</p></div>
      </div>
    </div>

    <div class="plan-grid">
      <div class="card plan-card reveal"><h3>${icon('calendar')}Minggu ini</h3><ul><li>Cari tahu jalur evakuasi dan titik kumpul terdekat dari rumah dan sekolah.</li><li>Simpan nomor darurat 112, 115, 117 di HP.</li><li>Siapkan tas siaga di rumah bersama keluarga.</li></ul></div>
      <div class="card plan-card reveal"><h3>${icon('calendar')}Bulan ini</h3><ul><li>Ikut kerja bakti membersihkan selokan di lingkungan rumah atau sekolah.</li><li>Buat lubang resapan biopori di halaman atau taman.</li><li>Bagikan materi BanjirEuy ke keluarga dan teman.</li></ul></div>
      <div class="card plan-card reveal"><h3>${icon('calendar')}Semester ini</h3><ul><li>Cek tingkat risiko banjir di wilayahmu lewat InaRISK BNPB.</li><li>Ajak RT, karang taruna, atau OSIS mengadakan simulasi evakuasi.</li><li>Pantau cuaca BMKG dan kabari keluarga saat status Waspada.</li></ul></div>
    </div>

    <div class="card pledge reveal" id="pledge">
      <div>
        <h3>Janji Siaga Banjir</h3>
        <ul class="muted">
          <li>✔ Saya akan menjaga kebersihan saluran air di rumah, sekolah, dan lingkungan sekitar.</li>
          <li>✔ Saya akan mengikuti arahan orang tua, guru, dan petugas saat bencana.</li>
          <li>✔ Saya akan berbagi informasi cuaca resmi BMKG kepada teman dan keluarga.</li>
        </ul>
      </div>
      <button class="btn ${s.janji ? 'btn-outline' : 'btn-primary'}" id="pledgeBtn" ${s.janji ? 'disabled' : ''}>${s.janji ? `${icon('check')} Janji tercatat` : `${icon('shield')} Saya berjanji`}</button>
    </div>
  </div>`;
  return {
    html,
    mount(el) {
      el.querySelector('#pledgeBtn')?.addEventListener('click', (e) => {
        set({ janji: true });
        e.currentTarget.outerHTML = `<button class="btn btn-outline" disabled>${icon('check')} Janji tercatat</button>`;
        toast('Lencana "Agen Aksi Nyata" terbuka! Terima kasih sudah peduli.', 'sparkle');
      });
    },
  };
}
