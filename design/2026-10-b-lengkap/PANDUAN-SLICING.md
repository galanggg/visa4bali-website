# Panduan slicing: arah B "Resor Jimbaran" ke WordPress + Elementor Pro

Mockup ini terdiri dari 5 halaman: `home.html`, `shop.html`, `product.html`, `about.html`, `contact.html`. Semuanya memakai satu stylesheet, `style.css`, dan satu file data, `site.js`. Mockup ini sengaja dibuat mengikuti cara kerja Elementor:

- Setiap warna dan font di `:root` (`style.css`) = satu **Global Colour / Global Font**.
- Breakpoint hanya dua, sama dengan default Elementor: **tablet ≤1024px**, **mobile ≤767px**.
- `.wrap` = Container *boxed*, content width **1200px**, padding kiri-kanan **20px**.
- Setiap section punya komentar `<!-- EL: ... -->` di HTML-nya. Komentar itu menyebut widget Elementor yang dipakai.

Status: arah B dipilih Ari & Devi pada 2026-10-23. Catatan 1 (kunyit diganti merah) sudah diterapkan. Harga dan beberapa fakta masih menunggu konfirmasi; daftarnya ada di bagian 8.

---

## 1. Peta halaman

| Mockup | WordPress | Dibangun dengan |
|---|---|---|
| `home.html` | Page **Home** (149) | Elementor page |
| `shop.html` | WooCommerce **Shop** (`/shop/`, 335) | Theme Builder › **Product Archive** |
| `product.html` | `/product/*` visa yang dibeli online (Simple product) | Theme Builder › **Single Product** |
| `product-chat.html` | `/product/*` kasus kompleks (External product) | template **Single Product** yang sama, tampil beda karena tipe produknya |
| `basket.html` | WooCommerce **Basket** (`/basket/`, 336) | Elementor Pro widget **Cart** |
| `checkout.html` | WooCommerce **Checkout** (+ halaman *Order received* di bagian bawah file) | Elementor Pro widget **Checkout** + template thank-you |
| `about.html` | Page **About Us** (155) | Elementor page |
| `contact.html` | Page **Contact Us** (193) | Elementor page |
| header & footer | semua halaman | Theme Builder › **Header** dan **Footer** |

`/our-services/` isinya akan sama dengan Shop. Saran: redirect 301 `/our-services/` → `/shop/` (atau sebaliknya: jadikan halaman Shop di WooCommerce › Settings › Products ke page `our-services`). Dengan begitu daftar harga cuma ada **satu**, dan selalu sama dengan harga checkout.

### ⚠️ Keputusan dulu: template Canvas

Home, About Us, dan Contact Us sekarang memakai template `elementor_canvas`. Di Canvas, header dan footer Theme Builder **tidak akan pernah tampil**. Karena itu header dulu disalin manual ke setiap halaman (lihat `audit/TRACKER.md`).

Redesign ini adalah saat yang tepat untuk membereskannya:
1. Ubah ketiga halaman itu ke **Elementor Full Width**.
2. Hapus header dan footer inline lama di masing-masing halaman, juga Template widget footer 2055.
3. Buat satu Header dan satu Footer di Theme Builder, dengan kondisi *Entire Site*.

Pada 2026-08-15 owner pernah menolak scope ini. Perlu konfirmasi ulang sebelum mulai.

---

## 2. Site Settings (Elementor › Site Settings)

### Global Colours

| Nama di Elementor | Token CSS | Hex | Dipakai untuk |
|---|---|---|---|
| Primary | `--sea` | `#1D3940` | band biru laut, kode visa, ikon |
| Secondary | `--stone` | `#EEECE7` | band batu kapur, kotak harga, form |
| Text | `--ink` | `#1C2326` | teks utama |
| Accent | `--merah` | `#C8102E` | tombol utama, titik aktif |
| Accent Dark | `--merah-2` | `#A30D25` | hover tombol, band "Why choose us" |
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

