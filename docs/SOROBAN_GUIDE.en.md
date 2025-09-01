# 🦀 Complete Soroban Guide — KaleConnect (EN)

**Complete guide for developing, building, testing, and deploying Soroban smart contracts.**

Detailed step-by-step guide for working with KaleConnect's smart contracts: Remittance, KYC Registry, and Rates Oracle. Includes environment setup, local development, and production deployment.

## 1) Setup
```bash
rustup update
rustup target add wasm32-unknown-unknown
cargo install --locked soroban-cli  # if needed
```

## 2) Build
```bash
cd contracts
cargo build --workspace
# Per-contract WASM release
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown
```

## 3) Tests
```bash
cd contracts
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```

## 4) Variables & Keys
- Define variables for network and admin/operator accounts (NEVER commit secrets):
```
export SOROBAN_NETWORK=testnet
export ADMIN_PUBLIC=<INSERT_PUBLIC_KEY>
export ADMIN_SECRET=<INSERT_SECURE_SECRET>
```
Use secret managers (Vercel, GitHub, 1Password, etc.).

## 5) Deployment (examples)
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
Record resulting addresses in secure env for front-end usage.

## 6) Invocation & Init
- Examples (adjust method/args to implementation):
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

## 7) Best Practices
- Version WASMs per release
- Document schema changes and migrations
- Test on testnet before mainnet
- Periodic audits and well-defined gas/fee limits
