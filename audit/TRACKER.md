# UI/UX Fix Tracker — visa4bali.com

Single source of truth for the mobile-tidiness work started 2026-08-15.
Findings and evidence live in [`ui-ux-2026-08.md`](ui-ux-2026-08.md); this file tracks **state**.

**Last updated:** 2026-08-15 · **Current position:** Round 1 shipped and verified. **Rounds 1, 2 and 3 are all complete and verified.** Remaining work is Round 4 (cleanup), the deferred items, and the open question of consolidating the header the way the footer was.

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
| WPCode snippet `V4B — Round 1 mobile spacing` | ID **2054**, CSS type, site-wide header, **active** | Source mirrored at [`round1-mobile.css`](round1-mobile.css). Disable to revert all of Round 1. Edited 2026-08-15 for the footer consolidation: `.elementor-2059` added to the vertical-rhythm rule, and a new **section 6** added *outside* the mobile media query to neutralise the `v4b-footer-mount` wrapper. Edited again the same day for Round 3: **section 7** (body text 16px, #17), **section 8** (44px tap targets, #11) and **section 9** (About Us team grid, #9) and **section 10** (heading scale, #18), all inside the mobile query. Then **section 11** (header background) and **section 12** (header nav spacing, ≥1025px) for the owner-reported header band — both *outside* the mobile query. Now 17,685 chars, sha256 `e0cec3b9`. |
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

### ✅ Round 2 — mobile conversion path (complete 2026-08-15)

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

**One thing this surfaced, not acted on:** footer link rows are **21px tall**, well under the 44px target. That is Round 3 #11, unchanged by this work, but it now applies to links people will actually try to tap.

Also observed and left alone: the footer row carries an explicit mobile column reversal (computed `order: 10 / 9 / 8`), so on mobile the stack reads Contact Info → Quick Links → logo/social/copyright. Pre-existing and deliberate-looking.

#### ❌ #3 — WhatsApp float overlap: closed, does not reproduce (2026-08-15)

Re-measured at 390 after Round 1, logged-out. The float sits at x 304–360 / y 758–814, with its "Need Help? Chat with us" label extending the zone left to x=141.

- **Homepage at scroll 0:** `EXPLORE NOW` occupies y 599–653. The float is 105px below it. Nothing at all intersects the float zone.
- **Full-page sweep, 31 scroll positions over 9,037px:** the only element persistently under the float is the float's own label. Every other element registers at exactly 1 of 31 positions — i.e. it passes underneath while scrolling, which is inherent to any fixed element. `EXPLORE NOW` never registers.
- **No "pricing footnote" exists** on the page to be covered.
- **Footer:** link *text* ends at x ≤ 243; only the anchors' empty right margin (x 304–346) meets the float. No text is ever obscured.

Most likely fixed as a side effect of Round 1 dropping the hero padding from 160px to 56px, which moved the button up. Owner reviewed a live screenshot and agreed it is not a problem. **I had claimed this got worse after the footer rewrite — that was wrong, called from a screenshot rather than measured.**

#### ✅ #4 — `CONTACT US` in the mobile menu (shipped 2026-08-15)

**One edit, not five.** The worry that the per-page header duplication would force five edits was wrong: every page — including the three with no branded header, which fall back to hello-elementor — renders the *same* WP menu, `Header Menu` (term **5**, location `menu-1`). The per-page `jkit_nav_menu` widgets differ in element ID but all pull that one menu.

**The cause was not what the audit recorded.** `CONTACT US` was never a menu item that mobile dropped. The WP menu had 3 items at *every* breakpoint. Desktop's `Contact Us` is a separate **button widget** carrying `elementor-hidden-tablet elementor-hidden-mobile` — deliberately hidden. And it only exists on three pages:

| Page | Contact Us button | On mobile |
|---|---|---|
| `/` (149) | `3682679` | hidden |
| `/about-us/` (155) | `1fedbe36` | hidden |
| `/our-services/` (102) | `285f06e` | hidden |
| other 6 page types | none at all | — |

So on mobile there was **no route to `/contact-us/` from the header on any page**. Adding one menu item fixed all nine at once.

Owner chose to **keep the desktop CTA button** as well, so desktop now shows both a nav item and the coloured button — a normal pattern, and it avoided three more Elementor edits.

Menu 5 is now `Home (305) · About Us (167) · Our Services (168) · Contact Us (2109)`, all `publish`, in that order. Verified logged-out after a cache purge on all 9 page types, and by opening the hamburger at 390: 4 items visible, `Contact Us` at y=388, tap target **320×42px**, 0 overflow.

Rollback is deleting menu item **2109** — no export needed, the change is purely additive.

⚠️ *My own mess, cleaned up:* the first attempt used `admin-ajax.php?action=add-menu-item`, which only stages a **draft** item; it never joins the menu until the form is saved. That left orphan draft item **2108**, which I then deleted via `DELETE /wp/v2/menu-items/2108?force=true` after confirming it was draft, titled `Contact Us`, and attached to no menu. The working path is the real UI: tick the page, `#submit-posttype-page`, then `#save_menu_footer`.

**Noticed, not acted on:** several page types render the same menu **two or three times** in the DOM (`menu-header-menu`, `-1`, `-2`) — the theme header and the Elementor header both output it. 3 copies on `/our-services/`, `/basket/` and `/product/*`; 2 on `/privacy-policy/`, `/shop/`, `/my-account/`. Pre-existing, invisible to sighted users, but it is repeated navigation for screen readers. Belongs with the header consolidation question.

~~⚠️ Footer is **duplicated per page**~~ — resolved 2026-08-15, see above. The earlier note that `/product/*` used "a third variant" was half right: it was a second variant, and `/shop/` turned out to have no Elementor footer at all.

### ✅ Round 3 — consistency (complete 2026-08-15)

#### ✅ #17 — body text 16px, and #11 — 44px tap targets (shipped 2026-08-15)

Both are CSS-only, added as **sections 7 and 8** of WPCode snippet 2054 inside the existing `max-width:767px` query. Disabling the snippet still reverts everything. The editor's content was SHA-256 hashed against [`round1-mobile.css`](round1-mobile.css) before every save and again after reload, so the mirror is known-exact rather than assumed.

**#17.** Measured at 390 before the change: 181 body-text elements on the homepage at 14px/21px against a single one at 16px; every body element on the other three primary pages at 14px. **Desktop was already 16px**, so this makes mobile match desktop rather than inventing a scale.

Written as an explicit selector list, not a blanket bump — several heading tags here are small labels (H6 at 14px ×20 on `/about-us/`, H5 at 11px on `/our-services/`) and the accordion's `.title` is 18px, all of which a flat rule would have resized or shrunk. Verified beforehand that every element the selectors match was at 14px.

Left at 14px deliberately: `jkit_fun_fact .title`, a caption under a large counter. (Its copy reads "Success**full** Visa & Extension Created" — a spelling error, owner's call to fix.)

**#11.** Every selector was read off the live DOM. Measured offenders: hamburger 26×24, drawer menu items 320×42, close button 45×41, cart toggle 64×42, video button 42×42, `Watch Intro` 104×**12**, `Service Detail` 139×**15**, accordion header 320×23, social icons 38×38, footer links 24px, and the `/about-us/` logo 35×35. `min-height` alone was not enough — several are `inline-block`, so the label would have sat at the top of an enlarged box; those are switched to a centred flex box.

Only *links* are reached, which is why plain-text icon-list items — the feature lists on `/our-services/`, the address and opening hours in the footer — did not grow.

| Page | Tap targets under 44px | Body text | Page height | Overflow |
|---|---|---|---|---|
| `/` | **19 of 27 → 0 of 30** | 78 elements now 16px | 9,037 → 9,780px | 0 |
| `/about-us/` | **16 of 17 → 0 of 17** | 12 elements | 16,365 → 16,815px | 0 |
| `/our-services/` | → **0 of 26** | 21 elements | 9,257 → 9,535px | 0 |
| `/contact-us/` | → **0 of 26** | 10 elements | 4,407 → 4,640px | 0 |

Footer grew 1,083 → 1,298px on mobile, from six links gaining vertical padding.

Desktop 1440 re-checked after both changes: footer still 978px, social icons still 38×38, footer links still 24px, nav items still 40px — all identical to the pre-change values. Nothing crossed the breakpoint.

#### ✅ #23 — both office locations labelled (shipped 2026-08-15)

The map section on `/contact-us/` (`265a4e2f` → column `1bf733c1`) contained **nothing but the two map widgets** — no heading of any kind, so neither map was identified.

The second map points at `J2WR+4W Gili Indah, North Lombok Regency, West Nusa Tenggara`. Searching every page for "lombok", "gili", "branch", "office" and "cabang" found **no mention anywhere** — `/about-us/` still describes the company as "a visa agency based in Jimbaran, Bali". So there was no source on the site for what the second location is, and naming it was the owner's call, not an inference. Owner chose the head-office / branch framing.

Two `heading` widgets added to page 193, H3, inheriting the same global typography and colour as the existing `Contact Information` heading:

| Position | Text | Widget |
|---|---|---|
| above map `152f4d4c` | **Head Office Bali** | `4c5102b` |
| above map `2e2099a` | **Branch Office Lombok** | `52634c8` |

Rollback is deleting those two widgets. Note the Lombok street address still appears nowhere in text — only inside the map embed.

#### ✅ #18 — heading scale (shipped 2026-08-15)

Owner chose the CSS-only route. **Measuring changed what "unify" meant.** The site already has a scale and mostly keeps to it — **H1 36 / H2 32 / H3 24 / H4 18**, with H5 11 as a consistent eyebrow on `/`, `/about-us/` and `/our-services/`. The audit's "H2 renders at 48 / 32 / 28" described a page Round 1 has since changed. The scale I proposed in the decision preview (32 / 26 / 20) would have moved more headings than it fixed, so the existing scale was kept and eight strays brought onto it:

| Page | Heading | Was | Now |
|---|---|---|---|
| `/` | We provide an easy process | H2 28 | 32 |
| `/` | Easy and stress-free visa process | H4 20 | 18 |
| `/` | Problem Solver for your visa issue | H4 20 | 18 |
| `/contact-us/` | Your Details | H3 26 | 24 |
| `/contact-us/` | How can we help? | H3 26 | 24 |
| `/contact-us/` | Follow our social media : | H3 20 | 24 |
| `/contact-us/` | Head Office Bali | H3 20 | 24 |
| `/contact-us/` | Branch Office Lombok | H3 20 | 24 |

**Per element, not per tag, and deliberately so.** `heading.default` serves both section headings and labels: on `/our-services/` an H2 holds the step number "04" at 20px and another holds a footnote at 16px; on `/about-us/` H3 is a team member's name. A tag-based rule would have inflated all of them.

Left alone on purpose: the homepage hero H1/H2 at 30px — Round 1 forced that down from 48px because "To Travel to Bali" rendered clipped, and re-verified after this change that it still fits exactly (scrollWidth 310 = width 310); the H5 11px eyebrows, already consistent; and card-level headings from `jkit_icon_box`, `jkit_heading` and `jkit_team`.

`/contact-us/` now reads H1 36 · H3 24 ×6 · H4 18. Desktop re-checked: the three homepage elements still render 40 / 20 / 20px, untouched. Extending the tidy-up to desktop is a separate decision.

#### ✅ #9 — About Us team grid, two columns (shipped 2026-08-15)

**Page 16,815 → 11,642px, 19.8 → 13.8 phone screens.** Section 9 of the snippet, mobile only.

A plain 50%-width rule was not enough, and that only became visible by measuring: the 20 cards are not one grid but **eight inner sections** holding 3/1/3/3/3/2/3/2 columns. Halving the width gave rows of 2, then 1, then 2, then 1 — 13,249px and visibly ragged. The fix removes those eight sections and their containers from the box tree with `display:contents`, making all 20 columns siblings of one wrapping flex row. Result: **10 rows of exactly 2**, uniform 169px cards at x=20 and x=201, gutter intact at 20px.

Two things checked rather than assumed:

- **The cards are layered compositions.** Each column holds a `jkit_team` block, a heading, an absolutely-positioned photo overlay at a fixed `left:-32px`, and an absolutely-positioned 210px spacer. I first suspected those 20 spacers were 4,200px of dead height — measuring showed they are `position:absolute` and cost nothing. Narrowing the column also did not break the overlay: it is sized in percentages and tracks the column.
- **Cards came out staggered by 20px.** Not a design choice — desktop has no stagger. Elementor puts `margin-top:20px` on the widget-wrap of every column after the first, to space them while stacked; side by side it reads as misalignment. Zeroed, with row spacing moved to the flex gap.

`fd36e36` is the wrapper column, confirmed to appear on `/about-us/` only. A trailing empty 1px section rides along in the flatten; it is last in the order so it displaces nothing, but a card added after it would land after it.

Desktop 1440 re-checked: inner sections still `display:block`, still 3/1/3/3/3/2/3/2 at the original 423 / 1270 / 635px widths. Nothing crossed the breakpoint. Tap targets on the page remain 0 under 44px, overflow 0.

**#18 inventory, measured at 390.** The audit's "H2 renders at 48 / 32 / 28px" understated it — heading tags are used for both headings and small labels, so no tag-based rule is safe:

| Page | Headings as rendered |
|---|---|
| `/` | H1 30 · H2 30 · H2 28 · H3 24 · H4 18 |
| `/about-us/` | H1 36 · H2 32 ×2 · H3 20 ×21 · H4 18 ×2 · H5 **11** ×2 · H6 **14** ×20 |
| `/our-services/` | H1 36 · H2 32 · H2 20 · H2 **16** · H3 24 ×2 · H3 20 ×10 · H3 **14** ×2 · H4 18 ×2 · H5 **11** ×2 · H6 16 |
| `/contact-us/` | H1 36 · H3 26 ×2 · H3 24 · H3 20 · H4 18 ×2 · H6 20 ×3 |

The bolded ones are labels wearing heading tags. Fixing this means choosing a scale and applying it per widget, and deciding whether the mislabelled ones become non-headings — a design and structure decision.

### 🐞 Sticky footer — found and fixed 2026-08-15 (owner-reported)

Owner reported a band above the navbar on desktop, dark on `/our-services/`. Root cause: the footer section had **Jeg Elementor Kit's "Sticky Element"** turned on.

```
jkit_sticky_section = enabled   jkit_sticky_position = fixed
jkit_sticky_trigger = up        jkit_sticky_device   = desktop   jkit_sticky_zindex = 1
```

JKit's script pinned the whole footer to the top of the viewport — `position:fixed; top:22px`, full width, 978px tall, behind the page at z-index 1. Its top edge showed as a navy `rgb(8,15,40)` strip above the header, and the `CONTACT US` button sat clipped against it.

It took measuring to find, because hit-testing the strip returned the header section with a **transparent** background and every ancestor up to `body` was transparent or white. Nothing in the normal paint path explained the colour. Sweeping every element for a dark background intersecting the top 90px is what surfaced a `position:fixed` section that had no business being there.

**Not caused by the consolidation, but spread by it.** The exports in [`rollback/`](rollback/), taken *before* deletion, settle it — the setting was already on 4 of the 6 original inline footers:

| Original footer | `jkit_sticky_section` |
|---|---|
| home 149 · about-us 155 · contact-us 193 · our-services 102 | **enabled** |
| basket 336 · product 424 | empty |

Since template 2055 was built from home's footer, the consolidation carried the flag onto all 10 page types, including the six that were previously clean. Turned off on **2055** (`1020e61f`) and **2059** (`14795f19`); `jkit-sticky-element--enabled` now appears **0 times** on all 9 page types.

**Visitors were affected, not just admins.** Logged-out at 1900: on load the footer is in flow at y=4980, but after the visitor scrolls up it pins to `position:fixed; top:22px` and stays pinned. Re-verified after the fix — it stays `relative` through the same scroll-up, and the header sits at y=0.

The residual dark bar in the owner's screenshots at y 0–32 is the WordPress admin bar, which is normal and invisible to visitors.

### 🐞 Header overlap band — found and fixed 2026-08-15 (owner-reported)

Owner reported a pale strip above the navbar, present on `/` but not on `/contact-us/`.

**Mechanism.** Every page header carries a fixed negative bottom margin so it sits *over* the section beneath it — the transparent-header-over-hero pattern. Desktop uses `-99px`, mobile `-76px`. But the header's right column is a **wrapping flex row**, so when its contents stop fitting on one line the header grows taller than that fixed overlap, and the difference is left above the hero's background, exposing the white body behind:

```
band height = header height − overlap
```

Usable width in that column is **853px** — the column measures 873px but its widget-wrap has `padding:10px` with `border-box`. Contents need **886px** on `/` and `/our-services/` (they carry the cart widget) and 787px on `/about-us/` and `/contact-us/`. The container is capped at 1290px, so on the cart pages no viewport width could ever make it fit.

Finding it needed measurement, not inspection: hit-testing the strip returned the header section with a **transparent** background and every ancestor up to `body` was transparent or white, so nothing in the paint path explained it. The geometry did.

| Width | `/` · `/our-services/` | `/about-us/` · `/contact-us/` |
|---|---|---|
| 1900 | 38px (0 before fix #4) | 0 |
| 1300 | 38px (0 before fix #4) | 0 |
| 1150 | 40px | 40px |
| 1025 | 40px (**38px before fix #4**) | 40px |
| 390 | 35px | 35px |

**Partly mine.** Adding `Contact Us` to the WP menu for #4 added a 157px item to a row with 144px of slack. Below roughly 1100px the band already existed; above it, my change is what introduced it — and on the cart pages it pushed the requirement past the container cap, so it showed at every desktop width. My first report of this said the whole thing was my doing; measuring at 1025 with the item hidden showed a 38px band still there, which corrected that.

**Fixed in two parts, because neither alone covers the range** — sections **11** and **12** of snippet 2054:

- **11, background.** The four overlapping headers (`705659ef`, `3235a6ef`, `8463f45`, `2b01d8b7`) are painted `#f5f7fb`, the exact flat colour of the section beneath each — verified on all four, no background images. Any residual shortfall is now invisible at any width and any header height. `/basket/` and `/product/*` headers are **excluded on purpose**: they use `margin-bottom:0`, overlap nothing, and sit on white, so painting them would create a strip that is not there today.
- **12, spacing.** Nav item left margin `30px → 18px` at ≥1025px frees 48px, so menu + button + cart fit one line and the header stays 95px. Tuned by measurement — 22px left 854px against 853 and still wrapped by a single pixel. Desktop only; the mobile drawer keeps its own spacing and its 44px tap targets from section 8.

Verified logged-out: `/` at 1900 → header 95px, one row, next section at −4, band 0. `/` and `/contact-us/` at 1150 → header still 139px but header and section colours identical, nothing visible. `/` at 390 → same, drawer items still 44px. `/basket/` → header still transparent, widgets on one row, 0 overflow.

**Still fragile by design.** The overlap is a hard-coded number that assumes a single-row header. Section 11 is what makes that safe to live with; anything that widens the header row again will wrap silently rather than show a strip.

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
