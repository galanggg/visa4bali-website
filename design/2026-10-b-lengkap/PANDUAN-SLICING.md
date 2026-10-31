# Panduan slicing: arah B "Resor Jimbaran" ke WordPress + Elementor Pro

Mockup ini terdiri dari 7 template halaman: `home.html`, `shop.html`, `product.html` (satu template untuk 19 visa, `product.html?visa=<slug>`), `basket.html`, `checkout.html`, `about.html`, `contact.html`. Semuanya memakai satu stylesheet, `style.css`, dan dua file data: `site.js` (daftar visa) dan `detail.js` (deskripsi produk per visa). `data-visa.html` adalah checklist internal untuk Ari (bagian deskripsi yang belum ada datanya), bukan halaman situs. Mockup ini sengaja dibuat mengikuti cara kerja Elementor:

- Setiap warna dan font di `:root` (`style.css`) = satu **Global Colour / Global Font**.
- Breakpoint hanya dua, sama dengan default Elementor: **tablet ≤1024px**, **mobile ≤767px**.
- `.wrap` = Container *boxed*, content width **1200px**, padding kiri-kanan **20px**.
- Setiap section punya komentar `<!-- EL: ... -->` di HTML-nya. Komentar itu menyebut widget Elementor yang dipakai.

Status: arah B dipilih Ari & Devi pada 2026-10-23, lalu direvisi beberapa kali (terakhir 2026-10-29). Harga dan beberapa fakta masih menunggu konfirmasi; daftarnya ada di bagian 8. Slicing ke Elementor belum boleh dimulai sebelum Ayik & Devi menyetujui desain ini.

Panduan ini menjelaskan **cara** membangun tiap bagian. **Urutan, syarat tiap fase, risiko, dan rollback** ada di `migration/PLAN-MIGRASI-ELEMENTOR.md`. Kalau keduanya berbeda, ikuti plan migrasi.

---

## 1. Peta halaman

| Mockup | WordPress | Dibangun dengan |
|---|---|---|
| `home.html` | Page **Home** (149) | Elementor page |
| `shop.html` | WooCommerce **Shop** (`/shop/`, 335) | Theme Builder › **Product Archive** |
| `product.html?visa=<slug>` | `/product/*`, semua 19 visa: yang dibeli online (Simple/Variable product) dan yang lewat chat (External product) | Theme Builder › **Single Product**, satu template |
| `basket.html` | WooCommerce **Basket** (`/basket/`, 336) | Elementor Pro widget **Cart** |
| `checkout.html` | WooCommerce **Checkout** (+ halaman *Order received* di bagian bawah file) | Elementor Pro widget **Checkout** + template thank-you |
| `about.html` | Page **About Us** (155) | Elementor page |
| `contact.html` | Page **Contact Us** (193) | Elementor page |
| header & footer | semua halaman | Theme Builder › **Header** dan **Footer** |

`/our-services/` isinya akan sama dengan Shop, supaya daftar harga cuma ada **satu** dan selalu sama dengan harga checkout. Saran: jadikan page `our-services` (102) sebagai halaman Shop di WooCommerce › Settings › Products, **jangan** redirect ke `/shop/`. URL `/our-services/` sudah punya rangking dan menjadi target 24 redirect 301 dari situs lama (`migration/old-site-301-redirects.csv`); kalau dialihkan lagi ke `/shop/`, redirect itu jadi berantai dua langkah. Keputusan ini = **K3** di plan migrasi.

### ⚠️ Keputusan dulu: template Canvas

Home, About Us, dan Contact Us sekarang memakai template `elementor_canvas`. Di Canvas, header dan footer Theme Builder **tidak akan pernah tampil**. Karena itu header dulu disalin manual ke setiap halaman (lihat `audit/TRACKER.md`).

Redesign ini adalah saat yang tepat untuk membereskannya:
1. Ubah ketiga halaman itu ke **Elementor Full Width**.
2. Hapus header dan footer inline lama di masing-masing halaman, juga Template widget footer 2055.
3. Buat satu Header dan satu Footer di Theme Builder, dengan kondisi *Entire Site*.

