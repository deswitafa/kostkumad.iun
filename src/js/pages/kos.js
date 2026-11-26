/** Halaman Cari Kos: pencarian, filter (tersimpan di URL), urutan, dan paginasi. */
import { mountLayout } from '../components/layout.js';
import { renderDaftarKos } from '../components/kos-card.js';
import { renderKostyBubble } from '../components/kosty.js';
import { skeletonCards, emptyState } from '../components/states.js';
import { KOS_LIST, FASILITAS, cariKosById } from '../data/kos.js';
import { TIPE, RENTANG_HARGA, FILTER_LOKASI, FILTER_FASILITAS, FILTER_AWAL, filterKos, urutkanKos, filterDariURL, filterKeURL } from '../lib/filter.js';
import { linkAdmin } from '../lib/whatsapp.js';
import { $, $$ } from '../lib/dom.js';

const PER_HALAMAN = 6;
let filter = filterDariURL(location.search);
let halaman = 1;
let mode = 'normal'; // normal | skeleton | kosong (simulasi state)

const hasilEl = $('#hasil');

/* ---------- panel filter (dibuat dari konstanta agar tak ada duplikasi HTML) ---------- */
function bangunPanelFilter() {
  $('#filter-tipe').innerHTML = ['semua', ...TIPE]
    .map((t) => `<button class="chip" type="button" data-tipe="${t}">${t === 'semua' ? 'Semua' : t}</button>`).join('');
  $('#filter-harga').innerHTML = RENTANG_HARGA
    .map((r) => `<label class="check"><input type="radio" name="harga" value="${r.id}"><span>${r.label}</span></label>`).join('');
  $('#filter-lokasi').innerHTML = FILTER_LOKASI
    .map((l) => `<label class="check"><input type="checkbox" name="lokasi" value="${l.id}"><span>${l.label}</span></label>`).join('');
  $('#filter-fasilitas').innerHTML = FILTER_FASILITAS
    .map((id) => `<label class="check"><input type="checkbox" name="fasilitas" value="${id}"><span>${FASILITAS[id].label}</span></label>`).join('');
}

/** Menyelaraskan kontrol di layar dengan objek `filter`. */
function sinkronkanKontrol() {
  $('#input-q').value = filter.q;
  $('#select-tipe').value = filter.tipe;
  $('#urut').value = filter.urut;
  $('#filter-tersedia').checked = filter.hanyaTersedia;
  $$('#filter-tipe .chip').forEach((c) => c.classList.toggle('is-active', c.dataset.tipe === filter.tipe));
  const rentang = RENTANG_HARGA.find((r) => r.min === filter.min && r.max === filter.max) ?? RENTANG_HARGA[0];
  $$('input[name="harga"]').forEach((i) => (i.checked = i.value === rentang.id));
  $$('input[name="lokasi"]').forEach((i) => (i.checked = filter.lokasi.includes(i.value)));
  $$('input[name="fasilitas"]').forEach((i) => (i.checked = filter.fasilitas.includes(i.value)));
}

/* ---------- render ---------- */
function renderPager(totalHalaman) {
  const pager = $('#pager');
  if (totalHalaman <= 1) { pager.innerHTML = ''; return; }
  const angka = Array.from({ length: totalHalaman }, (_, i) => i + 1)
    .map((n) => `<button type="button" data-hal="${n}" class="${n === halaman ? 'is-active' : ''}">${n}</button>`).join('');
  pager.innerHTML = `
    <button type="button" data-hal="${halaman - 1}" ${halaman === 1 ? 'disabled' : ''} aria-label="Sebelumnya"><span class="icon">chevron_left</span></button>
    ${angka}
    <button type="button" data-hal="${halaman + 1}" ${halaman === totalHalaman ? 'disabled' : ''} aria-label="Berikutnya"><span class="icon">chevron_right</span></button>`;
}

