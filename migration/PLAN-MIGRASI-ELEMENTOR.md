# Plan migrasi: desain B ke visa4bali.com (WordPress + Elementor Pro)

**Dibuat:** 2026-10-29 · **Diperbarui:** 2026-11-09 malam · **Status:** hari 1 selesai, semua masih draft, situs live belum berubah · **Mockup:** https://visa4bali-desain-b.vercel.app (source `design/2026-10-b-lengkap/`)

---

## Posisi sekarang (Senin 9 Nov, malam)

**Selesai hari 1 (tidak terlihat pengunjung):**

| Fase | Yang sudah ada | ID / file |
|---|---|---|
| 1 Backup | Export All-in-One WP Migration 1,27 GB di Mac owner (salinan di server dihapus, URL 404). Backup hPanel: belum dikonfirmasi owner. | `~/Downloads/visa4bali-com-20261109-120759-kd5lt25g74ei.wpress` |
| 1 Rollback | Isi Elementor 12 dokumen, Site Settings (kit 108), semua produk Woo + variasi. 6 library template `ROLLBACK 2026-11-09 — …`, isinya terbukti sama (jumlah elemen identik). | `audit/rollback/2026-11-09/`, template 2173–2188 |
| 1 Baseline | SEO 18 URL sitemap. Performa HP 4 halaman (Home LCP 3,5 s, Our Services 13,4 s, e-VOA 7,5 s, Contact 7,0 s). | `migration/baseline-*.{csv,md}` |
| 1 Fitur | Nested Elements diaktifkan (HTML Home terbukti tidak berubah). Popup Builder tidak tersedia di lisensi ini. | |
| 2 Fondasi | 11 warna + 13 gaya teks B sebagai global baru (id `b4b*`, global lama utuh). 27 gambar dengan alt. 3 kategori baru. 16 produk baru (draft; D12 1 th #2232 Private untuk preview). Menu "Header B". | media 2192–2218, kategori 38–40, produk 2219–2240, menu 41 |
| 3 Template | Header (draft), Footer (draft), Single Product (published, hanya berlaku untuk kategori 38–40 yang isinya non-publik), form Contact (Elementor Form → 3 email + simpan entri). | 2245, 2251, 2255, 2272 |
| 3 Komponen data | WPCode snippet: finder, grup harga, tabel visa, kepala produk, kotak harga Regular/Faster, breadcrumb, visa terkait. Tanpa JS. CSS desain B (scoped `.v4b`) hanya dimuat untuk admin sampai opsi `v4b_live` = 1. | snippet #2254, `migration/wp/` |
| 4 Halaman | Home, Visas & prices, About, Contact, Basket, Checkout sebagai draft Full Width. Basket/Checkout = shortcode WooCommerce + DOKU lama, hanya tampilannya. | 2259–2262, 2281, 2282 |
| Repo | PR #19 merged ke main (`313c09d`); cek responsif PR #21 merged (`ced82ca`). | |

Diverifikasi logged-out setelah semua perubahan di atas: produk live masih template 424, Store API publik tetap 12 produk, URL produk baru 404, CSS desain B tidak dimuat, tidak ada error.

**Perubahan dari rencana awal:** Loop Item "Visa row" dan Products Archive tidak dibuat. Penggantinya shortcode `[v4b_visa_table]`, `[v4b_finder]`, `[v4b_related]` yang membaca produk Woo langsung dan tidak bergantung JS (WP Rocket menunda JS sampai interaksi pertama). Popup diganti link WhatsApp langsung. Wordfence memblokir penyimpanan snippet PHP (false positive rule 9); owner menyetujui allowlist khusus field `wpcode_snippet_code` dan `wpcode_snippet_text` di `/wp-admin/admin.php`.

**Cek responsif (dikerjakan Senin 9 Nov sore, lebih awal dari jadwal Selasa pagi):**

Cara: setiap draft dan halaman mockup (`design/2026-10-b-lengkap`, localhost) dimuat di iframe 390 / 768 / 1024 / 1440, lalu dibandingkan otomatis: overflow horizontal, gaya teks per elemen (font, ukuran, warna, posisi), dan posisi vertikal tiap heading. Skrip: `migration/measure-responsive.js`, `fingerprint.js`, `vertical.js`, `make-harness.py`. Setiap perbaikan CSS dibuktikan dulu dengan probe `<style>` sebelum dipasang.

Hasil: tidak ada overflow horizontal di halaman mana pun. Home, Visas & prices, About cocok dengan mockup di keempat lebar (nol beda gaya). Yang diperbaiki:

| Temuan | Penyebab | Perbaikan |
|---|---|---|
| **Halaman produk desain B tetap tampil dengan template lama 424** | Plugin ShopLentor (WooLentor) memaksa template global `woolentor_woo_template_tabs[singleproductpage] = 424` ke semua produk, jadi Theme Builder 2255 tidak pernah dipakai. Kondisi 2255 juga ternyata kosong ("Instances: None"). | Filter di snippet #2254: WooLentor mundur hanya untuk produk di kategori 38/39/40; produk lain tetap 424. Kondisi 2255 dipasang ulang (In Category 38, 39, 40). Diverifikasi: produk desain B → 2255, produk live 494/351 → 424. |
| Pita abu-abu di bawah finder Home | `margin-top:110px` section "Visas for every kind of stay" tembus keluar `.v4b`, latar body tema lama terlihat | `.v4b:not(.e-con){display:flow-root}` |
| Label finder, caption, link teks, letter-spacing | Aturan kit lama (`.elementor-kit-108 …`) menimpa | Aturan tambahan di `v4b-extra.css` |
| Konten 40px lebih lebar dari mockup | Container boxed 1200 + padding 20 (mockup `.wrap` 1200 termasuk padding) | Header 2245, Footer 2251, Single Product 2255: lebar boxed 1160 |
| H1 produk 72px, paragraf deskripsi warna ink, celah ekstra di daftar, H2 pertama +64px, FAQ menyempit di 1024 | Aturan mockup bergantung pada `.pd`, dan Elementor menyisipkan `<link>` sebelum H2 pertama | Aturan `.v4b .pd-head h1`, `.v4b-desc …` |
| Form Contact: jarak kolom 10px, tanpa jarak atas, tanggal berupa teks, "(optional)" tebal | Setting widget form 2272 | Kolom 20px, margin atas 30px, date picker native, `<small>` di label (email HTML, jadi tampil wajar) |
| Checkout: field Inter abu-abu 54%, dropdown Country/State gaya lama, heading menempel, teks privasi 17px | Aturan kit `input:not(...)` spesifisitas 0,3,1; selectWoo tidak tersentuh | Selector 0,3,2 + gaya selectWoo + jarak heading |
| Basket HP: label kartu campur serif/sans, latar belang, input kupon pendek | CSS responsif WooCommerce | Label seperti kepala tabel, tanpa belang, input kupon 170px |
| Header HP: logo 65px, keranjang 30px, ikon menu 3 garis | Setting widget | Logo 57px (setting responsif), tap keranjang 44px, ikon 2 garis seperti mockup |
| Footer: copyright 13px/500 | Global "B Label" | Global "B Small" |

Snippet #2254 sekarang `874fef14…` (SHA-256 cocok dengan `migration/wp/v4b-shortcodes.wpcode.txt`). Diverifikasi logged-out setelahnya: produk live 494/351 tetap 424, produk baru 404, CSS desain B tidak dimuat, Store API tetap 12 produk.

**Catatan untuk skrip go-live dari cek ini:**
- 6 produk lama yang diperbarui di tempat **harus** dimasukkan ke kategori 38/39/40, karena itu satu-satunya jalan mereka mendapat template 2255 (filter WooLentor + kondisi 2255 sama-sama berbasis kategori). Produk yang disembunyikan tetap di kategori lama dan tetap 424.
- Menonaktifkan snippet 2054 menghapus aturan tap-target 44px; tombol Chat header jadi 35px tinggi seperti mockup. Itu memang yang dimaksud.
- Preview Home/Visas & prices sebelum go-live belum menampilkan e-VOA, C1, VOA ext, C1 ext, D1 ext, D12 ext (masih di kategori lama). Screenshot untuk tim sebaiknya diambil setelah produk itu ada, atau diberi keterangan.
- Setelah go-live cek logged-out bahwa garis bawah link teks (`.v4b a:where(:not([class]))`, spesifisitas 0,1,1) tetap menang atas `.elementor-kit-108 a`; bergantung urutan CSS jika WP Rocket menggabung/menyusun ulang CSS.
- Label form Contact berisi `<small>`; di daftar Submissions admin mungkin tampil sebagai tag mentah.

**Sisa sebelum go-live:**

| Kapan | Pekerjaan | Status |
|---|---|---|
| Selasa pagi | Cek semua draft di 390 / 768 / 1024 / 1440, perbaiki yang kurang | ✅ Senin sore, lihat di atas |
| Selasa siang | Skrip go-live (6 produk diperbarui, 5 produk lama ke Draft + 301, 16 produk dipublish, format harga Woo, template header/footer/single product, isi halaman 149/155/193/102/336/337, `v4b_live` = 1, nonaktifkan snippet 2054, redirect `/shop/` dan kategori) | belum |
| Selasa siang | Transaksi DOKU asli bernominal kecil di draft | belum |
| Selasa sore | Screenshot semua halaman (desktop + HP) untuk Ari, Ayik, Devi; approval malam itu | belum |
| Selasa | Owner konfirmasi backup hPanel | belum |
| Rabu pagi | Backup ulang → go-live → transaksi uji → cek logged-out | belum |

---

## Jadwal kilat: 9 sampai 11 November 2026 (berlaku di atas jadwal fase di bawah)

Owner minta selesai dalam 2–3 hari, **go-live paling lambat Rabu 11 Nov pagi**. Urutan fase, gerbang, dan rollback di bawah tetap berlaku. Yang berubah hanya jadwal dan beberapa langkah yang dipangkas atau ditunda.

### Keputusan (2026-11-09)

| # | Keputusan |
|---|---|
| Gerbang Fase 0 | Desain sudah di-approve semua pihak (Ari, Ayik, Devi). |
| K1 | **A:** Home (149), About Us (155), Contact Us (193) pindah dari Canvas ke **Elementor Full Width**. Satu Header dan satu Footer Theme Builder untuk seluruh situs. Template halaman diubah saat go-live (Fase 6.4), bukan sebelumnya. |
| K2 | **Backup penuh disetujui.** |
| K3 | `/our-services/` (102) jadi halaman daftar visa desain B. Awalnya "jadikan Shop page WooCommerce"; diperbarui sore harinya, lihat "Halaman Shop, Basket, Checkout". |
| K4 | **Ditunda sampai setelah go-live.** Hari 1 dicek dulu apakah fitur yang dibutuhkan ada di versi sekarang. Kalau kurang, baru update. |
| K5 | Go-live **Rabu 11 Nov pagi**, jam sepi diambil dari data GA. |

### Produk WooCommerce (keputusan owner 2026-11-09)

- **Perubahan produk diterapkan saat go-live Rabu pagi (opsi B), bukan sekarang.** Sampai go-live, produk live tidak disentuh.
- **Tidak ada produk atau variasi yang dihapus.** Yang tidak ada di desain baru disimpan dan disembunyikan ("pending tampilkan"): C12 Single Entry (variasi #668), E33G Onshore (variasi #515), Visa4Bali Onshore (#352), D1/D2 2 tahun (variasi #355), KITAS Working/Investor/Retirement bayar online (variasi #627).
- **Slug produk lama tetap.** Hanya nama yang berubah.

Cara menjalankannya:

| Produk lama | Nasib saat go-live |
|---|---|
| 494 e-VOA, 351 C1, 342 VOA ext, 346 C1 ext, 1572 D1 ext, 1575 D12 ext | Diperbarui di tempat (nama, harga, deskripsi, kategori, Faster di C1). Slug tetap. Variasi lama tidak dihapus. |
| 355 D1&D2, 627 Family Visa, 668 C12&D12, 515 E33G, 352 Onshore | Status **Draft** (utuh dengan semua variasinya, bisa dipublish lagi kapan saja) + redirect 301 dari slug lama ke produk baru penggantinya (352 → `/our-services/`). |
| — | **16 produk baru** dibuat sekarang sebagai **Draft** (tidak terlihat), dipublish saat go-live. |
| 356 Overstay Fee | Catalog visibility *Hidden*. |

Skrip go-live dan datanya disimpan di `migration/`.

### Popup "Chat with us" (2026-11-09)

Elementor di situs ini tidak punya tipe template Popup ("Type popup does not exist", lisensi Pro aktif). Keputusan owner: **opsi A**. Semua tombol chat langsung ke WhatsApp English dengan pesan otomatis berisi nama visa. Popup dibuat nanti dengan CSS `:target` (tanpa Popup Builder, tanpa JS) setelah nomor WhatsApp Rusia atau username Telegram ada. Plugin WP Chat App (tombol hijau melayang): **tetap aktif** (owner 2026-11-09).

### Halaman Shop, Basket, Checkout (2026-11-09)

- **K3 diperbarui:** `/our-services/` (102) tetap halaman biasa dengan isi desain B (tabel `[v4b_visa_table]`). Setelan Shop page WooCommerce tetap `/shop/` (335). Saat go-live: 301 `/shop/` → `/our-services/`, dan `/product-category/<slug>/` → `/our-services/#<slug>` untuk 3 kategori baru. Alasannya: kalau 102 dijadikan Shop page, WooCommerce mengganti isinya dengan arsip produk.
- **Basket dan Checkout:** struktur WooCommerce yang sekarang tetap dipakai, termasuk alur DOKU. Tampilannya disesuaikan dengan desain B lewat CSS plus header dan footer baru. Field tambahan dari mockup (WhatsApp, Nationality, tanggal tiba, hotel) ditunda sampai setelah go-live (owner: "Oke gas").

### Format harga (2026-11-09)

Satu format di seluruh situs: **"Rp 750.000"** (titik ribuan, spasi setelah Rp). Shortcode desain B sudah memakai format ini. Saat go-live, setelan WooCommerce diubah: posisi mata uang *Left with space*, pemisah ribuan `.`, tanpa desimal.

### Yang dipangkas atau ditunda

- **Uji pulihkan backup (Fase 1.2) dilewati.** Backup tetap dibuat (backup hPanel + export ke luar server). Risiko ini diterima owner.
- **Update plugin (Fase 1.6) ditunda** sampai setelah go-live, sesuai K4.
- **Bagian yang datanya belum ada disembunyikan saat go-live**, lalu dinyalakan setelah datanya datang:
  - tab "Travelling abroad" (nomor WA Ari, Feny, Nanda);
  - opsi tim Rusia dan Telegram di Popup Chat. Yang tampil hanya WhatsApp English 6287862273133.
- **Fase 7 (pantau 2 minggu)** tetap jalan, tapi setelah go-live dan tidak dihitung dalam 3 hari.

### Yang tidak boleh dipangkas

- Backup penuh sebelum mulai dan sekali lagi sebelum go-live.
- Transaksi DOKU asli, di draft dan setelah go-live. Kalau gagal di draft, go-live ditahan.
- Cek logged-out di 390 / 768 / 1024 / 1440.
- Halaman live tidak berubah tampilan sampai go-live, dan rollback hari-H siap.

### Jadwal

| Hari | Pekerjaan |
|---|---|
| **Senin 9 Nov** ✅ | Fase 1, Fase 2 (tanpa mengubah produk live), Fase 3 dan Fase 4 selesai sebagai draft. Lebih cepat dari rencana: Single Product dan semua halaman sudah jadi hari ini, dan cek responsif (jadwal Selasa pagi) juga selesai sore ini. Detail di "Posisi sekarang". |
| **Selasa 10 Nov** | Pagi: ~~cek responsif semua draft~~ (selesai Senin). Siang: skrip go-live + transaksi DOKU di draft (Fase 5). Sore: screenshot ke Ari, Ayik, Devi. **Malam: approval go-live.** |
| **Rabu 11 Nov pagi** | Fase 6: go-live di jam sepi, transaksi uji, cek semua tipe halaman logged-out. |
| Rabu siang – Jumat | Cadangan hotfix. Fase 7 mulai. |

Risiko jadwal: approval tim harus selesai Selasa malam; owner harus standby untuk login WP admin di browser MCP dan menyetujui langkah yang menyentuh data live. Kalau salah satu meleset, go-live yang mundur, bukan kualitas yang turun.

### Tambahan karena desain berubah setelah 2026-10-29

- **Faster = variable product**, atribut Processing (Regular default): C1, D1, D2, D12 1 tahun, D12 2 tahun. Family ITAS Extension memakai atribut Duration. Single Product butuh pemilih variasi. Tombol "Apply online" di Loop Item untuk produk variable mengarah ke halaman produk, tidak langsung ke keranjang.
- **Konten 19 halaman visa** (Who it is for, What we need, What the price includes, FAQ) dari `design/2026-10-b-lengkap/detail.js` masuk ke deskripsi produk Woo, bukan hanya short description. Diisi lewat WooCommerce REST API dari sesi admin, setelah export CSV produk.
- **Tab "Travelling abroad"** bukan produk: tab statis keempat di Nested Tabs dengan 3 tombol WhatsApp, bukan Loop Grid. Disembunyikan sampai nomornya ada.
- **Foto owner** memakai `img/owner.jpg` original, tanpa crop.

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
- [x] **PANDUAN-SLICING.md dirapikan** (2026-10-29, lihat bagian 7), supaya yang dibangun sesuai mockup terbaru.

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

## 7. Sinkron dengan PANDUAN-SLICING.md

Bagian yang basi (jumlah halaman, role staf, rujukan K1 dan K3) sudah diperbaiki pada 2026-10-29. Kalau salah satu keputusan K1–K5 berubah, perbarui juga bagian 1 dan 9 di panduan.
