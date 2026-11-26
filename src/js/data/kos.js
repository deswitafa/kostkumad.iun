/**
 * Data statis 6 listing kos (MVP tanpa backend).
 * Bentuk data mengikuti 04-schema.md. Foto sementara memakai URL ilustrasi;
 * ganti dengan file di /assets/images/ saat foto asli tersedia.
 */
const FOTO = {
  ichi: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDHpkqtXMi92quYBfMc4L2hUPMjLZuRnbqymMjbA-2mVD35FOY5TcCEAK1fbZnoXIoT1myNTodScidxV-Y5s9ds42xAbEjLUpB0atW36yA1IfnOYO9fvzFJFKBB0FQx0EjecmPhOqztPnDYryLUer3e4iC5x4fZtfvOUF89wbuScd3R5WCtuYBKWrMFV8VuXy_YjrStF0X4esKLnvhlKIuR_pdl1Z8PungLPbB1_ns',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBG1kHiX_1-yt2vgtjFN3PDQn7ftQzwLQxdGRp27ngwZppvT-pORLfeaO5hBRmWSBC90ltEXAEfGs3TbqLdT9WmlZPFTs8Zd_affvP6zihoQgDjZZdluIrw_f0IyEa5fgcGtF6gXkw9_9NuEdayDrYcMZvDvjCVZ1HmRLBE9hRwK3V-iHI7CtsYDlZt9rMyVVmuJUIhTzQFHRX7gkOgqPoue1llgzxhOdztVd_NWtA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3SjNLAWQUSEQhI4g_R0FocPufz2qUlU3COxrpCI9PljV8V7qdffv-9UXLzELsbd55nwfnFpnY0msUewoa11WOCJfsGiOI35Ujn5TDbBCjLNNXSoABiOnjS7PpKo_WpXopV_jwufQz0EGlAIlMI9PsDw6vM-aY18do8WerCR0OuLI_RnDw4-XdUziiogJQl__nyeO7Pe8nVzGjKD3lpDyLK3i_86-OAMbp4Fb2ZWM',
  ],
  buNing: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDTf6crbxtUVU8GdIokXSa8_X98YwBlep6d46PYx1IH1ky_eFx45aOmwQoI38ZxUPA1juPzajyWJ25ntFEqBFVQpaccWaiIbELm_dpuHaNVwT_wZpqEtDvaniaGcPCJ1LRFiwT2_VpFd2HzjO723LOeg6c4oDzJYrguPBXq6EL3I7AFLXbVESM7yh2PlHhT4vTVRpOZnaOwFHBRcYXh6cVkcl-C5RlQwAeBWpqxOU0'],
  griya: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB_BUTZcstYZrrLDjg30fiCM3bM_B549cCySYMkI5xbgys77vK_mK08v_yo0aCXNHdfApkjovzCjvXBC_yLlaZO7HSkPQQfsBugamuVKxVvtODq6jjIhdkV13dkhbN9fm6iOvFOPicgjD_E3S_dipGy6WylUHLP_Ra0gZXtcdw4JT3-YpB0ZB5PlZHT8kb1Lp1o229j_ylzyiFyy4CiDk1hwThPUFti5Ml7c5oAc1o'],
  ringRoad: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA7gDxIbQimlLuNO1-JqmVt8c7JPZ1Az-fhB5bPZOEYkCBed_mP3KEXh8iREM3d_VXGnlGhf_bfMBC1EDlkLTSzkCIR_Yhj4Jj2byFJGA6dobVoTC8aWPDTdemtyNCpAuAIx65GrbreeO-bCX8pLt_zpHQjHQGAiYFD9c4iKhE--fXS7Oi3bs0ji1bptlj-OA7PKXyMjc-PW-10bYwzP8k8cNfYw7Au1YWNONVKBgc'],
  melati: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDlCIXQjW_fXf2f21TP8stRJLJPV1KDjWy7h4RSW9ZULNgjvxA-aLktcMl_peq6ni0YE3tKW-AGDqzLMqoy-NZDf-fBwCk6J7a7LoxVQhFyZXkniLeWzjxl18415wGHFrMeZ4jXA_Kzsha9Pyd3XOaz40yrgJCP5_JS4H6kCTlninr-bMOxToi3OaImOCNHeFqIdiKme2LPvbT7-FUFHQEaJHjn4QUKxjpO3Y3ZWtE'],
  poltek: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDul7IWHaiAwQolEn5qSmG0akpWpzyOtNKU6z8no6_jYj-niXQvEY1Fp7gWHJ3D-0aNyFBjFK2gZyNp2d99NHdHb4sWqqnAUnLc10TqageCpm8bdjEVsYcMxSKYf8AEoNS1kseQKNtrOAhFtC6-WPPyFUJLUKbLt3lwpjRby10xxmZWtS28ASIN6bRf992-IRrvM2RE51al7rxmJeg3AN__WlTFG2AUOXKr94uCsf8'],
};

