# Runbook go-live desain B — Rabu 11 November 2026

Semua langkah dijalankan dari Claude Code lewat Chrome DevTools MCP, di browser yang login sebagai admin. Setiap skrip **idempoten**: aman dijalankan dua kali. Setiap langkah punya rollback. Skrip dibuat ulang dengan `python3 -I make-golive.py` (folder ini); file `*.generated.js` tidak masuk git.

## Gerbang: semua harus "ya" sebelum mulai

| # | Gerbang | Siapa |
|---|---|---|
| G1 | Approval go-live dari owner (screenshot untuk tim di-skip, keputusan owner 9 Nov) | Owner |
| G2 | Uji DOKU tanpa bayar di draft: Apply online → Basket → Checkout → halaman bayar DOKU muncul; order uji "Pending payment" lalu dibatalkan. Transaksi asli dipindah ke langkah 10 (keputusan owner 9 Nov, opsi A). ✅ 9 Nov (order #2316); butuh hotfix DOKU snippet #2318 yang harus tetap aktif | Claude, owner login |
| G3 | Backup hPanel hari itu ada, plus export All-in-One WP Migration diunduh ke luar server | Owner |
| G4 | `sh verify.sh before` → 0 failed | Claude |
| G5 | `01-snapshot` → semua `checks` "yes", 16/16, Store API 12 | Claude |

Kalau satu gerbang gagal, go-live mundur. Yang dipangkas bukan pemeriksaannya.

## Urutan

Perkiraan total 30–40 menit. Situs tampil campuran (sebagian lama, sebagian baru) dari langkah 2 sampai 5, sekitar 15 menit, jadi jalankan di jam sepi (K5).

| Langkah | Dijalankan di | Skrip | Hasil yang benar |
|---|---|---|---|
| 1. Snapshot | halaman wp-admin mana saja | `01-snapshot.generated.js` → simpan ke `audit/rollback/2026-11-11/golive-snapshot.json`, lalu `python3 -I make-golive.py ../../audit/rollback/2026-11-11/golive-snapshot.json` | `checks` semua "yes"; terbentuk `99-products-rollback.generated.js` |
| 2. Produk | wp-admin | `02-products-apply.generated.js` | 6 "updated", 351 "Regular … updated #1653" + "Faster … created", 5 "draft", 16 "publish", "#356 catalog hidden", "currency_pos left_space"; 4 produk variable "OK" (bukan "CHECK") |
| 3. Snippet #2254 versi live | `admin.php?page=wpcode-snippet-manager&snippet_id=2254` | `../wp/update-wpcode.live.generated.js`, cocokkan hash dengan `shasum -a 256 ../wp/v4b-shortcodes.live.wpcode.txt`, klik Update, reload, cek hash lagi | Hash sama sebelum dan sesudah reload; "Snippet updated"; snippet aktif |
| 4a. Header | editor `post.php?post=2245&action=elementor` (baru dimuat) | `03-template-header-2245.generated.js` | `status: publish`, `instances: Entire Site` |
| 4b. Footer | editor 2251 (baru dimuat) | `03-template-footer-2251.generated.js` | `status: publish`, `instances: Entire Site` |
| 4c. Footer lama | editor 2059 | `03-template-oldfooter-2059-off.generated.js` | `instances: None`, `conditions_before` berisi Entire Site (catat) |
| 5. Halaman | editor tiap halaman: 149, 102, 155, 193, 336, 337 | `04-page-<nama>-<id>.generated.js` | `backup.template_id` ada, `status: publish`, `dirty: false`; template Full Width |
| 6. Snippet 2054 | `…snippet_id=2054` | `05-snippet-2054-off.generated.js`, lalu jalankan sekali lagi | Run kedua `{already: false}`. Snippet dinonaktifkan, tidak dihapus |
| 7. Cache | wp-admin | `06-rocket-purge.generated.js` | status 200 |
| 8. Cek | terminal | `sh verify.sh after` | 0 failed |
| 9. Cek visual | Chrome, konteks terisolasi (logged-out) | harness responsif (`../make-harness.py`) di 390 / 768 / 1024 / 1440 | Tidak ada overflow; gaya sama seperti cek 9 Nov |
| 10. Transaksi uji | Chrome logged-out | beli 1 visa (owner bayar). Ini transaksi asli pertama di desain B; gagal = rollback langkah 5 (Basket/Checkout) atau semua | Order masuk, DOKU sukses, email terkirim |

Catatan per langkah:

- **Langkah 2** menambahkan kategori desain B ke 6 produk lama (kategori lamanya tetap). Ini wajib: template produk 2255 dan filter WooLentor sama-sama berbasis kategori 38/39/40.
- **Langkah 3** menyalakan tiga hal sekaligus: CSS desain B untuk pengunjung, redirect 301 (`/shop/`, 3 kategori, 5 produk lama), dan format harga desain B. Rollback-nya satu langkah.
- **Langkah 4**: buka editor *setelah* langkah sebelumnya selesai dan muat ulang dulu. Publish dari editor ikut menyimpan ulang kondisi versi editor (terjadi 9 Nov pada 2255).
- **Langkah 5**: skrip menyimpan isi lama halaman ke library sebagai `ROLLBACK 2026-11-11 — page <id>` sebelum menggantinya. Kalau halaman sudah berisi desain B tapi backup itu tidak ada, skrip berhenti sendiri (`STOP`).

## Rollback

Kalau ada yang rusak dan tidak beres dalam 30 menit, kembalikan dengan urutan terbalik. Setiap langkah bisa dikembalikan sendiri-sendiri.

| Membatalkan | Skrip | Di mana |
|---|---|---|
| 7 | jalankan `06-rocket-purge` lagi setelah rollback lain | wp-admin |
| 6 | `98-snippet-2054-on-rollback.generated.js` (dua kali) | edit snippet 2054 |
| 5 | `98-page-<nama>-<id>-rollback.generated.js` | editor halaman itu |
| 4c | `98-template-oldfooter-2059-rollback.generated.js` | editor 2059 |
| 4a/4b | `98-template-header-2245-rollback…`, `98-template-footer-2251-rollback…` | editor 2245 / 2251 |
| 3 | `../wp/update-wpcode.generated.js` (versi biasa), cocokkan hash `v4b-shortcodes.wpcode.txt`, Update | edit snippet 2254 |
| 2 | `99-products-rollback.generated.js` (dibuat dari snapshot langkah 1) | wp-admin |
| semua gagal | pulihkan backup G3 | hPanel |

Rollback produk tidak menghapus apa pun: varian Faster yang ditambahkan ke C1 dijadikan private. Meta `v4b_*` yang ditambahkan ke 6 produk lama dibiarkan; tanpa kategori desain B meta itu tidak dipakai.

## Sudah dilatih (9 Nov, pada salinan sementara, lalu dihapus)

| Skrip | Dilatih pada | Hasil |
|---|---|---|
| 01 snapshot | situs asli (read-only) | 16/16 produk baru ditemukan, semua tersembunyi, Store API 12 |
| 02 produk, bagian C1 | produk draft sementara dengan bentuk sama seperti 351 | Type → Processing Regular 2.000.000 / Faster 2.500.000; run kedua tidak membuat duplikat |
| 99 rollback produk | produk sementara yang sama | Atribut dan varian lama kembali; Faster jadi private |
| 03 / 98 template | template header sementara dengan kondisi halaman 999999 (tidak pernah cocok) | Publish + kondisi tersimpan; rollback mengosongkan kondisi. Dua perilaku Elementor ditemukan dan ditangani: menyimpan kondisi kosong selalu dibalas "error" walau berhasil, dan "save as draft" ditolak untuk dokumen published yang tidak berubah |
| 04 / 98 halaman | halaman draft sementara berisi konten Canvas (publish diganti simpan draft) | Backup ke library, 7 section desain B, rollback mengembalikan konten dan template Canvas. Ditemukan: ganti template memicu simpan otomatis Elementor, skrip sekarang menunggu dan mencoba ulang |
| Kotak beli produk variable satu varian | halaman draft sementara dengan `[v4b_product part="buy" id=…]` | 342, 346, 1572, 1575 masuk keranjang dengan varian dan harga benar |
| `verify.sh before` | situs asli | 33 ok, 0 failed |

Tidak dilatih: 05 (snippet 2054) dan 06 (purge), karena keduanya langsung mengubah situs live. Selektor keduanya sudah dicek ada.

## Sengaja tidak termasuk

- **Global sistem Site Settings (Fase 6 langkah 2 di rencana):** mengubah warna/font sistem kit 108 ke desain B mengubah halaman yang tidak dimigrasi (Privacy Policy, My Account, Order received). Perlu keputusan owner; bisa dikerjakan setelah go-live.
- **Menu Header lama (term 5):** tidak dipakai lagi; header baru memakai menu "Header B" (41).
- **Field checkout tambahan:** ditunda (keputusan owner 9 Nov).
- **AIOSEO Redirects:** redirect dibuat di snippet #2254 supaya hidup-mati bersama saklar `V4B_LIVE` dan tercatat di repo.
