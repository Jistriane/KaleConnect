# 🌿 KaleConnect — Documentação Completa (PT-BR)

**Uma plataforma global de remessas digitais tão fácil quanto conversar no WhatsApp, mas extremamente poderosa, segura e inclusiva.**

Uma plataforma inovadora de remessas internacionais que combina a simplicidade de um chat com a segurança e eficiência da tecnologia blockchain. Este repositório é um monorepo com aplicação web (Next.js) e smart contracts (Rust/Soroban).

- **Repositório**: https://github.com/Jistriane/KaleConnect
- **Principais diretórios**:
  - `kaleconnect-web/`: Aplicação web (Next.js + TypeScript) com backend integrado
  - `contracts/`: Smart contracts Soroban (Rust) para KYC, cotações e remessas
  - Scripts: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile` para desenvolvimento
  - `docs/`: Documentação bilíngue completa

## ✨ Diferenciais-Chave do KaleConnect

- 🔗 **Liquidação Multi-chain Real-time** usando Stellar + Kale Reflector
- 💼 **Suporte a Múltiplas Carteiras**: Stellar, EVM, Bitcoin e outras blockchains populares
- 🔐 **Autenticação Sem Senha (Passkey)**: Login via biometria/dispositivo usando WebAuthn
- 🤖 **Assistente Inteligente ElisaOS**: IA para onboarding, suporte e educação financeira
- 🌍 **Experiência Bilíngue**: Interface em Português (PT-BR) e Inglês
- 💰 **Transparência Total**: Cálculo prévio de valores, taxas e tempo de transação
- 🔥 **Dados 100% Reais**: Sistema conectado a APIs reais com atualizações em tempo real
- 🚀 **Interface Avançada**: Fluxo em etapas, validação inteligente e UX moderna

---

## 📦 Stack & Tecnologias Modernos

### Frontend & UI
- **Next.js 15** (App Router) com **React 19** para renderização otimizada
- **Tailwind CSS 4** para estilização moderna e responsiva
- **TypeScript** com strict mode para type safety
- **Next-intl** para internacionalização (PT-BR/EN)

### Autenticação & Segurança
- **WebAuthn/Passkey** (`@simplewebauthn/browser`, `@simplewebauthn/server`)
- **Zod** para validação de dados runtime
- **Crypto secrets** para auditoria e segurança

### Blockchain & Carteiras
- **Stellar SDK** (`@stellar/stellar-sdk`) para transações XLM
- **Freighter API** para integração com carteiras Stellar
- **Ethers.js** para suporte EVM (MetaMask, WalletConnect)
- **Multi-chain** via Kale Reflector

### IA & Assistente
- **ElizaOS Core** (`@elizaos/core`) para assistente inteligente
- **OpenAI integration** para chat avançado
- **Context-aware responses** para educação financeira

### Smart Contracts
- **Rust + Soroban** (WASM target `wasm32-unknown-unknown`)
- **Contracts**: KYC Registry, Rates Oracle, Remittance
- **Testnet deployment** com IDs configurados

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
├── docs/                       # Documentação bilíngue completa
│   ├── README.pt-BR.md         # Este arquivo
│   ├── README.en.md            # Versão em inglês
│   ├── MANUAL.pt-BR.md         # Manual completo de operação
│   ├── ARCHITECTURE.pt-BR.md   # Arquitetura técnica
│   ├── SOROBAN_GUIDE.pt-BR.md  # Guia de smart contracts
│   └── RUNBOOKS.pt-BR.md       # Procedimentos operacionais
├── init.sh                     # Setup completo do projeto
├── dev.sh                      # Utilidades de desenvolvimento
├── deploy.sh                   # Automação de deploy
├── Makefile                    # Atalhos para tarefas
└── README.md                   # Índice bilíngue
```

---

## 🚀 Começando Rápido

### Pré-requisitos
- **Node.js 18+** e **npm** (essenciais)
- **Git** para clonagem e versionamento
- **(Opcional)** **Rust + Cargo + Soroban CLI** para smart contracts

