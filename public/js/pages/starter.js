import { icon } from '../components/icons.js';
import { itemIcon, leafBg } from '../components/illus.js';
import { CHECKLIST } from '../data/content.js';
import { get, set, totalChecklist } from '../store.js';
import { toast } from '../ui.js';
import { MiniPDF, download } from '../components/pdf.js';

function buatPdf() {
  const s = get();
  const pdf = new MiniPDF();
  const W = pdf.W;
  pdf.rect(0, 0, W, 108, { fill: '#1a56db' });
  pdf.rect(0, 108, W, 6, { fill: '#5b8ff2' });
  pdf.text(40, 46, 'BanjirEuy', { size: 13, bold: true, color: '#c9dafb' });
  pdf.text(40, 76, 'Checklist Tas Siaga Banjir', { size: 24, bold: true, color: '#ffffff' });
  pdf.text(40, 96, 'Perlengkapan penting yang perlu kamu siapkan di rumah, sekolah, atau dalam tas siaga.', { size: 10, color: '#dbe7ff' });

  const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const checked = Object.values(s.checklist).filter(Boolean).length;
  pdf.text(40, 142, `Nama   ${s.nama || '..............................................'}`, { size: 11, bold: true });
  pdf.text(330, 142, `Tanggal   ${tgl}`, { size: 11 });
  pdf.text(40, 160, `${checked} dari ${totalChecklist} barang sudah siap`, { size: 10, color: '#5d6b85' });

  let y = 190;
  for (const cat of CHECKLIST) {
    pdf.rect(40, y - 14, W - 80, 22, { fill: '#e3edfd' });
    pdf.text(50, y + 1, cat.kat.toUpperCase(), { size: 10, bold: true, color: '#1446b8' });
    y += 24;
    for (const [k, nama, ket] of cat.items) {
      const on = !!s.checklist[k];
      pdf.rect(50, y - 11, 14, 14, on ? { fill: '#16a34a' } : { stroke: '#8090a8', lw: 1.2 });
      if (on) pdf.polyline([[53, y - 4], [56, y - 1], [61, y - 8]], { color: '#ffffff', lw: 1.8 });
      pdf.text(74, y, nama, { size: 11.5, bold: true, color: on ? '#5d6b85' : '#0f2a63' });
      pdf.text(74, y + 13, ket, { size: 9, color: '#8090a8' });
      y += 32;
    }
    y += 8;
  }
  pdf.line(40, y, W - 40, y);
  y += 22;
  pdf.text(40, y, 'Nomor Telepon Darurat', { size: 11, bold: true });
  pdf.text(40, y + 16, 'Darurat: 112      Pemadam Kebakaran: 113      Basarnas: 115      BNPB: 117      Layanan Kesehatan: 119', { size: 10, color: '#33415c' });
  pdf.text(40, y + 34, 'Periksa isi tas siaga setiap awal musim hujan dan ganti makanan atau obat yang sudah kedaluwarsa.', { size: 9.5, color: '#5d6b85' });
  pdf.text(40, 812, 'Dibuat dari website BanjirEuy, edukasi kesiapsiagaan banjir untuk siswa SMA/SMK/Sederajat.', { size: 8.5, color: '#8090a8' });
  return pdf.blob();
}

export function render() {
  const s = get();
  const list = CHECKLIST.map((cat) => `
    <div class="cl-cat">${cat.kat}</div>
    ${cat.items.map(([k, nama, ket]) => `
      <label class="cl-item">
        <input type="checkbox" data-k="${k}" ${s.checklist[k] ? 'checked' : ''}>
        <span class="cl-box">${icon('check')}</span>
        ${itemIcon(k)}
        <span class="cl-text">${nama}<small>${ket}</small></span>
      </label>`).join('')}`).join('');
  const html = `
  <div class="container section">
    <div class="sp-layout">
      <div>
        <h1 class="page-title">Starter Pack Banjir</h1>
        <p class="page-sub">Perlengkapan penting yang sebaiknya kamu siapkan di rumah, sekolah, atau dalam tas siaga.</p>
        <div class="bag-stage">
          ${leafBg()}
          <div class="bag-shadow"></div>
          <img class="bag" src="assets/img/tas-siaga.png" alt="Ilustrasi tas ransel biru sebagai tas siaga" width="360" height="360">
          <div class="fly-item" style="left:12%;top:16%;animation-delay:-1s">${itemIcon('senter')}</div>
          <div class="fly-item" style="right:10%;top:22%;animation-delay:-2.5s">${itemIcon('obat')}</div>
          <div class="fly-item" style="left:8%;bottom:22%;animation-delay:-3.5s">${itemIcon('power')}</div>
          <div class="fly-item" style="right:14%;bottom:16%;animation-delay:-.4s">${itemIcon('jas')}</div>
        </div>
      </div>
      <div class="card checklist">
        <div class="checklist-head">
          <h3>Checklist tas siaga</h3>
          <span class="badge-chip chip-blue" id="clCount"></span>
        </div>
        <div class="progress"><span id="clBar"></span></div>
        <div id="clList">${list}</div>
        <div class="checklist-foot">
          <button class="btn btn-ghost btn-sm" id="clAll">${icon('check')} Tandai semua</button>
          <button class="btn btn-primary" id="clPdf">Unduh Checklist (PDF) ${icon('download')}</button>
        </div>
      </div>
    </div>
  </div>`;

  return {
    html,
    mount(el) {
      const update = () => {
        const n = Object.values(get().checklist).filter(Boolean).length;
        el.querySelector('#clCount').textContent = `${n}/${totalChecklist} siap`;
        el.querySelector('#clBar').style.width = `${(n / totalChecklist) * 100}%`;
      };
      update();
      el.querySelector('#clList').addEventListener('change', (e) => {
        const k = e.target.dataset.k; if (!k) return;
        const before = Object.values(get().checklist).filter(Boolean).length;
        set((st) => ({ checklist: { ...st.checklist, [k]: e.target.checked } }));
        update();
        const after = Object.values(get().checklist).filter(Boolean).length;
        if (after === totalChecklist && before < totalChecklist) toast('Tas siagamu lengkap! Lencana "Siap Siaga" terbuka.', 'sparkle');
      });
      el.querySelector('#clAll').addEventListener('click', () => {
        const all = {}; CHECKLIST.forEach((c) => c.items.forEach(([k]) => { all[k] = true; }));
        set({ checklist: all });
        el.querySelectorAll('#clList input').forEach((i) => { i.checked = true; });
        update(); toast('Semua barang ditandai siap.');
      });
      el.querySelector('#clPdf').addEventListener('click', () => {
        download(buatPdf(), 'Checklist-Tas-Siaga-BanjirEuy.pdf');
        toast('Checklist PDF berhasil diunduh.', 'download');
      });
    },
  };
}
