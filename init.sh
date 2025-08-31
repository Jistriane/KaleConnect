#!/bin/bash

# 🌿 KaleConnect - Script de Inicialização Completa
# Script para configurar todo o ambiente de desenvolvimento do zero

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configurações
PROJECT_NAME="KaleConnect"
WEB_DIR="kaleconnect-web"
CONTRACTS_DIR="contracts"
TARGET_PORT=3000

log() {
    echo -e "${GREEN}[INIT] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[INIT] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[INIT] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[INIT] INFO: $1${NC}"
}

success() {
    echo -e "${CYAN}[INIT] ✅ $1${NC}"
}

# Banner de inicialização
print_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    🌿 KaleConnect - Inicialização Completa                  ║
    ║                                                              ║
    ║    Remessas Inteligentes Multichain                         ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo
}

# Verificar pré-requisitos do sistema
check_system_requirements() {
    log "Verificando pré-requisitos do sistema..."
    
    # Verificar se estamos no diretório correto
    if [[ ! -f "package.json" || ! -d "$WEB_DIR" ]]; then
        error "Este script deve ser executado na raiz do projeto KaleConnect!"
        error "Estrutura esperada:"
        error "  - package.json"
        error "  - $WEB_DIR/"
        error "  - $CONTRACTS_DIR/"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado!"
        error "Instale Node.js 18+ de: https://nodejs.org/"
        exit 1
    fi
    
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $node_version -lt 18 ]]; then
        error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm não está instalado!"
        exit 1
    fi
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        warn "Git não encontrado. Recomendado para controle de versão."
    fi
    
    # Verificar Rust (opcional)
    if command -v rustc &> /dev/null && command -v cargo &> /dev/null; then
        info "✅ Rust $(rustc --version | cut -d' ' -f2) encontrado"
        RUST_AVAILABLE=true
    else
        warn "Rust não encontrado. Smart contracts não serão compilados."
        warn "Para instalar: https://rustup.rs/"
        RUST_AVAILABLE=false
    fi
    
    success "Pré-requisitos verificados"
    echo
    info "Versões encontradas:"
    info "  Node.js: $(node -v)"
    info "  npm: $(npm -v)"
    if [[ "$RUST_AVAILABLE" == "true" ]]; then
        info "  Rust: $(rustc --version | cut -d' ' -f2)"
        info "  Cargo: $(cargo --version | cut -d' ' -f2)"
    fi
    echo
}

# Configurar ambiente Rust
setup_rust_environment() {
    if [[ "$RUST_AVAILABLE" != "true" ]]; then
        warn "Pulando configuração Rust (não disponível)"
        return
    fi
    
    log "Configurando ambiente Rust para smart contracts..."
    
    # Verificar e adicionar target wasm32
    if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
        info "Adicionando target wasm32-unknown-unknown..."
        rustup target add wasm32-unknown-unknown
    fi
    
    # Verificar Soroban CLI (opcional)
    if command -v soroban &> /dev/null; then
        info "✅ Soroban CLI encontrado: $(soroban --version)"
    else
        warn "Soroban CLI não encontrado"
        info "Para instalar: cargo install --locked soroban-cli"
    fi
    
    success "Ambiente Rust configurado"
}

# Instalar dependências
install_dependencies() {
    log "Instalando dependências do projeto..."
    
    # Instalar dependências raiz
    info "Instalando dependências da raiz..."
    npm install
    
    # Instalar dependências da aplicação web
    info "Instalando dependências da aplicação web..."
    cd "$WEB_DIR"
    npm install
    cd ..
    
    success "Dependências instaladas"
}

# Compilar smart contracts
build_smart_contracts() {
    if [[ "$RUST_AVAILABLE" != "true" ]]; then
        warn "Pulando compilação de smart contracts (Rust não disponível)"
        return
    fi
    
    log "Compilando smart contracts Soroban..."
    
    cd "$CONTRACTS_DIR"
    
    # Build para desenvolvimento
    info "Compilando para desenvolvimento..."
    cargo build --workspace
    
    # Build para WASM
    info "Compilando para WASM..."
    cargo build -p remittance --release --target wasm32-unknown-unknown
    cargo build -p kyc_registry --release --target wasm32-unknown-unknown  
    cargo build -p rates_oracle --release --target wasm32-unknown-unknown
    
    cd ..
    
    success "Smart contracts compilados"
}

# Executar testes dos smart contracts
test_smart_contracts() {
    if [[ "$RUST_AVAILABLE" != "true" ]]; then
        warn "Pulando testes de smart contracts (Rust não disponível)"
        return
    fi
    
    log "Executando testes dos smart contracts..."
    
    cd "$CONTRACTS_DIR"
    cargo test --workspace
    cd ..
    
    success "Testes dos smart contracts executados"
}

