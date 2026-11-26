/** Portal Pemilik: formulir pengajuan, cek status, dan konfirmasi pembayaran. */
import { kostyMini } from '../components/kosty.js';
import { tampilkanToast } from '../components/toast.js';
import { PAKET, cariPaket } from '../data/paket.js';
import { FASILITAS } from '../data/kos.js';
import { SITE } from '../config.js';
import { buatPengajuan, cariPengajuan, kirimBukti, pengajuanTerakhir, INDEKS_TAHAP } from '../lib/pengajuan.js';
import { rupiah, keAngka } from '../lib/format.js';
import { linkAdmin } from '../lib/whatsapp.js';
import { $, $$, escapeHtml, salinTeks } from '../lib/dom.js';

const TAHAP = ['Diajukan', 'Verifikasi', 'Disetujui', 'Bayar', 'Tayang'];
const FASILITAS_FORM = { ...Object.fromEntries(Object.entries(FASILITAS).map(([k, v]) => [k, v.label])),
  'listrik-termasuk': 'Listrik Termasuk', penjaga: 'Penjaga Kos 24 Jam' };
const MAKS_FOTO = 10;
const MAKS_UKURAN = 5 * 1024 * 1024;

const form = $('#view-form');
const fasilitasDipilih = new Set();
let foto = []; // [{ file, url }]

/* ---------- stepper & tab ---------- */
function renderStepper(aktif) {
  $('#stepper').innerHTML = TAHAP.map((nama, i) => {
    const kelas = i < aktif ? 'is-done' : i === aktif ? 'is-active' : '';
    return `<li class="stepper__item ${kelas}"><span class="stepper__dot">${i < aktif ? '<span class="icon">check</span>' : i + 1}</span><span class="l">${nama}</span></li>`;
  }).join('');
}

function tampilkanTab(nama) {
  $$('[data-tab]').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === nama));
  $('#view-submitted').classList.add('hidden');
  form.classList.toggle('hidden', nama !== 'form');
  $('#view-status').classList.toggle('hidden', nama !== 'status');
  if (nama === 'form') renderStepper(0);
}

/* ---------- formulir ---------- */
function bangunChipFasilitas() {
  $('#chips-fasilitas').innerHTML = Object.entries(FASILITAS_FORM)
    .map(([id, label]) => `<button class="chip chip--toggle" type="button" data-fas="${id}" aria-pressed="false"><span class="icon">add</span>${label}</button>`).join('');
}

function hitungProgres() {
  const v = (n) => form.elements[n].value.trim();
  const bagian = [
    v('namaKos') && form.elements.tipe.value,
    v('alamat') && v('wa') && v('namaPemilik') && v('email'),
    keAngka(v('hargaBulanan')) > 0 && v('totalKamar') && v('sisaKamar') !== '',
    fasilitasDipilih.size > 0,
    foto.length > 0,
  ].filter(Boolean).length;
  $('#progres-teks').textContent = `${bagian} dari 5 bagian`;
  $('#progres-bar').style.width = `${bagian * 20}%`;
}

function tampilkanFoto() {
  $('#thumbs').innerHTML = foto.map((f, i) => `
    <div class="thumb"><img src="${f.url}" alt="Foto ${i + 1}"><button type="button" data-hapus="${i}" aria-label="Hapus foto ${i + 1}"><span class="icon" style="font-size:16px">close</span></button></div>`).join('');
  $('#info-foto').textContent = `${foto.length} dari ${MAKS_FOTO} foto terunggah`;
  hitungProgres();
}

function tambahFoto(daftarFile) {
  for (const file of daftarFile) {
    if (foto.length >= MAKS_FOTO) { tampilkanToast(`Maksimal ${MAKS_FOTO} foto.`, 'error'); break; }
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { tampilkanToast(`${file.name}: format tidak didukung.`, 'error'); continue; }
    if (file.size > MAKS_UKURAN) { tampilkanToast(`${file.name}: lebih dari 5 MB.`, 'error'); continue; }
    foto.push({ file, url: URL.createObjectURL(file) });
  }
  tampilkanFoto();
}

function setError(nama, pesan) {
  const el = form.elements[nama];
  const wadah = el.closest('.field') ?? el.closest('.form-akhir');
  wadah.querySelector('.field__error')?.remove();
  el.classList?.toggle('is-invalid', Boolean(pesan));
  if (pesan) wadah.insertAdjacentHTML('beforeend', `<span class="field__error" role="alert">${pesan}</span>`);
}

