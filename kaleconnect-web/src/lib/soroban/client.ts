/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal scaffolding for Soroban integration without external deps.
// Later, replace fetch calls with real Soroban RPC invocations.

export type NetworkConfig = {
  rpcUrl: string
  networkPassphrase: string
}

export type ContractIds = {
  remittance?: string
  kycRegistry?: string
  ratesOracle?: string
}

export function getNetwork(): NetworkConfig {
  return {
    rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC || "",
    networkPassphrase:
      process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || "",
  }
}

export function getContractIds(): ContractIds {
  return {
    remittance: process.env.NEXT_PUBLIC_CONTRACT_ID_REMITTANCE,
    kycRegistry: process.env.NEXT_PUBLIC_CONTRACT_ID_KYC,
    ratesOracle: process.env.NEXT_PUBLIC_CONTRACT_ID_RATES,
  }
}

export type CallOptions = {
  mode?: 'simulate' | 'send'
  // Para 'send', forneça a chave secreta de quem assina ou integre com Freighter.
  sourceSecret?: string
}

// Implementação com dynamic import. Requer @stellar/stellar-sdk e soroban-rpc instalados
export async function callContract<T = unknown>(
  contractId: string,
  method: string,
  args: unknown[],
  options: CallOptions = { mode: 'simulate' }
): Promise<T> {
  const { rpcUrl, networkPassphrase } = getNetwork()
  if (!rpcUrl || !networkPassphrase) {
    throw new Error('Config Soroban ausente: defina NEXT_PUBLIC_SOROBAN_RPC e NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE')
  }

  // Dynamic imports para não quebrar build quando deps não estão instaladas
  // Usamos Function para evitar checagem estática de módulos pelo TypeScript
  const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<unknown>
  let stellar: unknown
  let sorobanRpc: unknown
  try {
    stellar = await dynamicImport('@stellar/stellar-sdk')
    sorobanRpc = await dynamicImport('soroban-rpc')
  } catch {
    throw new Error('Dependências Soroban ausentes. Instale @stellar/stellar-sdk e soroban-rpc')
  }

  const { SorobanRpc } = sorobanRpc as { SorobanRpc: any }
  const server = new SorobanRpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') })

  // Helpers mínimos para SCVals
  const s = stellar as any
  const scv = s.ScVal
  const toSymbol = (s: string) => scv.forSymbol(s)
  const toI128 = (n: number | string | bigint) => {
    const bi = BigInt(n)
    return scv.forI128(s.xdr.Int128Parts.new(s.scInt.toI128High(bi), s.scInt.toI128Low(bi)))
  }
  const toAddress = (addr: string) => scv.forAddress(s.Address.fromString(addr))

  // Mapeia argumentos JS -> SCVal heurístico simples
  const mapArg = (a: unknown) => {
    if (typeof a === 'string') {
      // Heurística: normaliza pares como "XLM:BRL" -> "xlm_brl" para Symbol válido no Soroban
      if (a.includes(':')) {
        const normalized = a.toLowerCase().replace(/[^a-z0-9:]/g, '').replace(':', '_')
        return toSymbol(normalized)
      }
      if (/^[A-Z0-9]{56}$/.test(a)) return toAddress(a)
      return scv.forString(a)
    }
    if (typeof a === 'number') return toI128(a)
    if (typeof a === 'bigint') return toI128(a)
    if (typeof a === 'boolean') return scv.forBool(a)
    // fallback
    return scv.forString(JSON.stringify(a))
  }

  const scArgs = args.map(mapArg)

  // Prepara invocação
  const contract = new (s as any).Contract(contractId)
  const mode = options.mode ?? 'simulate'

  if (mode === 'simulate') {
    // Para simular precisamos de uma conta fonte com sequence; exigimos secret ou conta existente
    const sourceSecret = options.sourceSecret
    if (!sourceSecret) {
      throw new Error('Para simulate, forneça options.sourceSecret de uma conta existente para obter sequence.')
    }
    const kp = s.Keypair.fromSecret(sourceSecret)
    const source = await server.getAccount(kp.publicKey())
    let tx = new s.TransactionBuilder(source, {
      fee: String(s.BASE_FEE),
      networkPassphrase,
    })
      .addOperation(contract.call(method, ...scArgs))
      .setTimeout(30)
      .build()
    tx = await server.prepareTransaction(tx)

    const sim = await server.simulateTransaction(tx)
    if ((sorobanRpc as any).Api.isSimulationError(sim)) {
      throw new Error(`Simulação falhou: ${JSON.stringify(sim)}`)
    }
    // Decodifica retorno (assumimos 1 retorno)
    const res = sim.result?.retval
    if (!res) throw new Error('Sem retorno do contrato (retval vazio)')
    // Tentativa simples de conversão
    return (s as any).scValToNative(res) as T
  }

  // SEND: enviar transação on-chain
  const sourceSecret = options.sourceSecret
  if (!sourceSecret) {
    throw new Error('Para send, forneça options.sourceSecret ou integre com Freighter para assinar.')
  }
  const kp = s.Keypair.fromSecret(sourceSecret)
  const source = await server.getAccount(kp.publicKey())
  let tx = new s.TransactionBuilder(source, {
    fee: String(s.BASE_FEE),
    networkPassphrase,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(30)
    .build()
  tx = await server.prepareTransaction(tx)
  tx.sign(kp)
  const sent = await server.sendTransaction(tx)
  if (sent.errorResult) {
    throw new Error(`Envio falhou: ${JSON.stringify(sent)}`)
  }
  // Aguarda confirmação
  const hash = sent.hash
  let status = await server.getTransaction(hash)
  const start = Date.now()
  while (status.status === (sorobanRpc as any).Api.GetTransactionStatus.NOT_FOUND) {
    if (Date.now() - start > 60_000) break
    await new Promise(r => setTimeout(r, 1500))
    status = await server.getTransaction(hash)
  }
  if (status.result?.retval) {
    return (s as any).scValToNative(status.result.retval) as T
  }
  // Sem retorno explícito
  return undefined as unknown as T
}
