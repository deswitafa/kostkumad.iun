/** Halaman Detail Kos. URL: detail.html?id=<id-kos> */
import { mountLayout } from '../components/layout.js';
import { renderKosCard } from '../components/kos-card.js';
import { stateBox } from '../components/states.js';
import { KOS_LIST, FASILITAS, cariKosById, detailKos, statusKamar, labelFasilitas } from '../data/kos.js';
import { rupiah } from '../lib/format.js';
import { buatLinkWA, pesanTanyaKos } from '../lib/whatsapp.js';
import { baca, simpan } from '../lib/storage.js';
import { $, $$, escapeHtml } from '../lib/dom.js';

const root = $('#detail-root');
const id = new URLSearchParams(location.search).get('id');
const kos = cariKosById(id);

/** Opsi durasi per skema sewa. `diskon` dalam persen. */
const DURASI = {
  harian: { satuan: 'hari', unit: '/ hari', opsi: [{ n: 1 }, { n: 3 }, { n: 7 }, { n: 14 }] },
  bulanan: { satuan: 'bulan', unit: '/ bulan', opsi: [{ n: 1 }, { n: 3, diskon: 5 }, { n: 6, diskon: 8 }, { n: 12 }] },
  tahunan: { satuan: 'tahun', unit: '/ tahun', opsi: [{ n: 1 }, { n: 2 }] },
};
const hariIni = () => new Date().toISOString().slice(0, 10);
const inisial = (nama) => nama.split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();

/* ---------- template bagian halaman ---------- */
const tplGaleri = (k, status) => {
  const [utama, kedua, ketiga] = [k.foto[0], k.foto[1] ?? k.foto[0], k.foto[2] ?? k.foto[0]];
  const img = (src, alt) => `<img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.remove()">`;
  return `
  <section aria-label="Galeri foto">
    <div class="gallery">
      <div class="gallery__main">${img(utama, `Kamar ${k.nama}`)}
        <div class="gallery__badges"><span class="tag tag--${k.tipe.toLowerCase()}">${k.tipe}</span><span class="tag tag--${status.kode}">${status.label}</span></div>
      </div>
      <div class="gallery__side">
        <div class="gallery__item">${img(kedua, 'Area belajar')}</div>
        <div class="gallery__item">${img(ketiga, 'Kamar mandi')}
          <button class="gallery__more" type="button" id="btn-galeri"><span class="icon">grid_view</span>Lihat Semua Foto (${k.foto.length})<small>Kamar, dapur &amp; parkiran</small></button>
        </div>
      </div>
    </div>
    <div class="gallery__note hidden" id="catatan-galeri"><span><span class="icon">info</span> Anda dapat meminta album foto selengkapnya serta video 360° lewat WhatsApp pengelola.</span>
      <button type="button" id="tutup-catatan" aria-label="Tutup"><span class="icon">close</span></button></div>
  </section>`;
};

const tplInfo = (k, d) => `
  <div class="panel">
    <div class="detail__meta">
      <span class="tag tag--info">Pilihan di ${escapeHtml(k.area)}</span>
      ${k.rating ? `<span class="rating"><span class="icon icon--fill">star</span>${k.rating}<small>(${k.jumlahUlasan} ulasan)</small></span>` : ''}
    </div>
    <h1 class="detail__title">${escapeHtml(k.nama)}</h1>
    <p class="detail__alamat"><span class="icon">location_on</span><span>${escapeHtml(k.alamat)}</span></p>
    <div class="specs">
      ${[['Ukuran Kamar', d.ukuran], ['Tipe Listrik', d.listrik], ['Akses Gerbang', d.gerbang], ['Keamanan', d.keamanan]]
        .map(([l, v]) => `<div><small>${l}</small><strong>${escapeHtml(v)}</strong></div>`).join('')}
    </div>
  </div>`;

