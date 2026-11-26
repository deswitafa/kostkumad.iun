/** Pembungkus localStorage yang aman (tidak error di mode privat). */
const PREFIX = 'kostku:';

export function baca(kunci, cadangan = null) {
  try {
    const nilai = localStorage.getItem(PREFIX + kunci);
    return nilai ? JSON.parse(nilai) : cadangan;
  } catch {
    return cadangan;
  }
}

export function simpan(kunci, nilai) {
  try {
    localStorage.setItem(PREFIX + kunci, JSON.stringify(nilai));
  } catch {
    /* abaikan: penyimpanan penuh / diblokir */
  }
}
