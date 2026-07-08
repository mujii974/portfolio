# Agent Readiness Notes

## Markdown Negotiation Deployment Requirement

Markdown Negotiation requires a request-aware edge/runtime. GitHub Pages cannot vary the homepage body by Accept header.

This repository currently contains a GitHub Pages workflow at `.github/workflows/deploy.yml`. That workflow builds with `npm run build`, uploads `dist`, and serves the custom domain from `public/CNAME`. This is static-only hosting, so `curl -H "Accept: text/markdown" https://mujii.dev/` will keep returning HTML while the live site remains on GitHub Pages.

To pass the audit, deploy this site to Cloudflare Pages with:

- Build command: `npm run build`
- Output directory: `dist`
- Functions directory: `functions`

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
