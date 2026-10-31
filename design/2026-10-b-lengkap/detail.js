/* Product descriptions for the Single Product template (product.html?visa=<slug>).
   In WordPress each entry is the WooCommerce product itself: `short` = Product Short Description, `facts` = the three
   product attributes shown under the title, and `who`, `need`, `incl`, `faq` = the description, written with H2 headings.
   `src` says where the text came from, so Ari can check it: "Woo #494" = the description of that live WooCommerce
   product, "Ari 31/10" = his price revision of 2026-10-31. A missing field renders as a "data belum ada" box. */
V4B.detail = {
  "e-voa": {
    src: "Woo #494 + Ari 31/10",
    title: "Electronic Visa on Arrival, 30 days",
    short: "A 30-day Indonesian tourist visa you get before you fly to Bali. You skip the airport VOA queue and go straight to the immigration counter when you land.",
    facts: [["Stay", "30 days", "from the day you arrive"], ["Processing", "2–3 working days", "weekends and holidays not counted"], ["Longest stay", "60 days", "with one 30-day extension"]],
    buyIncl: "Includes the government e-VOA charge.",
    need: [["Your passport", "Valid for at least 6 more months. A clear photo of the main page is enough."], ["A photo of you", "A clear photo of the passport holder."], ["Your onward flight ticket", "The ticket out of Indonesia."]],
    incl: [["The e-VOA application", "Prepared and submitted by our team in Balangan."], ["The government e-VOA charge", "Nothing more to pay at the airport for the visa itself."]],
    lastStep: ["Fly to Bali", "Your e-VOA arrives by email. Show it at the immigration counter when you land."],
    faq: [["Can I extend the e-VOA?", 'Yes, once, for another 30 days, so you can stay up to 60 days in total. We handle the <a href="product.html?visa=voa-extension">VOA extension</a> too.'],
      ["When should I apply?", "Before you fly. Processing takes 2 to 3 working days, and Saturdays, Sundays and public holidays are not counted."],
      ["I want to stay longer than 60 days", 'Then the <a href="product.html?visa=c1">C1 Tourist Visa</a> fits better: 60 days on arrival, extendable to 180 days.']]
  },
  "c1": {
    src: "Woo #346 (C1 rules) + Ari 31/10",
    title: "Tourist Visa, 60 days",
    short: "A 60-day Indonesian tourist visa you get before you fly to Bali. You can extend it twice, 60 days at a time, and stay up to 180 days in total.",
    facts: [["Stay", "60 days", "from the day you arrive"], ["Processing", "5–9 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "with two 60-day extensions"]],
    faq: [["Can I extend the C1?", 'Yes, twice, 60 days at a time, up to 180 days in total. We handle the <a href="product.html?visa=c1-extension">C1 extension</a> too.']]
  },
  "c2": {
    src: "Ari 31/10",
    title: "Business Visa, 60 days",
    short: "A 60-day Indonesian business visa, extendable up to 180 days in total.",
    facts: [["Stay", "60 days", "from the day you arrive"], ["Processing", "7–9 working days", "regular service only"], ["Longest stay", "180 days", "with extensions"]]
  },
  "voa-extension": {
    src: "Woo #342 + Ari 31/10",
    title: "VOA Extension, 30 days",
    short: "Adds 30 more days to your Visa on Arrival. A VOA can be extended once, and the extension is issued as an electronic stay permit.",
    facts: [["Extends by", "30 days", "one extension per VOA"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "60 days", "VOA plus one extension"]],
    need: [["Your electronic stay permit", "The VOA you entered Indonesia with, as an electronic stay permit."]],
    faq: [["When should I apply?", "Before your current stay permit expires. The extension can be finished after that date and you will not be fined."],
      ["Which days count as processing days?", "Saturdays, Sundays, public holidays and days when the immigration system is down are not counted."],
      ["How do I receive the extension?", "As an electronic stay permit. We send you the file; scanning its barcode opens your stay-permit details in the immigration system."],
      ["Can I cancel?", "If you cancel an extension, the full price is charged."]]
  },
  "c1-extension": {
    src: "Woo #346 + Ari 31/10",
    title: "Tourist Visa Extension, 60 days",
    short: "Adds 60 more days to your C1 tourist visa without leaving Indonesia. The C1 can be extended twice, up to 180 days in total.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "60 days plus two extensions"]],
    need: [["Your passport", "That is all we need. We prepare every application document and arrange a local sponsor."]],
    incl: [["The application documents", "Prepared by our team."], ["A local sponsor", "Arranged by us on your behalf."]],
    faq: [["Is there a sticker in my passport?", "No. Each extension is an electronic stay permit: a soft-copy file with a barcode registered in the immigration system."],
      ["When should I apply?", "Before your current permit expires. Weekends and Indonesian public holidays are not counted as processing days; the extension can still be completed shortly after the expiry date."]]
  },
  "d1-extension": {
    src: "Woo #355 (D1 rules) + Ari 31/10",
    title: "Multiple Entry Visa Extension, 60 days",
    short: "Adds 60 more days to your stay on a D1 multiple-entry tourist visa. Each arrival can be extended twice, up to 180 days.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "per arrival"]]
  },
  "d2-extension": {
    src: "Woo #355 (D2 rules) + Ari 31/10",
    title: "Multiple Entry Business Visa Extension, 60 days",
    short: "Adds 60 more days to your stay on a D2 multiple-entry business visa. Each arrival can be extended twice, up to 180 days.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "per arrival"]]
  },
  "bridging-visa": {
    src: "Ari 31/10",
    title: "Bridging Visa (Transitional Stay Permit)",
    facts: [["Extends by", "60 days", ""], ["Processing", "7–9 working days", "weekends and holidays not counted"]]
  },
  "d12-extension": {
    src: "Ari 31/10",
    title: "Pre-Investment Visa Extension, 180 days",
    short: "Adds 180 more days to your stay on a D12 pre-investment visa.",
    facts: [["Extends by", "180 days", ""], ["Processing", "10–12 working days", "weekends and holidays not counted"]]
  },
  "family-itas-extension": {
    src: "Ari 31/10",
    title: "Family ITAS Extension, 1 or 2 years",
    facts: [["Extends by", "1 or 2 years", "1 year Rp 10,000,000 · 2 years Rp 15,500,000"], ["Processing", "14–21 working days", "weekends and holidays not counted"]]
  },
  "retirement-kitas-extension": {
    src: "Ari 31/10",
    title: "Retirement KITAS Extension, 1 year",
    facts: [["Extends by", "1 year", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]]
  },
  "e33g-extension": {
    src: "Ari 31/10",
    title: "Remote Worker KITAS Extension, 1 year",
    facts: [["Extends by", "1 year", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]]
  },
  "working-kitas-extension": {
    src: "Ari 31/10",
    title: "Working KITAS Extension, 1 year",
    facts: [["Extends by", "1 year", ""], ["Processing", "2.5–3 months", ""]],
    buyIncl: "Plus USD 1,200."
  },
  "investor-kitas-extension": {
    src: "Ari 31/10",
    title: "Investor KITAS Extension, 2 years",
    facts: [["Extends by", "2 years", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]]
  },
  "family-kitas": {
    src: "Ari 31/10",
    title: "Family KITAS, 1 year",
    facts: [["Stay", "1 year", "applied from outside Indonesia"], ["Processing", "7–9 working days", "weekends and holidays not counted"]]
  },
  "d12": {
    src: "Woo #668 + Ari 31/10",
    title: "Multiple Entry Visa D12, 1 year",
    short: "A multiple-entry pre-investment visa. You get 180 days each time you arrive and can fly in and out of Indonesia while the visa is valid.",
    facts: [["Stay", "180 days", "each time you arrive"], ["Processing", "7–9 working days", "weekends and holidays not counted"], ["Valid for", "1 year", "multiple entry"]],
    buyIncl: "Includes the government e-visa fee.",
    who: "Foreigners preparing to start a business in Indonesia, including field surveys and feasibility studies. You can also use it for tourism and to visit friends or family.",
    need: [["Your passport", "Valid for at least 6 more months. Send a good-quality photo of it."], ["A photo of you", "A photo of the passport holder; a phone photo is fine."]],
    incl: [["The e-visa", "Prepared and submitted by our team in Balangan."], ["Sponsorship", "We act as your sponsor for the application."], ["The government e-visa fee", "Paid by us as part of the application."]],
    faq: [["Do I need to visit an embassy?", "No. Once the e-visa is ready you can use it directly."]]
  },
  "e33g": {
    src: "Woo #515 + Ari 31/10",
    title: "Remote Worker KITAS, 1 year",
    short: "A one-year stay permit for people who work for a company outside Indonesia. You can live in Bali, travel in and out, and bring your family.",
    facts: [["Stay", "1 year", "multiple entry"], ["Processing", "9–12 working days", "weekends and holidays not counted"], ["Income", "US$60,000 a year", "or more, from work abroad"]],
    buyIncl: "Includes the government e-visa fee.",
    who: "Foreigners who work for a company outside Indonesia and want to live in Bali for a year. The permit lets you stay and bring your family with you.",
    need: [["Your passport", "Valid for at least 6 more months."], ["A photo of you", "A clear photo of the passport holder."], ["Proof of income", "A statement from your company (salary form) or your bank account, showing an income of at least US$60,000 a year."]],
    incl: [["The e-visa", "Prepared and submitted by our team in Balangan."], ["Sponsorship", "We act as your sponsor for the application."], ["The government e-visa fee", "Paid by us as part of the application."]],
    faq: [["Can I bring my family?", "Yes, the E33G lets your family come with you. Ask us what each family member needs and what it costs."],
      ["Can I work for an Indonesian company with it?", "No. The E33G is for people whose employer or clients are outside Indonesia."],
      ["Why can't I pay online straight away?", "A KITAS depends on your documents. We check them with you first, so you never pay for a permit you cannot get."]]
  },
  "retirement-kitas": {
    src: "Ari 31/10",
    title: "Retirement KITAS, 1 year",
    facts: [["Stay", "1 year", "applied from outside Indonesia"], ["Processing", "12–14 working days", "weekends and holidays not counted"]]
  },
  "investor-kitas": {
    src: "Ari 31/10",
    title: "Investor KITAS, 2 years",
    facts: [["Stay", "2 years", "applied from outside Indonesia"], ["Processing", "12–14 working days", "weekends and holidays not counted"]]
  }
};

/* What each "data belum ada" box asks Ari for. */
V4B.todo = {
  short: "1–2 kalimat pembuka: visa ini untuk siapa dan apa gunanya.",
  need: "Dokumen yang harus dikirim klien.",
  incl: "Apa saja yang sudah termasuk di harga (sponsor, biaya pemerintah, dll).",
  faq: "2–3 pertanyaan yang sering ditanya klien untuk visa ini, beserta jawabannya.",
  who: "Untuk siapa visa ini (syarat utama, misal umur, pasangan WNI, investasi)."
};

// "VOA Extension", not "VOA VOA Extension"
V4B.label = function (v) { return v.name.indexOf(v.code) > -1 ? v.name : v.code + " " + v.name; };

V4B.bySlug = function (slug) {
  var hit = null;
  V4B.groups.forEach(function (g) { g.items.forEach(function (v) { if (v.slug === slug) hit = { v: v, g: g }; }); });
  return hit;
};

/* Single Product template. Each pd-block is one H2 section of the WooCommerce description. */
V4B.product = function (slug) {
  var hit = V4B.bySlug(slug) || V4B.bySlug("e-voa"), v = hit.v, g = hit.g, d = V4B.detail[v.slug] || {};
  var chat = v.route === "chat";
  function todo(key) { return '<div class="todo"><b>Data belum ada</b>' + V4B.todo[key] + "</div>"; }
  function ticks(rows, icon) {
    return '<ul class="ticks">' + rows.map(function (r) {
      return '<li><svg><use href="#i-' + icon + '"/></svg><p><b>' + r[0] + "</b><span>" + r[1] + "</span></p></li>";
    }).join("") + "</ul>";
  }
  function block(h, body) { return '<section class="pd-block"><h2>' + h + "</h2>" + body + "</section>"; }
  var steps = chat
    ? [["Chat with us", "Tell us about your plans, in English or Russian, on WhatsApp or Telegram."],
       ["We check your documents", "Send us what the visa needs. We confirm it fits before you pay."],
       ["Pay online", "Once we confirm the visa fits, you pay on our website."],
       ["Receive your visa", "We apply for you and keep you updated until your e-Visa or Stay Permit letter arrives."]]
    : [["Pay online", "Apply on this page. You can also message us first if you are unsure."],
       ["Send your documents", "Send your required documents via WhatsApp or email. We’ll prepare your application."],
       ["We apply for you", "We submit the application and keep you updated on WhatsApp."],
       d.lastStep || ["Receive your visa", "Your e-Visa or official Stay Permit letter will be sent directly to you. No passport stamping required."]];
  var visa = v.code + ", " + v.name;
  var btns = chat
    ? '<a class="btn btn-k" href="' + V4B.waHref + '" data-chat data-visa="' + visa + '"><svg><use href="#i-chat"/></svg>Ask us</a>' +
      '<p class="buy-why">We check your documents with you on WhatsApp or Telegram before you pay.</p>'
    : '<a class="btn btn-k" href="#" data-add="' + v.code + "|" + v.name + "|" + v.price + '">Apply online</a>' +
      '<a class="btn btn-o" href="' + V4B.waHref + '" data-chat data-visa="' + visa + '">Ask us first</a>';
  var price = '<p class="buy-label">' + (v.from ? "Price from" : "Price") + '</p><p class="buy-price num">' + V4B.rp(v.price) + "</p>" +
    (d.buyIncl ? '<p class="buy-incl">' + d.buyIncl + "</p>" : "");

  document.title = "Visa4Bali · " + V4B.label(v);
  document.querySelector("[data-crumbs]").innerHTML = '<li><a href="home.html">Home</a></li><li><a href="shop.html">Visas &amp; prices</a></li>' +
    '<li class="crumb-mid"><a href="shop.html#' + g.id + '">' + g.label + '</a></li><li aria-current="page">' + V4B.label(v) + "</li>";
  document.querySelector("[data-pd-main]").innerHTML =
    '<div class="pd-head"><span class="pd-code">' + v.code + "</span><h1>" + (d.title || v.name) + "</h1>" +
    (d.short ? '<p class="pd-short">' + d.short + "</p>" : todo("short")) +
    '<dl class="facts">' + (d.facts || [["Stay", v.stay, ""], ["Processing", v.time, ""]]).map(function (f) {
      return "<div><dt>" + f[0] + "</dt><dd>" + f[1] + (f[2] ? "<small>" + f[2] + "</small>" : "") + "</dd></div>";
    }).join("") + "</dl>" +
    '<div class="buy buy-inline">' + price + btns + "</div></div>" +
    (d.who ? block("Who it is for", "<p>" + d.who + "</p>") : chat ? block("Who it is for", todo("who")) : "") +
    block("What we need from you", d.need ? ticks(d.need, "doc") : todo("need")) +
    block("What the price includes", d.incl ? ticks(d.incl, "tick") : todo("incl")) +
    block("How it works", '<ol class="steps">' + steps.map(function (s) { return "<li><b>" + s[0] + "</b><span>" + s[1] + "</span></li>"; }).join("") + "</ol>") +
    block("Good to know", d.faq ? '<div class="faq">' + d.faq.map(function (f, i) {
      return "<details" + (i ? "" : " open") + "><summary>" + f[0] + "</summary><p>" + f[1] + "</p></details>";
    }).join("") + "</div>" : todo("faq"));
  document.querySelector("[data-pd-buy]").innerHTML = price + btns +
    '<ul><li><svg><use href="#i-shield"/></svg>Payments go to VISA4BALI only, never to a personal account.</li>' +
    '<li><svg><use href="#i-pin"/></svg>A real office in Balangan, open Monday to Friday, 08:00–17:00.</li>' +
    '<li><svg><use href="#i-tick"/></svg>' + (chat ? "One person handles your case from start to finish." : "Updates on WhatsApp from the person handling your case.") + "</li></ul>" +
    '<p class="buy-help' + (chat ? "" : " num") + '">' + (chat ? "English or Russian · WhatsApp or Telegram" : "Questions? " + V4B.wa) + "</p>";

  // related: up to three other visas from the same category
  var holder = document.createElement("div");
  V4B.table(holder, g.id);
  var rows = [].slice.call(holder.querySelectorAll(".pt-row")).filter(function (r) { return r.querySelector(".pt-name a").getAttribute("href") !== V4B.url(v); });
  document.getElementById("related").innerHTML = rows.slice(0, 3).map(function (r) { return r.outerHTML; }).join("");
};
