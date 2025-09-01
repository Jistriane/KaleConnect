# 🌿 KaleConnect — Complete Documentation (EN)

**A global digital remittance platform as easy as chatting on WhatsApp, but extremely powerful, secure and inclusive.**

An innovative international remittance platform that combines chat-like simplicity with blockchain security and efficiency. This repository is a monorepo with a web application (Next.js) and smart contracts (Rust/Soroban).

- **Repository**: https://github.com/Jistriane/KaleConnect
- **Main directories**:
  - `kaleconnect-web/`: Web application (Next.js + TypeScript) with integrated backend
  - `contracts/`: Soroban smart contracts (Rust) for KYC, quotes and remittances
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile` for development
  - `docs/`: Complete bilingual documentation

## ✨ KaleConnect Key Features

- 🔗 **Real-time Multi-chain Settlement** using Stellar + Kale Reflector
- 💼 **Multiple Wallet Support**: Stellar, EVM, Bitcoin and other popular blockchains
- 🔐 **Passwordless Authentication (Passkey)**: Biometric/device login using WebAuthn
- 🤖 **ElizaOS Smart Assistant**: AI for onboarding, support and financial education
- 🌍 **Bilingual Experience**: Interface in Portuguese (PT-BR) and English
- 💰 **Total Transparency**: Pre-calculated amounts, fees and transaction times
- 🔥 **100% Real Data**: System connected to real APIs with real-time updates
- 🚀 **Advanced Interface**: Step-by-step flow, smart validation and modern UX

---

## 📦 Modern Tech Stack

### Frontend & UI
- **Next.js 15** (App Router) with **React 19** for optimized rendering
- **Tailwind CSS 4** for modern and responsive styling
- **TypeScript** with strict mode for type safety
- **Next-intl** for internationalization (PT-BR/EN)

### Authentication & Security
- **WebAuthn/Passkey** (`@simplewebauthn/browser`, `@simplewebauthn/server`)
- **Zod** for runtime data validation
- **Crypto secrets** for audit and security

### Blockchain & Wallets
- **Stellar SDK** (`@stellar/stellar-sdk`) for XLM transactions
- **Freighter API** for Stellar wallet integration
- **Ethers.js** for EVM support (MetaMask, WalletConnect)
- **Multi-chain** via Kale Reflector

### AI & Assistant
- **ElizaOS Core** (`@elizaos/core`) for smart assistant
- **OpenAI integration** for advanced chat
- **Context-aware responses** for financial education

### Smart Contracts
- **Rust + Soroban** (WASM target `wasm32-unknown-unknown`)
- **Contracts**: KYC Registry, Rates Oracle, Remittance
- **Testnet deployment** with configured IDs

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
│   └── README.md               # Frontend-specific guide
├── contracts/                  # Smart contracts (Rust/Soroban)
│   ├── remittance/             # Remittance contract
│   ├── kyc_registry/           # KYC contract
│   └── rates_oracle/           # Rates oracle contract
├── docs/                       # Complete bilingual documentation
│   ├── README.en.md            # This file
│   ├── README.pt-BR.md         # Portuguese version
│   ├── MANUAL.en.md            # Complete operations manual
│   ├── ARCHITECTURE.en.md      # Technical architecture
│   ├── SOROBAN_GUIDE.en.md     # Smart contracts guide
│   └── RUNBOOKS.en.md          # Operational procedures
├── init.sh                     # Complete project setup
├── dev.sh                      # Development utilities
├── deploy.sh                   # Deployment automation
├── Makefile                    # Task shortcuts
└── README.md                   # Bilingual index
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm** (essential)
- **Git** for cloning and versioning
- **(Optional)** **Rust + Cargo + Soroban CLI** for smart contracts

### Automated Installation
```bash
# 1) Clone the repository
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2) Complete automated initialization
./init.sh
# The script will:
# ✅ Check system dependencies
# ✅ Install packages (root + kaleconnect-web)
# ✅ Configure Rust environment (if available)
# ✅ Create .env.local with default settings
# ✅ Compile and test smart contracts
# ✅ Perform verification build

