/** Halaman FAQ: akordeon, filter kategori, dan pencarian. */
import { mountLayout } from '../components/layout.js';
import { FAQ, KATEGORI_FAQ } from '../data/faq.js';
import { SITE } from '../config.js';
import { linkAdmin } from '../lib/whatsapp.js';
import { $, $$ } from '../lib/dom.js';

const WARNA = { yellow: 'var(--yellow)', mint: 'var(--mint)', purple: 'var(--purple)', pink: 'var(--pink)' };
let kategori = 'all';

function renderKategori() {
  $('#faq-kategori').innerHTML = KATEGORI_FAQ.map((k) =>
    `<button class="chip${k.id === kategori ? ' is-active' : ''}" type="button" data-kat="${k.id}"><span class="icon">${k.icon}</span>${k.label}</button>`).join('');
}

const itemHTML = (f, i) => `
  <div class="accordion__item" style="--accent:${WARNA[f.warna]}">
    <button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="faq-p${i}" id="faq-t${i}">
      <span class="accordion__lead"><span class="accordion__bubble"><span class="icon">add</span></span><span class="accordion__question">${f.tanya}</span></span>
      <span class="icon accordion__chevron">expand_more</span>
    </button>
    <div class="accordion__panel hidden" id="faq-p${i}" role="region" aria-labelledby="faq-t${i}">
      <p>${f.jawab}</p>
      ${f.catatan ? `<div class="accordion__note"><span class="icon" style="color:var(--blue)">verified</span>${f.catatan}</div>` : ''}
    </div>
  </div>`;

function render() {
  const q = $('#faq-q').value.trim().toLowerCase();
  const hasil = FAQ.filter((f) =>
    (kategori === 'all' || f.kategori.includes(kategori)) &&
    (!q || `${f.tanya} ${f.jawab} ${f.kata}`.toLowerCase().includes(q)));
  $('#faq-daftar').innerHTML = hasil.map(itemHTML).join('');
  $('#faq-kosong').classList.toggle('hidden', hasil.length > 0);
  $('#faq-jumlah').textContent = `${hasil.length} Pertanyaan`;
  if (hasil.length && !q && kategori === 'all') toggle($('.accordion__trigger')); // pertanyaan pertama terbuka
}

function toggle(tombol) {
  const buka = tombol.getAttribute('aria-expanded') !== 'true';
  tombol.setAttribute('aria-expanded', String(buka));
  tombol.querySelector('.accordion__bubble .icon').textContent = buka ? 'remove' : 'add';
  $(`#${tombol.getAttribute('aria-controls')}`).classList.toggle('hidden', !buka);
}

mountLayout('faq');
$('#faq-jam').textContent = `Tim customer service KostKu Madiun siap membantu (${SITE.jamOperasional}).`;
$('#faq-wa').href = linkAdmin('Halo Admin KostKu Madiun, saya punya pertanyaan.');
renderKategori();
render();

$('#faq-daftar').addEventListener('click', (e) => { const t = e.target.closest('.accordion__trigger'); if (t) toggle(t); });
$('#faq-kategori').addEventListener('click', (e) => {
  const b = e.target.closest('[data-kat]');
  if (!b) return;
  kategori = b.dataset.kat;
  renderKategori();
  render();
});
$('#faq-q').addEventListener('input', render);
$('#faq-form').addEventListener('submit', (e) => { e.preventDefault(); render(); });
