# 🌿 KaleConnect — Documentação (PT-BR)

Uma plataforma global de remessas digitais que combina a simplicidade de um chat com a segurança da blockchain. Este repositório é um monorepo com aplicação web (Next.js) e pacotes de smart contracts (Rust/Soroban).

- Repositório: `Jistriane/KaleConnect`
- Principais diretórios:
  - `kaleconnect-web/`: App web (Next.js + TypeScript)
  - `contracts/`: Smart contracts Soroban (Rust)
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`

---

## 📦 Stack & Tecnologias

- Front-end: Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript
- Autenticação: WebAuthn/Passkey (`@simplewebauthn/browser`, `@simplewebauthn/server`)
- Blockchain: Stellar SDK (`@stellar/stellar-sdk`), Freighter, Ethers.js (suporte EVM)
- IA/Agente: ElizaOS Core (`@elizaos/core`)
- Utilitários: Zod, axios, next-intl
- Smart contracts: Rust + Soroban (WASM target `wasm32-unknown-unknown`)

---

## 🗂️ Estrutura do Repositório

```
KaleConnect/
├── kaleconnect-web/            # Aplicação web (Next.js)
│   ├── src/app/                # App Router & APIs (route handlers)
│   ├── src/components/         # Componentes React
│   ├── src/lib/                # Integrações (Stellar, ElizaOS, etc.)
│   ├── public/                 # Assets estáticos
│   ├── package.json
│   └── README.md               # Guia específico do front-end
├── contracts/                  # Smart contracts (Rust/Soroban)
│   ├── remittance/             # Contrato de remessas
│   ├── kyc_registry/           # Contrato de KYC
│   └── rates_oracle/           # Contrato de cotações
├── init.sh                     # Setup completo do projeto
├── dev.sh                      # Utilidades de desenvolvimento
├── deploy.sh                   # Automação de deploy
├── Makefile                    # Atalhos para tarefas
└── README.md                   # Índice bilíngue
```

---

## 🚀 Começando Rápido

Pré-requisitos mínimos:
- Node.js 18+
- npm
- (Opcional para contratos) Rust + Cargo + Soroban CLI

Passos iniciais:
```bash
# 1) Clonar e entrar no projeto
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2) Inicialização guiada (instala dependências, prepara .env, compila contratos se possível)
./init.sh

# 3) Iniciar desenvolvimento
make dev
# ou
./dev.sh start
# ou
cd kaleconnect-web && npm run dev
```

Acesse: http://localhost:3000

---

## ⚙️ Variáveis de Ambiente (Web)
Arquivo padrão criado em `kaleconnect-web/.env.local` pelo `init.sh` (se ausente):

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

Ajuste valores conforme seu ambiente (produção: alterar URLs/domínio RP, chaves e secrets).

---

## 🧪 Scripts & Tarefas

- `Makefile`
  - `make init`, `make dev`, `make build`, `make test`, `make lint`, `make contracts`, `make status` etc.
- `dev.sh`
  - `start`, `build`, `test`, `lint`, `contracts`, `contracts-test`, `clean`, `reset`, `status`, `logs`
- `kaleconnect-web/package.json`
  - `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

Exemplos:
```bash
make init
make dev
make contracts
./dev.sh clean
cd kaleconnect-web && npm run build && npm run start
```

---

## 🔌 API (Rotas App Router — Mock/PoC)
Os handlers residem em `kaleconnect-web/src/app/api/*`.
- `GET /api/health`
- WebAuthn: `GET /api/auth/passkey/register/options`, `POST /api/auth/passkey/register/verify`, `GET /api/auth/passkey/login/options`, `POST /api/auth/passkey/login/verify`
- KYC: `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- Remessas: `POST /api/remit`, `GET /api/remit/[id]`
- Cotações: `GET /api/rates?from=XLM&to=BRL&amount=100`
- ElisaOS: `POST /api/elisa/chat`
- Auditoria: `GET /api/audit`, `POST /api/remit/audit`

Consulte exemplos de `curl` no `kaleconnect-web/README.md`.

---

## 🦀 Smart Contracts (Rust/Soroban)
- Compilação local (requer Rust + target WASM):
```bash
rustup update && rustup target add wasm32-unknown-unknown
cd contracts
cargo build --workspace
# WASM (release):
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown
```
- Testes:
```bash
cd contracts
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```
- Deploy (Soroban CLI): veja `deploy.sh` (alvo: testnet por padrão nos exemplos).

---

## 🚀 Deploy

- Vercel (recomendado para o web):
  1. Conectar repositório
  2. Configurar variáveis de ambiente
  3. Deploy automático a cada push
- Docker:
```bash
cd kaleconnect-web
docker build -t kaleconnect-web:latest .
docker run -p 3000:3000 kaleconnect-web:latest
```
- Export estático: `./deploy.sh static` (ajusta `next.config.ts` para `output: 'export'`).
- Smart contracts: `./deploy.sh contracts` compila e mostra comandos Soroban.

---

### 🌐 Deploy (Frontend + Backend) — Vercel

O frontend (Next.js) e o backend (APIs em `kaleconnect-web/src/app/api/*`) são publicados automaticamente na Vercel.

- **Projeto Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Produção** (com Protection habilitado por padrão):
  - App: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
  - Para tornar público: Project → Settings → Protection → desativar em Production
- **Preview** (público):
  - App: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app

Endpoints principais (base: URLs acima):
- `GET /api/health`
- `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- `POST /api/remit`, `GET /api/remit/[id]`
- `GET /api/rates?from=XLM&to=BRL&amount=100`
- `POST /api/elisa/chat` (requer `OPENAI_API_KEY` se habilitar IA)

Variáveis (Production):
- `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`
- `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (gerados)
- (Opcional) `OPENAI_API_KEY`

## 🔐 Segurança

- Use variáveis de ambiente para segredos (não commitar `.env*`).
- Prefira SSH a PAT para Git.
- Audite dependências: `npm audit` e mantenha versões atualizadas.
- Valide entradas com `zod` e sanitização adequada no backend.

---

## 🧩 Convenções de Código

- TypeScript estrito quando possível.
- Lint: `eslint` (Next config). Execute `npm run lint` antes dos PRs.
- Commits: convencional (ex.: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`).

---

## 🛠️ Solução de Problemas

- Porta ocupada (3000): pare processos Next (`pkill -f 'next dev'`) ou altere porta.
- Falha em build Rust: confirme `wasm32-unknown-unknown` e versões `rustup`/`cargo`.
- WebAuthn em dev: use `WEBAUTHN_RP_ORIGIN` consistente com a origem utilizada.
- Falhas HTTP externas: verifique variáveis (Horizon, ElizaOS) e conectividade.

---

## 🗺️ Roadmap (resumo)

- MVP: WebAuthn, chat bilíngue, ElisaOS, APIs mock (feito). Integração Stellar real e multi-wallet (pendente).
- Fase 2: Kale Reflector, KYC automatizado, cash-in/out, mobile.
- Fase 3: Staking/yield, afiliados, API pública, novas chains.

---

## 🤝 Contribuição

1. Fork
2. Branch: `feat/<nome>`
3. Commits claros
4. PR com descrição e testes (se houver)

---

## 📄 Licença

MIT (se houver `LICENSE`). Caso ausente, considerar adicionar.

---

## 🙏 Agradecimentos

- Stellar Development Foundation, Kale, ElizaOS, Vercel