/** Katalog fasilitas: label tampilan, ikon Material Symbols, dan keterangan singkat. */
export const FASILITAS = {
  ac: { label: 'AC', icon: 'ac_unit', ket: 'Pendingin ruangan' },
  'kamar-mandi-dalam': { label: 'Kamar Mandi Dalam', icon: 'shower', ket: 'Kloset duduk & shower' },
  wifi: { label: 'Wi-Fi', icon: 'wifi', ket: 'Internet untuk kuliah & kerja' },
  kasur: { label: 'Kasur Springbed', icon: 'bed', ket: 'Lengkap dengan bantal' },
  lemari: { label: 'Lemari Pakaian', icon: 'checkroom', ket: 'Penyimpanan pribadi' },
  'meja-belajar': { label: 'Meja Belajar', icon: 'desk', ket: 'Meja & kursi belajar' },
  dapur: { label: 'Dapur Bersama', icon: 'countertops', ket: 'Dapur & peralatan dasar' },
  parkir: { label: 'Parkir', icon: 'two_wheeler', ket: 'Area parkir penghuni' },
  'water-heater': { label: 'Water Heater', icon: 'hot_tub', ket: 'Air hangat' },
  tv: { label: 'TV', icon: 'tv', ket: 'TV di kamar / ruang bersama' },
};

/** Detail tambahan bila sebuah kos belum punya `detail` sendiri. */
export const DETAIL_BAWAAN = {
  ukuran: '3 x 3 Meter',
  listrik: 'Hubungi pemilik',
  gerbang: 'Sesuai aturan kos',
  keamanan: 'Lingkungan aman',
  termasuk: 'Tanyakan rincian tagihan ke pemilik',
  deskripsi: [
    'Hunian nyaman dan terawat di Kota Madiun. Informasi lengkap seperti aturan tamu, jam malam, dan rincian tagihan dapat Anda tanyakan langsung ke pemilik lewat WhatsApp.',
  ],
  fasilitasLain: [],
  tataTertib: [{ judul: 'Aturan Kos', isi: 'Tanyakan aturan tamu, jam malam, dan hewan peliharaan langsung ke pemilik.' }],
  jarak: [],
  ulasan: [],
};

