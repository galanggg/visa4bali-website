# Plan migrasi: desain B ke visa4bali.com (WordPress + Elementor Pro)

**Dibuat:** 2026-10-29 · **Status:** rencana, belum dimulai · **Mockup:** https://visa4bali-desain-b.vercel.app (source `design/2026-10-b-lengkap/`)

Dokumen ini mengatur **urutan, gerbang, risiko, dan rollback**. Cara membangun tiap bagian di Elementor (widget, warna, font, struktur WooCommerce) sudah ada di [`design/2026-10-b-lengkap/PANDUAN-SLICING.md`](../design/2026-10-b-lengkap/PANDUAN-SLICING.md) dan tidak diulang di sini. Kondisi situs live sekarang dicatat di [`audit/TRACKER.md`](../audit/TRACKER.md).

Prinsip:

1. **Situs live tidak boleh berubah tampilan sampai hari go-live.** Semua dibangun sebagai draft, template tanpa kondisi, atau entri global baru.
2. **Go-live sekaligus, bukan per halaman.** Header, footer dan Site Settings dipakai semua halaman. Kalau diganti satu per satu, situs akan tampil campur dua desain.
3. **Setiap langkah yang menimpa sesuatu punya jalan balik** yang disiapkan *sebelum* langkah itu dijalankan.
4. **Dicek dalam kondisi logged-out.** Admin melewati delay JS WP Rocket, jadi tampilan admin bukan tampilan pengunjung.

---

## 0. Ringkasan fase

| Fase | Isi | Mengubah tampilan live? | Gerbang untuk lanjut |
|---|---|---|---|
| 0 | Persetujuan desain dan konfirmasi data | Tidak | Ayik & Devi approve, bagian 8 PANDUAN terjawab |
| 1 | Backup, versi plugin, baseline ukur | Tidak | Backup penuh ada dan sudah dicoba dipulihkan |
| 2 | Fondasi: Site Settings (entri baru), media, produk WooCommerce | Sedikit (data produk) | Produk rapi, redirect slug lama jalan |
| 3 | Template Theme Builder sebagai draft | Tidak | Semua template lolos preview |
| 4 | Halaman sebagai draft | Tidak | Semua draft lolos cek di 4 lebar layar |
| 5 | Uji menyeluruh di draft, termasuk transaksi | Tidak | Checklist Fase 5 hijau, owner setuju tanggal go-live |
| 6 | Go-live | **Ya** | Checklist hari-H hijau |
| 7 | Pantau 2 minggu, bersih-bersih | Tidak | Tidak ada 404 baru, order dan form masuk normal |

---

## 1. Fase 0: syarat sebelum mulai

Tidak ada pekerjaan di WordPress sebelum semua ini selesai.

- [ ] **Ayik & Devi approve** desain di Vercel (keputusan 2026-10-23: tidak slicing sebelum ini).
- [ ] **Data yang belum pasti** (PANDUAN bagian 8): konflik harga Woo vs flyer, nomor WhatsApp tim Rusia, username Telegram tim English dan Rusia, metode bayar DOKU yang aktif, halaman terms & privacy.
- [ ] **Pemetaan foto staf** dikonfirmasi: AYIK1 = Ari, SUMAR = Kadek, SUWANTARA = Gede.
- [ ] **Keputusan owner** di bagian 2 dokumen ini sudah diambil.
- [ ] **PANDUAN-SLICING.md dirapikan** (lihat bagian 7), supaya yang dibangun sesuai mockup terbaru.

---

## 2. Keputusan yang harus diambil owner

