/* Visa4Bali visa data and the small behaviours the mockup needs.
   In WordPress every item below is a WooCommerce product: `group` is its product category, `code`, `stay` and `time`
   are product attributes (or ACF fields), and `route` decides the button. "buy" = simple product, paid online;
   "chat" = external product whose button URL is the WhatsApp link. `woo` is the live product ID it maps to (null = no
   product yet). Prices and processing times follow Ari's revision of 2026-10-31; where WooCommerce disagrees,
   PANDUAN-SLICING.md lists it. `feat` = shown in the home finder and the "Visas for every kind of stay" band (in Woo:
   a Featured product). `from` = the price is a starting price (variable product). `extra` = a second line under the
   price. Groups are sorted by stay, shortest first. */
window.V4B = {
  wa: "+62 878 6227 3133",
  waHref: "https://wa.me/6287862273133",
  groups: [
    {
      id: "arriving-soon",
      label: "Arriving soon",
      ask: "I haven't flown in yet",
      blurb: "Short stays for holidays, meetings and visiting.",
      items: [
        { code: "e-VOA", slug: "e-voa", name: "Electronic Visa on Arrival", stay: "30 days, extendable to 60 in total", time: "2–3 working days", price: 750000, route: "buy", woo: 494, feat: 1 },
        { code: "C1", slug: "c1", name: "Tourist Visa", stay: "60 days, extendable to 180 in total", time: "5–9 working days", price: 2000000, from: 1, route: "buy", woo: 351, feat: 1 },
        { code: "C2", slug: "c2", name: "Business Visa", stay: "60 days, extendable to 180 in total", time: "7–9 working days", price: 3500000, route: "chat", woo: null, feat: 1 }
      ]
    },
    {
      id: "already-in-bali",
      label: "Already in Bali",
      ask: "I'm here and need more time",
      blurb: "No passport collection needed. Your Stay Permit letter will be provided digitally.",
      items: [
        { code: "VOA", slug: "voa-extension", name: "VOA Extension", stay: "+30 days", time: "8–10 working days", price: 800000, route: "buy", woo: 342, feat: 1 },
        { code: "C1", slug: "c1-extension", name: "Tourist Visa Extension", stay: "+60 days", time: "8–10 working days", price: 1800000, route: "buy", woo: 346, feat: 1 },
        { code: "D1", slug: "d1-extension", name: "Multiple Entry Visa Extension", stay: "+60 days", time: "8–10 working days", price: 1800000, route: "buy", woo: 1572 },
        { code: "D2", slug: "d2-extension", name: "Multiple Entry Business Visa Extension", stay: "+60 days", time: "8–10 working days", price: 1800000, route: "buy", woo: null },
        { code: "Bridging", slug: "bridging-visa", name: "Bridging Visa (Transitional Stay Permit)", stay: "+60 days", time: "7–9 working days", price: 3000000, route: "chat", woo: null },
        { code: "D12", slug: "d12-extension", name: "Pre-Investment Visa Extension", stay: "+180 days", time: "10–12 working days", price: 3250000, route: "buy", woo: 1575, feat: 1 },
        // one Woo variable product, attribute Duration: +1 year 10,000,000 / +2 years 15,500,000
        { code: "KITAS", slug: "family-itas-extension", name: "Family ITAS Extension", stay: "+1 or 2 years", time: "14–21 working days", price: 10000000, from: 1, route: "chat", woo: null },
        { code: "KITAS", slug: "retirement-kitas-extension", name: "Retirement KITAS Extension", stay: "+1 year", time: "14–21 working days", price: 10000000, route: "chat", woo: null },
        { code: "E33G", slug: "e33g-extension", name: "Remote Worker KITAS Extension", stay: "+1 year", time: "14–21 working days", price: 12000000, route: "chat", woo: null },
        { code: "KITAS", slug: "working-kitas-extension", name: "Working KITAS Extension", stay: "+1 year", time: "2.5–3 months", price: 14300000, extra: "+ USD 1,200", route: "chat", woo: null },
        { code: "KITAS", slug: "investor-kitas-extension", name: "Investor KITAS Extension", stay: "+2 years", time: "14–21 working days", price: 16000000, route: "chat", woo: null }
      ]
    },
    {
      id: "staying-longer",
      label: "Staying longer",
      ask: "I want to live or work here",
      blurb: "Multiple-entry visas and stay permits, one case manager.",
      items: [
        { code: "KITAS", slug: "family-kitas", name: "Family KITAS, 1 year offshore", stay: "1 year", time: "7–9 working days", price: 11500000, route: "chat", woo: 627, feat: 1 },
        { code: "D12", slug: "d12", name: "Multiple Entry Visa, 1 year", stay: "180 days per arrival", time: "7–9 working days", price: 7000000, route: "chat", woo: 668, feat: 1 },
        { code: "E33G", slug: "e33g", name: "Remote Worker KITAS, offshore", stay: "1 year", time: "9–12 working days", price: 12500000, route: "chat", woo: 515, feat: 1 },
        { code: "KITAS", slug: "retirement-kitas", name: "Retirement KITAS, offshore", stay: "1 year", time: "12–14 working days", price: 13000000, route: "chat", woo: null },
        { code: "KITAS", slug: "investor-kitas", name: "Investor KITAS, 2 years offshore", stay: "2 years", time: "12–14 working days", price: 16000000, route: "chat", woo: null }
      ]
    },
    /* Visas for Indonesian citizens going abroad. Home finder only: no price, each pair goes straight to the WhatsApp of
       the staff member who handles it. The three numbers are placeholders until Ari sends them. */
    {
      id: "travelling-abroad",
      label: "Travelling abroad",
      ask: "For Indonesian passport holders",
      finderOnly: true,
      items: [
        { code: "JP/CN", name: "Japan or China visa", stay: "Indonesian passport", time: "Ari answers on WhatsApp", price: null, route: "chat", wa: "TODO_whatsapp_ari", tanya: "visa Jepang atau China", feat: 1 },
        { code: "EU/US", name: "Schengen or USA visa", stay: "Indonesian passport", time: "Feny answers on WhatsApp", price: null, route: "chat", wa: "TODO_whatsapp_feny", tanya: "visa Schengen atau Amerika", feat: 1 },
        { code: "AU/KR", name: "Australia or Korea visa", stay: "Indonesian passport", time: "Nanda answers on WhatsApp", price: null, route: "chat", wa: "TODO_whatsapp_nanda", tanya: "visa Australia atau Korea", feat: 1 }
      ]
    }
  ],
  rp: function (n) { return "Rp " + n.toLocaleString("en-US"); },
  from: function (g) { return Math.min.apply(null, g.items.map(function (i) { return i.price; })); },
  feat: function (g) { var f = g.items.filter(function (v) { return v.feat; }); return f.length ? f : g.items.slice(0, 3); },
  // price cell: optional "From" line above, optional extra line below (e.g. a fee paid in dollars)
  price: function (v) {
    if (v.price == null) return "";
    return (v.from ? "<small>From</small>" : "") + V4B.rp(v.price) + (v.extra ? "<small>" + v.extra + "</small>" : "");
  },
  // one Single Product template for every visa; detail.js holds each product's description
  url: function (v) { return "product.html?visa=" + v.slug; },
  act: function (v, cls) {
    if (v.wa) return '<a class="' + cls + '-act ' + cls + '-chat" href="https://wa.me/' + v.wa + "?text=" +
      encodeURIComponent("Halo Visa4Bali, saya mau tanya " + v.tanya) + '">Ask us</a>';
    return v.route === "buy"
      ? '<a class="' + cls + '-act ' + cls + '-buy" href="' + V4B.url(v) + '" data-add="' + v.code + "|" + v.name + "|" + v.price + '">Apply online</a>'
      : '<a class="' + cls + '-act ' + cls + '-chat" href="' + V4B.waHref + '" data-chat data-visa="' + v.code + ", " + v.name + '">Ask us</a>';
  },
  /* Who answers the chat. The Russian-speaking number and both Telegram usernames are placeholders until Ari sends
     the real ones; PANDUAN-SLICING.md lists them as open items. */
  chat: [
    { lang: "English speaking", note: "We reply in English", hello: "Hello Visa4Bali, I'd like to ask about ",
      wa: "6287862273133", tg: "TODO_telegram_english" },
    { lang: "Russian speaking", note: "Отвечаем на русском", hello: "Здравствуйте! Хочу узнать про ", ru: true,
      wa: "TODO_whatsapp_russian", tg: "TODO_telegram_russian" }
  ]
};

