# 🌿 KaleConnect — Documentation (EN)

A global digital remittance platform that combines chat-like simplicity with blockchain-grade security. This repository is a monorepo containing a web app (Next.js) and Soroban smart contracts (Rust).

- Repository: `Jistriane/KaleConnect`
- Main directories:
  - `kaleconnect-web/`: Web app (Next.js + TypeScript)
  - `contracts/`: Soroban smart contracts (Rust)
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`

---

## 📦 Tech Stack

- Front-end: Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript
- Auth: WebAuthn/Passkey (`@simplewebauthn/browser`, `@simplewebauthn/server`)
- Blockchain: Stellar SDK (`@stellar/stellar-sdk`), Freighter, Ethers.js (EVM support)
- AI/Agent: ElizaOS Core (`@elizaos/core`)
- Utilities: Zod, axios, next-intl
- Smart contracts: Rust + Soroban (WASM target `wasm32-unknown-unknown`)

---

## 🗂️ Repository Structure

```
KaleConnect/
├── kaleconnect-web/            # Web application (Next.js)
│   ├── src/app/                # App Router & APIs (route handlers)
│   ├── src/components/         # React components
│   ├── src/lib/                # Integrations (Stellar, ElizaOS, etc.)
│   ├── public/                 # Static assets
│   ├── package.json
│   └── README.md               # Front-end specific guide
├── contracts/                  # Smart contracts (Rust/Soroban)
│   ├── remittance/             # Remittance contract
│   ├── kyc_registry/           # KYC contract
│   └── rates_oracle/           # Rates oracle contract
├── init.sh                     # Project bootstrap
├── dev.sh                      # Dev utilities
├── deploy.sh                   # Deployment automation
├── Makefile                    # Task shortcuts
└── README.md                   # Bilingual index
```

---

## 🚀 Quick Start

Prerequisites:
- Node.js 18+
- npm
- (Optional for contracts) Rust + Cargo + Soroban CLI

Initial steps:
```bash
# 1) Clone and enter project
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2) Guided setup (installs deps, prepares .env, builds contracts if possible)
./init.sh

# 3) Start development
make dev
# or
./dev.sh start
# or
cd kaleconnect-web && npm run dev
```

Open: http://localhost:3000

---

## ⚙️ Environment Variables (Web)
A default file is created at `kaleconnect-web/.env.local` by `init.sh` (if missing):

```
# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# WebAuthn
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3000

# ElizaOS
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here

# Logging & Env
LOG_LEVEL=info
NODE_ENV=development
PORT=3000
```

Adjust values for your environment (production: RP domain/origin, keys, secrets, URLs).

---

## 🧪 Scripts & Tasks

- `Makefile`
  - `make init`, `make dev`, `make build`, `make test`, `make lint`, `make contracts`, `make status` etc.
- `dev.sh`
  - `start`, `build`, `test`, `lint`, `contracts`, `contracts-test`, `clean`, `reset`, `status`, `logs`
- `kaleconnect-web/package.json`
  - `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

Examples:
```bash
make init
make dev
make contracts
./dev.sh clean
cd kaleconnect-web && npm run build && npm run start
```

---

## 🔌 API (App Router Routes — Mock/PoC)
Route handlers live under `kaleconnect-web/src/app/api/*`.
- `GET /api/health`
- WebAuthn: `GET /api/auth/passkey/register/options`, `POST /api/auth/passkey/register/verify`, `GET /api/auth/passkey/login/options`, `POST /api/auth/passkey/login/verify`
- KYC: `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- Remittances: `POST /api/remit`, `GET /api/remit/[id]`
- Rates: `GET /api/rates?from=XLM&to=BRL&amount=100`
- ElisaOS: `POST /api/elisa/chat`
- Audit: `GET /api/audit`, `POST /api/remit/audit`

See `curl` examples in `kaleconnect-web/README.md`.

---

## 🦀 Smart Contracts (Rust/Soroban)
- Local compilation (requires Rust + WASM target):
```bash
rustup update && rustup target add wasm32-unknown-unknown
cd contracts
cargo build --workspace
# WASM (release):
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown
```
- Tests:
```bash
cd contracts
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```
- Deployment (Soroban CLI): see `deploy.sh` (examples target testnet by default).

---

## 🚀 Deployment

- Vercel (recommended for web):
  1. Connect repository
  2. Configure environment variables
  3. Auto-deploy on push
- Docker:
```bash
cd kaleconnect-web
docker build -t kaleconnect-web:latest .
docker run -p 3000:3000 kaleconnect-web:latest
```
- Static export: `./deploy.sh static` (patches `next.config.ts` with `output: 'export'`).
- Smart contracts: `./deploy.sh contracts` builds and prints Soroban commands.

---

### Environment variables (Production)
- `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`
- `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (generated)
- (Optional) `OPENAI_API_KEY`

---

## 🔐 Security

- Use environment variables for secrets (don’t commit `.env*`).
- Prefer SSH over PAT for Git.
- Audit dependencies: `npm audit` and keep versions updated.
- Validate inputs with `zod` and proper backend sanitization.

---

## 🧩 Code Conventions

- Prefer strict TypeScript when possible.
- Lint: `eslint` (Next config). Run `npm run lint` before PRs.
- Commits: conventional (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`).

---

## 🛠️ Troubleshooting

- Busy port (3000): stop Next processes (`pkill -f 'next dev'`) or change port.
- Rust build failure: ensure `wasm32-unknown-unknown` and proper `rustup`/`cargo` versions.
- WebAuthn in dev: ensure `WEBAUTHN_RP_ORIGIN` matches the actual origin.
- External HTTP failures: check variables (Horizon, ElizaOS) and connectivity.

---

## 🗺️ Roadmap (summary)

- MVP: WebAuthn, bilingual chat, ElisaOS, mock APIs (done). Real Stellar integration and multi-wallet support (pending).
- Phase 2: Kale Reflector, automated KYC, cash-in/out, mobile.
- Phase 3: Staking/yield, affiliates, public API, more chains.

---

## 🤝 Contributing

1. Fork
2. Branch: `feat/<name>`
3. Clear commits
4. PR with description and tests (if any)

---

## 📄 License

MIT (if `LICENSE` present). If missing, consider adding one.

---

## 🙏 Acknowledgments

- Stellar Development Foundation, Kale, ElizaOS, Vercel
