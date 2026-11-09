"""Build harness.generated.js: loads pages in same-origin iframes at several widths and returns
measure-responsive.js + fingerprint.js + vertical.js results for each. Usage: python3 -I make-harness.py"""
import json
fp, ms, vt = (open(f).read().strip() for f in ('fingerprint.js', 'measure-responsive.js', 'vertical.js'))
probe = open('wp/v4b-extra.css').read()
js = """async () => {
  const { urls, widths, useProbe } = window.__H;
  const FP = %s, MS = %s, VT = %s, PROBE = %s;
  const res = {};
  for (const url of urls) for (const w of widths) {
    const f = document.createElement('iframe');
    f.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:900px;border:0;z-index:99999;background:#fff`;
    document.body.append(f);
    await new Promise(r => { f.onload = r; f.src = url; });
    const win = f.contentWindow;
    await new Promise(r => setTimeout(r, 1200));
    if (useProbe) { const s = win.document.createElement('style'); s.id = 'probe'; s.textContent = PROBE; win.document.head.append(s); }
    const run = src => win.eval('(' + src + ')()');
    try { res[url + ' @' + w] = { m: await run(MS), fp: await run(FP), v: await run(VT) }; }
    catch (e) { res[url + ' @' + w] = { error: String(e) }; }
    f.remove();
  }
  return res;
}""" % (json.dumps(fp), json.dumps(ms), json.dumps(vt), json.dumps(probe))
open('harness.generated.js', 'w').write(js)
print(len(js))
