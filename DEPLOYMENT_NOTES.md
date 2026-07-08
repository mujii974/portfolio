# Deployment notes — performance & agent-readiness follow-ups

This repo builds a static Vite site, deployed to **GitHub Pages** via
`.github/workflows/deploy.yml`, served at `mujii.dev` which is **DNS-proxied
through Cloudflare** (confirmed via `curl -I https://mujii.dev/` — response
carries both `server: cloudflare` and GitHub Pages/Fastly headers).

That hosting shape matters: **GitHub Pages cannot serve custom HTTP
response headers, run server-side logic, or do content negotiation.** It
only serves static files with whatever headers Pages/Fastly set by default.
This repo now includes Cloudflare/Netlify-style `_headers` plus Cloudflare
Pages Functions for Link headers, markdown negotiation, and a read-only MCP
endpoint. Those runtime pieces are real and locally verified with
`wrangler pages dev`, but they will not run on the current GitHub Pages
deployment until the site is migrated to Cloudflare Pages or equivalent
edge middleware is deployed in front of GitHub Pages.

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
  genuinely truthful, static, and served as-is by GitHub Pages.
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

## Still needs deployment-platform change

### 1. Cache-Control on hashed assets

GitHub Pages' default `Cache-Control` is short and uniform for every path
(the PSI "inefficient cache lifetimes" finding). To fix without breaking
HTML freshness:

- Add a **Cloudflare Cache Rule** (or a Transform Rule that sets response
  headers) matching `mujii.dev/assets/*` → set
  `Cache-Control: public, max-age=31536000, immutable` (safe because Vite
  content-hashes every filename in `/assets/`).
- Leave `/` and any non-hashed path (e.g. `/sitemap.xml`, `/llms.txt`) on a
  short cache: `Cache-Control: public, max-age=0, must-revalidate`, or just
  leave Cloudflare's default for HTML.
- Free/Pro Cloudflare plans support Cache Rules; response *header
  rewriting* via Transform Rules needs a Business plan or a Worker (below).

### 2. Homepage `Link` headers

Not possible via GitHub Pages static hosting. The repo now includes
`public/_headers` and `functions/[[path]].ts`; deploy them on Cloudflare
Pages, or add an equivalent Cloudflare Worker in front of `mujii.dev/` that
passes through the origin response and appends headers, e.g.:

```js
export default {
  async fetch(request, env, ctx) {
    const res = await fetch(request);
    const url = new URL(request.url);
    if (url.pathname === "/") {
      const headers = new Headers(res.headers);
      headers.append("Link", '</sitemap.xml>; rel="sitemap"; type="application/xml"');
      headers.append("Link", '</llms.txt>; rel="describedby"; type="text/plain"');
      headers.append("Link", '</llms-full.txt>; rel="describedby"; type="text/plain"');
      headers.append("Link", '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json"');
      headers.append("Link", '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"');
      return new Response(res.body, { status: res.status, headers });
    }
    return res;
  },
};
```

The checked-in Pages Function is the preferred version if you move this
repo to Cloudflare Pages. I have no Cloudflare account access to create or
deploy a Worker Route on the current live domain.

### 3. `Content-Type: application/linkset+json` for `/.well-known/api-catalog`

GitHub Pages will serve this extensionless file with a generic/guessed
content type, not `application/linkset+json`. The same Worker above can be
extended with a rule for that path to set the correct `Content-Type`.

### 4. Markdown for Agents (`Accept: text/markdown` content negotiation)

Implemented in `functions/[[path]].ts` for Cloudflare Pages and verified
locally with `wrangler pages dev`. GitHub Pages cannot vary a response by
request header, so the live `https://mujii.dev/` deployment will keep
returning normal HTML for `Accept: text/markdown` until a Cloudflare Pages
or Worker deployment is active.

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
