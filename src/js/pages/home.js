/** Halaman Beranda: statistik, hero interaktif, dan daftar kos pilihan. */
import { mountLayout } from '../components/layout.js';
import { renderDaftarKos } from '../components/kos-card.js';
import { skeletonCards, errorState } from '../components/states.js';
import { KOS_LIST, hargaTermurah } from '../data/kos.js';
import { rupiah } from '../lib/format.js';
import { $, $$ } from '../lib/dom.js';

const JUMLAH_PILIHAN = 3;
const listing = $('#listing');
let tipeAktif = 'semua';

function isiStatistik() {
  $('#stat-jumlah').textContent = KOS_LIST.length;
  $('#stat-harga').textContent = rupiah(hargaTermurah()).replace('.000', ' rb');
}

/** Memecah judul besar per huruf agar bisa bergelombang. */
function animasiJudul() {
  const el = $('#hero-big');
  el.innerHTML = [...el.textContent]
    .map((c, i) => (c === ' ' ? ' ' : `<span style="animation-delay:${i * 0.12}s">${c}</span>`))
    .join('');
}

function tampilkanKos() {
  const hasil = KOS_LIST.filter((k) => tipeAktif === 'semua' || k.tipe === tipeAktif).slice(0, JUMLAH_PILIHAN);
  listing.innerHTML = renderDaftarKos(hasil);
}

function setState(state) {
  $$('#simulasi .tabs__btn').forEach((b) => b.classList.toggle('is-active', b.dataset.state === state));
  if (state === 'skeleton') listing.innerHTML = skeletonCards(JUMLAH_PILIHAN);
  else if (state === 'error') listing.innerHTML = errorState();
  else tampilkanKos();
}

function pasangEvent() {
  $('#hero-search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = new FormData(e.target).get('q').trim();
    location.href = q ? `kos.html?q=${encodeURIComponent(q)}` : 'kos.html';
  });

  $('#tab-tipe').addEventListener('click', (e) => {
    const tombol = e.target.closest('[data-tipe]');
    if (!tombol) return;
    tipeAktif = tombol.dataset.tipe;
    $$('#tab-tipe .tabs__btn').forEach((b) => b.classList.toggle('is-active', b === tombol));
    setState('normal');
  });

  $('#simulasi').addEventListener('click', (e) => {
    const tombol = e.target.closest('[data-state]');
    if (tombol) setState(tombol.dataset.state);
  });

  listing.addEventListener('click', (e) => {
    if (e.target.closest('[data-aksi="coba-lagi"]')) setState('normal');
  });
}

mountLayout('beranda');
isiStatistik();
animasiJudul();
tampilkanKos();
pasangEvent();