export const KOS_LIST = [
  {
    id: 'ichi-kost-putri',
    nama: 'ICHI Kost Putri Madiun',
    tipe: 'Putri',
    area: 'Kartoharjo',
    alamat: 'Jl. Thamrin Gg. Rajawali No. 14, Kec. Kartoharjo, Kota Madiun',
    lokasiSingkat: 'Kec. Kartoharjo, 5 menit ke UNIPMA Kampus 1',
    tagLokasi: ['kartoharjo', 'unipma'],
    harga: { harian: 90000, bulanan: 850000, tahunan: 9500000 },
    sisaKamar: 3,
    fasilitas: ['ac', 'kamar-mandi-dalam', 'kasur', 'wifi', 'lemari', 'meja-belajar', 'dapur', 'parkir'],
    labelKhusus: { wifi: 'Wi-Fi 50 Mbps', parkir: 'Parkir Motor' },
    foto: FOTO.ichi,
    pemilik: 'Ibu Dewi Sulistyani',
    rating: 4.9,
    jumlahUlasan: 24,
    detail: {
      ukuran: '3 x 4 Meter',
      listrik: 'Token Pribadi',
      gerbang: 'Kunci Mandiri',
      keamanan: 'CCTV 24 Jam',
      termasuk: 'Sudah termasuk tagihan air & Wi-Fi 50 Mbps',
      deskripsi: [
        'ICHI Kost Putri Madiun adalah hunian nyaman, aman, dan tenteram bagi mahasiswi maupun karyawati di Kota Madiun. Terletak di kawasan Kartoharjo, Anda hanya perlu kurang dari 5 menit berkendara ke UNIPMA Kampus 1 dan RSUD Sogaten.',
        'Setiap kamar memiliki ventilasi alami dan pencahayaan cerah, dengan perabot kayu kokoh untuk mendukung istirahat dan belajar Anda.',
      ],
      fasilitasLain: [
        'Tempat parkir motor di dalam pagar berkanopi',
        'Ruang tamu bersama yang luas & bersih',
        'Area jemuran beratap transparan',
        'Mesin cuci bersama 2 unit',
      ],
      tataTertib: [
        { judul: 'Tamu', isi: 'Tamu pria (keluarga/kerabat) dipersilakan berkunjung di ruang tamu depan hingga pukul 21.00 WIB.' },
        { judul: 'Akses gerbang', isi: 'Gerbang utama ditutup pukul 22.00 WIB. Setiap penghuni mendapat kunci gerbang sendiri untuk aktivitas malam.' },
        { judul: 'Bebas rokok & hewan peliharaan', isi: 'Seluruh area kamar dan lorong adalah kawasan bebas rokok.' },
      ],
      jarak: [
        { icon: 'school', nilai: '350 Meter', label: 'UNIPMA Kampus 1' },
        { icon: 'train', nilai: '1,2 Kilometer', label: 'Stasiun Madiun' },
        { icon: 'restaurant', nilai: '800 Meter', label: 'Pusat Kuliner Jl. Pahlawan' },
      ],
      ulasan: [
        { nama: 'Nadia Dian', peran: 'Mahasiswi UNIPMA • Tinggal 1 tahun', isi: 'Nyaman dan aman untuk mahasiswi UNIPMA. Pengelolanya ramah, Wi-Fi stabil untuk nugas malam, dan lingkungannya tenang.' },
        { nama: 'Ratih Anggraini', peran: 'Staf Medis • Tinggal 8 bulan', isi: 'Parkiran motor rapi di dalam pagar dan ada CCTV. Kunci gerbang sendiri memudahkan saya yang sering shift malam.' },
      ],
    },
  },
  {
    id: 'bu-ning-kos-cowok',
    nama: 'Bu Ning Kos Cowok Madiun',
    tipe: 'Putra',
    area: 'Taman',
    alamat: 'Kec. Taman, Kota Madiun',
    lokasiSingkat: 'Taman, 3 menit ke Politeknik Negeri Madiun',
    tagLokasi: ['taman', 'poltek'],
    harga: { bulanan: 700000 },
    sisaKamar: 2,
    fasilitas: ['wifi', 'kasur', 'lemari', 'parkir', 'dapur'],
    labelKhusus: { parkir: 'Parkir Motor Luas', kasur: 'Kasur' },
    foto: FOTO.buNing,
    pemilik: 'Ibu Ning',
  },
  {
    id: 'griya-kos-putri-kurnia',
    nama: 'Griya Kos Putri Kurnia',
    tipe: 'Putri',
    area: 'Manguharjo',
    alamat: 'Kec. Manguharjo, dekat RSUD Sogaten, Kota Madiun',
    lokasiSingkat: 'Manguharjo, dekat RSUD Sogaten & UNS Madiun',
    tagLokasi: ['manguharjo', 'uns'],
    harga: { bulanan: 950000 },
    sisaKamar: 4,
    fasilitas: ['ac', 'kamar-mandi-dalam', 'water-heater', 'tv', 'wifi', 'kasur'],
    foto: FOTO.griya,
    pemilik: 'Ibu Kurnia',
  },
  {
    id: 'kos-campuran-ring-road-asri',
    nama: 'Kos Campuran Ring Road Asri',
    tipe: 'Campuran',
    area: 'Manguharjo',
    alamat: 'Jl. Ring Road Barat, Kota Madiun',
    lokasiSingkat: 'Jl. Ring Road Barat, Kota Madiun',
    tagLokasi: ['manguharjo', 'kartoharjo'],
    harga: { bulanan: 1100000 },
    sisaKamar: 1,
    fasilitas: ['ac', 'wifi', 'parkir', 'kamar-mandi-dalam', 'kasur'],
    labelKhusus: { parkir: 'Parkir Mobil' },
    foto: FOTO.ringRoad,
    pemilik: 'Pengelola Ring Road Asri',
  },
  {
    id: 'pondok-putri-melati-unipma',
    nama: 'Pondok Putri Melati UNIPMA',
    tipe: 'Putri',
    area: 'Kartoharjo',
    alamat: 'Kec. Kartoharjo, 200 m dari gerbang UNIPMA, Kota Madiun',
    lokasiSingkat: 'Kec. Kartoharjo, 200m dari gerbang UNIPMA',
    tagLokasi: ['kartoharjo', 'unipma'],
    harga: { bulanan: 650000 },
    sisaKamar: 0,
    fasilitas: ['kasur', 'meja-belajar', 'wifi', 'dapur'],
    labelKhusus: { kasur: 'Kasur' },
    foto: FOTO.melati,
    pemilik: 'Ibu Melati',
  },
  {
    id: 'kos-mahasiswa-poltek-garuda',
    nama: 'Kos Mahasiswa Poltek Garuda',
    tipe: 'Putra',
    area: 'Taman',
    alamat: 'Dekat Poltek Madiun, Kec. Taman, Kota Madiun',
    lokasiSingkat: 'Dekat Poltek Madiun, Kec. Taman',
    tagLokasi: ['taman', 'poltek'],
    harga: { bulanan: 750000 },
    sisaKamar: 5,
    fasilitas: ['kasur', 'lemari', 'wifi', 'parkir'],
    labelKhusus: { parkir: 'Parkir Motor', kasur: 'Kasur' },
    foto: FOTO.poltek,
    pemilik: 'Pengelola Garuda',
  },
];

/* ---------- Fungsi bantu data ---------- */
export const cariKosById = (id) => KOS_LIST.find((k) => k.id === id) ?? null;

export const detailKos = (kos) => ({ ...DETAIL_BAWAAN, ...(kos.detail ?? {}) });

/** Status ketersediaan: tersedia / menipis (<= 2 kamar) / penuh. */
export function statusKamar(kos) {
  if (kos.sisaKamar === 0) return { kode: 'penuh', label: 'Penuh' };
  const label = `Sisa ${kos.sisaKamar} kamar`;
  return { kode: kos.sisaKamar <= 2 ? 'menipis' : 'tersedia', label };
}

export const labelFasilitas = (kos, id) => kos.labelKhusus?.[id] ?? FASILITAS[id]?.label ?? id;

export const hargaTermurah = (daftar = KOS_LIST) =>
  Math.min(...daftar.filter((k) => k.sisaKamar > 0).map((k) => k.harga.bulanan));
