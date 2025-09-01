# 🌿 KaleConnect — Manual Completo de Operação (PT-BR)

**Manual operacional completo para desenvolvedores, operadores e revisores técnicos.**

Este manual abrangente descreve instalação, configuração, operação diária, desenvolvimento, testes e procedimentos de deploy do projeto KaleConnect. Inclui as funcionalidades mais recentes: sistema de dados reais, interface avançada de remessas e scripts de desenvolvimento aprimorados.

- **Repositório**: https://github.com/Jistriane/KaleConnect
- **Aplicação Live**: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
- **Principais componentes**:
  - `kaleconnect-web/` — Aplicação web (Next.js + TypeScript) com backend integrado
  - `contracts/` — Smart contracts Soroban (Rust) para KYC, cotações e remessas
  - `docs/` — Documentação bilíngue completa
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile` para automação

## 🆕 É Novo Aqui?

- 🚀 **Início rápido**: Execute `./init.sh` seguido de `make dev`
- 📚 **Documentação completa**: [`docs/README.pt-BR.md`](README.pt-BR.md)
- 🔥 **Funcionalidades recentes**: [Implementação de dados reais](../REAL_DATA_IMPLEMENTATION.md)
- 🛠️ **Scripts**: [Guia completo de scripts](../SCRIPTS.md)

---

## 1. Requisitos e Pré-instalação

- Node.js 18+ e npm
- Git
- (Opcional) Rust + Cargo para smart contracts
- (Opcional) Soroban CLI (`cargo install --locked soroban-cli`)

Verifique versões:
```bash
node -v
npm -v
rustc --version   # opcional
cargo --version   # opcional
```

---

## 2. Instalação e Setup

Clonar e inicializar:
```bash
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect
./init.sh
```
O `init.sh` realiza:
- Checagem de dependências
- Instalação de pacotes (raiz e `kaleconnect-web/`)
- Configuração opcional do ambiente Rust/Soroban
- Geração do arquivo `kaleconnect-web/.env.local` se ausente
- Build de verificação

---

## 3. Configuração de Ambiente

Arquivo `.env.local` padrão (edite conforme necessário) em `kaleconnect-web/.env.local`:
```
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3000
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here
LOG_LEVEL=info
NODE_ENV=development
PORT=3000
```
Produção: ajuste domínios/origens (RP), chaves e URLs (ex.: Horizon ou proxies), desative logs verbosos.

---

## 4. Desenvolvimento Local

Opções de execução:
```bash
# usando Makefile
make dev

# usando script utilitário
./dev.sh start

# manualmente
cd kaleconnect-web
npm run dev
```
Acesse: http://localhost:3000

Scripts úteis (`./dev.sh`):
- `build` — build de produção
- `test` — executa testes (web e contratos, se configurados)
- `lint` — ESLint
- `contracts` — compila os smart contracts
- `contracts-test` — executa testes dos contratos
- `clean` / `reset` — limpeza e reinstalação
- `status` / `logs` — diagnóstico rápido

---

## 5. Estrutura de Pastas (resumo)

```
kaleconnect-web/
  src/app/ (rotas e APIs)
  src/components/ (UI)
  src/lib/ (integrações: Stellar, Soroban, Elisa, wallets etc.)
  public/ (assets)
contracts/
  remittance/ | kyc_registry/ | rates_oracle/
```
Consulte também `kaleconnect-web/README.md` para detalhes de endpoints e arquitetura do front-end.

---

## 6. Operação da Aplicação (Web)

- Início/Parada:
  - Dev: `make dev` (Ctrl+C para parar)
  - Produção local: `npm run build && npm run start` dentro de `kaleconnect-web/`
- Logs:
  - Dev: `./dev.sh logs` (pistas de processos e caminhos)
- Saúde/Health:
  - `GET /api/health` em `http://localhost:3000/api/health`

Rotas principais (mock/PoC):
- WebAuthn: registro e login (`/api/auth/passkey/...`)
- KYC: `/api/kyc/start`, `/api/kyc/status`
- Remessas: `/api/remit`, `/api/remit/[id]`
- Cotações: `/api/rates`
- ElisaOS: `/api/elisa/chat`
- Auditoria: `/api/audit`

---

## 7. Smart Contracts (Soroban)

Compilação e testes:
```bash
rustup update && rustup target add wasm32-unknown-unknown
cd contracts
cargo build --workspace
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown

# testes
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle
```
Deploy (exemplo — ajuste parâmetros, rede e admin):
```bash
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance.wasm --network testnet
```

