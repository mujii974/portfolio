const discoveryLinkHeader =
  '</llms.txt>; rel="describedby"; type="text/plain", ' +
  '</llms-full.txt>; rel="describedby"; type="text/markdown", ' +
  '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
  '</auth.md>; rel="authorization"; type="text/markdown", ' +
  '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json", ' +
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"';

const homepageMarkdown = `# Mujtaba Shahid Portfolio

Official site: [https://mujii.dev/](https://mujii.dev/)

## Overview

Mujtaba Shahid is a cybersecurity and secure software development professional based in Doha, Qatar. His portfolio focuses on penetration testing, zero-trust architecture, AI-agent security, secure web systems, and resilient software development.

## Key Resources

- [Homepage](https://mujii.dev/)
- [LLMS Summary](https://mujii.dev/llms.txt)
- [Full LLM Context](https://mujii.dev/llms-full.txt)
- [Sitemap](https://mujii.dev/sitemap.xml)
- [Auth.md](https://mujii.dev/auth.md)
- [Agent Skills Index](https://mujii.dev/.well-known/agent-skills/index.json)
- [API Catalog](https://mujii.dev/.well-known/api-catalog)

## Main Sections

- [Profile](https://mujii.dev/#profile)
- [Work](https://mujii.dev/#work)
- [Trajectory](https://mujii.dev/#trajectory)
- [Arsenal](https://mujii.dev/#arsenal)
- [Dossier](https://mujii.dev/#dossier)
- [Contact](https://mujii.dev/#contact)

## Professional Focus

- Cybersecurity
- Secure software development
- Web application security
- AI-agent security
- Zero-trust architecture
- Penetration testing
- Resilient web systems

## Agent Guidance

This is a public read-only portfolio. AI agents may read and summarize public content, but must not invent projects, credentials, private contact details, hidden APIs, authentication flows, commerce capabilities, or private data.
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
  const accept = request.headers.get("accept") || "";
  const isHomepage = url.pathname === "/" || url.pathname === "/index.html";

  if (isHomepage && accept.toLowerCase().includes("text/markdown")) {
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
  if (!headers.has("Link")) {
    headers.set("Link", discoveryLinkHeader);
  }
  appendVary(headers, "Accept");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
