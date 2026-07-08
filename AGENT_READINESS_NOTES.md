# Agent Readiness Notes

## Markdown Negotiation Deployment Requirement

Markdown Negotiation requires a request-aware edge/runtime. GitHub Pages cannot vary the homepage body by Accept header.

This repository previously deployed through a GitHub Pages workflow at `.github/workflows/deploy.yml`. That workflow built with `npm run build`, uploaded `dist`, and served the custom domain from `public/CNAME`. Both have been disabled for the Cloudflare Pages migration. GitHub Pages is static-only, so `curl -H "Accept: text/markdown" https://mujii.dev/` will keep returning HTML until the live domain is moved to Cloudflare Pages or another request-aware runtime.

To pass the audit, deploy this site to Cloudflare Pages with:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`
- Functions directory: `functions`

The old GitHub Pages workflow was moved to `.github/workflows-disabled/deploy.github-pages.yml` so it no longer deploys the static-only version of the site. `public/CNAME` was moved to `.github/workflows-disabled/CNAME.github-pages-disabled`; that file was only needed for GitHub Pages and is no longer emitted by the Cloudflare Pages build.

## Cloudflare Pages Deployment

Required settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Functions directory: `functions`

Deployment steps:

1. Push this repository to GitHub.
2. In Cloudflare Dashboard, go to Workers & Pages.
3. Create a Pages project and connect it to Git.
4. Select this repository.
5. Use the settings above.
6. Deploy and test the generated `pages.dev` URL first.
7. Run `curl -I -H "Accept: text/markdown" https://PROJECT_NAME.pages.dev/`.
8. Run `curl -H "Accept: text/markdown" https://PROJECT_NAME.pages.dev/`.
9. If `pages.dev` passes, add `mujii.dev` as a custom domain in Cloudflare Pages.
10. Remove old GitHub Pages DNS records, including A records pointing to GitHub Pages IPs and CNAME records pointing to `username.github.io`.
11. Use the DNS record Cloudflare Pages provides.
12. Purge Cloudflare cache if needed.
13. Verify `https://mujii.dev/` with the curl commands below.

Expected result:

- `text/markdown` requests return markdown.
- Normal browser requests return HTML.
- IsYourSiteAgentReady Markdown Negotiation should pass.

After Cloudflare Pages deployment, test:

```sh
curl -I -H "Accept: text/markdown" https://mujii.dev/
```

Expected:

```txt
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

Then test:

```sh
curl -H "Accept: text/markdown" https://mujii.dev/
```

Expected markdown starts with:

```md
# Mujtaba Shahid Portfolio
```

## DNS-AID

The DNS-AID check requires DNS records under the `mujii.dev` zone. This cannot be fully implemented from the application repository.

Required discovery names:

- `_index._agents.mujii.dev`
- `_a2a._agents.mujii.dev`
- `_mcp._agents.mujii.dev`

The validator looks for SVCB/HTTPS records and possibly TXT records at these names.

Before adding records:

- Confirm the DNS provider supports SVCB or HTTPS records.
- Confirm whether DNSSEC is enabled.
- Confirm the expected endpoint syntax from the latest DNS-AID draft.

Suggested intent:

- `_index._agents.mujii.dev` should point to the public agent discovery index.
- `_mcp._agents.mujii.dev` should point to MCP metadata only if the `/api/mcp` endpoint is deployed with the Cloudflare Pages Function in this repo.
- `_a2a._agents.mujii.dev` should only be added if A2A agent metadata is actually provided.

Do not add DNS records claiming unsupported A2A, MCP, OAuth, or commerce capabilities.

## DNS Provider TODO

- Identify the active DNS provider for `mujii.dev`.
- Verify SVCB or HTTPS record support.
- Verify DNSSEC status.
- Confirm the DNS-AID draft syntax expected by the validator.
- Add only records that point at deployed, truthful public metadata.
