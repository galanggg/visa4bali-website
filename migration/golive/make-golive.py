"""Generate the go-live browser scripts (run through the Chrome DevTools MCP, logged in as admin).

Usage, from migration/golive/:
  python3 -I make-golive.py                      # before go-live: every script except the product rollback
  python3 -I make-golive.py SNAPSHOT.json        # after 01-snapshot: also writes 99-products-rollback.generated.js

Every apply script is idempotent (safe to run twice) and returns a log; every one has a rollback. See RUNBOOK.md.
"""
import json, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, "../products-payload.json")))
PAGES_DIR = os.path.join(HERE, "../wp/pages")

# Live page ids the draft content goes into (slugs, AIOSEO meta and URLs stay the same).
PAGES = {"home": 149, "shop": 102, "about": 155, "contact": 193, "basket": 336, "checkout": 337}
CATS = {"arriving-soon": 38, "already-in-bali": 39, "staying-longer": 40}
NEW_TEMPLATES = {"header": 2245, "footer": 2251}
OLD_FOOTER = 2059
SNIPPET_OLD_CSS = 2054
OVERSTAY = 356


def write(name, js):
    open(os.path.join(HERE, name), "w").write(js)
    print("wrote", name)


REST = """
  const nonce = await (await fetch('/wp-admin/admin-ajax.php?action=rest-nonce')).text();
  const H = {'X-WP-Nonce': nonce, 'Content-Type': 'application/json'};
  const api = async (method, url, body) => {
    const r = await fetch('/wp-json/' + url, {method, headers: H, body: body ? JSON.stringify(body) : undefined, cache: 'no-store'});
    const j = await r.json();
    if (!r.ok) throw new Error(`${method} ${url}: ${j.message || r.status}`);
    return j;
  };
  const all = async (url) => { let out = [], page = 1, got; do { got = await api('GET', `${url}${url.includes('?') ? '&' : '?'}per_page=100&page=${page++}`); out = out.concat(got); } while (got.length === 100); return out; };
"""

# ---------------------------------------------------------------- 01 snapshot (read-only)
update = [p for p in P["products"] if p["action"] == "update"]
create = [p for p in P["products"] if p["action"] == "create"]
write("01-snapshot.generated.js", """async () => {
  // READ-ONLY. Everything go-live will change, as it is right now, plus the preconditions. Save the output as the rollback source.
%s
  const ids = %s, newSlugs = %s, cats = %s, pages = %s;
  const out = {taken_at: new Date().toISOString(), products: {}, variations: {}, new_products: {}, settings: {}, pages: {}, checks: {}};
  for (const id of ids) {
    out.products[id] = await api('GET', `wc/v3/products/${id}`);
    if (out.products[id].type === 'variable') out.variations[id] = await all(`wc/v3/products/${id}/variations`);
  }
  for (const slug of newSlugs) {
    const f = await api('GET', `wc/v3/products?slug=${slug}&status=any`);
    out.new_products[slug] = f[0] ? {id: f[0].id, status: f[0].status, cats: f[0].categories.map(c => c.id)} : null;
  }
  for (const s of await api('GET', 'wc/v3/settings/general'))
    if (/currency|price_/.test(s.id)) out.settings[s.id] = s.value;
  for (const p of await api('GET', `wp/v2/pages?include=${Object.values(pages).join(',')}&context=edit&_fields=id,slug,status,template,modified`)) out.pages[p.id] = p;
  // preconditions
  const missing = newSlugs.filter(s => !out.new_products[s]);
  const notHidden = newSlugs.filter(s => out.new_products[s] && !['draft', 'private'].includes(out.new_products[s].status));
  const wrongCat = newSlugs.filter(s => out.new_products[s] && !out.new_products[s].cats.some(c => Object.values(cats).includes(c)));
  const store = await (await fetch('/wp-json/wc/store/v1/products?per_page=100', {credentials: 'omit', cache: 'no-store'})).json();
  out.checks = {
    new_products_found: `${newSlugs.length - missing.length}/${newSlugs.length}` + (missing.length ? ' MISSING ' + missing : ''),
    new_products_still_hidden: notHidden.length ? 'NO: ' + notHidden : 'yes',
    new_products_in_b_category: wrongCat.length ? 'NO: ' + wrongCat : 'yes',
    live_products_published: ids.filter(id => out.products[id].status !== 'publish').length ? 'NO' : 'yes',
    store_api_public_count: store.length,
    currency_pos: out.settings.woocommerce_currency_pos,
  };
  return out;
}""" % (REST, json.dumps([p["id"] for p in update] + [r["id"] for r in P["retire"]] + [OVERSTAY]),
        json.dumps([p["slug"] for p in create]), json.dumps(CATS), json.dumps(PAGES)))

