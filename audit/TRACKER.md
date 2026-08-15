# UI/UX Fix Tracker — visa4bali.com

Single source of truth for the mobile-tidiness work started 2026-08-15.
Findings and evidence live in [`ui-ux-2026-08.md`](ui-ux-2026-08.md); this file tracks **state**.

**Last updated:** 2026-08-15 · **Current position:** Round 1 shipped and verified. Round 2: footer consolidation **complete** across all 10 page types, and fixes **#5 and #15 shipped and verified**. Remaining in Round 2: **#3** (WhatsApp float) and **#4** (mobile menu).

---

## How changes are made

| | |
|---|---|
| Method | Direct in WP admin, owner decision 2026-08-15 |
| Access | Owner logs into `https://visa4bali.com/wp-admin/` themselves in the Chrome instance driven by the DevTools MCP. Credentials never pass through chat. Session must be re-established each new working session. |
| Delivery style | Centralised CSS via WPCode snippet wherever possible, so a change is one toggle away from reverting. Elementor structure edited only when CSS cannot do it. |
| Cache | Purge WP Rocket after every change: admin bar → WP Rocket → Clear and Preload Cache. |
| Verification | Always re-check logged-out, in an isolated browser context (admin sessions bypass WP Rocket's JS delay and see a different page). |

**Backup status: ⚠️ still none.** All-in-One WP Migration reported "No backups found", re-checked live on 2026-08-15 immediately before the footer work. **Owner decided to proceed without one.** Substitute safety net used for the footer consolidation: every section was exported to [`rollback/`](rollback/) as Elementor JSON *before* deletion, and the canonical footer was saved as library template 2055 first. That covers page content only — menu edits (#4) still have nothing behind them.

---

## Live artifacts on the site

| Artifact | Where | Notes |
|---|---|---|
| WPCode snippet `V4B — Round 1 mobile spacing` | ID **2054**, CSS type, site-wide header, **active** | Source mirrored at [`round1-mobile.css`](round1-mobile.css). Disable to revert all of Round 1. Edited 2026-08-15 for the footer consolidation: `.elementor-2059` added to the vertical-rhythm rule, and a new **section 6** added *outside* the mobile media query to neutralise the `v4b-footer-mount` wrapper. |
| Elementor Theme Builder template `V4B — Global Footer` | post **2059**, type `footer`, **published** | Conditions: `Include / Entire Site`, minus `Exclude / Singular / Pages / Home (149)` and `About Us (155)`. Section HTML tag set to `footer` so the page keeps a landmark. ⚠️ Those two excludes are **inert** — Canvas ignores footer locations anyway — and Contact Us (193) has no matching exclude, so the three Canvas pages are treated inconsistently. Harmless today; it would start to matter the moment any of them is switched to Full Width. |
| Elementor library template `V4B — Footer source (from Home 149) 2026-08-15` | post **2055**, type `section` | **Live**, not just a backup — Home, About Us and Contact Us render it through a Template widget. Also the thing to re-insert if a removal needs undoing. |

Both footer templates were edited again on 2026-08-15 for #15 and #5: the `Support` column removed, Quick Links rewired, phone and email made tappable. **They remain identical to each other, and must be kept that way** — every future footer change is two edits.

Elementor page roots referenced by the CSS (needed if new pages are added):
`149` = home · `155` = about-us · `102` = our-services · `193` = contact-us · `195` = MetForm contact form · `2059` = global footer template.
Homepage section IDs used: `705659ef` header · `6fd792fa` hero · `a3ec264` hero H2 · `79705f24` hero H1 · `61463a8e` pre-footer band.

---

## Rounds

### ✅ Round 1 — spacing system (shipped 2026-08-15)

| # | Fix | Result |
|---|---|---|
| 1 | Horizontal scroll (mini-cart + quick-view modal) | 0px overflow, 4 pages × 360/390 |
| 2 | Hero H2 clipped | 48px → 30px, fits |
| 6 | Contact form width | inputs 170px → 260px |
| 7 | One mobile gutter | 8 values → 20px content / 30px card interior |
| 8 | One vertical rhythm | 32px per section edge |
| 10 | About Us photo overflow | capped to column |
| — | Hero top padding | 160px → 56px |

Desktop 1440 re-measured after the change: identical to baseline. No regression.

### 🔶 Round 2 — mobile conversion path (in progress)

#### ✅ Footer consolidation — complete, 10 of 10 page types

Done 2026-08-15 on the owner's instruction, ahead of the numbered fixes, so that #15 is edited twice instead of five times. **Zero inline footer sections remain anywhere on the site.**

| Page | Footer now comes from | Was |
|---|---|---|
| `/our-services/` (102) | Theme Builder **2059** | inline `2c4d5b5c`, deleted |
| `/basket/` (336) | Theme Builder **2059** | inline `30a9afce`, deleted — nobody had catalogued it |
| `/privacy-policy/` (3) | Theme Builder **2059** | no branded footer at all |
| `/shop/` (335) | Theme Builder **2059** | no branded footer at all |
| `/my-account/` (338) | Theme Builder **2059** | no branded footer at all |
| all 12 `/product/*` (template 424) | Theme Builder **2059** | inline `61c557bc`, deleted |
| `/` (149) | template **2055** via Template widget, wrapper `8602a4a` | inline `6bdc71be`, deleted |
| `/about-us/` (155) | template **2055** via Template widget, wrapper `056ef0c` | inline `4e6dba81`, deleted |
| `/contact-us/` (193) | template **2055** via Template widget, wrapper `5d86583` | inline `378bd828`, deleted |

Two sources, not one, because of the Canvas constraint below. **Editing the footer means editing both 2055 and 2059.** They are currently byte-identical in content; 2059 was built from a copy of 2055.

**Why two: `elementor_canvas`.** Home, About Us and Contact Us use the Elementor Canvas page template, which renders no theme header or footer location at all — so a Theme Builder footer can never appear on them. That is why the original build pasted a footer into every page. Confirmed via the REST `template` field, not inferred. The owner chose option B: keep Canvas, mount the shared template through an Elementor `Template` widget. The rejected option A was to switch those pages to Full Width, which would have forced a Theme Builder header at the same time.

Each Canvas page mounts the footer inside a wrapper section carrying the class **`v4b-footer-mount`** and `html_tag = footer`. That wrapper would otherwise apply the gutter, the rhythm and the container max-width a second time, so section 6 of the snippet neutralises it. Note the control name for a section's CSS class is `css_classes`, **not** `_css_classes`.

Verified logged-out in an isolated browser context, all 10 URLs: exactly **one** footer block, exactly **one** `<footer>` landmark, no hello-elementor fallback footer, one copyright line. Measured identical on a Canvas page and a Theme Builder page:

| | mobile 390 | desktop 1440 |
|---|---|---|
| Footer height | 1312px | 1002px |
| First heading left edge | 30px | 548px |
| Container width | — | 1290px |
| Horizontal overflow | 0px | 0px |

All three Canvas pages **gained** a `<footer>` landmark they never had.

**Product footer changed by design**, per the owner decision of 2026-08-15: the old product footer had Facebook, Twitter, Instagram and Youtube icons whose URLs were all **empty strings**. It now shows the homepage's three working links. The link lists were byte-identical, verified by diffing the exported JSON.

**Also found, not acted on:** the header is duplicated per page exactly like the footer was — `705659ef` home, `8463f45` contact, `2b01d8b7` services, `d400355` basket, `2ff20782` product. `/privacy-policy/`, `/shop/`, `/basket/` and `/my-account/` fall back to the bare hello-elementor header.

Rollback material for every deletion is in [`rollback/`](rollback/) as exported Elementor JSON, plus library template **2055** on the site itself.

#### ✅ #15 — dead links, and #5 — tappable phone/email (shipped 2026-08-15)

Done as one edit pass over templates **2055** and **2059**, immediately after the consolidation. Both templates were proven identical before editing (JSON diff ignoring element IDs) and given the same changes.

**The finding was worse than the audit recorded.** Not "6 of 8 footer links point at 404s" — **all 8 quick links were `href="#"`**, plus all 4 Contact Info rows. Nothing in the footer went anywhere. Separately, the 5 slugs the audit named do not exist at all: `/visa/`, `/coaching/`, `/pricing/`, `/support/`, `/terms-and-conditions/` all return 404. The site has exactly **9 published pages** and **0 posts**.

| Change | Detail |
|---|---|
| Quick Links wired | About → `/about-us/`, Contact → `/contact-us/`, Privacy Policy → `/privacy-policy/` |
| Our Services added | It had no footer link anywhere before. Part of the owner's layout choice below. |
| 5 dead links removed | Visa, Coaching, Pricing, Support, Terms & Conditions |
| `Support` column deleted | Owner chose to merge into one Quick Links column (option A of three shown). Footer is now **3 columns**, was 4. |
| Column widths | Elementor resets `_inline_size` to null on column delete, and setting sizes one at a time makes each column steal from its neighbour (came out summing to 95.3%). Left at **auto** = equal thirds. Tablet kept at the original `50` each. |
| Phone tappable | `tel:+6287862273133` |
| Email tappable | `mailto:info1visaforbali@gmail.com` |
| Address + opening hours | `href="#"` removed entirely — they are not links, so they are now plain text |
| `EXPLORE NOW` | `#` → `/our-services/`, per owner. Single occurrence sitewide: button `3fb58a9a` on page 149. |

Verified logged-out in an isolated context across **all 10 page types** plus a real `/product/*` URL: `href="#"` count **0**, `tel:` **1**, `mailto:` **1**, exactly one footer, quick links resolve to the four real pages. Measured identical on a Canvas page (`/contact-us/`, template 2055) and a Theme Builder page (`/our-services/`, template 2059):

| | mobile 390 | desktop 1440 |
|---|---|---|
| Footer height | 1083px (was 1312 — one column fewer) | 978px (was 1002) |
| First heading left edge | 30px | 501px |
| Columns | stacked | 3 × 423px |
| Container width | — | 1290px |
| Horizontal overflow | 0px | 0px |

Rollback: the deleted `Support` column is exported for both templates in [`rollback/`](rollback/).

**Two things this surfaced, neither acted on:**

- **#3 got more urgent.** The WhatsApp float now covers *working* links on mobile — it sits over `Our Services` and `Contact` in the footer, not just the hero button. Before this change those links were dead, so the overlap cost nothing.
- Footer link rows are **21px tall**, well under the 44px target. That is Round 3 #11, unchanged by this work, but it now applies to links people will actually try to tap.

Also observed and left alone: the footer row carries an explicit mobile column reversal (computed `order: 10 / 9 / 8`), so on mobile the stack reads Contact Info → Quick Links → logo/social/copyright. Pre-existing and deliberate-looking.

#### Numbered fixes — remaining in Round 2

| # | Fix | Where | Blocked by |
|---|---|---|---|
| 3 | WhatsApp float widget covers `EXPLORE NOW`, the pricing footnote, and now the footer's Quick Links | WP admin → WhatsApp → Floating Widget; or CSS | — |
| 4 | `CONTACT US` missing from mobile menu (desktop has it, mobile menu `#menu-header-menu` has 3 items) | Appearance → Menus, + the jkit mobile header section | ⚠️ **No rollback material exists for menu edits** — the JSON exports cover Elementor page content only |

~~⚠️ Footer is **duplicated per page**~~ — resolved 2026-08-15, see above. The earlier note that `/product/*` used "a third variant" was half right: it was a second variant, and `/shop/` turned out to have no Elementor footer at all.

### ⬜ Round 3 — consistency

| # | Fix |
|---|---|
| 11 | Tap targets to 44px (26 on `/`, 31 on `/our-services/`, 20 on `/about-us/`) |
| 17 | Body text 14px → 16px |
| 18 | Heading scale (H2 renders at 48 / 32 / 28px) |
| 9 | About Us team grid → 2 columns (page is 16,897px tall on mobile) |
| 23 | Label both office locations on Contact — Lombok branch confirmed real by owner, currently an unlabelled second map |

### ⬜ Round 4 — cleanup

| # | Fix |
|---|---|
| 16 | WP Rocket delays 50 scripts; 16 widgets sit at `visibility:hidden` until first interaction, showing a ~1,100px blank gap on slow connections |
| 20 | Cart reads "Rp0" when empty |
| 21 | Icon-font labels leak as text — footer "Jki-facebook-f", contact page "Jki-facebook-light" + stray glyph `ףּ` |
| 22 | About Us: 20 empty headings used as spacers, 46 images with no alt |
| 24 | Slider ARIA reads "slide 17 to 18 of 5" |
| 19 | Container max-width varies 1270 / 1290 / 1310px on desktop |

### ⏸ Deferred — owner set low priority 2026-08-15

| # | Fix |
|---|---|
| 12 | `/shop/` renders with the raw hello-elementor theme — no logo, no footer, no brand styling. `/product/*` uses a third header/footer variant. |
| 13 | Product page: WooCommerce default purple `#7F54B3` add-to-cart at 142×35, no breadcrumb, no description, no tabs, category "Uncategorised", product image is a price-list screenshot |
| 14 | Shop shows 2 products per page → 6 pages for 12 products |

---

## Open questions for the owner

1. ~~**Backup**~~ — owner decided 2026-08-15 to proceed without one. Substitute safety net: every deleted section was exported to [`rollback/`](rollback/) and saved as library template 2055 first.
2. ~~**Footer consolidation**~~ — owner chose to consolidate, then chose option B for the Canvas pages. Complete. **Follow-up worth raising: the header is still duplicated per page**, and consolidating it is the same job over again — plus it is what #4 actually needs.
3. **About Us photos** — cards for **Ari** and **Rhoga** use the same image. Pre-existing, not caused by Round 1. Wrong upload?
4. ~~**`EXPLORE NOW`**~~ — owner chose `/our-services/` on 2026-08-15. Shipped.

---

## Notes worth keeping

- Admin sessions bypass WP Rocket's "Delay JavaScript Execution", so the admin view of a page is **not** what visitors see. Every visual check must be repeated logged-out.
- `Date`-stamped audit baseline: 2026-05-28 (`ui-bugs.md`, `ux-improvement.md`). Fresh audit: 2026-08-15 (`ui-ux-2026-08.md`). Items resolved between the two are listed at the end of the fresh audit.
- Nothing in this repo auto-deploys. Every deliverable is applied by hand in WP admin.
