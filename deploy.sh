#!/bin/bash

# 🌿 KaleConnect - Script de Deploy
# Script para deploy em produção

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DEPLOY] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[DEPLOY] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[DEPLOY] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[DEPLOY] INFO: $1${NC}"
}

# Banner
print_banner() {
    echo -e "${PURPLE}"
    cat << "EOF"
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║    🚀 KaleConnect - Deploy de Produção                      ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Ajuda
show_help() {
    echo -e "${BLUE}🚀 KaleConnect - Script de Deploy${NC}"
    echo
    echo "Uso: $0 [AMBIENTE] [OPÇÕES]"
    echo
    echo "Ambientes:"
    echo "  vercel          Deploy para Vercel"
    echo "  docker          Build e deploy com Docker"
    echo "  static          Build estático para hosting"
    echo "  contracts       Deploy de smart contracts"
    echo
    echo "Opções:"
    echo "  --dry-run       Simular deploy sem executar"
    echo "  --skip-tests    Pular testes antes do deploy"
    echo "  --skip-build    Pular build (usar build existente)"
    echo "  --help          Mostrar esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 vercel                    # Deploy para Vercel"
    echo "  $0 docker --dry-run          # Simular deploy Docker"
    echo "  $0 static --skip-tests       # Build estático sem testes"
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos para deploy..."
    
    # Verificar se estamos no diretório correto
    if [[ ! -f "package.json" || ! -d "kaleconnect-web" ]]; then
        error "Este script deve ser executado na raiz do projeto KaleConnect!"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm não está instalado"
        exit 1
    fi
    
    log "✅ Pré-requisitos verificados"
}

# Executar testes
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        warn "Pulando testes (--skip-tests especificado)"
        return
    fi
    
    log "Executando testes antes do deploy..."
    
    cd kaleconnect-web
    
    # Lint
    info "Executando linter..."
    npm run lint
    
    # Testes (se configurados)
    if grep -q '"test"' package.json; then
        info "Executando testes..."
        npm test
    else
        info "Nenhum teste configurado"
    fi
    
    cd ..
    log "✅ Testes executados com sucesso"
}

# Build da aplicação
build_application() {
    if [[ "$SKIP_BUILD" == "true" ]]; then
        warn "Pulando build (--skip-build especificado)"
        return
    fi
    
    log "Executando build da aplicação..."
    
    cd kaleconnect-web
    
    # Verificar se existe .env.local
    if [[ ! -f ".env.local" ]]; then
        warn "Arquivo .env.local não encontrado!"
        warn "Certifique-se de configurar as variáveis de ambiente para produção"
    fi
    
    # Build
    npm run build
    
    cd ..
    log "✅ Build concluído"
}

# Deploy para Vercel
deploy_vercel() {
    log "Preparando deploy para Vercel..."
    
    # Verificar se Vercel CLI está instalado
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI não está instalado"
        error "Instale com: npm i -g vercel"
        exit 1
    fi
    
    cd kaleconnect-web
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: vercel --prod"
        info "Deploy para Vercel simulado"
    else
        info "Executando deploy para Vercel..."
        vercel --prod
        log "✅ Deploy para Vercel concluído"
    fi
    
    cd ..
}

# Deploy com Docker
deploy_docker() {
    log "Preparando deploy com Docker..."
    
    # Verificar se Docker está instalado
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
        exit 1
    fi
    
    # Verificar se Dockerfile existe
    if [[ ! -f "kaleconnect-web/Dockerfile" ]]; then
        info "Dockerfile não encontrado. Criando Dockerfile básico..."
        create_dockerfile
    fi
    
    cd kaleconnect-web
    
    IMAGE_NAME="kaleconnect-web"
    IMAGE_TAG="latest"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: docker build -t $IMAGE_NAME:$IMAGE_TAG ."
        info "DRY RUN: docker run -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG"
        info "Deploy Docker simulado"
    else
        info "Construindo imagem Docker..."
        docker build -t $IMAGE_NAME:$IMAGE_TAG .
        
        info "Imagem Docker criada: $IMAGE_NAME:$IMAGE_TAG"
        info "Para executar: docker run -p 3000:3000 $IMAGE_NAME:$IMAGE_TAG"
        log "✅ Deploy Docker concluído"
    fi
    
    cd ..
}