const tplFasilitas = (k, d) => `
  <div class="panel">
    <h2>Fasilitas Kamar &amp; Bersama</h2>
    <div class="fasilitas">
      ${k.fasilitas.map((fid) => `
        <div class="fasilitas__item"><span class="fasilitas__ikon"><span class="icon">${FASILITAS[fid]?.icon ?? 'check'}</span></span>
          <div><strong>${escapeHtml(labelFasilitas(k, fid))}</strong><small>${escapeHtml(FASILITAS[fid]?.ket ?? '')}</small></div></div>`).join('')}
    </div>
    ${d.fasilitasLain.length ? `<ul class="centang">${d.fasilitasLain.map((t) => `<li><span class="icon">check_circle</span>${escapeHtml(t)}</li>`).join('')}</ul>` : ''}
  </div>`;

const tplDeskripsi = (d) => `
  <div class="panel">
    <h2>Deskripsi &amp; Tata Tertib</h2>
    ${d.deskripsi.map((p) => `<p class="lead">${escapeHtml(p)}</p>`).join('')}
    <div class="aturan"><h3><span class="icon">gavel</span>Tata Tertib demi Kenyamanan Bersama</h3>
      <ul>${d.tataTertib.map((t) => `<li><strong>${escapeHtml(t.judul)}:</strong> ${escapeHtml(t.isi)}</li>`).join('')}</ul></div>
  </div>`;

const tplLokasi = (k, d) => `
  <div class="panel">
    <h2>Jarak Strategis &amp; Lokasi</h2>
    ${d.jarak.length ? `<div class="jarak">${d.jarak.map((j) => `<div class="jarak__item"><span class="icon">${j.icon}</span><div><strong>${j.nilai}</strong><small>${escapeHtml(j.label)}</small></div></div>`).join('')}</div>` : ''}
    <iframe class="peta" title="Peta lokasi ${escapeHtml(k.nama)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${encodeURIComponent(k.nama + ', ' + k.alamat)}&output=embed"></iframe>
  </div>`;

const tplUlasan = (k, d) => !d.ulasan.length ? '' : `
  <div class="panel">
    <h2>Ulasan Penghuni</h2>
    <div class="ulasan">${d.ulasan.map((u) => `
      <div class="ulasan__item"><blockquote>"${escapeHtml(u.isi)}"</blockquote>
        <div class="ulasan__user"><span class="avatar">${inisial(u.nama)}</span><div><strong>${escapeHtml(u.nama)}</strong><br><small class="text-muted">${escapeHtml(u.peran)}</small></div></div></div>`).join('')}</div>
  </div>`;

const tplBooking = (k, d) => `
  <aside class="booking" aria-label="Panel pemesanan">
    <div class="booking__card"><div class="booking__body">
      <div><small class="text-muted" style="font-weight:600;text-transform:uppercase">Tarif Sewa Kamar</small>
        <p class="booking__price"><span id="harga">${rupiah(k.harga.bulanan)}</span> <small id="satuan">/ bulan</small></p>
        <p class="booking__incl"><span class="icon">check_circle</span>${escapeHtml(d.termasuk)}</p></div>
      <div class="field"><span class="label">Pilih Skema Sewa:</span>
        <div class="segmen" id="skema">${['harian', 'bulanan', 'tahunan'].map((s) =>
          `<button type="button" data-skema="${s}" ${k.harga[s] ? '' : 'disabled title="Tidak tersedia"'}>${s[0].toUpperCase() + s.slice(1)}</button>`).join('')}</div></div>
      <div class="grid grid--2" style="gap:8px">
        <div class="field"><label for="tanggal">Mulai Sewa:</label><input class="input" type="date" id="tanggal" min="${hariIni()}" value="${hariIni()}"></div>
        <div class="field"><label for="durasi">Durasi Sewa:</label><select class="select" id="durasi"></select></div>
      </div>
      <div class="booking__total"><span>Estimasi total</span><strong id="total"></strong></div>
      <button class="btn btn--green btn--lg btn--block" type="button" id="btn-wa" ${k.sisaKamar === 0 ? 'disabled' : ''}><span class="icon">chat</span>${k.sisaKamar === 0 ? 'Kamar Penuh' : 'Chat Pemilik via WhatsApp'}</button>
      <button class="btn btn--soft btn--block" type="button" id="btn-fav"><span class="icon">bookmark_border</span><span>Simpan / Favoritkan Kos</span></button>
      <p class="text-muted" style="display:flex;gap:4px;align-items:center;font-size:11px"><span class="icon" style="color:var(--blue);font-size:18px">verified_user</span>Tanpa Biaya Admin &amp; Terhubung Langsung ke Pemilik</p>
      <div class="penjual"><span class="avatar">${inisial(k.pemilik)}</span><div><strong>${escapeHtml(k.pemilik)}</strong><br><small class="text-muted">Pemilik / Pengelola</small></div></div>
    </div></div>
    <div class="info-survei"><span class="icon">calendar_month</span><div><strong>Ingin Survey Lokasi Dahulu?</strong>
      <p class="text-muted">Tentukan jadwal kedatangan bersama pemilik lewat chat WhatsApp secara gratis.</p></div></div>
  </aside>`;

