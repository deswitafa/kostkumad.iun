/**
 * Lapisan data pengajuan kos: terhubung ke Google Apps Script
 * (Google Sheet + Google Drive + email). Antarmuka fungsinya sama dengan versi demo.
 */
import { SITE } from '../config.js';
import { baca, simpan } from './storage.js';

const KUNCI_TERAKHIR = 'pengajuan-terakhir';
const LEBAR_MAKS = 1000;
const KUALITAS = 0.75;

/** Indeks tahap pada stepper per status (status memakai istilah frontend). */
export const INDEKS_TAHAP = { verifikasi: 1, 'perlu-perbaikan': 1, ditolak: 1, disetujui: 3, 'bukti-terkirim': 4, tayang: 5 };

// Istilah di Google Sheet (kiri) -> istilah di frontend (kanan)
const STATUS_KE_FRONT = {
  menunggu: 'verifikasi', disetujui: 'disetujui', dibayar: 'bukti-terkirim',
  aktif: 'tayang', perlu_perbaikan: 'perlu-perbaikan', ditolak: 'ditolak',
};

async function panggil(url, opsi) {
  let res;
  try { res = await fetch(url, opsi); }
  catch { throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'); }
  if (!res.ok) throw new Error(`Server menjawab ${res.status}. Coba lagi sebentar lagi.`);
  let hasil;
  try { hasil = await res.json(); }
  catch { throw new Error('Jawaban server tidak terbaca. Pastikan URL Apps Script benar dan penerapan diatur "Siapa saja".'); }
  if (!hasil.ok) throw new Error(hasil.pesan || 'Terjadi kesalahan di server.');
  return hasil;
}

/** Kecilkan gambar di browser agar unggahan cepat dan hemat ruang Drive. */
function kompresFoto(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { reject(new Error('Format foto harus JPG, PNG, atau WebP.')); return; }
    const pembaca = new FileReader();
    pembaca.onerror = () => reject(new Error('Foto tidak bisa dibaca.'));
    pembaca.onload = () => {
      const gambar = new Image();
      gambar.onerror = () => reject(new Error('Foto rusak atau tidak didukung.'));
      gambar.onload = () => {
        const skala = Math.min(1, LEBAR_MAKS / gambar.width);
        const kanvas = document.createElement('canvas');
        kanvas.width = Math.round(gambar.width * skala);
        kanvas.height = Math.round(gambar.height * skala);
        const ctx = kanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, kanvas.width, kanvas.height);
        ctx.drawImage(gambar, 0, 0, kanvas.width, kanvas.height);
        resolve(kanvas.toDataURL('image/jpeg', KUALITAS));
      };
      gambar.src = pembaca.result;
    };
    pembaca.readAsDataURL(file);
  });
}

/** Pengajuan terakhir di browser ini (agar tab Cek Status terisi otomatis). */
export const pengajuanTerakhir = () => baca(KUNCI_TERAKHIR);

/** Kirim pengajuan baru + foto. Mengembalikan data dengan nomor pengajuan (kode). */
export async function buatPengajuan(data, daftarFile, saatProgres = () => {}) {
  const foto = [];
  for (let i = 0; i < daftarFile.length; i++) {
    saatProgres(i, daftarFile.length);
    foto.push({ kategori: 'Lainnya', data: await kompresFoto(daftarFile[i]) });
  }
  saatProgres(daftarFile.length, daftarFile.length);

  const badan = JSON.stringify({
    aksi: 'ajukan', website: '',
    nama_kos: data.namaKos, tipe: data.tipe, alamat: data.alamat, link_maps: data.linkMaps,
    whatsapp: data.wa, telepon: data.telepon, nama_pemilik: data.namaPemilik, email: data.email,
    deskripsi: data.deskripsi,
    harga_harian: data.harga.harian, harga_bulanan: data.harga.bulanan, harga_tahunan: data.harga.tahunan,
    total_kamar: data.totalKamar, sisa_kamar: data.sisaKamar, fasilitas: data.fasilitas, foto,
  });
  // Tanpa header Content-Type agar browser tidak mengirim preflight CORS ke Apps Script
  const hasil = await panggil(SITE.apiUrl, { method: 'POST', body: badan });
  simpan(KUNCI_TERAKHIR, { kode: hasil.id, email: data.email });
  return { ...data, kode: hasil.id, status: 'verifikasi' };
}

/** Cari pengajuan berdasarkan nomor + email. Melempar error bila tidak ditemukan. */
export async function cariPengajuan(kode, email) {
  const url = `${SITE.apiUrl}?aksi=status&id=${encodeURIComponent(kode.trim())}&email=${encodeURIComponent(email.trim())}`;
  const { data: r } = await panggil(url);
  const paketId = String(r.paket_dipilih || '').replace('bulan', '');
  return {
    kode: r.id, email: email.trim(), namaKos: r.nama_kos,
    status: STATUS_KE_FRONT[r.status] ?? 'verifikasi', catatan: r.catatan || '', paket: paketId || null,
  };
}

/** Kirim bukti transfer untuk paket terpilih (id paket: '3', '6', atau '12'). */
export async function kirimBukti(kode, email, paketId, file) {
  const bukti = await kompresFoto(file);
  const badan = JSON.stringify({ aksi: 'bayar', id: kode, email, paket: `${paketId}bulan`, bukti });
  return panggil(SITE.apiUrl, { method: 'POST', body: badan });
}
