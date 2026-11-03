/* Product descriptions for the Single Product template (product.html?visa=<slug>).
   In WordPress each entry is the WooCommerce product itself: `short` = Product Short Description, `facts` = the three
   product attributes shown under the title, and `who`, `need`, `incl`, `faq` = the description, written with H2 headings.
   `src` says where the text came from, so Ari can check it: "Woo #494" = the description of that live WooCommerce
   product, "Ari 31/10" = his price revision of 2026-10-31, "Ari 2/11" = his answers to data-visa.html (PDF "C1 Dokumen").
   A missing field renders as a "data belum ada" box. */

/* Rows Ari repeats across many visas. "ask*" are his "ask us for more details" answers. */
V4B.row = {
  passport6: ["Your passport", "Valid for at least 6 more months, or 12 months if you travel on a document other than a national passport."],
  passport12: ["Your passport", "Valid for at least 12 more months."],
  passport24: ["Your passport", "Valid for at least 12 more months; more than 24 months is better."],
  photo: ["A recent photo of you", "A colour passport-style photo."],
  onshore: ["You must be in Indonesia", "The application is made while you are in the country."],
  askNeed: ["Anything else", "Some cases need more documents. We tell you which ones when you chat with us."],
  docs: ["The application documents", "Prepared by our team."],
  pnbp: ["The government fee (PNBP)", "Paid by us as part of the application."],
  sched: ["Flexible scheduling", "We book your biometrics and photo at the immigration office at a time that suits you."],
  vip: ["VIP accompaniment", "A member of our team is with you at the immigration office."],
  askIncl: ["Anything else", "Depends on your case. Ask us and we explain the full price."],
  askFaq: ["I have another question", 'Every case is a little different. <a href="' + V4B.waHref + '" data-chat>Chat with us</a> and the person handling your case will answer.'],
  calling: "Every nationality except the countries on Indonesia’s calling-visa list: we cannot help citizens of Afghanistan, Israel, North Korea, Liberia, Nigeria or Somalia yet."
};

