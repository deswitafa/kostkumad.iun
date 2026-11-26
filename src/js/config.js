/**
 * Konfigurasi global situs.
 * Ubah data kontak, rekening, dan menu navigasi HANYA di file ini.
 */
export const SITE = {
  nama: 'KostKu Madiun',
  tahun: 2026,
  // URL Aplikasi web Google Apps Script (berakhiran /exec). Ganti jika penerapan dibuat ulang.
  apiUrl: 'https://script.google.com/macros/s/AKfycbwj25_fqRrdbSSV6K7tnCL4sWKiJQrCS3CxGgCHeQ_rCaR_7AVt0rhcufO4dUNIVcMCcg/exec',
  whatsappAdmin: '6289524811485', // format internasional tanpa "+"
  whatsappTampil: '0895-2481-1485',
  email: 'kostkumadiun@gmail.com',
  jamOperasional: 'Senin - Sabtu: 08.00 - 20.00 WIB',
  lokasi: 'Madiun, Jawa Timur',
  instagram: 'https://www.instagram.com/kostku_madiun',
  tiktok: 'https://www.tiktok.com/@kostkumadiun',
  // TODO: ganti dengan data rekening resmi sebelum rilis.
  rekening: {
    bank: 'BANK BCA / MANDIRI MADIUN',
    nomor: '1770928891',
    nomorTampil: '177-092-8891',
    atasNama: 'PT KOSTKU TEKNOLOGI MADIUN',
  },
};

/** Menu utama. `key` dipakai untuk menandai halaman aktif. */
export const NAV = [
  { key: 'beranda', label: 'Beranda', href: 'index.html' },
  { key: 'kos', label: 'Cari Kos', href: 'kos.html' },
  { key: 'faq', label: 'FAQ', href: 'faq.html' },
  { key: 'tentang', label: 'Tentang', href: 'tentang.html' },
  { key: 'kontak', label: 'Kontak', href: 'kontak.html' },
];
