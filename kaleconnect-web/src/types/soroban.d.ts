/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@stellar/stellar-sdk' {
  const sdk: any
  export = sdk
}

declare module 'soroban-rpc' {
  export const SorobanRpc: any
  export const Api: any
}