Pada 2026-08-15 owner pernah menolak scope ini karena memaksa header baru dibangun sekaligus. Di redesign ini header memang dibangun ulang, jadi alasan itu sudah tidak berlaku. Tetap perlu konfirmasi ulang sebelum mulai: ini keputusan **K1** di plan migrasi (rekomendasi: Full Width).

---

## 2. Site Settings (Elementor › Site Settings)

### Global Colours

| Nama di Elementor | Token CSS | Hex | Dipakai untuk |
|---|---|---|---|
| Primary | `--sea` | `#1D3940` | band biru laut, band "Why choose us" (revisi Ayik 2026-10-29), kode visa, ikon |
| Secondary | `--stone` | `#EEECE7` | band batu kapur, kotak harga, form |
| Text | `--ink` | `#1C2326` | teks utama |
| Accent | `--merah` | `#C8102E` | tombol utama, titik aktif |
| Accent Dark | `--merah-2` | `#A30D25` | hover tombol |
| Text Muted | `--muted` | `#566064` | paragraf sekunder |
| Border | `--line` | `#D9D6CF` | garis pemisah |
| On Sea | `--on-sea` | `#DCE6E7` | teks di atas biru laut |
| Link on Sea | `--merah-muda` | `#F4B4AC` | link di atas biru laut |
| White | `--white` | `#FFFFFF` | latar |

Teks di atas tombol merah **selalu putih** (kontras 5,9:1). Teks gelap di atas merah hanya 2,7:1 dan tidak lolos WCAG.

### Global Fonts (Google Fonts, sudah tersedia di Elementor)

Hanya **11 gaya teks**, diaudit 2026-10-23. Tidak ada ukuran lain di mockup selain badge keranjang, ikon +/− FAQ, dan input form. Token CSS-nya ada di `:root`, dengan nama `--t-*`.

| Global Font | Font | Desktop / HP | Line height | Dipakai untuk |
|---|---|---|---|---|
| Display | Gilda Display 400 | 88 / 46 | 1.0 | judul hero Home |
| H1 | Gilda Display 400 | 64 / 42 | 1.04 | judul halaman dalam & produk |
| H2 | Gilda Display 400 | 56 / 36 | 1.08 | judul section |
| H3 | Gilda Display 400 | 36 / 28 | 1.12 | judul grup visa, judul form/popup, "From Rp…", harga di kotak produk |
| H4 | Gilda Display 400 | 28 / 24 | 1.15 | sub-judul kolom, kode visa di Shop & produk, judul kantor |
| H5 | Gilda Display 400 | 24 / 21 | 1.2 | FAQ, nama staf, judul footer, kode di finder, label bahasa popup |
| Serif text | Gilda Display 400 | 21 / 19 | 1.45 (1.2 untuk satu baris) | testimoni, harga di daftar, fakta produk, daftar area |
| Lead | Jost 400 | 19 | 1.65 | paragraf intro di bawah judul |
| Body | Jost 400 / 500 | 17 | 1.65 | teks utama, menu, sub-judul kecil (500) |
| Small | Jost 400 / 500 | 15 | 1.55–1.65 | meta, catatan, caption, tombol (500) |
| Label | Jost **500**, UPPERCASE, letter-spacing 0.1em | 13 | 1.3 | eyebrow, label "STAY/PROCESSING", kredit foto, copyright |

Aturan:
- Jost hanya dimuat **400 dan 500**. Jangan pakai Bold 700 di Elementor, karena browser akan membuat bold palsu. `<b>` dan `<strong>` diset ke 500.
- Gilda Display hanya punya 400.
- Input form tetap **16px**, supaya iPhone tidak auto-zoom saat input diketuk.
- Di Elementor 3.12+, ukuran fluid bisa diisi `clamp()` dengan unit *custom* (salin dari `--t-*`). Atau isi angka desktop/HP di tabel; untuk tablet pakai angka tengah.
- Lebar paragraf maksimal sekitar 66–75 karakter (`max-width: 66ch`). Di Elementor, atur lewat *Custom width* pada widget Text Editor.

