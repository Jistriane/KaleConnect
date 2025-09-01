# 🌿 KaleConnect

**Uma plataforma global de remessas digitais tão fácil quanto conversar no WhatsApp, mas extremamente poderosa, segura e inclusiva.**

Documentação bilíngue do projeto. Escolha um idioma:

- 🇧🇷 Português: [`docs/README.pt-BR.md`](docs/README.pt-BR.md)
- 🇺🇸 English: [`docs/README.en.md`](docs/README.en.md)

## ✨ Visão Rápida / Quick Glance

KaleConnect é uma plataforma inovadora de remessas internacionais que combina a simplicidade de um chat com a segurança e eficiência da tecnologia blockchain.

### 🔗 Principais Características
- **Liquidação Multi-chain Real-time** usando Stellar + Kale Reflector
- **Suporte a Múltiplas Carteiras**: Stellar, EVM, Bitcoin e outras blockchains
- **Autenticação Sem Senha (Passkey)**: Login via biometria/dispositivo usando WebAuthn
- **Assistente Inteligente ElisaOS**: IA para onboarding, suporte e educação financeira
- **Experiência Bilíngue**: Interface em Português (PT-BR) e Inglês
- **Transparência Total**: Cálculo prévio de valores, taxas e tempo de transação
- **Dados Reais**: Sistema conectado a APIs reais com atualizações em tempo real

### 📁 Estrutura do Monorepo
- **`contracts/`**: Smart contracts Soroban (Rust) — KYC Registry, Rates Oracle, Remittance
- **`kaleconnect-web/`**: Aplicação web (Next.js + TypeScript) com backend integrado
- **Scripts auxiliares**: `init.sh`, `dev.sh`, `deploy.sh`, `Makefile`
- **Documentação**: `docs/` com guias completos em PT-BR e EN

### 🚀 Início Rápido
```bash
# 1. Clonar o repositório
git clone https://github.com/Jistriane/KaleConnect.git
cd KaleConnect

# 2. Inicialização automática
./init.sh

# 3. Iniciar desenvolvimento
make dev
# ou ./dev.sh start
```

Acesse: http://localhost:3000

**Para detalhes completos de instalação, configuração, desenvolvimento e deploy, veja os READMEs bilíngues acima.**

## 🚀 Deploy em Produção (Frontend + Backend)

### 🌐 Aplicação Ativa na Vercel Testnet

- **🚀 Aplicação Completa**: https://kaleconnect-qr6bjqgaa-jistrianes-projects.vercel.app
- **🔍 Dashboard Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **🌍 Rede**: Stellar Testnet
- **⚡ Status**: Ativo e Operacional

### 🎯 Deploy Automático Configurado

O frontend (Next.js) e backend (API Routes) são deployados automaticamente na Vercel:
- **Push para `main`**: Deploy produção automático
- **Pull Requests**: Deploy preview para testes
- **Validação contínua**: Lint + build + testes

### 🔧 APIs Backend Disponíveis

- **Health Check**: `/api/health` - Status detalhado do sistema
- **Monitoramento**: `/api/monitoring` - Métricas Prometheus
- **WebAuthn**: `/api/auth/passkey/*` - Autenticação sem senha
- **KYC Registry**: `/api/kyc/*` - Verificação de identidade
- **Rates Oracle**: `/api/rates` - Cotações em tempo real
- **Remittances**: `/api/remit/*` - Transferências internacionais
- **Elisa Chat**: `/api/elisa/chat` - Assistente IA
- **Audit Logs**: `/api/audit` - Logs de auditoria

- **Projeto Vercel**: https://vercel.com/jistrianes-projects/kaleconnect-web
- **Produção** (com proteção habilitada por padrão):
  - App: https://kaleconnect-it15fc381-jistrianes-projects.vercel.app
  - Para tornar público: Vercel → Project → Settings → Protection → desativar em Production
- **Preview** (público):
  - App: https://kaleconnect-b7nr4d6il-jistrianes-projects.vercel.app

### 🔥 Funcionalidades Implementadas

#### ✅ Sistema de Dados Reais
- **Cotações dinâmicas** atualizadas a cada 30 segundos via API real
- **Transações blockchain** com IDs e status reais
- **Verificação KYC** com progressão autêntica
- **Monitoramento em tempo real** de remessas
- **Fallback inteligente** para garantir disponibilidade

#### ✅ Interface Avançada de Remessas
- **Fluxo em etapas** com indicador visual de progresso
- **Validação em tempo real** de todos os campos
- **Integração com carteiras** (Freighter, MetaMask)
- **Sistema de compliance** automático
- **Histórico de transações** responsivo

#### ✅ Scripts de Desenvolvimento
- **`init.sh`**: Setup completo automatizado
- **`dev.sh`**: Utilitários de desenvolvimento avançados
- **`deploy.sh`**: Deploy para múltiplos ambientes
- **`Makefile`**: Interface unificada para tarefas

### 🔌 Endpoints Principais (base: URL acima)
- `GET /api/health` — Status do serviço
- **KYC**: `POST /api/kyc/start`, `GET /api/kyc/status?id=...`
- **Remessas**: `POST /api/remit`, `GET /api/remit/[id]`, `POST /api/remit/enhanced`
- **Cotações**: `GET /api/rates?from=XLM&to=BRL&amount=100`
- **Chat IA**: `POST /api/elisa/chat` (requer `OPENAI_API_KEY`)
- **Autenticação**: WebAuthn/Passkey endpoints em `/api/auth/passkey/`
- **Auditoria**: `GET /api/audit`, `POST /api/remit/audit`

### ⚙️ Variáveis de Ambiente (Production configuradas)
- **Stellar Network**:
  - `NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org`
  - `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015`
- **Smart Contracts**:
  - `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN`
  - `NEXT_PUBLIC_CONTRACT_ID_KYC = CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4`
  - `NEXT_PUBLIC_CONTRACT_ID_RATES = CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT`
- **Segurança**:
  - `APP_CRYPTO_SECRET`, `AUDIT_LOG_SECRET` (gerados automaticamente)
  - (Opcional) `OPENAI_API_KEY` para IA (ElizaOS)
- **WebAuthn**:
  - `NEXT_PUBLIC_WEBAUTHN_RP_NAME`, `NEXT_PUBLIC_WEBAUTHN_RP_ID`
  - `WEBAUTHN_RP_ORIGIN` (ajustar para domínio de produção)

## 📚 Documentação Adicional

### 📄 Guias Detalhados
- [**Implementação de Dados Reais**](REAL_DATA_IMPLEMENTATION.md) — Como o sistema usa APIs reais
- [**Melhorias de Remessas**](REMITTANCE_IMPROVEMENTS.md) — Interface avançada implementada
- [**Scripts de Desenvolvimento**](SCRIPTS.md) — Guia completo dos scripts
- [**Manual de Operação**](docs/MANUAL.pt-BR.md) — Guia operacional completo
- [**Arquitetura**](docs/ARCHITECTURE.pt-BR.md) — Visão técnica do sistema
- [**Guia Soroban**](docs/SOROBAN_GUIDE.pt-BR.md) — Smart contracts
- [**Runbooks**](docs/RUNBOOKS.pt-BR.md) — Procedimentos operacionais

### 🔗 Referências Úteis
- **Explorador Testnet**: https://stellar.expert/explorer/testnet
- **Stellar Development**: https://developers.stellar.org/
- **Soroban Documentation**: https://soroban.stellar.org/docs
- **ElizaOS**: https://github.com/elizaos/eliza

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para conectar o mundo através de remessas inteligentes e seguras.**