const tplModal = (k) => `
  <div class="modal" id="modal-wa" role="dialog" aria-modal="true" aria-labelledby="modal-judul">
    <div class="modal__dialog">
      <div class="modal__head"><div><h3 id="modal-judul">Hubungi Pemilik Kos</h3><small>${escapeHtml(k.nama)} • ${escapeHtml(k.pemilik)}</small></div>
        <button class="modal__close" type="button" data-tutup aria-label="Tutup"><span class="icon">close</span></button></div>
      <div class="modal__body">
        <p class="text-muted">Pesan otomatis sudah disiapkan agar pertanyaan Anda cepat ditanggapi:</p>
        <div class="wa-bubble" id="wa-pesan"></div>
        <div class="grid grid--2" style="gap:8px">
          <a class="btn btn--green btn--lg" id="wa-kirim" target="_blank" rel="noopener noreferrer" href="#"><span class="icon">send</span>Buka WhatsApp</a>
          <button class="btn btn--soft btn--lg" type="button" data-tutup>Batal</button></div>
      </div>
    </div>
  </div>`;

function tplSerupa(k) {
  const lain = KOS_LIST.filter((x) => x.id !== k.id)
    .sort((a, b) => Number(b.area === k.area) - Number(a.area === k.area)).slice(0, 3);
  return `
  <section class="serupa">
    <div class="section__head section__head--row" style="margin-bottom:24px">
      <div><span class="eyebrow">Rekomendasi Terdekat</span><h2 class="title-lg">Kos Serupa di Sekitar Kampus</h2></div>
      <a class="btn btn--soft" href="kos.html">Lihat Semua Kos <span class="icon">arrow_forward</span></a>
    </div>
    <div class="grid grid--3">${lain.map(renderKosCard).join('')}</div>
  </section>`;
}

