# Auth notes for agents

mujii.dev is a static personal portfolio. It does not currently provide
account registration, a public API, or any protected/authenticated
resource for third parties or agents.

- No OAuth or OIDC authorization is required to read any page on this site.
- There is no client-credentials, API-key, or token-based access to protect
  — no such API exists.
- The `/admin` path is a private tool for the site owner only (a
  password-protected inbox for contact-form messages). It is not a public
  API, is excluded via `robots.txt`, and is not part of the content meant
  for agents or crawlers.
- Public, agent-readable resources (no auth needed):
  - https://mujii.dev/llms.txt
  - https://mujii.dev/llms-full.txt
  - https://mujii.dev/sitemap.xml
  - https://mujii.dev/.well-known/agent-skills/index.json

If a future version of this site exposes a real API or MCP server, this
file will be updated with genuine issuer, token endpoint, and scope
information at that time — not before.