# ---------------------------------------------------------------- 02 products apply
slim_update = [{k: p[k] for k in ("id", "slug", "name", "featured", "menu_order", "category", "short_description",
                                   "description", "meta_data", "type", "regular_price", "processing") if k in p} for p in update]
write("02-products-apply.generated.js", """async () => {
  // Go-live, products. Idempotent. Nothing is deleted.
%s
  const UPDATE = %s, RETIRE = %s, NEW = %s, CATS = %s, OVERSTAY = %d;
  const log = [];
  // 1. the 6 live products updated in place: text, meta, design-B category ADDED (old categories kept)
  for (const p of UPDATE) {
    const cur = await api('GET', `wc/v3/products/${p.id}`);
    const cats = [...new Set([...cur.categories.map(c => c.id), CATS[p.category]])].map(id => ({id}));
    const body = {name: p.name, featured: p.featured, menu_order: p.menu_order, short_description: p.short_description,
      description: p.description, categories: cats, meta_data: p.meta_data};
    if (cur.type === 'simple') body.regular_price = String(p.regular_price);
    await api('PUT', `wc/v3/products/${p.id}`, body);
    if (cur.type === 'variable' && p.type === 'variable') {
      // C1 (351): one old variation "Type: 7-9 Working Days" becomes Processing = Regular; Faster is added
      const vars = await all(`wc/v3/products/${p.id}/variations`);
      await api('PUT', `wc/v3/products/${p.id}`, {attributes: [{name: 'Processing', visible: true, variation: true, options: p.processing.map(x => x[0])}],
        default_attributes: [{name: 'Processing', option: 'Regular'}]});
      for (const [opt, price, time] of p.processing) {
        const have = vars.find(v => v.attributes.some(a => a.name === 'Processing' && a.option === opt))
          || (opt === 'Regular' && vars.filter(v => v.status === 'publish').length === 1 ? vars.find(v => v.status === 'publish') : null);
        const vb = {regular_price: String(price), status: 'publish', attributes: [{name: 'Processing', option: opt}], meta_data: [{key: 'v4b_time', value: time}]};
        if (have) await api('PUT', `wc/v3/products/${p.id}/variations/${have.id}`, vb);
        else await api('POST', `wc/v3/products/${p.id}/variations`, vb);
        log.push(`#${p.id} ${opt} ${price} ${have ? 'updated #' + have.id : 'created'}`);
      }
    } else if (cur.type === 'variable') {
      // VOA ext / C1 ext / D1 ext / D12 ext: one public variation, its price must already be the design price
      const pub = (await all(`wc/v3/products/${p.id}/variations`)).filter(v => v.status === 'publish');
      const ok = pub.length === 1 && Number(pub[0].regular_price) === Number(p.regular_price);
      log.push(`#${p.id} variable, public variation ${pub.map(v => v.id + '=' + v.regular_price)} ${ok ? 'OK' : 'CHECK: design price ' + p.regular_price}`);
    }
    log.push(`updated #${p.id} ${p.name}`);
  }
  // 2. products not in design B: Draft, whole, with all variations (301s come with the snippet's live build)
  for (const r of RETIRE) { await api('PUT', `wc/v3/products/${r.id}`, {status: 'draft'}); log.push(`draft #${r.id} (${r.from} -> ${r.to})`); }
  // 3. the 16 new products: publish
  for (const slug of NEW) {
    const f = (await api('GET', `wc/v3/products?slug=${slug}&status=any`))[0];
    if (!f) { log.push(`MISSING ${slug}`); continue; }
    if (f.status !== 'publish') await api('PUT', `wc/v3/products/${f.id}`, {status: 'publish'});
    log.push(`publish #${f.id} ${slug}`);
  }
  // 4. Overstay Fee stays buyable by link but leaves the catalogue
  await api('PUT', `wc/v3/products/${OVERSTAY}`, {catalog_visibility: 'hidden'}); log.push(`#${OVERSTAY} catalog hidden`);
  // 5. one price format: "Rp 750.000"
  await api('PUT', 'wc/v3/settings/general/woocommerce_currency_pos', {value: 'left_space'}); log.push('currency_pos left_space');
  return log;
}""" % (REST, json.dumps(slim_update, ensure_ascii=False), json.dumps(P["retire"]), json.dumps([p["slug"] for p in create]),
        json.dumps(CATS), OVERSTAY))

