export type ElisaMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  lang?: "pt" | "en";
};

export type ElisaRequest = {
  sessionId?: string;
  message: string;
  lang?: "pt" | "en";
  context?: Record<string, unknown>;
};

export type ElisaResponse = {
  sessionId: string;
  reply: string;
  lang: "pt" | "en";
  meta?: {
    intent?: string;
    confidence?: number;
    actions?: Array<{ type: string; payload?: Record<string, unknown> }>
  };
};

export class ElisaClient {
  constructor(private baseUrl: string, private apiKey: string) {}

  async chat(req: ElisaRequest): Promise<ElisaResponse> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      throw new Error(`Elisa API error: ${res.status}`);
    }
    return (await res.json()) as ElisaResponse;
  }
}

export function detectLang(text?: string): "pt" | "en" {
  const nav = typeof navigator !== "undefined" ? navigator.language : undefined;
  const candidate = text?.toLowerCase() ?? "";
  if (nav?.startsWith("pt")) return "pt";
  // heurística simples
  const ptHints = ["remessa", "cotação", "kyc", "carteira", "envie", "receba", "moeda", "taxa", "valor"];
  const score = ptHints.reduce((acc, w) => (candidate.includes(w) ? acc + 1 : acc), 0);
  return score >= 2 ? "pt" : "en";
}
