"use client";

import { useEffect, useState } from "react";
// import { addFreighterDebugToConsole } from "../lib/freighter-debug";
import "../lib/freighter-instructions"; // Importar para adicionar funções de ajuda ao console
import "../lib/freighter-test"; // Importar funções de teste
import { isFreighterInstalled, connectFreighterFinal, checkFreighterConnected } from "../lib/freighter-final";
import { detectAllWallets, getMetaMaskProvider } from "../lib/wallets";

type Props = { label?: string };

type ConnectionStatus = 'idle' | 'checking' | 'loading' | 'connected' | 'error';

export default function WalletButtons({ label = "Conectar carteiras" }: Props) {
  const [freighterAddr, setFreighterAddr] = useState<string | null>(null);
  const [metamaskAddr, setMetamaskAddr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [detected, setDetected] = useState<ReturnType<typeof detectAllWallets> | null>(null);
  const [freighterStatus, setFreighterStatus] = useState<ConnectionStatus>('idle');
  const [metamaskStatus, setMetamaskStatus] = useState<ConnectionStatus>('idle');
  const [freighterError, setFreighterError] = useState<string | null>(null);
  const [metamaskError, setMetamaskError] = useState<string | null>(null);
  const [freighterRetryCount, setFreighterRetryCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    async function initializeWallets() {
      // Detectar extensões disponíveis no navegador
      try {
        const d = detectAllWallets();
        setDetected(d);
        
        // Verificar disponibilidade da Freighter de forma assíncrona
        if (d.freighter) {
          setFreighterStatus('checking');
          try {
            // Tentar verificar conexão diretamente
            const connected = await checkFreighterConnected();
            
            if (connected) {
              setFreighterStatus('connected');
              // Se já está conectada, obter a chave pública
              const publicKey = await connectFreighterFinal();
              if (publicKey) {
                setFreighterAddr(publicKey);
              } else {
                setFreighterStatus('idle');
              }
            } else {
              setFreighterStatus('idle');
            }
          } catch {
            setFreighterStatus('idle');
          }
        } else {
          setFreighterStatus('idle');
        }
      } catch {
        setDetected(null);
      }
    }

    initializeWallets();

    // Algumas extensões injetam após o first paint — reavaliar múltiplas vezes
    const intervals = [1000, 2000, 3000, 5000]; // Verificar em 1s, 2s, 3s, 5s
    const timeouts: NodeJS.Timeout[] = [];
    
    intervals.forEach(delay => {
      const t = setTimeout(() => {
        try { 
          const d = detectAllWallets();
          setDetected(prevDetected => {
            // Só atualizar se houver mudanças
            const hasChanges = !prevDetected || 
              prevDetected.freighter !== d.freighter ||
              prevDetected.metamask !== d.metamask;
            
            if (hasChanges) {
              // Se Freighter foi detectada agora, verificar conexão
              if (d.freighter && (!prevDetected || !prevDetected.freighter)) {
                checkFreighterStatusAsync();
              }
              
              return d;
            }
            return prevDetected;
          });
        } catch (error) {
          console.warn("Erro na redetecção:", error);
        }
      }, delay);
      timeouts.push(t);
    });
    
    async function checkFreighterStatusAsync() {
      try {
        setFreighterStatus('checking');
        const connected = await checkFreighterConnected();
        
        if (connected) {
          setFreighterStatus('connected');
          try {
            const publicKey = await connectFreighterFinal();
            setFreighterAddr(publicKey);
          } catch (error) {
            console.warn('Erro ao obter chave pública da Freighter:', error);
            setFreighterStatus('idle');
          }
        } else {
          setFreighterStatus('idle');
        }
      } catch (error) {
        console.warn('Erro ao verificar status da Freighter:', error);
        setFreighterStatus('idle');
      }
    }
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

    async function connectFreighter() {
    try {
      setFreighterStatus('loading');
      setFreighterError(null);
      
      // Verificar se está instalada
      if (!isFreighterInstalled()) {
        throw new Error("Freighter não encontrada. Verifique se a extensão está instalada e ativa no Chrome.");
      }
      
      // Tentar conectar usando o método que funciona
      const pk = await connectFreighterFinal();
      if (pk) {
        setFreighterAddr(pk);
        setFreighterStatus('connected');
        setFreighterRetryCount(0); // Reset retry count on success
      } else {
        throw new Error("Freighter encontrada mas falhou na conexão. Verifique se a extensão está desbloqueada.");
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      
      // Tratamento específico para diferentes tipos de erro
      let userFriendlyMessage = "";
      
      if (errorMsg.includes("Freighter não instalada")) {
        userFriendlyMessage = "Extensão Freighter não encontrada. Baixe em https://freighter.app/";
        setFreighterStatus('idle');
        console.log('💡 Digite freighterHelp() no console para instruções completas');
      } else if (errorMsg.includes("Freighter API indisponível")) {
        userFriendlyMessage = "Freighter detectada mas inativa. Abra a extensão e desbloqueie sua carteira.";
        setFreighterStatus('error');
        console.log('🔍 Digite diagnoseFreighter() no console para diagnóstico');
      } else if (errorMsg.includes("User declined") || errorMsg.includes("denied")) {
        userFriendlyMessage = "Conexão cancelada pelo usuário.";
        setFreighterStatus('idle');
      } else if (errorMsg.includes("Timeout")) {
        userFriendlyMessage = "Timeout na conexão. Tente novamente.";
        setFreighterStatus('error');
      } else {
        userFriendlyMessage = "Erro na conexão com Freighter. Verifique se a extensão está instalada e desbloqueada.";
        setFreighterStatus('error');
      }
      
      setFreighterError(userFriendlyMessage);
      
      // Só logar erros reais, não ausência de extensão
      if (!errorMsg.includes("Freighter API indisponível")) {
        console.warn('Erro ao conectar Freighter:', e);
      }
    }
  }

  async function retryFreighter() {
    if (freighterRetryCount >= 3) {
      setFreighterError('Muitas tentativas falharam. Verifique se a extensão Freighter está instalada e desbloqueada.');
      return;
    }
    
    setFreighterRetryCount(prev => prev + 1);
    await connectFreighter();
  }

  function disconnectFreighter() {
    // Freighter não expõe API de disconnect; limpar estado local é suficiente
    setFreighterAddr(null);
    setFreighterStatus('idle');
    setFreighterError(null);
    setFreighterRetryCount(0);
  }

  type EthereumProvider = {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    isMetaMask?: boolean;
  };

  async function connectMetaMask() {
    try {
      setMetamaskStatus('loading');
      setMetamaskError(null);
      
      const eth: EthereumProvider | undefined = getMetaMaskProvider();
      if (!eth) {
        const error = "MetaMask não detectada. Instale a extensão.";
        setMetamaskError(error);
        setMetamaskStatus('error');
        return;
      }
      
      const result = await Promise.race([
        eth.request({ method: "eth_requestAccounts" }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout na conexão")), 30000)
        )
      ]);
      
      const accounts = Array.isArray(result) ? (result as unknown[]).map(String) : [];
      const address = accounts?.[0];
      
      if (!address) {
        throw new Error("Nenhuma conta encontrada");
      }
      
      setMetamaskAddr(address);
      setMetamaskStatus('connected');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMetamaskError(msg);
      setMetamaskStatus('error');
      console.error('Erro ao conectar MetaMask:', e);
    }
  }

  async function disconnectMetaMask() {
    try {
      const eth: EthereumProvider | undefined = getMetaMaskProvider();
      // Algumas carteiras suportam revogar permissões
      if (eth) {
        try {
          await eth.request({
            method: "wallet_revokePermissions",
            params: [{ eth_accounts: {} } as unknown as never],
          });
        } catch {
          // ignora se não suportado
        }
      }
    } finally {
      setMetamaskAddr(null);
      setMetamaskStatus('idle');
      setMetamaskError(null);
    }
  }

  async function redetectFreighter() {
    setFreighterStatus('checking');
    
    // Aguardar um pouco para a extensão injetar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const d = detectAllWallets();
    setDetected(d);
    
    if (d.freighter) {
      try {
        const connected = await checkFreighterConnected();
        if (connected) {
          setFreighterStatus('connected');
          const publicKey = await connectFreighterFinal();
          if (publicKey) {
            setFreighterAddr(publicKey);
          }
        } else {
          setFreighterStatus('idle');
        }
      } catch (error) {
        console.warn('Erro na verificação:', error);
        setFreighterStatus('idle');
      }
    } else {
      setFreighterStatus('idle');
      setFreighterError("Extensão Freighter não encontrada. Verifique se está instalada e recarregue a página.");
    }
  }

  function getFreighterButtonText(): string {
    if (freighterAddr) {
      return `Desconectar Freighter (${freighterAddr.slice(0, 5)}...${freighterAddr.slice(-4)})`;
    }
    
    switch (freighterStatus) {
      case 'checking':
        return "Verificando Freighter...";
      case 'loading':
        return "Conectando Freighter...";
      case 'error':
        return freighterRetryCount >= 3 ? "Freighter indisponível" : "Tentar novamente";
      default:
        return detected && !detected.freighter 
          ? "Detectar Freighter"
          : `${label} (Freighter)`;
    }
  }

  function getMetaMaskButtonText(): string {
    if (metamaskAddr) {
      return `Desconectar MetaMask (${metamaskAddr.slice(0, 6)}...${metamaskAddr.slice(-4)})`;
    }
    
    switch (metamaskStatus) {
      case 'loading':
        return "Conectando MetaMask...";
      case 'error':
        return "Tentar novamente";
      default:
        return detected && !detected.metamask 
          ? "MetaMask não detectada"
          : `${label} (MetaMask)`;
    }
  }

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 h-11">
        <button
          className={`flex-1 rounded-md border text-sm transition-all duration-200 ${
            freighterStatus === 'connected' 
              ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
              : freighterStatus === 'error'
              ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
              : freighterStatus === 'loading' || freighterStatus === 'checking'
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          } disabled:opacity-60`}
          onClick={
            freighterAddr 
              ? disconnectFreighter 
              : freighterStatus === 'error' && freighterRetryCount < 3
              ? retryFreighter
              : detected && !detected.freighter
              ? redetectFreighter
              : connectFreighter
          }
          title={freighterError ? `Erro: ${freighterError}` : "Freighter Wallet (Stellar)"}
          disabled={
            freighterStatus === 'loading' || 
            freighterStatus === 'checking' || 
            (freighterStatus === 'error' && freighterRetryCount >= 3) ||
            (!freighterAddr && detected !== null && !detected.freighter && freighterStatus !== 'error')
          }
        >
          {getFreighterButtonText()}
        </button>

        <button
          className={`flex-1 rounded-md border text-sm transition-all duration-200 ${
            metamaskStatus === 'connected' 
              ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
              : metamaskStatus === 'error'
              ? 'border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
              : metamaskStatus === 'loading'
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
          } disabled:opacity-60`}
          onClick={
            metamaskAddr 
              ? disconnectMetaMask 
              : connectMetaMask
          }
          title={metamaskError ? `Erro: ${metamaskError}` : "MetaMask (EVM)"}
          disabled={
            metamaskStatus === 'loading' || 
            (!metamaskAddr && detected !== null && !detected.metamask && metamaskStatus !== 'error')
          }
        >
          {getMetaMaskButtonText()}
        </button>
      </div>
      
      {/* Mensagens de erro */}
      {(freighterError || metamaskError) && (
        <div className="space-y-1 text-sm">
          {freighterError && (
            <div className={`flex items-center gap-2 p-2 border rounded-md ${
              freighterStatus === 'idle' && (freighterError.includes('não encontrada') || freighterError.includes('cancelada'))
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                : freighterError.includes('API indisponível')
                ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
            }`}>
              <span className={
                freighterStatus === 'idle' && (freighterError.includes('não encontrada') || freighterError.includes('cancelada'))
                  ? 'text-blue-600 dark:text-blue-400'
                  : freighterError.includes('API indisponível')
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }>
                {freighterStatus === 'idle' && (freighterError.includes('não encontrada') || freighterError.includes('cancelada'))
                  ? 'ℹ️' 
                  : freighterError.includes('API indisponível')
                  ? '⚠️'
                  : '❌'}
              </span>
              <span className={
                freighterStatus === 'idle' && (freighterError.includes('não encontrada') || freighterError.includes('cancelada'))
                  ? 'text-blue-700 dark:text-blue-300'
                  : freighterError.includes('API indisponível')
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              }>
                Freighter: {freighterError}
                {freighterRetryCount > 0 && freighterRetryCount < 3 && freighterStatus === 'error' && (
                  <span className="ml-1 text-red-500">
                    (Tentativa {freighterRetryCount}/3)
                  </span>
                )}
              </span>
            </div>
          )}
          {metamaskError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <span className="text-red-600 dark:text-red-400">⚠️</span>
              <span className="text-red-700 dark:text-red-300">
                MetaMask: {metamaskError}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