# ---------------------------------------------------------------- 03 theme templates (run in each template's editor)
EDITOR_READY = "for (let i = 0; i < 90 && !(window.$e && elementor.documents?.getCurrent()?.editor?.status === 'open'); i++) await new Promise(r => setTimeout(r, 1000)); await new Promise(r => setTimeout(r, 1500));"
SAVE_CONDS = """const instances = async (id) => {
    const html = await (await fetch('/wp-admin/edit.php?post_type=elementor_library&tabs_group=theme&posts_per_page=100', {cache: 'no-store'})).text();
    const row = new DOMParser().parseFromString(html, 'text/html').querySelector('#post-' + id);
    return row ? row.querySelector('td.instances').textContent.replace(/\\s+/g, ' ').trim() : 'row not found';
  };
  // Rehearsed 2026-11-09: saving an EMPTY list removes the conditions but Elementor still answers "Error while saving
  // conditions", so for [] the answer is ignored and the result is read back from the theme templates list instead.
  const saveConds = async (conditions) => {
    try {
      await new Promise((ok, no) => elementorCommon.ajax.addRequest('pro_theme_builder_save_conditions',
        {data: {conditions}, success: () => ok('ok'), error: e => no(new Error(JSON.stringify(e).slice(0, 200)))}, true));
    } catch (e) { if (conditions.length) throw e; }
    const now = await instances(elementor.config.document.id);
    if (!conditions.length && now !== 'None') throw new Error('conditions still: ' + now);
    return now;
  };"""
for kind, tid in NEW_TEMPLATES.items():
    write(f"03-template-{kind}-{tid}.generated.js", """async () => {
  // Go-live: publish template %(tid)d (%(kind)s) and show it on the entire site. Run in its editor, freshly loaded.
  %(ready)s
  if (elementor.config.document.id !== %(tid)d) return 'wrong editor: ' + elementor.config.document.id;
  %(save)s
  // publish first, conditions second: publishing from the editor re-saves the editor's (old) conditions
  if (elementor.config.document.status.value !== 'publish') await $e.run('document/save/publish');
  const now = await saveConds([{type: 'include', name: 'general'}]);
  return {id: %(tid)d, status: elementor.config.document.status.value, instances: now};
}""" % {"tid": tid, "kind": kind, "ready": EDITOR_READY, "save": SAVE_CONDS})
    write(f"98-template-{kind}-{tid}-rollback.generated.js", """async () => {
  // Rollback: template %(tid)d loses its conditions, so it shows nowhere. It stays published: Elementor refuses
  // "save as draft" on an unchanged published document (rehearsed 2026-11-09), and without conditions status does not matter.
  %(ready)s
  if (elementor.config.document.id !== %(tid)d) return 'wrong editor: ' + elementor.config.document.id;
  %(save)s
  const now = await saveConds([]);
  return {id: %(tid)d, status: elementor.config.document.status.value, instances: now};
}""" % {"tid": tid, "kind": kind, "ready": EDITOR_READY, "save": SAVE_CONDS})
write(f"03-template-oldfooter-{OLD_FOOTER}-off.generated.js", """async () => {
  // Go-live: the old global footer %(tid)d loses its "Entire Site" condition (stays published, so rollback is one call).
  %(ready)s
  if (elementor.config.document.id !== %(tid)d) return 'wrong editor: ' + elementor.config.document.id;
  %(save)s
  const before = elementor.config.document.theme_builder.settings.conditions;
  const now = await saveConds([]);
  return {id: %(tid)d, conditions_before: before, instances: now};
}""" % {"tid": OLD_FOOTER, "ready": EDITOR_READY, "save": SAVE_CONDS})
write(f"98-template-oldfooter-{OLD_FOOTER}-rollback.generated.js", """async () => {
  %(ready)s
  if (elementor.config.document.id !== %(tid)d) return 'wrong editor: ' + elementor.config.document.id;
  %(save)s
  const now = await saveConds([{type: 'include', name: 'general'}]);
  return {id: %(tid)d, instances: now};
}""" % {"tid": OLD_FOOTER, "ready": EDITOR_READY, "save": SAVE_CONDS})

