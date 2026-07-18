# UX & Improvement Audit — visa4bali.com

Audited 2026-05-28. Business: Bali visa agency, sells visa services via WooCommerce + WhatsApp.

## Conversion flow context

Primary conversions: (1) WhatsApp contact, (2) WooCommerce checkout. Both present. Cart shows "No products in the cart / 0". Prices observed: `Rp0` ×2 (see issue below).

## What's working 🟢

- WhatsApp click-to-chat integrated (wp-whatsapp plugin) — right channel for this market.
- Clear nav: Home / About / Services / Contact / Cart.
- Strong social proof volume — multilingual testimonials (EN/RU + DE/KO clients).
- Trust claims: "#1 visa agency", "3-day turnaround", overstay rescue stories.
- Local business schema + physical address (Jimbaran) + hours.
- YouTube intro video embed (humanizes brand).

## Issues

### 🟠 Contact email is `gmail.com` — PARTIAL (owner decision 2026-05-28)
Site displays `info1visa4bali@gmail.com` + `info1visaforbali@gmail.com` publicly. Generic Gmail addresses for a passport/payment business read low-trust.
**Owner decision (2026-05-28):** keep the public-facing gmail addresses unchanged (existing customers know them).
**Done instead:** backend uses domain mailbox `info@visa4bali.com` via SMTP (Easy WP SMTP + smtp.hostinger.com:465 SSL, DKIM-signed). WP admin, WooCommerce From, and MetForm notifications all switched to `info@visa4bali.com`. Outgoing mail now delivers from the domain (better deliverability + DKIM), while public contact UI still shows the gmail addresses.
**Recommendation (future):** when owner ready, also publish `info@visa4bali.com` on the site (or alias gmail → info@visa4bali.com) for trust consistency.

### ~~🟠 `Rp0` prices showing~~ — RESOLVED 2026-05-28
Initial scan flagged Rp0 from homepage. Verified via `wc/store/v1/products` API: **all 12 products priced correctly** (Rp 750k – 12.5M). The Rp0 was the empty mini-cart total in the nav header (`elementor-menu-cart__toggle_button`) — normal WooCommerce display when cart is empty.
**Status:** No action needed. Possible UX nit: header showing "Rp0" when cart empty looks odd; consider hiding the price portion until items added (Elementor menu cart widget setting).

### 🟠 Duplicate testimonials (same 4 reviews 3×)
The slider repeats the identical 4 reviews three times. Looks padded/fake on close read; also bloats DOM.
**Fix:** add more *unique* genuine reviews. Pull from Google Business reviews (also helps local SEO). Show reviewer photo + source badge (Google) for authenticity.

### 🟠 Broken-sentence hero headings
"Apply for a Visa" + "To travel to Bali" as separate stacked headings reads awkwardly. CTAs "EXPLORE NOW" / "WATCH INTRO" are vague.
**Fix:** clear value-prop headline + specific CTA. E.g. H1 *"Bali Visa Extensions & Stay Permits — Done in 3 Days"*, primary CTA *"Get My Visa on WhatsApp"*, secondary *"See Services & Prices"*.

### 🟡 Mixed-language content with no language switcher
Russian testimonials sit inline among English. Good for RU visitors, confusing for others; no way to pick language.
**Fix:** if RU is a key market, add proper i18n (WPML/Polylang) with switcher; otherwise translate/caption testimonials.

### 🟡 Trust/credibility gaps for a legal service
Handling passports + immigration + payments demands strong trust signals. Missing/unclear:
- Company registration / legal entity number (PT / izin).
- Clear refund / guarantee policy.
- Privacy policy for passport data (also legally required).
- Secure-payment badges at checkout.
- Real team photos/names beyond first names (Feny, Nanda, Rolly mentioned).
**Fix:** add an explicit trust section: legal license, privacy policy, refund terms, payment security, staff credentials.

### 🟡 Vague CTAs / unclear next step
"EXPLORE NOW", "SHOW MORE VISA SERVICES", "WATCH INTRO" — none drive a clear single action. Visa buyers want: *which visa do I need? how much? how do I start?*
**Fix:** add a short "Which visa do you need?" guided selector or a comparison table (B211 vs E-VoA vs family) with price + duration + CTA per option.

### 🟡 Slider labels leak ("slide 17 to 20 of 5")
Accessibility text "slide 12 to 14 of 4" / "slide 17 to 20 of 5" is visible/garbled — indicates slider misconfiguration.
**Fix:** check WooLentor/tiny-slider settings; hide or fix these ARIA/label strings.

### 🟢 Mobile
Viewport + WhatsApp float are mobile-friendly. Verify tap targets, hero image weight on 3G/4G (see performance.md), and form usability on small screens.

## Conversion-focused priority

1. 🟠 Fix Rp0 pricing / switch to quote CTA.
2. 🟠 Domain email + trust section (license, privacy, refund).
3. 🟠 Real unique reviews (Google), drop duplicates.
4. 🟠 Sharper hero headline + single clear CTA.
5. 🟡 Visa comparison/selector to guide choice.
6. 🟡 Language handling + fix slider labels.

> Suggest: add Google Business Profile reviews widget, a sticky "Chat on WhatsApp" CTA, and a simple lead form (name + visa type + arrival date) feeding WhatsApp/email.
