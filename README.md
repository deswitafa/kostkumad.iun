# KostKu Madiun

Platform pencarian kos di Kota Madiun — **HTML + CSS + JavaScript murni** (tanpa framework/bundler).
Mengikuti prinsip `02-architecture.md`: frontend-only, data statis, WhatsApp sebagai saluran kontak, mobile-first.

## Cara menjalankan
JavaScript memakai ES Modules, jadi halaman harus dibuka lewat server lokal (bukan klik dua kali pada file):

- VS Code: pasang ekstensi **Live Server**, klik kanan `index.html` → *Open with Live Server*; atau
- Terminal: `python3 -m http.server 5500` lalu buka <http://localhost:5500>.

## Struktur folder
```
kostku-madiun/
├─ index.html              Beranda            (/)
├─ kos.html                Daftar kos + cari + filter   (/kos)
├─ detail.html             Detail kos         (/kos/:id  →  detail.html?id=<id>)
├─ faq.html                FAQ
├─ tentang.html            Tentang Kami
├─ kontak.html             Kontak
├─ pemilik.html            Landing "Untuk Pemilik Kos"
├─ portal-pemilik.html     Formulir pengajuan, cek status, pembayaran
├─ assets/images/          Foto kos lokal (ganti URL ilustrasi di data/kos.js)
└─ src/
   ├─ css/
   │  ├─ base.css           Design token, reset, tipografi, grid
   │  ├─ components.css     Header, tombol, kartu, form, modal, footer, dll.
   │  └─ pages/             Satu file CSS per halaman
   └─ js/
      ├─ config.js          Kontak, rekening, menu (satu tempat untuk diubah)
      ├─ data/              kos.js · faq.js · paket.js · pengajuan-demo.js
      ├─ lib/               filter.js · whatsapp.js · format.js · dom.js · storage.js · pengajuan.js
      ├─ components/        layout.js · kos-card.js · kosty.js · states.js · toast.js
      └─ pages/             home.js · kos.js · detail.js · faq.js · pemilik.js · portal.js
```

## Aturan penamaan
- File & folder: huruf kecil, kata dipisah tanda hubung (`kos-card.js`).
- CSS: BEM ringan (`kos-card__title`, `tag--putri`); satu file per halaman, komponen bersama di `components.css`.
- JS: nama fungsi/variabel dalam bahasa Indonesia sesuai domain (`filterKos`, `statusKamar`); fungsi di `lib/` bersifat murni (tanpa DOM) agar mudah diuji.

## Alur data (sesuai arsitektur)
1. `data/kos.js` memuat 6 listing.
2. `kos.js` (halaman) membaca filter dari URL: `kos.html?q=melati&min=500000&max=1000000&f=wifi,ac&tipe=Putri`.
3. `lib/filter.js` menyaring (kata kunci, harga, lokasi, fasilitas dengan logika AND, ketersediaan) → dirender sebagai `renderKosCard`.
4. `detail.js` mencari kos berdasarkan `?id=`.
5. Tombol WhatsApp memakai `lib/whatsapp.js` → `https://wa.me/<nomor>?text=<pesan>`.

## Yang perlu diganti sebelum rilis
- `src/js/config.js`: nomor WhatsApp, email, **rekening bank** (sekarang contoh).
- `src/js/data/kos.js`: foto (kini URL ilustrasi), nomor WhatsApp tiap pemilik (opsional, `whatsapp`), data listing asli.
- `tentang.html`: angka statistik (150+, 98%, 2.400+) dan testimoni masih contoh.
- Portal pemilik menyimpan pengajuan di `localStorage` browser (demo). Untuk produksi, ganti isi `lib/pengajuan.js` dengan backend/layanan (mis. Supabase) — antarmuka fungsinya tidak perlu berubah.