# Criar arquivos de ambiente
create_environment_files() {
    log "Criando arquivos de ambiente..."
    
    # Template para .env.local (desenvolvimento)
    local env_dev_content='# 🌿 KaleConnect - Configuração de Desenvolvimento
# Gerado automaticamente pelo init.sh

# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org

# Contract IDs (Testnet)
NEXT_PUBLIC_CONTRACT_ID_REMITTANCE=CAGDTDNJHGBYTLDDLCGTZ2A75F4MFQSTYHJVBOJV3TWIY623GS2MZUFN
NEXT_PUBLIC_CONTRACT_ID_KYC=CBB5WR3SLYGQH3ORNPVZWEIDZCL3SXLPWOHI3KPAN2M62E4MQA7PXSF4
NEXT_PUBLIC_CONTRACT_ID_RATES=CAJKLOFR32AQTYT5RU4FLPKKLB7PBBY3IBIFQKLLRLRCQLPWBRJMIIQT

# WebAuthn Configuration
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3000

# ElizaOS Configuration (Opcional)
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here

# Security (gerados automaticamente em produção)
APP_CRYPTO_SECRET=dev-secret-key-change-in-production
AUDIT_LOG_SECRET=dev-audit-secret-change-in-production

# Development Settings
LOG_LEVEL=info
NODE_ENV=development
PORT=3000'

    # Template para .env-homolog
    local env_homolog_content='# 🌿 KaleConnect - Configuração de Homologação
# Configure para seu ambiente de homologação

# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect (Homolog)
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org

# Contract IDs (Testnet) - Configure com seus contratos
NEXT_PUBLIC_CONTRACT_ID_REMITTANCE=YOUR_REMITTANCE_CONTRACT_ID
NEXT_PUBLIC_CONTRACT_ID_KYC=YOUR_KYC_CONTRACT_ID
NEXT_PUBLIC_CONTRACT_ID_RATES=YOUR_RATES_CONTRACT_ID

# WebAuthn Configuration - AJUSTE PARA SEU DOMÍNIO
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=your-homolog-domain.com
WEBAUTHN_RP_ORIGIN=https://your-homolog-domain.com

# ElizaOS Configuration
ELIZA_API_URL=https://your-eliza-api.com
ELIZA_API_KEY=your-eliza-api-key

# Security - GERE CHAVES SEGURAS
APP_CRYPTO_SECRET=generate-secure-key-for-homolog
AUDIT_LOG_SECRET=generate-secure-audit-key-for-homolog

# Optional: OpenAI for AI features
# OPENAI_API_KEY=your-openai-key

# Environment Settings
LOG_LEVEL=warn
NODE_ENV=production
PORT=3000'

    # Template para .env-prod
    local env_prod_content='# 🌿 KaleConnect - Configuração de Produção
# Configure para seu ambiente de produção

# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar Network Configuration - MAINNET OU TESTNET
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
NEXT_PUBLIC_HORIZON_URL=https://horizon.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-rpc.mainnet.stellarx.com

# Contract IDs (Mainnet) - CONFIGURE COM SEUS CONTRATOS DEPLOYADOS
NEXT_PUBLIC_CONTRACT_ID_REMITTANCE=YOUR_MAINNET_REMITTANCE_CONTRACT_ID
NEXT_PUBLIC_CONTRACT_ID_KYC=YOUR_MAINNET_KYC_CONTRACT_ID
NEXT_PUBLIC_CONTRACT_ID_RATES=YOUR_MAINNET_RATES_CONTRACT_ID

# WebAuthn Configuration - CONFIGURE SEU DOMÍNIO PRODUÇÃO
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=your-production-domain.com
WEBAUTHN_RP_ORIGIN=https://your-production-domain.com

# ElizaOS Configuration
ELIZA_API_URL=https://your-production-eliza-api.com
ELIZA_API_KEY=your-production-eliza-api-key

# Security - GERE CHAVES ULTRA SEGURAS
APP_CRYPTO_SECRET=generate-ultra-secure-key-for-production
AUDIT_LOG_SECRET=generate-ultra-secure-audit-key-for-production

# Optional: OpenAI for AI features
# OPENAI_API_KEY=your-production-openai-key

# Environment Settings
LOG_LEVEL=error
NODE_ENV=production
PORT=3000'

    # Criar .env.local se não existir
    if [[ ! -f "$WEB_DIR/.env.local" ]]; then
        info "Criando $WEB_DIR/.env.local..."
        echo "$env_dev_content" > "$WEB_DIR/.env.local"
    else
        warn "Arquivo $WEB_DIR/.env.local já existe, não sobrescrevendo"
    fi
    
    # Criar templates de ambiente
    info "Criando templates de ambiente..."
    echo "$env_homolog_content" > ".env-homolog"
    echo "$env_prod_content" > ".env-prod"
    echo "$env_dev_content" > ".env-dev"
    
    success "Arquivos de ambiente criados"
    echo
    info "Arquivos criados:"
    info "  📄 $WEB_DIR/.env.local (desenvolvimento ativo)"
    info "  📄 .env-dev (template desenvolvimento)"
    info "  📄 .env-homolog (template homologação)"
    info "  📄 .env-prod (template produção)"
    echo
    warn "⚠️  IMPORTANTE: Configure as variáveis para seus ambientes específicos!"
    warn "⚠️  Para produção, gere chaves seguras para APP_CRYPTO_SECRET e AUDIT_LOG_SECRET"
}

