#!/bin/bash

# 🌿 KaleConnect - Script de Desenvolvimento
# Script para facilitar tarefas comuns de desenvolvimento

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DEV] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[DEV] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[DEV] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[DEV] INFO: $1${NC}"
}

# Função de ajuda
show_help() {
    echo -e "${BLUE}🌿 KaleConnect - Script de Desenvolvimento${NC}"
    echo
    echo "Uso: $0 [COMANDO]"
    echo
    echo "Comandos disponíveis:"
    echo "  start           Iniciar servidor de desenvolvimento"
    echo "  build           Build de produção"
    echo "  test            Executar todos os testes"
    echo "  lint            Verificar código com linter"
    echo "  contracts       Compilar smart contracts"
    echo "  contracts-test  Testar smart contracts"
    echo "  clean           Limpar arquivos de build"
    echo "  reset           Reset completo (limpar + reinstalar)"
    echo "  logs            Mostrar logs do servidor"
    echo "  status          Verificar status dos serviços"
    echo "  help            Mostrar esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 start        # Iniciar desenvolvimento"
    echo "  $0 test         # Executar testes"
    echo "  $0 clean        # Limpar builds"
}

# Iniciar servidor de desenvolvimento
start_dev_server() {
    log "Iniciando servidor de desenvolvimento..."
    
    # Verificar se já está rodando
    if lsof -Pi :3006 -sTCP:LISTEN -t >/dev/null ; then
        warn "Servidor já está rodando na porta 3006"
        info "Para parar: pkill -f 'next dev'"
        return
    fi
    
    cd kaleconnect-web
    npm run dev
}

# Build de produção
build_production() {
    log "Executando build de produção..."
    
    cd kaleconnect-web
    npm run build
    
    log "✅ Build de produção concluído"
}

# Executar testes
run_tests() {
    log "Executando todos os testes..."
    
    # Testes da aplicação web (se houver)
    cd kaleconnect-web
    if grep -q '"test"' package.json; then
        info "Executando testes da aplicação web..."
        npm test
    else
        info "Nenhum teste configurado para a aplicação web"
    fi
    cd ..
    
    # Testes dos smart contracts
    if command -v cargo &> /dev/null; then
        info "Executando testes dos smart contracts..."
        cd contracts
        cargo test --workspace
        cd ..
        log "✅ Todos os testes executados"
    else
        warn "Rust não disponível - pulando testes de smart contracts"
    fi
}

# Verificar código com linter
run_lint() {
    log "Executando linter..."
    
    cd kaleconnect-web
    npm run lint
    
    log "✅ Linter executado"
}

# Compilar smart contracts
build_contracts() {
    if ! command -v cargo &> /dev/null; then
        error "Rust/Cargo não está instalado"
        exit 1
    fi
    
    log "Compilando smart contracts..."
    
    cd contracts
    
    # Build para desenvolvimento
    cargo build --workspace
    
    # Build para WASM
    cargo build -p remittance --release --target wasm32-unknown-unknown
    cargo build -p kyc_registry --release --target wasm32-unknown-unknown
    cargo build -p rates_oracle --release --target wasm32-unknown-unknown
    
    cd ..
    log "✅ Smart contracts compilados"
}

# Testar smart contracts
test_contracts() {
    if ! command -v cargo &> /dev/null; then
        error "Rust/Cargo não está instalado"
        exit 1
    fi
    
    log "Testando smart contracts..."
    
    cd contracts
    cargo test --workspace
    cd ..
    
    log "✅ Testes de smart contracts executados"
}

# Limpar arquivos de build
clean_builds() {
    log "Limpando arquivos de build..."
    
    # Limpar Next.js
    cd kaleconnect-web
    rm -rf .next
    rm -rf out
    rm -rf dist
    cd ..
    
    # Limpar Rust
    if [[ -d "contracts/target" ]]; then
        cd contracts
        cargo clean
        cd ..
    fi
    
    log "✅ Arquivos de build limpos"
}

# Reset completo
reset_project() {
    log "Executando reset completo do projeto..."
    
    # Limpar builds
    clean_builds
    
    # Remover node_modules
    info "Removendo node_modules..."
    rm -rf node_modules
    rm -rf kaleconnect-web/node_modules
    
    # Reinstalar dependências
    info "Reinstalando dependências..."
    npm install
    cd kaleconnect-web
    npm install
    cd ..
    
    log "✅ Reset completo executado"
}

# Mostrar logs (se servidor estiver rodando em background)
show_logs() {
    info "Procurando por processos do Next.js..."
    
    PIDS=$(pgrep -f "next dev" || true)
    if [[ -n "$PIDS" ]]; then
        log "Processos encontrados: $PIDS"
        info "Para ver logs em tempo real, use: tail -f kaleconnect-web/.next/trace"
    else
        warn "Nenhum servidor de desenvolvimento encontrado rodando"
    fi
}

# Verificar status dos serviços
check_status() {
    log "Verificando status dos serviços..."
    
    # Verificar porta 3006
    if lsof -Pi :3006 -sTCP:LISTEN -t >/dev/null 2>&1; then
        info "✅ Servidor web rodando na porta 3006"
    else
        info "❌ Servidor web não está rodando"
    fi
    
    # Verificar Node.js
    if command -v node &> /dev/null; then
        info "✅ Node.js $(node -v) disponível"
    else
        warn "❌ Node.js não encontrado"
    fi
    
    # Verificar Rust
    if command -v cargo &> /dev/null; then
        info "✅ Rust/Cargo disponível"
    else
        info "❌ Rust/Cargo não encontrado"
    fi
    
    # Verificar dependências
    if [[ -d "kaleconnect-web/node_modules" ]]; then
        info "✅ Dependências da aplicação web instaladas"
    else
        warn "❌ Dependências da aplicação web não encontradas"
    fi
}

# Função principal
main() {
    case "${1:-help}" in
        "start")
            start_dev_server
            ;;
        "build")
            build_production
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "contracts")
            build_contracts
            ;;
        "contracts-test")
            test_contracts
            ;;
        "clean")
            clean_builds
            ;;
        "reset")
            reset_project
            ;;
        "logs")
            show_logs
            ;;
        "status")
            check_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Comando desconhecido: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Verificar se estamos no diretório correto
if [[ ! -f "package.json" || ! -d "kaleconnect-web" ]]; then
    error "Este script deve ser executado na raiz do projeto KaleConnect!"
    exit 1
fi

main "$@"
