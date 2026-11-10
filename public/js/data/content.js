// =============================================================
// Konten edukasi BanjirEuy (materi, simulasi, kuis, checklist).
// Disusun dari panduan umum kesiapsiagaan bencana (BNPB, BMKG,
// program Satuan Pendidikan Aman Bencana/SPAB) dalam bahasa siswa.
// =============================================================

// Materi edukasi dipindah ke materi.js agar mudah diedit
export { MATERI, SUMBER } from './materi.js';

export const SIMULASI = [
  {
    scene: { place: 'rumah', water: 0 },
    tag: 'SITUASI 1 · DI RUMAH',
    cerita: 'Sore hari kamu sedang di rumah. BMKG mengeluarkan peringatan dini hujan lebat untuk wilayahmu dalam beberapa jam ke depan, dan rumahmu tidak jauh dari sungai. Apa yang kamu lakukan?',
    opsi: [
      { t: 'Santai saja karena sekarang belum hujan.', alasan: 'Peringatan dini justru memberi waktu untuk bersiap. Kalau menunggu air datang, waktumu untuk bersiap jadi jauh lebih sedikit.' },
      { t: 'Menyiapkan tas siaga, menyimpan dokumen penting di plastik kedap air, dan memantau info resmi bersama keluarga.', benar: true, alasan: 'Tepat! Siapkan barang penting sejak awal, sepakati titik kumpul keluarga, dan pantau kabar dari BMKG serta BPBD setempat.' },
      { t: 'Langsung meneruskan pesan peringatan ke semua grup tanpa membaca sumbernya.', alasan: 'Pastikan dulu informasinya dari sumber resmi seperti BMKG. Pesan berantai yang tidak jelas sumbernya bisa membuat orang lain panik.' },
    ],
  },
  {
    scene: { place: 'sekolah', water: .28 },
    tag: 'SITUASI 2 · DI SEKOLAH',
    cerita: 'Hujan deras sudah berlangsung lama dan air mulai masuk ke area sekolah saat jam pelajaran. Apa yang kamu lakukan?',
    opsi: [
      { t: 'Tetap tenang di kelas dan mengikuti arahan guru.', benar: true, alasan: 'Tepat! Guru dan tim siaga sekolah punya informasi dan rencana evakuasi. Tetap bersama rombongan dan ikuti arahan resmi.' },
      { t: 'Langsung pulang sendiri melewati area yang tergenang.', alasan: 'Berbahaya. Genangan bisa menyembunyikan lubang atau selokan, dan arusnya bisa lebih kuat dari perkiraan.' },
      { t: 'Mengajak teman-teman bermain air di halaman.', alasan: 'Air banjir kotor, bisa membawa penyakit, dan berisiko arus serta sengatan listrik.' },
    ],
  },
  {
    scene: { place: 'jalan', water: .38, car: true },
    tag: 'SITUASI 3 · DI JALAN',
    cerita: 'Dalam perjalanan pulang, jalan di depanmu tergenang setinggi lutut dan arusnya cukup deras. Teman mengajakmu menerobos dengan motor.',
    opsi: [
      { t: 'Ikut menerobos karena rumah sudah dekat.', alasan: 'Kendaraan bisa mogok atau terseret arus, dan lubang jalan tidak terlihat di bawah air.' },
      { t: 'Menolak, menunggu di tempat yang lebih tinggi, mencari rute lain, dan mengabari keluarga.', benar: true, alasan: 'Keputusan bijak! Air setinggi lutut yang mengalir deras sudah bisa menjatuhkan orang dan menyeret motor. Lebih baik terlambat sampai rumah daripada celaka.' },
      { t: 'Berjalan kaki sambil menuntun motor teman.', alasan: 'Tetap berisiko tinggi terseret arus. Genangan yang mengalir deras sebaiknya tidak dilewati sama sekali.' },
    ],
  },
  {
    scene: { place: 'rumah', water: .32, night: true, lightning: true },
    tag: 'SITUASI 4 · DI RUMAH SAAT MALAM',
    cerita: 'Malam hari air mulai masuk ke dalam rumah dan terus naik. Lampu masih menyala dan banyak barang elektronik tercolok. Apa yang paling tepat?',
    opsi: [
      { t: 'Mencabut colokan satu per satu sambil berdiri di genangan air.', alasan: 'Sangat berbahaya. Menyentuh listrik saat berdiri di air bisa menyebabkan sengatan fatal.' },
      { t: 'Menunggu sampai air setinggi pinggang baru bersiap pergi.', alasan: 'Terlambat. Makin tinggi air, makin sulit dan berbahaya untuk berpindah, apalagi di malam hari.' },
      { t: 'Mematikan listrik dari sakelar utama selama tangan dan lantai masih kering, lalu pindah ke tempat tinggi atau evakuasi bersama keluarga.', benar: true, alasan: 'Benar! Matikan listrik hanya jika aman dilakukan. Bawa tas siaga, ikuti arahan petugas, dan menuju tempat evakuasi bila diminta.' },
    ],
  },
  {
    scene: { place: 'rumah', water: 0, sun: true, mud: true },
    tag: 'SITUASI 5 · SETELAH SURUT',
    cerita: 'Banjir sudah surut dan warga sekitar rumahmu bergotong royong membersihkan rumah dan jalan yang penuh lumpur. Bagaimana caramu ikut membantu dengan aman?',
    opsi: [
      { t: 'Bersih-bersih tanpa alas kaki agar tidak licin.', alasan: 'Lumpur bisa mengandung benda tajam dan bakteri penyebab leptospirosis. Selalu pakai alas kaki tertutup.' },
      { t: 'Langsung menyalakan semua lampu dan kipas agar rumah cepat kering.', alasan: 'Instalasi listrik harus diperiksa dulu oleh petugas atau orang yang ahli sebelum dinyalakan kembali.' },
      { t: 'Memakai sepatu bot, sarung tangan, dan masker, lalu mencuci tangan dengan sabun setelahnya.', benar: true, alasan: 'Hebat! Alat pelindung diri dan kebersihan mencegah luka dan penyakit setelah banjir.' },
    ],
  },
];