# ---------------------------------------------------------------- 04 pages (run in each live page's editor)
STAMP = "2026-11-11"
for name, pid in PAGES.items():
    secs = json.load(open(os.path.join(PAGES_DIR, f"{name}.json")))
    write(f"04-page-{name}-{pid}.generated.js", """async () => {
  // Go-live: page %(pid)d (%(name)s) gets the design B draft content, template Elementor Full Width, published.
  // Its current content is first saved to the library as "ROLLBACK %(stamp)s — page %(pid)d".
  const SECS = %(secs)s, PID = %(pid)d, TITLE = 'ROLLBACK %(stamp)s — page %(pid)d';
  %(ready)s
  try { $e.run('library/close'); } catch (e) {}
  const d = elementor.documents.getCurrent();
  if (d.id !== PID) return 'wrong editor: ' + d.id;
  const ajax = (action, data) => new Promise((ok, no) => elementorCommon.ajax.addRequest(action, {data, success: ok, error: e => no(new Error(action + ' ' + JSON.stringify(e).slice(0, 200)))}, true));
  const lib = await ajax('get_library_data', {filter_by: '', sync: false});
  let backup = (lib.templates || []).find(t => t.title === TITLE);
  const isNew = elementor.getPreviewContainer().children.some(c => c.settings.get('_title') === SECS[0].title && c.children[0]?.settings.get(c.children[0].model.get('widgetType') === 'html' ? 'html' : 'shortcode')?.startsWith('<div class="v4b">'));
  if (!backup && isNew) return 'STOP: page already has design B content but no ' + TITLE + ' exists';
  if (!backup) {
    const content = elementor.elements.toJSON({remove: ['default', 'editSettings', 'defaultEditSettings']});
    const saved = await ajax('save_template', {source: 'local', type: 'page', post_id: PID, title: TITLE, content: JSON.stringify(content),
      page_settings: JSON.stringify({template: d.container.settings.get('template') || 'default'})});
    backup = {template_id: saved.template_id || saved.id, title: TITLE, fresh: true};
  }
  const oldTemplate = d.container.settings.get('template');
  for (const el of [...elementor.getPreviewContainer().children]) $e.run('document/elements/delete', {container: el});
  const box0 = {unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: true};
  for (const s of SECS) {
    const c = $e.run('document/elements/create', {container: elementor.getPreviewContainer(), options: {edit: false}, model: {elType: 'container', settings: {
      _title: s.title, content_width: 'full', flex_direction: 'column', padding: box0, flex_gap: {unit: 'px', size: 0, column: '0', row: '0', isLinked: true}}}});
    const html = '<div class="v4b">' + s.html + '</div>';
    $e.run('document/elements/create', {container: c, options: {edit: false}, model: s.shortcode
      ? {elType: 'widget', widgetType: 'shortcode', settings: {_title: s.title, shortcode: html}}
      : {elType: 'widget', widgetType: 'html', settings: {_title: s.title, html}}});
  }
  $e.run('document/elements/settings', {container: d.container, settings: {hide_title: 'yes', template: 'elementor_header_footer'}, options: {external: true}});
  // Changing the page template makes Elementor save and reload the preview by itself (rehearsed 2026-11-09),
  // so wait for that save to finish and retry ours if it still collides.
  const save = async (cmd) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 40 && elementor.documents.getCurrent().editor.isSaving; j++) await new Promise(r => setTimeout(r, 500));
      await new Promise(r => setTimeout(r, 1500));
      try { await $e.run(cmd); return; } catch (e) { if (!/save progress/.test(e.message)) throw e; }
    }
    throw new Error(cmd + ' kept colliding with another save');
  };
  await save('document/save/publish');
  await new Promise(r => setTimeout(r, 2500));
  return {page: PID, backup, old_template: oldTemplate, sections: elementor.elements.length, status: d.config.status.value, dirty: elementor.saver.isEditorChanged()};
}""" % {"pid": pid, "name": name, "stamp": STAMP, "secs": json.dumps(secs, ensure_ascii=False), "ready": EDITOR_READY})
    write(f"98-page-{name}-{pid}-rollback.generated.js", """async () => {
  // Rollback: page %(pid)d gets back the content saved as "ROLLBACK %(stamp)s — page %(pid)d", and its old page template.
  const PID = %(pid)d, TITLE = 'ROLLBACK %(stamp)s — page %(pid)d';
  %(ready)s
  try { $e.run('library/close'); } catch (e) {}
  const d = elementor.documents.getCurrent();
  if (d.id !== PID) return 'wrong editor: ' + d.id;
  const ajax = (action, data) => new Promise((ok, no) => elementorCommon.ajax.addRequest(action, {data, success: ok, error: e => no(new Error(action + ' ' + JSON.stringify(e).slice(0, 200)))}, true));
  const lib = await ajax('get_library_data', {filter_by: '', sync: false});
  const t = (lib.templates || []).find(t => t.title === TITLE);
  if (!t) return 'STOP: no ' + TITLE;
  const data = await ajax('get_template_data', {source: 'local', template_id: t.template_id, edit_mode: true});
  for (const el of [...elementor.getPreviewContainer().children]) $e.run('document/elements/delete', {container: el});
  for (const model of data.content) $e.run('document/elements/create', {container: elementor.getPreviewContainer(), model, options: {edit: false}});
  $e.run('document/elements/settings', {container: d.container, settings: {template: (data.page_settings && data.page_settings.template) || %(oldtpl)s}, options: {external: true}});
  // Changing the page template makes Elementor save and reload the preview by itself (rehearsed 2026-11-09),
  // so wait for that save to finish and retry ours if it still collides.
  const save = async (cmd) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 40 && elementor.documents.getCurrent().editor.isSaving; j++) await new Promise(r => setTimeout(r, 500));
      await new Promise(r => setTimeout(r, 1500));
      try { await $e.run(cmd); return; } catch (e) { if (!/save progress/.test(e.message)) throw e; }
    }
    throw new Error(cmd + ' kept colliding with another save');
  };
  await save('document/save/publish');
  await new Promise(r => setTimeout(r, 2500));
  return {page: PID, restored_from: t.template_id, sections: elementor.elements.length, template: d.container.settings.get('template'), dirty: elementor.saver.isEditorChanged()};
}""" % {"pid": pid, "stamp": STAMP, "ready": EDITOR_READY,
        "oldtpl": json.dumps({149: "elementor_canvas", 155: "elementor_canvas", 193: "elementor_canvas", 337: "elementor_header_footer"}.get(pid, "default"))})

