# 🦀 Guia Completo Soroban — KaleConnect (PT-BR)

**Guia completo para desenvolvimento, compilação, teste e deploy dos smart contracts Soroban.**

Passo a passo detalhado para trabalhar com os contratos inteligentes do KaleConnect: Remittance, KYC Registry e Rates Oracle. Inclui configuração do ambiente, desenvolvimento local e deploy em produção.

## 1) Setup
```bash
rustup update
rustup target add wasm32-unknown-unknown
cargo install --locked soroban-cli  # se necessário
```

## 2) Build
```bash
cd contracts
cargo build --workspace
# WASM release por contrato
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown
```

## 3) Testes
```bash
cd contracts
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```

## 4) Variáveis e Chaves
- Defina variáveis para rede e contas de admin/operador (NUNCA commitar segredos):
```
export SOROBAN_NETWORK=testnet
export ADMIN_PUBLIC=<INSIRA_PUBLIC_KEY>
export ADMIN_SECRET=<INSIRA_SECRET_SEGURO>
```
Use gerenciadores de segredos (Vercel, GitHub, 1Password, etc.).

## 5) Deploy (exemplos)
```bash
# Remittance
soroban contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/remittance.wasm \
  --network $SOROBAN_NETWORK \
  --source $ADMIN_SECRET

# KYC Registry
soroban contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/kyc_registry.wasm \
  --network $SOROBAN_NETWORK \
  --source $ADMIN_SECRET

# Rates Oracle
soroban contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/rates_oracle.wasm \
  --network $SOROBAN_NETWORK \
  --source $ADMIN_SECRET
```
Registre os endereços resultantes em variáveis (`.env` seguro) para uso pelo front-end.

## 6) Invocação e Inicialização
- Exemplos (ajuste métodos/args conforme a implementação):
```bash
soroban contract invoke \
  --id <CONTRACT_ID_REMITTANCE> \
  --fn init \
  --arg admin=$ADMIN_PUBLIC

soroban contract invoke \
  --id <CONTRACT_ID_RATES> \
  --fn set_rate \
  --arg from=XLM --arg to=BRL --arg rate=1.23
```

## 7) Boas Práticas
- Mantenha os WASMs versionados por release
- Documente mudanças de schema e migrações
- Teste em testnet antes de mainnet
- Auditorias periódicas e limites de gas/fees bem definidos