/* Visa finder (home): three choices, then the matching visas with price and the right next step. */
V4B.finder = function (root, opts) {
  opts = opts || {};
  var name = "pick-" + Math.random().toString(36).slice(2, 7);
  var tabs = V4B.groups.map(function (g, i) {
    return '<label class="pk-opt"><input type="radio" name="' + name + '" value="' + g.id + '"' + (i === 0 ? " checked" : "") +
      '><span class="pk-opt-label">' + g.label + '</span><span class="pk-opt-ask">' + g.ask + "</span></label>";
  }).join("");
  root.innerHTML =
    '<div class="pk-tabs"><p class="pk-legend" id="' + name + '-l">' + (opts.legend || "Where are you now?") + '</p><div class="pk-opts" role="radiogroup" aria-labelledby="' + name + '-l">' + tabs + "</div></div>" +
    '<ul class="pk-list" aria-live="polite"></ul>' +
    '<p class="pk-foot">Not sure which one? <a href="' + V4B.waHref + '" data-chat>Ask us</a> or <a href="shop.html">see all visas</a>.</p>';
  var list = root.querySelector(".pk-list");
  function show(id) {
    var g = V4B.groups.filter(function (x) { return x.id === id; })[0];
    list.innerHTML = V4B.feat(g).map(function (v) {
      return '<li class="pk-row"><span class="pk-code">' + v.code + '</span><span class="pk-main"><b class="pk-name">' + (v.wa ? v.name : '<a href="' + V4B.url(v) + '">' + v.name + "</a>") +
        '</b><span class="pk-meta">' + v.stay + " · " + v.time + '</span></span><span class="pk-price num">' + V4B.price(v) + "</span>" + V4B.act(v, "pk") + "</li>";
    }).join("");
    list.classList.remove("pk-in"); void list.offsetWidth; list.classList.add("pk-in");
  }
  root.addEventListener("change", function (e) { if (e.target.name === name) show(e.target.value); });
  show(V4B.groups[0].id);
};

