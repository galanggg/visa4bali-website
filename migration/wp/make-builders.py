"""Browser scripts that fill an open Elementor editor with one page's sections (run on post.php?post=<id>&action=elementor)."""
import json
ids = {"home": 2259, "shop": 2260, "about": 2261, "contact": 2262, "basket": 2281, "checkout": 2282}
for name, pid in ids.items():
    secs = json.load(open(f"pages/{name}.json"))
    js = """async () => {
  const SECS = %s, PID = %d;
  for (let i = 0; i < 60 && !(window.elementor?.elements && window.$e && elementor.documents?.getCurrent()?.container); i++) await new Promise(r => setTimeout(r, 1000));
  try { $e.run('library/close'); } catch (e) {}
  const d = elementor.documents.getCurrent();
  if (d.id !== PID) return 'wrong document ' + d.id;
  // rebuild: these are our own draft pages, so clear what an earlier run put there
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
  await $e.run('document/save/draft');
  await new Promise(r => setTimeout(r, 2500));
  return {sections: elementor.elements.length, status: elementor.documents.getCurrent().config.status.value, dirty: elementor.saver.isEditorChanged(), preview: d.config.urls.wp_preview};
}""" % (json.dumps(secs, ensure_ascii=False), pid)
    open(f"pages/build-{name}.generated.js", "w").write(js)
print("ok")
