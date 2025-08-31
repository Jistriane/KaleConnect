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
