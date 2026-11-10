// =============================================================
// Materi edukasi BanjirEuy (7 topik).
// Disusun ulang dari draf materi tim, dengan rujukan BNPB, BMKG, dan Kemenkes.
// Setiap materi terdiri dari beberapa "blok" yang ditampilkan dengan gaya berbeda:
//   teks   paragraf biasa             alur   langkah berurutan dengan garis penghubung
//   tab    pilihan interaktif         daftar ikon + judul + penjelasan
//   cek    dua kolom lakukan/hindari  fakta  sorotan "Tahukah Kamu?"
//   ingat  kutipan penting            simbol ikon cuaca BMKG
//   skala  kategori hujan harian      level  tingkatan peringatan dini BMKG
// =============================================================

/* Foto asli jenis banjir dari Wikimedia Commons (lisensi bebas, kredit wajib dicantumkan) */
const FILEPATH = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
export const FOTO_BANJIR = {
  genangan: { file: "VOA_People_walk_through_Jakarta%27s_flooded_streets.jpg", ket: 'Warga berjalan di jalanan Jakarta yang tergenang banjir, Januari 2013', kredit: 'VOA Indonesian Service', lisensi: 'Domain publik' },
  luapan: { file: 'Flood_in_Tanah_Laut_Regency.jpg', ket: 'Permukiman terendam banjir di Kabupaten Tanah Laut, Kalimantan Selatan, Januari 2021', kredit: 'BNPB', lisensi: 'Domain publik' },
  bandang: { file: 'Banjir_Bandang_Luwu_2020.png', ket: 'Material kayu dan lumpur sisa banjir bandang di Luwu Utara, Sulawesi Selatan, Juli 2020', kredit: 'BNPB', lisensi: 'Domain publik' },
  rob: { file: 'Rumah_Mak_Jah_di_Desa_Bedono_yang_Tenggelam_karena_abrasi.jpg', ket: 'Rumah di Desa Bedono, Demak, yang kini dikelilingi air laut', kredit: 'Tim LindungiHutan', lisensi: 'CC BY 4.0', lisensiUrl: 'https://creativecommons.org/licenses/by/4.0/' },
};
for (const f of Object.values(FOTO_BANJIR)) {
  f.src = `${FILEPATH}${f.file}?width=900`;
  f.halaman = `https://commons.wikimedia.org/wiki/File:${f.file}`;
}

export const SUMBER = {
  bnpb: { lembaga: 'BNPB', judul: 'Informasi dan edukasi kesiapsiagaan bencana, Badan Nasional Penanggulangan Bencana', url: 'https://bnpb.go.id' },
  inarisk: { lembaga: 'BNPB', judul: 'InaRISK, portal kajian risiko bencana Indonesia', url: 'https://inarisk.bnpb.go.id' },
  kemkesPedoman: { lembaga: 'Kementerian Kesehatan RI', judul: 'Pedoman Teknis Penanggulangan Krisis Kesehatan Akibat Bencana, Pusat Penanggulangan Krisis Kesehatan', url: 'https://pusatkrisis.kemkes.go.id/__pub/files76989Pedoman-Teknis-Penanggulangan-Krisis-Kesehatan-Akibat-Bencana.pdf' },
  kemkesLepto: { lembaga: 'Kementerian Kesehatan RI', judul: 'Kemenkes Siaga Penanggulangan Leptospirosis Pasca Bencana', tahun: '2025', url: 'https://www.kemkes.go.id/id/kemenkes-siaga-penanggulangan-leptospirosis-pasca-bencana' },
  bmkgPerban: { lembaga: 'BMKG', judul: 'Peraturan BMKG Nomor 9 Tahun 2022 tentang Penyediaan dan Penyebarluasan Peringatan Dini Cuaca Ekstrem', tahun: '2022', url: 'https://jdih.bmkg.go.id/common/dokumen/perbanno.9tahun2022.pdf' },
  bmkgDini: { lembaga: 'BMKG', judul: 'Peringatan Dini Cuaca (nowcasting)', url: 'https://www.bmkg.go.id/peringatan-dini' },
  bmkgData: { lembaga: 'BMKG', judul: 'Data Prakiraan Cuaca Terbuka', url: 'https://data.bmkg.go.id/prakiraan-cuaca/' },
};