### Jarak
- Judul section → konten: **56px** desktop, **40px** tablet/HP (`--gap-head`).
- Judul → paragraf lead: 20px. Eyebrow → judul: 14px.

### Buttons
- Utama: latar Accent, teks putih, radius 999px, padding 16/24. Hover: Accent Dark.
- Outline: border 1px Text, latar transparan. Hover: latar Secondary.

### Layout
- Content width 1200, padding container 20.
- Padding section: **110px** desktop, **72px** tablet/mobile. Section kecil: 80 / 56.
- Breakpoint: biarkan default (Mobile 767, Tablet 1024). Jangan tambah breakpoint lain.

---

## 3. Header & Footer (Theme Builder)

**Header** (`<header class="top">`): Container 3 kolom (1fr auto 1fr), tinggi 84px, sticky top, garis bawah 1px Border.
- Kiri: Site Logo, tinggi 32px.
- Tengah: Nav Menu (Home, Visas & prices, About us, Contact). Item aktif diberi garis bawah 1px. Breakpoint dropdown: **Tablet**.
- Kanan: **Menu Cart** widget (revisi Ari 2026-10-23, menggantikan nomor telepon). Icon tas, teks "Basket" di desktop, Items Indicator: *Bubble* merah, Cart Type: **Side Cart**. Side cart berisi daftar visa, total, satu tombol merah "Checkout", dan catatan "Payments go to VISA4BALI only…". Di tablet/mobile teks "Basket" disembunyikan, lalu ditambah tombol merah kecil "Chat" (buka Popup Chat, bagian 3b) + hamburger. Atur dengan *Responsive › Hide On*.

**Footer** (`<footer class="foot">`): latar Secondary, 3 kolom rata tengah (alamat & jam · kontak & sosial · link), copyright, lalu strip foto sawah setinggi 150px dengan mask gradasi. Strip ini bisa dibuat sebagai Container dengan background image `sidemen.jpg` dan CSS `mask-image` (Custom CSS container).

### 3b. Popup "Chat with us" (revisi Ari 2026-10-23)

Semua tombol chat ("Ask us" di baris visa, "Ask us first" di produk, "Chat with us" di CTA, "Chat" di header HP) **tidak langsung ke WhatsApp**. Tombol-tombol ini membuka popup pilihan:

| | WhatsApp | Telegram |
|---|---|---|
| **English speaking** (We reply in English) | wa.me/6287862273133 | ❓ username belum ada |
| **Russian speaking** (Отвечаем на русском) | ❓ nomor belum ada | ❓ username belum ada |

- Elementor: Templates › Popups › "Chat with us". Lebar 520px, rata tengah. Di mobile jadi *bottom sheet* (posisi bawah, lebar 100%, radius atas 12px). Di dalamnya ada Heading + 2 inner Container (label bahasa + 2 Button).
- Pemicu: setiap tombol chat diberi Link = Dynamic Tag **Actions › Popup › Open "Chat with us"**.
- Link WhatsApp diisi pesan otomatis: `https://wa.me/NOMOR?text=Hello Visa4Bali, I'd like to ask about …`. Versi Rusia: `Здравствуйте! Хочу узнать про …`. Di mockup, nama visa ikut otomatis. Di Elementor, pesan cukup umum, atau pakai satu popup per produk kalau mau spesifik.
- Telegram (`https://t.me/USERNAME`) tidak bisa diisi pesan otomatis ke akun pribadi.
- Di halaman Contact, pilihan yang sama tampil langsung (inline) di kotak biru, bukan popup.
- Tombol produk "chat" (External product) arahkan ke URL `#elementor-action...` milik popup, bukan wa.me. Atau biarkan tombol Add To Cart tetap, lalu ganti dengan Button biasa di Loop Item dengan kondisi visibilitas per tipe produk.

