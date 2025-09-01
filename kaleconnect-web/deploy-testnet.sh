#!/bin/bash

# Script de Deploy Automático para Testnet na Vercel
# Autor: KaleConnect Team
# Descrição: Configura e faz deploy da aplicação para a rede testnet do Stellar

set -e

echo "🚀 Iniciando deploy para testnet..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "Este script deve ser executado no diretório do frontend (kaleconnect-web)"
    exit 1
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Verificar se os IDs dos contratos existem
CONTRACTS_DIR="../contracts"
if [ ! -f "$CONTRACTS_DIR/kyc_registry_id.txt" ] || [ ! -f "$CONTRACTS_DIR/rates_oracle_id.txt" ] || [ ! -f "$CONTRACTS_DIR/remittance_id.txt" ]; then
    log_error "IDs dos contratos não encontrados. Execute o deploy dos contratos primeiro."
    exit 1
fi

# Ler IDs dos contratos
KYC_CONTRACT_ID=$(cat "$CONTRACTS_DIR/kyc_registry_id.txt" | tr -d '\n\r')
RATES_CONTRACT_ID=$(cat "$CONTRACTS_DIR/rates_oracle_id.txt" | tr -d '\n\r')
REMITTANCE_CONTRACT_ID=$(cat "$CONTRACTS_DIR/remittance_id.txt" | tr -d '\n\r')

log_info "IDs dos Contratos:"
log_info "  KYC Registry: $KYC_CONTRACT_ID"
log_info "  Rates Oracle: $RATES_CONTRACT_ID" 
log_info "  Remittance: $REMITTANCE_CONTRACT_ID"

# Configurar variáveis de ambiente para a Vercel
log_info "Configurando variáveis de ambiente na Vercel..."

# Frontend/Blockchain
vercel env add NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE production <<< "Test SDF Network ; September 2015"
vercel env add NEXT_PUBLIC_SOROBAN_RPC production <<< "https://soroban-testnet.stellar.org:443"
vercel env add NEXT_PUBLIC_CONTRACT_ID_KYC production <<< "$KYC_CONTRACT_ID"
vercel env add NEXT_PUBLIC_CONTRACT_ID_RATES production <<< "$RATES_CONTRACT_ID"
vercel env add NEXT_PUBLIC_CONTRACT_ID_REMITTANCE production <<< "$REMITTANCE_CONTRACT_ID"
vercel env add NODE_ENV production <<< "production"

# Backend específico - Segurança
log_info "Configurando variáveis de segurança do backend..."
vercel env add AUDIT_LOG_SECRET production <<< "kaleconnect_audit_secret_testnet_$(date +%s)"
vercel env add APP_CRYPTO_SECRET production <<< "kaleconnect_crypto_secret_testnet_$(openssl rand -hex 16)"

# Backend específico - APIs externas
vercel env add ELISA_API_URL production <<< "https://api.elizaos.ai/v1"
vercel env add ELISA_API_KEY production <<< "your-eliza-api-key-here"
vercel env add ELIZA_USE_CORE production <<< "false"

# Backend específico - WebAuthn
vercel env add NEXT_PUBLIC_WEBAUTHN_RP_NAME production <<< "KaleConnect"
vercel env add NEXT_PUBLIC_WEBAUTHN_RP_ID production <<< "kaleconnect-testnet.vercel.app"
vercel env add WEBAUTHN_RP_ORIGIN production <<< "https://kaleconnect-testnet.vercel.app"

# Backend específico - Performance e Compliance
vercel env add API_RATE_LIMIT_WINDOW_MS production <<< "60000"
vercel env add API_RATE_LIMIT_MAX_REQUESTS production <<< "20"
vercel env add LOG_LEVEL production <<< "info"
vercel env add ENABLE_DEBUG_LOGS production <<< "false"
vercel env add HIGH_VALUE_THRESHOLD_USD production <<< "1000"
vercel env add COMPLIANCE_STRICT_MODE production <<< "true"

# Backend específico - Integrações externas
vercel env add NEXT_PUBLIC_HORIZON_URL production <<< "https://horizon-testnet.stellar.org"
vercel env add STELLAR_FRIENDBOT_URL production <<< "https://friendbot.stellar.org"
vercel env add API_TIMEOUT_MS production <<< "30000"
vercel env add CACHE_TTL_SECONDS production <<< "300"

# Backend específico - Monitoramento
vercel env add MONITORING_TOKEN production <<< "monitoring_$(openssl rand -hex 16)"

# Fazer build local para verificar se não há erros
log_info "Executando build local para verificação..."
npm run build

log_success "Build local concluído com sucesso!"

# Deploy para Vercel
log_info "Fazendo deploy para Vercel..."
vercel deploy --prod

log_success "Deploy concluído!"
log_info "Sua aplicação estará disponível em alguns minutos."
log_info "Verifique o status do deploy em: https://vercel.com/dashboard"

echo ""
log_success "🎉 Deploy para testnet concluído com sucesso!"
log_info "Configurações aplicadas:"
log_info "  ✓ Rede: Stellar Testnet"
log_info "  ✓ RPC: https://soroban-testnet.stellar.org:443"
log_info "  ✓ Contratos configurados automaticamente"
log_info "  ✓ Variáveis de ambiente de produção"
echo ""
