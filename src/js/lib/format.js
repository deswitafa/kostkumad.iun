/** Memformat angka menjadi rupiah, contoh: 850000 -> "Rp 850.000". */
export const rupiah = (angka) => 'Rp ' + Number(angka).toLocaleString('id-ID');

/** Menghapus semua karakter non-angka: "850.000" -> 850000. */
export const keAngka = (teks) => Number(String(teks ?? '').replace(/\D/g, '')) || 0;