# 3) Start development (choose one option)
make dev                      # 🔥 Recommended - using Makefile
./dev.sh start               # 🛠️ Using utility script
cd kaleconnect-web && npm run dev  # 📝 Manual
```

### Access

🌐 **Local Application**: http://localhost:3000
🔍 **Health Check**: http://localhost:3000/api/health
📊 **Interactive Demo**: http://localhost:3000/ (homepage)
🚀 **Advanced Demo**: http://localhost:3000/enhanced-demo

---

## ⚙️ Environment Configuration

`.env.local` file automatically created at `kaleconnect-web/.env.local` by `init.sh`:

### Development Settings
```bash
# Next.js Application
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Stellar Network (Testnet)
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Smart Contracts (Pre-deployed on Testnet)
NEXT_PUBLIC_CONTRACT_ID_REMITTANCE=CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN
NEXT_PUBLIC_CONTRACT_ID_KYC=CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4
NEXT_PUBLIC_CONTRACT_ID_RATES=CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT

# WebAuthn (Passwordless Authentication)
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3000

# ElizaOS (AI Assistant)
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here
# To enable real AI, configure:
# OPENAI_API_KEY=your-openai-api-key

# Security (Generated automatically)
APP_CRYPTO_SECRET=auto-generated-secret
AUDIT_LOG_SECRET=auto-generated-secret
```

### Production Adjustments
⚠️ **IMPORTANT**: For production, adjust:
- `WEBAUTHN_RP_ID` and `WEBAUTHN_RP_ORIGIN` to your domain
- Configure `OPENAI_API_KEY` for real AI
- Use secure secrets for `APP_CRYPTO_SECRET` and `AUDIT_LOG_SECRET`
- Consider using Stellar Mainnet

---

## 🧵 Development Scripts & Tools

### 🚀 Main Scripts

#### `init.sh` - Complete Setup
```bash
./init.sh  # Complete project initialization
```
- ✅ Check dependencies (Node.js, npm, Rust)
- ✅ Install packages (root + kaleconnect-web)
- ✅ Configure Rust/Soroban environment
- ✅ Create `.env.local` with settings
- ✅ Compile and test smart contracts
- ✅ Perform verification build

#### `dev.sh` - Development Utilities
```bash
./dev.sh [COMMAND]
```
**Available commands:**
- `start` — Start development server
- `build` — Production build
- `test` — Run all tests
- `lint` — Check code with linter
- `contracts` — Compile smart contracts
- `contracts-test` — Test smart contracts
- `clean` — Clean build files
- `reset` — Complete reset (clean + reinstall)
- `logs` — Show server logs
- `status` — Check service status

#### `deploy.sh` - Automated Deployment
```bash
./deploy.sh [ENVIRONMENT] [OPTIONS]
```
**Environments:**
- `vercel` — Deploy to Vercel
- `docker` — Build and deploy with Docker
- `static` — Static build for hosting
- `contracts` — Deploy smart contracts

#### `Makefile` - Unified Interface
```bash
make [COMMAND]
```
**Main commands:**
- `make init` — Initialize complete project
- `make dev` — Start development 🔥
- `make build` — Production build
- `make test` — Run tests
- `make lint` — Check code
- `make contracts` — Compile contracts
- `make status` — Service status
- `make clean` — Clean builds

### 📄 Usage Examples
```bash
# Complete initial setup
make init

# Daily development
make dev

# Check code before commit
make lint && make test

# Clean and restart
./dev.sh reset

# Deploy to production
./deploy.sh vercel

