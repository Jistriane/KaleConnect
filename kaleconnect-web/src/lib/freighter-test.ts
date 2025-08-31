// Função específica para testar a detecção do Freighter
export async function testFreighterDetection(): Promise<void> {
  console.group('🔧 TESTE COMPLETO DE DETECÇÃO DO FREIGHTER');
  
  const win = window as any;
  
  console.log('1️⃣ Verificações básicas:');
  console.log('  window.freighterApi:', !!win.freighterApi);
  console.log('  window.freighter:', !!win.freighter);
  console.log('  window.window.freighterApi:', !!win.window?.freighterApi);
  console.log('  window.stellar.freighter:', !!win.stellar?.freighter);
  
  console.log('2️⃣ Verificações DOM:');
  console.log('  script[src*="freighter"]:', !!document.querySelector('script[src*="freighter"]'));
  console.log('  meta[name*="freighter"]:', !!document.querySelector('meta[name*="freighter"]'));
  console.log('  [data-freighter]:', !!document.querySelector('[data-freighter]'));
  console.log('  #freighter-provider:', !!document.querySelector('#freighter-provider'));
  console.log('  chrome-extension script:', !!document.querySelector('script[src*="chrome-extension"][src*="freighter"]'));
  
  console.log('3️⃣ Tentando import do módulo NPM:');
  try {
    const mod: any = await import("@stellar/freighter-api");
    console.log('  Módulo carregado:', !!mod);
    console.log('  getPublicKey disponível:', typeof mod?.getPublicKey);
    console.log('  isInstalled disponível:', typeof mod?.isInstalled);
    console.log('  requestAccess disponível:', typeof mod?.requestAccess);
    
    if (mod?.isInstalled && typeof mod.isInstalled === 'function') {
      try {
        const installed = await mod.isInstalled();
        console.log('  isInstalled() result:', installed);
      } catch (e) {
        console.log('  isInstalled() error:', e);
      }
    }
  } catch (e) {
    console.log('  Erro ao importar módulo:', e);
  }
  
  console.log('4️⃣ Verificando APIs injetadas:');
  const apis = [win.freighterApi, win.freighter, win.stellar?.freighter].filter(Boolean);
  apis.forEach((api, index) => {
    console.log(`  API ${index + 1}:`, {
      exists: !!api,
      keys: api ? Object.keys(api) : [],
      getPublicKey: typeof api?.getPublicKey,
      requestAccess: typeof api?.requestAccess,
      isConnected: typeof api?.isConnected
    });
  });
  
  console.log('5️⃣ Verificando extensões do Chrome:');
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('  Chrome runtime disponível:', !!chrome.runtime);
    console.log('  Chrome extension ID check...');
  } else {
    console.log('  Chrome runtime não disponível');
  }
  
  console.log('6️⃣ Verificando eventos e listeners:');
  try {
    const eventTypes = ['freighter-ready', 'stellar-ready', 'DOMContentLoaded'];
    eventTypes.forEach(type => {
      window.dispatchEvent(new Event(type));
      console.log(`  Disparado evento: ${type}`);
    });
  } catch (e) {
    console.log('  Erro ao disparar eventos:', e);
  }
  
  console.groupEnd();
  
  // Usar nossa função de detecção
  const { isFreighterAvailable, connectFreighterSimple } = await import('./freighter-simple');
  console.log('🎯 Resultado da nossa detecção:', isFreighterAvailable());
  
  // Tentar conectar
  console.log('🔗 Tentando conectar...');
  const result = await connectFreighterSimple();
  console.log('📊 Resultado da conexão:', result ? `Sucesso: ${result.slice(0, 8)}...` : 'Falhou');
}

// Adicionar ao console global
if (typeof window !== 'undefined') {
  (window as any).testFreighterDetection = testFreighterDetection;
  console.log('🔧 Função de teste adicionada: testFreighterDetection()');
}