# ---------------------------------------------------------------- 05 old mobile CSS snippet 2054 (run on its WPCode edit page)
for active, fname in ((False, f"05-snippet-{SNIPPET_OLD_CSS}-off.generated.js"), (True, f"98-snippet-{SNIPPET_OLD_CSS}-on-rollback.generated.js")):
    write(fname, """async () => {
  // Snippet %(sid)d (old round 1–4 mobile CSS) %(what)s. Run on admin.php?page=wpcode-snippet-manager&snippet_id=%(sid)d.
  if (!location.search.includes('snippet_id=%(sid)d')) return 'wrong page';
  const box = document.querySelector('#wpcode_active');
  if (box.checked === %(want)s) return {already: %(want)s};
  box.click();
  [...document.querySelectorAll('button.wpcode-button')].find(x => x.textContent.trim() === 'Update').click();
  return 'saving; re-run to confirm {already: %(want)s}';
}""" % {"sid": SNIPPET_OLD_CSS, "what": "deactivated (kept, not deleted)" if not active else "re-activated", "want": "true" if active else "false"})

# ---------------------------------------------------------------- 06 WP Rocket purge (run on any admin page)
write("06-rocket-purge.generated.js", """async () => {
  // "Clear and preload cache" from the admin bar (never "Save Changes and Optimize").
  const a = [...document.querySelectorAll('#wpadminbar a')].find(a => /action=purge_cache.*type=all/.test(a.href));
  if (!a) return 'no purge link in the admin bar';
  const r = await fetch(a.href, {credentials: 'same-origin'});
  return {status: r.status, url: a.href.replace(/_wpnonce=\\w+/, '_wpnonce=…')};
}""")

