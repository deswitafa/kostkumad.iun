/**
 * Logika pencarian, filter, dan pengurutan kos (lihat 02-architecture.md bagian 7).
 * Semua fungsi murni: tidak menyentuh DOM.
 */
export const TIPE = ['Putri', 'Putra', 'Campuran'];

export const RENTANG_HARGA = [
  { id: 'semua', label: 'Semua Harga', min: 0, max: Infinity },
  { id: 'murah', label: '< Rp 800.000 / bln', min: 0, max: 799999 },
  { id: 'sedang', label: 'Rp 800.000 - Rp 1.200.000', min: 800000, max: 1200000 },
  { id: 'mahal', label: '> Rp 1.200.000 / bln', min: 1200001, max: Infinity },
];

export const FILTER_LOKASI = [
  { id: 'unipma', label: 'Dekat UNIPMA Kampus 1' },
  { id: 'poltek', label: 'Dekat Politeknik Negeri Madiun' },
  { id: 'uns', label: 'Dekat UNS Kampus Madiun/Caruban' },
  { id: 'kartoharjo', label: 'Pusat Kota / Kartoharjo' },
  { id: 'taman', label: 'Kecamatan Taman' },
];

/** ID fasilitas yang ditampilkan sebagai filter (harus ada di FASILITAS). */
export const FILTER_FASILITAS = ['ac', 'kamar-mandi-dalam', 'wifi', 'kasur', 'parkir', 'dapur'];

export const FILTER_AWAL = {
  q: '',
  tipe: 'semua',
  min: 0,
  max: Infinity,
  lokasi: [],
  fasilitas: [],
  hanyaTersedia: false,
  urut: 'rekomendasi',
};

export function filterKos(daftar, f) {
  const q = f.q.trim().toLowerCase();
  return daftar.filter((kos) => {
    if (q) {
      const teks = [kos.nama, kos.area, kos.alamat, kos.lokasiSingkat, ...kos.tagLokasi].join(' ').toLowerCase();
      if (!teks.includes(q)) return false;
    }
    if (f.tipe !== 'semua' && kos.tipe !== f.tipe) return false;
    if (kos.harga.bulanan < f.min || kos.harga.bulanan > f.max) return false;
    if (f.lokasi.length && !f.lokasi.some((l) => kos.tagLokasi.includes(l))) return false;
    if (!f.fasilitas.every((id) => kos.fasilitas.includes(id))) return false; // AND
    if (f.hanyaTersedia && kos.sisaKamar === 0) return false;
    return true;
  });
}

export function urutkanKos(daftar, mode) {
  const salinan = [...daftar];
  if (mode === 'termurah') salinan.sort((a, b) => a.harga.bulanan - b.harga.bulanan);
  if (mode === 'tertinggi') salinan.sort((a, b) => b.harga.bulanan - a.harga.bulanan);
  return salinan;
}

/** Membaca filter dari URL, contoh: ?q=melati&min=500000&max=1000000&f=wifi,ac */
export function filterDariURL(search) {
  const p = new URLSearchParams(search);
  const daftar = (kunci) => (p.get(kunci) || '').split(',').filter(Boolean);
  return {
    ...FILTER_AWAL,
    q: p.get('q') || '',
    tipe: TIPE.includes(p.get('tipe')) ? p.get('tipe') : 'semua',
    min: Number(p.get('min')) || 0,
    max: p.get('max') ? Number(p.get('max')) : Infinity,
    lokasi: daftar('lok'),
    fasilitas: daftar('f'),
    hanyaTersedia: p.get('tersedia') === '1',
    urut: p.get('urut') || 'rekomendasi',
  };
}

/** Kebalikan dari filterDariURL; hanya menulis nilai yang berbeda dari bawaan. */
export function filterKeURL(f) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.tipe !== 'semua') p.set('tipe', f.tipe);
  if (f.min) p.set('min', f.min);
  if (Number.isFinite(f.max)) p.set('max', f.max);
  if (f.lokasi.length) p.set('lok', f.lokasi.join(','));
  if (f.fasilitas.length) p.set('f', f.fasilitas.join(','));
  if (f.hanyaTersedia) p.set('tersedia', '1');
  if (f.urut !== 'rekomendasi') p.set('urut', f.urut);
  return p.toString();
}
