# Baseline performa sebelum migrasi (2026-11-09)

Diukur 2026-11-09 sekitar 13:30 WITA, sebelum ada perubahan desain (setelah Nested Elements diaktifkan, yang terbukti tidak mengubah HTML Home).

Kondisi: Chrome DevTools MCP, isolated context baru per halaman (cold, logged-out), 390×844 DPR 3 mobile+touch, Fast 3G, CPU 4x. Metrik dibaca 15 detik setelah navigasi, **tanpa interaksi**, jadi script yang ditunda WP Rocket belum jalan. Satu kali ukur per halaman. Waktu bisa berayun beberapa detik antar run karena gtag (lihat `audit/TRACKER.md` #16), jadi bandingkan dengan pengukuran ulang dalam kondisi yang sama, bukan dengan satu angka.

PageSpeed Insights API tidak bisa dipakai hari ini (kuota harian tanpa API key habis).

| Halaman | TTFB | FCP | LCP | Elemen LCP | CLS | Load | Request | Transfer |
|---|---|---|---|---|---|---|---|---|
| `/` Home | 1,33 s | 3,48 s | 3,48 s | DIV (hero) | 0 | 8,37 s | 49 | 904 KB |
| `/our-services/` | 1,21 s | 3,64 s | **13,40 s** | DIV widget-wrap | 0,001 | 15,81 s | 47 | **2.232 KB** |
| `/product/e-voa-30-days/` | 1,33 s | 3,50 s | 7,54 s | IMG.wp-post-image | 0,007 | 8,82 s | 44 | 971 KB |
| `/contact-us/` | 1,06 s | 3,08 s | 6,98 s | DIV widget-wrap | 0,001 | 8,29 s | 43 | 898 KB |

Belum diukur: desktop 1440, About Us, run kedua. Target setelah go-live: LCP dan CLS tidak lebih buruk dari tabel ini di kondisi yang sama.
