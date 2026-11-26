import { statusKamar, labelFasilitas } from '../data/kos.js';
import { rupiah } from '../lib/format.js';
import { escapeHtml } from '../lib/dom.js';

const MAKS_CHIP = 5;

/** Kartu kos yang dipakai di Beranda, Cari Kos, dan Kos Serupa. */
export function renderKosCard(kos) {
  const status = statusKamar(kos);
  const chip = kos.fasilitas
    .slice(0, MAKS_CHIP)
    .map((id) => `<span class="facility">${escapeHtml(labelFasilitas(kos, id))}</span>`)
    .join('');
  const sisa = kos.fasilitas.length - MAKS_CHIP;

  return `
  <article class="kos-card${status.kode === 'penuh' ? ' is-penuh' : ''}" data-id="${kos.id}">
    <div class="kos-card__media">
      <img src="${kos.foto[0]}" alt="Foto kamar ${escapeHtml(kos.nama)}" loading="lazy" onerror="this.remove()">
      <span class="tag tag--${kos.tipe.toLowerCase()} kos-card__tag">Kos ${kos.tipe}</span>
      <span class="tag tag--${status.kode} kos-card__status">${status.label}</span>
    </div>
    <div class="kos-card__body">
      <div>
        <p class="kos-card__loc"><span class="icon">location_on</span><span>${escapeHtml(kos.lokasiSingkat)}</span></p>
        <h3 class="kos-card__title">${escapeHtml(kos.nama)}</h3>
        <div class="kos-card__facilities">${chip}${sisa > 0 ? `<span class="facility">+${sisa}</span>` : ''}</div>
      </div>
      <div class="kos-card__foot">
        <p class="kos-card__price">${rupiah(kos.harga.bulanan)}<small>/bln</small></p>
        <a class="btn btn--blue" href="detail.html?id=${kos.id}">Lihat Detail <span class="icon">arrow_forward</span></a>
      </div>
    </div>
  </article>`;
}

export const renderDaftarKos = (daftar) => daftar.map(renderKosCard).join('');
