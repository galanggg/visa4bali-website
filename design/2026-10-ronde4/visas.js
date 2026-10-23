/* Visa4Bali visa data, shared by all three proposals.
   Prices and processing times come from Visa4Bali's own flyers (price list June 2026,
   e-VOA flyer, VOA extension flyer) and the current /our-services/ pricing card.
   route: "buy" = standard visa, paid online; "chat" = complex case, WhatsApp first. */
window.V4B = {
  wa: "+62 878 6227 3133",
  waHref: "https://wa.me/6287862273133",
  groups: [
    {
      id: "arrive",
      label: "Arriving soon",
      ask: "I haven't flown in yet",
      blurb: "Short stays for holidays, meetings and visiting.",
      items: [
        { code: "e-VOA", name: "Electronic Visa on Arrival", stay: "30 days", time: "5–7 working days", price: 750000, route: "buy" },
        { code: "C1", name: "Tourist Visa", stay: "60 days, extendable to 180", time: "12–14 working days", price: 2200000, route: "buy" },
        { code: "C2", name: "Business Visa", stay: "60 days", time: "12–14 working days", price: 3500000, route: "chat" }
      ]
    },
    {
      id: "extend",
      label: "Already in Bali",
      ask: "I'm here and need more time",
      blurb: "We collect your passport and bring it back stamped.",
      items: [
        { code: "VOA", name: "VOA Extension", stay: "+30 days", time: "8–10 working days", price: 800000, route: "buy" },
        { code: "VOA", name: "VOA Extension, faster", stay: "+30 days", time: "3–5 working days", price: 1000000, route: "buy" },
        { code: "C1", name: "Tourist Visa Extension", stay: "+60 days", time: "Ask us", price: 1800000, route: "buy" }
      ]
    },
    {
      id: "stay",
      label: "Staying longer",
      ask: "I want to live or work here",
      blurb: "Multiple-entry visas and stay permits, one case manager.",
      items: [
        { code: "D1", name: "Multiple Entry Visa, 1 year", stay: "60 days per arrival", time: "12–14 working days", price: 5000000, route: "chat" },
        { code: "D12", name: "Multiple Entry Visa, 1 year", stay: "180 days per arrival", time: "12–14 working days", price: 7500000, route: "chat" },
        { code: "E33G", name: "Remote Worker KITAS, offshore", stay: "1 year", time: "12–14 working days", price: 12000000, route: "chat" },
        { code: "KITAS", name: "Family KITAS, 1 year onshore", stay: "1 year", time: "14–21 working days", price: 11500000, route: "chat" },
        { code: "KITAS", name: "Retirement KITAS, offshore", stay: "1 year", time: "12–14 working days", price: 13000000, route: "chat" },
        { code: "KITAS", name: "Investor KITAS, 2 years offshore", stay: "2 years", time: "12–14 working days", price: 16000000, route: "chat" }
      ]
    }
  ],
  rp: function (n) { return "Rp " + n.toLocaleString("en-US"); },
  from: function (g) { return Math.min.apply(null, g.items.map(function (i) { return i.price; })); }
};

/* Visa finder: three choices, then the matching visas with price and the right next step.
   Markup is the same for every proposal; each stylesheet gives it its own voice. */
window.V4B.finder = function (root, opts) {
  opts = opts || {};
  var V = window.V4B;
  var name = "pick-" + Math.random().toString(36).slice(2, 7);
  var tabs = V.groups.map(function (g, i) {
    return '<label class="pk-opt"><input type="radio" name="' + name + '" value="' + g.id + '"' + (i === 0 ? " checked" : "") +
      '><span class="pk-opt-label">' + g.label + '</span><span class="pk-opt-ask">' + g.ask + "</span></label>";
  }).join("");
  root.innerHTML =
    '<fieldset class="pk-tabs"><legend class="pk-legend">' + (opts.legend || "Where are you now?") + "</legend>" + tabs + "</fieldset>" +
    '<ul class="pk-list" aria-live="polite"></ul>' +
    '<p class="pk-foot">' + (opts.foot || 'Not sure which one? <a href="' + V.waHref + '">Ask us on WhatsApp</a>.') + "</p>";
  var list = root.querySelector(".pk-list");
  function show(id) {
    var g = V.groups.filter(function (x) { return x.id === id; })[0];
    var items = g.items.slice(0, opts.max || 3);
    list.innerHTML = items.map(function (v) {
      var act = v.route === "buy"
        ? '<a class="pk-act pk-buy" href="#">Apply online</a>'
        : '<a class="pk-act pk-chat" href="' + V.waHref + '">Ask on WhatsApp</a>';
      return '<li class="pk-row"><span class="pk-code">' + v.code + '</span><span class="pk-main"><b class="pk-name">' + v.name +
        '</b><span class="pk-meta">' + v.stay + " · " + v.time + '</span></span><span class="pk-price">' + V.rp(v.price) + "</span>" + act + "</li>";
    }).join("");
    list.classList.remove("pk-in"); void list.offsetWidth; list.classList.add("pk-in");
  }
  root.addEventListener("change", function (e) { if (e.target.name === name) show(e.target.value); });
  show(V.groups[0].id);
};

/* Full price table for the Services page, grouped. */
window.V4B.table = function (root) {
  var V = window.V4B;
  root.innerHTML = V.groups.map(function (g) {
    return '<section class="pt-group" id="' + g.id + '"><header class="pt-head"><h2 class="pt-title">' + g.label +
      '</h2><p class="pt-blurb">' + g.blurb + '</p></header><div class="pt-rows">' +
      g.items.map(function (v) {
        var act = v.route === "buy"
          ? '<a class="pt-act pt-buy" href="#">Apply online</a>'
          : '<a class="pt-act pt-chat" href="' + V.waHref + '">Ask on WhatsApp</a>';
        return '<div class="pt-row"><span class="pt-code">' + v.code + '</span><span class="pt-name">' + v.name +
          '</span><span class="pt-stay"><i>Stay</i>' + v.stay + '</span><span class="pt-time"><i>Processing</i>' + v.time +
          '</span><span class="pt-price">' + V.rp(v.price) + "</span>" + act + "</div>";
      }).join("") + "</div></section>";
  }).join("");
};
