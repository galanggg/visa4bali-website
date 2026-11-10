// Builds the WooCommerce product payload for design B from the approved mockup data
// (design/2026-10-b-lengkap/site.js + detail.js), so WordPress gets exactly the text Ari approved.
// Usage: node migration/build-products.mjs > migration/products-payload.json
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), "../design/2026-10-b-lengkap");
// site.js wires up DOM behaviour at load; a do-nothing stub lets it run without a browser.
const stub = () => new Proxy(function () {}, { get: (_, k) => (k === Symbol.toPrimitive ? () => "" : stub()), apply: () => stub() });
const ctx = { document: stub(), localStorage: stub(), location: { search: "", hash: "", pathname: "" }, addEventListener() {} };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, "site.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(dir, "detail.js"), "utf8"), ctx);
const V4B = ctx.V4B;

// Live products kept and updated in place (slug unchanged). Everything else is a new product.
const inPlace = {
  "e-voa": { id: 494, slug: "e-voa-30-days" },
  "c1": { id: 351, slug: "visa4bali-offshore-ru" },
  "voa-extension": { id: 342, slug: "visa-on-arrival-extension-ru" },
  "c1-extension": { id: 346, slug: "social-visa-b-211-ru" },
  "d1-extension": { id: 1572, slug: "d1-d2-visa-extension" },
  "d12-extension": { id: 1575, slug: "d12-visa-extension-service" },
};
// New products and their WordPress slugs.
const newSlug = {
  "c2": "c2-business-visa",
  "d1": "d1-multiple-entry-tourist-visa",
  "d2": "d2-multiple-entry-business-visa",
  "d2-extension": "d2-business-visa-extension",
  "bridging-visa": "bridging-visa",
  "family-itas-extension": "family-itas-extension",
  "retirement-kitas-extension": "retirement-kitas-extension",
  "e33g-extension": "e33g-remote-worker-kitas-extension",
  "working-kitas-extension": "working-kitas-extension",
  "investor-kitas-extension": "investor-kitas-extension",
  "family-kitas": "family-kitas-offshore",
  "d12": "d12-multiple-entry-visa-1-year",
  "d12-2y": "d12-multiple-entry-visa-2-years",
  "e33g": "e33g-remote-worker-kitas",
  "retirement-kitas": "retirement-kitas-offshore",
  "investor-kitas": "investor-kitas-offshore",
};
// Live products that go to Draft at go-live (kept whole), with the 301 target for their old URL.
const retire = [
  { id: 355, from: "/product/offshore-business-visa-d212-ru/", to: "d1" },
  { id: 627, from: "/product/family-visa/", to: "family-kitas" },
  { id: 668, from: "/product/c12-d12-visa/", to: "d12" },
  { id: 515, from: "/product/remote-working-visa-e33g/", to: "e33g" },
  { id: 352, from: "/product/visa4bali-onshore-ru/", toUrl: "/our-services/" },
];

const wpSlug = (s) => inPlace[s]?.slug || newSlug[s];
const productUrl = (s) => `/product/${wpSlug(s)}/`;
const waEnglish = (visa) => `https://wa.me/6287862273133?text=${encodeURIComponent("Hello Visa4Bali, I'd like to ask about " + visa)}`;

function rewriteLinks(html) {
  return html
    .replace(/href="product\.html\?visa=([\w-]+)"/g, (_, s) => {
      if (!wpSlug(s)) throw new Error("no slug for link " + s);
      return `href="${productUrl(s)}"`;
    })
    .replace(/ data-chat/g, ' class="v4b-chat"');
}

