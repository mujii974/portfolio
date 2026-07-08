const portfolioSummary =
  "Mujtaba Shahid is a cybersecurity and secure software development professional in Doha, Qatar, focused on penetration testing, zero-trust architecture, secure web systems, and AI-agent security.";

const projects = [
  {
    name: "Decentralized Zero-Trust Proxy for MCP",
    source: "https://github.com/mujii974/DZT-Proxy-for-MCP",
    themes: ["AI-agent security", "zero trust", "MCP", "secure communication"],
  },
  {
    name: "Hospital Management System",
    source: "https://github.com/mujii974/Hospital-Management-System",
    themes: ["secure development", "web systems", "application security"],
  },
  {
    name: "Battleship: CryptoCracks",
    source: "https://github.com/mujii974/Battleship_CryptoCracks",
    themes: ["applied cryptography", "education", "interactive security"],
  },
];

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: unknown;
};

type ToolCallParams = {
  name?: string;
  arguments?: {
    focus?: string;
    uri?: string;
  };
};

type PagesContext = {
  request: Request;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function textContent(text: string) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

function mcpResult(request: JsonRpcRequest, result: unknown) {
  return {
    jsonrpc: "2.0",
    id: request.id ?? null,
    result,
  };
}

function mcpError(request: JsonRpcRequest, code: number, message: string) {
  return {
    jsonrpc: "2.0",
    id: request.id ?? null,
    error: {
      code,
      message,
    },
  };
}

function readResource(uri: string) {
  if (uri === "portfolio://summary") {
    return portfolioSummary;
  }

  if (uri === "portfolio://projects") {
    return JSON.stringify(projects, null, 2);
  }

  if (uri === "portfolio://contact") {
    return "Use the public contact section and links on https://mujii.dev/.";
  }

  return null;
}

function handleToolCall(params: ToolCallParams | undefined) {
  if (params?.name === "get_portfolio_summary") {
    return textContent(portfolioSummary);
  }

  if (params?.name === "get_projects") {
    const focus = params.arguments?.focus?.toLowerCase();
    const filtered = focus
      ? projects.filter((project) =>
          project.themes.some((theme) => theme.toLowerCase().includes(focus)),
        )
      : projects;

    return textContent(JSON.stringify({ focus: focus ?? "all", projects: filtered }, null, 2));
  }

  if (params?.name === "get_contact_links") {
    return textContent(
      JSON.stringify(
        {
          message: "Use the public contact section and links on https://mujii.dev/.",
          homepage: "https://mujii.dev/",
          github: "https://github.com/mujii974/",
          linkedin: "https://www.linkedin.com/in/mujtaba-shahid/",
        },
        null,
        2,
      ),
    );
  }

  return null;
}

function handleMcpRequest(request: JsonRpcRequest) {
  if (request.jsonrpc !== "2.0" || typeof request.method !== "string") {
    return mcpError(request, -32600, "Invalid JSON-RPC request.");
  }

  if (request.method === "initialize") {
    return mcpResult(request, {
      protocolVersion: "2025-06-18",
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: "mujii-portfolio",
        version: "1.0.0",
      },
    });
  }

  if (request.method === "tools/list") {
    return mcpResult(request, {
      tools: [
        {
          name: "get_portfolio_summary",
          description: "Return a concise summary of Mujtaba Shahid's public portfolio.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: "get_projects",
          description: "Return public project summaries from the portfolio.",
          inputSchema: {
            type: "object",
            properties: {
              focus: {
                type: "string",
                description: "Optional focus area such as AI security, zero trust, or web security.",
              },
            },
            additionalProperties: false,
          },
        },
        {
          name: "get_contact_links",
          description: "Return public contact guidance for the portfolio.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
        },
      ],
    });
  }

  if (request.method === "tools/call") {
    const result = handleToolCall(request.params as ToolCallParams | undefined);
    return result ? mcpResult(request, result) : mcpError(request, -32602, "Unknown tool.");
  }

  if (request.method === "resources/list") {
    return mcpResult(request, {
      resources: [
        {
          uri: "portfolio://summary",
          name: "Portfolio Summary",
          mimeType: "text/plain",
        },
        {
          uri: "portfolio://projects",
          name: "Public Projects",
          mimeType: "application/json",
        },
        {
          uri: "portfolio://contact",
          name: "Contact Guidance",
          mimeType: "text/plain",
        },
      ],
    });
  }

  if (request.method === "resources/read") {
    const uri =
      typeof request.params === "object" &&
      request.params !== null &&
      "uri" in request.params &&
      typeof request.params.uri === "string"
        ? request.params.uri
        : "";
    const text = readResource(uri);

    return text
      ? mcpResult(request, {
          contents: [
            {
              uri,
              mimeType: uri === "portfolio://projects" ? "application/json" : "text/plain",
              text,
            },
          ],
        })
      : mcpError(request, -32602, "Unknown resource.");
  }

  return mcpError(request, -32601, "Method not found.");
}

export const onRequestOptions = () =>
  new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
    },
  });

export const onRequestPost = async (context: PagesContext) => {
  let body: unknown;

  try {
    body = await context.request.json();
  } catch {
    return jsonResponse(mcpError({ id: null }, -32700, "Parse error."), 400);
  }

  if (Array.isArray(body)) {
    return jsonResponse(body.map((item) => handleMcpRequest(item as JsonRpcRequest)));
  }

  return jsonResponse(handleMcpRequest(body as JsonRpcRequest));
};

export const onRequestGet = () =>
  jsonResponse({
    name: "mujii-portfolio",
    description: "Read-only MCP endpoint. Send JSON-RPC POST requests to use tools and resources.",
    methods: ["initialize", "tools/list", "tools/call", "resources/list", "resources/read"],
  });
