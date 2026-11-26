/** Notifikasi singkat di pojok layar. */
export function tampilkanToast(pesan, ikon = 'check_circle') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="icon">${ikon}</span>${pesan}`;
  document.body.append(el);
  setTimeout(() => el.remove(), 3500);
}
