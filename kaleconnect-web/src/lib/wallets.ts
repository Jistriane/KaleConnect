"use client";

// Detecção de carteiras disponíveis no navegador

// Utilitário de detecção de extensões de carteiras no navegador

export type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
  isPhantom?: boolean; // Phantom EVM
};

export type PhantomSolanaProvider = {
  isPhantom?: boolean;
  connect?: () => Promise<unknown>;
  publicKey?: { toString(): string };
};

export type WalletDetections = {
  freighter: boolean;
  metamask: boolean;
  coinbase: boolean;
  brave: boolean;
  phantomSolana: boolean;
  phantomEvm: boolean;
};

export function getEthereumProvider(): Eip1193Provider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
}

// xBull: detecção rápida síncrona (injeção no window)

export function getMetaMaskProvider(): Eip1193Provider | undefined {
  const eth = getEthereumProvider();
  return eth && eth.isMetaMask ? eth : undefined;
}

export function getCoinbaseProvider(): Eip1193Provider | undefined {
  const eth = getEthereumProvider();
  return eth && (eth as Eip1193Provider).isCoinbaseWallet ? eth : undefined;
}

export function getBraveProvider(): Eip1193Provider | undefined {
  const eth = getEthereumProvider();
  return eth && (eth as Eip1193Provider).isBraveWallet ? eth : undefined;
}

export function getPhantomEvmProvider(): Eip1193Provider | undefined {
  const eth = getEthereumProvider();
  return eth && (eth as Eip1193Provider).isPhantom ? eth : undefined;
}

export function getPhantomSolanaProvider(): PhantomSolanaProvider | undefined {
  if (typeof window === "undefined") return undefined;
  const p = (window as unknown as { phantom?: { solana?: PhantomSolanaProvider } }).phantom;
  const sol = p?.solana;
  return sol && sol.isPhantom ? sol : undefined;
}

export function isFreighterAvailable(): boolean {
  if (typeof window === "undefined") return false;
  
  const anyWin = window as any;
  
  // Verificar múltiplas formas de detecção da Freighter
  const hasFreighterApi = anyWin?.freighterApi;
  const hasFreighter = anyWin?.freighter;
  const hasFreighterWindow = anyWin?.window?.freighterApi;
  
  // Verificar se há elementos DOM indicando a extensão
  const hasFreighterScript = document.querySelector('script[src*="freighter"]') !== null;
  const hasFreighterMeta = document.querySelector('meta[name*="freighter"]') !== null;
  
  return !!(hasFreighterApi || hasFreighter || hasFreighterWindow || hasFreighterScript || hasFreighterMeta);
}

export function detectAllWallets(): WalletDetections {
  return {
    freighter: isFreighterAvailable(),
    metamask: !!getMetaMaskProvider(),
    coinbase: !!getCoinbaseProvider(),
    brave: !!getBraveProvider(),
    phantomSolana: !!getPhantomSolanaProvider(),
    phantomEvm: !!getPhantomEvmProvider(),
  };
}
