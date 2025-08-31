// Versão simplificada da detecção do Freighter - sem loops ou logs excessivos

// Função para forçar recarga da detecção
export async function forceFreighterDetection(): Promise<boolean> {
  // Aguardar um pouco para extensões carregarem
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Tentar disparar evento de carregamento da extensão
  try {
    window.dispatchEvent(new Event('freighter-ready'));
    window.dispatchEvent(new Event('stellar-ready'));
  } catch {
    // Ignorar se falhar
  }
  
  // Verificar novamente
  return isFreighterAvailable();
}

export function isFreighterAvailable(): boolean {
  if (typeof window === "undefined") return false;
  
  const win = window as any;
  
  // Verificações múltiplas e agressivas
  const checks = [
    // APIs diretas
    () => !!win?.freighterApi,
    () => !!win?.freighter,
    () => !!win?.window?.freighterApi,
    () => !!win?.stellar?.freighter,
    
    // Verificações DOM
    () => !!document.querySelector('script[src*="freighter"]'),
    () => !!document.querySelector('meta[name*="freighter"]'),
    () => !!document.querySelector('[data-freighter]'),
    () => !!document.querySelector('#freighter-provider'),
    
    // Verificações de extensão Chrome específicas
    () => !!document.querySelector('script[src*="chrome-extension"][src*="freighter"]'),
    () => !!document.getElementById('freighter-content-script'),
    
    // Verificar se há propriedades específicas do Freighter
    () => {
      try {
        return typeof win?.freighterApi?.getPublicKey === 'function';
      } catch { return false; }
    },
    
    // Verificar eventos do Freighter
    () => {
      try {
        return win?.freighterApi && Object.keys(win.freighterApi).length > 0;
      } catch { return false; }
    }
  ];
  
  // Se qualquer verificação retornar true, considerar instalado
  const isInstalled = checks.some(check => {
    try {
      return check();
    } catch {
      return false;
    }
  });
  
  console.log('🔍 Freighter detection result:', isInstalled);
  return isInstalled;
}