export const MATERI = [
  {
    id: 'apa-itu',
    judul: 'Apa Itu Banjir?',
    icon: 'info',
    art: 'default',
    lead: 'Banjir adalah peristiwa ketika daratan terendam air karena volume air melebihi kemampuan wilayah itu untuk menampung atau mengalirkannya. Airnya bisa datang dari hujan deras, sungai yang meluap, atau air laut yang masuk ke daratan.',
    blok: [
      { tipe: 'teks', judul: 'Bukan hanya di dekat sungai', isi: 'Kawasan perkotaan juga bisa kebanjiran. Permukaan yang tertutup beton dan aspal membuat air hujan sulit meresap ke tanah, sehingga air mengalir di permukaan dan cepat memenuhi selokan.' },
      { tipe: 'alur', judul: 'Bagaimana banjir terjadi?', langkah: [
        ['cloudRain', 'Hujan turun', 'Awan menurunkan hujan ke permukaan bumi.'],
        ['droplet', 'Sebagian meresap', 'Air masuk ke dalam tanah melalui proses infiltrasi.'],
        ['waves', 'Sisanya mengalir', 'Air yang tidak meresap menjadi limpasan permukaan.'],
        ['layers', 'Menuju sungai', 'Limpasan masuk ke selokan, saluran drainase, dan sungai.'],
        ['alert', 'Air meluap', 'Saat volumenya melebihi kapasitas, air menggenangi daratan.'],
      ] },
      { tipe: 'tab', judul: 'Kenali jenis-jenis banjir', item: [
        ['building', 'Genangan', 'Air terkumpul karena tanah tidak mampu lagi menyerap dan saluran drainase tidak cukup menampung. Banjir jenis ini sering terjadi di kawasan perkotaan dan permukiman padat.', 'genangan'],
        ['waves', 'Luapan Sungai', 'Debit air sungai naik hingga melebihi kapasitas penampang sungai, lalu meluap ke daratan di sekitarnya. Pemicunya sering berupa hujan lebat di daerah hulu.', 'luapan'],
        ['mountain', 'Bandang', 'Banjir yang datang tiba-tiba dengan arus sangat deras. Airnya membawa lumpur, batu, dan kayu sehingga daya rusaknya tinggi. Biasanya terjadi di daerah lereng dan lembah sungai.', 'bandang'],
        ['droplet', 'Rob', 'Air laut masuk dan menggenangi daratan di wilayah pesisir, terutama ketika permukaan air laut sedang pasang. Genangan bisa makin parah bila bersamaan dengan hujan lebat.', 'rob'],
      ] },
      { tipe: 'fakta', isi: 'Banjir luapan sungai bisa terjadi walaupun tidak ada hujan di tempatmu. Hujan lebat di daerah hulu akan mengalir ke hilir dan membuat sungai meluap.' },
    ],
    sumber: ['bnpb', 'inarisk'],
  },
  {
    id: 'penyebab',
    judul: 'Penyebab Banjir',
    icon: 'search',
    art: 'penyebab',
    lead: 'Banjir hampir selalu terjadi karena gabungan faktor alam dan aktivitas manusia. Hujan memang pemicunya, tetapi kondisi lingkungan yang menentukan seberapa parah dampaknya.',
    blok: [
      { tipe: 'daftar', judul: 'Faktor alam', item: [
        ['cloudRain', 'Curah hujan tinggi', 'Hujan deras atau hujan yang berlangsung lama menghasilkan air lebih banyak daripada yang bisa diserap tanah dan dialirkan saluran.'],
        ['mountain', 'Bentuk permukaan bumi', 'Dataran rendah dan cekungan menjadi tempat berkumpulnya air yang mengalir dari daerah yang lebih tinggi.'],
        ['waves', 'Daerah aliran sungai', 'Wilayah yang menampung air hujan lalu mengalirkannya ke sungai utama. Saat debitnya naik, sungai bisa meluap.'],
        ['droplet', 'Pasang air laut', 'Air laut yang pasang menghambat aliran sungai menuju laut, sehingga genangan mudah terjadi di pesisir dan muara.'],
      ] },
      { tipe: 'daftar', judul: 'Faktor manusia', warna: 'oranye', item: [
        ['trash', 'Membuang sampah sembarangan', 'Sampah yang menumpuk menyumbat selokan dan gorong-gorong sehingga air hujan tertahan.'],
        ['tree', 'Penebangan hutan', 'Tanpa pepohonan, tanah kehilangan kemampuan menahan dan menyerap air hujan.'],
        ['building', 'Pembangunan tanpa resapan', 'Lahan yang tertutup beton dan aspal membuat air lebih banyak mengalir di permukaan.'],
        ['layers', 'Pendangkalan sungai', 'Endapan lumpur dan sampah mengurangi daya tampung sungai.'],
      ] },
      { tipe: 'teks', judul: 'Cuaca dan banjir dari sisi meteorologi', isi: 'Hujan lebat biasanya berasal dari awan konvektif seperti Cumulonimbus. Awan ini tumbuh subur ketika udara lembap, terjadi pertemuan angin atau konvergensi, serta dipengaruhi monsun dan gelombang atmosfer. Meski begitu, hujan lebat tidak selalu berarti banjir. Hasil akhirnya bergantung pada kondisi tanah, tutupan lahan, serta kapasitas sungai dan drainase.' },
      { tipe: 'ingat', isi: 'Prakiraan cuaca membantu kita bersiap, tetapi menjaga lingkungan dan kesiapsiagaan masyarakat tetap menjadi kunci untuk mengurangi risiko banjir.' },
    ],
    sumber: ['bnpb', 'bmkgData'],
  },
  {
    id: 'dampak',
    judul: 'Dampak Banjir',
    icon: 'alert',
    art: 'dampak',
    lead: 'Tingkat kerusakan akibat banjir bergantung pada kedalaman air, kecepatan arus, lama genangan, serta kondisi masyarakat dan lingkungan yang terdampak.',
    blok: [
      { tipe: 'tab', judul: 'Dampak dalam berbagai aspek', item: [
        ['users', 'Manusia', 'Banjir dapat menimbulkan korban jiwa dan luka-luka, memaksa warga mengungsi, mengganggu kegiatan belajar dan bekerja, serta meninggalkan rasa cemas dan trauma.'],
        ['heart', 'Kesehatan', 'Air banjir bercampur limbah rumah tangga, kotoran hewan, dan sampah. Kondisi ini memudahkan penyebaran berbagai penyakit, terutama di lokasi pengungsian yang padat.'],
        ['coins', 'Ekonomi', 'Rumah, kendaraan, dan barang berharga bisa rusak. Lahan pertanian gagal panen, usaha terhenti, dan biaya perbaikan jalan serta jembatan meningkat.'],
        ['tree', 'Lingkungan', 'Sumber air bersih tercemar, tanah terkikis, habitat makhluk hidup rusak, dan sampah serta lumpur menumpuk di permukiman.'],
      ] },
      { tipe: 'daftar', judul: 'Penyakit yang perlu diwaspadai', item: [
        ['droplet', 'Diare', 'Muncul akibat minum air atau makan makanan yang tercemar air banjir.'],
        ['bug', 'Leptospirosis', 'Infeksi bakteri Leptospira yang menular lewat air, lumpur, atau tanah yang tercemar urine tikus.'],
        ['shield', 'Penyakit kulit', 'Timbul karena kulit terlalu lama terpapar air kotor dan lingkungan yang tidak bersih.'],
        ['wind', 'ISPA', 'Infeksi saluran pernapasan yang mudah menyebar di pengungsian yang padat dan lembap.'],
        ['heart', 'Demam berdarah', 'Genangan sisa banjir bisa menjadi tempat berkembang biak nyamuk penular DBD.'],
      ] },
      { tipe: 'fakta', isi: 'Arus air setinggi kira-kira 15 cm saja sudah bisa membuat orang dewasa kehilangan keseimbangan. Jangan pernah meremehkan genangan yang mengalir.' },
      { tipe: 'ingat', isi: 'Banjir bukan hanya soal air yang masuk ke rumah. Dampaknya bisa berlanjut lama setelah air surut, terutama pada kesehatan, ekonomi, dan lingkungan.' },
    ],
    sumber: ['kemkesLepto', 'kemkesPedoman', 'bnpb'],
  },
  {
    id: 'sebelum',
    judul: 'Sebelum Banjir',
    icon: 'clipboard',
    art: 'sebelum',
    lead: 'Kesiapsiagaan sebelum banjir adalah langkah paling penting untuk melindungi diri dan keluarga. Semakin siap kamu, semakin kecil risikonya.',
    blok: [
      { tipe: 'daftar', judul: 'Kenali risiko di sekitarmu', item: [
        ['home', 'Lokasi tempat tinggal', 'Cek apakah rumah dan sekolahmu berada di dataran rendah atau dekat sungai.'],
        ['clock', 'Riwayat banjir', 'Cari tahu wilayah mana saja yang pernah tergenang sebelumnya.'],
        ['mapPin', 'Jalur evakuasi', 'Ketahui rute menuju tempat yang lebih tinggi dan lokasi pengungsian terdekat.'],
        ['phone', 'Kontak darurat', 'Simpan nomor darurat dan kontak petugas setempat di ponsel dan di kertas.'],
      ] },
      { tipe: 'cek', judul: 'Kebiasaan yang mengurangi risiko banjir',
        lakukan: ['Membersihkan selokan secara rutin', 'Menjaga pohon dan tanaman di sekitar rumah', 'Membuat sumur resapan atau lubang biopori', 'Menyimpan dokumen penting di wadah kedap air', 'Memantau prakiraan cuaca dan peringatan dini BMKG'],
        hindari: ['Membuang sampah ke sungai dan selokan', 'Menutup seluruh halaman dengan semen', 'Menunggu air masuk rumah baru mulai bersiap'] },
      { tipe: 'alur', judul: 'Susun rencana evakuasi keluarga', langkah: [
        ['users', 'Titik kumpul', 'Sepakati tempat bertemu bila anggota keluarga terpisah.'],
        ['arrowUp', 'Jalur aman', 'Tentukan rute menuju tempat yang lebih tinggi.'],
        ['heart', 'Bantu yang rentan', 'Bagi tugas untuk membantu anak kecil, lansia, dan penyandang disabilitas.'],
        ['phone', 'Cara berkabar', 'Siapkan cara saling menghubungi saat jaringan terganggu.'],
      ] },
      { tipe: 'teks', judul: 'Siapkan tas siaga', isi: 'Tas siaga berisi kebutuhan penting untuk bertahan sementara saat harus mengungsi, seperti air minum, makanan tahan lama, obat pribadi, kotak P3K, senter, power bank, pakaian ganti, dokumen penting, peluit, dan masker.', tautan: ['#/starter-pack', 'Buka checklist Starter Pack'] },
      { tipe: 'fakta', isi: 'Program Satuan Pendidikan Aman Bencana (SPAB) mendorong setiap sekolah memiliki rencana kesiapsiagaan, jalur evakuasi, dan latihan rutin. Kamu bisa ikut menggerakkannya di sekolahmu.' },
    ],
    sumber: ['bnpb', 'inarisk'],
  },
  {
    id: 'saat',
    judul: 'Saat Banjir',
    icon: 'life',
    art: 'saat',
    lead: 'Saat banjir datang, keselamatan jiwa adalah prioritas utama. Jangan mengambil risiko hanya untuk menyelamatkan barang.',
    blok: [
      { tipe: 'cek', judul: 'Yang harus dilakukan dan dihindari',
        lakukan: ['Tetap tenang dan perhatikan kondisi sekitar', 'Ikuti arahan petugas dan informasi resmi', 'Segera menuju tempat tinggi saat air mulai naik', 'Matikan listrik dari tempat yang aman bila memungkinkan', 'Bawa tas siaga dan bantu orang yang membutuhkan'],
        hindari: ['Bermain atau berenang di air banjir', 'Mendekati kabel dan tiang listrik', 'Menerobos jalan yang tergenang', 'Mendekati sungai dan saluran terbuka'] },
      { tipe: 'alur', judul: 'Kalau kamu terjebak banjir', langkah: [
        ['arrowUp', 'Naik ke tempat tinggi', 'Cari lantai atas, atap yang kokoh, atau bangunan yang lebih tinggi.'],
        ['phone', 'Minta bantuan', 'Hubungi 112 atau 115 bila sinyal tersedia.'],
        ['bell', 'Beri tanda', 'Gunakan peluit, senter, atau kain berwarna terang agar terlihat penolong.'],
        ['x', 'Jangan menyeberang', 'Jangan mencoba melewati arus deras sendirian.'],
        ['clock', 'Tunggu penolong', 'Tetap di tempat aman sampai petugas datang.'],
      ] },
      { tipe: 'fakta', isi: 'Lubang selokan dan gorong-gorong yang tertutup air tidak terlihat dari permukaan. Itulah sebabnya berjalan di genangan banjir sangat berbahaya, walau airnya tampak tenang.' },
      { tipe: 'ingat', isi: 'Jangan kembali ke rumah atau daerah terdampak sebelum dinyatakan aman oleh petugas yang berwenang.' },
    ],
    sumber: ['bnpb'],
  },
  {
    id: 'setelah',
    judul: 'Setelah Banjir',
    icon: 'wrench',
    art: 'setelah',
    lead: 'Air sudah surut bukan berarti lingkungan langsung aman. Masih ada risiko bangunan rusak, instalasi listrik yang berbahaya, air tercemar, dan penyakit.',
    blok: [
      { tipe: 'alur', judul: 'Urutan kembali ke rumah', langkah: [
        ['info', 'Tunggu kabar aman', 'Pastikan ada informasi resmi bahwa wilayahmu sudah aman.'],
        ['home', 'Periksa bangunan', 'Waspadai retakan pada dinding, lantai, dan atap.'],
        ['zap', 'Cek listrik dan gas', 'Minta orang yang ahli memeriksa sebelum dinyalakan.'],
        ['shield', 'Bersihkan dengan aman', 'Gunakan sepatu bot, sarung tangan karet, dan masker.'],
        ['sun', 'Pulihkan bertahap', 'Kembalikan kegiatan sekolah dan kerja secara perlahan.'],
      ] },
      { tipe: 'daftar', judul: 'Jaga kesehatan setelah banjir', item: [
        ['droplet', 'Gunakan air bersih', 'Jangan langsung memakai air sumur yang terendam banjir. Gunakan air kemasan atau air yang sudah diolah dengan benar.'],
        ['shield', 'Cuci tangan dengan sabun', 'Lakukan setiap selesai bersih-bersih atau menyentuh benda yang terkena air banjir.'],
        ['trash', 'Buang makanan yang terendam', 'Makanan yang terkena air banjir tidak aman untuk dikonsumsi.'],
        ['heart', 'Periksa bila sakit', 'Segera ke fasilitas kesehatan bila demam, diare, atau luka terinfeksi setelah terpapar air banjir.'],
        ['bug', 'Berantas sarang nyamuk', 'Bersihkan genangan dan wadah yang bisa menampung air hujan.'],
      ] },
      { tipe: 'fakta', isi: 'Menurut Kemenkes, leptospirosis dapat menular melalui air, lumpur, tanah, atau makanan yang tercemar, kondisi yang umum ditemukan setelah banjir. Pakai alas kaki dan sarung tangan saat membersihkan rumah.' },
      { tipe: 'ingat', isi: 'Setelah lingkungan aman, saling bantu tetangga dan teman yang masih membutuhkan pertolongan. Pemulihan akan lebih cepat bila dilakukan bersama.' },
    ],
    sumber: ['kemkesLepto', 'kemkesPedoman', 'bnpb'],
  },
  {
    id: 'cuaca',
    judul: 'Membaca Info Cuaca',
    icon: 'cloudRain',
    art: 'cuaca',
    lead: 'Prakiraan cuaca adalah gambaran kondisi atmosfer yang diperkirakan terjadi di suatu wilayah dalam periode tertentu. Dengan membacanya, kamu bisa bersiap sebelum hujan lebat datang.',
    blok: [
      { tipe: 'simbol', judul: 'Mengenal simbol cuaca', item: [[0, 'Cerah'], [1, 'Cerah berawan'], [3, 'Berawan'], [60, 'Hujan ringan'], [63, 'Hujan lebat'], [95, 'Hujan petir']], catatan: 'Simbol di atas adalah gambaran edukatif. Tampilan simbol pada produk BMKG bisa sedikit berbeda.' },
      { tipe: 'skala', judul: 'Seberapa lebat hujannya?', isi: 'Curah hujan diukur dalam milimeter (mm). Hujan 1 mm berarti setiap satu meter persegi tanah menerima satu liter air. Bedakan intensitas per jam dengan jumlah dalam sehari. Hujan 10 mm per jam terkumpul dalam satu jam, sedangkan 50 mm per hari terkumpul selama 24 jam.' },
      { tipe: 'level', judul: 'Tingkatan peringatan dini cuaca ekstrem', isi: 'BMKG menandai setiap tingkatan peringatan dini dengan warna. Baca peringatan bersama wilayah terdampak, jenis fenomena, dan periode berlakunya. Warna menunjukkan tingkat peringatan, bukan kedalaman banjir.' },
      { tipe: 'alur', judul: 'Cara membaca prakiraan BMKG', langkah: [
        ['search', 'Buka sumber resmi', 'Gunakan situs atau aplikasi Info BMKG, atau halaman Pantau Cuaca.'],
        ['mapPin', 'Pilih wilayah', 'Tentukan kelurahan atau desa yang ingin kamu ketahui.'],
        ['clock', 'Lihat waktunya', 'Perhatikan prakiraan pada tanggal dan jam tertentu.'],
        ['cloudRain', 'Cek potensi hujan', 'Perhatikan jam hujan dan jumlah curah hujannya.'],
        ['bell', 'Periksa peringatan', 'Lihat apakah ada peringatan dini untuk wilayahmu.'],
      ] },
      { tipe: 'ingat', isi: 'Prakiraan hujan bukan kepastian banjir. Padukan dengan kondisi sungai, drainase, dan informasi dari BPBD setempat untuk menilai risikonya.' },
    ],
    sumber: ['bmkgPerban', 'bmkgDini', 'bmkgData', 'inarisk'],
  },
];
