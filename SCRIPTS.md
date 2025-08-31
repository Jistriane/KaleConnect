# 🛠️ Scripts de Desenvolvimento - KaleConnect

Este documento descreve todos os scripts e ferramentas disponíveis para desenvolvimento do projeto KaleConnect.

## 📋 Visão Geral dos Scripts

### 🚀 `init.sh` - Script de Inicialização
**Propósito**: Configurar completamente o ambiente de desenvolvimento do zero.

```bash
./init.sh
```

**O que faz:**
- ✅ Verifica dependências do sistema (Node.js, npm, Rust)
- ✅ Configura ambiente Rust para smart contracts
- ✅ Instala todas as dependências (raiz + web app)
- ✅ Compila smart contracts Soroban
- ✅ Executa testes dos contratos
- ✅ Cria arquivo `.env.local` com configurações padrão
- ✅ Testa build da aplicação
- ✅ Exibe instruções finais

### 🔥 `dev.sh` - Script de Desenvolvimento
**Propósito**: Facilitar tarefas comuns durante o desenvolvimento.

```bash
./dev.sh [COMANDO]
```

**Comandos disponíveis:**
- `start` - Iniciar servidor de desenvolvimento
- `build` - Build de produção
- `test` - Executar todos os testes
- `lint` - Verificar código com linter
- `contracts` - Compilar smart contracts
- `contracts-test` - Testar smart contracts
- `clean` - Limpar arquivos de build
- `reset` - Reset completo (limpar + reinstalar)
- `logs` - Mostrar logs do servidor
- `status` - Verificar status dos serviços
- `help` - Mostrar ajuda

**Exemplos:**
```bash
./dev.sh start        # Iniciar desenvolvimento
./dev.sh test         # Executar testes
./dev.sh clean        # Limpar builds
./dev.sh status       # Ver status dos serviços
```

### 🚀 `deploy.sh` - Script de Deploy
**Propósito**: Deploy para diferentes ambientes de produção.

```bash
./deploy.sh [AMBIENTE] [OPÇÕES]
```

**Ambientes:**
- `vercel` - Deploy para Vercel
- `docker` - Build e deploy com Docker
- `static` - Build estático para hosting
- `contracts` - Deploy de smart contracts

**Opções:**
- `--dry-run` - Simular deploy sem executar
- `--skip-tests` - Pular testes antes do deploy
- `--skip-build` - Pular build (usar build existente)

**Exemplos:**
```bash
./deploy.sh vercel                # Deploy para Vercel
./deploy.sh docker --dry-run      # Simular deploy Docker
./deploy.sh static --skip-tests   # Build estático sem testes
./deploy.sh contracts             # Deploy smart contracts
```

### 🔧 `Makefile` - Comandos Make
**Propósito**: Interface unificada para todos os comandos.

```bash
make [COMANDO]
```

**Comandos principais:**
```bash
make help          # Mostrar ajuda
make init          # Inicializar projeto completo
make dev           # Iniciar servidor de desenvolvimento
make build         # Build de produção
make test          # Executar todos os testes
make lint          # Verificar código com linter
make clean         # Limpar arquivos de build
make status        # Verificar status dos serviços
```

**Comandos específicos:**
```bash
# Aplicação Web
make web-dev       # Iniciar apenas a aplicação web
make web-build     # Build apenas da aplicação web
make web-install   # Instalar dependências da aplicação web

# Smart Contracts
make rust-setup    # Configurar ambiente Rust
make rust-build    # Compilar smart contracts para WASM
make rust-test     # Testar smart contracts
make rust-clean    # Limpar build Rust

# Utilitários
make install       # Instalar todas as dependências
make update        # Atualizar dependências
make security      # Verificar vulnerabilidades
make info          # Mostrar informações do projeto
make version       # Mostrar versões das ferramentas
```

## 🎯 Fluxos de Trabalho Recomendados

### 🆕 Primeiro Setup (Novo Desenvolvedor)
```bash
# 1. Clonar o repositório
git clone <repo-url>
cd KaleConnect

# 2. Executar inicialização completa
./init.sh
# ou
make init

# 3. Iniciar desenvolvimento
./dev.sh start
# ou
make dev
```