# Manual (web app only)
cd kaleconnect-web
npm run dev
npm run build
npm run start
```

---

## 🔌 Integrated Backend API (Next.js App Router)

All API handlers reside in `kaleconnect-web/src/app/api/*` and provide **100% real data**.

### 👥 WebAuthn/Passkey Authentication
- `GET /api/auth/passkey/register/options?username=<email>` — Registration options
- `POST /api/auth/passkey/register/verify` — Verify registration
- `GET /api/auth/passkey/login/options?username=<email>` — Login options
- `POST /api/auth/passkey/login/verify` — Verify login

### 📋 KYC (Know Your Customer)
- `POST /api/kyc/start` — Start KYC process
- `GET /api/kyc/status?id=<kycId>` — KYC status
  - **Real progression**: `pending` → `review` → `approved`

### 💸 Remittances (Transfers)
- `POST /api/remit` — Create standard remittance
- `POST /api/remit/enhanced` — Create advanced remittance 🆕
- `GET /api/remit/[id]` — Remittance status
  - **Real progression**: `created` → `submitted` → `settled`
- `POST /api/remit/audit` — Audit logs

### 💱 Real-time Quotes
- `GET /api/rates?from=XLM&to=BRL&amount=100` — Get quote
  - **Automatic update**: Every 30 seconds
  - **Supported currencies**: XLM, USDC, BRL, USD, EUR

### 🤖 ElizaOS (AI Assistant)
- `POST /api/elisa/chat` — Interact with assistant
  - **Requires**: `OPENAI_API_KEY` for real AI
  - **Fallback**: Simulated responses if key is missing

### 📊 Monitoring & Audit
- `GET /api/health` — Service status
- `GET /api/audit` — Audit and compliance logs

### 📄 Usage Examples (cURL)
```bash
# Start KYC
curl -X POST http://localhost:3000/api/kyc/start \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user123"}'

# Create advanced remittance
curl -X POST http://localhost:3000/api/remit/enhanced \
  -H 'Content-Type: application/json' \
  -d '{
    "from":"XLM","to":"BRL","amount":50,
    "recipientAddress":"GABC...",
    "purpose":"family_support"
  }'

# Get current quote
curl 'http://localhost:3000/api/rates?from=XLM&to=BRL&amount=100'

# Health check
curl http://localhost:3000/api/health
```

**For more detailed examples, see**: [`kaleconnect-web/README.md`](../kaleconnect-web/README.md)

---

## 🦀 Smart Contracts (Rust/Soroban)

### 🏢 Available Contracts

1. **Remittance Contract** — Manages transfers
2. **KYC Registry** — Identity verification
3. **Rates Oracle** — Currency quotes

### 🛠️ Local Development

#### Rust Environment Setup
```bash
# Install Rust and tools
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

#### Compilation
```bash
cd contracts

# Build for development
cargo build --workspace

# Build WASM for production
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown

# Using scripts (easier)
../dev.sh contracts
```

#### Testing
```bash
cd contracts

# Test all contracts
cargo test --workspace

# Test specific contract
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle

# Using script
../dev.sh contracts-test
```

### 🚀 Contract Deployment

#### Testnet (Configured)
Contracts are already deployed on Stellar Testnet:
- **Remittance**: `CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- **KYC Registry**: `CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- **Rates Oracle**: `CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`

#### Manual Deploy (Advanced)
```bash
# Prepare environment
export SOROBAN_NETWORK=testnet
export ADMIN_SECRET=<YOUR_STELLAR_SECRET_KEY>

# Example deployment
soroban contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/remittance.wasm \
  --network $SOROBAN_NETWORK \
  --source $ADMIN_SECRET

# Using automated script
./deploy.sh contracts
```

#### Contract Invocation
```bash
# Initialize contract
soroban contract invoke \
  --id CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN \
  --fn init \
  --arg admin=GXXXXXXX...

# Set exchange rate
soroban contract invoke \
  --id CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT \
  --fn set_rate \
  --arg from=XLM --arg to=BRL --arg rate=1.85
```

**For complete Soroban guide**: [`docs/SOROBAN_GUIDE.en.md`](SOROBAN_GUIDE.en.md)

---

## 🚀 Deploy & Production

### 🌐 Live Application on Vercel Testnet

#### 🔗 Complete Application URLs
- **🚀 Main Application**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app
- **🔍 Vercel Dashboard**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **🌍 Blockchain Network**: Stellar Testnet
- **⚡ Status**: Active and Operational 24/7

#### 🔧 Active Backend APIs

All APIs are functional and available:

- **Health Check**: `/api/health` - Detailed system status and metrics
- **Monitoring**: `/api/monitoring` - Prometheus metrics for observability
- **WebAuthn**: `/api/auth/passkey/*` - Passwordless authentication via biometrics
- **KYC Registry**: `/api/kyc/*` - Identity verification and compliance
- **Rates Oracle**: `/api/rates` - Real-time exchange rates
- **Remittances**: `/api/remit/*` - International transfers
- **Elisa Chat**: `/api/elisa/chat` - Conversational AI assistant
- **Audit Logs**: `/api/audit` - Cryptographic audit logs

#### 🎯 Automated Deploy Configured
1. **Push to `main`** → Automatic production deployment
2. **Pull Requests** → Preview deployment for testing
3. **Continuous validation** → Lint + build + automated tests
4. **Environment variables** → Auto-configured for Stellar Testnet
5. **Monitoring** → Real-time logs and metrics
6. **Rate Limiting** → 20 req/min per IP with informative headers

#### ⚙️ Vercel Configuration
For new Vercel deploy:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd kaleconnect-web
vercel

# 3. Or use script
./deploy.sh vercel
```

### 🐳 Docker - Container Deploy

#### Build and Run
```bash
cd kaleconnect-web

# Build image
docker build -t kaleconnect-web:latest .

# Run container
docker run -d \
  --name kale-web \
  -p 3000:3000 \
  --env-file .env.local \
  kaleconnect-web:latest

# Check logs
docker logs -f kale-web

# Stop container
docker stop kale-web && docker rm kale-web
```

#### Docker Compose (Optional)
```yaml
# docker-compose.yml
version: '3.8'
services:
  kaleconnect:
    build: ./kaleconnect-web
    ports:
      - "3000:3000"
    env_file:
      - ./kaleconnect-web/.env.local
    restart: unless-stopped
```

### 📞 Static Export (Traditional Hosting)

```bash
# Generate static build
./deploy.sh static

# Or manually
cd kaleconnect-web
npm run build
npm run export  # If configured

# Files are in kaleconnect-web/out/
# Copy to your web server (Nginx, Apache, etc.)
```

### 🦀 Smart Contracts Deploy

```bash
# Automatic deploy
./deploy.sh contracts

# The script will:
# ✅ Compile all contracts to WASM
# ✅ Display Soroban deploy commands
# ✅ Generate configuration files
```

### 🔍 Production Monitoring

#### Health Checks
- **Application**: `GET /api/health`
- **Vercel Analytics**: Available on dashboard
- **Logs**: Vercel Functions logs

#### Important Metrics
- **API Latency**
- **Error rate** (5xx)
- **Stellar Horizon availability**
- **Real-time quotes performance**

**For complete operational procedures**: [`docs/RUNBOOKS.en.md`](RUNBOOKS.en.md)

---

### 🆕 Recently Implemented Features

#### ✅ 100% Real Data System
We completely replaced simulations with **real API data**:
- **Dynamic quotes** updated every 30s via `/api/rates`
- **Blockchain transactions** with real progressive IDs and status
- **KYC verification** with authentic progression
- **Real-time remittance monitoring** every 5s
- **Smart fallback** system to ensure availability

#### ✅ Advanced Remittance Interface
Completely redesigned interface:
- **Step-by-step flow** with visual progress indicator
- **Real-time validation** of all fields
- **Wallet integration** (Freighter Stellar, MetaMask EVM)
- **Automatic compliance system** with smart blocking
- **Responsive transaction history** and detailed
- **Currency converter** with automatic updates

#### ✅ Advanced Development Scripts
Robust development tools:
- **`init.sh`** with complete automated setup
- **`dev.sh`** with 12+ utilities (start, build, test, clean, etc.)
- **`deploy.sh`** for multiple environments (Vercel, Docker, static)
- **`Makefile`** with unified interface for all tasks

**For complete technical details**:
- [Real Data Implementation](../REAL_DATA_IMPLEMENTATION.md)
- [Remittance Improvements](../REMITTANCE_IMPROVEMENTS.md)
- [Development Scripts](../SCRIPTS.md)

---

## 🔐 Security & Compliance

### 🔒 Passwordless Authentication
- **WebAuthn/Passkey** for passwordless login
- **Biometrics** and device authenticators
- **Multi-device support** for convenience
- **Native phishing resistance**

### 🛡️ Validation & Sanitization
- **Zod schemas** for rigorous runtime validation
- **Input sanitization** on all API routes
- **Type safety** with TypeScript strict mode
- **Error boundaries** for safe error capture

### 🔑 Secret Management
- **Environment variables** for all sensitive configurations
- **Auto-generated secrets** for crypto and audit
- **Never commit** `.env*` files
- **Prefer SSH** over PAT for Git operations

### 📊 Audit & Compliance
- **Complete logs** of all transactions
- **Automatic compliance system** for high values
- **Integrated KYC verification**
- **Implicit rate limiting** via timeouts

### 🔄 Security Maintenance
```bash
# Dependency audit
npm audit

# Package updates
npm update

# Vulnerability check
make security  # If available
```

### 🏢 Production Considerations
- **WAF/Reverse proxy** for additional protection
- **TLS/HTTPS** mandatory
- **Custom rate limiting**
- **24/7 security monitoring**
- **Critical data backup**
- **Documented incident response plan**

---

## 🧩 Code Conventions & Quality

### 📝 Code Standards
- **TypeScript strict mode** whenever possible
- **ESLint** with Next.js configuration
- **Prettier** for consistent formatting
- **Clear and descriptive naming conventions**

### 📋 Conventional Commits
```bash
feat: add new functionality
fix: fix specific bug
chore: maintenance tasks
docs: update documentation
style: code formatting
refactor: refactoring without functional change
test: add or fix tests
perf: performance improvements
```

### 🛠️ Development Flow
```bash
# Before each commit
make lint    # Check code
make test    # Run tests

# Before PR
make build   # Ensure it builds
make status  # Check overall health
```

### 📂 File Structure
- **Components**: PascalCase (`CurrencyConverter.tsx`)
- **Utilities**: camelCase (`wallets.ts`, `elisa.ts`)
- **APIs**: kebab-case for routes (`/api/auth/passkey/`)
- **Constants**: UPPER_SNAKE_CASE

### 📏 Documentation
- **JSDoc** for complex functions
- **README** updated for each new feature
- **Comments** explaining "why", not "what"
- **Usage examples** in APIs and utilities

---

## 🛠️ Troubleshooting

### 🚫 Common Setup Issues

#### Error "Port 3000 busy"
```bash
# Check processes on port
lsof -i :3000

# Stop Next.js process
pkill -f "next dev"

# Or use alternative port
PORT=3001 npm run dev
```

#### Build/Dependencies Failure
```bash
# Complete reset
./dev.sh reset

# Or manual
rm -rf node_modules package-lock.json
rm -rf kaleconnect-web/node_modules kaleconnect-web/package-lock.json
npm install
cd kaleconnect-web && npm install
```

#### Rust/Smart Contracts Issues
```bash
# Check Rust installation
rustc --version
cargo --version

# Reinstall WASM target
rustup target remove wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown

# Recompile contracts
cd contracts
cargo clean
cargo build --workspace
```

### 🌐 Network/API Issues

#### WebAuthn in Development
```bash
# Check configuration
echo $WEBAUTHN_RP_ORIGIN  # Should be http://localhost:3000
echo $NEXT_PUBLIC_WEBAUTHN_RP_ID  # Should be localhost

# Use local HTTPS (if needed)
npx local-ssl-proxy --source 3001 --target 3000
```

#### External API Failures
```bash
# Test Stellar connectivity
curl https://horizon-testnet.stellar.org/

# Check Soroban configuration
curl https://soroban-testnet.stellar.org/health

# Check environment variables
cd kaleconnect-web
cat .env.local | grep -E "HORIZON|SOROBAN"
```

### 📊 Quick Diagnostics

```bash
# Overall system status
make status

# Project information
make info

# Tool versions
make version

# Detailed logs
./dev.sh logs

# Application health check
curl http://localhost:3000/api/health
```

### 🐛 Advanced Debugging

#### Next.js Logs
```bash
# Debug mode
DEBUG=* npm run dev

# Detailed logs
NODE_ENV=development LOG_LEVEL=debug npm run dev
```

#### Smart Contract Debug
```bash
# Tests with detailed output
cd contracts
cargo test -- --nocapture

# Build with debug info
cargo build --workspace --verbose
```

#### Performance Check
```bash
# Bundle analyzer (Next.js)
npm run analyze  # If configured

# Memory monitor
top -p $(pgrep -f "next dev")

# Network requests
# Use DevTools -> Network tab
```

### 🆘 Getting Help

If issues persist:

1. **Check issues** on GitHub repository
2. **Check detailed logs** with `./dev.sh logs`
3. **Run diagnostics** with `make status`
4. **Document the error** with steps to reproduce
5. **Open an issue** with collected information

**For production operational procedures**: [`docs/RUNBOOKS.en.md`](RUNBOOKS.en.md)

---

## 🗺️ Development Roadmap

### ✅ MVP Completed (v0.1.0)
- ✅ **WebAuthn/Passkey authentication** working
- ✅ **Bilingual interface** (PT-BR/EN) complete
- ✅ **ElizaOS assistant** integrated
- ✅ **Real data system** from APIs
- ✅ **Advanced remittance interface**
- ✅ **Basic Stellar integration**
- ✅ **Smart contracts** deployed on Testnet
- ✅ **Complete development scripts**
- ✅ **Automated deployment** on Vercel

### 🔄 Phase 1.5 - Enhancements (In Development)
- 🔄 **Complete Freighter integration** for real transactions
- 🔄 **MetaMask support** for EVM tokens
- 🔄 **Automated testing** (Jest + Testing Library)
- 🔄 **Performance monitoring**
- 🔄 **PWA** for offline use

### 🚀 Phase 2 - Scaling (Q2 2024)
- 📅 **Kale Reflector** for real cross-chain
- 📅 **Automated KYC** with document verification
- 📅 **Cash-in/Cash-out** with local partners
- 📅 **Mobile app** (React Native)
- 📅 **Analytics dashboard** for users
- 📅 **Push notifications** for status updates

### 🌍 Phase 3 - Global Expansion (Q3-Q4 2024)
- 📅 **Integrated staking and yield farming**
- 📅 **Affiliate program** with incentives
- 📅 **Public API** for developers
- 📅 **Support for more blockchains** (Ethereum, Polygon, BSC)
- 📅 **Banking partnerships** via Open Banking
- 📅 **Regulatory compliance** in multiple countries

### 🔮 Phase 4 - Innovation (2025)
- 📅 **Integrated DeFi** with liquidity pools
- 📅 **Corporate multi-sig wallet**
- 📅 **Advanced AI** for fraud detection
- 📅 **Financial education program**
- 📅 **P2P exchange marketplace**
- 📅 **Real asset tokenization**

### 📊 Success Metrics

**Phase 1.5**:
- 99.9% uptime
- < 2s response time
- 100% test coverage

**Phase 2**:
- 10,000+ active users
- $1M+ transaction volume
- 5+ countries served

**Phase 3**:
- 100,000+ users
- $50M+ monthly volume
- 20+ countries
- Partnerships with 10+ financial institutions

---

## 🤝 Contributing to KaleConnect

### 🚀 Getting Started with Contributing

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KaleConnect.git
   cd KaleConnect
   ```

2. **Environment setup**
   ```bash
   ./init.sh  # Automated setup
   make dev   # Start development
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   # or
   git checkout -b docs/update-readme
   ```

### 📝 Contribution Guidelines

#### Types of Contributions
- 🎆 **Features**: New functionalities
- 🐛 **Bug fixes**: Bug corrections
- 📚 **Documentation**: Docs improvements
- 🎨 **UI/UX**: Interface improvements
- ⚙️ **Performance**: Optimizations
- 🛠️ **Tooling**: Scripts and tools
- 🧪 **Tests**: Test coverage

#### Code Standards
```bash
# Before committing
make lint     # Check ESLint
make test     # Run tests
make build    # Ensure it compiles
```

#### Commit Messages
```bash
# Use conventional commits
feat(remit): add enhanced remittance flow
fix(auth): resolve WebAuthn registration issue
docs(api): update endpoint documentation
style(ui): improve button consistency
refactor(wallets): simplify connection logic
test(kyc): add KYC workflow tests
chore(deps): update dependencies
```

### 📝 Pull Request Process

1. **Before PR**
   ```bash
   # Sync with main
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   
   # Check quality
   make lint && make test && make build
   ```

2. **Create PR with**:
   - 📝 **Clear title** describing the change
   - 📋 **Detailed description** of what was implemented
   - 📏 **Screenshots** if UI/UX
   - 🧪 **Tests** added or updated
   - 🔗 **Links** to related issues

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes.
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation
   
   ## How to Test
   Steps to test the changes.
   
   ## Checklist
   - [ ] Code follows project standards
   - [ ] Tests pass
   - [ ] Documentation updated
   ```

### 🎓 Contribution Areas

#### For Beginners
- 📚 **Documentation**: Improve READMEs and guides
- 🌎 **Translations**: Expand language support
- 🐛 **Bug reports**: Find and report issues
- 🧪 **Tests**: Add test cases

#### For Intermediate
- 🎨 **UI Components**: New React components
- 🔌 **API Endpoints**: New endpoints or improvements
- 📱 **Responsiveness**: Improve mobile layout
- ⚡ **Performance**: Optimize loading

#### For Advanced
- 🦀 **Smart Contracts**: New Soroban contracts
- 🔗 **Blockchain Integration**: New networks
- 🤖 **AI/ElizaOS**: Assistant improvements
- 🛡️ **Security**: Audits and improvements

### 🎆 Recognition

Contributors are recognized:
- 🏆 **Contributors list** in README
- 📊 **GitHub contribution badges**
- 🌟 **Mentions** in release notes
- 🎁 **Swag** for significant contributions

### 💬 Community

- 💬 **Discussions**: GitHub Discussions for ideas
- 🐛 **Issues**: Bug reports and feature requests
- 📚 **Wiki**: Collaborative documentation
- 🚀 **Projects**: Public Kanban boards

**Thank you for contributing to connecting the world through smart remittances!** 🌍❤️

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

### 🔓 MIT License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ⚠️ **Copyright inclusion** required
- ❌ **Warranty** not provided
- ❌ **Liability** not assumed

---

## 🙏 Acknowledgments and Credits

### 🏢 Fundamental Technologies
- **[Stellar Development Foundation](https://stellar.org/)** - Blockchain infrastructure and Soroban
- **[Kale](https://kale.money/)** - Reflector and Stellar tools
- **[ElizaOS](https://github.com/elizaos/eliza)** - AI platform for assistants
- **[Vercel](https://vercel.com/)** - Hosting and development tools

### 🛠️ Tools & Libraries
- **[Next.js](https://nextjs.org/)** - Full-stack React framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://typescriptlang.org/)** - JavaScript with types
- **[Zod](https://zod.dev/)** - Schema validation
- **[SimpleWebAuthn](https://simplewebauthn.dev/)** - WebAuthn implementation

### 👥 Open Source Community
- **All contributors** who made this project possible
- **Stellar community** for support and feedback
- **Next.js developers** for the amazing platform
- **Rust/WASM ecosystem** for secure smart contracts

### 🎆 Special Recognition
- **Stellar Community Fund Program** for supporting innovation
- **Hackathons and events** that inspired the project
- **Early adopters** who tested and provided feedback
- **Development team** dedicated to the project

---

## 🌍 Connections

### 🔗 Project Links
- **Repository**: https://github.com/Jistriane/KaleConnect
- **🚀 Live Application**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app
- **🔍 Vercel Dashboard**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **📚 Documentation**: https://github.com/Jistriane/KaleConnect/tree/main/docs
- **🔧 API Health**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app/api/health
- **📊 Monitoring**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app/api/monitoring

### 💬 Social Networks
- **GitHub**: [@Jistriane](https://github.com/Jistriane)
- **Stellar Community**: Join the discussions
- **Discord**: Join the Stellar community

---

**🌿 Developed with ❤️ to connect the world through smart and secure remittances.**

> *"Money should move as easily as information"* - KaleConnect Vision

---

🗨️ **Last updated**: January 2025 | 📚 **Documentation version**: 2.0.0