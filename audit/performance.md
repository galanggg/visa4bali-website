# Performance Audit — visa4bali.com

Audited 2026-05-28. Cache: WP Rocket 3.17.2.1. Host: Hostinger edge (hcdn).

> Note: timing taken on a warm/cached load. Run a cold-cache PageSpeed Insights / Lighthouse run for authoritative Core Web Vitals + field data. Numbers below are observed lab values from the crawl.

## Observed metrics (warm load)

| Metric | Value | Verdict |
|---|---|---|
| TTFB | ~642 ms | 🟡 mediocre (target <500ms, ideal <200ms) |
| DOMContentLoaded | ~1139 ms | 🟡 |
| Load complete | ~1143 ms | 🟢 ok |
| Resource requests | ~59 | 🟠 high |
| HTML size | ~373 KB (uncompressed DOM) | 🟠 heavy DOM |

## What's working 🟢

- WP Rocket active: CSS minified + combined (`/cache/min/`), background-CSS, lazyload script present.
- Brotli compression (`content-encoding: br`) on responses.
- HTTP/3 advertised (`alt-svc: h3`).
- Fonts use `display=swap`.
- Some `data:` SVG placeholders used for lazy image dimensions (prevents layout shift).

## Issues

### 🟠 ~25+ render-blocking CSS files
Even minified, the page pulls a long chain of separate stylesheets: jeg-elementor-kit, woolentor (×4), wp-whatsapp, woocommerce (×4), font-awesome (×3 incl all.min + v4-shims), elementor frontend-lite, elementor-pro, swiper, metform (×2), hello theme (×3), jkiticon, sweetalert2, tiny-slider...
Each is a request + parse cost. Many load on the homepage but aren't needed there (WooCommerce/Metform CSS on a landing page).
**Fix:**
- Enable WP Rocket **"Remove Unused CSS"** (RUCSS) — biggest win for Elementor sites.
- Conditionally dequeue WooCommerce/MetForm CSS on pages that don't use them.
- Consolidate Font Awesome (loading full `all.min.css` + `v4-shims` + line-icons + jkiticon = 4 icon fonts).

### 🟠 Oversized images served, scaled down in browser
Images delivered far larger than displayed:

| Image | Natural | Displayed |
|---|---|---|
| logo-v4b-merah-512x512 | 512px | 75px |
| FENY2-BG.jpg | 800px | 44px |
| NANDA1-BG.jpg | 800px | 44px |
| ORES2.png | 800px | 44px |
| LPD-Full / V4B-* partner logos | 520px | 153px |

Wasted bytes + slower LCP.
**Fix:**
- Serve responsive `srcset` at display size; 44px avatars should not ship 800px files.
- Convert JP/PNG → **WebP/AVIF** (Hostinger has an image-optimizer; the `image-optimizer/v1` REST namespace suggests a plugin is installed — confirm it's actually converting).
- Compress PNG logos.

### 🟠 No native lazy-loading on images
Crawl: **64/64 images have no `loading="lazy"` attribute.** Site relies on WP Rocket JS lazyload (`lazyload.min.js`) instead. JS lazyload works but adds JS dependency + delays vs native `loading="lazy"`.
**Fix:** ensure WP Rocket lazyload is actually firing (it appeared to), or add native lazy. Above-the-fold hero/LCP image should be `eager` + `fetchpriority="high"`, everything else lazy.

### 🟡 4 separate icon-font files
font-awesome `all.min.css`, `v4-shims`, simple-line-icons, jkiticon — each pulls font files. Heavy for a few icons.
**Fix:** subset icons or use inline SVG; drop unused icon libraries.

### 🟡 Two Google Fonts families with all weights
`Plus Jakarta Sans` + `Inter`, each requesting weights 100–900 incl italics. Massive font CSS even if only 2–3 weights used.
**Fix:** load only weights actually used (e.g. 400/500/600/700). Self-host fonts to cut the extra `fonts.googleapis.com` + `fonts.gstatic.com` round-trips, or preconnect.

### 🟡 TTFB ~642ms
Dynamic homepage (`x-hcdn-cache-status: DYNAMIC`) — full page not edge-cached.
**Fix:** confirm WP Rocket page cache is serving HTML (homepage showed DYNAMIC = possibly cache miss/excluded). Cached HTML should drop TTFB substantially.

### 🟡 Heavy DOM (Elementor)
373KB of HTML, duplicated testimonial sliders (same reviews 3×) inflate node count → slower style/layout.
**Fix:** reduce duplicate slider markup; lighten Elementor section nesting.

## Priority order

1. 🟠 Turn on Remove Unused CSS (WP Rocket).
2. 🟠 Fix oversized images + WebP conversion + responsive srcset.
3. 🟠 Verify lazyload + set LCP image eager/high priority.
4. 🟡 Trim Google Fonts weights, self-host/preconnect.
5. 🟡 Consolidate icon fonts.
6. 🟡 Verify page-cache hit (TTFB), reduce DOM duplication.

> Run Lighthouse mobile + PageSpeed Insights for real LCP/CLS/INP field numbers before/after each change.