export async function connectFreighterSimple(): Promise<string | null> {
  console.log('🔗 Tentando conectar ao Freighter...');
  
  // Estratégia otimizada: menos tentativas, mais focada no módulo NPM que já está funcionando
  const maxAttempts = 6; // Reduzido de 12 para 6
  const interval = 500;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`🔄 Tentativa ${attempt + 1}/${maxAttempts}`);
    
    try {
      // Estratégia 1: Verificar se Freighter está instalado via módulo NPM
      console.log('📦 Testando módulo NPM...');
      try {
        const mod: any = await import("@stellar/freighter-api");
        console.log('📦 Módulo importado:', {
          exists: !!mod,
          getPublicKey: typeof mod?.getPublicKey,
          requestAccess: typeof mod?.requestAccess,
          isInstalled: typeof mod?.isInstalled,
          isConnected: typeof mod?.isConnected,
          allMethods: Object.keys(mod || {})
        });
        
        // Primeiro verificar se está instalado
        if (mod?.isInstalled && typeof mod.isInstalled === "function") {
          try {
            const installed = await mod.isInstalled();
            console.log('🔍 Freighter instalado:', installed);
            if (!installed) {
              console.warn('⚠️ Freighter não está instalado segundo módulo NPM');
              throw new Error('Não instalado');
            }
          } catch (e) {
            console.warn('⚠️ Erro ao verificar instalação:', e);
          }
        }
        
        // Tentar requestAccess primeiro para ativar a API
        if (mod?.requestAccess && typeof mod.requestAccess === "function") {
          try {
            console.log('🔐 Executando requestAccess...');
            await mod.requestAccess();
            console.log('✅ requestAccess executado com sucesso');
          } catch (e) {
            console.warn('⚠️ requestAccess falhou:', e);
          }
        }
        
        // Verificar se getPublicKey está disponível no módulo
        if (mod?.getPublicKey && typeof mod.getPublicKey === "function") {
          try {
            console.log('🗝️ Tentando getPublicKey (módulo NPM)...');
            
            // Tentar com diferentes parâmetros
            let pk;
            try {
              pk = await mod.getPublicKey({ network: "TESTNET" });
            } catch {
              try {
                pk = await mod.getPublicKey();
              } catch {
                // Aguardar um pouco e tentar novamente
                await new Promise(resolve => setTimeout(resolve, 1000));
                pk = await mod.getPublicKey();
              }
            }
            
            if (typeof pk === "string" && pk.length > 0) {
              console.log('✅ Conectado via módulo NPM');
              return pk;
            }
          } catch (e) {
            console.warn('⚠️ getPublicKey (módulo NPM) falhou:', e);
          }
        } else {
          console.log('⚠️ getPublicKey não disponível no módulo, tentando importação alternativa...');
          
          // Estratégia alternativa: importar getPublicKey específico
          try {
            const { getPublicKey } = await import("@stellar/freighter-api");
            if (typeof getPublicKey === "function") {
              console.log('🗝️ Tentando getPublicKey (importação direta)...');
              
              let pk;
              try {
                pk = await getPublicKey({ network: "TESTNET" });
              } catch {
                pk = await getPublicKey();
              }
              
              if (typeof pk === "string" && pk.length > 0) {
                console.log('✅ Conectado via importação direta');
                return pk;
              }
            }
          } catch (e) {
            console.log('ℹ️ Importação direta falhou:', e);
          }
        }
      } catch (e) {
        console.warn('⚠️ Falha no módulo NPM:', e);
      }
      
      // Estratégia 2: API injetada (aguardar injeção da extensão)
      console.log('🌐 Testando API injetada...');
      const win = window as any;
      
      // Aguardar um pouco mais para extensão injetar API nas primeiras tentativas
      if (attempt < 5) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const api = win?.freighterApi || win?.freighter || win?.stellar?.freighter;
      
      console.log('🌐 APIs encontradas:', {
        freighterApi: !!win?.freighterApi,
        freighter: !!win?.freighter,
        stellarFreighter: !!win?.stellar?.freighter,
        selectedApi: !!api,
        windowKeys: Object.keys(win).filter(k => k.toLowerCase().includes('freighter')),
        allExtensions: Object.keys(win).filter(k => k.toLowerCase().includes('stellar') || k.toLowerCase().includes('freighter'))
      });
      
      if (api && typeof api === 'object') {
        console.log('🌐 Propriedades da API:', Object.keys(api));
        console.log('🌐 Tipos das funções:', {
          getPublicKey: typeof api.getPublicKey,
          requestAccess: typeof api.requestAccess,
          isConnected: typeof api.isConnected,
          signTransaction: typeof api.signTransaction
        });
        
        // Tentar requestAccess se disponível
        if (api.requestAccess && typeof api.requestAccess === "function") {
          try {
            console.log('🔐 Executando requestAccess (API injetada)...');
            await api.requestAccess();
            console.log('✅ requestAccess (API injetada) executado');
            
            // Aguardar um pouco para a API se estabilizar após requestAccess
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar se API foi atualizada após requestAccess
            const updatedApi = (window as any)?.freighterApi || (window as any)?.freighter || api;
            if (updatedApi && updatedApi !== api) {
              console.log('🔄 API atualizada após requestAccess');
              Object.assign(api, updatedApi);
            }
          } catch (e) {
            console.warn('⚠️ requestAccess (API injetada) falhou:', e);
          }
        }
        
        // Tentar obter chave pública com múltiplas estratégias
        try {
          console.log('🗝️ Tentando getPublicKey (API injetada)...');
          let pk;
          
          // Estratégia 1: Função getPublicKey direta
          if (api.getPublicKey && typeof api.getPublicKey === "function") {
            try {
              pk = await api.getPublicKey({ network: "TESTNET" });
            } catch {
              pk = await api.getPublicKey();
            }
          }
          
          if (typeof pk === "string" && pk.length > 0) {
            console.log('✅ Conectado via API injetada');
            return pk;
          } else {
            console.log('ℹ️ API injetada presente mas getPublicKey não disponível ou retornou valor inválido');
          }
        } catch (e) {
          console.log('ℹ️ Tentativa de getPublicKey (API injetada) não funcionou:', e);
        }
      } else {
        console.log('ℹ️ API injetada não encontrada nesta tentativa - continuando...');
        
        // Tentar disparar eventos para ativar a extensão
        try {
          window.dispatchEvent(new Event('freighter-ready'));
          window.dispatchEvent(new Event('stellar-ready'));
          window.dispatchEvent(new CustomEvent('freighter-connect'));
        } catch (e) {
          console.log('ℹ️ Erro ao disparar eventos:', e);
        }
      }
      
      // Estratégia 3: Aguardar carregamento da extensão via eventos DOM
      if (attempt < 3) {
        console.log('🔄 Aguardando carregamento da extensão...');
        await new Promise(resolve => {
          const timer = setTimeout(resolve, 1000);
          
          const checkExtension = () => {
            const newApi = (window as any)?.freighterApi;
            if (newApi && typeof newApi.getPublicKey === 'function') {
              clearTimeout(timer);
              resolve(undefined);
            }
          };
          
          // Verificar a cada 100ms
          const checker = setInterval(checkExtension, 100);
          setTimeout(() => clearInterval(checker), 1000);
        });
      }
      
    } catch (e) {
      console.warn(`⚠️ Tentativa ${attempt + 1} falhou:`, e);
    }
    
    // Aguardar antes da próxima tentativa
    if (attempt < maxAttempts - 1) {
      console.log(`⏱️ Aguardando ${interval}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  console.error('❌ Não foi possível conectar ao Freighter após várias tentativas');
  return null;
}

export async function checkFreighterConnectionSimple(): Promise<boolean> {
  if (!isFreighterAvailable()) {
    return false;
  }
  
  try {
    const mod: any = await import("@stellar/freighter-api");
    if (mod?.isConnected) {
      const connected = await mod.isConnected();
      return Boolean(connected);
    }
  } catch {
    // Tentar API injetada
  }
  
  const win = window as any;
  const api = win?.freighterApi || win?.freighter;
  
  if (api?.isConnected && typeof api.isConnected === "function") {
    try {
      const connected = await api.isConnected();
      return Boolean(connected);
    } catch {
      // Falhou
    }
  }
  
  return false;
}