/* Three stay groups with a "from" price (home, shop hero). */
V4B.stays = function (root, link) {
  root.innerHTML = V4B.groups.filter(function (g) { return !g.finderOnly; }).map(function (g) {
    var rows = V4B.feat(g).map(function (v) {
      var n = v.name.replace(/, .*$/, "");
      return "<li>" + (n.indexOf(v.code) === -1 ? v.code + " " : "") + n + "<span>" + v.stay + "</span></li>";
    }).join("");
    return '<div class="stay"><h3>' + g.label + '</h3><p class="from num">From ' + V4B.rp(V4B.from(g)) + "</p><p>" + g.blurb + "</p>" +
      (link === "list" ? "" : "<ul>" + rows + "</ul>") + '<a href="shop.html#' + g.id + '">' + (link === "list" ? "See the list" : "See prices") + " →</a></div>";
  }).join("");
};

/* Shop: one group per product category, one row per product. */
V4B.table = function (root, only) {
  root.innerHTML = V4B.groups.filter(function (g) { return !g.finderOnly && (!only || g.id === only); }).map(function (g) {
    return '<section class="pt-group" id="' + g.id + '"><header class="pt-head"><h2 class="pt-title">' + g.label +
      '</h2><p class="pt-blurb">' + g.blurb + '</p></header><div class="pt-rows">' +
      g.items.map(function (v) {
        return '<div class="pt-row"><span class="pt-code' + (v.code.length > 5 ? " long" : "") + '">' + v.code + '</span><span class="pt-name"><a href="' + V4B.url(v) + '">' + v.name +
          '</a></span><span class="pt-stay"><i>Stay</i>' + v.stay + '</span><span class="pt-time"><i>Processing</i>' + v.time +
          '</span><span class="pt-price num">' + V4B.price(v) + "</span>" + V4B.act(v, "pt") + "</div>";
      }).join("") + "</div></section>";
  }).join("");
};

/* Chat chooser: language × app. In Elementor this is a Popup template opened by every "Chat with us" / "Ask us"
   button; WhatsApp gets the visa name prefilled, Telegram cannot prefill a message to a person. */
