import { SITE } from '../config.js';

/** Membuat tautan wa.me dengan pesan terisi otomatis. */
export const buatLinkWA = (nomor, pesan = '') =>
  `https://wa.me/${nomor}${pesan ? `?text=${encodeURIComponent(pesan)}` : ''}`;

export const linkAdmin = (pesan) => buatLinkWA(SITE.whatsappAdmin, pesan);

export const pesanTanyaKos = (kos, tanggal) =>
  `Halo ${kos.pemilik} (Pemilik ${kos.nama}), saya tertarik dengan kamar kos di KostKu Madiun. ` +
  `Apakah kamar masih tersedia untuk survey tanggal ${tanggal}? Terima kasih!`;