# Build estático
build_static() {
    log "Preparando build estático..."
    
    cd kaleconnect-web
    
    # Verificar se next.config.ts está configurado para export
    if ! grep -q "output.*export" next.config.ts 2>/dev/null; then
        warn "next.config.ts não está configurado para export estático"
        info "Adicionando configuração de export..."
        
        # Backup do arquivo original
        cp next.config.ts next.config.ts.backup
        
        # Adicionar configuração de export
        cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
EOF
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: npm run build"
        info "Build estático simulado"
    else
        info "Executando build estático..."
        npm run build
        
        if [[ -d "out" ]]; then
            info "Build estático criado em: kaleconnect-web/out/"
            info "Você pode servir estes arquivos com qualquer servidor web estático"
            log "✅ Build estático concluído"
        else
            error "Falha na criação do build estático"
            exit 1
        fi
    fi
    
    cd ..
}

# Deploy de smart contracts
deploy_contracts() {
    log "Preparando deploy de smart contracts..."
    
    # Verificar se Rust está disponível
    if ! command -v cargo &> /dev/null; then
        error "Rust/Cargo não está instalado"
        exit 1
    fi
    
    # Verificar se Soroban CLI está disponível
    if ! command -v soroban &> /dev/null; then
        error "Soroban CLI não está instalado"
        error "Instale com: cargo install --locked soroban-cli"
        exit 1
    fi
    
    cd contracts
    
    if [[ "$DRY_RUN" == "true" ]]; then
        info "DRY RUN: Compilação e deploy de smart contracts simulado"
        info "Contratos que seriam deployados:"
        info "  - remittance"
        info "  - kyc_registry" 
        info "  - rates_oracle"
    else
        info "Compilando smart contracts para WASM..."
        cargo build -p remittance --release --target wasm32-unknown-unknown
        cargo build -p kyc_registry --release --target wasm32-unknown-unknown
        cargo build -p rates_oracle --release --target wasm32-unknown-unknown
        
        info "Smart contracts compilados. Para deploy manual use:"
        info "  soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance.wasm --network testnet"
        info "  soroban contract deploy --wasm target/wasm32-unknown-unknown/release/kyc_registry.wasm --network testnet"
        info "  soroban contract deploy --wasm target/wasm32-unknown-unknown/release/rates_oracle.wasm --network testnet"
        
        log "✅ Smart contracts preparados para deploy"
    fi
    
    cd ..
}

# Criar Dockerfile básico
create_dockerfile() {
    cat > kaleconnect-web/Dockerfile << 'EOF'
# Dockerfile para KaleConnect Web App
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
EOF
    
    info "Dockerfile criado em kaleconnect-web/Dockerfile"
}

# Função principal
main() {
    print_banner
    
    # Parse de argumentos
    ENVIRONMENT=""
    DRY_RUN=false
    SKIP_TESTS=false
    SKIP_BUILD=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            vercel|docker|static|contracts)
                ENVIRONMENT="$1"
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                error "Argumento desconhecido: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Verificar se ambiente foi especificado
    if [[ -z "$ENVIRONMENT" ]]; then
        error "Ambiente de deploy não especificado"
        show_help
        exit 1
    fi
    
    # Executar deploy
    check_prerequisites
    
    case "$ENVIRONMENT" in
        vercel)
            run_tests
            build_application
            deploy_vercel
            ;;
        docker)
            run_tests
            build_application
            deploy_docker
            ;;
        static)
            run_tests
            build_static
            ;;
        contracts)
            deploy_contracts
            ;;
    esac
    
    log "🎉 Deploy concluído com sucesso!"
}

# Verificar se o script está sendo executado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
