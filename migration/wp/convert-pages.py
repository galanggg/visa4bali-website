"""Turn the approved mockup pages into Elementor sections: one container per top-level <section> of <main>.
Usage: python3 -I convert-pages.py  → pages/<name>.json"""
import json, re, os
D = "../../design/2026-10-b-lengkap/"
UP = "https://visa4bali.com/wp-content/uploads/2026/11/v4b-b-"
payload = json.load(open("../products-payload.json"))
slug_of = {p["key"]: p["slug"] for p in payload["products"]}
syms = dict(re.findall(r'<symbol id="(i-[\w-]+)" (viewBox="[^"]*"[^>]*)>(.*?)</symbol>', open(D + "product.html").read() + open(D + "home.html").read(), re.S) and
            [(m[0], (m[1], m[2])) for m in re.findall(r'<symbol id="(i-[\w-]+)" (viewBox="[^"]*"[^>]*)>(.*?)</symbol>', open(D + "product.html").read() + open(D + "home.html").read(), re.S)])
WA = "https://wa.me/6287862273133"

def fix(html):
    html = re.sub(r'<svg><use href="#(i-[\w-]+)"/></svg>', lambda m: f'<svg {syms[m.group(1)][0]} aria-hidden="true">{syms[m.group(1)][1]}</svg>', html)
    html = re.sub(r'src="img/staff/(\w+)\.jpg"', lambda m: f'src="{UP}staff-{m.group(1)}.jpg"', html)
    html = re.sub(r'src="img/([\w-]+)\.(jpg|png)"', lambda m: f'src="{UP}{m.group(1)}.{m.group(2)}"', html)
    html = re.sub(r'href="product\.html\?visa=([\w-]+)"', lambda m: f'href="/product/{slug_of[m.group(1)]}/"', html)
    for a, b in [("home.html", "/"), ("shop.html", "/our-services/"), ("about.html", "/about-us/"), ("contact.html", "/contact-us/"), ("basket.html", "/basket/"), ("checkout.html", "/checkout/")]:
        html = html.replace(f'href="{a}', f'href="{b}')
    html = html.replace('href="' + WA + '" data-chat', 'href="' + WA + "?text=" + "Hello%20Visa4Bali%2C%20I'd%20like%20to%20ask%20about%20a%20visa" + '"')
    html = re.sub(r" data-chat(?=[\s>])", "", html)
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    return html

def toplevel(html):
    """Top-level elements of <main> (sections and the finder's wrapper div), by tag balance."""
    out, depth, start = [], 0, None
    for m in re.finditer(r"<(/?)(section|div|nav|aside)\b[^>]*>", html):
        if not m.group(1):
            if depth == 0: start = m.start()
            depth += 1
        else:
            depth -= 1
            if depth == 0: out.append(html[start:m.end()])
    return out

def sections(name):
    src = open(D + name + ".html").read()
    main = re.search(r'<main id="main">(.*)</main>', src, re.S).group(1)
    secs = toplevel(re.sub(r"<!--.*?-->", "", main, flags=re.S))
    # nested sections do not occur at top level in these pages; check balance
    out = []
    for s in secs:
        cls = re.search(r'class="([^"]*)"', s).group(1)
        out.append({"title": cls, "html": fix(s)})
    return out

STAFF = re.search(r"var team = (\[.*?\]);", open(D + "about.html").read(), re.S).group(1)
team = json.loads(STAFF)
staff_li = "".join(f'<li><img src="{UP}staff-{n.lower()}.jpg" alt="{n}, {r} at Visa4Bali" width="480" height="600" loading="lazy"><b>{n}</b><span>{r.replace("&", "&amp;")}</span></li>' for n, r in team)
inline_chat = ('<div class="lang"><p><b>English speaking</b><span>We reply in English</span></p>'
               f'<a class="ch ch-wa" href="{WA}?text=Hello%20Visa4Bali%2C%20I%27d%20like%20to%20ask%20about%20a%20visa">'
               f'<svg {syms["i-wa"][0]} aria-hidden="true">{syms["i-wa"][1]}</svg>WhatsApp</a></div>')

os.makedirs("pages", exist_ok=True)
for name in ["home", "shop", "about", "contact"]:
    secs = sections(name)
    for s in secs:
        h = s["html"]
        h = h.replace('<div class="bar" id="finder"></div>', '[v4b_finder]')
        h = h.replace('<div class="stays" id="stays"></div>', '[v4b_stays link="list"]' if name == "shop" else '[v4b_stays]')
        h = h.replace('<div id="table"></div>', '[v4b_visa_table]')
        h = h.replace('<ul class="staff" id="staff"></ul>', f'<ul class="staff">{staff_li}</ul>')
        h = h.replace('<div class="chat-opts" data-chat-inline></div>', f'<div class="chat-opts">{inline_chat}</div>')
        s["html"] = h
        h = re.sub(r'<form class="form".*?</form>', '<div class="form"><h2>Send us a message</h2><p>Our team will get back to you within 24 hours.</p>'
                   '<div class="v4b-formwrap">[elementor-template id="2272"]</div>'
                   '<p class="form-note">Please don\'t send passport photos through this form. We\'ll ask for them on WhatsApp or email.</p></div>', h, flags=re.S)
        s["html"] = h
        s["shortcode"] = "[v4b_" in h or "[elementor-template" in h
        left = re.findall(r'id="(finder|stays|table|staff)"|data-chat-inline|<form', h)
        if left: s["todo"] = left
    json.dump(secs, open(f"pages/{name}.json", "w"), ensure_ascii=False, indent=1)
    print(name, [(s["title"], s["shortcode"], s.get("todo")) for s in secs])
