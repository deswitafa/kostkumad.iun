/**
 * Kerangka halaman bersama: header, footer, dan tombol WhatsApp mengambang.
 * Dipanggil sekali dari tiap halaman: mountLayout('beranda').
 */
import { SITE, NAV } from '../config.js';
import { $ } from '../lib/dom.js';
import { linkAdmin } from '../lib/whatsapp.js';

const logo = (kelas = '') => `
  <a class="brand ${kelas}" href="index.html" aria-label="${SITE.nama} - Beranda">
    <span class="brand__logo"><span class="icon">home_work</span></span>
    <span class="brand__text"><span class="brand__name">Kost<em>Ku</em></span><small>MADIUN</small></span>
  </a>`;

function headerHTML(aktif) {
  const menu = NAV.map((n) => {
    const kelas = n.key === aktif ? 'nav__link is-active' : 'nav__link';
    return `<a class="${kelas}" href="${n.href}"${n.key === aktif ? ' aria-current="page"' : ''}>${n.label}</a>`;
  }).join('');
  return `
  <div class="header__bar container">
    ${logo()}
    <nav class="nav" id="nav" aria-label="Navigasi utama">${menu}</nav>
    <div class="header__actions">
      <a class="btn btn--yellow" href="pemilik.html"><span class="icon">real_estate_agent</span><span class="header__cta-text">Untuk Pemilik Kos</span></a>
      <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav"><span class="icon">menu</span></button>
    </div>
  </div>`;
}

function footerHTML() {
  const tautan = (items) => items.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('');
  return `
  <div class="container footer__grid">
    <div>
      ${logo('brand--footer')}
      <p class="footer__about">Platform pencarian kos tepercaya di Kota Madiun untuk mahasiswa dan perantau. Informasi akurat, foto asli, langsung hubungi pemilik kos tanpa perantara.</p>
    </div>
    <div><h4>Menu Utama</h4><ul>${tautan(NAV.map((n) => [n.href, n.label]))}</ul></div>
    <div><h4>Pemilik Kos</h4><ul>${tautan([['pemilik.html', 'Untuk Pemilik'], ['portal-pemilik.html', 'Ajukan Kos Baru'], ['portal-pemilik.html#status', 'Cek Status Pengajuan']])}</ul></div>
    <div>
      <h4>Kontak Admin</h4>
      <ul class="footer__contact">
        <li><span class="icon">chat</span>WhatsApp: ${SITE.whatsappTampil}</li>
        <li><span class="icon">mail</span>${SITE.email}</li>
        <li><span class="icon">schedule</span>${SITE.jamOperasional}</li>
        <li><span class="icon">location_on</span>${SITE.lokasi}</li>
      </ul>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>© ${SITE.tahun} ${SITE.nama}. Hak Cipta Dilindungi.</p>
    <p>Pusat Hunian Nyaman dan Tepercaya di Madiun</p>
  </div>`;
}

function aktifkanMenuMobile() {
  const tombol = $('#nav-toggle');
  const nav = $('#nav');
  tombol.addEventListener('click', () => {
    const buka = nav.classList.toggle('is-open');
    tombol.setAttribute('aria-expanded', String(buka));
    tombol.querySelector('.icon').textContent = buka ? 'close' : 'menu';
  });
}

/** @param {string} aktif key menu aktif (lihat NAV di config.js) */
export function mountLayout(aktif, { fab = true } = {}) {
  $('#site-header').innerHTML = headerHTML(aktif);
  $('#site-footer').innerHTML = footerHTML();
  aktifkanMenuMobile();
  if (fab) {
    document.body.insertAdjacentHTML('beforeend',
      `<a class="fab" href="${linkAdmin('Halo Admin KostKu Madiun, saya ingin bertanya seputar informasi kos.')}"
          target="_blank" rel="noopener noreferrer" aria-label="Chat Admin WhatsApp"><span class="icon">chat</span><span class="fab__tip">Chat Admin WhatsApp</span></a>`);
  }
}