function validasi() {
  const v = (n) => form.elements[n].value.trim();
  const harga = ['hargaHarian', 'hargaBulanan', 'hargaTahunan'].map((n) => keAngka(v(n)));
  const aturan = {
    namaKos: !v('namaKos') && 'Nama kos wajib diisi.',
    alamat: !v('alamat') && 'Alamat wajib diisi.',
    wa: !/^(\+?62|0)8\d{8,12}$/.test(v('wa').replace(/[\s-]/g, '')) && 'Masukkan nomor WhatsApp yang valid, contoh 081234567890.',
    namaPemilik: !v('namaPemilik') && 'Nama pemilik wajib diisi.',
    email: !/^\S+@\S+\.\S+$/.test(v('email')) && 'Masukkan email yang valid.',
    hargaBulanan: !harga[1] && 'Harga bulanan wajib diisi.',
    totalKamar: !(Number(v('totalKamar')) > 0) && 'Isi total kamar.',
    sisaKamar: (v('sisaKamar') === '' && 'Isi sisa kamar.') || (Number(v('sisaKamar')) > Number(v('totalKamar')) && 'Sisa kamar tidak boleh melebihi total kamar.'),
    setuju: !form.elements.setuju.checked && 'Centang pernyataan ini untuk melanjutkan.',
  };
  let pertama = null;
  for (const [nama, pesan] of Object.entries(aturan)) {
    setError(nama, pesan || '');
    if (pesan && !pertama) pertama = nama;
  }
  if (!form.elements.tipe.value) { tampilkanToast('Pilih jenis penghuni.', 'error'); pertama ??= 'namaKos'; }
  if (pertama) form.elements[pertama].focus();
  return !pertama;
}

function tampilkanProses(teks) {
  const el = $('#view-submitted');
  el.classList.remove('hidden');
  el.innerHTML = banner('info', 'senang', 'Sedang Diajukan', teks);
}

async function kirimForm(e) {
  e.preventDefault();
  if (!validasi()) return;
  const v = (n) => form.elements[n].value.trim();
  const tombol = form.querySelector('[type="submit"]');
  const data = {
    namaKos: v('namaKos'), tipe: form.elements.tipe.value, alamat: v('alamat'), linkMaps: v('gmaps'),
    wa: v('wa'), telepon: v('telpAlt'), namaPemilik: v('namaPemilik'), email: v('email'), deskripsi: v('deskripsi'),
    harga: { harian: keAngka(v('hargaHarian')), bulanan: keAngka(v('hargaBulanan')), tahunan: keAngka(v('hargaTahunan')) },
    totalKamar: Number(v('totalKamar')), sisaKamar: Number(v('sisaKamar')),
    fasilitas: [...fasilitasDipilih], jumlahFoto: foto.length,
  };
  tombol.disabled = true;
  form.classList.add('hidden');
  renderStepper(0);
  tampilkanProses('Menyiapkan data dan foto Anda...');
  try {
    const pengajuan = await buatPengajuan(data, foto.map((f) => f.file), (i, n) =>
      tampilkanProses(i < n ? `Mengecilkan foto ${i + 1} dari ${n}...` : 'Mengirim data ke server KostKu. Mohon jangan tutup halaman ini.'));
    tampilkanSubmitted(pengajuan);
  } catch (err) {
    $('#view-submitted').classList.add('hidden');
    form.classList.remove('hidden');
    tampilkanToast(err.message, 'error');
  } finally {
    tombol.disabled = false;
  }
}

/* ---------- tampilan setelah terkirim & cek status ---------- */
const banner = (kelas, ikon, judul, isi, ekstra = '') => `
  <div class="banner-status banner-status--${kelas}">
    <div class="kosty-ikon">${kostyMini(ikon)}</div>
    <div><h2 class="title-sm">${judul}</h2><p style="margin-top:6px">${isi}</p>${ekstra}</div>
  </div>`;

function tiket(kode) {
  return `<div class="tiket"><div><small>Nomor Registrasi Pengajuan</small><strong>${escapeHtml(kode)}</strong></div>
    <button class="btn btn--soft" type="button" data-salin="${escapeHtml(kode)}"><span class="icon">content_copy</span>Salin Nomor</button></div>`;
}