V4B.chatOptions = function (visa) {
  return V4B.chat.map(function (c) {
    var text = c.hello + (visa || (c.ru ? "визу" : "a visa"));
    return '<div class="lang"><p><b>' + c.lang + "</b><span" + (c.ru ? ' lang="ru"' : "") + ">" + c.note + "</span></p>" +
      '<a class="ch ch-wa" href="https://wa.me/' + c.wa + "?text=" + encodeURIComponent(text) + '"><svg aria-hidden="true"><use href="#i-wa"/></svg>WhatsApp</a>' +
      '<a class="ch ch-tg" href="https://t.me/' + c.tg + '"><svg aria-hidden="true"><use href="#i-tg"/></svg>Telegram</a></div>';
  }).join("");
};

/* Basket: Elementor's Menu Cart widget (side cart), the Basket page and the Checkout summary all read the same list.
   The mockup keeps it in localStorage so it survives page changes; WooCommerce keeps it in the session.
   qty = number of travellers, because every person needs their own visa. */
V4B.find = function (name) {
  var hit = null;
  V4B.groups.forEach(function (g) { g.items.forEach(function (v) { if (v.name === name) hit = v; }); });
  return hit;
};
V4B.basket = {
  get: function () { try { return JSON.parse(localStorage.getItem("v4b-basket")) || []; } catch (e) { return []; } },
  set: function (items) { try { localStorage.setItem("v4b-basket", JSON.stringify(items)); } catch (e) {} V4B.basket.paint(); },
  count: function (items) { return items.reduce(function (n, i) { return n + (i.qty || 1); }, 0); },
  total: function (items) { return items.reduce(function (t, i) { return t + i.price * (i.qty || 1); }, 0); },
  paint: function () {
    var items = V4B.basket.get(), n = V4B.basket.count(items), total = V4B.rp(V4B.basket.total(items));
    document.querySelectorAll(".cart").forEach(function (b) {
      var badge = b.querySelector(".cart-n");
      badge.textContent = n; badge.hidden = !n;
      b.setAttribute("aria-label", "Basket, " + n + (n === 1 ? " visa" : " visas"));
    });
    var empty = '<li class="b-empty"><p>Your basket is empty.</p><a href="shop.html">See visas &amp; prices →</a></li>';
    var list = document.querySelector(".basket-items");
    if (list) {
      list.innerHTML = items.length ? items.map(function (i, k) {
        return '<li><span class="b-code">' + i.code + '</span><p><b>' + i.name + '</b><span class="num">' + V4B.rp(i.price * (i.qty || 1)) +
          ((i.qty || 1) > 1 ? ' <small>× ' + i.qty + "</small>" : "") + '</span></p><button type="button" class="b-rm" data-rm="' + k +
          '" aria-label="Remove ' + i.name + '"><svg><use href="#i-x"/></svg></button></li>';
      }).join("") : empty;
      document.querySelector(".basket-foot").hidden = !items.length;
      document.querySelector(".basket-total").textContent = total;
    }
    // Basket page (WooCommerce › Basket, Elementor "Cart" widget)
    var page = document.querySelector("[data-basket-page]");
    if (page) {
      page.innerHTML = items.length ? items.map(function (i, k) {
        var v = V4B.find(i.name) || {}, q = i.qty || 1;
        return '<li class="cl"><span class="cl-code">' + i.code + '</span><div class="cl-main"><b>' + i.name + "</b>" +
          (v.stay ? '<span class="cl-meta">' + v.stay + " · " + v.time + "</span>" : "") +
          '<div class="qty" role="group" aria-label="Travellers"><span>Travellers</span>' +
          '<button type="button" data-qty="' + k + '|-1" aria-label="One traveller fewer"' + (q < 2 ? " disabled" : "") + '>−</button>' +
          '<output aria-live="polite">' + q + '</output><button type="button" data-qty="' + k + '|1" aria-label="One more traveller">+</button></div></div>' +
          '<p class="cl-price num">' + V4B.rp(i.price * q) + (q > 1 ? "<small>" + V4B.rp(i.price) + " each</small>" : "") + "</p>" +
          '<button type="button" class="b-rm" data-rm="' + k + '" aria-label="Remove ' + i.name + '"><svg><use href="#i-x"/></svg></button></li>';
      }).join("") : '<li class="cl-empty"><p>Your basket is empty.</p><a class="btn btn-k" href="shop.html">See visas &amp; prices</a></li>';
    }
    document.querySelectorAll("[data-basket-summary]").forEach(function (el) { el.hidden = !items.length; });
    document.querySelectorAll("[data-basket-n]").forEach(function (el) { el.textContent = n + (n === 1 ? " visa" : " visas"); });
    document.querySelectorAll("[data-basket-total]").forEach(function (el) { el.textContent = total; });
    // Checkout order summary
    var order = document.querySelector("[data-order-lines]");
    if (order) {
      order.innerHTML = items.map(function (i) {
        var q = i.qty || 1;
        return '<li><span class="ol-code">' + i.code + '</span><span class="ol-name">' + i.name + (q > 1 ? " <small>× " + q + "</small>" : "") +
          '</span><span class="ol-price num">' + V4B.rp(i.price * q) + "</span></li>";
      }).join("");
      document.querySelectorAll("[data-checkout]").forEach(function (el) { el.hidden = !items.length; });
      document.querySelectorAll("[data-checkout-empty]").forEach(function (el) { el.hidden = !!items.length; });
    }
  }
};

