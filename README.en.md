# KaleConnect

Bilingual project index for the monorepo. Choose your language:

- 🇧🇷 Portuguese: [`docs/README.pt-BR.md`](docs/README.pt-BR.md)
- 🇺🇸 English: [`docs/README.en.md`](docs/README.en.md)

## Quick glance

- Monorepo includes:
  - `contracts/`: Soroban smart contracts (Rust) — KYC Registry, Rates Oracle, Remittance
  - `kaleconnect-web/`: Web app (Next.js + TypeScript)
  - Helper scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`

- For full installation, configuration, development and deployment details see the READMEs above.

## 🚀 Deploy (Frontend + Backend)

The frontend (Next.js) and the backend (API Routes in `kaleconnect-web/src/app/api/`) are automatically deployed to Vercel on each push.

- **Vercel Project**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Production** (Protection enabled by default):
  - App: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
  - To make it public: Vercel → Project → Settings → Protection → disable for Production
- **Preview** (public):
  - App: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app

### Key endpoints (base: URLs above)
- `GET /api/health` — service status
- `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- `POST /api/remit`, `GET /api/remit/[id]`
- `GET /api/rates?from=XLM&to=BRL&amount=100`
- `POST /api/elisa/chat` (requires `OPENAI_API_KEY` if AI is enabled)

### Environment variables (Production configured)
- `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CCVIO6YVRPWOGH5RVXTTCZQPPABUZCNUEAVB75SRZDS3ECFOTFSXZOQ4`
- `NEXT_PUBLIC_CONTRACT_ID_KYC = CDGUWD4KJHGLGNEFUS2E6N5MDL7Z34IACKEYD6ZC3DB7IS47MHLKKJG6`
- `NEXT_PUBLIC_CONTRACT_ID_RATES = CDAREYRUQPR6C5PRJIBEREP5IM2UJ2YOPCFDMYNMMORSTFSH2NIXK5G6`
- `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (generated)
- (Optional) `OPENAI_API_KEY` for AI (Eliza)

References:
- Testnet explorer: https://stellar.expert/explorer/testnet
