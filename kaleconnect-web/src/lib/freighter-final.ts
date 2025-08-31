"use client";

// SOLUÇÃO FINAL BASEADA NO PADRÃO QUE FUNCIONA NO freighter.ts

export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const anyWin: any = window as any;
  
  // Verificar se a API está injetada (mais simples)
  const api = anyWin?.freighterApi || anyWin?.freighter;
  const hasApi = !!(api && typeof api === 'object');
  
  // Verificar se há indicações DOM da extensão
  const hasScript = document.querySelector('script[src*="freighter"]') !== null;
  const hasMeta = document.querySelector('meta[name*="freighter"]') !== null;
  
  // Retornar true se há qualquer indicação da extensão
  return hasApi || hasScript || hasMeta;
}

export async function connectFreighterFinal(): Promise<string | null> {
  console.log('🎯 Conectando usando padrão TESTADO que FUNCIONA...');
  
  try {
    // USAR EXATAMENTE O MESMO PADRÃO DO freighter.ts QUE FUNCIONA
    const mod: any = await import("@stellar/freighter-api");
    
    console.log('📦 Módulo importado com sucesso:', {
      hasGetPublicKey: typeof mod?.getPublicKey,
      hasRequestAccess: typeof mod?.requestAccess,
      hasIsInstalled: typeof mod?.isInstalled,
      hasIsConnected: typeof mod?.isConnected,
      moduleKeys: Object.keys(mod || {}),
      moduleDefault: typeof mod?.default,
      defaultKeys: mod?.default ? Object.keys(mod.default) : 'N/A'
    });
    
    // IMPRIMIR TODAS AS CHAVES PARA DESCOBRIR ONDE ESTÁ O getPublicKey
    console.log('🔍 TODAS AS CHAVES DO MÓDULO:');
    Object.keys(mod || {}).forEach(key => {
      console.log(`  - ${key}: ${typeof mod[key]}`);
    });
    
    if (mod?.default) {
      console.log('🔍 TODAS AS CHAVES DO DEFAULT:');
      Object.keys(mod.default).forEach(key => {
        console.log(`  - default.${key}: ${typeof mod.default[key]}`);
      });
    }
    
    // Verificar se está instalado (opcional)
    if (mod?.isInstalled && typeof mod.isInstalled === 'function') {
      const installed = await mod.isInstalled();
      console.log('🔍 Freighter instalado:', installed);
      if (!installed) {
        throw new Error("Freighter não está instalado");
      }
    }
    
    // Executar requestAccess se necessário
    if (mod?.requestAccess && typeof mod.requestAccess === 'function') {
      console.log('🔐 Executando requestAccess...');
      await mod.requestAccess();
      console.log('✅ requestAccess executado com sucesso');
      
      // Aguardar um pouco para API se estabilizar
      console.log('⏳ Aguardando API se estabilizar...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Obter chave pública - com debug detalhado
    console.log('🔍 Verificando getPublicKey...');
    
    // USAR getAddress EM VEZ DE getPublicKey - ESSA É A FUNÇÃO CORRETA!
    const getAddressFn = mod?.getAddress || mod?.default?.getAddress;
    
    console.log('🔍 getAddress encontrado:', typeof getAddressFn);
    
    if (getAddressFn && typeof getAddressFn === "function") {
      try {
        console.log('🗝️ Tentando getAddress...');
        const result = await getAddressFn();
        console.log('🗝️ Resultado getAddress:', result);
        
        // getAddress retorna um objeto {address: 'G...'} 
        const address = typeof result === "object" && result?.address ? result.address : result;
        
        console.log('🗝️ Endereço extraído:', address);
        
        if (typeof address === "string" && address.length > 0) {
          console.log('✅ Freighter conectado com sucesso via getAddress!');
          return address;
        }
      } catch (e) {
        console.log('⚠️ Erro com getAddress:', e);
      }
    } else {
      console.log('❌ getAddress não é uma função ou não existe');
    }
    
    // Fallback: tentar getPublicKey também (caso exista em versões diferentes)
    const getPublicKeyFn = mod?.getPublicKey || mod?.default?.getPublicKey;
    
    if (getPublicKeyFn && typeof getPublicKeyFn === "function") {
      try {
        console.log('🗝️ Fallback: tentando getPublicKey...');
        const pk = await getPublicKeyFn();
        console.log('🗝️ Resultado getPublicKey:', pk);
        
        if (typeof pk === "string" && pk.length > 0) {
          console.log('✅ Freighter conectado via getPublicKey fallback!');
          return pk;
        }
      } catch (e) {
        console.log('⚠️ Erro com getPublicKey fallback:', e);
      }
    }
    
    console.warn('⚠️ getPublicKey não retornou chave válida');
    return null;
    
  } catch (error) {
    console.error('❌ Erro ao conectar Freighter:', error);
    return null;
  }
}

export async function checkFreighterConnected(): Promise<boolean> {
  try {
    // USAR EXATAMENTE O MESMO PADRÃO DO freighter.ts
    const mod: any = await import("@stellar/freighter-api");
    const fn = mod?.isConnected ?? mod?.default?.isConnected;
    if (typeof fn === "function") {
      const result = await fn();
      // Algumas versões retornam objeto { isConnected: boolean }
      if (typeof result === "object" && result !== null && "isConnected" in result) {
        return Boolean((result as any).isConnected);
      }
      return Boolean(result);
    }
  } catch {
    // Fallback para API injetada como no freighter.ts original
  }
  
  // Fallback para API injetada
  const anyWin: any = window as any;
  const api = anyWin?.freighterApi || anyWin?.freighter;
  
  if (api && typeof api.isConnected === "function") {
    try {
      const r = await api.isConnected();
      if (typeof r === "object" && r !== null && "isConnected" in r) return Boolean(r.isConnected);
      return Boolean(r);
    } catch {
      // Falhou
    }
  }
  
  return false;
}