export const KUIS = [
  {
    q: 'Apa tindakan yang tepat saat terjadi banjir di sekolah?',
    o: ['Bermain di genangan air karena aman.', 'Mengikuti arahan guru dan menuju titik aman.', 'Tetap berada di area yang sudah tergenang.'],
    a: 1, e: 'Guru dan tim siaga sekolah mengetahui jalur evakuasi dan titik aman. Mengikuti arahan resmi adalah langkah paling aman.', art: { water: .6 },
  },
  {
    q: 'Manakah yang BUKAN merupakan penyebab banjir?',
    o: ['Saluran air tersumbat sampah.', 'Banyaknya pohon dan daerah resapan air.', 'Hujan lebat yang berlangsung lama.'],
    a: 1, e: 'Pohon dan daerah resapan justru membantu air meresap ke tanah sehingga mengurangi risiko banjir.', art: { water: .4 },
  },
  {
    q: 'Lembaga resmi yang mengeluarkan prakiraan cuaca dan peringatan dini cuaca di Indonesia adalah…',
    o: ['BMKG', 'BPS', 'KPU'],
    a: 0, e: 'BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) adalah lembaga resmi untuk informasi cuaca, iklim, dan gempa bumi.', art: { cuaca: true },
  },
  {
    q: 'Menurut kategori BMKG, curah hujan 60 mm dalam sehari termasuk hujan…',
    o: ['Ringan', 'Sedang', 'Lebat'],
    a: 2, e: 'Hujan harian dikategorikan ringan bila 5–20 mm, sedang bila 20–50 mm, dan lebat bila 50–100 mm. Jadi 60 mm termasuk hujan lebat.', art: { cuaca: true },
  },
  {
    q: 'Barang mana yang paling penting dimasukkan ke dalam tas siaga?',
    o: ['Konsol game dan kaset favorit.', 'Senter, obat pribadi, dan dokumen penting dalam plastik kedap air.', 'Semua buku pelajaran satu semester.'],
    a: 1, e: 'Tas siaga berisi barang yang membantu kamu bertahan saat darurat, seperti penerangan, obat, dokumen, makanan, dan air.', art: { tas: true },
  },
  {
    q: 'Mengapa berjalan menerobos genangan banjir yang mengalir berbahaya?',
    o: ['Karena air banjir selalu hangat.', 'Karena arus bisa menyeret dan lubang/selokan tidak terlihat.', 'Karena sepatu menjadi kotor.'],
    a: 1, e: 'Arus setinggi kira-kira 15 cm saja sudah bisa membuat orang kehilangan keseimbangan, dan lubang di bawah air tidak terlihat.', art: { water: .5 },
  },
  {
    q: 'Kamu melihat kabel listrik terendam genangan. Apa yang harus dilakukan?',
    o: ['Menjauh dan segera melapor ke guru/petugas.', 'Menyentuhnya dengan kayu basah.', 'Memotretnya dari dekat untuk media sosial.'],
    a: 0, e: 'Air menghantarkan listrik. Jaga jarak, peringatkan orang lain, dan laporkan agar aliran listrik diputus oleh petugas.', art: { water: .45 },
  },
  {
    q: 'Penyakit apa yang dapat menyebar melalui air atau lumpur yang tercemar kencing tikus setelah banjir?',
    o: ['Leptospirosis', 'Cacar air', 'Rabun jauh'],
    a: 0, e: 'Leptospirosis disebabkan bakteri Leptospira dari urin hewan seperti tikus. Gunakan alas kaki tertutup dan tutup luka.', art: { sun: true },
  },
  {
    q: 'Nomor telepon darurat terpadu di Indonesia adalah…',
    o: ['110', '112', '150'],
    a: 1, e: '112 adalah nomor panggilan darurat terpadu. Selain itu ada 115 (Basarnas) dan 117 (BNPB).', art: { water: .3 },
  },
  {
    q: 'Aksi nyata yang bisa kamu lakukan untuk mengurangi risiko banjir di lingkungan sekitar adalah…',
    o: ['Membuang sampah ke selokan agar cepat hilang.', 'Membuat lubang resapan biopori dan rutin membersihkan saluran air.', 'Menutup seluruh halaman dan taman dengan beton.'],
    a: 1, e: 'Biopori menambah resapan air ke tanah, dan saluran bersih membuat air hujan mengalir lancar.', art: { sun: true },
  },
];

