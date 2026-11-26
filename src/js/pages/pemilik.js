/** Landing "Untuk Pemilik Kos": paket biaya dirender dari data/paket.js. */
import { mountLayout } from '../components/layout.js';
import { PAKET } from '../data/paket.js';
import { KOS_LIST } from '../data/kos.js';
import { rupiah } from '../lib/format.js';
import { linkAdmin } from '../lib/whatsapp.js';
import { $ } from '../lib/dom.js';

const kartuPaket = (p) => `
  <div class="paket${p.unggulan ? ' paket--unggulan' : ''}">
    ${p.unggulan ? '<span class="paket__ribbon">★ Paling hemat</span>' : ''}
    <div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><h3 class="title-sm">${p.nama}</h3>
      ${p.hemat ? `<span class="tag tag--tersedia">Hemat ${p.hemat}%</span>` : ''}</div>
      <p class="text-muted">${p.cocok}</p></div>
    <p class="paket__harga">${rupiah(p.harga)} <small>/ properti kos</small></p>
    <ul>${p.fitur.map((f) => `<li><span class="icon">check_circle</span>${f}</li>`).join('')}</ul>
  </div>`;

mountLayout('pemilik');
$('#daftar-paket').innerHTML = PAKET.map(kartuPaket).join('');
$('#foto-buruk').src = $('#foto-baik').src = KOS_LIST[0].foto[0];
$('#foto-buruk').onerror = $('#foto-baik').onerror = (e) => e.target.remove();
$('#wa-konsultasi').href = linkAdmin('Halo Admin KostKu Madiun, saya ingin berkonsultasi mengenai pendaftaran kos saya');