function description(v, d) {
  const chat = v.route === "chat";
  const ticks = (rows) => '<ul class="ticks">' + rows.map((r) => `<li><b>${r[0]}</b> <span>${r[1]}</span></li>`).join("") + "</ul>";
  const block = (h, body) => `<h2>${h}</h2>\n${body}\n`;
  const steps = chat
    ? [["Chat with us", "Tell us about your plans, in English or Russian, on WhatsApp."],
       ["We check your documents", "Send us what the visa needs. We confirm it fits before you pay."],
       ["Pay online", "Once we confirm the visa fits, you pay on our website."],
       ["Receive your visa", "We apply for you and keep you updated until your e-Visa or Stay Permit letter arrives."]]
    : [["Pay online", "Apply on this page. You can also message us first if you are unsure."],
       ["Send your documents", "Send your required documents via WhatsApp or email. We’ll prepare your application."],
       ["We apply for you", "We submit the application and keep you updated on WhatsApp."],
       d.lastStep || ["Receive your visa", "Your e-Visa or official Stay Permit letter will be sent directly to you. No passport stamping required."]];
  const missing = ["need", "incl", "faq"].filter((k) => !d[k]);
  if (missing.length || (chat && !d.who)) throw new Error(`${v.slug}: missing ${missing.join(",")}${chat && !d.who ? " who" : ""}`);
  let html = "";
  if (d.who) html += block("Who it is for", `<p>${d.who}</p>`);
  html += block("What we need from you", ticks(d.need));
  html += block("What the price includes", ticks(d.incl));
  html += block("How it works", '<ol class="steps">' + steps.map((s) => `<li><b>${s[0]}</b> <span>${s[1]}</span></li>`).join("") + "</ol>");
  html += block("Good to know", '<div class="faq">' + d.faq.map((f, i) => `<details${i ? "" : " open"}><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("") + "</div>");
  return rewriteLinks(html);
}

const out = { built_at: new Date().toISOString(), source: "design/2026-10-b-lengkap site.js + detail.js", categories: [], products: [], retire: [] };
const groups = V4B.groups.filter((g) => !g.finderOnly);
for (const g of groups) out.categories.push({ slug: g.id, name: g.label, description: g.blurb });

for (const g of groups) {
  g.items.forEach((v, i) => {
    const d = V4B.detail[v.slug];
    if (!d) throw new Error("no detail for " + v.slug);
    const facts = d.facts || [["Stay", v.stay, ""], ["Processing", v.time, ""]];
    // Product name as it appears in the basket, orders and emails: code + name, except where that reads badly.
    const label = v.slug === "e-voa" ? "e-VOA, Electronic Visa on Arrival" : v.code === "KITAS" ? v.name : V4B.label(v);
    const meta = {
      v4b_code: v.code, v4b_short_name: v.name, v4b_title: d.title || v.name, v4b_group: g.id,
      v4b_stay: v.stay, v4b_time: v.time, v4b_route: v.route,
      v4b_from: v.from ? "1" : "", v4b_extra: v.extra || "", v4b_buy_incl: d.buyIncl || "",
      v4b_fast_time: v.fast?.time || "", v4b_fast_price: v.fast ? String(v.fast.price) : "",
      v4b_src: d.src || "",
    };
    facts.slice(0, 3).forEach((f, n) => {
      const note = f[0] === "Processing" && v.fast ? "or " + v.fast.time + " with Faster" : f[2] || "";
      Object.assign(meta, { [`v4b_fact${n + 1}_label`]: f[0], [`v4b_fact${n + 1}_value`]: f[1], [`v4b_fact${n + 1}_note`]: note });
    });
    const p = {
      key: v.slug, action: inPlace[v.slug] ? "update" : "create", id: inPlace[v.slug]?.id || null, slug: wpSlug(v.slug),
      name: label, featured: !!v.feat, menu_order: i, category: g.id,
      short_description: `<p>${rewriteLinks(d.short)}</p>`, description: description(v, d),
      meta_data: Object.entries(meta).map(([key, value]) => ({ key, value })),
    };
    if (v.route === "chat") Object.assign(p, { type: "external", regular_price: String(v.price), external_url: waEnglish(label), button_text: "Ask us" });
    else if (v.fast) Object.assign(p, { type: "variable", processing: [["Regular", v.price, v.time], ["Faster", v.fast.price, v.fast.time]] });
    else Object.assign(p, { type: p.action === "update" ? "keep" : "simple", regular_price: String(v.price) });
    out.products.push(p);
  });
}
for (const r of retire) out.retire.push({ id: r.id, from: r.from, to: r.toUrl || productUrl(r.to) });
console.log(JSON.stringify(out, null, 2));
