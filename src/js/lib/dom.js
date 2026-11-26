/** Utilitas DOM kecil yang dipakai di semua halaman. */
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Mencegah XSS saat menyisipkan teks dari pengguna ke innerHTML. */
export const escapeHtml = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

/** Menyalin teks ke clipboard dan memberi umpan balik pada tombol. */
export async function salinTeks(teks, tombol) {
  try {
    await navigator.clipboard.writeText(teks);
  } catch {
    const area = document.createElement('textarea');
    area.value = teks;
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  if (!tombol) return;
  const semula = tombol.innerHTML;
  tombol.innerHTML = '<span class="icon">check</span> Tersalin';
  tombol.classList.add('is-done');
  setTimeout(() => {
    tombol.innerHTML = semula;
    tombol.classList.remove('is-done');
  }, 2000);
}
