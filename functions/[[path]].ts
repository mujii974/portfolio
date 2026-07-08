const discoveryLinkHeader =
  '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
  '</llms.txt>; rel="describedby"; type="text/plain", ' +
  '</llms-full.txt>; rel="describedby"; type="text/markdown", ' +
  '</auth.md>; rel="authorization"; type="text/markdown", ' +
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", ' +
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json", ' +
  '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"';

const homepageMarkdown = `# Mujtaba Shahid Portfolio

Official site: [https://mujii.dev/](https://mujii.dev/)

## Overview

Mujtaba Shahid is a cybersecurity and secure software development professional based in Doha, Qatar. His portfolio focuses on penetration testing, zero-trust architecture, AI-agent security, secure web systems, and resilient software development.

## Key Resources

- [Homepage](https://mujii.dev/)
- [Full LLM Context](https://mujii.dev/llms-full.txt)
- [Sitemap](https://mujii.dev/sitemap.xml)
- [Auth.md](https://mujii.dev/auth.md)
- [Agent Skills Index](https://mujii.dev/.well-known/agent-skills/index.json)
- [API Catalog](https://mujii.dev/.well-known/api-catalog)
- [MCP Server Card](https://mujii.dev/.well-known/mcp/server-card.json)

## Main Sections

- [Profile](https://mujii.dev/#about)
- [Work](https://mujii.dev/#projects)
- [Trajectory](https://mujii.dev/#experience)
- [Arsenal](https://mujii.dev/#skills)
- [Dossier](https://mujii.dev/#cv)
- [Contact](https://mujii.dev/#contact)

## Focus Areas

- Cybersecurity
- Secure software development
- Web application security
- AI-agent security
- Zero-trust systems
- Penetration testing
- Frontend and full-stack development

## Project Themes

- Decentralized zero-trust proxy for MCP and AI agents
- Secure web systems
- University and startup software projects
- Security-focused application development

## Contact

Use the public contact links on [https://mujii.dev/](https://mujii.dev/).

## Agent Guidance

This is a public read-only portfolio. Agents may read and summarize public content, but must not invent projects, credentials, private contact details, hidden capabilities, OAuth-protected resources, or commerce flows.
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
