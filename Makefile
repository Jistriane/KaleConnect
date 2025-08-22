# 🌿 KaleConnect - Makefile
# Facilita comandos comuns de desenvolvimento

.PHONY: help init dev build test lint clean reset contracts status

# Configurações
SHELL := /bin/bash
PROJECT_NAME := KaleConnect

# Comando padrão
help: ## Mostrar ajuda
	@echo "🌿 $(PROJECT_NAME) - Comandos Disponíveis"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Exemplos:"
	@echo "  make init      # Inicializar projeto"
	@echo "  make dev       # Iniciar desenvolvimento"
	@echo "  make test      # Executar testes"

init: ## Inicializar projeto completo
	@echo "🚀 Inicializando projeto $(PROJECT_NAME)..."
	@./init.sh

dev: ## Iniciar servidor de desenvolvimento
	@echo "🔥 Iniciando servidor de desenvolvimento..."
	@./dev.sh start

build: ## Build de produção
	@echo "🏗️  Executando build de produção..."
	@./dev.sh build

test: ## Executar todos os testes
	@echo "🧪 Executando testes..."
	@./dev.sh test

lint: ## Verificar código com linter
	@echo "🔍 Executando linter..."
	@./dev.sh lint

contracts: ## Compilar smart contracts
	@echo "📜 Compilando smart contracts..."
	@./dev.sh contracts

contracts-test: ## Testar smart contracts
	@echo "🧪 Testando smart contracts..."
	@./dev.sh contracts-test

clean: ## Limpar arquivos de build
	@echo "🧹 Limpando arquivos de build..."
	@./dev.sh clean

reset: ## Reset completo do projeto
	@echo "🔄 Executando reset completo..."
	@./dev.sh reset

status: ## Verificar status dos serviços
	@echo "📊 Verificando status..."
	@./dev.sh status

logs: ## Mostrar logs do servidor
	@echo "📋 Mostrando logs..."
	@./dev.sh logs

# Comandos compostos
setup: init ## Alias para init
	@echo "✅ Setup concluído!"

start: dev ## Alias para dev
	@echo "🚀 Servidor iniciado!"

check: lint test ## Executar lint e testes
	@echo "✅ Verificações concluídas!"

# Comandos específicos da aplicação web
web-dev: ## Iniciar apenas a aplicação web
	@echo "🌐 Iniciando aplicação web..."
	@cd kaleconnect-web && npm run dev

web-build: ## Build apenas da aplicação web
	@echo "🏗️  Build da aplicação web..."
	@cd kaleconnect-web && npm run build

web-install: ## Instalar dependências da aplicação web
	@echo "📦 Instalando dependências da aplicação web..."
	@cd kaleconnect-web && npm install

# Comandos específicos dos smart contracts (requer Rust)
rust-setup: ## Configurar ambiente Rust
	@echo "🦀 Configurando ambiente Rust..."
	@rustup update
	@rustup target add wasm32-unknown-unknown

rust-build: ## Compilar smart contracts para WASM
	@echo "🦀 Compilando para WASM..."
	@cd contracts && cargo build --release --target wasm32-unknown-unknown --workspace

rust-test: ## Testar smart contracts
	@echo "🦀 Testando smart contracts..."
	@cd contracts && cargo test --workspace

rust-clean: ## Limpar build Rust
	@echo "🦀 Limpando build Rust..."
	@cd contracts && cargo clean

# Utilitários
install: ## Instalar todas as dependências
	@echo "📦 Instalando dependências..."
	@npm install
	@cd kaleconnect-web && npm install

update: ## Atualizar dependências
	@echo "🔄 Atualizando dependências..."
	@npm update
	@cd kaleconnect-web && npm update

security: ## Verificar vulnerabilidades de segurança
	@echo "🔒 Verificando segurança..."
	@npm audit
	@cd kaleconnect-web && npm audit

# Comandos de informação
info: ## Mostrar informações do projeto
	@echo "📋 Informações do Projeto $(PROJECT_NAME)"
	@echo
	@echo "Estrutura:"
	@echo "  📁 kaleconnect-web/  - Aplicação Next.js"
	@echo "  📁 contracts/       - Smart contracts Soroban"
	@echo "  📄 init.sh          - Script de inicialização"
	@echo "  📄 dev.sh           - Script de desenvolvimento"
	@echo
	@echo "Tecnologias:"
	@echo "  🌐 Next.js 15.5.0"
	@echo "  ⚛️  React 19"
	@echo "  🎨 Tailwind CSS 4"
	@echo "  🦀 Rust + Soroban"
	@echo "  ⭐ Stellar SDK"
	@echo "  🤖 ElizaOS"

version: ## Mostrar versões das ferramentas
	@echo "📋 Versões das Ferramentas"
	@echo
	@echo -n "Node.js: "
	@node --version 2>/dev/null || echo "não instalado"
	@echo -n "npm: "
	@npm --version 2>/dev/null || echo "não instalado"
	@echo -n "Rust: "
	@rustc --version 2>/dev/null || echo "não instalado"
	@echo -n "Cargo: "
	@cargo --version 2>/dev/null || echo "não instalado"