### Instalação Automatizada
```bash
# 1) Clonar o repositório
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2) Inicialização completa automatizada
./init.sh
# O script irá:
# ✅ Verificar dependências do sistema
# ✅ Instalar pacotes (raiz + kaleconnect-web)
# ✅ Configurar ambiente Rust (se disponível)
# ✅ Criar .env.local com configurações padrão
# ✅ Compilar e testar smart contracts
# ✅ Fazer build de verificação

# 3) Iniciar desenvolvimento (escolha uma opção)
make dev                      # 🔥 Recomendado - usando Makefile
./dev.sh start               # 🛠️ Usando script utilitário
cd kaleconnect-web && npm run dev  # 📝 Manual
```

### Acesso

🌐 **Aplicação Local**: http://localhost:3000
🔍 **Health Check**: http://localhost:3000/api/health
📊 **Demo Interativa**: http://localhost:3000/ (página inicial)
🚀 **Demo Avançada**: http://localhost:3000/enhanced-demo

---

## ⚙️ Configuração de Ambiente

Arquivo `.env.local` criado automaticamente em `kaleconnect-web/.env.local` pelo `init.sh`:

### Configurações de Desenvolvimento
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
# Para habilitar IA real, configure:
# OPENAI_API_KEY=your-openai-api-key

# Security (Generated automatically)
APP_CRYPTO_SECRET=auto-generated-secret
AUDIT_LOG_SECRET=auto-generated-secret
```

### Ajustes para Produção
⚠️ **IMPORTANTE**: Para produção, ajuste:
- `WEBAUTHN_RP_ID` e `WEBAUTHN_RP_ORIGIN` para seu domínio
- Configure `OPENAI_API_KEY` para IA real
- Use secrets seguros para `APP_CRYPTO_SECRET` e `AUDIT_LOG_SECRET`
- Considere usar Stellar Mainnet

---

## 🧵 Scripts & Ferramentas de Desenvolvimento

### 🚀 Scripts Principais

#### `init.sh` - Setup Completo
```bash
./init.sh  # Inicialização completa do projeto
```
- ✅ Verifica dependências (Node.js, npm, Rust)
- ✅ Instala pacotes (raiz + kaleconnect-web)
- ✅ Configura ambiente Rust/Soroban
- ✅ Cria `.env.local` com configurações
- ✅ Compila e testa smart contracts
- ✅ Executa build de verificação

#### `dev.sh` - Utilitários de Desenvolvimento
```bash
./dev.sh [COMANDO]
```
**Comandos disponíveis:**
- `start` — Iniciar servidor de desenvolvimento
- `build` — Build de produção
- `test` — Executar todos os testes
- `lint` — Verificar código com linter
- `contracts` — Compilar smart contracts
- `contracts-test` — Testar smart contracts
- `clean` — Limpar arquivos de build
- `reset` — Reset completo (limpar + reinstalar)
- `logs` — Mostrar logs do servidor
- `status` — Verificar status dos serviços

#### `deploy.sh` - Deploy Automatizado
```bash
./deploy.sh [AMBIENTE] [OPÇÕES]
```
**Ambientes:**
- `vercel` — Deploy para Vercel
- `docker` — Build e deploy com Docker
- `static` — Build estático para hosting
- `contracts` — Deploy de smart contracts

#### `Makefile` - Interface Unificada
```bash
make [COMANDO]
```
**Comandos principais:**
- `make init` — Inicializar projeto completo
- `make dev` — Iniciar desenvolvimento 🔥
- `make build` — Build de produção
- `make test` — Executar testes
- `make lint` — Verificar código
- `make contracts` — Compilar contratos
- `make status` — Status dos serviços
- `make clean` — Limpar builds

### 📄 Exemplos de Uso
```bash
# Setup inicial completo
make init

# Desenvolvimento diário
make dev

# Verificar código antes de commit
make lint && make test

# Limpar e reiniciar
./dev.sh reset

# Deploy para produção
./deploy.sh vercel

