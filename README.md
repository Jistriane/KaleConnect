# KaleConnect

Documentação bilíngue do projeto. Escolha um idioma:

- 🇧🇷 Português: [`docs/README.pt-BR.md`](docs/README.pt-BR.md)
- 🇺🇸 English: [`docs/README.en.md`](docs/README.en.md)

## Visão rápida / Quick glance

- Monorepo contendo:
  - `contracts/`: contratos inteligentes Soroban (Rust) — KYC Registry, Rates Oracle, Remittance
  - `kaleconnect-web/`: aplicação web (Next.js + TypeScript)
  - Scripts auxiliares: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`

- Para detalhes de instalação, configuração, desenvolvimento e deploy, veja os READMEs completos acima.

## 🚀 Deploy (Frontend + Backend)

O frontend (Next.js) e o backend (API Routes em `kaleconnect-web/src/app/api/`) são publicados automaticamente na Vercel a cada push.

- **Projeto Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Produção** (com proteção habilitada por padrão):
  - App: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
  - Para tornar público: Vercel → Project → Settings → Protection → desativar em Production
- **Preview** (público):
  - App: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app

### Endpoints principais (base: URL acima)
- `GET /api/health` — status do serviço
- `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- `POST /api/remit`, `GET /api/remit/[id]`
- `GET /api/rates?from=XLM&to=BRL&amount=100`
- `POST /api/elisa/chat` (requer `OPENAI_API_KEY` se habilitar IA)

### Variáveis de ambiente (Production configuradas)
- `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`
- `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (gerados)
- (Opcional) `OPENAI_API_KEY` para IA (Eliza)

Referências:
- Explorador Testnet: https://stellar.expert/explorer/testnet
