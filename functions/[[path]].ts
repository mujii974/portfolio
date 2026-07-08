const discoveryLinkHeader =
  '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
  '</llms.txt>; rel="describedby"; type="text/plain", ' +
  '</llms-full.txt>; rel="describedby"; type="text/markdown", ' +
  '</auth.md>; rel="authorization"; type="text/markdown", ' +
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", ' +
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json", ' +
  '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';

const homepageMarkdown = `# Mujtaba Shahid Portfolio

Canonical URL: https://mujii.dev/

## Overview

Mujtaba Shahid is a cybersecurity and secure software development professional based in Doha, Qatar. His portfolio focuses on penetration testing, zero-trust architecture, secure web systems, and AI-agent security.

## Professional Focus

- Cybersecurity
- Secure software development
- Web application security
- AI-agent security
- Zero-trust systems
- Penetration testing
- Frontend and full-stack development

## Projects

1. Decentralized Zero-Trust Proxy for MCP and AI agents
2. Secure web systems
3. University and startup software projects
4. Security-focused application development

## Contact

Use the public contact links on https://mujii.dev/.

## Agent Guidance

This is a public read-only portfolio. There are no public account-registration flows, OAuth login flows, protected API scopes, payment flows, or private agent actions.

## Canonical Links

- Homepage: https://mujii.dev/
- Short agent summary: https://mujii.dev/llms.txt
- Full agent context: https://mujii.dev/llms-full.txt
- Auth notes: https://mujii.dev/auth.md
- API catalog: https://mujii.dev/.well-known/api-catalog
- Agent skills: https://mujii.dev/.well-known/agent-skills/index.json
- MCP server card: https://mujii.dev/.well-known/mcp/server-card.json
`;

type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
};

function appendVary(headers: Headers, value: string) {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }

  const values = existing.split(",").map((part) => part.trim().toLowerCase());
  if (!values.includes(value.toLowerCase())) {
    headers.set("Vary", `${existing}, ${value}`);
  }
}

export const onRequest = async (context: PagesContext) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const accept = request.headers.get("Accept") ?? "";
  const isHomepage = url.pathname === "/" || url.pathname === "";

  if (isHomepage && accept.includes("text/markdown")) {
    return new Response(homepageMarkdown, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "text/markdown; charset=utf-8",
        Link: discoveryLinkHeader,
        Vary: "Accept",
        "x-markdown-tokens": String(Math.ceil(homepageMarkdown.length / 4)),
      },
    });
  }

  const response = await next();

  if (!isHomepage) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Link", discoveryLinkHeader);
  appendVary(headers, "Accept");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
