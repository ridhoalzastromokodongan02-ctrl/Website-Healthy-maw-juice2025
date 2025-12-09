# Healthy Maw Juice - Static Demo (HTML/CSS/JS)

Ini adalah versi statis (front-end) demo dari aplikasi Healthy Maw Juice yang meniru fitur dasar project PHP Anda.

Fitur:
- Halaman Beranda (index.html) dengan hero dan fitur.
- Halaman Produk (products.html) menampilkan daftar produk.
- Panel Admin (admin.html) untuk menambah, mengedit, menghapus produk.
- Semua data produk disimpan di browser (localStorage). Tidak ada server/backend.
- Admin login demo: username "admin" dan password default "admin123" (bisa diubah di localStorage).

Petunjuk penggunaan:
1. Simpan semua file pada satu folder (index.html, products.html, admin.html, style.css, app.js, README.md).
2. Buka index.html di browser.
3. Untuk mengelola produk, buka admin.html. Login dengan:
   - Username: admin
   - Password: admin123
4. Tambah/Edit/Hapus produk; perubahan disimpan di localStorage sehingga akan tetap ada di browser yang sama.
5. Untuk mengembalikan data awal, buka console browser dan jalankan:
   localStorage.removeItem('hmj_products_v1'); localStorage.removeItem('hmj_admin_pass');

Catatan keamanan & pengembangan:
- Ini cuma demo front-end. Untuk produksi, pindahkan penyimpanan ke server dengan database (MySQL) dan gunakan API yang aman.
- Jangan gunakan password demo di lingkungan nyata.
- Jika mau, saya bisa membantu mengonversi ini menjadi aplikasi penuh (REST API + PHP/MySQL atau Node.js) atau menambahkan upload gambar, validasi tambahan, dan CSRF protection.