# Fix-It Action Plan — visa4bali.com

Prioritized from [seo.md](seo.md), [security.md](security.md), [performance.md](performance.md), [ux-improvement.md](ux-improvement.md). Audited 2026-05-28.

Order = impact ÷ effort + risk. Do Phase 1 first.

---

## Phase 1 — Urgent (this week)

Security + revenue-blocking. Highest risk, mostly low effort.

| # | Fix | Area | Effort | Why |
|---|---|---|---|---|
| ~~1~~ | Block REST user enum + rate-limit — **✅ DONE 2026-07-07** (verified). Wordfence: disableAuthorScan on → REST `/users` 401, `/?author=1` 404. Rate-limit 20-fail/240min lockout, breach-pw block for admins. **Remaining: enforce admin 2FA (requireAdminTwoFactor=0) via Wordfence UI.** | 🔴 Sec | — | — |
| ~~2~~ | ~~Fix `Rp0` prices~~ — **RESOLVED**: false positive, was empty cart-total in header. All 12 products priced. | ✅ | — | — |
| 3 | Remove `readme.html`/`license.txt` ✅ already gone. Disable `xmlrpc.php` — **STILL OPEN** (no Jetpack → safe to disable; do via Wordfence UI toggle). | 🟠 Sec | S | WP fingerprint + brute-force/DDoS amplification surface |
| 4 | Patch WP core + all plugins (Elementor 3.22.3, Pro 3.20.0 outdated); enable security auto-updates | 🟠 Sec | M | Stale Elementor/Woo = common CVE targets |
| ~~5~~ | Switch contact email gmail.com → `info@visa4bali.com` — **PARTIAL ✅** backend (WP admin, WooCommerce, MetForm, SMTP) on `info@visa4bali.com`. Public-facing gmail kept per owner. | 🟠 UX | — | — |

**How #1:** security plugin (Wordfence / Solid Security) handles enum-block + rate-limit + 2FA in one install. Also disable author archives (`/?author=1`).

---

## Phase 2 — High (next 2 weeks)

Trust, security headers, big SEO/perf wins.

| # | Fix | Area | Effort | Why |
|---|---|---|---|---|
| ~~6~~ | Security headers — **✅ DONE 2026-05-28** 4/5 live (HSTS 30d, nosniff, SAMEORIGIN, Referrer). Permissions-Policy deferred (plugin bug). | 🟠 Sec | — | — |
| ~~7~~ | Single H1 — **✅ DONE 2026-05-28** (demoted second H1 to H2). Keyword-rich rewrite still pending | 🔴 SEO | S | — |
| 8 | Enable WP Rocket "Remove Unused CSS"; dequeue Woo/MetForm CSS off landing pages | 🟠 Perf | M | ~25 render-blocking CSS files; biggest perf win |
| 9 | Fix oversized images: WebP + responsive srcset (800px→44px waste); LCP image eager + fetchpriority | 🟠 Perf | M | Wasted bytes, slow LCP |
| 10 | Add trust section: legal license/PT, privacy policy (passport data), refund terms, payment-security badges | 🟡 UX | M | Legal/immigration service needs trust; privacy policy legally required |
| 11 | Replace duplicate testimonials w/ unique Google Business reviews | 🟠 UX | M | Same 4 reviews ×3 looks fake; Google reviews aid local SEO |

**How #6** (`.htaccess` / Hostinger / functions.php):
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```
Build real CSP later — test against Elementor inline styles before enforce.

---

## Phase 3 — Medium (this month)

Polish, accessibility, content engine.

| # | Fix | Area | Effort | Why |
|---|---|---|---|---|
| 12 | Add alt text to 32 images missing it | 🟡 SEO/a11y | M | Image SEO + accessibility |
| 13 | Sharper hero headline + single primary CTA ("Get My Visa on WhatsApp") | 🟠 UX | S | Vague "EXPLORE NOW" doesn't convert |
| 14 | Trim Google Fonts to used weights; self-host or preconnect; consolidate 4 icon fonts | 🟡 Perf | M | Loading weights 100-900 ×2 families + 4 icon sets |
| 15 | Proper 1200×630 OG image (not 512 logo) | 🟡 SEO | S | Weak social shares |
| 16 | Fix slider labels ("slide 17 to 20 of 5"); verify page-cache hit (TTFB 642ms) | 🟡 UX/Perf | S | Garbled ARIA + uncached HTML |
| 17 | Consistent brand name (pick "Visa4Bali" vs "Visa4Bali Luwuk") across title/og/REST | 🟡 SEO | S | Inconsistent brand signal |
| 18 | Suppress version fingerprints (`expose_php Off`, strip WP Rocket version header) | 🟡 Sec | S | Reduce CVE-matching recon |

---

## Phase 4 — Ongoing / Strategic

| # | Fix | Area | Why |
|---|---|---|---|
| 19 | Restart blog — target visa keywords (B211 changes, VoA countries, overstay rules) | 🟡 SEO | Posts dead since 2024-03; visa rules change = content opportunity |
| 20 | Visa comparison table / "Which visa?" selector (B211 vs E-VoA vs family: price/duration/CTA) | 🟡 UX | Guides buyer decision |
| 21 | Decide market targeting — locale/hreflang for RU/DE/KO audience or translate testimonials | 🟠 SEO/UX | Mixed-language content, og:locale=en_GB only |
| 22 | Off-site automated backups + scheduled malware scans | 🟠 Sec | Recovery + early breach detection |
| 23 | Audit/remove unused plugins (Envato Elements, Jetpack, Hostinger AI) | 🟡 Sec | Every plugin = attack surface |
| 24 | Harden MetForm passport-data handling: secure storage, access control, retention policy | 🟡 Sec | Sensitive PII collection |

---

## Quick wins (do today, <30min each)

- #1 install Wordfence → enum block + rate-limit + 2FA (covers several items)
- #3 delete readme.html / license.txt
- #5 domain email
- #6 security headers
- #15 OG image

## Effort key
S = <1hr · M = few hrs · L = day+