export const CHECKLIST = [
  { kat: 'Kebutuhan Pribadi', items: [
    ['baju', 'Pakaian ganti', 'Minimal 1 set, simpan dalam plastik'],
    ['jas', 'Jas hujan atau payung', 'Lebih aman jas hujan agar tangan bebas'],
    ['obat', 'Obat-obatan pribadi', 'Obat rutin, minyak angin, plester'],
    ['masker', 'Masker & hand sanitizer', 'Mencegah penyakit pascabanjir'],
    ['sandal', 'Sandal / sepatu karet', 'Alas kaki tertutup untuk berjalan'],
  ] },
  { kat: 'Bertahan & Komunikasi', items: [
    ['senter', 'Senter dan baterai cadangan', 'Listrik sering padam saat banjir'],
    ['makan', 'Makanan dan minuman tahan lama', 'Biskuit, roti kering, air mineral'],
    ['power', 'Power bank', 'Terisi penuh, beserta kabelnya'],
    ['peluit', 'Peluit', 'Untuk memberi tanda minta tolong'],
    ['kontak', 'Daftar nomor darurat', 'Ditulis di kertas, jangan hanya di HP'],
  ] },
  { kat: 'Dokumen & Lainnya', items: [
    ['dok', 'Dokumen penting (dalam plastik kedap air)', 'Kartu pelajar, fotokopi KK, rapor'],
    ['p3k', 'Kotak P3K kecil', 'Kasa, antiseptik, perban'],
    ['uang', 'Uang tunai secukupnya', 'ATM bisa tidak berfungsi'],
    ['plastik', 'Kantong plastik / dry bag', 'Melindungi barang elektronik'],
  ] },
];

export const LENCANA = [
  { id: 'pembelajar', nama: 'Pembelajar Banjir', desc: 'Selesaikan semua materi edukasi', art: 'book' },
  { id: 'siaga', nama: 'Siap Siaga', desc: 'Lengkapi checklist tas siaga', art: 'bag' },
  { id: 'simulasi', nama: 'Pengambil Keputusan', desc: 'Skor simulasi minimal 4/5', art: 'map' },
  { id: 'kuis', nama: 'Juara Kuis', desc: 'Skor kuis minimal 80', art: 'medal' },
  { id: 'cuaca', nama: 'Pemantau Cuaca', desc: 'Cek dashboard cuaca BMKG', art: 'cloud' },
  { id: 'aksi', nama: 'Agen Aksi Nyata', desc: 'Ucapkan janji siaga banjir', art: 'hand' },
];

// Kode wilayah tingkat IV (kelurahan/desa) yang sudah diverifikasi di situs BMKG.
export const LOKASI_PRESET = [
  { adm4: '31.71.01.1001', nama: 'Gambir, Jakarta Pusat' },
  { adm4: '32.73.12.1001', nama: 'Gumuruh, Kota Bandung' },
  { adm4: '33.74.03.1001', nama: 'Kemijen, Kota Semarang' },
  { adm4: '35.78.04.1001', nama: 'Wonokromo, Kota Surabaya' },
];

// ---------------------------------------------------------------
// TENTANG KAMI — silakan ganti dengan data tim kalian.
// foto: taruh file di public/assets/img/tim/ lalu isi path-nya,
//       contoh: 'assets/img/tim/rafi.jpg'. Kosongkan ('') untuk foto inisial.
// ---------------------------------------------------------------
export const TIM = [
  { nama: 'Anceli Anggi Putri Br Sidabalok', asal: 'Meteorologi · ITB', foto: 'assets/img/tim/anceli.jpg' },
  { nama: 'Bulan Ayu Azzahra', asal: 'Meteorologi · ITB', foto: 'assets/img/tim/bulan.jpg' },
  { nama: 'Arzhella Alvyana Alcaf', asal: 'Meteorologi · ITB', foto: 'assets/img/tim/arzhella.jpg' },
  { nama: 'Yuriko Zulaikha Alhaz', asal: 'Meteorologi · ITB', foto: 'assets/img/tim/yuriko.jpg' },
];
