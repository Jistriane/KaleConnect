"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper para integrar a carteira Albedo (Stellar)
// Albedo é uma carteira web que funciona através de popups, não uma extensão

async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

let loadingScript: Promise<void> | null = null;

// URLs alternativas para carregar o script da Albedo
const ALBEDO_SCRIPT_URLS = [
  "https://albedo.link/static/albedo-intent-bundle.js",
  "https://cdn.jsdelivr.net/npm/@albedo-link/intent@latest/lib/albedo-intent-bundle.js",
  "https://unpkg.com/@albedo-link/intent@latest/lib/albedo-intent-bundle.js"
];

async function loadAlbedoScript(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).albedo) return; // já disponível
  if (loadingScript) return loadingScript;

  loadingScript = new Promise<void>(async (resolve, reject) => {
    // Verificar se já existe um script carregado
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="albedo-intent-bundle"]'
    );
    if (existing) {
      if ((window as any).albedo) {
        resolve();
        return;
      }
      existing.remove(); // Remove script anterior que falhou
    }

    // Tentar carregar de múltiplas fontes
    let lastError: Error | null = null;
    
    for (let i = 0; i < ALBEDO_SCRIPT_URLS.length; i++) {
      const url = ALBEDO_SCRIPT_URLS[i];
      
      try {
        console.info(`Tentando carregar Albedo de: ${url}`);
        
        await new Promise<void>((resolveScript, rejectScript) => {
          const script = document.createElement("script");
          script.async = true;
          script.crossOrigin = "anonymous"; // Adicionar CORS
          script.src = url;

          const timeoutId = setTimeout(() => {
            script.remove();
            rejectScript(new Error(`Timeout ao carregar de ${url}`));
          }, 10000);

          script.onload = () => {
            clearTimeout(timeoutId);
            // Aguardar inicialização da API
            setTimeout(() => {
              if ((window as any).albedo) {
                console.info(`✅ Albedo carregada com sucesso de: ${url}`);
                resolveScript();
              } else {
                script.remove();
                rejectScript(new Error(`API não disponível após carregar de ${url}`));
              }
            }, 1500); // Tempo maior para inicialização
          };

          script.onerror = (error) => {
            clearTimeout(timeoutId);
            script.remove();
            console.warn(`❌ Falha ao carregar de ${url}:`, error);
            rejectScript(new Error(`Falha no carregamento de ${url}`));
          };

          document.head.appendChild(script);
        });

        // Se chegou aqui, carregamento foi bem-sucedido
        resolve();
        return;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Se não é a última URL, continuar tentando
        if (i < ALBEDO_SCRIPT_URLS.length - 1) {
          console.info(`Tentando próxima URL...`);
          await wait(500); // Pequena pausa entre tentativas
          continue;
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    console.error("❌ Falha ao carregar Albedo de todas as fontes");
    reject(lastError || new Error("Falha ao carregar script da Albedo de todas as fontes"));
  });

  return loadingScript;
}

async function getInjectedAlbedo(retries = 30, intervalMs = 500): Promise<any | undefined> {
  if (typeof window === "undefined") return undefined;
  
  // Primeira tentativa: verificar se já está disponível
  if ((window as any).albedo) {
    return (window as any).albedo;
  }

  // Segunda tentativa: carregar o script se necessário
  try {
    await loadAlbedoScript();
    // Após carregar, verificar imediatamente
    if ((window as any).albedo) {
      return (window as any).albedo;
    }
  } catch (error) {
    // Silenciosamente continuar com polling - script pode não ter carregado ainda
    // Isso é normal para carteiras web e não precisa ser logado como erro
  }

  // Terceira tentativa: polling com timeout progressivo
  for (let i = 0; i < retries; i++) {
    const anyWin: any = window as any;
    const g = anyWin?.albedo;
    if (g && typeof g === 'object') {
      // Verificar se a API está realmente funcional
      if (typeof g.publicKey === 'function' || typeof g.intent === 'function') {
        return g;
      }
    }
    
    // Timeout progressivo: aumenta o intervalo conforme as tentativas
    const currentInterval = Math.min(intervalMs * (1 + i * 0.1), 2000);
    await wait(currentInterval);
  }
  
  return undefined;
}

export function isAlbedoAvailableSync(): boolean {
  if (typeof window === "undefined") return false;
  const albedo = (window as any).albedo;
  return albedo && typeof albedo === 'object' && 
         (typeof albedo.publicKey === 'function' || typeof albedo.intent === 'function');
}

export function isAlbedoWebWalletAccessible(): boolean {
  if (typeof window === "undefined") return false;
  // Albedo é sempre "acessível" como carteira web - não precisa instalação
  // Apenas verifica se não estamos em um ambiente que bloqueia popups
  try {
    // Teste simples para verificar se popups são permitidos
    return !window.navigator.userAgent.includes('jsdom'); // Não é ambiente de teste
  } catch {
    return true; // Por padrão, assumir que está disponível
  }
}