---

## 4. WooCommerce: struktur produk

Supaya Shop dan halaman produk bisa diisi otomatis lewat Loop Grid, siapkan ini dulu:

1. **Product categories** (slug harus sama dengan anchor di mockup):
   - `arriving-soon`: Arriving soon. "Short stays for holidays, meetings and visiting."
   - `already-in-bali`: Already in Bali. "We collect your passport and bring it back stamped."
   - `staying-longer`: Staying longer. "Multiple-entry visas and stay permits, one case manager."
2. **Atribut produk** (Products › Attributes) atau field ACF: `code` (e-VOA, C1, D12…), `stay`, `processing`. Ketiganya ditampilkan lewat Dynamic Tag.
3. **Dua jenis tombol, tanpa coding:**
   - Visa standar (`route: "buy"` di `site.js`) = **Simple product**. Teks tombol: "Apply online". Arahkan langsung ke checkout: WooCommerce › Settings › Products › centang *Redirect to the cart page after successful addition* (di situs ini halamannya bernama Basket), atau pakai link `/checkout/?add-to-cart=ID`.
   - Kasus kompleks (`route: "chat"`) = **External/Affiliate product**, Button text: "Ask us". Tombolnya harus membuka Popup Chat (bagian 3b), bukan langsung ke wa.me.
   - Klik "Apply online" di Shop/Home/produk menambahkan visa ke basket (AJAX add to cart) lalu membuka side cart. Aktifkan WooCommerce › Settings › Products › *Enable AJAX add to basket buttons on archives*, dan matikan redirect ke halaman basket.
4. **Deskripsi produk** ditulis dengan H2: *What we need from you*, *What the price includes*, *How it works*, *Good to know*. Product Content akan menampilkannya sesuai gaya mockup lewat Custom CSS (`.pd-block`, `.ticks`, `.faq`).
5. **Gambar produk tidak dipakai.** Gambar sekarang berupa screenshot daftar harga, dan prinsip PRODUCT.md adalah "harga berupa teks, bukan gambar". Hapus widget Product Images dari template.
6. **Short description** wajib diisi untuk setiap produk (1–2 kalimat). Saat ini semuanya kosong.

### Bersih-bersih produk yang ada (12 produk live)

| ID | Nama sekarang | Masalah |
|---|---|---|
| 356 | Overstay Fee (ru) | Ini biaya, bukan visa. Set *Catalog visibility: Hidden*. |
| 351 | Visa4bali Offshore | Nama tidak jelas, kategori "визовые услуги". Ini C1 Tourist Visa? |
| 352 | Visa4Bali Onshore | Nama tidak jelas, Rp 12.500.000. Ini KITAS apa? |
| 346 | TOURIST VISA 211 Extension | Huruf kapital semua, slug `-ru` |
| 342 | VISA ON ARRIVAL EXTENSION | Huruf kapital semua, slug `-ru` |
| 355 | Offshore Business & Tourist Visa multiple entry D1 & D2 | Terlalu panjang. Usul: "Multiple Entry Visa D1/D2, 1 year" |
| 627, 355 | Family Visa, D1 & D2 | Tanpa gambar (tidak masalah, gambar tidak dipakai) |
| semua | Kategori kosong / "визовые услуги" | Pindahkan ke 3 kategori di atas |

Kalau slug diubah, buat redirect 301 dari slug lama.

---

## 5. Per halaman

