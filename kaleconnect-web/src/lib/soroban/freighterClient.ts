"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Assinatura e envio de transações Soroban usando Freighter no navegador.
// Use este cliente apenas no front-end. Para server-side continue usando src/lib/soroban/client.ts

import { getNetwork } from "./client";

export type FreighterCallResult<T = unknown> = { txHash: string; retval?: T };

export async function callContractWithFreighter<T = unknown>(
  contractId: string,
  method: string,
  args: unknown[],
): Promise<FreighterCallResult<T>> {
  if (typeof window === "undefined") {
    throw new Error("Freighter só pode ser usado no browser");
  }

  const { rpcUrl, networkPassphrase } = getNetwork();
  if (!rpcUrl || !networkPassphrase) {
    throw new Error("Config Soroban ausente: defina NEXT_PUBLIC_SOROBAN_RPC e NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE");
  }

  // Import dinâmico para funcionar com Turbopack
  const dynamicImport = new Function("m", "return import(m)") as (m: string) => Promise<unknown>;
  const stellar = (await dynamicImport("@stellar/stellar-sdk")) as any;
  const { SorobanRpc } = (await dynamicImport("soroban-rpc")) as { SorobanRpc: any };
  const freighter = (await dynamicImport("@stellar/freighter-api")) as any;

  // Helpers mínimos para SCVals
  const s = stellar as any;
  const scv = s.ScVal;
  const toSymbol = (sym: string) => scv.forSymbol(sym);
  const toI128 = (n: number | string | bigint) => {
    const bi = BigInt(n);
    return scv.forI128(s.xdr.Int128Parts.new(s.scInt.toI128High(bi), s.scInt.toI128Low(bi)));
  };
  const toAddress = (addr: string) => scv.forAddress(s.Address.fromString(addr));
  const mapArg = (a: unknown) => {
    if (typeof a === "string") {
      if (a.includes(":")) return toSymbol(a);
      if (/^[A-Z0-9]{56}$/.test(a)) return toAddress(a);
      return scv.forString(a);
    }
    if (typeof a === "number") return toI128(a);
    if (typeof a === "bigint") return toI128(a);
    if (typeof a === "boolean") return scv.forBool(a);
    return scv.forString(JSON.stringify(a));
  };

  const server = new SorobanRpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith("http://") });
  const contract = new s.Contract(contractId);
  const scArgs = args.map(mapArg);

  // Obter conta ativa da Freighter
  const publicKey = await (freighter.getPublicKey?.({ network: "TESTNET" }) ?? freighter.getPublicKey?.());
  if (!publicKey || typeof publicKey !== "string") {
    throw new Error("Não foi possível obter a chave pública da Freighter");
  }

  const source = await server.getAccount(publicKey);
  let tx = new s.TransactionBuilder(source, {
    fee: String(s.BASE_FEE),
    networkPassphrase,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(30)
    .build();

  tx = await server.prepareTransaction(tx);

  // Assinar via Freighter
  const xdr = tx.toXDR();
  const signedXdr = await freighter.signTransaction({
    transactionXDR: xdr,
    networkPassphrase,
  });

  const signedTx = s.TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const sent = await server.sendTransaction(signedTx);
  if (sent.errorResult) {
    throw new Error(`Envio falhou: ${JSON.stringify(sent)}`);
  }
  // Aguardar confirmação e decodificar retorno se houver
  const hash = sent.hash;
  let status = await server.getTransaction(hash);
  const start = Date.now();
  while (status.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    if (Date.now() - start > 60000) break;
    await new Promise((r) => setTimeout(r, 1500));
    status = await server.getTransaction(hash);
  }
  const retval = status.result?.retval ? ((s as any).scValToNative(status.result.retval) as T) : undefined;
  return { txHash: hash, retval };
}