function tampilkanSubmitted(p) {
  renderStepper(INDEKS_TAHAP.verifikasi);
  const harga = p.harga?.bulanan ? `${rupiah(p.harga.bulanan)} / bulan` : '-';
  const fas = (p.fasilitas ?? []).map((id) => `<span class="facility">${FASILITAS_FORM[id] ?? id}</span>`).join('') || '-';
  const el = $('#view-submitted');
  el.classList.remove('hidden');
  el.innerHTML = `
    ${banner('tunggu', 'senang', 'Pengajuan Terkirim! Tim KostKu Sedang Memeriksa Data Anda',
      'Simpan nomor pengajuan ini untuk mengecek status. Estimasi verifikasi 1x24 jam kerja.', tiket(p.kode))}
    <div class="card card--pad" style="margin-top:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px">
        <h3 class="title-sm"><span class="icon">lock</span> Ringkasan Formulir</h3>
        <button class="btn btn--blue" type="button" id="buka-status" data-kode="${escapeHtml(p.kode)}" data-email="${escapeHtml(p.email)}"><span class="icon">travel_explore</span>Buka Cek Status</button></div>
      <dl class="ringkasan" style="grid-template-columns:1fr 1fr">
        <div><dt>Nama Properti</dt><dd>${escapeHtml(p.namaKos)} <span class="tag tag--${p.tipe.toLowerCase()}">${p.tipe}</span></dd></div>
        <div><dt>Harga Sewa</dt><dd>${harga}</dd></div>
        <div style="grid-column:1/-1"><dt>Alamat</dt><dd>${escapeHtml(p.alamat)}</dd></div>
        <div style="grid-column:1/-1"><dt>Fasilitas</dt><dd style="display:flex;flex-wrap:wrap;gap:6px;font-weight:400">${fas}</dd></div>
        <div><dt>Foto</dt><dd>${p.jumlahFoto} foto</dd></div><div><dt>Kontak</dt><dd>${escapeHtml(p.wa)}</dd></div>
      </dl>
    </div>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tampilkanStatus(p) {
  const aktif = INDEKS_TAHAP[p.status] ?? 1;
  renderStepper(aktif);
  const wadah = $('#hasil-status');
  const kos = `<strong>${escapeHtml(p.namaKos)}</strong>`;
  if (p.status === 'verifikasi') {
    wadah.innerHTML = banner('tunggu', 'senang', 'Menunggu Verifikasi', `Tim KostKu sedang memeriksa data ${kos}. Estimasi 1x24 jam kerja.`, tiket(p.kode));
  } else if (p.status === 'disetujui') {
    wadah.innerHTML = banner('ok', 'senang', 'Pengajuan Disetujui', `Selamat! ${kos} lolos verifikasi. Pilih paket kemitraan dan selesaikan pembayaran agar kos Anda tayang.`, tiket(p.kode)) + htmlPembayaran(p);
    pasangPembayaran(p);
  } else if (p.status === 'bukti-terkirim') {
    wadah.innerHTML = banner('info', 'senang', 'Bukti Pembayaran Diterima', `Admin sedang memeriksa pembayaran ${kos}. Kos tayang maksimal 2 jam kerja setelah diverifikasi.`, tiket(p.kode));
  } else if (p.status === 'perlu-perbaikan' || p.status === 'ditolak') {
    const judul = p.status === 'ditolak' ? 'Pengajuan Belum Dapat Disetujui' : 'Pengajuan Perlu Diperbaiki';
    wadah.innerHTML = banner('error', 'sedih', judul, `Catatan admin untuk ${kos}: ${escapeHtml(p.catatan || 'Silakan hubungi admin.')}`, tiket(p.kode)) +
      `<div class="card card--pad" style="margin-top:24px"><p class="text-muted">Perbaiki data sesuai catatan, lalu ajukan ulang lewat tab <strong>Ajukan Kos</strong>, atau hubungi admin.</p>
      <a class="btn btn--green" style="margin-top:12px" target="_blank" rel="noopener noreferrer" href="${linkAdmin(`Halo Admin, saya ingin menanyakan pengajuan ${p.kode}`)}"><span class="icon">chat</span>Chat Admin</a></div>`;
  } else {
    wadah.innerHTML = banner('ok', 'senang', 'Kos Anda Sudah Tayang', `${kos} sudah dapat ditemukan calon penyewa di KostKu Madiun.`, tiket(p.kode));
  }
}

function htmlPembayaran(p) {
  const r = SITE.rekening;
  const dipilih = p.paket ?? '12';
  const paket = PAKET.map((x) => `
    <label><input class="sr-only" type="radio" name="paket" value="${x.id}" ${x.id === dipilih ? 'checked' : ''}>
      <span style="display:flex;justify-content:space-between;gap:8px">${x.hemat ? `<span class="tag tag--tersedia">Hemat ${x.hemat}%</span>` : '<span class="text-muted">Paket Uji Coba</span>'}${x.unggulan ? '<span class="tag tag--menipis">★ Paling hemat</span>' : ''}</span>
      <h4>${x.nama}</h4><span>${x.coret ? `<s>${rupiah(x.coret)}</s> ` : ''}<strong>${rupiah(x.harga)}</strong></span></label>`).join('');
  const baris = (label, nilai, salin) => `<div class="rek"><div><small>${label}</small><strong>${nilai}</strong></div>
    <button class="btn btn--soft" type="button" data-salin="${salin}"><span class="icon">content_copy</span>Salin</button></div>`;
  return `
  <div class="card card--pad" style="margin-top:24px"><h3 class="title-sm" style="margin-bottom:12px">Pilih Paket Kemitraan</h3><div class="pilih-paket" id="pilih-paket">${paket}</div></div>
  <div class="bayar" style="margin-top:24px">
    <div class="card card--pad"><h3 class="title-sm" style="margin-bottom:12px"><span class="icon" style="color:var(--blue)">account_balance</span> Transfer ke Rekening Resmi</h3>
      <div class="total-tagihan"><small class="text-muted">TOTAL TAGIHAN MITRA</small><strong id="total-bayar">${rupiah(cariPaket(dipilih).harga)}</strong></div>
      ${baris('Nama Bank', r.bank, r.bank)}${baris('Nomor Rekening', r.nomorTampil, r.nomor)}${baris('Atas Nama', r.atasNama, r.atasNama)}
      <p class="field__hint" style="margin-top:12px">Pastikan nama penerima tertulis <strong>${r.atasNama}</strong> saat transfer.</p></div>
    <div class="card card--pad"><h3 class="title-sm" style="margin-bottom:12px"><span class="icon" style="color:#1E8A55">upload_file</span> Unggah Bukti Transfer</h3>
      <label class="dropzone" for="input-bukti"><span class="icon">upload_file</span><span><u>Pilih berkas bukti transfer</u></span><small class="text-muted">JPG, PNG, WebP (maks. 5 MB)</small></label>
      <input class="sr-only" type="file" id="input-bukti" accept="image/jpeg,image/png,image/webp">
      <div class="file-info hidden" id="info-bukti"></div>
      <button class="btn btn--yellow btn--lg btn--block" type="button" id="kirim-bukti" style="margin-top:16px" disabled>Kirim Bukti Pembayaran <span class="icon">arrow_forward</span></button>
      <p class="field__hint" style="margin-top:8px">Kos tayang maksimal 2 jam kerja setelah pembayaran diverifikasi admin.</p></div>
  </div>
  <div class="card card--pad" style="margin-top:24px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
    <div><strong>Butuh bantuan konfirmasi?</strong><p class="text-muted">Hubungi tim verifikator KostKu Madiun lewat WhatsApp.</p></div>
    <a class="btn btn--green" target="_blank" rel="noopener noreferrer" href="${linkAdmin(`Halo Admin, saya ingin konfirmasi pembayaran pengajuan ${p.kode}`)}"><span class="icon">chat</span>Chat Tim Verifikasi</a></div>`;
}

function pasangPembayaran(p) {
  let bukti = null;
  $('#pilih-paket').addEventListener('change', (e) => { $('#total-bayar').textContent = rupiah(cariPaket(e.target.value).harga); });
  $('#input-bukti').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAKS_UKURAN) { tampilkanToast('Ukuran berkas lebih dari 5 MB.', 'error'); e.target.value = ''; return; }
    bukti = file;
    $('#info-bukti').classList.remove('hidden');
    $('#info-bukti').innerHTML = `<span class="icon" style="color:#1E8A55">check_circle</span><div><strong>${escapeHtml(file.name)}</strong><br><small class="text-muted">${(file.size / 1024 / 1024).toFixed(1)} MB • siap diverifikasi</small></div>`;
    $('#kirim-bukti').disabled = false;
  });
  $('#kirim-bukti').addEventListener('click', async () => {
    if (!bukti) return;
    const tombol = $('#kirim-bukti');
    tombol.disabled = true;
    tombol.textContent = 'Mengirim...';
    try {
      const paket = $('input[name="paket"]:checked').value;
      await kirimBukti(p.kode, p.email, paket, bukti);
      tampilkanStatus({ ...p, status: 'bukti-terkirim', paket });
      tampilkanToast('Bukti pembayaran terkirim. Admin akan memeriksanya.');
    } catch (err) {
      tampilkanToast(err.message, 'error');
      tombol.disabled = false;
      tombol.innerHTML = 'Kirim Bukti Pembayaran <span class="icon">arrow_forward</span>';
    }
  });
}

async function cekStatus(kode, email) {
  const wadah = $('#hasil-status');
  renderStepper(0);
  wadah.innerHTML = banner('info', 'senang', 'Memeriksa Status', 'Mohon tunggu sebentar...');
  try {
    tampilkanStatus(await cariPengajuan(kode, email));
  } catch (err) {
    wadah.innerHTML = `<div class="state-box"><div class="state-box__icon is-error"><span class="icon">search_off</span></div><h3>Status belum bisa ditampilkan</h3><p>${escapeHtml(err.message)}</p></div>`;
  }
}

/* ---------- event ---------- */
function pasangEvent() {
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    tampilkanTab(b.dataset.tab);
    if (b.dataset.tab === 'status' && !$('#hasil-status').innerHTML) renderStepper(0);
  }));

  form.addEventListener('submit', kirimForm);
  form.addEventListener('input', (e) => {
    if (e.target.matches('[data-rupiah]')) { const n = keAngka(e.target.value); e.target.value = n ? rupiah(n) : ''; }
    if (e.target.id === 'deskripsi') $('#hitung-deskripsi').textContent = `${e.target.value.length} / 2000 karakter`;
    e.target.classList.remove('is-invalid');
    hitungProgres();
  });
  $('#chips-fasilitas').addEventListener('click', (e) => {
    const c = e.target.closest('[data-fas]');
    if (!c) return;
    const aktif = !fasilitasDipilih.has(c.dataset.fas);
    aktif ? fasilitasDipilih.add(c.dataset.fas) : fasilitasDipilih.delete(c.dataset.fas);
    c.setAttribute('aria-pressed', aktif);
    c.querySelector('.icon').textContent = aktif ? 'check' : 'add';
    hitungProgres();
  });

  $('#input-foto').addEventListener('change', (e) => { tambahFoto(e.target.files); e.target.value = ''; });
  $('#thumbs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hapus]');
    if (!b) return;
    URL.revokeObjectURL(foto[b.dataset.hapus].url);
    foto.splice(Number(b.dataset.hapus), 1);
    tampilkanFoto();
  });
  const dz = $('#dropzone');
  ['dragover', 'dragenter'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, () => dz.classList.remove('is-over')));
  dz.addEventListener('drop', (e) => { e.preventDefault(); tambahFoto(e.dataTransfer.files); });

  $('#form-cek').addEventListener('submit', (e) => { e.preventDefault(); cekStatus($('#cek-kode').value, $('#cek-email').value); });

  document.addEventListener('click', (e) => {
    const salin = e.target.closest('[data-salin]');
    if (salin) salinTeks(salin.dataset.salin, salin);
    const buka = e.target.closest('#buka-status');
    if (buka) {
      tampilkanTab('status');
      $('#cek-kode').value = buka.dataset.kode;
      $('#cek-email').value = buka.dataset.email;
      cekStatus(buka.dataset.kode, buka.dataset.email);
    }
  });
}

bangunChipFasilitas();
renderStepper(0);
hitungProgres();
pasangEvent();
const idUrl = new URLSearchParams(location.search).get('id');
const terakhir = pengajuanTerakhir();
$('#cek-kode').value = idUrl ?? terakhir?.kode ?? '';
$('#cek-email').value = terakhir && (!idUrl || terakhir.kode === idUrl) ? terakhir.email : '';
if (idUrl || location.hash === '#status') tampilkanTab('status');
if (idUrl && $('#cek-email').value) cekStatus($('#cek-kode').value, $('#cek-email').value);
