type WebMcpToolResult = Record<string, unknown>;

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input?: { focus?: string }) => Promise<WebMcpToolResult>;
};

type WebMcpContext = {
  name: string;
  description: string;
  tools: WebMcpTool[];
};

type NavigatorWithModelContext = Navigator & {
  modelContext?: {
    provideContext?: (context: WebMcpContext) => void;
  };
};

function registerWebMcp() {
  if (typeof window === "undefined") {
    return;
  }

  const nav = window.navigator as NavigatorWithModelContext;
  const provideContext = nav.modelContext?.provideContext;

  if (typeof provideContext !== "function") {
    return;
  }

  provideContext({
    name: "mujii-portfolio",
    description: "Read-only tools for Mujtaba Shahid's public cybersecurity portfolio.",
    tools: [
      {
        name: "get_portfolio_summary",
        description: "Return a concise summary of Mujtaba Shahid's public portfolio.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () => ({
          name: "Mujtaba Shahid",
          site: "https://mujii.dev/",
          focus: [
            "cybersecurity",
            "secure software development",
            "AI-agent security",
            "zero-trust architecture",
            "web application security",
          ],
        }),
      },
      {
        name: "get_public_projects",
        description: "Return public project themes from the portfolio.",
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
        execute: async (input = {}) => ({
          focus: input.focus ?? "all",
          projects: [
            {
              name: "Decentralized Zero-Trust Proxy for MCP",
              themes: ["AI-agent security", "zero trust", "MCP", "secure communication"],
            },
            {
              name: "Secure software and web projects",
              themes: ["secure development", "web systems", "application security"],
            },
          ],
        }),
      },
      {
        name: "get_contact_guidance",
        description: "Return public contact guidance for the portfolio.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () => ({
          message: "Use the public contact section and links on https://mujii.dev/.",
        }),
      },
    ],
  });
}

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(registerWebMcp, { timeout: 1500 });
  } else {
    globalThis.setTimeout(registerWebMcp, 0);
  }
}
