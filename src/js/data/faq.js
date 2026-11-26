/** Data FAQ. `kategori` dipakai untuk filter chip; `kata` untuk pencarian. */
export const KATEGORI_FAQ = [
  { id: 'all', label: 'Semua Pertanyaan', icon: 'apps' },
  { id: 'pencari', label: 'Pencari Kos & Mahasiswa', icon: 'school' },
  { id: 'survei', label: 'Survei & Booking', icon: 'calendar_month' },
  { id: 'biaya', label: 'Biaya & Transaksi', icon: 'payments' },
  { id: 'mitra', label: 'Pemilik Kos & Mitra', icon: 'real_estate_agent' },
  { id: 'keamanan', label: 'Keamanan & Fasilitas', icon: 'verified_user' },
];

export const FAQ = [
  { warna: 'yellow', kategori: ['biaya', 'pencari'], kata: 'biaya admin perantara gratis potongan komisi tarif murah uang',
    tanya: 'Apakah mencari kos di KostKu Madiun dikenakan biaya perantara atau admin?',
    jawab: '<strong>Tidak.</strong> Layanan KostKu Madiun gratis tanpa biaya admin atau potongan untuk pencari kos. Anda langsung terhubung ke WhatsApp resmi pemilik atau pengelola kos tanpa perantara.',
    catatan: 'Harga sewa yang Anda bayarkan sesuai tarif dari pemilik kos.' },
  { warna: 'mint', kategori: ['keamanan', 'survei'], kata: 'foto asli verifikasi nyata survei fisik unipma poltek madiun',
    tanya: 'Apakah foto dan informasi kamar di KostKu Madiun benar-benar asli?',
    jawab: 'Tim KostKu Madiun melakukan survei langsung ke kos yang bertanda <span class="tag tag--tersedia">Foto Terverifikasi</span>. Foto diambil dari kondisi fisik kamar, kamar mandi, dan fasilitas bersama di sekitar UNIPMA, Poltek Madiun, dan area kota.' },
  { warna: 'purple', kategori: ['survei', 'pencari'], kata: 'survei langsung lokasi janji temu video call chat pemilik whatsapp',
    tanya: 'Bagaimana cara melakukan survei langsung ke lokasi kos?',
    jawab: 'Klik tombol <strong>Chat Pemilik via WhatsApp</strong> pada halaman detail kos. Anda bisa membuat janji survei langsung atau meminta video call bersama pemilik kos.' },
  { warna: 'pink', kategori: ['biaya', 'keamanan'], kata: 'uang muka dp transfer rekening bank transaksi bayar aman',
    tanya: 'Apakah KostKu Madiun melayani pembayaran transfer uang muka (DP)?',
    jawab: 'KostKu Madiun tidak pernah meminta transfer uang sewa atau DP ke rekening pengelola aplikasi. Kesepakatan sewa dan pembayaran DP dilakukan langsung antara penyewa dan pemilik kos setelah survei lokasi.' },
  { warna: 'yellow', kategori: ['pencari', 'keamanan'], kata: 'kategori putri putra pasutri campuran fasilitas ac wifi kamar mandi dalam',
    tanya: 'Apakah ada pilihan kos khusus putri, putra, atau pasutri/campuran?',
    jawab: 'Ada. Filter kos berdasarkan kategori penghuni (Putri, Putra, Campuran) di halaman <a href="kos.html">Cari Kos</a>, lengkap dengan fasilitas seperti AC, kamar mandi dalam, dan Wi-Fi.' },
  { warna: 'mint', kategori: ['mitra'], kata: 'daftarkan pemilik mitra pasang iklan sewa kamar kostku',
    tanya: 'Bagaimana cara mendaftarkan kos saya agar tampil di KostKu Madiun?',
    jawab: 'Pemilik kos dapat mengajukan lewat halaman <a href="pemilik.html">Untuk Pemilik Kos</a> atau menghubungi admin WhatsApp kami. Pengajuan dan pemeriksaan gratis; biaya mitra dibayar setelah pengajuan disetujui.' },
];
