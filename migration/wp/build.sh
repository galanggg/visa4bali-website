#!/bin/sh
# Rebuild the WPCode snippet text + the browser filler from v4b-shortcodes.php and the CSS files.
cd "$(dirname "$0")"
python3 -I scope-css.py ../../design/2026-10-b-lengkap/style.css > v4b.css
python3 -I - <<'PY'
import re, json
p = open('v4b-shortcodes.php').read()
css = re.sub(r"[ \t]+\n", "\n", open('v4b.css').read() + "\n" + open('v4b-extra.css').read())
out = re.sub(r"/\*V4B-CSS-START\*/.*?/\*V4B-CSS-END\*/", lambda m: "/*V4B-CSS-START*/\n" + css + "\n/*V4B-CSS-END*/", p, flags=re.S)
open('v4b-shortcodes.build.php', 'w').write(out)
code = out.replace('<?php\n', '', 1)
open('v4b-shortcodes.wpcode.txt', 'w').write(code)
open('update-wpcode.generated.js', 'w').write("""async () => {
  const CODE = %s;
  const cm = document.querySelector('.CodeMirror').CodeMirror;
  cm.setValue(CODE); cm.save();
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(cm.getValue()));
  return {len: cm.getValue().length, hash: [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')};
}""" % json.dumps(code))
PY
php -l v4b-shortcodes.build.php && shasum -a 256 v4b-shortcodes.wpcode.txt