(function (r) {
var incl4 = [r.docs, r.pnbp, r.sched, r.vip];
V4B.detail = {
  "e-voa": {
    src: "Woo #494 + Ari 31/10 + Ari 2/11",
    title: "Electronic Visa on Arrival, 30 days",
    short: "A 30-day Indonesian tourist visa you get before you fly to Bali. You skip the airport VOA queue and go straight to the immigration counter when you land.",
    facts: [["Stay", "30 days", "from the day you arrive"], ["Processing", "2–3 working days", "weekends and holidays not counted"], ["Longest stay", "60 days", "with one 30-day extension"]],
    buyIncl: "Includes the government e-VOA charge.",
    who: 'Citizens of the countries on the <a href="https://www.imigrasi.go.id/wna/daftar-negara-voa-bvk-calling-visa/daftar-negara-subjek-visa-on-arrival" target="_blank" rel="noopener">Visa on Arrival list of Indonesian Immigration</a>.',
    need: [["Your passport", "Valid for at least 6 more months. A clear photo of the main page is enough."], ["A photo of you", "A clear photo of the passport holder."], ["Your onward flight ticket", "The ticket out of Indonesia."]],
    incl: [["The e-VOA application", "Prepared and submitted by our team in Balangan."], ["The government e-VOA charge", "Nothing more to pay at the airport for the visa itself."]],
    lastStep: ["Fly to Bali", "Your e-VOA arrives by email. Show it at the immigration counter when you land."],
    faq: [["Can I extend the e-VOA?", 'Yes, once, for another 30 days, so you can stay up to 60 days in total. We handle the <a href="product.html?visa=voa-extension">VOA extension</a> too.'],
      ["When should I apply?", "Before you fly. Processing takes 2 to 3 working days, and Saturdays, Sundays and public holidays are not counted."],
      ["I want to stay longer than 60 days", 'Then the <a href="product.html?visa=c1">C1 Tourist Visa</a> fits better: 60 days on arrival, extendable to 180 days.']]
  },
  "c1": {
    src: "Woo #346 (C1 rules) + Ari 31/10 + Ari 2/11",
    title: "Tourist Visa, 60 days",
    short: "A 60-day Indonesian tourist visa you get before you fly to Bali. You can extend it twice, 60 days at a time, and stay up to 180 days in total.",
    facts: [["Stay", "60 days", "from the day you arrive"], ["Processing", "5–9 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "with two 60-day extensions"]],
    who: r.calling,
    need: [r.passport6, r.photo],
    incl: [r.docs, ["The e-visa", "Sent to you by email."], r.pnbp],
    faq: [["Can I extend the C1?", 'Yes, twice, 60 days at a time, up to 180 days in total. We handle the <a href="product.html?visa=c1-extension">C1 extension</a> too.']]
  },
  "c2": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Business Visa, 60 days",
    short: "A 60-day Indonesian business visa, extendable up to 180 days in total.",
    facts: [["Stay", "60 days", "from the day you arrive"], ["Processing", "7–9 working days", "regular service only"], ["Longest stay", "180 days", "with extensions"]],
    who: "Foreigners coming to Indonesia for business visits that are not operational work. " + r.calling,
    need: [r.passport6, r.photo],
    incl: [r.docs, r.pnbp],
    faq: [["Can I extend the C2?", "Yes, twice, up to 180 days in total. We can handle the extension for you too."],
      ["Can I work for an Indonesian company with a C2?", "No, not at all. The C2 is only for business visits, not for operational work."]]
  },
  "voa-extension": {
    src: "Woo #342 + Ari 31/10 + Ari 2/11",
    title: "VOA Extension, 30 days",
    short: "Adds 30 more days to your Visa on Arrival. A VOA can be extended once, and the extension is issued as an electronic stay permit.",
    facts: [["Extends by", "30 days", "one extension per VOA"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "60 days", "VOA plus one extension"]],
    who: "Anyone in Indonesia on an active VOA or e-VOA (index B1).",
    need: [["Your valid visa", "The VOA or e-VOA you entered Indonesia with."], ["Your e-stay permit", "The electronic stay permit that came with it."], r.photo],
    incl: incl4,
    faq: [["When should I apply?", "Before your current stay permit expires. The extension can be finished after that date and you will not be fined."],
      ["Which days count as processing days?", "Saturdays, Sundays, public holidays and days when the immigration system is down are not counted."],
      ["How do I receive the extension?", "As an electronic stay permit. We send you the file; scanning its barcode opens your stay-permit details in the immigration system."],
      ["Can I cancel?", "If you cancel an extension, the full price is charged."]]
  },
  "c1-extension": {
    src: "Woo #346 + Ari 31/10 + Ari 2/11",
    title: "Tourist Visa Extension, 60 days",
    short: "Adds 60 more days to your C1 tourist visa without leaving Indonesia. The C1 can be extended twice, up to 180 days in total.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "60 days plus two extensions"]],
    need: [["Your valid e-visa", "Your current C1 e-visa."], ["Your e-stay permit", "The electronic stay permit that came with it."], r.photo],
    incl: incl4,
    faq: [["Is there a sticker in my passport?", "No. Each extension is an electronic stay permit: a soft-copy file with a barcode registered in the immigration system."],
      ["When should I apply?", "Before your current permit expires. Weekends and Indonesian public holidays are not counted as processing days; the extension can still be completed shortly after the expiry date."]]
  },
  "d1-extension": {
    src: "Woo #355 (D1 rules) + Ari 31/10 + Ari 2/11",
    title: "Multiple Entry Visa Extension, 60 days",
    short: "Adds 60 more days to your stay on a D1 multiple-entry tourist visa. Each arrival can be extended twice, up to 180 days.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "per arrival"]],
    who: "Holders of an active D1 visa that has not expired yet.",
    need: [r.passport6, r.photo],
    incl: incl4,
    faq: [["Do I have to leave Indonesia for this extension?", "No, not at all. The D1 extension is done entirely inside Indonesia."],
      ["When is the best time to apply?", "We strongly recommend applying 7 to 14 days before your first 60 days end, at the latest."]]
  },
  "d2-extension": {
    src: "Woo #355 (D2 rules) + Ari 31/10 + Ari 2/11",
    title: "Multiple Entry Business Visa Extension, 60 days",
    short: "Adds 60 more days to your stay on a D2 multiple-entry business visa. Each arrival can be extended twice, up to 180 days.",
    facts: [["Extends by", "60 days", "up to two extensions"], ["Processing", "8–10 working days", "weekends and holidays not counted"], ["Longest stay", "180 days", "per arrival"]],
    who: "Holders of an active D2 stay permit.",
    need: [r.passport6, r.photo, ["A letter about your visit", "A statement, invitation or correspondence from a government office or private company in Indonesia that explains its relationship with you."]],
    incl: incl4,
    faq: [["How long can I stay each time?", "Up to 60 days per arrival, counted from the day you arrive."],
      ["How many times can I extend?", "More than once, up to 180 days in total."]]
  },
  "bridging-visa": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Bridging Visa (Transitional Stay Permit)",
    short: "A transitional stay permit for foreigners already in Indonesia who want to change their visa type, for example from a VOA to a KITAS.",
    facts: [["Extends by", "60 days", ""], ["Processing", "7–9 working days", "weekends and holidays not counted"]],
    who: "Only foreigners who are already inside Indonesia.",
    need: [r.passport6, r.photo, ["Your current e-stay permit", "Still active, with at least 7 days left before it expires."]],
    incl: [r.docs, r.pnbp],
    faq: [["What happens if I leave Indonesia?", "The bridging visa ends. It is only valid while you stay in the country."],
      ["Can I extend a bridging visa?", "No. It cannot be extended."]]
  },
  "d12-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Pre-Investment Visa Extension, 180 days",
    short: "Adds 180 more days to your stay on a D12 pre-investment visa.",
    facts: [["Extends by", "180 days", ""], ["Processing", "10–12 working days", "weekends and holidays not counted"]],
    who: "D12 holders who still need time for field surveys or feasibility studies for the business they plan to invest in. You can also use the visa for tourism and to visit friends or family.",
    need: [r.passport6, r.photo, ["Your current e-stay permit or visa", "The D12 you are staying on now."]],
    incl: incl4,
    faq: [["How many times can I extend?", "Once, up to a total stay of 12 months (1 year) or 2 years, depending on the visa duration you chose."]]
  },
  "family-itas-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Family ITAS Extension, 1 or 2 years",
    short: "Extends the stay permit that lets family members live in Indonesia with their spouse or parent, so the family can stay together.",
    facts: [["Extends by", "1 or 2 years", "1 year Rp 10,000,000<br>2 years Rp 15,500,000"], ["Processing", "14–21 working days", "weekends and holidays not counted"]],
    who: "Foreign spouses and children of a KITAS or KITAP holder (an investor, for example) or of an Indonesian citizen. The permit follows the sponsor’s own permit, or you choose a stay of 1 or 2 years.",
    need: [r.passport24, r.photo, ["Your current e-stay permit or visa", "The family permit you are staying on now."], ["A letter from your Indonesian spouse", "If your spouse is Indonesian: their request letter for your visa."], r.onshore, r.askNeed],
    incl: incl4,
    faq: [r.askFaq]
  },
  "retirement-kitas-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Retirement KITAS Extension, 1 year",
    short: "Extends the 1-year retirement KITAS (E33F) for retirees who do not work or earn money in Indonesia.",
    facts: [["Extends by", "1 year", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]],
    who: "Holders of a retirement KITAS, usually aged 55 or over.",
    need: [r.passport24, r.photo, ["Your current e-stay permit or ITAS", "The retirement KITAS you are staying on now."], r.onshore, r.askNeed],
    incl: incl4,
    faq: [["How many times can I extend?", "Up to four times, one year at a time."]]
  },
  "e33g-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Remote Worker KITAS Extension, 1 year",
    short: "Is your E33G about to expire? Extend your remote-worker stay permit for another year, without leaving Indonesia.",
    facts: [["Extends by", "1 year", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]],
    who: "Holders of an active, valid E33G remote-worker ITAS. Apply at least 30 days before it expires.",
    need: [r.passport12, r.photo, ["Your active e-stay permit or ITAS", "The E33G you are staying on now."], r.onshore,
      ["Proof of income", "At least US$60,000 a year, or US$5,000 a month."], ["Your employment contract", "With a company outside Indonesia."]],
    incl: incl4,
    faq: [["When is the best time to apply?", "30 days before your KITAS expires is the safest time."],
      ["Is the government fee (PNBP) included?", "Yes. Our price is all-in."]]
  },
  "working-kitas-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Working KITAS Extension, 1 year",
    short: "Working in Indonesia is great; the paperwork is not. Our team takes over your whole Working KITAS extension, done fully by the rules.",
    facts: [["Extends by", "1 year", ""], ["Processing", "2.5–3 months", ""]],
    buyIncl: "Plus USD 1,200.",
    who: "Foreigners who already hold an active Working KITAS and want to extend it without leaving Indonesia.",
    need: [r.passport12, r.photo, r.askNeed],
    incl: [r.docs, r.pnbp, r.askIncl],
    faq: [r.askFaq]
  },
  "investor-kitas-extension": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Investor KITAS Extension, 2 years",
    short: "Extend your Investor KITAS by the rules, on time and without the hassle, with our specialist team.",
    facts: [["Extends by", "2 years", ""], ["Processing", "14–21 working days", "weekends and holidays not counted"]],
    who: "Foreigners who already hold an Investor KITAS and want to extend it without leaving Indonesia.",
    need: [r.passport12, r.photo, r.askNeed],
    incl: [r.docs, r.pnbp, r.askIncl],
    faq: [r.askFaq]
  },
  "family-kitas": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Family KITAS, 1 year",
    short: "Bring your family together in Indonesia. We apply for the 1-year Family KITAS from abroad, so it is ready before they arrive.",
    facts: [["Stay", "1 year", "applied from outside Indonesia"], ["Processing", "7–9 working days", "weekends and holidays not counted"]],
    who: "The legal spouse, or a child under 18, of a KITAS or KITAP holder. The foreign spouse of an Indonesian citizen, and children of a mixed Indonesian–foreign marriage.",
    need: [r.passport12, r.photo, ["Your marriage certificate", "For a spouse."], ["A birth certificate", "For a child."], r.askNeed],
    incl: incl4,
    faq: [["How long is the Family KITAS valid?", 'A full year (12 months) from the day your family arrives in Indonesia. It can be <a href="product.html?visa=family-itas-extension">extended</a> every year without leaving Indonesia.'],
      ["Can a Family KITAS holder work in Indonesia?", "No. Working or earning money in Indonesia is not allowed."]]
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
  "d12-2y": {
    src: "Woo #668 + Ari 3/11",
    title: "Multiple Entry Visa D12, 2 years",
    short: "A two-year multiple-entry pre-investment visa. You get 180 days each time you arrive and can fly in and out of Indonesia while the visa is valid.",
    facts: [["Stay", "180 days", "each time you arrive"], ["Processing", "7–9 working days", "weekends and holidays not counted"], ["Valid for", "2 years", "multiple entry"]],
    buyIncl: "Includes the government e-visa fee.",
    who: "Foreigners preparing to start a business in Indonesia, including field surveys and feasibility studies. You can also use it for tourism and to visit friends or family.",
    need: [["Your passport", "Valid for at least 6 more months. Send a good-quality photo of it."], ["A photo of you", "A photo of the passport holder; a phone photo is fine."]],
    incl: [["The e-visa", "Prepared and submitted by our team in Balangan."], ["Sponsorship", "We act as your sponsor for the application."], ["The government e-visa fee", "Paid by us as part of the application."]],
    faq: [["Do I need to visit an embassy?", "No. Once the e-visa is ready you can use it directly."],
      ["Is there a 1-year D12?", 'Yes, the <a href="product.html?visa=d12">1-year D12</a> costs Rp 7,000,000.']]
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
    src: "Ari 31/10 + Ari 2/11",
    title: "Retirement KITAS, 1 year",
    short: "Your retirement starts in Indonesia. We apply for the 1-year retirement KITAS from abroad, so it is ready before you arrive.",
    facts: [["Stay", "1 year", "applied from outside Indonesia"], ["Processing", "12–14 working days", "weekends and holidays not counted"]],
    who: "Foreigners aged 55 or over with a steady pension or passive income, who do not plan to work in Indonesia.",
    need: [r.passport12, r.photo, ["Proof of pension or passive income", "A pension fund or regular income from outside Indonesia."], ["Your rental agreement", "For the place you will live in Indonesia."], r.askNeed],
    incl: incl4,
    faq: [["Can I work or open a business with a retirement KITAS?", "No, not at all."],
      ["What does “offshore” mean? Do I have to come to Indonesia first?", "No. Offshore means we process all your documents while you are still abroad."],
      ["Can I extend it without leaving Indonesia?", 'Yes. Before your year ends, we can process the <a href="product.html?visa=retirement-kitas-extension">extension</a> inside Indonesia.']]
  },
  "investor-kitas": {
    src: "Ari 31/10 + Ari 2/11",
    title: "Investor KITAS, 2 years",
    short: "Your time is too valuable for immigration paperwork. Hand your whole 2-year Investor KITAS application, made from abroad, to our specialist team.",
    facts: [["Stay", "2 years", "applied from outside Indonesia"], ["Processing", "12–14 working days", "weekends and holidays not counted"]],
    who: "Business founders and investors with a foreign-owned company (PT PMA) in Indonesia, whose shares meet the current minimum. Ask us about your case.",
    need: [r.passport12, r.photo, ["Your sponsor company’s legal documents", "From your PT PMA in Indonesia."], r.askNeed],
    incl: [r.docs, r.pnbp, r.askIncl],
    faq: [["How much capital do I need?", "Under the latest immigration and BKPM rules, your name must be in the PT PMA’s deed with personal shares worth at least Rp 10,000,000,000 (10 billion rupiah), and the company’s issued capital must also be at least Rp 10 billion."],
      ["Can I extend it after 2 years without leaving Indonesia?", 'Yes. Before your 2 years end, we can process the <a href="product.html?visa=investor-kitas-extension">extension</a> inside Indonesia.']]
  }
};
})(V4B.row);

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
