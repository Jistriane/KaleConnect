# 🌿 KaleConnect

**A global digital remittance platform as easy as chatting on WhatsApp, but extremely powerful, secure and inclusive.**

Bilingual project documentation. Choose your language:

- 🇧🇷 Portuguese: [`docs/README.pt-BR.md`](docs/README.pt-BR.md)
- 🇺🇸 English: [`docs/README.en.md`](docs/README.en.md)

## ✨ Quick Glance

KaleConnect is an innovative international remittance platform that combines chat-like simplicity with blockchain security and efficiency.

### 🔗 Key Features
- **Real-time Multi-chain Settlement** using Stellar + Kale Reflector
- **Multiple Wallet Support**: Stellar, EVM, Bitcoin and other blockchains
- **Passwordless Authentication (Passkey)**: Biometric/device login using WebAuthn
- **ElisaOS Smart Assistant**: AI for onboarding, support and financial education
- **Bilingual Experience**: Interface in Portuguese (PT-BR) and English
- **Total Transparency**: Pre-calculated amounts, fees and transaction times
- **Real Data**: System connected to real APIs with real-time updates

### 📁 Monorepo Structure
- **`contracts/`**: Soroban smart contracts (Rust) — KYC Registry, Rates Oracle, Remittance
- **`kaleconnect-web/`**: Web application (Next.js + TypeScript) with integrated backend
- **Helper scripts**: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`
- **Documentation**: `docs/` with complete guides in PT-BR and EN

### 🚀 Quick Start
```bash
# 1. Clone repository
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2. Automated initialization
./init.sh

# 3. Start development
make dev
# or ./dev.sh start
```

Access: http://localhost:3000

**For complete installation, configuration, development and deployment details, see the bilingual READMEs above.**

## 🚀 Production Deploy (Frontend + Backend)

### 🌐 Live Application on Vercel Testnet

- **🚀 Complete Application**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app
- **🔍 Vercel Dashboard**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **🌍 Network**: Stellar Testnet
- **⚡ Status**: Active and Operational

### 🎯 Automated Deploy Configured

Frontend (Next.js) and backend (API Routes) are automatically deployed to Vercel:
- **Push to `main`**: Automatic production deploy
- **Pull Requests**: Preview deploy for testing
- **Continuous validation**: Lint + build + tests

### 🔧 Available Backend APIs

- **Health Check**: `/api/health` - Detailed system status
- **Monitoring**: `/api/monitoring` - Prometheus metrics
- **WebAuthn**: `/api/auth/passkey/*` - Passwordless authentication
- **KYC Registry**: `/api/kyc/*` - Identity verification
- **Rates Oracle**: `/api/rates` - Real-time exchange rates
- **Remittances**: `/api/remit/*` - International transfers
- **Elisa Chat**: `/api/elisa/chat` - AI assistant
- **Audit Logs**: `/api/audit` - Audit trail

### 🔥 Implemented Features

#### ✅ Real Data System
- **Dynamic quotes** updated every 30 seconds via real API
- **Blockchain transactions** with real IDs and status
- **KYC verification** with authentic progression
- **Real-time remittance monitoring**
- **Smart fallback** to ensure availability

#### ✅ Advanced Remittance Interface
- **Step-by-step flow** with visual progress indicator
- **Real-time validation** of all fields
- **Wallet integration** (Freighter, MetaMask)
- **Automatic compliance system**
- **Responsive transaction history**

#### ✅ Development Scripts
- **`init.sh`**: Automated complete setup
- **`dev.sh`**: Advanced development utilities
- **`deploy.sh`**: Multi-environment deployment
- **`Makefile`**: Unified interface for tasks

### 🔌 Key Endpoints (base: URLs above)
- `GET /api/health` — Service status
- **KYC**: `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- **Remittances**: `POST /api/remit`, `GET /api/remit/[id]`, `POST /api/remit/enhanced`
- **Quotes**: `GET /api/rates?from=XLM&to=BRL&amount=100`
- **AI Chat**: `POST /api/elisa/chat` (requires `OPENAI_API_KEY`)
- **Authentication**: WebAuthn/Passkey endpoints at `/api/auth/passkey/`
- **Audit**: `GET /api/audit`, `POST /api/remit/audit`

### ⚙️ Environment Variables (Production configured)
- **Stellar Network**:
  - `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
  - `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- **Smart Contracts**:
  - `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
  - `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
  - `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`
- **Security**:
  - `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (automatically generated)
  - (Optional) `OPENAI_API_KEY` for AI (ElizaOS)
- **WebAuthn**:
  - `NEXT_PUBLIC_WEBAUTHN_RP_NAME`, `NEXT_PUBLIC_WEBAUTHN_RP_ID`
  - `WEBAUTHN_RP_ORIGIN` (adjust for production domain) for AI (Eliza)

## 📚 Additional Documentation

### 📄 Detailed Guides
- [**Real Data Implementation**](REAL_DATA_IMPLEMENTATION.md) — How the system uses real APIs
- [**Remittance Improvements**](REMITTANCE_IMPROVEMENTS.md) — Advanced interface implemented
- [**Development Scripts**](SCRIPTS.md) — Complete scripts guide
- [**Operations Manual**](docs/MANUAL.en.md) — Complete operational guide
- [**Architecture**](docs/ARCHITECTURE.en.md) — Technical system overview
- [**Soroban Guide**](docs/SOROBAN_GUIDE.en.md) — Smart contracts
- [**Runbooks**](docs/RUNBOOKS.en.md) — Operational procedures

### 🔗 Useful References
- **Testnet Explorer**: https://stellar.expert/explorer/testnet
- **Stellar Development**: https://developers.stellar.org/
- **Soroban Documentation**: https://soroban.stellar.org/docs
- **ElizaOS**: https://github.com/elizaos/eliza

## 🤝 Contributing

1. Fork the project
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

---

**Developed with ❤️ to connect the world through smart and secure remittances.**
