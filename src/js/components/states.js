/** Tampilan status data: memuat (skeleton), gagal, dan kosong. */
const kartuSkeleton = `
  <div class="kos-skeleton" aria-hidden="true">
    <div class="skeleton kos-skeleton__img"></div>
    <div class="skeleton" style="height:16px;width:66%"></div>
    <div class="skeleton" style="height:24px;width:80%"></div>
    <div class="skeleton" style="height:24px;width:50%"></div>
    <div class="skeleton" style="height:40px"></div>
  </div>`;

export const skeletonCards = (jumlah = 3) => kartuSkeleton.repeat(jumlah);

export function stateBox({ ikon, judul, pesan, tombol = '', kelasIkon = '' }) {
  return `
  <div class="state-box state-box--span">
    <div class="state-box__icon ${kelasIkon}"><span class="icon">${ikon}</span></div>
    <h3>${judul}</h3>
    <p>${pesan}</p>
    ${tombol}
  </div>`;
}

export const errorState = () => stateBox({
  ikon: 'wifi_off', kelasIkon: 'is-error', judul: 'Data belum bisa dimuat',
  pesan: 'Data belum bisa dimuat. Periksa koneksi Anda.',
  tombol: '<button class="btn btn--blue" type="button" data-aksi="coba-lagi">Coba Lagi</button>',
});

export const emptyState = () => stateBox({
  ikon: 'search_off', judul: 'Kos Tidak Ditemukan',
  pesan: 'Mohon maaf, kriteria pencarian Anda belum menghasilkan kos yang cocok. Silakan atur ulang filter pencarian.',
  tombol: '<button class="btn btn--blue" type="button" data-aksi="reset">Kembalikan Semua Kos</button>',
});
