import { NextRequest } from "next/server";
import { z } from "zod";
import { detectLang, ElisaClient, type ElisaRequest } from "@/lib/elisa";
import { aesGcmEncryptWithKey } from "@/lib/crypto";
import { chatWithCore } from "@/lib/eliza-core";

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1),
  lang: z.enum(["pt", "en"]).optional(),
  context: z.record(z.string(), z.any()).optional(),
  e2e: z.object({ key: z.string().min(1) }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.parse(json);

    const lang = parsed.lang ?? detectLang(parsed.message);
    const payload: ElisaRequest = { ...parsed, lang };

    // Modo opcional: ElizaOS Core (esqueleto para futura integração real)
    if (process.env.ELIZA_USE_CORE === "true") {
      const coreResult = await chatWithCore(payload);
      if (parsed.e2e?.key) {
        const enc = aesGcmEncryptWithKey(JSON.stringify(coreResult), parsed.e2e.key);
        return Response.json({ sessionId: coreResult.sessionId, lang: coreResult.lang, e2e: enc }, { status: 200 });
      }
      return Response.json(coreResult, { status: 200 });
    }

    const baseUrl = process.env.ELISA_API_URL;
    const apiKey = process.env.ELISA_API_KEY;

    if (!baseUrl || !apiKey) {
      // Fallback mock: responde com eco contextualizado
      const result = {
        sessionId: parsed.sessionId ?? crypto.randomUUID(),
        reply: lang === "pt"
          ? "Sou a Elisa (mock). Posso ajudar com onboarding, KYC orientado, educação financeira e antifraude. Você disse: " + parsed.message
          : "I'm Elisa (mock). I can help with onboarding, guided KYC, financial education and anti-fraud. You said: " + parsed.message,
        lang,
        meta: { intent: "smalltalk.mock", confidence: 0.4 },
      };
      if (parsed.e2e?.key) {
        const enc = aesGcmEncryptWithKey(JSON.stringify(result), parsed.e2e.key);
        return Response.json({ sessionId: result.sessionId, lang: result.lang, e2e: enc });
      }
      return Response.json(result);
    }

    const client = new ElisaClient(baseUrl, apiKey);
    const result = await client.chat(payload);
    if (parsed.e2e?.key) {
      const enc = aesGcmEncryptWithKey(JSON.stringify(result), parsed.e2e.key);
      return Response.json({ sessionId: result.sessionId, lang: result.lang, e2e: enc });
    }
    return Response.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: "invalid_body", details: err.flatten() }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
}
