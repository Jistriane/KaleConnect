#!/bin/bash

# 🌿 KaleConnect - Script de Inicialização
# Script para configurar e inicializar o ambiente de desenvolvimento do KaleConnect
# Autor: Desenvolvido para o projeto KaleConnect
# Data: $(date +%Y-%m-%d)

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Banner do projeto
print_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    🌿 KaleConnect - Remessas Inteligentes Multichain        ║
    ║                                                              ║
    ║    Uma plataforma global de remessas digitais tão fácil     ║
    ║    quanto conversar no WhatsApp, mas extremamente           ║
    ║    poderosa, segura e inclusiva.                            ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Verificar se estamos no diretório correto
check_project_structure() {
    log "Verificando estrutura do projeto..."
    
    if [[ ! -f "package.json" || ! -d "kaleconnect-web" || ! -d "contracts" ]]; then
        error "Este script deve ser executado na raiz do projeto KaleConnect!"
        error "Estrutura esperada: package.json, kaleconnect-web/, contracts/"
        exit 1
    fi
    
    log "✅ Estrutura do projeto verificada"
}

# Verificar dependências do sistema
check_system_dependencies() {
    log "Verificando dependências do sistema..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado. Por favor, instale Node.js 18+ primeiro."
        error "Visite: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [[ $NODE_MAJOR -lt 18 ]]; then
        error "Node.js versão 18+ é necessária. Versão atual: $NODE_VERSION"
        exit 1
    fi
    log "✅ Node.js $NODE_VERSION detectado"
    
    # npm
    if ! command -v npm &> /dev/null; then
        error "npm não está instalado. Por favor, instale npm primeiro."
        exit 1
    fi
    log "✅ npm $(npm -v) detectado"
    
    # Rust (opcional, para smart contracts)
    if command -v rustc &> /dev/null; then
        log "✅ Rust $(rustc --version | cut -d' ' -f2) detectado"
        RUST_AVAILABLE=true
    else
        warn "Rust não detectado. Smart contracts não poderão ser compilados."
        warn "Para instalar Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        RUST_AVAILABLE=false
    fi
    
    # Cargo (se Rust estiver disponível)
    if [[ $RUST_AVAILABLE == true ]]; then
        if command -v cargo &> /dev/null; then
            log "✅ Cargo $(cargo --version | cut -d' ' -f2) detectado"
        else
            warn "Cargo não detectado, mas Rust está instalado. Algo pode estar errado."
        fi
    fi
}

# Configurar ambiente Rust para smart contracts
setup_rust_environment() {
    if [[ $RUST_AVAILABLE == false ]]; then
        warn "Pulando configuração Rust - não disponível"
        return
    fi
    
    log "Configurando ambiente Rust para smart contracts..."
    
    # Atualizar Rust
    info "Atualizando Rust..."
    rustup update
    
    # Adicionar target WASM
    info "Adicionando target wasm32-unknown-unknown..."
    rustup target add wasm32-unknown-unknown
    
    # Verificar se soroban-cli está instalado
    if command -v soroban &> /dev/null; then
        log "✅ Soroban CLI já instalado: $(soroban --version)"
    else
        info "Soroban CLI não detectado. Você pode instalá-lo com:"
        info "cargo install --locked soroban-cli"
    fi
    
    log "✅ Ambiente Rust configurado"
}

# Instalar dependências do projeto raiz
install_root_dependencies() {
    log "Instalando dependências do projeto raiz..."
    
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    
    log "✅ Dependências do projeto raiz instaladas"
}

# Instalar dependências da aplicação web
install_web_dependencies() {
    log "Instalando dependências da aplicação web..."
    
    cd kaleconnect-web
    
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    
    cd ..
    log "✅ Dependências da aplicação web instaladas"
}

# Compilar smart contracts
build_smart_contracts() {
    if [[ $RUST_AVAILABLE == false ]]; then
        warn "Pulando compilação de smart contracts - Rust não disponível"
        return
    fi
    
    log "Compilando smart contracts Soroban..."
    
    cd contracts
    
    # Build para host (desenvolvimento/testes)
    info "Compilando para host..."
    cargo build --workspace
    
    # Build para WASM (deploy)
    info "Compilando para WASM..."
    cargo build -p remittance --release --target wasm32-unknown-unknown
    cargo build -p kyc_registry --release --target wasm32-unknown-unknown
    cargo build -p rates_oracle --release --target wasm32-unknown-unknown
    
    # Verificar se os arquivos WASM foram gerados
    WASM_DIR="target/wasm32-unknown-unknown/release"
    if [[ -f "$WASM_DIR/remittance.wasm" && -f "$WASM_DIR/kyc_registry.wasm" && -f "$WASM_DIR/rates_oracle.wasm" ]]; then
        log "✅ Smart contracts compilados com sucesso"
        info "Arquivos WASM gerados em: contracts/$WASM_DIR/"
    else
        error "Falha na compilação dos smart contracts"
        exit 1
    fi
    
    cd ..
}

