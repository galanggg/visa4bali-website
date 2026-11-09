#!/bin/sh
# Logged-out checks of visa4bali.com, from the terminal (no cookies, so this is what visitors get).
#   sh verify.sh before    # the night before / just before go-live: the site must still be the OLD one
#   sh verify.sh after     # after go-live: design B everywhere, old URLs redirected
# Prints one line per check and a final count; exits 1 if anything failed.
MODE=${1:-after}
B=https://visa4bali.com
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) visa4bali-golive-check"
cd "$(dirname "$0")"
FAIL=0; PASS=0
ok()  { PASS=$((PASS+1)); echo "ok    $*"; }
bad() { FAIL=$((FAIL+1)); echo "FAIL  $*"; }
get() { curl -s -A "$UA" -o /tmp/v4b-verify.html -w '%{http_code}' "$1"; }
has() { grep -q -- "$1" /tmp/v4b-verify.html; }
loc() { curl -s -A "$UA" -o /dev/null -w '%{http_code} %{redirect_url}' "$1"; }

PAGES="/ /our-services/ /about-us/ /contact-us/ /basket/ /checkout/"
PRODUCTS=$(python3 -I -c "import json;print(' '.join(p['slug'] for p in json.load(open('../products-payload.json'))['products']))")
NEWPRODUCTS=$(python3 -I -c "import json;print(' '.join(p['slug'] for p in json.load(open('../products-payload.json'))['products'] if p['action']=='create'))")

if [ "$MODE" = before ]; then
  for p in $PAGES; do
    c=$(get "$B$p")
    # an empty basket sends /checkout/ to /basket/ (302); checkout itself is checked in the browser with the DOKU test
    if [ "$p" = /checkout/ ]; then [ "$c" = 302 ] && ok "$p 302 (empty basket)" || bad "$p $c"; continue; fi
    [ "$c" = 200 ] && ok "$p 200" || bad "$p $c"
    has 'id=.v4b-inline-css.' && bad "$p design B CSS already loads for visitors" || ok "$p no design B CSS"
    has 'data-elementor-id="2245"' && bad "$p new header already live" || ok "$p old header"
  done
  for s in $NEWPRODUCTS; do c=$(get "$B/product/$s/"); [ "$c" = 404 ] && ok "new product hidden: $s" || bad "new product visible: $s ($c)"; done
  n=$(curl -s -A "$UA" "$B/wp-json/wc/store/v1/products?per_page=100" | python3 -I -c "import json,sys;print(len(json.load(sys.stdin)))")
  [ "$n" = 12 ] && ok "Store API 12 public products" || bad "Store API $n public products (expected 12)"
else
  for p in $PAGES; do
    c=$(get "$B$p")
    if [ "$p" = /checkout/ ]; then [ "$c" = 302 ] && ok "$p 302 (empty basket; check it in the browser)" || bad "$p $c"; continue; fi
    [ "$c" = 200 ] && ok "$p 200" || bad "$p $c"
    has 'id=.v4b-inline-css.' && ok "$p design B CSS" || bad "$p no design B CSS"
    has 'data-elementor-id="2245"' && ok "$p header 2245" || bad "$p header 2245 missing"
    has 'data-elementor-id="2251"' && ok "$p footer 2251" || bad "$p footer 2251 missing"
    has 'data-elementor-id="2059"' && bad "$p old footer 2059 still renders" || ok "$p no old footer"
    has 'class="v4b' && ok "$p design B content" || bad "$p no design B content"
  done
  get "$B/" >/dev/null; has 'Rp 750.000' && ok "price format Rp 750.000 on Home" || bad "price format: Rp 750.000 not on Home"
  for s in $PRODUCTS; do
    c=$(get "$B/product/$s/")
    if [ "$c" = 200 ] && has 'data-elementor-id="2255"' && ! has 'woolentor-woo-template-builder'; then ok "product $s (2255)"; else bad "product $s: $c, template 2255 $(has 'data-elementor-id="2255"' && echo yes || echo no)"; fi
  done
  while IFS=, read -r from to; do
    [ "$from" = from ] && continue
    r=$(loc "$B$from"); [ "$r" = "301 $B$to" ] && ok "301 $from -> $to" || bad "redirect $from: got '$r', want '301 $B$to'"
  done <<'EOF'
from,to
/shop/,/our-services/
/product-category/arriving-soon/,/our-services/#arriving-soon
/product-category/already-in-bali/,/our-services/#already-in-bali
/product-category/staying-longer/,/our-services/#staying-longer
/product/offshore-business-visa-d212-ru/,/product/d1-multiple-entry-tourist-visa/
/product/family-visa/,/product/family-kitas-offshore/
/product/c12-d12-visa/,/product/d12-multiple-entry-visa-1-year/
/product/remote-working-visa-e33g/,/product/e33g-remote-worker-kitas/
/product/visa4bali-onshore-ru/,/our-services/
EOF
  n=$(curl -s -A "$UA" "$B/wp-json/wc/store/v1/products?per_page=100" | python3 -I -c "import json,sys;print(len(json.load(sys.stdin)))")
  echo "info  Store API lists $n public products (22 design B products; Overstay Fee is catalog-hidden)"
fi
# every URL that was in the sitemap before migration must still answer 200, or 301 in one step
tail -n +2 ../baseline-urls-seo-2026-11-09.csv | cut -d, -f1 | while read -r u; do
  r=$(loc "$u"); code=${r%% *}
  case "$code" in 200) ok "baseline $u";; 301) ok "baseline $u -> ${r#* }";; *) bad "baseline $u: $r";; esac
done | tee /tmp/v4b-verify-baseline.txt | grep -v '^ok' ; grep -c '^ok' /tmp/v4b-verify-baseline.txt | sed 's/^/ok    baseline URLs answering: /'
echo "---- $PASS ok, $FAIL failed (baseline URL failures are listed above)"
[ "$FAIL" = 0 ]
