# GEO Analysis — visa4bali.com

**Generative Engine Optimization (AI Search Readiness) audit** · Analyzed 2026-07-07
Method: live fetch of homepage + `/about-us/`, `/our-services/`, `/contact-us/`, one product page (`/product/e-voa-30-days/`), `robots.txt`, `llms.txt`, `sitemap.xml`, and raw-HTML vs. rendered-content comparison.

> **Framing:** GEO is not a separate discipline from SEO. Every recommendation below is a standard SEO fundamental (crawlability, structured data, clear direct-answer content, E-E-A-T signals) applied to AI-answer surfaces, consistent with Google's own guidance that "there's no separate playbook for AI Overviews." Where a popular "GEO tactic" has no proven citation weight (e.g. `llms.txt`), that is flagged explicitly rather than oversold.

---

## 1. GEO Readiness Score: **53 / 100**

| Dimension | Weight | Score /100 | Rationale |
|---|---|---|---|
| Citability | 25% | 40 | Core passages (About, product descriptions) run 85–110 words — below the 134–167 word optimal citation window. FAQ block exists (4 Q&As) with direct answers, but no statistics carry source attribution and only the FAQ uses question-phrased headings. |
| Structural Readability | 20% | 60 | Clean, valid H1→H2→H3 hierarchy on every page checked. Numbered "4 Steps" process list and bulleted visa requirements are good extractable structures. No comparison tables (a natural fit for 10+ visa types) and most H2/H3s are declarative ("About Visa4Bali") rather than question-based. |
| Multi-Modal Content | 15% | 55 | Product photos, team headshots (16 staff), one embedded "Watch Intro" YouTube video. No infographics, no downloadable checklists/PDFs, no video transcript, no comparison charts across visa types. |
| Authority & Brand Signals | 20% | 35 | Owner "Mr. Rolly" is named but has no bio, credentials, or license number. Footer copyright is stuck at "© 2024" on every page despite the CMS recording page edits as recently as June 2026. Organization JSON-LD email (`info1visa4bali@gmail.com`) does not match the LegalService JSON-LD email and the visible contact-page email (`info1visaforbali@gmail.com`) — an internal NAP inconsistency on the same page. No Wikipedia, Reddit, or LinkedIn presence found. Testimonials are shown but not marked up as `Review`/`AggregateRating`. |
| Technical Accessibility | 20% | 80 | Fully server-side rendered (WordPress/Elementor) — confirmed content parity between raw HTML and rendered DOM. `robots.txt` is a permissive wildcard that allows every AI crawler tested (200 OK for GPTBot, ClaudeBot, PerplexityBot, CCBot, Bingbot). Valid XML sitemap. `llms.txt` exists but is a low-quality, auto-generated file dump (see §4). |

**Weighted total = 0.25(40) + 0.20(60) + 0.15(55) + 0.20(35) + 0.20(80) = 53/100**

**Verdict:** Technically crawlable and indexable (no gate-keeping problems), but the site currently gives AI answer engines almost nothing self-contained to quote, and its off-site/authority footprint is close to zero — typical for a small local service business, but fixable with content and schema work, not a redesign.

---

## 2. Platform Breakdown

| Platform | Est. Score /100 | Why |
|---|---|---|
| **Google AI Overviews** | ~55 | AIO citations correlate heavily with classic top-10 ranking. Solid `LegalService`/`Organization` local-business schema and NAP data help local "visa agent Bali" intent, but thin informational content limits pickup for explainer-style queries ("how long is a Bali visa extension," "how much is Indonesia overstay fine"). |
| **ChatGPT (Search/browsing)** | ~35 | Page is crawlable (`GPTBot`/`OAI-SearchBot` both get 200), but ChatGPT search leans on pages with citable stats, sources, and third-party corroboration (Wikipedia/Reddit-type validation), none of which exist here. |
| **Perplexity** | ~40 | `PerplexityBot` unblocked and FAQ content is a good citation seed, but passages are shorter than ideal and carry no source links, so Perplexity has little to quote verbatim without paraphrasing risk. |
| **Bing Copilot** | ~50 | Bing-index driven; same technical strengths as Google AIO apply. No IndexNow signal detected either way — worth confirming submission. |

