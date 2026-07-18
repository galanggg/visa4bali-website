# SEO Audit — visa4bali.com

Audited 2026-05-28. SEO plugin: AIOSEO Pro 4.7.3.

## What's working 🟢

- Meta description present and decent: *"Visa4Bali: Your trusted visa agent in Bali. We handle all visa types, including extensions & stay permits..."*
- Canonical tag correct: `https://visa4bali.com/`
- Open Graph + Twitter card tags present.
- JSON-LD schema present: `BreadcrumbList` + `LocalBusiness`.
- `robots.txt` clean, points to sitemap.
- XML sitemap index generates (post, page, product, category, product_cat, metform).
- HTTPS enforced (`upgrade-insecure-requests`).
- `viewport` set, mobile-ready meta.

## Issues

### ~~🔴 Two `<h1>` tags on homepage~~ — RESOLVED 2026-05-28
"To travel to Bali" demoted H1→H2. H1 count = 1 (verified live).
**Still open (🟡):** remaining H1 "Apply for a Visa" is generic — no "Bali" / "agency" / service keywords. Suggest stronger H1 like "Bali Visa Agency — Extensions, Stay Permits & VoA" for keyword authority.

### ~~🔴 Two `<h1>` tags on Services / Shop / Privacy pages~~ — RESOLVED 2026-05-30
Hello-Elementor theme header emitted `<h1 class="site-title">Visa4Bali Luwuk</h1>` on pages using default WP template. Fixed via theme update + Code Snippet filter `hello_elementor_header_site_title_tag` returning `div`. All 6 audited pages verified with H1 count = 1.

### 🟠 Fragmented / empty headings
Several `<h2>` are empty strings (`""`). H1 split into "Apply for a Visa" / "To travel to Bali" reads as broken sentence to crawlers.
**Fix:** every heading carries real keyword text. No empty headings (Elementor often emits these — set them as plain text widgets instead).

### 🟠 `og:locale=en_GB` but content targets global + Russian audience
Site has heavy Russian testimonials, German/Korean clients. Declared locale `en-GB`. No `hreflang`, no multilingual setup.
**Fix:** if targeting RU/DE/KO markets, consider hreflang or at least set locale to `en_US`/neutral. Decide primary market.

### 🟠 Thin homepage content + duplicate testimonials
Testimonial block repeats same 4 reviews 3× in DOM (slider duplication). Real unique text is low. Crawlers see repetitive content.
**Fix:** add unique service descriptions, pricing context, FAQ text as real HTML (not just images). Reduce duplicated slider markup if possible.

### ~~🟡 Title brand inconsistency~~ — RESOLVED 2026-05-30
Site Title changed from "Visa4Bali Luwuk" to "Visa4Bali" (Settings → General). Verified live:
- `<title>` on all pages now uses "Visa4Bali"
- `og:site_name`: "Visa4Bali – Best Visa Agency in Bali" ✅
- Site-title (theme header): "Visa4Bali" ✅
**Still open (🟡):** "Luwuk" text hardcoded in Elementor copy on `/`, `/about-us/`, `/our-services/` body. Per-widget Elementor edits needed.

### 🟡 32 of 64 images missing `alt`
Half of images have no alt text. Hurts image SEO + accessibility.
**Fix:** add descriptive alt to all content images. Decorative ones get `alt=""`.

### 🟡 `og:image` is the 512×512 logo
Social shares show tiny logo, not a compelling banner. 
**Fix:** set a proper 1200×630 OG image (hero/branded).

### 🟡 post-sitemap last modified 2024-03-19
Blog/posts not updated since March 2024. No fresh content = weak ongoing SEO. Visa rules change often → opportunity for blog content (E211 changes, VoA countries, overstay rules).

### 🟢 Sitemap `noindex` header
`/sitemap.xml` returns `x-robots-tag: noindex, follow` — fine (sitemaps shouldn't be indexed), noted for completeness.

## Recommendations priority

1. Fix H1 (single, keyword-rich).
2. Fill/clean all headings, add image alts.
3. Add real text content + dedupe testimonials.
4. Proper OG image.
5. Decide market targeting (locale/hreflang).
6. Restart blog — target visa keyword queries.