/* ---------- interaksi panel pemesanan ---------- */
function aktifkanBooking(k) {
  const state = { skema: k.harga.bulanan ? 'bulanan' : Object.keys(k.harga)[0], durasi: 1 };
  const modal = $('#modal-wa');

  function perbarui() {
    const cfg = DURASI[state.skema];
    $$('#skema button').forEach((b) => b.classList.toggle('is-active', b.dataset.skema === state.skema));
    $('#durasi').innerHTML = cfg.opsi.map((o) =>
      `<option value="${o.n}" ${o.n === state.durasi ? 'selected' : ''}>${o.n} ${cfg.satuan}${o.diskon ? ` (Diskon ${o.diskon}%)` : ''}</option>`).join('');
    const opsi = cfg.opsi.find((o) => o.n === state.durasi) ?? cfg.opsi[0];
    $('#harga').textContent = rupiah(k.harga[state.skema]);
    $('#satuan').textContent = cfg.unit;
    $('#total').textContent = rupiah(Math.round(k.harga[state.skema] * opsi.n * (1 - (opsi.diskon ?? 0) / 100)));
  }

  $('#skema').addEventListener('click', (e) => {
    const b = e.target.closest('button:not(:disabled)');
    if (!b) return;
    state.skema = b.dataset.skema; state.durasi = 1; perbarui();
  });
  $('#durasi').addEventListener('change', (e) => { state.durasi = Number(e.target.value); perbarui(); });

  // favorit tersimpan di localStorage
  const btnFav = $('#btn-fav');
  const gambarFav = () => {
    const aktif = baca('favorit', []).includes(k.id);
    btnFav.classList.toggle('is-fav', aktif);
    btnFav.querySelector('.icon').textContent = aktif ? 'bookmark' : 'bookmark_border';
    btnFav.querySelector('span:last-child').textContent = aktif ? 'Tersimpan di Favorit Anda' : 'Simpan / Favoritkan Kos';
  };
  btnFav.addEventListener('click', () => {
    const daftar = baca('favorit', []);
    simpan('favorit', daftar.includes(k.id) ? daftar.filter((x) => x !== k.id) : [...daftar, k.id]);
    gambarFav();
  });

  // modal WhatsApp
  $('#btn-wa').addEventListener('click', () => {
    const tanggal = new Date($('#tanggal').value || hariIni()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const pesan = `${pesanTanyaKos(k, tanggal)} (Skema sewa: ${state.skema}, durasi ${state.durasi} ${DURASI[state.skema].satuan})`;
    $('#wa-pesan').textContent = pesan;
    $('#wa-kirim').href = buatLinkWA(k.whatsapp ?? '6289524811485', pesan);
    modal.classList.add('is-open');
  });
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-tutup]')) modal.classList.remove('is-open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('is-open'); });

  // galeri
  $('#btn-galeri').addEventListener('click', () => $('#catatan-galeri').classList.toggle('hidden'));
  $('#tutup-catatan').addEventListener('click', () => $('#catatan-galeri').classList.add('hidden'));

  perbarui();
  gambarFav();
}

/* ---------- mulai ---------- */
mountLayout('kos');
if (!kos) {
  document.title = 'Kos tidak ditemukan - KostKu Madiun';
  root.innerHTML = `<div class="container section">${stateBox({ ikon: 'home_work', judul: 'Kos tidak ditemukan',
    pesan: 'Tautan yang Anda buka tidak cocok dengan kos mana pun.', tombol: '<a class="btn btn--blue" href="kos.html">Lihat Semua Kos</a>' })}</div>`;
} else {
  document.title = `${kos.nama} - KostKu Madiun`;
  const d = detailKos(kos);
  const status = statusKamar(kos);
  root.innerHTML = `
    <section class="hero hero--strip"><div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html"><span class="icon" style="font-size:16px">home</span> Beranda</a><span class="icon" style="font-size:14px">chevron_right</span>
        <a href="kos.html">Cari Kos</a><span class="icon" style="font-size:14px">chevron_right</span><span aria-current="page">${escapeHtml(kos.nama)}</span></nav>
      <span class="pill"><span class="icon icon--fill" style="color:var(--mint)">verified</span>Foto Terverifikasi</span>
    </div></section>
    <div class="container detail">
      ${tplGaleri(kos, status)}
      <div class="detail__layout">
        <div class="detail__main">${tplInfo(kos, d)}${tplFasilitas(kos, d)}${tplDeskripsi(d)}${tplLokasi(kos, d)}${tplUlasan(kos, d)}</div>
        ${tplBooking(kos, d)}
      </div>
      ${tplSerupa(kos)}
    </div>
    ${tplModal(kos)}`;
  aktifkanBooking(kos);
}
