"""Build visa4bali-desain-ronde4.html: the proposal page plus all six mockups in one file.

Each mockup gets its CSS and visas.js inlined and is stored as a string; images are stored once
as base64 and swapped in when a preview loads. Run from this folder: python3 bundle.py
"""
import base64
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "visa4bali-desain-ronde4.html"
PAGES = ["a-home", "a-layanan", "b-home", "b-layanan", "c-home", "c-layanan"]

# Inside a preview, links to another mockup switch the preview instead of navigating away.
NAV = """<script>
document.addEventListener("click", function (e) {
  var a = e.target.closest("a"); if (!a) return;
  var h = a.getAttribute("href") || "";
  var m = h.match(/^([abc]-(?:home|layanan))\\.html(#.*)?$/);
  if (m) { e.preventDefault(); parent.postMessage({ v4bPage: m[1] }, "*"); }
  else if (/^https?:/.test(h)) { a.target = "_blank"; a.rel = "noopener"; }
  else if (h === "#") { e.preventDefault(); }
});
</script>"""


def inline_page(name):
    html = (HERE / f"{name}.html").read_text()
    html = re.sub(r'<link rel="stylesheet" href="([abc]\.css)">',
                  lambda m: "<style>\n" + (HERE / m.group(1)).read_text() + "\n</style>", html)
    html = html.replace('<script src="visas.js"></script>',
                        "<script>\n" + (HERE / "visas.js").read_text() + "\n</script>")
    return html.replace("</body>", NAV + "\n</body>")


def images():
    out = {}
    for p in sorted((HERE / "img").iterdir()):
        mime = "image/png" if p.suffix == ".png" else "image/jpeg"
        out[p.name] = f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()
    return out


RUNTIME = """<script>
(function () {
  var IMG = __IMG__, PAGES = __PAGES__;
  function doc(page) {
    return PAGES[page].replace(/img\\/([\\w.-]+\\.(?:jpg|png))/g, function (m, n) { return IMG[n] || m; });
  }
  function fit(frame) {
    var w = +frame.dataset.w, f = frame.querySelector("iframe"), s = frame.clientWidth / w;
    f.style.width = w + "px"; f.style.height = (frame.clientHeight / s) + "px"; f.style.transform = "scale(" + s + ")";
  }
  var frames = [].slice.call(document.querySelectorAll(".frame"));
  function all() { frames.forEach(fit); }
  all();
  if ("ResizeObserver" in window) { var ro = new ResizeObserver(all); frames.forEach(function (f) { ro.observe(f); }); }
  else window.addEventListener("resize", all);

  function show(prop, which) {
    var page = prop.dataset.prop + "-" + which;
    prop.dataset.page = page;
    prop.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.page === which ? "true" : "false"); });
    prop.querySelectorAll("iframe").forEach(function (f) { f.removeAttribute("src"); f.srcdoc = doc(page); });
  }
  var props = [].slice.call(document.querySelectorAll(".prop"));
  props.forEach(function (prop) {
    show(prop, "home");
    prop.querySelectorAll(".seg button").forEach(function (b) { b.addEventListener("click", function () { show(prop, b.dataset.page); }); });
    prop.querySelector("a.open").addEventListener("click", function (e) {
      e.preventDefault();
      var url = URL.createObjectURL(new Blob([doc(prop.dataset.page)], { type: "text/html" }));
      window.open(url, "_blank");
    });
  });
  window.addEventListener("message", function (e) {
    var p = e.data && e.data.v4bPage; if (!p) return;
    var prop = props.filter(function (x) { return x.dataset.prop === p.charAt(0); })[0];
    if (prop) show(prop, p.slice(2));
  });
})();
</script>"""


def main():
    index = (HERE / "index.html").read_text()
    # previews are filled from the bundled pages at load, so drop the file-based src and the old script
    index = re.sub(r'(<iframe[^>]*?) loading="lazy" src="[^"]+"', r"\1", index)
    index = re.sub(r"<script>\s*\(function \(\) \{.*?\}\)\(\);\s*</script>", "", index, flags=re.S)
    runtime = (RUNTIME
               .replace("__IMG__", json.dumps(images()))
               .replace("__PAGES__", json.dumps({p: inline_page(p) for p in PAGES}).replace("</", "<\\/")))
    OUT.write_text(index.replace("</body>", runtime + "\n</body>"))
    print(f"{OUT.name}: {OUT.stat().st_size / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
