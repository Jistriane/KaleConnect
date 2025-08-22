# KaleConnect Smart Contracts (Soroban)

Este diretório contém um workspace Rust com três contratos Soroban:

- remittance: cria e gerencia remessas com status mutável pelo admin.
- kyc_registry: registra e consulta status KYC por usuário.
- rates_oracle: define e consulta pares de câmbio com taxa e fee (basis points).

## Estrutura

```
contracts/
  Cargo.toml          # workspace
  remittance/
    Cargo.toml
    src/lib.rs
  kyc_registry/
    Cargo.toml
    src/lib.rs
  rates_oracle/
    Cargo.toml
    src/lib.rs
```

## Pré-requisitos

- rustup + toolchain estável
- alvo wasm32-unknown-unknown
- soroban-cli (opcional, para deploy/integração local)

### Instalação rápida

```bash
rustup update
rustup target add wasm32-unknown-unknown
# soroban-cli opcional
# cargo install --locked soroban-cli
```

## Build

- Compilar todos os crates (host):

```bash
cargo build --workspace
```

- Compilar para WASM (necessário para deploy em Soroban):

```bash
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown
```

Os artefatos `.wasm` ficarão em `target/wasm32-unknown-unknown/release/*.wasm`.

## Testes

```bash
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```

## Interfaces dos Contratos

### remittance

- init(admin: Address)
- create(from: Address, to: Address, amount: i128) -> u128
- get(id: u128) -> Option<RemitInfo>
- set_status(id: u128, status: Symbol)

Tipos:
- RemitInfo { from: Address, to: Address, amount: i128, status: Symbol }
- status: "pending" | "settled" | "failed" | ...

### kyc_registry

- init(admin: Address)
- start(user: Address)
- set_status(user: Address, status: Symbol)
- get_status(user: Address) -> Option<Symbol>

### rates_oracle

- init(admin: Address)
- set_rate(pair: Symbol, price: i128, fee_bp: u32)
- get_rate(pair: Symbol) -> Option<RateInfo>

Tipos:
- RateInfo { price: i128, fee_bp: u32 }
- `pair` exemplo: "XLM:BRL"

## Integração com a WebApp

As rotas mock atuais podem ser ligadas aos contratos:

- `GET /api/rates?from=XLM&to=BRL&amount=10`
  - chama `rates_oracle.get_rate(Symbol::new("XLM:BRL"))`
  - calcula `to_amount = amount * price / SCALE` (defina sua escala, ex.: 1e7)
  - fee em basis points `bp` => `feePct = bp / 100.0`

- `POST /api/remit { from, to, amount }`
  - originador assina a transação `remittance.create(from, to, amount)`
  - ID retornado pelo contrato vira `id` da resposta
  - polling em `/api/remit/[id]` lê `remittance.get(id)` e sua `status`

- `POST /api/kyc/start { userId }`
  - usuário assina `kyc_registry.start(user)`
  - admin fora de banda muda status via `kyc_registry.set_status(user, status)`
  - `/api/kyc/status?id=...` lê `kyc_registry.get_status(user)`

Notas:
- A assinatura/execução on-chain deve ser feita pelo cliente (Freighter) ou pelo backend custodial.
- Para JS, use `@stellar/stellar-sdk` + `soroban-rpc` (ou `soroban-client`) para invocar contratos.
- Mantenha o `admin` seguro; idealmente uma conta multisig ou guardada em cofre.

## Deploy (exemplo com soroban-cli)

```bash
# set network/config
soroban config network add testnet --rpc-url https://soroban-testnet.stellar.org --network-passphrase "Test SDF Network ; September 2015"

# deploy
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance.wasm --network testnet --source <ADMIN_KEY> --out remittance_id.txt

# init
soroban contract invoke --id $(cat remittance_id.txt) --fn init --network testnet --source <ADMIN_KEY> -- --admin <ADMIN_ADDRESS>
```

Adapte o mesmo fluxo para `kyc_registry` e `rates_oracle`.

## Próximos Passos

- Mapear SCALE para `price` (por exemplo, 1e7) e refletir no frontend.
- Criar camada de serviços na API Next para chamar RPC Soroban.
- Configurar `.env` com RPC/Network/Contract IDs.