# Executar testes dos smart contracts
test_smart_contracts() {
    if [[ $RUST_AVAILABLE == false ]]; then
        warn "Pulando testes de smart contracts - Rust não disponível"
        return
    fi
    
    log "Executando testes dos smart contracts..."
    
    cd contracts
    
    cargo test -p remittance
    cargo test -p kyc_registry
    cargo test -p rates_oracle
    
    cd ..
    log "✅ Testes dos smart contracts executados"
}

# Criar arquivo de variáveis de ambiente se não existir
setup_environment_variables() {
    log "Configurando variáveis de ambiente..."
    
    ENV_FILE="kaleconnect-web/.env.local"
    
    if [[ ! -f "$ENV_FILE" ]]; then
        info "Criando arquivo de variáveis de ambiente: $ENV_FILE"
        cat > "$ENV_FILE" << 'EOF'
# KaleConnect Environment Variables
# Copie este arquivo e ajuste as variáveis conforme necessário

# Next.js
NEXT_PUBLIC_APP_NAME=KaleConnect
NEXT_PUBLIC_APP_VERSION=0.1.0

# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# WebAuthn Configuration
NEXT_PUBLIC_WEBAUTHN_RP_NAME=KaleConnect
NEXT_PUBLIC_WEBAUTHN_RP_ID=localhost
WEBAUTHN_RP_ORIGIN=http://localhost:3006

# ElizaOS Configuration
ELIZA_API_URL=http://localhost:3001
ELIZA_API_KEY=your-eliza-api-key-here

# Database (se necessário)
# DATABASE_URL=postgresql://user:password@localhost:5432/kaleconnect

# Logging
LOG_LEVEL=info

# Development
NODE_ENV=development
EOF
        log "✅ Arquivo de ambiente criado: $ENV_FILE"
        warn "IMPORTANTE: Revise e ajuste as variáveis de ambiente em $ENV_FILE"
    else
        log "✅ Arquivo de ambiente já existe: $ENV_FILE"
    fi
}

# Verificar se a aplicação pode ser iniciada
test_application_startup() {
    log "Testando inicialização da aplicação..."
    
    cd kaleconnect-web
    
    # Build da aplicação para verificar se tudo está OK
    info "Executando build de teste..."
    if npm run build; then
        log "✅ Build da aplicação executado com sucesso"
    else
        error "Falha no build da aplicação. Verifique os logs acima."
        exit 1
    fi
    
    cd ..
}

# Exibir informações finais
show_final_instructions() {
    echo
    log "🎉 Inicialização do KaleConnect concluída com sucesso!"
    echo
    info "Para iniciar o desenvolvimento:"
    echo
    echo -e "${YELLOW}  # Navegar para o diretório da aplicação web${NC}"
    echo -e "${BLUE}  cd kaleconnect-web${NC}"
    echo
    echo -e "${YELLOW}  # Iniciar o servidor de desenvolvimento${NC}"
    echo -e "${BLUE}  npm run dev${NC}"
    echo
    echo -e "${YELLOW}  # A aplicação estará disponível em:${NC}"
    echo -e "${GREEN}  http://localhost:3006${NC}"
    echo
    
    if [[ $RUST_AVAILABLE == true ]]; then
        info "Smart Contracts Soroban:"
        echo -e "${BLUE}  cd contracts${NC}"
        echo -e "${BLUE}  cargo test --workspace     # Executar todos os testes${NC}"
        echo -e "${BLUE}  cargo build --workspace    # Build para desenvolvimento${NC}"
        echo
    fi
    
    info "Scripts úteis:"
    echo -e "${BLUE}  ./init.sh                  # Executar este script novamente${NC}"
    echo -e "${BLUE}  npm run build              # Build de produção${NC}"
    echo -e "${BLUE}  npm run lint               # Verificar código${NC}"
    echo
    
    warn "Não esqueça de:"
    echo -e "${YELLOW}  • Revisar as variáveis de ambiente em kaleconnect-web/.env.local${NC}"
    echo -e "${YELLOW}  • Configurar suas chaves de API (ElizaOS, Stellar, etc.)${NC}"
    echo -e "${YELLOW}  • Ler a documentação no README.md${NC}"
    echo
}

# Função principal
main() {
    print_banner
    
    check_project_structure
    check_system_dependencies
    
    setup_rust_environment
    install_root_dependencies
    install_web_dependencies
    
    build_smart_contracts
    test_smart_contracts
    
    setup_environment_variables
    test_application_startup
    
    show_final_instructions
}

# Verificar se o script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