**Footer** (`<footer class="foot">`): latar Secondary, 3 kolom rata tengah (alamat & jam · kontak & sosial · link), copyright, lalu strip foto pantai setinggi 150px dengan mask gradasi. Strip ini bisa dibuat sebagai Container dengan background image `jimbaran.jpg` dan CSS `mask-image` (Custom CSS container).

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
| Hero | Container full width, min-height 640 (tablet 520, mobile 460), background image `jimbaran.jpg` + overlay gradien. Heading H1 + Text Editor. Kredit foto wajib tetap ada (CC BY-SA). |
| Visa finder | Container boxed, margin-top −104 (tablet/mobile 0), shadow. **Nested Tabs** vertikal (mobile: horizontal, tab berbentuk pil). Isi tiap tab: **Loop Grid** produk kategori itu, maksimal 3, memakai Loop Item "Visa row (ringkas)". |
| Visas for every kind of stay | Container latar Primary. 3 inner Container: label, "From Rp …", deskripsi, 3 baris contoh, link ke `/shop/#kategori`. Angka "From" diketik manual atau lewat shortcode harga minimum. |
| Tell us about your trip | Heading + Text + Button WhatsApp |
| Why choose us | Latar Accent Dark, teks putih. 2 kolom: 3 poin + 1 foto tim (`team-4.jpg`). Simpan sebagai **Global Widget/Template**, karena dipakai lagi di About. |
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

**Varian chat (`product-chat.html`, contoh E33G).** Template Single Product-nya sama. Bedanya ada di produknya: External product, jadi Add To Cart menampilkan tombol "Ask us" yang membuka Popup Chat. Di bawahnya ditambah satu baris "We check your documents with you on WhatsApp or Telegram before you pay." Pakai widget Text Editor dengan Display Condition *product type = external*, atau buat dua template Single Product dengan kondisi per kategori `staying-longer`. Fakta ketiga juga beda per produk (e-VOA: *Longest stay*, E33G: *Income*), jadi simpan sebagai atribut produk `fact_3_label` dan `fact_3_value`.

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
| Hero | Seperti hero Shop, foto `team-3.jpg` |
| Our story | 2 kolom 5/6: Image (owner) + caption · eyebrow · H2 · 2 paragraf · kalimat sorotan bergaris kiri merah |
| How we work | Latar Primary, 3 kolom |
| Team | 18 × **Image Box** (atau Loop Grid kalau staf dibuat CPT). 5 kolom desktop, 3 tablet, 2 mobile. Foto 4:5, latar putih. |
| Visit our office | Satu kartu lebar, 2 kolom 1.5/1: **Google Maps** widget (tinggi 380, tablet/HP 300/240) · Heading + alamat + jam + link "Get directions". Cabang Lombok dihapus atas permintaan Ari (2026-10-23). |
| CTA | Sama dengan Home |

### Contact (`contact.html`)
| Section | Widget |
|---|---|
| Hero | Seperti hero Shop, foto `team-4.jpg` |
| Kontak + form | 2 kolom 5/7. Kiri: Container Primary (CTA WhatsApp) + Icon List. Kanan: **MetForm 195** yang diubah fieldnya: Name, Email, WhatsApp (opsional), Nationality, What do you need (select), tanggal (opsional), Message. Style input: latar putih, border `#D9D6CF`, radius 4, padding 13/14. |
| Passport pick-up | Teks + 9 area (3 kolom). Sumber: deskripsi produk VOA Extension. |
| Visit our office | Sama dengan About + peringatan penipuan |

---

## 6. Aset gambar (`img/`)

