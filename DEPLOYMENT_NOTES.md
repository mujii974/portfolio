# Deployment notes — performance & agent-readiness follow-ups

This repo builds a static Vite site, deployed to **GitHub Pages** via
`.github/workflows/deploy.yml`, served at `mujii.dev` which is **DNS-proxied
through Cloudflare** (confirmed via `curl -I https://mujii.dev/` — response
carries both `server: cloudflare` and GitHub Pages/Fastly headers).

That hosting shape matters: **GitHub Pages cannot serve custom HTTP
response headers, run server-side logic, or do content negotiation.** It
only serves static files with whatever headers Pages/Fastly set by default.
Everything below that needs a header or a negotiated response therefore
needs to happen at the Cloudflare edge (which *is* in front of the origin),
not in this repo. I did not implement or claim any of these — they require
dashboard/API access to your Cloudflare account, which I don't have.

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
- Added `sitemap.xml`, `robots.txt` sitemap line + `/admin` disallow,
  `llms.txt`, `llms-full.txt`, `auth.md`, and
  `/.well-known/agent-skills/{index.json,read-portfolio/SKILL.md}` — all
  genuinely truthful, static, and served as-is by GitHub Pages.
- `/.well-known/api-catalog` — a linkset pointing only to the real static
  docs above (llms.txt, llms-full.txt, sitemap.xml, agent-skills index). No
  fake API/OAuth/commerce endpoints are claimed anywhere.

## Needs Cloudflare dashboard/Worker access (not done here)

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

Not possible via GitHub Pages static hosting. If you want these live, add a
Cloudflare Worker in front of `mujii.dev/` that passes through the origin
response and appends headers, e.g.:

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

This is **not deployed** — it's a reference implementation for you to add
as a Worker Route on `mujii.dev/*` if you want the Link-header check to
pass. I have no Cloudflare account access to create or deploy it.

### 3. `Content-Type: application/linkset+json` for `/.well-known/api-catalog`

GitHub Pages will serve this extensionless file with a generic/guessed
content type, not `application/linkset+json`. The same Worker above can be
extended with a rule for that path to set the correct `Content-Type`.

### 4. Markdown for Agents (`Accept: text/markdown` content negotiation)

Genuinely not implemented — I removed the earlier draft that implied it
worked. GitHub Pages cannot vary a response by request header. To support
this honestly, the same Worker would need to check
`request.headers.get("Accept")` and, when it prefers `text/markdown`,
respond with the contents of `/llms-full.txt` and
`Content-Type: text/markdown; charset=utf-8` instead of proxying to the
origin HTML. Until that Worker exists and is deployed, `curl -H "Accept:
text/markdown" https://mujii.dev/` will keep returning normal HTML — that's
expected and correct given the current hosting.

### 5. DNS-AID records

Not something code in this repo can create — these are DNS records on
whatever provider hosts `mujii.dev`'s zone (Cloudflare, per the proxy
above). If you want to publish them, add TXT records:

```
_index._agents.mujii.dev   TXT   "v=agents1; skills=https://mujii.dev/.well-known/agent-skills/index.json"
_a2a._agents.mujii.dev     TXT   ""   ; leave absent — no A2A agent server exists on this site
_mcp._agents.mujii.dev     TXT   ""   ; leave absent — no MCP server exists on this site
```

Only publish `_index._agents` — it's the only one backed by something real
(the agent-skills index). Do not publish `_a2a` or `_mcp` records; doing so
would claim capabilities (an A2A agent, an MCP server) that don't exist on
this site. Leave those two absent until/unless they become real.

## Explicitly not done, and why

- **OAuth/OIDC discovery, OAuth Protected Resource Metadata**: no auth
  server exists for this site, so no issuer/token endpoint/jwks_uri were
  published. Publishing fake ones would be worse than the missing-file
  finding.
- **MCP Server Card, WebMCP tools**: no MCP server or `navigator.modelContext`
  integration exists. Not added — there is nothing real to describe yet.
- **Commerce discovery**: not applicable; this is a portfolio, not a
  storefront.