### Home (`home.html`)
| Section | Widget |
|---|---|
| Hero | Container full width, min-height 640 (tablet 520, mobile 460), background image `sidemen.jpg` + overlay gradien. Heading H1 + Text Editor. Tanpa kredit foto (lisensi Unsplash tidak mewajibkan). |
| Visa finder | Container boxed, margin-top −104 (tablet/mobile 0), shadow. **Nested Tabs** vertikal (mobile: horizontal, tab berbentuk pil). Isi tiap tab: **Loop Grid** produk kategori itu, maksimal 3, memakai Loop Item "Visa row (ringkas)". |
| Visas for every kind of stay | Container latar Primary. 3 inner Container: label, "From Rp …", deskripsi, 3 baris contoh, link ke `/shop/#kategori`. Angka "From" diketik manual atau lewat shortcode harga minimum. |
| Tell us about your trip | Heading + Text + Button WhatsApp |
| Why choose us | Latar Primary, teks putih, teks kecil `--on-sea` `#DCE6E7`. Foto radius 4px seperti gambar lain. 2 kolom: 3 poin + 1 foto Pak Rolly dengan klien (`rolly-client.jpg`). Simpan sebagai **Global Widget/Template**, karena dipakai lagi di About. |
| Testimonials | Latar Secondary, 3 kolom. Review asli dari homepage lama. |
| About teaser | 2 kolom teks + foto tim + link ke About |

### Shop (`shop.html`), Theme Builder › Product Archive
| Section | Widget |
|---|---|
| Hero | Container Primary + background image dengan opacity 28% (luminosity). H1 "Visas & prices" + 3 kolom ringkasan kategori. |
| Daftar | 3 Container, satu per kategori: Heading + deskripsi kategori + **Loop Grid** (1 kolom, query: kategori ini, urut menu_order). |
| Loop Item "Visa row" | Container grid 6 kolom: `code` (attribute) · Product Title (link) · Stay · Processing · Product Price · Add To Cart. Tablet/mobile: 3 kolom (lihat `.pt-row` di `style.css` bagian tablet). |
| How it works | Latar Secondary, 4 langkah: Icon Box atau Text Editor bernomor |
| FAQ | **Accordion**, aktifkan FAQ Schema. Di bawahnya peringatan penipuan (Icon Box). |

### Single Product (`product.html`)
| Section | Widget |
|---|---|
| Breadcrumb | WooCommerce Breadcrumb |
| Kolom kiri | `code` (Dynamic) · Product Title (H1) · Short Description · 3 fakta (Stay, Processing, Longest stay) dari atribut · Product Content |
| Kolom kanan | Container latar Secondary, **Sticky** top offset 112, hanya desktop: Product Price · teks "Includes…" · Add To Cart · Button WhatsApp · Icon List 3 jaminan |
| Kotak harga di HP | Container yang sama diduplikasi di bawah fakta, *Hide On Desktop*. Container sticky aslinya *Hide On Tablet & Mobile*. |
| Related | Loop Grid "Visa row", query Related/kategori sama, 3 item |

**Varian chat (contoh `product.html?visa=e33g`; `product-chat.html` lama sekarang hanya redirect ke situ).** Template Single Product-nya sama. Bedanya ada di produknya: External product, jadi Add To Cart menampilkan tombol "Ask us" yang membuka Popup Chat. Di bawahnya ditambah satu baris "We check your documents with you on WhatsApp or Telegram before you pay." Pakai widget Text Editor dengan Display Condition *product type = external*, atau buat dua template Single Product dengan kondisi per kategori `staying-longer`. Fakta ketiga juga beda per produk (e-VOA: *Longest stay*, E33G: *Income*), jadi simpan sebagai atribut produk `fact_3_label` dan `fact_3_value`.

### Basket (`basket.html`), WooCommerce › Basket
| Section | Widget |
|---|---|
| Langkah 1-2-3 | HTML/Icon List kecil: Basket → Details & payment → Done. Dipakai juga di Checkout dan Order received. |
| Daftar | Widget **Cart** (layout two columns). Tiap baris: kode, nama, stay · processing, **Travellers** (= quantity WooCommerce, maksimal 10), subtotal, tombol hapus. Aktifkan *Update cart automatically*. |
| Ringkasan | Kolom kanan, latar Secondary, sticky: jumlah visa, total, catatan harga, tombol "Continue to checkout", 2 jaminan |

