// Debug utilities for Freighter integration

export function debugFreighterState(): void {
  if (typeof window === 'undefined') {
    console.log('🔍 Freighter Debug: Executando no servidor');
    return;
  }

  console.group('🔍 Freighter Debug State');
  
  const win = window as any;
  
  // Verificar extensão instalada
  const hasFreighterApi = !!win.freighterApi;
  const hasFreighter = !!win.freighter;
  const hasFreighterWindow = !!win.window?.freighterApi;
  
  console.log('📦 Extensão detectada:', {
    'window.freighterApi': hasFreighterApi,
    'window.freighter': hasFreighter,
    'window.window.freighterApi': hasFreighterWindow,
  });

  // Verificar scripts e metadados
  const freighterScript = document.querySelector('script[src*="freighter"]');
  const freighterMeta = document.querySelector('meta[name*="freighter"]');
  
  console.log('🔗 DOM elements:', {
    'freighter script': !!freighterScript,
    'freighter meta': !!freighterMeta,
  });

  // Verificar APIs disponíveis
  const api = win.freighterApi || win.freighter;
  if (api) {
    console.log('🛠️ APIs disponíveis:', {
      'isInstalled': typeof api.isInstalled,
      'isConnected': typeof api.isConnected,
      'getPublicKey': typeof api.getPublicKey,
      'requestAccess': typeof api.requestAccess,
      'signTransaction': typeof api.signTransaction,
    });

    console.log('📝 API object keys:', Object.keys(api));
  } else {
    console.log('❌ Nenhuma API do Freighter encontrada');
  }

  // Verificar se o módulo NPM está disponível
  import('@stellar/freighter-api').then((mod) => {
    console.log('📦 @stellar/freighter-api module:', {
      'available': true,
      'functions': Object.keys(mod),
    });
  }).catch((error) => {
    console.log('❌ @stellar/freighter-api não disponível:', error.message);
  });

  console.groupEnd();
}

export async function testFreighterConnection(): Promise<void> {
  console.group('🧪 Teste de Conexão Freighter');
  
  try {
    const { isFreighterInstalled, checkFreighterConnected, getFreighterPublicKey, waitForFreighterAPI } = await import('./freighter');
    
    console.log('1️⃣ Verificando instalação...');
    const installed = isFreighterInstalled();
    console.log('✅ Instalado:', installed);
    
    if (!installed) {
      console.log('❌ Freighter não instalado. Instale a extensão e recarregue a página.');
      console.groupEnd();
      return;
    }

    console.log('2️⃣ Aguardando API ficar disponível...');
    const apiAvailable = await waitForFreighterAPI(10000);
    console.log('✅ API disponível:', apiAvailable);
    
    if (!apiAvailable) {
      console.log('❌ API do Freighter não ficou disponível. Verifique se a extensão está ativa.');
      console.groupEnd();
      return;
    }

    console.log('3️⃣ Verificando conexão...');
    const connected = await checkFreighterConnected();
    console.log('✅ Conectado:', connected);

    if (!connected) {
      console.log('⚠️ Freighter não conectado. Desbloqueie a carteira.');
    }

    console.log('4️⃣ Tentando obter chave pública...');
    try {
      const publicKey = await getFreighterPublicKey();
      console.log('✅ Chave pública obtida:', `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`);
    } catch (error) {
      console.log('❌ Erro ao obter chave pública:', error);
    }

  } catch (error) {
    console.log('❌ Erro durante teste:', error);
  }
  
  console.groupEnd();
}

// Função para adicionar ao console global para debug
export function addFreighterDebugToConsole(): void {
  if (typeof window !== 'undefined') {
    (window as any).debugFreighter = debugFreighterState;
    (window as any).testFreighter = testFreighterConnection;
    console.log('🔧 Debug functions added to window: debugFreighter(), testFreighter()');
  }
}
