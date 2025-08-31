import { NextRequest } from "next/server";
import { z } from "zod";
import { detectLang, ElisaClient, type ElisaRequest } from "@/lib/elisa";
import { aesGcmEncryptWithKey } from "@/lib/crypto";
import { chatWithCore } from "@/lib/eliza-core";
import { appendAudit } from "@/lib/audit";

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1),
  lang: z.enum(["pt", "en"]).optional(),
  context: z.record(z.string(), z.any()).optional(),
  e2e: z.object({ key: z.string().min(1) }).optional(),
});

// Rate limit in-memory (escopo de módulo): 20 req/min por IP
const rateBucket: Map<string, number[]> = new Map();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const now = Date.now();
    const windowMs = 60_000;
    const maxReq = 20;
    const arr = (rateBucket.get(ip) ?? []).filter((t) => now - t < windowMs);
    arr.push(now);
    rateBucket.set(ip, arr);
    if (arr.length > maxReq) return Response.json({ error: "rate_limited" }, { status: 429 });

    const json = await req.json();
    const parsed = bodySchema.parse(json);

    const lang = parsed.lang ?? detectLang(parsed.message);
    const payload: ElisaRequest = { ...parsed, lang };

    // Detecção simples de intenção de remessa (PT/EN)
    // Exemplos: "enviar 500 BRL para USDC", "send 200 USD to BRL"
    function detectRemitIntent(text: string) {
      const t = text.trim();
      // Use positional capture groups to avoid named-group requirement
      // Suporta símbolos monetários opcionais, separadores de milhar e variações "em/de ... para ..."
      // PT: 1=verb, 2=currency symbol?, 3=amount, 4=from?, 5=to
      const pt = /^\s*(enviar|mandar)\s*(R\$|US\$|\$|€|£)?\s*([0-9]{1,3}(?:[\.,][0-9]{3})*(?:[\.,][0-9]+)?|[0-9]+)\s*([A-Za-z]{3,5})?\s*(?:em|de|para|p\/|->)\s*([A-Za-z]{3,5})\s*$/i;
      // EN: 1=verb, 2=currency symbol?, 3=amount, 4=from?, 5=to
      const en = /^\s*(send|transfer)\s*(\$|US\$|€|£)?\s*([0-9]{1,3}(?:[\.,][0-9]{3})*(?:[\.,][0-9]+)?|[0-9]+)\s*([A-Za-z]{3,5})?\s*(?:to|in|from|->)\s*([A-Za-z]{3,5})\s*$/i;
      const m = t.match(lang === "pt" ? pt : en) || t.match(pt) || t.match(en);
      if (!m) return undefined;
      const rawAmount = String(m[3]).replace(/\./g, "").replace(",", ".");
      const amount = Number(rawAmount);
      const from = (m[4] || (lang === "pt" ? "BRL" : "USD")).toUpperCase();
      const to = (m[5] || (lang === "pt" ? "USDC" : "BRL")).toUpperCase();
      if (!amount || !to) return undefined;
      return { amount, from, to } as const;
    }

    const intent = detectRemitIntent(parsed.message);

    // Modo opcional: ElizaOS Core (esqueleto para futura integração real)
    if (process.env.ELIZA_USE_CORE === "true") {
      const coreResult = await chatWithCore(payload);
      const enhanced = intent
        ? {
            ...coreResult,
            meta: {
              ...(coreResult.meta ?? {}),
              intent: "remit.proposal",
              suggestedRemit: {
                from: intent.from,
                to: intent.to,
                amount: intent.amount,
                confirm: true,
              },
            },
            reply:
              lang === "pt"
                ? `Você quer enviar ${intent.amount} ${intent.from} para ${intent.to}. Confirma?`
                : `You want to send ${intent.amount} ${intent.from} to ${intent.to}. Confirm?`,
          }
        : coreResult;
      appendAudit(parsed.context?.userId ?? "anonymous", "elisa.intent", { lang, intent: enhanced.meta?.intent, suggestedRemit: enhanced.meta?.suggestedRemit });
      if (parsed.e2e?.key) {
        const enc = aesGcmEncryptWithKey(JSON.stringify(enhanced), parsed.e2e.key);
        return Response.json({ sessionId: enhanced.sessionId, lang: enhanced.lang, e2e: enc }, { status: 200 });
      }
      return Response.json(enhanced, { status: 200 });
    }

    const baseUrl = process.env.ELISA_API_URL;
    const apiKey = process.env.ELISA_API_KEY;

    if (!baseUrl || !apiKey) {
      // Fallback mock: responde com eco contextualizado
      const result = {
        sessionId: parsed.sessionId ?? crypto.randomUUID(),
        reply: intent
          ? (lang === "pt"
              ? `Você quer enviar ${intent.amount} ${intent.from} para ${intent.to}. Confirma?`
              : `You want to send ${intent.amount} ${intent.from} to ${intent.to}. Confirm?`)
          : (lang === "pt"
              ? "Sou a Elisa (mock). Posso ajudar com onboarding, KYC orientado, educação financeira e antifraude. Você disse: " + parsed.message
              : "I'm Elisa (mock). I can help with onboarding, guided KYC, financial education and anti-fraud. You said: " + parsed.message),
        lang,
        meta: intent
          ? { intent: "remit.proposal", confidence: 0.9, suggestedRemit: { from: intent.from, to: intent.to, amount: intent.amount, confirm: true } }
          : { intent: "smalltalk.mock", confidence: 0.4 },
      };
      appendAudit(parsed.context?.userId ?? "anonymous", "elisa.intent", { lang, intent: result.meta.intent, suggestedRemit: (result as { meta?: { suggestedRemit?: unknown } }).meta?.suggestedRemit });
      if (parsed.e2e?.key) {
        const enc = aesGcmEncryptWithKey(JSON.stringify(result), parsed.e2e.key);
        return Response.json({ sessionId: result.sessionId, lang: result.lang, e2e: enc });
      }
      return Response.json(result);
    }

    const client = new ElisaClient(baseUrl, apiKey);
    const result = await client.chat(payload);
    // Anexar proposta se detectada localmente
    const enhanced = intent
      ? {
          ...result,
          meta: {
            ...(result.meta ?? {}),
            intent: "remit.proposal",
            suggestedRemit: { from: intent.from, to: intent.to, amount: intent.amount, confirm: true },
          },
          reply:
            lang === "pt"
              ? `Você quer enviar ${intent.amount} ${intent.from} para ${intent.to}. Confirma?`
              : `You want to send ${intent.amount} ${intent.from} to ${intent.to}. Confirm?`,
        }
      : result;
    appendAudit(parsed.context?.userId ?? "anonymous", "elisa.intent", { lang, intent: enhanced.meta?.intent, suggestedRemit: (enhanced as { meta?: { suggestedRemit?: unknown } }).meta?.suggestedRemit });
    if (parsed.e2e?.key) {
      const enc = aesGcmEncryptWithKey(JSON.stringify(enhanced), parsed.e2e.key);
      return Response.json({ sessionId: enhanced.sessionId, lang: enhanced.lang, e2e: enc });
    }
    return Response.json(enhanced);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "invalid_body", details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
