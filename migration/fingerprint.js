async () => {
  // Typographic fingerprint of the design-B content, keyed by text, to diff the mockup against the WordPress draft.
  for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
  const roots = document.querySelectorAll('.v4b').length ? [...document.querySelectorAll('.v4b')] : [document.querySelector('main') || document.body];
  const out = {};
  for (const root of roots) {
    for (const el of root.querySelectorAll('*')) {
      if (el.closest('header.site, footer.site, .site-head, .site-foot, #wpadminbar')) continue;
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
      if (own.length < 3) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      const key = el.tagName + ':' + own.slice(0, 40);
      if (out[key]) continue;
      out[key] = [cs.fontFamily.split(',')[0].replace(/"/g, ''), cs.fontSize, cs.fontWeight, cs.fontStyle, cs.lineHeight, cs.color, cs.textAlign, cs.textDecorationLine, cs.textTransform, cs.letterSpacing, Math.round(r.width), Math.round(r.left)].join('|');
    }
  }
  return out;
}