function render() {
  const hasil = urutkanKos(filterKos(KOS_LIST, filter), filter.urut);
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
  halaman = Math.min(halaman, totalHalaman);
  const tampil = hasil.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  $('#jumlah').textContent = mode === 'kosong' ? 0 : hasil.length;
  if (mode === 'skeleton') hasilEl.innerHTML = skeletonCards(2);
  else if (mode === 'kosong' || tampil.length === 0) hasilEl.innerHTML = emptyState();
  else hasilEl.innerHTML = renderDaftarKos(tampil);
  renderPager(mode === 'normal' ? totalHalaman : 1);
}

function terapkan({ resetHalaman = true } = {}) {
  if (resetHalaman) halaman = 1;
  const query = filterKeURL(filter);
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
  render();
}

/* ---------- event ---------- */
function ubahFilter(perubahan) {
  filter = { ...filter, ...perubahan };
  sinkronkanKontrol();
  terapkan();
}

function pasangEvent() {
  const centang = (nama) => $$(`input[name="${nama}"]:checked`).map((i) => i.value);

  $('#search-form').addEventListener('submit', (e) => { e.preventDefault(); ubahFilter({ q: $('#input-q').value }); });
  $('#input-q').addEventListener('input', (e) => ubahFilter({ q: e.target.value }));
  $('#select-tipe').addEventListener('change', (e) => ubahFilter({ tipe: e.target.value }));
  $('#urut').addEventListener('change', (e) => ubahFilter({ urut: e.target.value }));
  $('#filter-tersedia').addEventListener('change', (e) => ubahFilter({ hanyaTersedia: e.target.checked }));
  $('#filter-tipe').addEventListener('click', (e) => {
    const c = e.target.closest('[data-tipe]');
    if (c) ubahFilter({ tipe: c.dataset.tipe });
  });
  $('#filter-harga').addEventListener('change', (e) => {
    const r = RENTANG_HARGA.find((x) => x.id === e.target.value);
    ubahFilter({ min: r.min, max: r.max });
  });
  $('#filter-lokasi').addEventListener('change', () => ubahFilter({ lokasi: centang('lokasi') }));
  $('#filter-fasilitas').addEventListener('change', () => ubahFilter({ fasilitas: centang('fasilitas') }));

  // tombol "Reset" (sidebar & state kosong)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-aksi="reset"]')) return;
    mode = 'normal';
    $$('#simulasi .tabs__btn').forEach((b) => b.classList.toggle('is-active', b.dataset.state === 'normal'));
    ubahFilter({ ...FILTER_AWAL });
  });

  $('#simulasi').addEventListener('click', (e) => {
    const b = e.target.closest('[data-state]');
    if (!b) return;
    mode = b.dataset.state;
    $$('#simulasi .tabs__btn').forEach((x) => x.classList.toggle('is-active', x === b));
    render();
  });

  $('#pager').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hal]');
    if (!b || b.disabled) return;
    halaman = Number(b.dataset.hal);
    render();
    hasilEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Klik kartu: sorot + gelembung Kosty sesuai ketersediaan (klik tombol "Lihat Detail" tetap pindah halaman)
  hasilEl.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    const kartu = e.target.closest('.kos-card');
    if (!kartu) return;
    const sudahAktif = kartu.classList.contains('is-selected');
    $$('.kos-card.is-selected', hasilEl).forEach((k) => { k.classList.remove('is-selected'); k.querySelector('.kosty-bubble')?.remove(); });
    if (sudahAktif) return;
    kartu.classList.add('is-selected');
    kartu.insertAdjacentHTML('afterbegin', renderKostyBubble(cariKosById(kartu.dataset.id)));
  });
}

mountLayout('kos');
bangunPanelFilter();
sinkronkanKontrol();
pasangEvent();
$('#wa-bantuan').href = linkAdmin('Halo Admin KostKu Madiun, saya ingin konsultasi bantuan mencari kos');
render();