### 💻 Desenvolvimento Diário
```bash
# Verificar status
make status

# Iniciar servidor
make dev

# Executar testes
make test

# Verificar código
make lint

# Limpar builds quando necessário
make clean
```

### 🚀 Deploy para Produção
```bash
# 1. Verificar tudo está OK
make check    # lint + test

# 2. Deploy para Vercel
./deploy.sh vercel

# 3. Ou build estático
./deploy.sh static

# 4. Ou Docker
./deploy.sh docker
```

### 🦀 Trabalho com Smart Contracts
```bash
# Setup inicial do Rust
make rust-setup

# Compilar contratos
make rust-build
# ou
./dev.sh contracts

# Testar contratos
make rust-test
# ou
./dev.sh contracts-test

# Deploy contratos
./deploy.sh contracts
```

## 📁 Estrutura de Arquivos Gerados

```
KaleConnect/
├── init.sh              # Script de inicialização
├── dev.sh               # Script de desenvolvimento
├── deploy.sh            # Script de deploy
├── Makefile             # Comandos Make
├── package.json         # Dependências e scripts npm
├── kaleconnect-web/
│   ├── .env.local       # Variáveis de ambiente (criado pelo init.sh)
│   ├── .next/           # Build Next.js
│   └── out/             # Export estático (quando aplicável)
└── contracts/
    └── target/          # Builds Rust
        ├── debug/       # Build de desenvolvimento
        ├── release/     # Build de produção
        └── wasm32-unknown-unknown/
            └── release/ # Arquivos WASM para deploy
```

## 🔧 Configuração de Variáveis de Ambiente

O script `init.sh` cria automaticamente o arquivo `kaleconnect-web/.env.local` com configurações padrão:

```env
# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# WebAuthn Configuration
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3000

# ElizaOS Configuration
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here

# Development
NODE_ENV=development
```

**⚠️ IMPORTANTE**: Revise e ajuste essas variáveis conforme necessário para seu ambiente.

## 🐛 Troubleshooting

### Problemas Comuns

**1. Erro "comando não encontrado"**
```bash
# Verificar se os scripts têm permissão de execução
chmod +x init.sh dev.sh deploy.sh
```

**2. Erro de dependências**
```bash
# Reset completo
make reset
# ou
./dev.sh reset
```

**3. Problemas com Rust/Smart Contracts**
```bash
# Configurar ambiente Rust
make rust-setup
# ou instalar manualmente
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**4. Porta 3000 ocupada**
```bash
# Verificar processos na porta
lsof -i :3000

# Parar processo Next.js
pkill -f "next dev"
```

### Logs e Debugging

```bash
# Verificar status geral
make status

# Ver informações do projeto
make info

# Ver versões das ferramentas
make version

# Verificar logs (se servidor rodando)
./dev.sh logs
```

## 📚 Scripts Personalizados no package.json

O arquivo `package.json` na raiz inclui scripts que chamam os scripts bash:

```json
{
  "scripts": {
    "init": "./init.sh",
    "dev": "./dev.sh start",
    "build": "./dev.sh build",
    "test": "./dev.sh test",
    "lint": "./dev.sh lint",
    "clean": "./dev.sh clean",
    "contracts": "./dev.sh contracts",
    "status": "./dev.sh status"
  }
}
```

Isso permite usar tanto:
```bash
npm run dev    # ou
make dev       # ou
./dev.sh start
```

## 🎉 Conclusão

Com esses scripts, o desenvolvimento do KaleConnect fica muito mais organizado e eficiente:

- **Setup rápido** para novos desenvolvedores
- **Comandos consistentes** para tarefas comuns
- **Deploy automatizado** para diferentes ambientes
- **Integração completa** entre aplicação web e smart contracts
- **Flexibilidade** para usar npm, make ou scripts bash diretamente

Para dúvidas ou problemas, consulte o README.md principal ou abra uma issue no repositório.
