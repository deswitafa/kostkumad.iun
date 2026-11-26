/** Maskot "Kosty" versi kecil beserta gelembung ucapannya. */
const MULUT = {
  senang: 'M43 74 Q50 84 57 74',
  sedih: 'M44 78 Q50 71 56 78',
  kaget: 'M44 74 Q50 86 56 74 Z',
};

export function kostyMini(mood = 'senang') {
  return `
  <svg viewBox="0 0 100 115" fill="none" aria-hidden="true">
    <polygon points="50,14 14,44 86,44" fill="#FFC845" stroke="#172A5E" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="66" y="20" width="8" height="12" rx="1" fill="#2F5BD8" stroke="#172A5E" stroke-width="2"/>
    <rect x="22" y="42" width="56" height="52" rx="12" fill="#fff" stroke="#172A5E" stroke-width="2.5"/>
    <ellipse cx="32" cy="69" rx="4.5" ry="2.5" fill="#FFB5CF" opacity=".7"/>
    <ellipse cx="68" cy="69" rx="4.5" ry="2.5" fill="#FFB5CF" opacity=".7"/>
    <ellipse cx="38" cy="62" rx="3.5" ry="5" fill="#172A5E"/>
    <ellipse cx="62" cy="62" rx="3.5" ry="5" fill="#172A5E"/>
    <path d="${MULUT[mood]}" fill="${mood === 'kaget' ? '#FF597B' : 'none'}" stroke="#172A5E" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="38" cy="96" rx="6" ry="3.5" fill="#2F5BD8" stroke="#172A5E" stroke-width="1.5"/>
    <ellipse cx="62" cy="96" rx="6" ry="3.5" fill="#2F5BD8" stroke="#172A5E" stroke-width="1.5"/>
  </svg>`;
}

/** Pesan dan suasana hati Kosty menyesuaikan ketersediaan kamar. */
export function renderKostyBubble(kos) {
  let pesan = `Sisa ${kos.sisaKamar} kamar. Masih ada tempat untuk Anda!`;
  let mood = 'senang';
  if (kos.sisaKamar === 0) {
    pesan = 'Kamar sedang penuh. Tanyakan daftar tunggu ke pemilik.';
    mood = 'sedih';
  } else if (kos.sisaKamar === 1) {
    pesan = 'Tinggal 1 kamar. Segera hubungi pemilik.';
    mood = 'kaget';
  }
  return `<div class="kosty-bubble" role="status"><p class="kosty-bubble__text">${pesan}</p>${kostyMini(mood)}</div>`;
}
