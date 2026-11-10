// Basis pengetahuan lokal untuk chatbot saat kunci API AI belum diatur atau layanan AI gagal.
// Ini BUKAN AI, hanya pencocokan kata kunci sederhana, dan ditandai "mode offline" di antarmuka.

const KB = [
  {
    keys: ['darurat', 'terjebak', 'tolong', 'nomor', 'telepon', 'hubungi', 'bantuan'],
    a: 'Kalau sedang darurat, **utamakan keselamatan** dengan langkah berikut.\n1. Ikuti arahan petugas dan menjauh dari arus air.\n2. Naik ke tempat yang lebih tinggi seperti lantai atas atau titik kumpul aman.\n3. Hubungi **112** (darurat), **115** (Basarnas), atau **117** (BNPB).\n4. Matikan listrik hanya jika aman dan tanganmu kering.',
  },
  {
    keys: ['apa itu banjir', 'pengertian', 'definisi', 'banjir itu'],
    a: 'Banjir adalah kondisi ketika air menggenangi daratan yang biasanya kering dalam jumlah besar, sampai mengganggu aktivitas sehari-hari. Penyebabnya bisa hujan deras berkepanjangan, sungai meluap, saluran air tersumbat, atau air laut pasang (rob).',
  },
  {
    keys: ['penyebab', 'kenapa banjir', 'mengapa', 'sebab'],
    a: 'Penyebab banjir biasanya gabungan faktor alam dan manusia, misalnya\n1. **Hujan lebat** dalam waktu lama.\n2. **Saluran air tersumbat** sampah.\n3. **Daerah resapan berkurang** karena tanah tertutup beton dan aspal.\n4. **Penggundulan hutan** di daerah hulu.\n5. **Pasang air laut (rob)** di wilayah pesisir.',
  },
  {
    keys: ['tas', 'starter', 'siaga', 'bawa', 'perlengkapan', 'barang'],
    a: 'Isi **tas siaga** minimal pakaian ganti, jas hujan, senter dan baterai cadangan, obat pribadi, makanan dan minuman tahan lama, power bank, peluit, serta dokumen penting dalam plastik kedap air. Cek daftar lengkapnya di halaman **Starter Pack** ya!',
  },
  {
    keys: ['saat banjir', 'ketika banjir', 'sedang banjir', 'di sekolah', 'kelas', 'di rumah'],
    a: 'Saat banjir terjadi, lakukan langkah berikut.\n1. Tetap tenang dan **ikuti arahan orang tua, guru, atau petugas**.\n2. Jangan melewati genangan, apalagi yang arusnya deras.\n3. Jauhi kabel dan instalasi listrik.\n4. Pindah ke lantai atas atau titik kumpul yang aman.\n5. Kabari keluarga bahwa kamu aman.',
  },
  {
    keys: ['sebelum', 'mencegah', 'cegah', 'persiapan', 'siapkan'],
    a: 'Sebelum banjir datang, kamu bisa\n1. Mengenali **jalur evakuasi** dan titik kumpul di rumah maupun sekolah.\n2. Menyiapkan **tas siaga**.\n3. Memantau **prakiraan cuaca BMKG** setiap hari.\n4. Menjaga saluran air dari sampah.\n5. Menyimpan nomor darurat di HP.',
  },
  {
    keys: ['setelah', 'pasca', 'surut', 'bersih'],
    a: 'Setelah banjir surut, perhatikan hal berikut.\n1. Tunggu pengumuman aman sebelum kembali.\n2. Pakai sepatu bot dan sarung tangan saat bersih-bersih.\n3. Jangan nyalakan listrik sebelum dicek petugas.\n4. Buang makanan yang terendam air banjir.\n5. Waspadai penyakit seperti diare dan leptospirosis, dan rajin cuci tangan dengan sabun.',
  },
  {
    keys: ['cuaca', 'bmkg', 'hujan', 'prakiraan', 'ramalan'],
    a: 'Kamu bisa cek prakiraan cuaca resmi di halaman **Pantau Cuaca** BanjirEuy yang datanya langsung dari BMKG. Perhatikan jam-jam hujan dan kategori hujan harian, yaitu ringan (5–20 mm), sedang (20–50 mm), lebat (50–100 mm), sangat lebat (100–150 mm), dan ekstrem (lebih dari 150 mm). Makin lebat hujannya, makin tinggi kewaspadaanmu!',
  },
  {
    keys: ['penyakit', 'leptospirosis', 'diare', 'sehat', 'kesehatan'],
    a: 'Penyakit yang sering muncul setelah banjir antara lain **diare, leptospirosis, penyakit kulit, dan ISPA**. Cegah dengan mencuci tangan pakai sabun, minum air yang dimasak atau air kemasan, memakai alas kaki, dan menutup luka agar tidak terkena air banjir.',
  },
  {
    keys: ['sampah', 'lingkungan', 'pohon', 'biopori', 'resapan'],
    a: 'Aksi kecil yang berdampak besar bisa dimulai dari membuang sampah pada tempatnya, ikut kerja bakti membersihkan selokan, menanam pohon, dan membuat **lubang resapan biopori** agar air hujan lebih cepat meresap ke tanah.',
  },
];

function jawabOffline(text) {
  const q = String(text || '').toLowerCase();
  let best = null; let score = 0;
  for (const item of KB) {
    const s = item.keys.reduce((n, k) => n + (q.includes(k) ? k.length : 0), 0);
    if (s > score) { score = s; best = item; }
  }
  if (best) return best.a;
  return 'Hmm, aku belum bisa menjawab itu dalam mode offline, euy. Coba tanyakan tentang **penyebab banjir**, **tas siaga**, **apa yang dilakukan saat banjir**, atau **cara membaca cuaca BMKG**.';
}

module.exports = { jawabOffline };