# ---------------------------------------------------------------- 99 products rollback (needs the snapshot)
if len(sys.argv) > 1:
    S = json.load(open(sys.argv[1]))
    keep = ("name", "status", "featured", "menu_order", "short_description", "description", "catalog_visibility", "categories",
            "attributes", "default_attributes")
    prods = {pid: {k: (v if k != "categories" else [{"id": c["id"]} for c in v]) for k, v in p.items() if k in keep}
             for pid, p in S["products"].items()}
    vars_ = {pid: [{"id": v["id"], "status": v["status"], "regular_price": v["regular_price"],
                    "attributes": [{"name": a["name"], "option": a["option"]} for a in v["attributes"]]} for v in vs]
             for pid, vs in S["variations"].items()}
    write("99-products-rollback.generated.js", """async () => {
  // Rollback, products, from the go-live snapshot taken at %(at)s. Nothing is deleted: an added variation goes private.
%(rest)s
  const PRODUCTS = %(p)s, VARIATIONS = %(v)s, NEW = %(n)s, SETTINGS = %(s)s;
  const log = [];
  for (const [id, body] of Object.entries(PRODUCTS)) { await api('PUT', `wc/v3/products/${id}`, body); log.push(`restored #${id} ${body.status}`); }
  for (const [id, vs] of Object.entries(VARIATIONS)) {
    const now = await all(`wc/v3/products/${id}/variations`);
    for (const v of vs) await api('PUT', `wc/v3/products/${id}/variations/${v.id}`, {status: v.status, regular_price: v.regular_price, attributes: v.attributes});
    for (const extra of now.filter(n => !vs.some(v => v.id === n.id))) { await api('PUT', `wc/v3/products/${id}/variations/${extra.id}`, {status: 'private'}); log.push(`#${id} variation #${extra.id} -> private`); }
  }
  for (const [slug, p] of Object.entries(NEW)) if (p) { await api('PUT', `wc/v3/products/${p.id}`, {status: p.status}); log.push(`#${p.id} ${slug} -> ${p.status}`); }
  await api('PUT', 'wc/v3/settings/general/woocommerce_currency_pos', {value: SETTINGS.woocommerce_currency_pos}); log.push('currency_pos ' + SETTINGS.woocommerce_currency_pos);
  return log;
}""" % {"at": S["taken_at"], "rest": REST, "p": json.dumps(prods, ensure_ascii=False), "v": json.dumps(vars_),
        "n": json.dumps(S["new_products"]), "s": json.dumps(S["settings"])})
