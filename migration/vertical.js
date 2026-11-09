() => {
  // top of every heading relative to the first h1 — compares vertical rhythm between mockup and WordPress draft
  const hs = [...document.querySelectorAll('main h1, main h2, main h3, .v4b h1, .v4b h2, .v4b h3, main .pk-opt, .v4b .pk-opt')];
  const seen = new Set(), base = hs.length ? hs[0].getBoundingClientRect().top : 0, out = [];
  for (const h of hs) { const t = h.textContent.replace(/\s+/g, ' ').trim().slice(0, 28); if (seen.has(t) || !h.getBoundingClientRect().height) continue; seen.add(t); out.push(`${Math.round(h.getBoundingClientRect().top - base)}\t${t}`); }
  return out.join('\n');
}