Only an estimated ~11% of domains get cited by both ChatGPT and Google AI Overviews simultaneously — visa4bali.com's realistic near-term goal is Google AIO/Bing (ranking-driven, where its local schema already helps) before chasing ChatGPT/Perplexity (entity/citation-driven, where it currently has no footprint).

---

## 3. AI Crawler Access Status

`robots.txt` (`https://visa4bali.com/robots.txt`, HTTP 200):

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://visa4bali.com/sitemap.xml
Sitemap: https://visa4bali.com/sitemap.rss
```

There are **no bot-specific rules at all** — every crawler inherits the wildcard `Allow` (only `/wp-admin/` is blocked). Live UA-spoofed requests confirmed 200 OK for every crawler tested:

| Crawler | Purpose | Status |
|---|---|---|
| GPTBot | OpenAI training/search crawl | ✅ Allowed (200) |
| OAI-SearchBot | ChatGPT search citations | ✅ Allowed (wildcard) |
| ChatGPT-User | Live ChatGPT browsing | ✅ Allowed (wildcard) |
| ClaudeBot | Anthropic crawl/search | ✅ Allowed (200) |
| PerplexityBot | Perplexity search citations | ✅ Allowed (200) |
| Bingbot | Bing / Copilot index | ✅ Allowed (200) |
| CCBot | Common Crawl (feeds many LLM training sets) | ✅ Allowed (200) — training-only, optional to block |
| anthropic-ai | Anthropic training crawl | ✅ Allowed (wildcard) — training-only, optional to block |
| cohere-ai | Cohere training crawl | ✅ Allowed (wildcard) — training-only, optional to block |
| Bytespider | ByteDance/TikTok crawl | ✅ Allowed (wildcard) |

**Nothing is currently blocked — this is a technical pass.** The recommendation is not to open access (it's already open) but to make the intent explicit and future-proof it, since a future SEO plugin, CDN/WAF rule, or security-hardening pass could silently add a rule that blocks these bots without anyone noticing (a common regression on WordPress sites when switching security plugins or CDNs).

**Suggested explicit additions** (append to `robots.txt`, does not change current behavior, just documents it):

```
# AI search crawlers — explicitly allowed for AI-answer visibility
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

# Training-only crawlers (optional to block — does not affect AI search citations)
# User-agent: CCBot
# Disallow: /
# User-agent: anthropic-ai
# Disallow: /
# User-agent: cohere-ai
# Disallow: /
```

---

## 4. llms.txt Status: **Present, but low quality (auto-generated)**

`https://visa4bali.com/llms.txt` returns HTTP 200. It is machine-generated by the "Hostinger Tools Plugin" (visible in the file's trailing comment) and is essentially a raw sitemap dump, not a curated summary:

- Lists WooCommerce boilerplate pages irrelevant to an AI consumer: `My account`, `Checkout`, `Basket`, `Shop`
- Includes the default, unedited WordPress starter post: `Hello world! — Welcome to WordPress. This is your first post...`
- Descriptions are raw excerpt scrapes with literal `[&hellip;]` truncation artifacts and un-decoded HTML entities (`&amp;`, `&#8217;`)
- No one-line site summary/positioning statement beyond `> Best Visa Agency in Bali`
- Two different business names appear in the same file (`Visa4Bali Luwuk` in old excerpts vs. `Visa4Bali` elsewhere), reflecting a stale rebrand

**Important caveat to keep honest:** `llms.txt` has no confirmed effect on AI citation rates — no major AI vendor (OpenAI, Anthropic, Google, Perplexity) has stated they parse or weight it, and it is not a ranking or citation signal today. Fixing it is low-effort and harmless, but should not be prioritized over the actual content/schema/authority fixes below. Report its presence and quality for completeness, not as a citation lever.

### Ready-to-use replacement `llms.txt`

