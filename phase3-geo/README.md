# Phase 3 — GEO Fix Deliverables

Paste-ready fixes from [GEO-ANALYSIS.md](GEO-ANALYSIS.md) (score **53/100**), in priority order. Site is live WordPress + Elementor — apply each in WP admin / Hostinger. Nothing here auto-deploys.

Owner-confirmed facts (2026-07-07): founded **2014**; public email **info1visaforbali@gmail.com**. Prices verified from live product pages.

| # | Fix | File | Status | Blocks weakest dimension |
|---|---|---|---|---|
| 1 | Rewrite thin passages → 134–167 word citable blocks (About, E-VOA, 211 ext, E33G, 4 FAQ answers) | `P1-citable-passages.html` | 🟡 Blocks A/B/C **APPLIED**; D (E33G) + E (FAQ) pending | Citability 40/100 |
| 2 | FAQPage JSON-LD + question-based headings | `P2-faq-schema-headings.html` | ✅ drafted | Citability / Structure |
| 3 | Fix email mismatch + stale © 2024 | `P3-nap-copyright-fix.md` | ✅ **APPLIED 2026-07-07** | Authority 35/100 |
| 4 | Product / Person / Review schema + fix `sameAs` | `P4-entity-schema.html` | ✅ drafted | Authority 35/100 |
| 5 | Clean `llms.txt` + explicit `robots.txt` AI rules | `P5-llms.txt`, `P5-robots-additions.txt` | ✅ drafted | Technical (protect 80/100) |

All JSON-LD validated as well-formed JSON. Validate again at https://validator.schema.org after pasting into the live site.

## `[OWNER INPUT]` — needed before publish

- **P1/P4** — legal licence / PT registration number (if held) → strongest E-E-A-T signal for immigration content.
- **P4** — YouTube **channel** URL (only a single video is linked now); Facebook **business page** URL (current link is a personal profile — do not put in Organization schema).
- **P4** — founder full name + optional LinkedIn.
- **P4 (4D)** — real Google Business Profile rating + review count, or delete the AggregateRating block. Never ship a fabricated rating.
- **P1 (Q4)** — confirm the "Law No. 6 of 2011" citation.
- **Remaining ~8 products** — real prices to fill the P4 Product template.

## Applied log

- **P1 Block C — DONE 2026-07-09.** 211/C1 extension product description pasted live + cache cleared. Owner: price flat Rp1,800,000 (dropped the 2,000,000 top of range) and REMOVED the fast-track +Rp250,000 option entirely (~135 words, 2 paras). Blocks D (E33G), E (4 FAQ answers) still pending.
- **P1 Block B — DONE 2026-07-09.** E-VOA 30-day product description pasted live + cache cleared. Owner trimmed the "cannot be converted / must leave" sentence (~137 words final).
- **P1 Block A — DONE 2026-07-08.** About Us intro (150-word citable rewrite) pasted live.
- **P3 — DONE 2026-07-07.** Email unified to `info1visaforbali@gmail.com` sitewide (was Organization-schema typo `info1visa4bali`). Copyright → 2026 on homepage, about, contact (killed leftover `© 2023 Jegtheme` theme-demo text), our-services, and all 12 products (fixed via single-product Theme Builder template). Verified: zero stale `2023/2024/Jegtheme` in source.
  - _Open (optional):_ `/shop/` + `/privacy-policy/` use a separate theme "dynamic-footer" reading "Best Visa Agency in Bali · All rights reserved" — no year, no brand. Cosmetic only; add `© [current_year] Visa4Bali` to that footer's copyright setting when convenient.

## Apply order & verification

1. **P3 first** (fastest, <1h) — email + copyright. Verify: one email in view-source, current year in footer.
2. **P1 + P2 together** — paste rewritten passages, then mark up the same FAQ text as FAQPage. Keep visible text = schema text.
3. **P4** — check view-source first; WooCommerce may already emit Product schema (don't duplicate). Add Person/founder + fix sameAs.
4. **P5** — upload llms.txt, append robots rules. Lowest impact (llms.txt has no proven citation weight) — hygiene only.

Expected lift: Citability and Authority are the two weakest dimensions (40 and 35). P1–P4 target both directly; realistic post-fix range ~68–72/100 once content + schema land and are re-indexed.
