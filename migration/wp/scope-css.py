"""Scope the mockup stylesheet under .v4b so it can load on the live site without touching old pages.
Usage: python3 -I scope-css.py ../../design/2026-10-b-lengkap/style.css > v4b.css"""
import re, sys
src = open(sys.argv[1], encoding="utf-8").read()
src = re.sub(r"/\*.*?\*/", "", src, flags=re.S).replace('@charset "utf-8";', "")
# mockup-only blocks that have no place in WordPress
DROP = {"dialog", ".chat", ".chat-in", ".chat-about", ".chat-hours", ".x", ".todo", ".skip", ".top", ".top-right", ".top-mob", ".nav", ".menu", ".cart", ".cart-n", ".cart-label", ".logo", ".foot", ".foot-base", ".foot-strip", "::selection", ".pk-in"}

def scope_sel(sel):
    out = []
    for s in sel.split(","):
        s = s.strip()
        if not s: continue
        tok = re.match(r"(::?[\w-]+|[.#]?[\w-]+)", s)
        if tok and tok.group(1) in DROP: continue
        if s in (":root", "html", "body"): out.append(".v4b"); continue
        if s == "*": out.append(".v4b,.v4b *"); continue
        if s.startswith(":focus-visible"): out.append(".v4b " + s); continue
        out.append(".v4b " + s)
    return ",".join(out)

def walk(css):
    res, i = [], 0
    while i < len(css):
        j = css.find("{", i)
        if j < 0: break
        head = css[i:j].strip()
        depth, k = 1, j + 1
        while depth:
            depth += {"{": 1, "}": -1}.get(css[k], 0); k += 1
        body = css[j + 1:k - 1]
        if head.startswith("@media"): res.append(head + "{" + walk(body) + "}")
        elif head.startswith("@keyframes"): res.append(head + "{" + body + "}")
        else:
            s = scope_sel(head)
            if s: res.append(s + "{" + body.strip() + "}")
        i = k
    return "\n".join(res)

print(walk(src))
