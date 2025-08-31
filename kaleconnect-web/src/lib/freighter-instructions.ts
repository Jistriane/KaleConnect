// Instruções para configuração do Freighter

export const freighterInstructions = {
  pt: {
    title: "Como configurar o Freighter",
    steps: [
      "1. Instale a extensão Freighter no seu navegador",
      "2. Abra a extensão e crie ou importe uma carteira",
      "3. Certifique-se de que está conectado à rede Testnet",
      "4. Desbloqueie a carteira com sua senha",
      "5. Recarregue esta página e tente conectar novamente"
    ],
    downloadLink: "https://freighter.app/",
    troubleshooting: [
      "✅ Verifique se a extensão está instalada e ativa",
      "✅ Confirme que a carteira está desbloqueada",
      "✅ Verifique se está na rede Testnet",
      "✅ Tente recarregar a página",
      "✅ Desabilite outras extensões de carteira temporariamente"
    ]
  },
  en: {
    title: "How to setup Freighter",
    steps: [
      "1. Install the Freighter extension in your browser",
      "2. Open the extension and create or import a wallet",
      "3. Make sure you're connected to Testnet",
      "4. Unlock the wallet with your password",
      "5. Reload this page and try connecting again"
    ],
    downloadLink: "https://freighter.app/",
    troubleshooting: [
      "✅ Check if the extension is installed and active",
      "✅ Confirm the wallet is unlocked",
      "✅ Verify you're on Testnet",
      "✅ Try reloading the page",
      "✅ Temporarily disable other wallet extensions"
    ]
  }
};

export function showFreighterInstructions(lang: 'pt' | 'en' = 'pt'): void {
  const instructions = freighterInstructions[lang];
  
  console.group(`📋 ${instructions.title}`);
  
  console.log('🔗 Download:', instructions.downloadLink);
  console.log('');
  
  console.log('📝 Passos para configuração:');
  instructions.steps.forEach(step => console.log(step));
  console.log('');
  
  console.log('🔧 Solução de problemas:');
  instructions.troubleshooting.forEach(tip => console.log(tip));
  
  console.groupEnd();
}

// Função para detectar problemas comuns
export function diagnoseFreighterIssues(): void {
  console.group('🔍 Diagnóstico do Freighter');
  
  const win = window as any;
  
  // Verificar se está instalado
  const hasExtension = !!(win.freighterApi || win.freighter);
  console.log('📦 Extensão instalada:', hasExtension ? '✅ Sim' : '❌ Não');
  
  if (!hasExtension) {
    console.log('💡 Solução: Instale a extensão Freighter de https://freighter.app/');
    console.groupEnd();
    return;
  }
  
  // Verificar se a API está disponível
  const api = win.freighterApi || win.freighter;
  console.log('🔌 API disponível:', !!api ? '✅ Sim' : '❌ Não');
  
  if (api) {
    console.log('🛠️ Métodos disponíveis:', Object.keys(api));
    
    // Verificar métodos específicos
    const methods = ['getPublicKey', 'isConnected', 'requestAccess', 'signTransaction'];
    methods.forEach(method => {
      const available = typeof api[method] === 'function';
      console.log(`  - ${method}:`, available ? '✅' : '❌');
    });
  }
  
  console.groupEnd();
}

// Adicionar ao console global
if (typeof window !== 'undefined') {
  (window as any).freighterHelp = () => showFreighterInstructions();
  (window as any).diagnoseFreighter = diagnoseFreighterIssues;
  console.log('🆘 Ajuda disponível: freighterHelp(), diagnoseFreighter()');
}
