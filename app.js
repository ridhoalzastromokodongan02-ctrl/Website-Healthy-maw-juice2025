// app.js - client-side logic untuk demo statis (localStorage)
(function(){
  const STORAGE_KEY = 'hmj_products_v1';
  const ADMIN_KEY = 'hmj_admin_pass';

  // Seed sample data jika belum ada
  function seedIfEmpty(){
    if (!localStorage.getItem(STORAGE_KEY)) {
      const sample = [
        { id: 1, nama_produk: 'Sunrise Orange', bahan_utama: 'Jeruk, Wortel', manfaat_kesehatan: 'Vitamin C tinggi, detoks ringan', harga: 18000 },
        { id: 2, nama_produk: 'Green Boost', bahan_utama: 'Bayam, Apel, Jahe', manfaat_kesehatan: 'Serat dan zat besi untuk energi', harga: 22000 },
        { id: 3, nama_produk: 'Berry Antiox', bahan_utama: 'Blueberry, Stroberi', manfaat_kesehatan: 'Antioksidan untuk imun', harga: 25000 }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    }
    // Set default admin password demo jika belum ada (untuk demo saja)
    if (!localStorage.getItem(ADMIN_KEY)) {
      localStorage.setItem(ADMIN_KEY, 'admin123'); // PASSWORD DEMO
    }
  }

  // Util
  function loadProducts(){
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  function saveProducts(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }
  function formatPrice(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); }

  // PUBLIC: render products page
  window.renderProductsPublic = function(){
    const container = document.getElementById('productContainer');
    if (!container) return;
    const products = loadProducts();
    container.innerHTML = '';
    if (!products.length) {
      container.innerHTML = '<p>Maaf, belum ada produk yang tersedia saat ini.</p>';
      return;
    }
    products.forEach(p => {
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `
        <h3>${escapeHtml(p.nama_produk)}</h3>
        <p class="ingredients">Bahan: ${escapeHtml(p.bahan_utama)}</p>
        <p class="benefit">Manfaat: ${escapeHtml(p.manfaat_kesehatan || '')}</p>
        <span class="price">${formatPrice(p.harga)}</span>
        <button class="btn-card btn" onclick="alert('Terima kasih! Fitur pemesanan belum diaktifkan di demo ini.')">Pesan Sekarang</button>
      `;
      container.appendChild(card);
    });
  };

  // ESCAPE HTML sederhana
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]}); }

  // ADMIN UI LOGIC
  window.initAdminPage = function(){
    seedIfEmpty();
    const loginArea = document.getElementById('loginArea');
    const adminArea = document.getElementById('adminArea');
    const loginBtn = document.getElementById('loginBtn');
    const btnTambah = document.getElementById('btnTambah');
    const btnLogout = document.getElementById('btnLogout');
    const modal = document.getElementById('modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Jika sudah login (sessionStorage)
    const logged = sessionStorage.getItem('hmj_logged') === '1';
    toggleAuthUI(logged);

    loginBtn.addEventListener('click', function(){
      const user = document.getElementById('adminUser').value.trim();
      const pass = document.getElementById('adminPass').value;
      // simple auth: user must be 'admin' and pass matches stored admin pass
      const storedPass = localStorage.getItem(ADMIN_KEY) || 'admin123';
      if (user.toLowerCase() === 'admin' && pass === storedPass) {
        sessionStorage.setItem('hmj_logged','1');
        toggleAuthUI(true);
        alert('Login sukses (demo).');
        renderAdminTable();
      } else {
        alert('Login gagal. Username atau password salah.');
      }
    });

    btnLogout.addEventListener('click', function(){
      sessionStorage.removeItem('hmj_logged');
      toggleAuthUI(false);
    });

    btnTambah.addEventListener('click', function(){
      openModalForNew();
    });

    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', function(){
      const idEl = document.getElementById('productId').value;
      const nama = document.getElementById('pNama').value.trim();
      const bahan = document.getElementById('pBahan').value.trim();
      const manfaat = document.getElementById('pManfaat').value.trim();
      const harga = Number(document.getElementById('pHarga').value);
      if (!nama || !bahan || isNaN(harga) || harga < 0) {
        alert('Mohon isi data dengan benar.');
        return;
      }
      if (idEl) {
        // edit
        const id = Number(idEl);
        const arr = loadProducts();
        const idx = arr.findIndex(x=>x.id===id);
        if (idx>-1){
          arr[idx].nama_produk = nama;
          arr[idx].bahan_utama = bahan;
          arr[idx].manfaat_kesehatan = manfaat;
          arr[idx].harga = harga;
          saveProducts(arr);
          renderAdminTable();
          renderProductsPublic();
          closeModal();
        }
      } else {
        // add
        const arr = loadProducts();
        const newId = arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;
        arr.unshift({ id:newId, nama_produk:nama, bahan_utama:bahan, manfaat_kesehatan:manfaat, harga: harga });
        saveProducts(arr);
        renderAdminTable();
        renderProductsPublic();
        closeModal();
      }
    });

    // init table if logged
    if (logged) renderAdminTable();

    function toggleAuthUI(isLogged){
      if (isLogged){
        loginArea.style.display = 'none';
        adminArea.style.display = '';
        document.getElementById('btnTambah').style.display = '';
        document.getElementById('btnLogout').style.display = '';
      } else {
        loginArea.style.display = '';
        adminArea.style.display = 'none';
        document.getElementById('btnTambah').style.display = 'none';
        document.getElementById('btnLogout').style.display = 'none';
      }
    }

    // Table rendering
    window.renderAdminTable = renderAdminTable;
    function renderAdminTable(){
      const tbody = document.getElementById('adminTbody');
      const arr = loadProducts();
      tbody.innerHTML = '';
      if (!arr.length) {
        tbody.innerHTML = '<tr><td colspan="6">Belum ada produk.</td></tr>';
        return;
      }
      arr.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${escapeHtml(p.nama_produk)}</td>
          <td>${escapeHtml(p.bahan_utama)}</td>
          <td>${escapeHtml(p.manfaat_kesehatan || '')}</td>
          <td>${formatPrice(p.harga)}</td>
          <td class="action-cell">
            <button class="btn-sm edit" data-id="${p.id}">Edit</button>
            <button class="btn-sm delete" data-id="${p.id}">Hapus</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      // attach events
      Array.from(tbody.querySelectorAll('.btn-sm.edit')).forEach(b=>{
        b.addEventListener('click', function(){
          const id = Number(this.dataset.id);
          openModalForEdit(id);
        });
      });
      Array.from(tbody.querySelectorAll('.btn-sm.delete')).forEach(b=>{
        b.addEventListener('click', function(){
          const id = Number(this.dataset.id);
          if (confirm('Yakin ingin menghapus produk ini?')) {
            const arr = loadProducts().filter(x=>x.id!==id);
            saveProducts(arr);
            renderAdminTable();
            renderProductsPublic();
          }
        });
      });
    }

    // Modal helpers
    function openModalForNew(){
      document.getElementById('modalTitle').textContent = 'Tambah Produk';
      document.getElementById('productId').value = '';
      document.getElementById('pNama').value = '';
      document.getElementById('pBahan').value = '';
      document.getElementById('pManfaat').value = '';
      document.getElementById('pHarga').value = '';
      modal.setAttribute('aria-hidden','false');
    }
    function openModalForEdit(id){
      const arr = loadProducts();
      const p = arr.find(x=>x.id===id);
      if (!p) return alert('Produk tidak ditemukan');
      document.getElementById('modalTitle').textContent = 'Edit Produk';
      document.getElementById('productId').value = p.id;
      document.getElementById('pNama').value = p.nama_produk;
      document.getElementById('pBahan').value = p.bahan_utama;
      document.getElementById('pManfaat').value = p.manfaat_kesehatan;
      document.getElementById('pHarga').value = p.harga;
      modal.setAttribute('aria-hidden','false');
    }
    function closeModal(){
      modal.setAttribute('aria-hidden','true');
    }

    // close modal on outside click
    modal.addEventListener('click', function(e){ if (e.target === modal) closeModal(); });

  }; // end initAdminPage

  // Run seed for pages that might not call initAdminPage
  seedIfEmpty();
})();