// Adaptador para integrar @elizaos/core ao endpoint de chat
// Obs.: Implementação mínima com import dinâmico e verificação de credenciais.
// Quando as chaves de modelo forem fornecidas (ex.: OPENAI_API_KEY),
// podemos evoluir para um fluxo completo de memória/character e resposta do runtime.

import type { ElisaRequest } from "@/lib/elisa";

export type CoreReply = {
  sessionId: string;
  reply: string;
  lang: 'pt' | 'en';
  meta?: Record<string, unknown>;
};

let runtimeReady = false;

export async function chatWithCore(payload: ElisaRequest): Promise<CoreReply> {
  // Verificação de provider/modelo mínimo para habilitar o runtime
  const openaiKey = process.env.OPENAI_API_KEY;
  const providerConfigured = Boolean(openaiKey);

  // Import dinâmico para evitar problemas de ESM e permitir bundling pelo Next
  const core = (await import("@elizaos/core")) as unknown as {
    AgentRuntime: new (opts: Record<string, unknown>) => {
      initialize?: () => Promise<void>;
    };
    createLogger?: (name: string) => {
      info?: (...args: unknown[]) => void;
      error?: (...args: unknown[]) => void;
    };
  };
  const { AgentRuntime, createLogger } = core;

  const sessionId = payload.sessionId ?? crypto.randomUUID();
  const lang = payload.lang ?? 'pt';

  if (!providerConfigured) {
    return {
      sessionId,
      lang,
      reply:
        lang === 'pt'
          ? 'ElizaOS Core está conectado, mas nenhuma chave de modelo foi configurada (ex.: OPENAI_API_KEY). Configure e tente novamente.'
          : 'ElizaOS Core is wired, but no model key configured (e.g., OPENAI_API_KEY). Please configure and try again.',
      meta: { provider: 'eliza-core', status: 'missing_model_key' },
    };
  }

  // Instancia runtime mínimo com logger; em evolução, carregar character e settings completos.
  const logger = createLogger?.("Kale-Elisa") ?? console;
  const runtime = new AgentRuntime({
    fetch,
    settings: {
      // Exemplos de settings. Em uma evolução, mapear para o provider escolhido.
      OPENAI_API_KEY: openaiKey,
    },
  });

  if (!runtimeReady) {
    try {
      if (typeof runtime.initialize === 'function') {
        await runtime.initialize();
      }
      runtimeReady = true;
      logger.info?.("ElizaOS Core runtime inicializado");
    } catch (e) {
      logger.error?.("Falha ao inicializar runtime ElizaOS Core", e);
    }
  }

  // Por ora, não executamos providers/ações; retornamos uma resposta informativa,
  // sinalizando que o runtime foi inicializado e aguarda configuração completa do character e modelo.
  // Próxima etapa: criar Character padrão e roteamento de mensagens no runtime.
  return {
    sessionId,
    lang,
    reply:
      lang === 'pt'
        ? 'ElizaOS Core inicializado. Configure o Character e o provedor de modelo para respostas completas.'
        : 'ElizaOS Core initialized. Configure Character and model provider for full responses.',
    meta: { provider: 'eliza-core', status: 'initialized_minimal' },
  };
}
