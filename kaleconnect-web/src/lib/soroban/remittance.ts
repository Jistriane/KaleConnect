import { callContract, getContractIds } from "./client";
// Import opcional: só existe no client; evite avaliar em SSR
type DynFreighterCaller = <T = unknown>(contractId: string, method: string, args: unknown[]) => Promise<{ txHash: string; retval?: T }>;
let callContractWithFreighter: DynFreighterCaller | undefined;

// Função para importar o freighterClient de forma mais robusta
async function loadFreighterClient(): Promise<DynFreighterCaller | undefined> {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const mod = await import('./freighterClient');
    return mod.callContractWithFreighter;
  } catch (error) {
    console.warn('Não foi possível carregar freighterClient:', error);
    return undefined;
  }
}

// Inicializar o carregamento do freighterClient quando disponível
if (typeof window !== 'undefined') {
  loadFreighterClient().then((fn) => {
    if (fn) callContractWithFreighter = fn;
  }).catch(() => {
    // Silenciar erros de carregamento
  });
}

export type RemitInfo = {
  from: string;
  to: string;
  amount: number;
  status: string;
};

export async function create(from: string, to: string, amount: number): Promise<string | number | undefined> {
  const { remittance } = getContractIds();
  if (!remittance) return undefined;
  try {
    // Se estiver no browser e Freighter disponível, assinar e enviar via carteira
    if (typeof window !== 'undefined' && callContractWithFreighter) {
      const res = await callContractWithFreighter<string | number>(remittance, "create", [from, to, amount]);
      // No caminho legacy desta função, retornamos apenas o id (retval), ignorando o hash
      return res.retval;
    }
    // SSR/Server: usar client padrão (requer secret nas options em chamadas diretas)
    const id = await callContract<string | number>(remittance, "create", [from, to, amount]);
    return id;
  } catch {
    return undefined;
  }
}

export async function get(id: string | number): Promise<RemitInfo | undefined> {
  const { remittance } = getContractIds();
  if (!remittance) return undefined;
  try {
    const res = await callContract<RemitInfo>(remittance, "get", [id]);
    return res;
  } catch {
    return undefined;
  }
}

// API explícita para uso no client: garante Freighter e retorna hash
export async function createWithFreighter(from: string, to: string, amount: number): Promise<{ txHash: string; id?: string | number } | undefined> {
  const { remittance } = getContractIds();
  if (!remittance) return undefined;
  if (typeof window === 'undefined') {
    throw new Error("createWithFreighter deve ser usado no navegador");
  }
  
  // Se callContractWithFreighter não estiver carregado, tentar carregar agora
  let freighterFn = callContractWithFreighter;
  if (!freighterFn) {
    freighterFn = await loadFreighterClient();
    if (freighterFn) {
      callContractWithFreighter = freighterFn;
    }
  }
  
  if (!freighterFn) {
    throw new Error("Freighter client não disponível. Verifique se a extensão Freighter está instalada e ativa.");
  }
  
  try {
    const res = await freighterFn<string | number>(remittance, "create", [from, to, amount]);
    return { txHash: res.txHash, id: res.retval };
  } catch (error) {
    console.error('Erro ao criar remessa com Freighter:', error);
    throw error;
  }
}
