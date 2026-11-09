async () => {
  // release WP Rocket delayed JS (admin bypasses, harmless otherwise)
  window.dispatchEvent(new Event('touchstart'));
  await new Promise(r => setTimeout(r, 400));
  const vw = document.documentElement.clientWidth;
  const out = { url: location.pathname + location.search, vw, iw: window.innerWidth,
    overflowX: document.documentElement.scrollWidth - window.innerWidth, v4b: document.querySelectorAll('.v4b').length,
    wide: [], clipped: [], tinyText: [], smallTap: [], imgDistort: [] };
  const sel = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.classList.length) s += '.' + [...el.classList].slice(0, 3).join('.');
    return s;
  };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const all = [...document.querySelectorAll('body *')].filter(el => !el.closest('#wpadminbar, script, style, noscript, svg'));
  for (const el of all) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // escapes viewport horizontally
    if ((r.right > vw + 1 || r.left < -1) && cs.position !== 'fixed') {
      // skip if an ancestor clips it
      let clippedBy = null, p = el.parentElement;
      while (p && p !== document.body) { const pc = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(pc.overflowX)) { clippedBy = p; break; } p = p.parentElement; }
      if (!clippedBy) out.wide.push(`${sel(el)} L${Math.round(r.left)} R${Math.round(r.right)}`);
    }
    // content cut inside its own box (text overflow)
    if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX) && el.clientWidth > 0 && el.children.length < 3)
      out.clipped.push(`${sel(el)} ${el.scrollWidth}>${el.clientWidth}`);
    // tiny text in v4b
    if (el.closest('.v4b') && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2)) {
      const fs = parseFloat(cs.fontSize);
      if (fs < 12) out.tinyText.push(`${sel(el)} ${fs}px "${el.textContent.trim().slice(0, 30)}"`);
    }
    // tap targets
    if (el.matches('a, button, input, select, label[for], summary') && el.closest('.v4b') && vw < 800) {
      if (r.height < 32 && r.width < 200 && cs.display !== 'inline') out.smallTap.push(`${sel(el)} ${Math.round(r.width)}x${Math.round(r.height)} "${el.textContent.trim().slice(0, 20)}"`);
    }
    if (el.tagName === 'IMG' && el.naturalWidth && cs.objectFit === 'fill') {
      const ar = el.naturalWidth / el.naturalHeight, dr = r.width / r.height;
      if (Math.abs(ar - dr) / ar > 0.05) out.imgDistort.push(`${sel(el)} natural ${ar.toFixed(2)} drawn ${dr.toFixed(2)}`);
    }
  }
  for (const k of ['wide', 'clipped', 'tinyText', 'smallTap', 'imgDistort']) { out[k + 'N'] = out[k].length; out[k] = out[k].slice(0, 12); }
  out.height = document.documentElement.scrollHeight;
  return out;
}