| File | Ukuran | Upload ke Media Library dengan alt |
|---|---|---|
| `jimbaran.jpg` | 1280×960 | "Jimbaran Bay on a clear morning…" (kredit: pedrizat, CC BY-SA 2.0) |
| `team-4.jpg` | 1030×708 | lihat alt di `home.html`. Dari TEAM44.jpg (kiriman Ari 2026-10-28), softbox di pojok sudah di-crop |
| `team-3.jpg` | 1376×768 | lihat alt di `home.html`. Dari TEAM3.jpg (kiriman Ari 2026-10-28) |
| `owner.webp` | 680×1205, transparan | Foto Pak Rolly kiriman Ari 2026-10-28, background putih dihapus. Di Elementor: Image widget tanpa latar (transparan di atas putih), gambar rata kiri-bawah, sejajar caption |
| `staff/*.jpg` | 18 × 480×600 | "Nama, Role at Visa4Bali". Di-crop 4:5 dari foto studio seragam merah-hitam (PHOTO.zip, Ari 2026-10-28). Staf yang tidak ada di set itu (Ari, Rhoga, Kadek, Joni, Marlon) dihapus atas permintaan Ari |
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

Harga di mockup mengikuti flyer Juni 2026. Harga di WooCommerce **berbeda** untuk produk berikut, dan checkout memakai harga WooCommerce:

| Visa | Mockup (flyer) | WooCommerce live | Catatan |
|---|---|---|---|
| C1 Tourist Visa | 2.200.000 | 2.000.000 (#351 "Visa4bali Offshore"?) | promo 2,0 jt? |
| D12 Multiple Entry 1 th | 7.500.000 | 7.000.000 (#668 "C12 & D12") | |
| E33G Remote Worker | 12.000.000 | 13.000.000 (#515) | Woo: "termasuk pajak $150" |
| Family KITAS | 11.500.000 (flyer lain 13.500.000) | 11.000.000 (#627) | tiga angka berbeda |
| e-VOA proses | 5–7 hari kerja | "1–2 working days" (deskripsi #494) | |
| E33G proses | 12–14 hari kerja | "5-6 working days" (deskripsi #515) | |
| D12 Extension | belum ada di flyer | 3.000.000 (#1575) | stay & proses? |
| D1/D2 Extension | belum ada di flyer | 1.800.000 (#1572) | proses? |
| VOA Extension cepat | 1.000.000 | tidak ada produk; deskripsi #342: "percepat +250.000" | buat produk/variasi? |
| C2, Retirement, Investor KITAS | ada di flyer | tidak ada produk | buat sebagai External product (WhatsApp) |

Lainnya:
- **Penamaan E33G** dan **lama perpanjangan C1** (dari daftar ronde 4).
- **Kontak chat** (revisi Ari): nomor WhatsApp tim berbahasa Rusia, username Telegram untuk tim English dan tim Rusia. Di `site.js` masih placeholder `TODO_…`.
- **Metode bayar di DOKU** yang aktif (kartu, virtual account, QRIS, e-wallet?), supaya teks di Checkout bisa lebih spesifik.
- **Halaman terms & privacy policy** untuk checkbox di Checkout. Link di mockup masih `#`.
- **E33G** (`product-chat.html`): proses 12–14 hari kerja (flyer) vs 5–6 hari kerja (WooCommerce), harga 12 jt vs 13 jt.
- **Role staf**: role lama diambil dari About Us sekarang. Ayik, Sumar dan Juniarta baru masuk di set foto 2026-10-28 dan role-nya belum ada (di mockup tertulis "Role to confirm").
- Klaim yang **sengaja tidak dipakai** karena belum terverifikasi: penghargaan "best visa agency", angka counter (20K+ klien, 48 tim, 144K+ visa).

---

## 9. Urutan kerja yang disarankan

1. Konfirmasi bagian 8 dan keputusan Canvas (bagian 1).
2. Site Settings: warna, font, tombol, layout (bagian 2).
3. Rapikan produk WooCommerce: kategori, atribut, short description, tipe External (bagian 4).
4. Theme Builder: Header, Footer, Loop Item "Visa row", Product Archive, Single Product.
5. Halaman: Home → About → Contact. Buat sebagai **draft/duplikat** dulu, jangan langsung timpa halaman live.
6. Cek logged-out di 390 / 768 / 1024 / 1440. Admin melewati delay JS WP Rocket, jadi hasilnya bisa beda.
7. Ganti halaman live, lalu buat redirect untuk slug yang berubah.
