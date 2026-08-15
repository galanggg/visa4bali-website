# visa4bali.com — Audit

Audit of **visa4bali.com** — WordPress-based Bali visa agency site.

- **Audited:** 2026-05-28
- **Method:** Live browser crawl (Chrome DevTools), HTTP header inspection, public endpoint probing, WP REST API enumeration.

## Stack detected

| Layer | Detail |
|---|---|
| CMS | WordPress (core version hidden in readme) |
| Host | Hostinger (hPanel), `hcdn` edge, PHP 8.1.34 |
| Theme | hello-elementor 3.0.1 |
| Page builder | Elementor 3.22.3 + Elementor Pro 3.20.0 |
| SEO | All in One SEO Pro (AIOSEO) 4.7.3 |
| Cache | WP Rocket 3.17.2.1 |
| Store | WooCommerce + WooLentor addons |
| Forms | MetForm |
| Analytics | MonsterInsights (Google Analytics) |
| Other | jeg-elementor-kit, wp-whatsapp, Jetpack, Envato Elements, Hostinger AI tools |

## Start here

**[TRACKER.md](TRACKER.md)** — current state of the UI/UX fix work: what shipped, what's next, live snippet IDs, open questions. Updated 2026-08-15.

## Audit docs

| Area | File | Top issue |
|---|---|---|
| **UI/UX (current)** | [ui-ux-2026-08.md](ui-ux-2026-08.md) | Fresh audit 2026-08-15 — mobile spacing, 27 findings; Round 1 shipped |
| SEO | [seo.md](seo.md) | Two `<h1>` tags, fragmented headings, thin content |
| Security | [security.md](security.md) | User enumeration via REST API, readme/xmlrpc exposed |
| Performance | [performance.md](performance.md) | ~25+ render-blocking CSS files, oversized images, no `lazy` |
| UX / Improvement | [ux-improvement.md](ux-improvement.md) | Gmail contact, weak trust signals, duplicate testimonials |
| UI / Visual Bugs | [ui-bugs.md](ui-bugs.md) | Contact page has no contact method, default privacy policy, mobile overflow |
| Image alt list | [alt-text-list.md](alt-text-list.md) | 82 empty alts — keyword-rich replacements ready to paste |
| **Action Plan** | [action-plan.md](action-plan.md) | Prioritized fix-it roadmap (4 phases) |

## Severity legend

- 🔴 **Critical** — fix now (security/indexing risk)
- 🟠 **High** — fix soon (notable impact)
- 🟡 **Medium** — should fix
- 🟢 **Low** — nice to have