| # | Keputusan | Pilihan | Rekomendasi |
|---|---|---|---|
| K1 | **Template Canvas** di Home (149), About Us (155), Contact Us (193) | A. Ganti ke *Elementor Full Width*, pakai satu Header dan satu Footer Theme Builder untuk seluruh situs. B. Tetap Canvas, header dan footer ditempel per halaman lewat Template widget seperti sekarang. | **A.** Owner menolak ini pada 2026-08-15 karena memaksa header baru dibangun sekaligus. Di redesign ini header memang dibangun ulang, jadi alasan menolaknya sudah tidak berlaku. Dengan B, setiap perubahan header atau footer harus dikerjakan dua kali, seperti footer 2055/2059 sekarang. |
| K2 | **Backup** sebelum migrasi | Owner menolak backup pada 2026-08-15 dan 2026-10-18. | **Wajib untuk migrasi ini.** Migrasi kali ini menimpa semua halaman, Site Settings, dan template sekaligus. Export JSON per section, seperti yang dulu dipakai sebagai pengganti backup, tidak cukup. Lihat Fase 1. |
| K3 | **`/our-services/` vs `/shop/`** | A. 301 `/our-services/` → `/shop/`. B. Jadikan `/our-services/` halaman Shop WooCommerce. | **B.** URL `/our-services/` sudah punya rangking dan menjadi target 301 dari situs lama (`migration/old-site-301-redirects.csv`, 24 baris). Dengan A, redirect lama jadi berantai dua langkah. Kalau tetap A, perbarui juga `.htaccess` di old.visa4bali.com supaya langsung ke `/shop/`. |
| K4 | **Update Elementor dan plugin** | Elementor 3.22.3 dan Pro 3.20.0 (audit Mei) sudah tertinggal. | Update **sebelum** membangun (Fase 1), sebagai langkah terpisah dengan cek sendiri. Kalau update dilakukan di tengah pembangunan dan ada yang rusak, penyebabnya jadi sulit dipisahkan. |
| K5 | **Jendela go-live** | Hari dan jam | Pilih jam paling sepi di GA (MonsterInsights, `G-FJP9BS0KTV`), dan bukan saat tim sedang memproses banyak order. |

---

## 3. Fase kerja

### Fase 1: backup, versi, baseline

1. **Backup penuh** (file + database). Pakai backup harian di hPanel Hostinger kalau tersedia, ditambah satu export manual yang disimpan di luar server (All-in-One WP Migration, atau plugin yang setara).
2. **Coba pulihkan backup itu** di staging atau lokal. Backup yang belum pernah dicoba dipulihkan belum terbukti bisa dipakai.
3. **Export Elementor Kit** (Elementor › Tools › Import/Export Kit). Isinya Site Settings, template, dan halaman. Simpan di `audit/rollback/`.
4. **Simpan tiap halaman yang akan diganti** sebagai library template (Save as Template) dan export JSON-nya ke `audit/rollback/`: Home 149, About Us 155, Contact Us 193, Our Services 102, Basket 336, template produk 424, footer 2055 dan 2059.
5. **Cek versi dan fitur:** Elementor dan Pro, WooCommerce, WooLentor, JKit, MetForm, WP Rocket, AIOSEO Pro, plugin DOKU. Pastikan fitur yang dibutuhkan desain ada dan aktif: Flexbox Container, Nested Elements (Nested Tabs), Loop Grid, Menu Cart (side cart), Popup, Display Conditions.
6. **Update plugin** (K4) satu per satu, purge WP Rocket, lalu cek logged-out halaman utama dan checkout. Catat versi sebelum dan sesudah.
7. **Ukur baseline** halaman live di 390px (Fast 3G, CPU 4x, cold) dan 1440px: LCP, CLS, jumlah request, berat halaman, waktu form Contact muncul. Ini pembanding di Fase 5.
8. **Ambil daftar URL** dari sitemap AIOSEO (page, product, product_cat), plus title, meta description, canonical, dan H1 tiap URL. Simpan sebagai CSV di `migration/`.
9. **Inventaris konten lama** yang tidak ada di desain baru: FAQ Home, logo partner, counter (20K+ klien dan lainnya), cabang Lombok, Watch Intro, testimonial lain, teks "Luwuk". Owner menandai mana yang memang dibuang dan mana yang harus dipindah. Konten yang hilang bisa menurunkan SEO.

**Rollback:** pulihkan dari backup langkah 1. Untuk update plugin, kembalikan versi lewat WP Rollback.

### Fase 2: fondasi

Bagian ini satu-satunya yang menyentuh data live sebelum go-live, jadi kerjakan dengan hati-hati.

1. **Site Settings: tambah, jangan timpa.** Halaman live memakai Global Colours dan Global Fonts yang ada sekarang. Kalau warna *Primary* atau *Accent* langsung ditimpa, halaman lama ikut berubah hari itu juga.
   - Tambahkan warna dan font desain B sebagai **custom global baru** dengan awalan, misalnya `B Sea`, `B Stone`, `B Merah`, `B Display`. Draft memakai entri baru ini.
   - Di hari go-live (Fase 6), entri sistem dipetakan ke nilai B dan entri lama dihapus.