# Manual (aplicação web apenas)
cd kaleconnect-web
npm run dev
npm run build
npm run start
```

---

## 🔌 API Backend Integrado (Next.js App Router)

Todos os handlers de API residem em `kaleconnect-web/src/app/api/*` e fornecem **dados 100% reais**.

### 👥 Autenticação WebAuthn/Passkey
- `GET /api/auth/passkey/register/options?username=<email>` — Opções de registro
- `POST /api/auth/passkey/register/verify` — Verificar registro
- `GET /api/auth/passkey/login/options?username=<email>` — Opções de login
- `POST /api/auth/passkey/login/verify` — Verificar login

### 📋 KYC (Know Your Customer)
- `POST /api/kyc/start` — Iniciar processo KYC
- `GET /api/kyc/status?id=<kycId>` — Status do KYC
  - **Progressão real**: `pending` → `review` → `approved`

### 💸 Remessas (Transferências)
- `POST /api/remit` — Criar remessa padrão
- `POST /api/remit/enhanced` — Criar remessa avançada 🆕
- `GET /api/remit/[id]` — Status da remessa
  - **Progressão real**: `created` → `submitted` → `settled`
- `POST /api/remit/audit` — Logs de auditoria

### 💱 Cotações em Tempo Real
- `GET /api/rates?from=XLM&to=BRL&amount=100` — Obter cotação
  - **Atualização automática**: A cada 30 segundos
  - **Moedas suportadas**: XLM, USDC, BRL, USD, EUR

### 🤖 ElisaOS (Assistente IA)
- `POST /api/elisa/chat` — Interagir com assistente
  - **Require**: `OPENAI_API_KEY` para IA real
  - **Fallback**: Respostas simuladas se chave ausente

### 📊 Monitoramento & Auditoria
- `GET /api/health` — Status do serviço
- `GET /api/audit` — Logs de auditoria e compliance

### 📄 Exemplos de Uso (cURL)
```bash
# Iniciar KYC
curl -X POST http://localhost:3000/api/kyc/start \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user123"}'

# Criar remessa avançada
curl -X POST http://localhost:3000/api/remit/enhanced \
  -H 'Content-Type: application/json' \
  -d '{
    "from":"XLM","to":"BRL","amount":50,
    "recipientAddress":"GABC...",
    "purpose":"family_support"
  }'

# Obter cotação atual
curl 'http://localhost:3000/api/rates?from=XLM&to=BRL&amount=100'

# Verificar saúde
curl http://localhost:3000/api/health
```

**Para mais exemplos detalhados, consulte**: [`kaleconnect-web/README.md`](../kaleconnect-web/README.md)

---

## 🦀 Smart Contracts (Rust/Soroban)

### 🏢 Contratos Disponíveis

1. **Remittance Contract** — Gerencia transferências
2. **KYC Registry** — Verificação de identidade
3. **Rates Oracle** — Cotações de moedas

### 🛠️ Desenvolvimento Local

#### Setup do Ambiente Rust
```bash
# Instalar Rust e ferramentas
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update
rustup target add wasm32-unknown-unknown

# Instalar Soroban CLI
cargo install --locked soroban-cli

# Verificar instalação
soroban --version
```

#### Compilação
```bash
cd contracts

# Build para desenvolvimento
cargo build --workspace

# Build WASM para produção
cargo build -p remittance --release --target wasm32-unknown-unknown
cargo build -p kyc_registry --release --target wasm32-unknown-unknown
cargo build -p rates_oracle --release --target wasm32-unknown-unknown

# Usando scripts (mais fácil)
../dev.sh contracts
```

#### Testes
```bash
cd contracts

# Testar todos os contratos
cargo test --workspace

# Testar contrato específico
cargo test -p remittance
cargo test -p kyc_registry
cargo test -p rates_oracle

# Usando script
../dev.sh contracts-test
```

### 🚀 Deploy dos Contratos

#### Testnet (Configurado)
Os contratos já estão deployados na Stellar Testnet:
- **Remittance**: `CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
- **KYC Registry**: `CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
- **Rates Oracle**: `CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`

#### Deploy Manual (Avançado)
```bash
# Preparar ambiente
export SOROBAN_NETWORK=testnet
export ADMIN_SECRET=<YOUR_STELLAR_SECRET_KEY>

# Deploy de exemplo
soroban contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/remittance.wasm \
  --network $SOROBAN_NETWORK \
  --source $ADMIN_SECRET

# Usando script automatizado
./deploy.sh contracts
```

#### Invocação dos Contratos
```bash
# Inicializar contrato
soroban contract invoke \
  --id CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN \
  --fn init \
  --arg admin=GXXXXXXX...

# Definir taxa de câmbio
soroban contract invoke \
  --id CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT \
  --fn set_rate \
  --arg from=XLM --arg to=BRL --arg rate=1.85
```

**Para guia completo de Soroban**: [`docs/SOROBAN_GUIDE.pt-BR.md`](SOROBAN_GUIDE.pt-BR.md)

---

## 🚀 Deploy & Produção

### 🌐 Vercel (Recomendado) - Deploy Automático

A aplicação está configurada para deploy automático na Vercel:

#### 🔗 URLs de Produção
- **Projeto Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Produção**: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
- **Preview**: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app (público)

#### 🔄 Processo de Deploy
1. **Push para `main`** → Deploy automático
2. **Variáveis de ambiente** já configuradas na Vercel
3. **Build e testes** executados automaticamente
4. **Deploy instantâneo** sem downtime

#### ⚙️ Configuração Vercel
Para novo deploy Vercel:
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer deploy
cd kaleconnect-web
vercel

# 3. Ou usar script
./deploy.sh vercel
```

### 🐳 Docker - Deploy em Container

#### Build e Execução
```bash
cd kaleconnect-web

# Build da imagem
docker build -t kaleconnect-web:latest .

# Executar container
docker run -d \
  --name kale-web \
  -p 3000:3000 \
  --env-file .env.local \
  kaleconnect-web:latest

# Verificar logs
docker logs -f kale-web

# Parar container
docker stop kale-web && docker rm kale-web
```

#### Docker Compose (Opcional)
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

### 📞 Export Estático (Hosting Tradicional)

```bash
# Gerar build estático
./deploy.sh static

# Ou manualmente
cd kaleconnect-web
npm run build
npm run export  # Se configurado

# Os arquivos ficam em kaleconnect-web/out/
# Copiar para seu servidor web (Nginx, Apache, etc.)
```

### 🦀 Smart Contracts Deploy

```bash
# Deploy automático
./deploy.sh contracts

# O script irá:
# ✅ Compilar todos os contratos para WASM
# ✅ Exibir comandos de deploy do Soroban
# ✅ Gerar arquivos de configuração
```

### 🔍 Monitoramento de Produção

#### Health Checks
- **Aplicação**: `GET /api/health`
- **Vercel Analytics**: Disponível no dashboard
- **Logs**: Vercel Functions logs

#### Métricas Importantes
- **Latência** das APIs
- **Taxa de erro** (5xx)
- **Disponibilidade** do Stellar Horizon
- **Performance** das cotações em tempo real

**Para procedimentos operacionais completos**: [`docs/RUNBOOKS.pt-BR.md`](RUNBOOKS.pt-BR.md)

---

### 🆕 Funcionalidades Implementadas Recentemente

#### ✅ Sistema de Dados 100% Reais
Substituímos completamente as simulações por **dados reais das APIs**:
- **Cotações dinâmicas** atualizadas a cada 30s via `/api/rates`
- **Transações blockchain** com IDs e status reais progressivos
- **Verificação KYC** com progressão autêntica
- **Monitoramento em tempo real** de remessas a cada 5s
- **Sistema de fallback** inteligente para garantir disponibilidade

#### ✅ Interface Avançada de Remessas
Interfacing completamente redesenhada:
- **Fluxo em etapas** com indicador visual de progresso
- **Validação em tempo real** de todos os campos
- **Integração com carteiras** (Freighter Stellar, MetaMask EVM)
- **Sistema de compliance** automático com bloqueios inteligentes
- **Histórico de transações** responsivo e detalhado
- **Conversor de moedas** com atualização automática

#### ✅ Scripts de Desenvolvimento Avançados
Ferramentas robustas para desenvolvimento:
- **`init.sh`** com setup automatizado completo
- **`dev.sh`** com 12+ utilitários (start, build, test, clean, etc.)
- **`deploy.sh`** para múltiplos ambientes (Vercel, Docker, static)
- **`Makefile`** com interface unificada para todas as tarefas

**Para detalhes técnicos completos**:
- [Implementação de Dados Reais](../REAL_DATA_IMPLEMENTATION.md)
- [Melhorias de Remessas](../REMITTANCE_IMPROVEMENTS.md)
- [Scripts de Desenvolvimento](../SCRIPTS.md)

---

## 🔐 Segurança & Compliance

### 🔒 Autenticação Sem Senha
- **WebAuthn/Passkey** para login sem senha
- **Biometria** e autenticadores de dispositivo
- **Multi-device support** para conveniência
- **Resistência a phishing** nativa

### 🛡️ Validação & Sanitização
- **Zod schemas** para validação runtime rigorosa
- **Input sanitization** em todas as rotas de API
- **Type safety** com TypeScript strict mode
- **Error boundaries** para captura segura de erros

### 🔑 Gerenciamento de Segredos
- **Variáveis de ambiente** para todas as configurações sensíveis
- **Auto-generated secrets** para crypto e auditoria
- **Nunca commitar** arquivos `.env*`
- **Prefira SSH** sobre PAT para operações Git

### 📊 Auditoria & Compliance
- **Logs completos** de todas as transações
- **Sistema de compliance** automático para valores altos
- **Verificação KYC** integrada
- **Rate limiting** implícito via timeouts

### 🔄 Manutenção de Segurança
```bash
# Auditoria de dependências
npm audit

# Atualização de pacotes
npm update

# Verificação de vulnerabilidades
make security  # Se disponível
```

### 🏢 Considerações para Produção
- **WAF/Reverse proxy** para proteção adicional
- **TLS/HTTPS** obrigatório
- **Rate limiting** customizado
- **Monitoramento** de segurança 24/7
- **Backup** de dados críticos
- **Incident response plan** documentado

---

## 🧩 Convenções & Qualidade de Código

### 📝 Padrões de Código
- **TypeScript strict mode** sempre que possível
- **ESLint** com configuração Next.js
- **Prettier** para formatação consistente
- **Naming conventions** claras e descritivas

### 📋 Commits Convencionais
```bash
feat: adicionar nova funcionalidade
fix: corrigir bug específico
chore: tarefas de manutenção
docs: atualizar documentação
style: formatação de código
refactor: refatoração sem mudança funcional
test: adicionar ou corrigir testes
perf: melhorias de performance
```

### 🛠️ Fluxo de Desenvolvimento
```bash
# Antes de cada commit
make lint    # Verificar código
make test    # Executar testes

# Antes de PR
make build   # Garantir que builda
make status  # Verificar saúde geral
```

### 📂 Estrutura de Arquivos
- **Componentes**: PascalCase (`CurrencyConverter.tsx`)
- **Utilitários**: camelCase (`wallets.ts`, `elisa.ts`)
- **APIs**: kebab-case para rotas (`/api/auth/passkey/`)
- **Constantes**: UPPER_SNAKE_CASE

### 📏 Documentação
- **JSDoc** para funções complexas
- **README** atualizado para cada feature nova
- **Comentários** explicando "por quê", não "o quê"
- **Exemplos** de uso em APIs e utilitários

---

## 🛠️ Solução de Problemas

### 🚫 Problemas Comuns de Setup

#### Erro "Porta 3000 ocupada"
```bash
# Verificar processos na porta
lsof -i :3000

# Parar processo Next.js
pkill -f "next dev"

# Ou usar porta alternativa
PORT=3001 npm run dev
```

#### Falha de Build/Dependências
```bash
# Reset completo
./dev.sh reset

# Ou manual
rm -rf node_modules package-lock.json
rm -rf kaleconnect-web/node_modules kaleconnect-web/package-lock.json
npm install
cd kaleconnect-web && npm install
```

#### Problemas com Rust/Smart Contracts
```bash
# Verificar instalação Rust
rustc --version
cargo --version

# Reinstalar target WASM
rustup target remove wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown

# Recompilar contratos
cd contracts
cargo clean
cargo build --workspace
```

### 🌐 Problemas de Rede/APIs

#### WebAuthn em Desenvolvimento
```bash
# Verificar configuração
echo $WEBAUTHN_RP_ORIGIN  # Deve ser http://localhost:3000
echo $NEXT_PUBLIC_WEBAUTHN_RP_ID  # Deve ser localhost

# Usar HTTPS local (se necessário)
npx local-ssl-proxy --source 3001 --target 3000
```

#### Falhas de APIs Externas
```bash
# Testar conectividade Stellar
curl https://horizon-testnet.stellar.org/

# Verificar configuração Soroban
curl https://soroban-testnet.stellar.org/health

# Verificar variáveis de ambiente
cd kaleconnect-web
cat .env.local | grep -E "HORIZON|SOROBAN"
```

### 📊 Diagnóstico Rápido

```bash
# Status geral do sistema
make status

# Informações do projeto
make info

# Versões das ferramentas
make version

# Logs detalhados
./dev.sh logs

# Health check da aplicação
curl http://localhost:3000/api/health
```

### 🐛 Depuração Avançada

#### Logs do Next.js
```bash
# Modo debug
DEBUG=* npm run dev

# Logs detalhados
NODE_ENV=development LOG_LEVEL=debug npm run dev
```

#### Debug de Smart Contracts
```bash
# Testes com output detalhado
cd contracts
cargo test -- --nocapture

# Build com debug info
cargo build --workspace --verbose
```

#### Verificação de Performance
```bash
# Analyzer de bundle (Next.js)
npm run analyze  # Se configurado

# Monitor de memória
top -p $(pgrep -f "next dev")

# Network requests
# Usar DevTools -> Network tab
```

### 🆘 Obter Ajuda

Se os problemas persistirem:

1. **Verifique issues** no repositório GitHub
2. **Consulte logs** detalhados com `./dev.sh logs`
3. **Execute diagnóstico** com `make status`
4. **Documente o erro** com steps para reproduzir
5. **Abra uma issue** com as informações coletadas

**Para procedimentos operacionais em produção**: [`docs/RUNBOOKS.pt-BR.md`](RUNBOOKS.pt-BR.md)

---

## 🗺️ Roadmap de Desenvolvimento

### ✅ MVP Concluído (v0.1.0)
- ✅ **Autenticação WebAuthn/Passkey** funcionando
- ✅ **Interface bilíngue** (PT-BR/EN) completa
- ✅ **Assistente ElizaOS** integrado
- ✅ **Sistema de dados reais** das APIs
- ✅ **Interface avançada** de remessas
- ✅ **Integração Stellar** básica
- ✅ **Smart contracts** deployados na Testnet
- ✅ **Scripts de desenvolvimento** completos
- ✅ **Deploy automatizado** na Vercel

### 🔄 Fase 1.5 - Aprimoramentos (Em Desenvolvimento)
- 🔄 **Integração Freighter** completa para transações reais
- 🔄 **Suporte MetaMask** para tokens EVM
- 🔄 **Testes automatizados** (Jest + Testing Library)
- 🔄 **Monitoramento** de performance
- 🔄 **PWA** para uso offline

### 🚀 Fase 2 - Escalação (Q2 2024)
- 📅 **Kale Reflector** para cross-chain real
- 📅 **KYC automatizado** com verificação de documentos
- 📅 **Cash-in/Cash-out** com parceiros locais
- 📅 **App mobile** (React Native)
- 📅 **Dashboard analytics** para usuários
- 📅 **Notificações push** para status updates

### 🌍 Fase 3 - Expansão Global (Q3-Q4 2024)
- 📅 **Staking e yield farming** integrados
- 📅 **Programa de afiliados** com incentivos
- 📅 **API pública** para desenvolvedores
- 📅 **Suporte a mais blockchains** (Ethereum, Polygon, BSC)
- 📅 **Parcerias bancárias** via Open Banking
- 📅 **Conformidade regulatória** em múltiplos países

### 🔮 Fase 4 - Inovação (2025)
- 📅 **DeFi integrado** com pools de liquidez
- 📅 **Carteira multi-sig** corporativa
- 📅 **IA avançada** para detecção de fraudes
- 📅 **Programa de educação** financeira
- 📅 **Mercado P2P** para cambio
- 📅 **Tokenização** de ativos reais

### 📊 Métricas de Sucesso

**Fase 1.5**:
- 99.9% uptime
- < 2s tempo de resposta
- 100% cobertura de testes

**Fase 2**:
- 10,000+ usuários ativos
- $1M+ em volume de transações
- 5+ países atendidos

**Fase 3**:
- 100,000+ usuários
- $50M+ volume mensal
- 20+ países
- Parcerias com 10+ instituições financeiras

---

## 🤝 Contribuindo para o KaleConnect

### 🚀 Começando a Contribuir

1. **Fork o repositório**
   ```bash
   git clone https://github.com/SEU_USERNAME/KaleConnect.git
   cd KaleConnect
   ```

2. **Setup do ambiente**
   ```bash
   ./init.sh  # Setup automatizado
   make dev   # Iniciar desenvolvimento
   ```

3. **Criar branch para feature**
   ```bash
   git checkout -b feature/amazing-feature
   # ou
   git checkout -b fix/bug-description
   # ou
   git checkout -b docs/update-readme
   ```

### 📝 Diretrizes de Contribuição

#### Tipos de Contribuição
- 🎆 **Features**: Novas funcionalidades
- 🐛 **Bug fixes**: Correções de bugs
- 📚 **Documentação**: Melhorias na docs
- 🎨 **UI/UX**: Melhorias de interface
- ⚙️ **Performance**: Otimizações
- 🛠️ **Tooling**: Scripts e ferramentas
- 🧪 **Testes**: Cobertura de testes

#### Padrões de Código
```bash
# Antes de commitar
make lint     # Verificar ESLint
make test     # Executar testes
make build    # Garantir que compila
```

#### Commit Messages
```bash
# Usar conventional commits
feat(remit): add enhanced remittance flow
fix(auth): resolve WebAuthn registration issue
docs(api): update endpoint documentation
style(ui): improve button consistency
refactor(wallets): simplify connection logic
test(kyc): add KYC workflow tests
chore(deps): update dependencies
```

### 📝 Pull Request Process

1. **Antes do PR**
   ```bash
   # Sync com main
   git checkout main
   git pull upstream main
   git checkout feature/your-feature
   git rebase main
   
   # Verificar qualidade
   make lint && make test && make build
   ```

2. **Criar PR com**:
   - 📝 **Título claro** descrevendo a mudança
   - 📋 **Descrição detalhada** do que foi implementado
   - 📏 **Screenshots** se for UI/UX
   - 🧪 **Testes** adicionados ou atualizados
   - 🔗 **Links** para issues relacionadas

3. **Template de PR**:
   ```markdown
   ## Descrição
   Breve descrição das mudanças.
   
   ## Tipo de Mudança
   - [ ] Bug fix
   - [ ] Nova feature
   - [ ] Breaking change
   - [ ] Documentação
   
   ## Como Testar
   Passos para testar as mudanças.
   
   ## Checklist
   - [ ] Código segue padrões do projeto
   - [ ] Testes passam
   - [ ] Documentação atualizada
   ```

### 🎓 Áreas de Contribuição

#### Para Iniciantes
- 📚 **Documentação**: Melhorar READMEs e guias
- 🌎 **Traduções**: Expandir suporte a idiomas
- 🐛 **Bug reports**: Encontrar e reportar issues
- 🧪 **Testes**: Adicionar casos de teste

#### Para Intermediários
- 🎨 **UI Components**: Novos componentes React
- 🔌 **API Endpoints**: Novos endpoints ou melhorias
- 📱 **Responsividade**: Melhorar layout mobile
- ⚡ **Performance**: Otimizar carregamento

#### Para Avançados
- 🦀 **Smart Contracts**: Novos contratos Soroban
- 🔗 **Blockchain Integration**: Novas redes
- 🤖 **AI/ElizaOS**: Melhorias no assistente
- 🛡️ **Security**: Auditorias e melhorias

### 🎆 Reconhecimento

Contribuidores são reconhecidos:
- 🏆 **Contributors list** no README
- 📊 **GitHub badges** de contribuição
- 🌟 **Mentions** nas release notes
- 🎁 **Swag** para contribuições significativas

### 💬 Comunidade

- 💬 **Discussions**: GitHub Discussions para ideias
- 🐛 **Issues**: Bug reports e feature requests
- 📚 **Wiki**: Documentação colaborativa
- 🚀 **Projects**: Kanban boards públicos

**Obrigado por contribuir para conectar o mundo através de remessas inteligentes!** 🌍❤️

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](../LICENSE) para detalhes.

### 🔓 Resumo da Licença MIT

- ✅ **Uso comercial** permitido
- ✅ **Modificação** permitida
- ✅ **Distribuição** permitida
- ✅ **Uso privado** permitido
- ⚠️ **Inclusão do copyright** obrigatória
- ❌ **Garantia** não fornecida
- ❌ **Responsabilidade** não assumida

---

## 🙏 Agradecimentos e Créditos

### 🏢 Tecnologias Fundamentais
- **[Stellar Development Foundation](https://stellar.org/)** - Infraestrutura blockchain e Soroban
- **[Kale](https://kale.money/)** - Reflector e ferramentas Stellar
- **[ElizaOS](https://github.com/elizaos/eliza)** - Plataforma de IA para assistentes
- **[Vercel](https://vercel.com/)** - Hosting e ferramentas de desenvolvimento

### 🛠️ Ferramentas & Bibliotecas
- **[Next.js](https://nextjs.org/)** - Framework React full-stack
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[TypeScript](https://typescriptlang.org/)** - JavaScript com tipos
- **[Zod](https://zod.dev/)** - Validação de schema
- **[SimpleWebAuthn](https://simplewebauthn.dev/)** - Implementação WebAuthn

### 👥 Comunidade Open Source
- **Todos os contribuidores** que tornaram este projeto possível
- **Comunidade Stellar** pelo suporte e feedback
- **Desenvolvedores Next.js** pela plataforma incrível
- **Ecosystem Rust/WASM** por smart contracts seguros

### 🎆 Reconhecimentos Especiais
- **Programa Stellar Community Fund** por apoiar inovação
- **Hackathons e eventos** que inspiraram o projeto
- **Early adopters** que testaram e forneceram feedback
- **Time de desenvolvimento** dedicado ao projeto

---

## 🌍 Conexões

### 🔗 Links do Projeto
- **Repositório**: https://github.com/Jistriane/KaleConnect
- **Aplicação Live**: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
- **Documentação**: https://github.com/Jistriane/KaleConnect/tree/main/docs

### 💬 Redes Sociais
- **GitHub**: [@Jistriane](https://github.com/Jistriane)
- **Stellar Community**: Participe das discussões
- **Discord**: Junte-se à comunidade Stellar

---

**🌿 Desenvolvido com ❤️ para conectar o mundo através de remessas inteligentes e seguras.**

> *"Money should move as easily as information"* - Vision do KaleConnect

---

🗨️ **Última atualização**: Janeiro 2025 | 📚 **Versão da documentação**: 2.0.0