# Testar build da aplicação
test_application_build() {
    log "Testando build da aplicação..."
    
    cd "$WEB_DIR"
    
    # Verificar se há erros de lint
    info "Executando linter..."
    npm run lint
    
    # Testar build
    info "Executando build de teste..."
    npm run build
    
    cd ..
    
    success "Build da aplicação testado com sucesso"
}

# Verificar se porta está disponível
check_port_availability() {
    if lsof -Pi :$TARGET_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "Porta $TARGET_PORT já está em uso"
        info "Para parar serviços na porta: pkill -f 'next dev'"
        info "Ou altere a porta em $WEB_DIR/package.json"
    else
        success "Porta $TARGET_PORT disponível"
    fi
}

# Criar script de inicialização rápida
create_quick_start_script() {
    log "Criando script de inicialização rápida..."
    
    cat > quick-start.sh << 'EOF'
#!/bin/bash
# 🚀 KaleConnect - Inicialização Rápida
# Script para desenvolvedores que já têm o ambiente configurado

echo "🌿 KaleConnect - Inicialização Rápida"
echo

# Verificar se as dependências estão instaladas
if [[ ! -d "kaleconnect-web/node_modules" ]]; then
    echo "📦 Instalando dependências..."
    cd kaleconnect-web && npm install && cd ..
fi

# Verificar se o .env.local existe
if [[ ! -f "kaleconnect-web/.env.local" ]]; then
    echo "⚠️  Arquivo .env.local não encontrado!"
    echo "Execute: ./init.sh para configuração completa"
    exit 1
fi

# Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
cd kaleconnect-web
npm run dev
EOF
    
    chmod +x quick-start.sh
    
    success "Script quick-start.sh criado"
}

# Instruções finais
show_final_instructions() {
    echo
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║    ✅ Inicialização Concluída com Sucesso!                 ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    success "🎉 KaleConnect está pronto para desenvolvimento!"
    echo
    
    info "📋 Próximos passos:"
    echo
    echo -e "  ${CYAN}1. Iniciar desenvolvimento:${NC}"
    echo "     npm run dev"
    echo "     # ou"
    echo "     make dev"
    echo "     # ou"
    echo "     ./dev.sh start"
    echo "     # ou"
    echo "     ./quick-start.sh"
    echo
    
    echo -e "  ${CYAN}2. Acessar aplicação:${NC}"
    echo "     http://localhost:$TARGET_PORT"
    echo
    
    echo -e "  ${CYAN}3. Comandos úteis:${NC}"
    echo "     make help           # Ver todos comandos disponíveis"
    echo "     ./dev.sh status     # Verificar status dos serviços"
    echo "     ./dev.sh test       # Executar testes"
    echo "     ./dev.sh lint       # Verificar código"
    echo "     ./dev.sh clean      # Limpar builds"
    echo
    
    if [[ "$RUST_AVAILABLE" == "true" ]]; then
        echo -e "  ${CYAN}4. Smart Contracts:${NC}"
        echo "     make contracts      # Compilar contratos"
        echo "     make rust-test      # Testar contratos"
        echo "     ./deploy.sh contracts # Deploy contratos"
        echo
    fi
    
    echo -e "  ${CYAN}5. Deploy:${NC}"
    echo "     ./deploy.sh vercel  # Deploy para Vercel"
    echo "     ./deploy.sh docker  # Build Docker"
    echo "     ./deploy.sh static  # Build estático"
    echo
    
    echo -e "  ${YELLOW}📚 Documentação:${NC}"
    echo "     docs/README.pt-BR.md     # Documentação completa"
    echo "     docs/MANUAL.pt-BR.md     # Manual de operação"
    echo "     SCRIPTS.md               # Documentação dos scripts"
    echo
    
    if [[ ! -f "$WEB_DIR/.env.local" ]]; then
        warn "⚠️  Configure o arquivo $WEB_DIR/.env.local com suas chaves e URLs"
    fi
    
    warn "⚠️  Para produção, configure variáveis de ambiente seguras em .env-prod"
    echo
}

# Função principal
main() {
    print_banner
    
    check_system_requirements
    setup_rust_environment
    install_dependencies
    build_smart_contracts
    test_smart_contracts
    create_environment_files
    test_application_build
    check_port_availability
    create_quick_start_script
    
    show_final_instructions
}

# Verificar se o script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