2. **Media:** upload semua aset dari `design/2026-10-b-lengkap/img/` dengan alt sesuai PANDUAN bagian 6. Catatan: AIOSEO menghapus tanda baca dari alt saat ditampilkan (lihat `audit/TRACKER.md` #22).
3. **Font:** Gilda Display dan Jost. Aktifkan opsi Elementor untuk memuat Google Fonts secara lokal kalau tersedia, supaya tidak ada request ke Google dan render lebih cepat.
4. **WooCommerce** (PANDUAN bagian 4):
   - Kategori `arriving-soon`, `already-in-bali`, `staying-longer`.
   - Atribut `code`, `stay`, `processing`, `fact_3_label`, `fact_3_value`.
   - Short description untuk semua produk, harga sesuai hasil konfirmasi Fase 0.
   - Produk External untuk kasus kompleks (C2, Retirement, Investor KITAS).
   - Nama produk dirapikan, Overstay Fee disembunyikan dari katalog.
5. **Redirect slug produk** yang berubah: buat 301 dari slug lama di menu Redirects AIOSEO Pro atau plugin Redirection, **di saat yang sama** dengan perubahan slug. Termasuk target dari situs lama, misalnya `/product/family-visa/` dan `/product/c12-d12-visa/`.
6. **Checkout:** pastikan halaman checkout memakai shortcode klasik `[woocommerce_checkout]`, bukan block Checkout. Widget Checkout Elementor Pro tidak bekerja dengan versi block.
7. **Field checkout tambahan** (WhatsApp, Nationality, tanggal tiba, akhir izin tinggal, hotel) lewat Checkout Field Editor atau WooLentor. Field baru ini **jangan dibuat wajib** sampai go-live, supaya pembeli yang checkout sekarang tidak terganggu.

**Cek:** halaman Shop dan produk live masih tampil dan bisa dibeli. Semua slug lama mengarah 301 ke slug baru.
**Rollback:** data produk bisa diedit balik. Simpan dulu export CSV produk sebelum diubah (Products › Export).

### Fase 3: template Theme Builder sebagai draft

Template yang dipublish dengan kondisi *Entire Site* langsung tampil di halaman live non-Canvas (Shop, produk, Basket, Privacy, My Account). Karena itu:

- Semua template dibangun dengan status **Draft**, atau dipublish **tanpa kondisi**. Untuk preview, pakai *Preview Settings* di editor.
- Yang dibangun: **Header**, **Footer**, **Popup "Chat with us"**, **Loop Item "Visa row"** (lengkap dan ringkas), **Product Archive**, **Single Product** (termasuk varian External), dan template thank-you.
- Section "Why choose us" disimpan sebagai **Global Widget atau Template**, karena dipakai di Home dan About.
- Halaman Shop, produk, dan Basket masih memakai template lama sampai go-live.

**Cek:** preview tiap template di 390 / 768 / 1024 / 1440 dengan produk asli (Simple dan External).

### Fase 4: halaman sebagai draft

1. Untuk Home, About Us, dan Contact Us, buat **halaman draft baru** dengan template sesuai K1. Bangun desain B di sana dari nol, jangan mengedit halaman live.
2. Cara pindah ke live dijelaskan di Fase 6. **Page ID, slug, dan meta AIOSEO halaman lama dipertahankan**, karena snippet, menu, dan setting Reading merujuk ke ID-nya.
3. Basket (336) dan Checkout dibangun sebagai draft duplikat dengan widget Cart dan Checkout Elementor Pro.
4. **Form Contact:** jangan ubah MetForm 195 yang live. **Duplikat dulu** menjadi form baru, lalu ubah field-nya. Pastikan notifikasi email dan tempat penyimpanan entri sama dengan form lama.
5. **Hindari animasi masuk** (Motion Effects, Entrance Animation). Di situs ini animasi masuk membuat konten tersembunyi sampai JS selesai, yaitu 3,5 sampai 10 detik di HP (`audit/TRACKER.md` #16). Desain B tidak memakai animasi, jadi biarkan kosong.

**Cek:** setiap draft dibandingkan berdampingan dengan halaman mockup Vercel di 4 lebar layar. Tidak boleh ada scroll horizontal. Tap target minimal 44px di HP. Satu H1 per halaman.

### Fase 5: uji menyeluruh sebelum go-live

Checklist ini dijalankan di draft. Semua harus lolos sebelum Fase 6.

- [ ] **Alur beli:** buka Shop, Apply online, side cart terbuka, Basket, Travellers diubah, Checkout, bayar di DOKU, halaman Order received. Lakukan dengan **transaksi asli bernominal kecil**, atau sandbox DOKU kalau tersedia. Pastikan order masuk ke admin dengan semua field baru, dan email order terkirim ke pembeli dan tim.
- [ ] **Produk External:** tombol "Ask us" membuka Popup Chat. Link WhatsApp dan Telegram benar, pesan otomatis terisi.
- [ ] **Form Contact:** kirim form uji, lalu pastikan entri masuk dan email notifikasi diterima.
- [ ] **Logged-out** di 390 / 768 / 1024 / 1440, setelah purge WP Rocket, di browser terpisah dari sesi admin.
- [ ] **Performa** dibandingkan baseline Fase 1. LCP dan CLS tidak boleh lebih buruk.
- [ ] **SEO:** title, meta, canonical, dan H1 tiap halaman sudah diisi (bukan "Apply for a Visa"). Schema LocalBusiness dan BreadcrumbList tetap ada. FAQ Schema aktif di Accordion Shop. `og:image` 1200×630, bukan logo 512×512.
- [ ] **Analytics:** event `page_view` terkirim ke `G-FJP9BS0KTV`. Event e-commerce (add_to_cart, purchase) terkirim kalau sebelumnya ada.
- [ ] **Owner, Ari, Ayik, dan Devi** sudah melihat draft dan setuju tanggal go-live.

### Fase 6: hari go-live

Kerjakan berurutan, di jendela K5. Satu orang memegang admin, satu orang mengecek logged-out.

1. Backup penuh sekali lagi, langsung sebelum mulai.
2. **Site Settings:** petakan global sistem (Primary, Secondary, Text, Accent) dan font ke nilai desain B.
3. **Theme Builder:** publish Header dan Footer dengan kondisi *Entire Site*. Publish Product Archive, Single Product, dan Popup. Matikan atau hapus kondisi footer lama 2059.
4. **Halaman utama** (Home 149, About Us 155, Contact Us 193):
   - Isi halaman lama sudah tersimpan sebagai library template di Fase 1.
   - Buka halaman asli, hapus isinya, lalu sisipkan isi draft lewat *Insert Template*. Kalau K1 = A, ubah template halaman ke Elementor Full Width.
   - Hasilnya ID, slug, dan meta AIOSEO tetap sama.
5. **Basket dan Checkout:** isi halaman asli dengan cara yang sama.
6. **Snippet WPCode 2054** (CSS mobile Round 1–4). Semua 14 section-nya menarget struktur lama: wrapper footer, header lama, grid tim JKit, dan selector teks atau tap target umum yang bisa mengenai widget baru. **Nonaktifkan seluruh snippet**, lalu cek ulang. Jangan dihapus dulu, karena snippet ini adalah jalan balik.
7. **Snippet `hello_elementor_header_site_title_tag`** (H1 ganda di header tema): tetap aktif sampai terbukti tidak lagi dibutuhkan.
8. **Menu:** Header Menu (term 5) diubah jadi Home, Visas & prices, About us, Contact. Tombol Contact desktop yang lama ikut hilang bersama header lama.
9. **K3:** atur halaman Shop atau redirect `/our-services/`.
10. Field checkout baru dijadikan wajib sesuai desain.
11. **Purge WP Rocket** (Clear and Preload Cache, *bukan* "Save Changes and Optimize").
12. **Cek logged-out** semua tipe halaman. Lakukan juga satu transaksi uji.

**Rollback hari-H**, kalau ada yang rusak dan tidak bisa diperbaiki dalam 30 menit:
- Isi halaman dikembalikan dari library template lama.
- Kondisi Theme Builder baru dimatikan, kondisi footer 2059 dinyalakan lagi.
- Global Colours dan Global Fonts dikembalikan dari export Kit.
- Snippet 2054 diaktifkan kembali, lalu purge.
- Kalau semua cara itu gagal, pulihkan backup langkah 1.

### Fase 7: setelah go-live (2 minggu)

- **Hari 1–3:** cek Search Console untuk 404 dan crawl error, cek order masuk, cek entri form. Crawl semua URL di CSV Fase 1 dan target di `migration/old-site-301-redirects.csv`: semua harus 200 atau 301 satu langkah, tidak ada 404.
- **Minggu 1–2:** bandingkan trafik organik, conversion, dan Core Web Vitals dengan sebelum go-live.
- **Bersih-bersih**, setelah 2 minggu stabil:
  - Hapus snippet 2054, library template 2055, footer 2059, dan header inline lama.
  - Hapus entri global lama dan halaman draft.
  - Hapus plugin yang tidak lagi dipakai (JKit kalau tidak ada widget yang tersisa, Envato Elements, dan lainnya; lihat `audit/security.md`).
- **Update dokumen:** `audit/TRACKER.md` (artefak live baru), memory, dan PANDUAN.

---

## 4. Yang ada di situs sekarang dan terdampak

| Artefak | ID | Nasib setelah migrasi |
|---|---|---|
| Halaman Home, About Us, Contact Us | 149, 155, 193 (Canvas) | Isi diganti, ID dan slug tetap |
| Our Services | 102 | Tergantung K3 |
| Basket / Shop / My Account / Privacy | 336 / 335 / 338 / 3 | Basket diisi ulang. Shop memakai Product Archive. My Account dan Privacy cukup ikut Header dan Footer baru. |
| Template produk | 424 | Diganti Single Product baru |
| Footer Theme Builder | 2059 | Kondisi dimatikan saat go-live, dihapus di Fase 7 |
| Footer library (Template widget) | 2055 | Ikut hilang bersama isi halaman lama, dihapus di Fase 7 |
| Header inline per halaman | `705659ef`, `8463f45`, `2b01d8b7`, `d400355`, `2ff20782` | Ikut hilang bersama isi halaman lama |
| WPCode snippet CSS mobile | 2054 (14 section) | Dinonaktifkan saat go-live, dihapus di Fase 7 |
| Menu Header Menu | term 5 | Item disesuaikan |
| MetForm Contact | 195 | Tidak diubah. Form baru hasil duplikat yang dipakai. |
| WP Rocket: exclusion `gtag/js` | setting | Tetap |
| MonsterInsights / GA4 | `G-FJP9BS0KTV` | Tetap, dicek event-nya |
| AIOSEO Pro | meta per halaman, schema, sitemap | Dicek per halaman. Tambah redirect untuk slug yang berubah. |
| DOKU | gateway | Tetap, diuji dengan transaksi asli |

---

## 5. Risiko utama

| Risiko | Dampak | Pencegahan |
|---|---|---|
| Global Colours/Fonts ditimpa saat membangun | Halaman live berubah warna dan font di tengah pembangunan | Tambah entri baru, petakan di hari-H (Fase 2.1) |
| Template Theme Builder dipublish dengan kondisi aktif | Shop dan produk live tiba-tiba memakai desain setengah jadi | Draft atau tanpa kondisi sampai hari-H (Fase 3) |
| Snippet 2054 mengenai widget baru | Ukuran teks, padding, atau tap target berbeda dari mockup | Nonaktifkan saat go-live, lalu cek (Fase 6.6) |
| Checkout gagal setelah go-live | Kehilangan penjualan | Transaksi asli di Fase 5 dan di hari-H, rollback siap dalam 30 menit |
| Slug atau konten hilang | Rangking turun, 404 | CSV URL dan inventaris konten di Fase 1, crawl di Fase 7 |
| Tidak ada backup | Tidak bisa kembali kalau rollback per bagian gagal | K2: backup wajib dan sudah dicoba dipulihkan |
| Animasi masuk Elementor | Konten tersembunyi beberapa detik di HP | Jangan dipakai (Fase 4.5) |
| Update plugin di tengah jalan | Penyebab kerusakan sulit dilacak | Update di Fase 1 saja (K4) |

---

## 6. Siapa mengerjakan apa

| Peran | Tugas |
|---|---|
| Owner (Galang) | Keputusan K1–K5, login WP admin, menjalankan atau menyetujui tiap fase |
| Ari / Ayik / Devi | Approve desain dan draft, konfirmasi data di Fase 0, approve go-live |
| Claude (lewat Chrome DevTools MCP, sesi admin owner) | Membangun di Elementor sesuai PANDUAN, mengukur, mengecek logged-out, mencatat ke `audit/` |

Kredensial tidak pernah lewat chat. Owner login sendiri di browser yang dikendalikan MCP (sama seperti Round 1–4).

---

## 7. Yang perlu diperbaiki di PANDUAN-SLICING.md (Fase 0)

- Pendahuluan masih menyebut 5 halaman. Sekarang ada 8 file: tambahan `product-chat.html`, `basket.html`, `checkout.html`.
- Bagian 8 masih menulis role Ayik, Sumar, dan Juniarta belum ada. Sekarang sudah diisi dari daftar Ayik (2026-10-28). Yang tersisa hanya konfirmasi pemetaan file foto.
- Bagian 1 "Keputusan dulu: template Canvas" perlu dirujukkan ke K1 di dokumen ini.
- Saran redirect `/our-services/` di bagian 1 perlu disesuaikan dengan K3 (risiko redirect berantai dari situs lama).