Label quantity diganti jadi "Travellers", karena setiap orang butuh visanya sendiri. Ganti teks lewat Loco Translate atau filter `woocommerce_cart_item_quantity`.

### Checkout (`checkout.html`), WooCommerce › Checkout
| Section | Widget |
|---|---|
| Your details | First name, Last name, Email, **WhatsApp number**, **Nationality**. Alamat billing dimatikan, karena visa tidak butuh alamat. |
| Your trip (opsional) | Arrival in Bali, Current stay permit ends, Hotel or villa (untuk jemput paspor) |
| Payment | Hanya **DOKU** (gateway yang sekarang dipakai situs live). Pembeli menyelesaikan bayar di halaman DOKU. Checkbox terms + privacy wajib. Tombol: "Pay Rp …". |
| Your order | Daftar visa × jumlah, total, link "Change basket", 3 langkah *What happens next*, jaminan pembayaran |
| Order received | Bagian `#done` di file yang sama: "Thank you, {nama}", nomor order, 4 langkah setelah bayar, tombol Chat + Back to home. Di WordPress pakai template thank-you dari WooLentor (sudah terpasang) atau Elementor. |

Field tambahan butuh plugin field editor, misalnya *Checkout Field Editor for WooCommerce*, atau fitur WooLentor kalau versinya mendukung. Simpan juga field-field ini ke order supaya tim bisa melihatnya di admin.

### About (`about.html`)
| Section | Widget |
|---|---|
| Hero | Seperti hero Shop, foto `ulun-danu.jpg` |
| Our story | 2 kolom 5/6: Image (owner) + caption · eyebrow · H2 · 2 paragraf · kalimat sorotan bergaris kiri merah |
| How we work | Latar Primary, 3 kolom |
| Team | 19 × **Image Box** (atau Loop Grid kalau staf dibuat CPT). 5 kolom desktop, 3 tablet, 2 mobile. Foto 4:5, latar putih. |
| Visit our office | Satu kartu lebar, 2 kolom 1.5/1: **Google Maps** widget (tinggi 380, tablet/HP 300/240) · Heading + alamat + jam + link "Get directions". Cabang Lombok dihapus atas permintaan Ari (2026-10-23). |
| CTA | Sama dengan Home |

### Contact (`contact.html`)
| Section | Widget |
|---|---|
| Hero | Seperti hero Shop, foto `uluwatu.jpg` |
| Kontak + form | 2 kolom 5/7. Kiri: Container Primary (CTA WhatsApp) + Icon List. Kanan: **MetForm 195** yang diubah fieldnya: Name, Email, WhatsApp (opsional), Nationality, What do you need (select), tanggal (opsional), Message. Style input: latar putih, border `#D9D6CF`, radius 4, padding 13/14. |
| Passport pick-up | Teks + 9 area (3 kolom). Sumber: deskripsi produk VOA Extension. |
| Visit our office | Sama dengan About + peringatan penipuan |

---

## 6. Aset gambar (`img/`)