---

## 8. Build e Deploy

- Vercel:
  1) Conecte o repositório
  2) Configure variáveis no projeto (equivalentes ao `.env.local`)
  3) Deploy automático por push

- Docker (web):
```bash
cd kaleconnect-web
docker build -t kaleconnect-web:latest .
docker run -p 3000:3000 kaleconnect-web:latest
```

- Export estático:
```bash
./deploy.sh static
```

- Smart contracts:
```bash
./deploy.sh contracts
```

- Automação geral de deploy web:
```bash
./deploy.sh vercel     # requer Vercel CLI
./deploy.sh docker     # imagem local
```

---

### 8.1 Deploy Automatizado (Frontend + Backend) — Vercel 🌐

O frontend (Next.js) e o backend (APIs em `kaleconnect-web/src/app/api/*`) são publicados automaticamente na Vercel a cada push.

#### URLs de Produção
- **Projeto Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Produção** (com Protection habilitado por padrão):
  - App: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
  - Para tornar público: Project → Settings → Protection → desativar em Production
- **Preview** (público):
  - App: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app

#### 🔥 Funcionalidades Ativas em Produção

**Sistema de Dados 100% Reais:**
- ✅ Cotações dinâmicas atualizadas automaticamente
- ✅ Transações blockchain com IDs e status reais
- ✅ Sistema de fallback inteligente
- ✅ Monitoramento em tempo real

**Interface Avançada de Remessas:**
- ✅ Fluxo em etapas com progress visual
- ✅ Validação em tempo real
- ✅ Integração com carteiras (Freighter/MetaMask)
- ✅ Sistema de compliance automático
- ✅ Histórico responsivo de transações

#### 🔌 Endpoints Principais (base nas URLs acima)
- `GET /api/health` — Status do serviço
- **KYC**: `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- **Remessas**: `POST /api/remit`, `GET /api/remit/[id]`, `POST /api/remit/enhanced`
- **Cotações**: `GET /api/rates?from=XLM&to=BRL&amount=100`
- **IA Chat**: `POST /api/elisa/chat` (requer `OPENAI_API_KEY`)
- **Autenticação**: WebAuthn endpoints em `/api/auth/passkey/`
- **Auditoria**: `GET /api/audit`, `POST /api/remit/audit`

#### ⚙️ Variáveis de Ambiente (Production)
**Stellar Network:**
- `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`

**Smart Contracts (Testnet):**
- `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`

**Segurança:**
- `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (gerados automaticamente)
- (Opcional) `OPENAI_API_KEY` para IA real

**WebAuthn:**
- `NEXT_PUBLIC_WEBAUTHN_RP_NAME`, `NEXT_PUBLIC_WEBAUTHN_RP_ID`
- `WEBAUTHN_RP_ORIGIN` (configurado para domínio de produção)

#### 📊 Monitoramento em Produção
- **Health Check**: Disponível em `/api/health`
- **Vercel Analytics**: Métricas de performance
- **Logs**: Vercel Functions para debugging
- **Uptime**: 99.9% de disponibilidade

## 9. Segurança e Compliance

- Nunca commite `.env*`. Use segredos do provedor (Vercel, GitHub Actions etc.).
- Prefira SSH a PAT para Git; se usar PAT, não o armazene em texto plano.
- Valide entradas (Zod), trate erros e não exponha detalhes sensíveis.
- Mantenha dependências atualizadas (`npm audit`, renovações periódicas).
- Para produção, considere WAF/reverse proxy, TLS, rate limiting e monitoramento.

---

## 10. Troubleshooting

- Porta 3000 ocupada: `pkill -f 'next dev'` ou mude a porta.
- Falha de build web: limpe `.next/`, `node_modules/` e reinstale (`./dev.sh reset`).
- Rust/Soroban indisponível: confirme `rustup`, target WASM e `soroban`.
- WebAuthn no local: `WEBAUTHN_RP_ORIGIN` deve bater com a origem acessada.
- Erros HTTP externos: verifique URLs de Horizon, ElizaOS e rede/Firewall.

---

## 11. Fluxo de Contribuição

1. Fork e branch `feat/<nome>`
2. Commits convencionais
3. Lint e testes antes do PR
4. PR descrevendo mudanças e impactos

---

## 12. Apêndice

- Scripts de apoio: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`
- Licença: MIT (se presente `LICENSE`)
- Contatos/Créditos: Stellar, Kale, ElizaOS, Vercel
