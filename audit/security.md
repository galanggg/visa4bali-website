# Security Audit — visa4bali.com

Audited 2026-05-28. WordPress on Hostinger, PHP 8.1.34, WP Rocket edge.

> Scope: non-intrusive recon only (public endpoints, headers, REST API). No exploitation, no login attempts, no scanning. This is a defensive checklist.

## What's working 🟢

- `wp-config.php.bak` → **403** (good, backup not exposed).
- `wp-content/debug.log` → **403** (good).
- `/wp-admin/` disallowed in robots; `xmlrpc.php` GET → 405.
- HTTPS enforced site-wide (`upgrade-insecure-requests`).
- `wp-login.php` sends `x-frame-options: SAMEORIGIN`.
- REST API exposes `application-passwords` auth (modern, fine).

## Issues

### 🔴 User enumeration via REST API
`GET /wp-json/wp/v2/users` returns the admin account publicly:

```json
[{"id":1,"name":"visa4bali.com","slug":"lightblue-marten-798626-hostingersite-com","is_super_admin":true}]
```

Leaks: admin user exists (id 1), `is_super_admin:true`, the login slug, gravatar hash. Attacker now needs only the password → brute-force / credential-stuffing target identified.
**Fix:**
- Block/limit `wp/v2/users` for unauthenticated requests (security plugin or `rest_endpoints` filter).
- Ensure the **login username ≠ the public slug**. Disable author archive enumeration (`/?author=1`).
- Install login rate-limiting (Limit Login Attempts / Wordfence / Hostinger's built-in).

### 🟠 `readme.html` publicly accessible
`/readme.html` returns 200. Standard WP file that discloses WordPress fingerprint (and often exact core version). Recon aid for attackers matching known CVEs.
**Fix:** delete or 403 `readme.html` (and `license.txt`). WP Rocket / server rule.

### 🟠 `xmlrpc.php` enabled
Returns 405 to GET but accepts POST. XML-RPC enables pingback DDoS amplification and `system.multicall` brute-force (many password guesses per request).
**Fix:** disable XML-RPC unless a plugin needs it (Jetpack does — confirm). If unused: block via server or `add_filter('xmlrpc_enabled','__return_false')`.

### 🟠 Missing security headers — MOSTLY RESOLVED 2026-05-28
Added via HTTP Headers plugin (by Dimitar Ivanov). Live values verified:
- ✅ `strict-transport-security: max-age=2592000` (30 days, conservative start; raise to 1 year after monitoring)
- ✅ `x-content-type-options: nosniff`
- ✅ `x-frame-options: SAMEORIGIN`
- ✅ `referrer-policy: strict-origin-when-cross-origin`
- 🟡 `permissions-policy` — configured but **not emitting** (HTTP Headers plugin checkbox UI bug; deferred — try `.htaccess` or alternate plugin later)
- ⏸️ Real `Content-Security-Policy` — intentionally deferred (Elementor inlines styles/scripts; needs careful per-domain allowlist build)

### 🟠 Outdated plugin/core versions
Detected versions are behind current (as of audit):
- Elementor 3.22.3, Elementor Pro 3.20.0 — both several minor versions old.
- hello-elementor 3.0.1.
- WP core hidden but readme present → likely not auto-updating fully.

Stale Elementor/WooCommerce are frequent CVE targets.
**Fix:** patch all plugins + core. Enable auto-updates for security releases. Audit unused plugins (Envato Elements, Jetpack, Hostinger AI tools — remove if not needed; every plugin = attack surface).

### 🟡 Large plugin surface incl. e-commerce
WooCommerce + WooLentor + MetForm + many addons. Store handles **payments** (DOKU/`doku`, `jokul` namespaces seen in REST). Payment + form plugins = sensitive.
**Fix:**
- Keep WooCommerce + payment gateway plugins patched as priority.
- Confirm PCI: card data should be handled by gateway (DOKU/Jokul hosted), never stored on-site.
- MetForm collects passport/personal data → ensure entries stored securely, access-controlled, and a privacy/retention policy exists.

### 🟡 Server/tech fingerprint leakage
Headers leak `x-powered-by: PHP/8.1.34`, `WP Rocket/3.17.2.1`, `platform: hostinger`. Helps attacker target known CVEs.
**Fix:** suppress `X-Powered-By` (`expose_php = Off`), strip version query strings where possible.

### 🟡 Application Passwords enabled
REST advertises application-passwords auth. Fine if used; risky if not (extra auth vector).
**Fix:** disable if no integration uses it.

## Priority order

1. 🔴 Block REST user enumeration + add login rate-limiting.
2. 🟠 Remove readme.html/license.txt, disable xmlrpc (if unused).
3. 🟠 Add security headers (HSTS, nosniff, frame-options, referrer).
4. 🟠 Patch core + all plugins; remove unused plugins.
5. 🟡 Harden WooCommerce/payment + MetForm data handling.
6. 🟡 Suppress version fingerprints.

> Recommend installing a hardening/WAF plugin (Wordfence or Solid Security) + scheduled malware scans, plus off-site automated backups.