| File | Ukuran | Upload ke Media Library dengan alt |
|---|---|---|
| `sidemen.jpg` | 1600×1066 | hero Home (alt lihat `home.html`), hero Shop (alt kosong), strip footer. Sawah Sidemen + Gunung Agung, Geio Tischler / Unsplash (lisensi Unsplash, kredit tidak wajib). Pilihan Ayik 2026-10-29 |
| `rolly-client.jpg` | 1400×933 | band Why choose us, alt lihat `home.html`. Dari BAPAK ROLL.jpg (kiriman Ari 2026-10-28) |
| `team-office.jpg` | 1800×900 | foto tim di Home, radius 4px, lebar penuh. Alt lihat `home.html`. Dari fotoasd.jpg (kiriman Ari 2026-10-28), di-crop 2:1 |
| `ulun-danu.jpg` | 1600×1067 | hero About (alt kosong). Pura Ulun Danu, Katarzyna Zygnerska / Unsplash (lisensi Unsplash, kredit tidak wajib). Revisi Ari 2026-10-29 |
| `uluwatu.jpg` | 1600×1065 | hero Contact (alt kosong). Pantai Uluwatu, Max Kukurudziak / Unsplash (lisensi Unsplash, kredit tidak wajib). Revisi Ari 2026-10-29 |
| `owner.webp` | 768×1296, transparan | Foto Pak Rolly ROLLY3.jpg (revisi Ayik 2026-10-28), background putih dihapus. Di Elementor: Image widget tanpa latar (transparan di atas putih), gambar rata kiri-bawah, sejajar caption |
| `staff/*.jpg` | 19 × 480×600 | "Nama, Role at Visa4Bali". Di-crop 4:5 dari foto studio seragam merah-hitam (PHOTO.zip, Ari 2026-10-28). Urutan dan role dari Ayik 2026-10-28 (kiri ke kanan), lihat `team` di `about.html`. File AYIK1 = Ari, SUMAR = Kadek, SUWANTARA = Gede (dipetakan dengan eliminasi, ⚠️ perlu konfirmasi). Foto Marlon menyusul 2026-10-28 |
| `logo.png`, `logo-light.png` | 360×178 | Visa4Bali |

