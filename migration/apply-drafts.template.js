async () => {
  // Creates the design-B categories and the NEW products as Draft. Never touches published products. Idempotent.
  const P = __PAYLOAD__;
  const nonce = await (await fetch('/wp-admin/admin-ajax.php?action=rest-nonce')).text();
  const H = {'X-WP-Nonce': nonce, 'Content-Type': 'application/json'};
  const api = async (method, url, body) => {
    const r = await fetch('/wp-json/wc/v3/' + url, {method, headers: H, body: body ? JSON.stringify(body) : undefined});
    const j = await r.json();
    if (!r.ok) throw new Error(`${method} ${url}: ${j.message || r.status}`);
    return j;
  };
  const log = [];
  const cats = {};
  for (const c of P.categories) {
    const found = await api('GET', `products/categories?slug=${c.slug}`);
    cats[c.slug] = found[0]?.id || (await api('POST', 'products/categories', c)).id;
    log.push(`cat ${c.slug} = ${cats[c.slug]}${found[0] ? ' (existed)' : ''}`);
  }
  for (const p of P.products.filter(p => p.action === 'create')) {
    const found = await api('GET', `products?slug=${p.slug}&status=any`);
    if (found[0]) { log.push(`skip ${p.slug}: exists #${found[0].id} (${found[0].status})`); continue; }
    const body = {name: p.name, slug: p.slug, status: 'draft', type: p.type, featured: p.featured, menu_order: p.menu_order,
      categories: [{id: cats[p.category]}], short_description: p.short_description, description: p.description, meta_data: p.meta_data};
    if (p.type === 'external') Object.assign(body, {regular_price: p.regular_price, external_url: p.external_url, button_text: p.button_text});
    if (p.type === 'simple') Object.assign(body, {regular_price: p.regular_price});
    if (p.type === 'variable') Object.assign(body, {attributes: [{name: 'Processing', visible: true, variation: true, options: p.processing.map(x => x[0])}],
      default_attributes: [{name: 'Processing', option: 'Regular'}]});
    const made = await api('POST', 'products', body);
    if (p.type === 'variable') for (const [opt, price, time] of p.processing)
      await api('POST', `products/${made.id}/variations`, {regular_price: String(price), attributes: [{name: 'Processing', option: opt}], meta_data: [{key: 'v4b_time', value: time}]});
    log.push(`made #${made.id} ${made.status} ${p.type} ${p.slug}`);
  }
  return log;
}