(function () {
  var chat = document.createElement("dialog");
  chat.className = "chat"; chat.setAttribute("aria-labelledby", "chat-title");
  chat.innerHTML = '<div class="chat-in"><button type="button" class="x" data-close aria-label="Close"><svg><use href="#i-x"/></svg></button>' +
    '<h2 id="chat-title">Chat with us</h2><p class="chat-about"></p><div class="chat-opts"></div>' +
    '<p class="chat-hours">We reply Monday to Friday, 08:00–17:00 (Bali time).</p></div>';
  var basket = document.createElement("dialog");
  basket.className = "basket"; basket.setAttribute("aria-labelledby", "basket-title");
  basket.innerHTML = '<div class="basket-in"><header><h2 id="basket-title">Your basket</h2><button type="button" class="x" data-close aria-label="Close"><svg><use href="#i-x"/></svg></button></header>' +
    '<ul class="basket-items"></ul><div class="basket-foot"><p class="basket-sum"><span>Total</span><b class="basket-total num"></b></p>' +
    '<a class="btn btn-k" href="checkout.html">Checkout</a><a class="btn btn-o" href="basket.html">View basket</a><p class="basket-note">Payments go to VISA4BALI only. After payment we ask for your documents on WhatsApp or email.</p></div></div>';
  document.body.append(chat, basket);
  document.querySelectorAll("[data-chat-inline]").forEach(function (el) { el.innerHTML = V4B.chatOptions(); });
  V4B.basket.paint();

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-chat],[data-add],[data-cart-open],[data-close],[data-rm],[data-qty]");
    if (!t) { if (e.target === chat || e.target === basket) e.target.close(); return; }
    if (t.hasAttribute("data-chat")) {
      e.preventDefault();
      var visa = t.getAttribute("data-visa");
      chat.querySelector(".chat-about").textContent = visa ? "About: " + visa : "Choose the language you'd like to speak and your app.";
      chat.querySelector(".chat-opts").innerHTML = V4B.chatOptions(visa);
      chat.showModal();
    } else if (t.hasAttribute("data-add")) {
      e.preventDefault();
      var f = t.getAttribute("data-add").split("|");
      var items = V4B.basket.get();
      if (!items.some(function (i) { return i.name === f[1]; })) items.push({ code: f[0], name: f[1], price: +f[2], qty: 1 });
      V4B.basket.set(items); basket.showModal();
    } else if (t.hasAttribute("data-cart-open")) {
      basket.showModal();
    } else if (t.hasAttribute("data-rm")) {
      var all = V4B.basket.get(); all.splice(+t.getAttribute("data-rm"), 1); V4B.basket.set(all);
    } else if (t.hasAttribute("data-qty")) {
      var q = t.getAttribute("data-qty").split("|"), list = V4B.basket.get(), line = list[+q[0]];
      line.qty = Math.max(1, Math.min(10, (line.qty || 1) + +q[1])); V4B.basket.set(list);
      // the list is redrawn, so put focus back on the same button
      var again = document.querySelector('[data-qty="' + q.join("|") + '"]');
      if (again && !again.disabled) again.focus();
    } else {
      t.closest("dialog").close();
    }
  });
})();

/* Mobile menu: Elementor's Nav Menu widget does this on its own. */
document.addEventListener("click", function (e) {
  var b = e.target.closest(".menu"); if (!b) return;
  var nav = document.getElementById(b.getAttribute("aria-controls"));
  var open = nav.classList.toggle("open");
  b.setAttribute("aria-expanded", open ? "true" : "false");
  b.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