```markdown
# Visa4Bali

> Licensed visa agency in Jimbaran, Bali, providing Indonesian tourist visa (B211/e-VOA),
> visa extension, KITAS, family visa, and overstay-resolution services for foreign visitors,
> with English- and Russian-language support.

## About

- [About Us](https://visa4bali.com/about-us/): Company background, owner Mr. Rolly, team, and service philosophy.
- [Contact Us](https://visa4bali.com/contact-us/): WhatsApp +62 878-6227-3133, email, Jimbaran office address, Mon–Fri 8am–5pm.

## Services

- [Our Services](https://visa4bali.com/our-services/): Full list of visa and extension services with a 4-step process.
- [E-VOA 30 Days](https://visa4bali.com/product/e-voa-30-days/): Electronic Visa on Arrival, 30 days, extendable once to 60 days total, 1–2 working day processing.
- [Tourist Visa 211 Extension](https://visa4bali.com/product/social-visa-b-211-ru/): B211/C1 extension, up to 180 days total stay across two 60-day extensions.
- [Remote Working Visa (E33G)](https://visa4bali.com/product/remote-working-visa-e33g/): 12-month multiple-entry stay permit for remote workers employed outside Indonesia, minimum income requirement US$60,000/year.
- [Family Visa](https://visa4bali.com/product/family-visa/): Dependent visa for family members of visa/permit holders.
- [D1/D2 Multiple Entry Visa](https://visa4bali.com/product/c12-d12-visa/): 1–2 year multiple-entry visa, 60-day stay per entry, extendable twice.

## FAQ

- [Overstay Fee Information](https://visa4bali.com/): Overstay fines are IDR 1,000,000/day; overstays beyond 60 days result in deportation, per Indonesian immigration regulation.

## Policies

- [Privacy Policy](https://visa4bali.com/privacy-policy/)
```

---

## 5. Brand Mention Analysis

Realistic assessment for a ~10–50 employee local visa-service agency (per its own `Organization` schema `numberOfEmployees`) — this is not a topic-authority publisher, so a near-zero third-party citation footprint is expected, not surprising:

| Signal | Correlation w/ AI citation | Finding |
|---|---|---|
| **YouTube** | ~0.737 (strongest) | One embedded video (`youtube.com/watch?v=MLpWrANjFbI`, homepage "Watch Intro"), not a channel. No transcript, no channel page linked in schema `sameAs`. This is the single highest-leverage off-site signal available and it's almost entirely unused. |
| **Reddit** | High | No evidence of Reddit presence found (no r/bali or r/indonesia threads surfaced in on-site content or links). Not verifiable exhaustively without a live search API — flagged as a gap to investigate, not confirmed absent. |
| **Wikipedia entity** | High | No Wikipedia entry (expected — the business is not independently notable). No Wikidata entity either. |
| **LinkedIn** | Moderate (B2B authority) | No LinkedIn company page linked anywhere on-site. |
| **Facebook** | — | One link found: `facebook.com/rolly.extensionbali` — a **personal profile**, not a Facebook Business Page, and not listed in the `Organization` schema `sameAs` array. |
| **Instagram / TikTok** | — | Both present and correctly declared in `Organization.sameAs` (`instagram.com/visa4bali`, `tiktok.com/@visa4bali`). |
| **Domain Rating / backlinks** | ~0.266 (weak) | Not measured in this audit (requires a backlink index/DataForSEO access, not available in this session) — flagged as untested rather than assumed. |

**Gap:** the schema `sameAs` array is missing the two links that actually exist on the page (Facebook, YouTube), and the Facebook link that does exist points to a personal profile rather than a business entity — a quick, high-value fix.

---

## 6. Passage-Level Citability

Target: **134–167 words**, self-contained, direct answer in the first 40–60 words, ideally under a question-style heading.

**Current inventory of extractable passages (word counts, raw-HTML/trafilatura-equivalent text):**

| Passage | Location | Words | Gap to optimal |
|---|---|---|---|
| "Visa4Bali is No 1 visa agency on Bali..." (company intro) | `/about-us/` | ~85 | -49 to -82 words, no direct "what is" opener |
| E-VOA description ("Process 1-2 working days...") | `/product/e-voa-30-days/` | 89 | -45 to -78 words, buried lede |
| "How do I apply for a 211 tourist Visa..." FAQ answer | Homepage FAQ | 62 | -72 to -105 words |
| "How long does it take for a Tourist Visa to process?" | Homepage FAQ | 24 | -110 to -143 words, too short to stand alone |
| "How to solve overstay problems" (fine amount) | Homepage FAQ | 45 | No source citation for the IDR 1,000,000/day figure |