export async function isAlbedoAvailable(): Promise<boolean> {
  try {
    const g = await getInjectedAlbedo(10, 200); // Verificação mais rápida
    return Boolean(g && (typeof g.publicKey === 'function' || typeof g.intent === 'function'));
  } catch {
    return false;
  }
}

// Função para tentar conectar diretamente com a carteira web
async function tryDirectWebConnection(network: string): Promise<string> {
  // Tentar abrir a carteira Albedo diretamente via URL
  const albedoUrl = `https://albedo.link/intent?intent=public_key&network=${network === "testnet" ? "testnet" : "public"}&return_url=${encodeURIComponent(window.location.origin)}`;
  
  return new Promise((resolve, reject) => {
    // Abrir popup da Albedo
    const popup = window.open(albedoUrl, 'albedo', 'width=400,height=600,scrollbars=yes,resizable=yes');
    
    if (!popup) {
      reject(new Error("Popup bloqueado. Permita popups para albedo.link e tente novamente."));
      return;
    }

    const timeout = setTimeout(() => {
      popup.close();
      reject(new Error("Timeout na conexão. Tente novamente."));
    }, 60000); // 1 minuto para o usuário interagir

    // Escutar mensagens do popup
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== 'https://albedo.link') return;
      
      clearTimeout(timeout);
      window.removeEventListener('message', messageHandler);
      popup.close();
      
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else if (event.data.pubkey) {
        resolve(event.data.pubkey);
      } else {
        reject(new Error("Resposta inválida da carteira Albedo"));
      }
    };

    window.addEventListener('message', messageHandler);

    // Verificar se popup foi fechado manualmente
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        clearTimeout(timeout);
        window.removeEventListener('message', messageHandler);
        reject(new Error("Conexão cancelada pelo usuário."));
      }
    }, 1000);
  });
}

export async function getAlbedoPublicKey(network: string = "testnet"): Promise<string> {
  try {
    // Primeiro, tentar carregar o script da Albedo
    await loadAlbedoScript();
    
    const g = await getInjectedAlbedo();
    if (!g) {
      // Se o script não carregou, tentar conexão direta
      console.info("Script não disponível, tentando conexão direta com a carteira web...");
      return await tryDirectWebConnection(network);
    }

    // Verificar se a API está funcional
    if (typeof g.publicKey !== "function" && typeof g.intent !== "function") {
      throw new Error("API da Albedo não está funcional. Tente recarregar a página.");
    }

    let lastError: Error | null = null;

    // Primeira tentativa: API padrão albedo.publicKey()
    // Albedo como carteira web usa popups para autenticação
    if (typeof g.publicKey === "function") {
      try {
        const r = await Promise.race([
          g.publicKey({ 
            network: network === "testnet" ? "testnet" : "public",
            // Configurações específicas para carteira web
            submit: true // Força o popup de autenticação
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout na requisição")), 30000) // Timeout maior para interação do usuário
          )
        ]);
        
        // Respostas da Albedo: { pubkey: string }
        const pk = r?.pubkey ?? r?.public_key ?? r?.publicKey ?? r?.address;
        if (typeof pk === "string" && pk.length > 0) {
          return pk;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn("Falha na tentativa publicKey:", error);
      }
    }

    // Segunda tentativa: API de intents genéricos (método alternativo)
    if (typeof g.intent === "function") {
      try {
        const r = await Promise.race([
          g.intent("public_key", { 
            network: network === "testnet" ? "testnet" : "public"
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout na requisição")), 30000)
          )
        ]);
        
        const pk = r?.pubkey ?? r?.public_key ?? r?.publicKey ?? r?.address;
        if (typeof pk === "string" && pk.length > 0) {
          return pk;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn("Falha na tentativa intent:", error);
      }
    }

    // Se chegou aqui, ambas as tentativas falharam
    if (lastError) {
      if (lastError.message.includes("User declined") || lastError.message.includes("denied")) {
        throw new Error("Conexão cancelada pelo usuário.");
      }
      if (lastError.message.includes("Timeout")) {
        throw new Error("Timeout na conexão. O popup da Albedo pode ter sido bloqueado.");
      }
      if (lastError.message.includes("popup")) {
        throw new Error("Popup bloqueado. Permita popups para https://albedo.link e tente novamente.");
      }
      
      // Tentar fallback direto como última opção
      console.info("API com script falhou, tentando conexão direta...");
      try {
        return await tryDirectWebConnection(network);
      } catch (fallbackError) {
        throw new Error(`Falha na comunicação com a Albedo: ${lastError.message}`);
      }
    }

    throw new Error("Não foi possível obter a chave pública da Albedo. Verifique se os popups estão habilitados.");
  } catch (error) {
    if (error instanceof Error) {
      // Se é um erro conhecido, propagar
      if (error.message.includes("ALBEDO_NOT_AVAILABLE")) {
        // Tentar conexão direta como último recurso
        try {
          console.info("Tentando conexão direta como último recurso...");
          return await tryDirectWebConnection(network);
        } catch (fallbackError) {
          throw new Error("ALBEDO_NOT_AVAILABLE");
        }
      }
      throw error;
    }
    throw new Error("Erro inesperado ao conectar com a Albedo.");
  }
}
