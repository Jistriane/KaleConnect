# 🌿 KaleConnect — User & Operations Manual (EN)

This manual covers installation, configuration, day-to-day operation, development, testing, and deployment procedures for the KaleConnect project. Intended for developers, operators, and technical reviewers.

- Repository: https://github.com/Jistriane/KaleConnect
- Main components:
  - `kaleconnect-web/` — Web application (Next.js + TypeScript)
  - `contracts/` — Soroban smart contracts (Rust)
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`

---

## 1. Requirements & Pre-install

- Node.js 18+ and npm
- Git
- (Optional) Rust + Cargo for smart contracts
- (Optional) Soroban CLI (`cargo install --locked soroban-cli`)

Check versions:
```bash
node -v
npm -v
rustc --version   # optional
cargo --version   # optional
```

---

## 2. Installation & Setup

Clone and bootstrap:
```bash
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect
./init.sh
```
What `init.sh` does:
- Dependency checks
- Installs packages (root and `kaleconnect-web/`)
- Optionally configures Rust/Soroban environment
- Generates `kaleconnect-web/.env.local` if missing
- Performs a sanity build

---

## 3. Environment Configuration

Default `.env.local` (edit as needed) at `kaleconnect-web/.env.local`:
```
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3006
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here
LOG_LEVEL=info
NODE_ENV=development
```
Production: adjust domains/origins (RP), keys and URLs (e.g., Horizon), reduce verbosity.

---

## 4. Local Development

Run options:
```bash
# Makefile
make dev

# helper script
./dev.sh start

# manual
cd kaleconnect-web
npm run dev
```
Open: http://localhost:3006

Useful scripts (`./dev.sh`):
- `build` — production build
- `test` — runs tests (web and contracts, if configured)
- `lint` — ESLint
- `contracts` — builds smart contracts
- `contracts-test` — runs contract tests
- `clean` / `reset` — clean artifacts and reinstall deps
- `status` / `logs` — quick diagnostics

---

## 5. Directory Structure (summary)

```
kaleconnect-web/
  src/app/ (routes & APIs)
  src/components/ (UI)
  src/lib/ (integrations: Stellar, Soroban, Elisa, wallets etc.)
  public/ (assets)
contracts/
  remittance/ | kyc_registry/ | rates_oracle/
```
Also see `kaleconnect-web/README.md` for front-end architecture and API endpoints.

---

## 6. Application Operations (Web)

- Start/Stop:
  - Dev: `make dev` (Ctrl+C to stop)
  - Local production: `npm run build && npm run start` inside `kaleconnect-web/`
- Logs:
  - Dev: `./dev.sh logs`
- Health:
  - `GET /api/health` at `http://localhost:3006/api/health`

Key routes (mock/PoC):
- WebAuthn: register & login (`/api/auth/passkey/...`)
- KYC: `/api/kyc/start`, `/api/kyc/status`
- Remittances: `/api/remit`, `/api/remit/[id]`
- Rates: `/api/rates`
- ElisaOS: `/api/elisa/chat`
- Audit: `/api/audit`

---

## 7. Smart Contracts (Soroban)

Build and tests:
```bash
rustup update && rustup target add wasm32-unknown-unknown
cd contracts
cargo build --workspace
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown

# tests
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```
Deployment (example — adjust params, network, admin):
```bash
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance.wasm --network testnet
```

---

## 8. Build & Deployment

- Vercel:
  1) Connect repository
  2) Configure project environment variables (equivalent to `.env.local`)
  3) Auto-deploy on push

- Docker (web):
```bash
cd kaleconnect-web
docker build -t kaleconnect-web:latest .
docker run -p 3000:3000 kaleconnect-web:latest
```

- Static export:
```bash
./deploy.sh static
```

- Smart contracts:
```bash
./deploy.sh contracts
```

- General automation for web deploy:
```bash
./deploy.sh vercel     # requires Vercel CLI
./deploy.sh docker     # local image
```

---

## 9. Security & Compliance

- Never commit `.env*`. Use provider secrets (Vercel, GitHub Actions, etc.).
- Prefer SSH over PAT for Git; if using PAT, avoid storing in plain text.
- Validate inputs (Zod), handle errors carefully, avoid leaking sensitive info.
- Keep dependencies updated (`npm audit`, periodic upgrades).
- For production, consider WAF/reverse proxy, TLS, rate limiting, and monitoring.

---

## 10. Troubleshooting

- Port 3006 busy: `pkill -f 'next dev'` or change port.
- Web build failure: clean `.next/`, `node_modules/` and reinstall (`./dev.sh reset`).
- Rust/Soroban missing: ensure `rustup`, WASM target and `soroban` are installed.
- WebAuthn locally: `WEBAUTHN_RP_ORIGIN` must match the origin you use.
- External HTTP errors: verify Horizon/ElizaOS URLs and network/firewall.

---

## 11. Contribution Flow

1. Fork and branch `feat/<name>`
2. Conventional commits
3. Lint and tests before PR
4. PR with clear description and impact

---

## 12. Appendix

- Support scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`
- License: MIT (if `LICENSE` present)
- Credits: Stellar, Kale, ElizaOS, Vercel