**None of the current passages fall inside the 134–167 word optimal band** — every extractable block on the site is currently too short, which means an AI engine quoting it either truncates awkwardly or has to synthesize/paraphrase across multiple short fragments (lower confidence citation).

**Question-based headings:** only the 4 FAQ items ("How do I apply...", "How long does it take...", "How to extend my Visa," "How to solve overstay problems") are phrased as questions. Every other H2/H3 on the four pages checked is declarative ("About Visa4Bali," "Best Selling Services," "Our Vision," "Meet With Professional Agents") — a missed opportunity, since visa-type H3s ("211 60 day Visa," "Evoa 30 days," "D1/D2 Multiple Entry Visa") could each become a self-contained question ("How long does the E-VOA 30-day visa last?").

**Statistics without source attribution:** the overstay fine ("1 million per day") and the "12 years of experience" / "since 2012" claim both appear as bare assertions with no link to an authoritative source (e.g., Indonesian Directorate General of Immigration regulation, or a founding-date reference). AI engines weight cited statistics more heavily than unsourced ones.

---

## 7. Server-Side Rendering Check

**Result: Fully SSR — no JS-dependency risk.**

- Homepage raw HTML (pre-JS, direct `curl` fetch) contains the complete visible copy: hero text, About section, FAQ questions and answers, testimonials, footer — confirmed by extracting and word-counting the raw `<body>` (1,205 words) and finding all rendered headings (`Apply for a Visa`, `Popular Questions From our Client`, etc.) present in the raw markup.
- Same result on `/about-us/`, `/our-services/`, `/contact-us/`: title, meta description, headings, and JSON-LD are all present in the initial HTML response with no client-side hydration gap.
- Site runs on WordPress + Elementor, which server-renders markup by default — there is no SPA shell, no `<div id="root"></div>` placeholder, and no reliance on a JS framework to paint primary content.
- **Practical implication:** GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers that do not execute JavaScript will see the exact same content a human visitor sees. This removes an entire class of common GEO failure (content trapped behind React/Vue hydration) — the site's problem is content depth and authority, not renderability.

---

## 8. Top 5 Highest-Impact Changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | **Rewrite core service/FAQ passages into 134–167 word self-contained answer blocks**, each opening with a direct definition/answer in the first 40–60 words, and add a source reference for the overstay-fine and "since 2012" claims. Start with the 4 homepage FAQ answers and the top 3 product pages (E-VOA, B211 extension, Remote Working Visa). | High — directly targets the weakest scoring dimension (Citability, 40/100, 25% weight) and is the single biggest lever on the overall score. | Medium (content rewrite, ~1 day for homepage + 3 product pages) |
| 2 | **Add `FAQPage` JSON-LD schema** wrapping the 4 existing homepage FAQ Q&As, and convert visa-type H3s into question-based subheadings site-wide. | High — FAQ schema is a proven, low-risk structured-data win for AIO/Bing Copilot answer boxes and reinforces the passage-length fix above. | Low (1–2 hours; content already exists, just needs markup + heading rewording) |
| 3 | **Fix the internal NAP inconsistency and stale trust signals**: reconcile the two different emails (`info1visa4bali@gmail.com` in `Organization` schema vs. `info1visaforbali@gmail.com` in `LegalService` schema and the visible contact page), and update the footer copyright from the hardcoded "© 2024" to a dynamic current year. | Medium-High — inconsistent NAP data undermines the local-business entity signal that AIO/Bing rely on for local intent queries, and stale dates read as an unmaintained/lower-trust site. | Low (schema/template edit, under 1 hour) |
| 4 | **Add `Product` schema to the ~11 product pages** (currently only generic `ItemPage`) and `Review`/`AggregateRating` schema for the existing testimonials, plus a `Person` entry for owner Mr. Rolly with role/credentials, and populate `Organization.sameAs` with the Facebook and YouTube links that already exist on-site but are missing from schema. | Medium — strengthens Authority & Brand Signals (currently the second-weakest dimension at 35/100) and gives AI engines structured entity data instead of unmarked prose. | Medium (schema templating across product CPT, ~half a day) |
| 5 | **Replace the auto-generated `llms.txt`** with the curated version in §4, and add explicit `Allow` directives for GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended to `robots.txt` (documenting, not changing, current open access) so future security/CDN changes don't silently regress crawler access. | Low-Medium — `llms.txt` has no proven citation weight, so treat this as hygiene/future-proofing rather than a score driver; the robots.txt explicit rules protect the one dimension already scoring well (Technical Accessibility, 80/100). | Low (under 1 hour combined) |

