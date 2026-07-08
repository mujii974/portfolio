# Deployment notes — performance & agent-readiness follow-ups

This repo builds a Vite site prepared for **Cloudflare Pages**. The old
GitHub Pages workflow was moved to
`.github/workflows-disabled/deploy.github-pages.yml`, and the old
GitHub Pages custom-domain file was renamed to
`.github/workflows-disabled/CNAME.github-pages-disabled`.

That migration matters because **GitHub Pages cannot serve custom HTTP
response headers, run server-side logic, or do content negotiation**. It
only serves static files with whatever headers Pages/Fastly set by default.
This repo now includes Cloudflare Pages `_headers` plus Pages Functions for
Link headers, markdown negotiation, and a read-only MCP endpoint. Those
runtime pieces are real and locally verified with `wrangler pages dev`, but
they will not run on the live domain until `mujii.dev` is migrated to
Cloudflare Pages or equivalent edge middleware.

## What's already fixed in code (this change)

- Fonts load async (preload → swap), no longer render-blocking.
- Below-the-fold sections (About, Projects, Trajectory, Arsenal, Dossier,
  Contact, the three.js background) are code-split with `React.lazy` —
  smaller critical-path bundle.
- `SignalField`'s per-frame render loop no longer reads
  `scrollHeight`/`clientHeight` every animation frame (cached, recomputed
  only on resize) — removes a forced-reflow source.
- `SiteNav`'s scroll handler now rAF-throttles and caches document height
  on resize instead of measuring it on every scroll event.
- Boot splash timing shortened (it's a full-viewport overlay that plays on
  every fresh session/lab run with no `sessionStorage` flag yet, so its
  duration was a direct, deterministic tax on LCP).
- `vite.config.ts` now emits real source maps (`build.sourcemap: true`),
  deployed alongside the JS, so the "missing source map" warning resolves
  honestly instead of by removing the reference.
- Added or updated `sitemap.xml`, `robots.txt` sitemap line + `/admin`
  disallow, `llms.txt`, `llms-full.txt`, `auth.md`, and
  `/.well-known/agent-skills/{index.json,read-portfolio/SKILL.md}` — all
  genuinely truthful, static, and served as-is by Cloudflare Pages.
- `/.well-known/api-catalog` — a linkset pointing only to real public
  machine-readable docs and service descriptions.
- `/.well-known/oauth-protected-resource` and
  `/.well-known/oauth-authorization-server` — truthful no-auth metadata
  with no fake authorization, token, or JWKS endpoints.
- `/.well-known/mcp/server-card.json` — points to `/api/mcp`, which is
  implemented by `functions/api/mcp.ts` as a read-only JSON-RPC endpoint
  when deployed on Cloudflare Pages.
- `public/_headers` — declares homepage `Link` headers and content types
  for the public agent metadata files on hosts that support this format.
- `functions/[[path]].ts` — serves markdown for `Accept: text/markdown`
  homepage requests and adds homepage discovery headers on Cloudflare Pages.
- `src/webmcp.ts` — feature-detects `navigator.modelContext.provideContext`
  and registers read-only WebMCP tools only when that browser API exists.

## Cloudflare Pages deployment target

Required settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Functions directory: `functions`

See `DEPLOY_CLOUDFLARE_PAGES.md` for the DNS migration checklist,
verification commands, and rollback note.

## Still needs live platform change

### 1. Cache-Control on hashed assets

`public/_headers` sets `Cache-Control: public, max-age=31536000, immutable`
for `/assets/*` on Cloudflare Pages. GitHub Pages will not apply this file.

### 2. Homepage `Link` headers

Implemented in `functions/[[path]].ts` for Cloudflare Pages. The live
GitHub Pages deployment will not use this function.

### 3. `Content-Type: application/linkset+json` for `/.well-known/api-catalog`

`public/_headers` sets this on Cloudflare Pages. GitHub Pages will not
apply it.

### 4. Markdown for Agents (`Accept: text/markdown` content negotiation)

Implemented in `functions/[[path]].ts` for Cloudflare Pages and verified
locally with `wrangler pages dev`. The live `https://mujii.dev/` deployment
will keep returning normal HTML for `Accept: text/markdown` until the
custom domain is attached to Cloudflare Pages or another request-aware
runtime.

### 5. DNS-AID records

Not something code in this repo can create — these are DNS records on
whatever provider hosts `mujii.dev`'s zone (Cloudflare, per the proxy
above). If you want to publish them, add TXT records:

```
_index._agents.mujii.dev   TXT   "v=agents1; skills=https://mujii.dev/.well-known/agent-skills/index.json"
_a2a._agents.mujii.dev     TXT   ""   ; leave absent — no A2A agent server exists on this site
_mcp._agents.mujii.dev     TXT   "v=agents1; card=https://mujii.dev/.well-known/mcp/server-card.json"
```

Publish `_mcp._agents` only after the `/api/mcp` function is deployed on
the live site. Do not publish `_a2a` unless a real A2A agent server exists.

## Explicitly not done, and why

- **OAuth/OIDC server behavior**: no auth server exists for this site, so
  the metadata intentionally omits issuer token, authorization, and JWKS
  endpoints. Publishing fake endpoints would be worse than the
  missing-capability finding.
- **A2A agent server**: not applicable; no A2A agent is exposed.
- **Commerce discovery**: not applicable; this is a portfolio, not a
  storefront.