Alt text ditulis di Media Library, bukan di widget. Lihat memori pipeline alt text (#22): AIOSEO membuang tanda baca.

---

## 7. Yang di mockup pakai JavaScript, di Elementor tidak perlu

| Mockup (`site.js`) | Di Elementor |
|---|---|
| `V4B.finder` | Nested Tabs + Loop Grid |
| `V4B.table` | Loop Grid per kategori |
| `V4B.stays` | 3 Container statis |
| Daftar staf di `about.html` | 20 Image Box |
| Toggle menu mobile | Nav Menu widget |
| `V4B.basket` (side cart, Basket, ringkasan Checkout, jumlah Travellers) | Menu Cart + Cart + Checkout widget, data dari sesi WooCommerce |
| Submit di Checkout → halaman Done | WooCommerce → DOKU → *Order received* |

Data di `site.js` hanya untuk mockup. Sumber kebenaran di WordPress adalah produk WooCommerce.

---

## 8. Masih perlu konfirmasi Ari/Devi sebelum live

Harga, lama proses dan daftar visa di mockup mengikuti **revisi Ari 2026-10-31** (PDF "White and Black Minimalist Shoes For Men Facebook Cover"). Checkout memakai harga WooCommerce, jadi produk berikut harus disesuaikan di Woo sebelum live:

| Visa | Mockup (revisi Ari) | WooCommerce live | Yang perlu dilakukan di Woo |
|---|---|---|---|
| e-VOA (#494) | 750.000, 2–3 hari kerja | 750.000, "1–2 working days" | ubah teks proses |
| C1 Tourist Visa (#351) | **mulai** 2.000.000, 5–9 hari kerja | 2.000.000 | jadikan variable product kalau ada opsi lebih mahal |
| C2 Business Visa | 3.500.000, 7–9 hari kerja (regular saja) | tidak ada produk | External product (WhatsApp) |
| C1 Extension (#346) | 1.800.000, 8–10 hari kerja | 1.800.000 | isi proses |
| D1 Extension (#1572) | 1.800.000, 8–10 hari kerja | 1.800.000 ("D1/D2") | pisahkan D1 dan D2? |
| D2 Business Extension | sama dengan D1 | ikut #1572 | produk/variasi baru |
| D12 Pre-Investment Extension (#1575) | 3.250.000, +180 hari, 10–12 hari kerja | 3.000.000 | ubah harga |
| Bridging Visa (Transitional Stay Permit) | 3.000.000, +60 hari, 7–9 hari kerja | tidak ada produk | produk baru |
| Family ITAS Extension | +1 th 10.000.000 / +2 th 15.500.000, 14–21 hari kerja | tidak ada produk | variable product, atribut Duration |
| Retirement KITAS Extension | 10.000.000, +1 th, 14–21 hari kerja | tidak ada produk | produk baru |
| E33G Extension | 12.000.000, +1 th, 14–21 hari kerja | tidak ada produk | produk baru |
| Working KITAS Extension | 14.300.000 + USD 1.200, +1 th, 2,5–3 bulan | tidak ada produk | External product; biaya USD tampil sebagai teks |
| Investor KITAS Extension | 16.000.000, +2 th, 14–21 hari kerja | tidak ada produk | produk baru |
| Family KITAS offshore (#627) | 11.500.000, 7–9 hari kerja | 11.000.000 (onshore) | ubah nama, harga, proses |
| D12 Multiple Entry 1 th (#668) | 7.000.000, 7–9 hari kerja | 7.000.000 | isi proses |
| E33G Remote Worker (#515) | 12.500.000, 9–12 hari kerja | 13.000.000, "5-6 working days" | ubah harga dan proses |
| VOA Extension cepat | **dihapus** | tidak ada produk | — |
| D1 Multiple Entry 1 th (#355) | **dihapus** dari Staying longer | ada | sembunyikan (Catalog visibility: Hidden) |

Asumsi mockup yang perlu dicek Ari: stay D2 = +60 hari (Ari hanya menulis "harga dan proses sama kyk D1"); tombol Bridging, KITAS extension dan E33G extension = "Ask us" (WhatsApp), bukan bayar online; urutan Already in Bali = stay terpendek dulu, lalu harga termurah.

Lainnya:
- **Penamaan E33G** dan **lama perpanjangan C1** (dari daftar ronde 4).
- **Kontak chat** (revisi Ari): nomor WhatsApp tim berbahasa Rusia, username Telegram untuk tim English dan tim Rusia, dan (revisi 2026-10-31) nomor WhatsApp Ari, Feny dan Nanda untuk tab "Travelling abroad" (visa luar negeri untuk WNI). Di `site.js` masih placeholder `TODO_…`.
- **Metode bayar di DOKU** yang aktif (kartu, virtual account, QRIS, e-wallet?), supaya teks di Checkout bisa lebih spesifik.
- **Halaman terms & privacy policy** untuk checkbox di Checkout. Link di mockup masih `#`.
- **Pemetaan foto staf**: role 19 staf sudah diisi dari daftar Ayik (2026-10-28). Yang tersisa hanya konfirmasi file foto AYIK1 = Ari, SUMAR = Kadek, SUWANTARA = Gede (dipetakan dengan eliminasi).
- Klaim yang **sengaja tidak dipakai** karena belum terverifikasi: penghargaan "best visa agency", angka counter (20K+ klien, 48 tim, 144K+ visa).

---

## 9. Urutan kerja yang disarankan

Ringkasan saja; detail tiap langkah, syarat lanjut, dan rollback ada di `migration/PLAN-MIGRASI-ELEMENTOR.md`.

1. Persetujuan desain dari Ayik & Devi, konfirmasi bagian 8, dan keputusan K1–K5 di plan migrasi (termasuk Canvas dan `/our-services/`, bagian 1).
2. Site Settings: warna, font, tombol, layout (bagian 2).
3. Rapikan produk WooCommerce: kategori, atribut, short description, tipe External (bagian 4).
4. Theme Builder: Header, Footer, Loop Item "Visa row", Product Archive, Single Product.
5. Halaman: Home → About → Contact. Buat sebagai **draft/duplikat** dulu, jangan langsung timpa halaman live. Template Theme Builder juga tetap draft tanpa kondisi sampai go-live.
6. Cek logged-out di 390 / 768 / 1024 / 1440. Admin melewati delay JS WP Rocket, jadi hasilnya bisa beda.
7. Go-live sekaligus (big-bang) mengikuti checklist Fase 6 di plan migrasi: backup dulu, isi draft dimasukkan ke page ID asli supaya slug dan meta SEO tetap, lalu redirect untuk slug yang berubah.