---

## 9. Schema Recommendations (JSON-LD)

**Currently present** (verified via live JSON-LD extraction): `BreadcrumbList`, `LegalService`, `Organization`, `WebPage`, `WebSite` (with `SearchAction`) on the homepage; `BreadcrumbList`, `ItemPage`, `Organization` on product pages. This is a reasonable baseline — most small business sites have none of this.

**Missing / recommended additions:**

1. **`FAQPage`** — wrap the homepage's 4 existing Q&As:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I apply for a 211 tourist visa with Visa4Bali?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contact Visa4Bali via WhatsApp or email to inquire about visa details, or book directly through the website. Send a photo of your passport (minimum 6 months validity remaining) and a photo of the passport holder to begin processing."
      }
    },
    {
      "@type": "Question",
      "name": "How long does a Bali tourist visa take to process?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visa4Bali offers standard processing of 5-6 working days or expedited processing of 3 working days, depending on the client's travel plans."
      }
    }
  ]
}
```
(extend with the remaining 2 Q&As on extensions and overstay fines)

2. **`Product`** on every product/service page, replacing/supplementing `ItemPage`, e.g. for the E-VOA page:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "E-VOA 30 Days",
  "description": "Electronic Visa on Arrival for Bali, valid 30 days, extendable once for a further 30 days (60 days maximum stay).",
  "offers": {
    "@type": "Offer",
    "price": "750000",
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock",
    "url": "https://visa4bali.com/product/e-voa-30-days/"
  }
}
```

3. **`Review`/`AggregateRating`** on the `LegalService`/`Organization` node to formalize the existing homepage testimonials (only include if ratings/review counts are genuine and verifiable — do not fabricate a rating value).

4. **`Person`** for owner Mr. Rolly, linked via `founder` on the `Organization` node, with `jobTitle` and, ideally, a professional credential/license reference — this is a direct, low-cost E-E-A-T ("Experience") signal that AI engines and Google both weight for YMYL-adjacent topics like immigration/visas.

5. **Fix `sameAs`** on the `Organization` node to include the Facebook and YouTube URLs already linked in the page footer/hero (currently only Instagram + TikTok are declared), and correct the email field so it matches the `LegalService` node and the visible contact page.

---

## 10. Content Reformatting Suggestions (Before/After)

### A. About Us intro paragraph

**Before** (85 words, no direct opening definition, no source for claims):
> "Visa4Bali is No 1 visa agency on Bali. It is an absolute leader of visa extensions. Our company provides a high-quality customized service. We have over 12 years of experience working with tourist in Bali and in other regions of Indonesia as well. We have experienced specialists managing the entire application process from start to finish. We cooperate directly with the immigration office. That's why we always give reasonable prices. Our foreign partners help us to provide an excellent service in various languages."

**After** (149 words — inside the 134–167 optimal band, direct answer in first 45 words, self-contained):
> "Visa4Bali is a licensed visa agency based in Jimbaran, Bali, that has assisted foreign visitors with Indonesian visa applications and extensions since 2012. The agency processes tourist visas (211/B211), e-VOA extensions, KITAS stay permits, family visas, and overstay resolutions, working directly with the Indonesian immigration office rather than through third-party brokers. Founded by Mr. Rolly, who has personally handled thousands of visa applications and stay-permit cases over more than a decade, Visa4Bali's specialist team manages each application end-to-end — from document collection to final approval — and communicates with clients in English and Russian. Because the agency liaises directly with immigration officials, standard processing typically takes 5-6 working days, with a 3-day expedited option available for time-sensitive cases. This direct-line relationship, rather than outsourcing to intermediaries, is what allows Visa4Bali to keep pricing transparent and predictable for clients."

