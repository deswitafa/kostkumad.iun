/** Paket biaya kemitraan pemilik kos (dibayar setelah pengajuan disetujui). */
export const PAKET = [
  { id: '3', bulan: 3, nama: 'Paket 3 Bulan', harga: 75000, coret: null, hemat: null, cocok: 'Cocok untuk uji coba promosi kos di Madiun',
    fitur: ['Tayang 3 bulan penuh', 'Verifikasi resmi KostKu', 'Tombol kontak WhatsApp langsung', 'Bantuan tim support'] },
  { id: '6', bulan: 6, nama: 'Paket 6 Bulan', harga: 125000, coret: 150000, hemat: 17, cocok: 'Pilihan favorit pemilik kos mahasiswa',
    fitur: ['Tayang 6 bulan penuh', 'Prioritas pencarian area kampus', 'Bantuan pemotretan standar', 'Support prioritas'] },
  { id: '12', bulan: 12, nama: 'Paket 12 Bulan', harga: 200000, coret: 300000, hemat: 33, cocok: 'Solusi tahunan paling hemat dan tenang', unggulan: true,
    fitur: ['Tayang 1 tahun penuh', 'Badge mitra verified prioritas teratas', 'Konsultasi okupansi kamar', 'Support WhatsApp VIP'] },
];
export const cariPaket = (id) => PAKET.find((p) => p.id === id);