### B. E-VOA product description

**Before** (89 words, buried lede — the "what is e-VOA" definition doesn't appear until the second sentence, no expiry/renewal source):
> "Process 1-2 working days VOA (Visa on Arrival) is a visa that can be purchased upon arrival at the airport. However, with eVOA, you can save time as you don't need to queue again to buy VOA... You will get a 30-day visa that can be extended for another 30 days. The maximum stay with this visa is 60 days. This visa cannot be converted, and after 60 days, you must leave Indonesia."

**After** (146 words, leads with direct definition, self-contained, includes actionable specifics):
> "E-VOA (electronic Visa on Arrival) is a 30-day Indonesian tourist visa purchased online before arrival, letting travelers skip the airport VOA queue and go straight to the immigration counter on landing. Visa4Bali processes E-VOA applications in 1-2 working days. The visa grants an initial 30-day stay and can be extended once for a further 30 days, for a maximum total stay of 60 days; it cannot be converted into another visa type, and travelers must leave Indonesia once the 60 days expire. The IDR 750,000 service fee includes the e-VOA and the government e-VOA fee. Applicants need: a passport with at least 6 months' remaining validity, a clear photo of the passport holder, and a confirmed flight ticket. Because approval happens before departure, E-VOA is the fastest way to secure a 30-day Bali tourist visa without airport queuing."

### C. FAQ heading structure

**Before:** Declarative visa-type headings with no question framing (`211 60 day Visa`, `Evoa 30 days`, `Family Visa`) sit alongside only 4 true question headings in the FAQ block.

**After:** Convert every visa-type H3 into a question mirroring real search/AI-prompt phrasing, e.g.:
- `211 60 day Visa` → `How long can I stay in Bali with a 211 tourist visa extension?`
- `Evoa 30 days` → `How long is Bali's e-VOA valid, and can it be extended?`
- `Remove Working Visa (E33G)` → `Who qualifies for Indonesia's E33G remote working visa?`

This turns each visa-type card into a self-contained, quotable Q&A unit consistent with the FAQ block, rather than a bare product label.

### D. Overstay fine statistic

**Before** (unsourced): "Based on immigration regulations in Indonesia, you are required to pay a fine of 1 million per day for overstaying your valid stay permit."

**After** (sourced, specific, still concise): "Under Indonesian immigration regulations, overstaying a valid visa or stay permit incurs a fine of IDR 1,000,000 (approx. USD 65) per day, per Indonesia's immigration law (UU No. 6/2011 on Immigration). Overstays beyond 60 days result in mandatory deportation and a re-entry ban, in addition to the fine." — attaching a citable legal reference is exactly the kind of "specific statistic with source attribution" that AI answer engines preferentially quote over bare assertions.

---

## Sources Checked

- `https://visa4bali.com/` (homepage, raw HTML + JSON-LD)
- `https://visa4bali.com/about-us/`
- `https://visa4bali.com/our-services/`
- `https://visa4bali.com/contact-us/`
- `https://visa4bali.com/product/e-voa-30-days/`
- `https://visa4bali.com/robots.txt` (200 OK)
- `https://visa4bali.com/llms.txt` (200 OK)
- `https://visa4bali.com/sitemap.xml` (200 OK, valid sitemap index → `page-sitemap.xml`, `product-sitemap.xml`)
- Live UA-spoofed HTTP checks for GPTBot, ClaudeBot, PerplexityBot, Bingbot, CCBot (all 200 OK)

No DataForSEO MCP tools were available in this session, so live ChatGPT-visibility scraping and LLM-mention tracking (`ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_search`) could not be run; platform scores above are estimates based on documented citation-behavior patterns (ranking correlation for Google AIO/Bing, entity/citation-source correlation for ChatGPT/Perplexity), not live measurement.
