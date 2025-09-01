# Deploy Automático - Testnet Stellar na Vercel

## 📋 Visão Geral

Este documento descreve como configurar e executar o deploy automático do frontend KaleConnect na rede testnet do Stellar usando a Vercel.

## 🔧 Pré-requisitos

### 1. Ferramentas Necessárias
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Vercel CLI](https://vercel.com/cli)
- [Git](https://git-scm.com/)

### 2. Contas Necessárias
- Conta na [Vercel](https://vercel.com/)
- Conta no [GitHub](https://github.com/) (para CI/CD automático)

## 🚀 Configuração Inicial

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login na Vercel
```bash
vercel login
```

### 3. Configurar Projeto na Vercel
No diretório `kaleconnect-web`:
```bash
vercel init
```

## 🌐 Configuração de Rede Testnet

### Variáveis de Ambiente Configuradas Automaticamente

O sistema está configurado para usar a rede testnet do Stellar com as seguintes configurações:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | `"Test SDF Network ; September 2015"` | Passphrase da rede testnet |
| `NEXT_PUBLIC_SOROBAN_RPC` | `"https://soroban-testnet.stellar.org:443"` | Endpoint RPC do Soroban testnet |
| `NEXT_PUBLIC_CONTRACT_ID_KYC` | Auto-detectado | ID do contrato KYC Registry |
| `NEXT_PUBLIC_CONTRACT_ID_RATES` | Auto-detectado | ID do contrato Rates Oracle |
| `NEXT_PUBLIC_CONTRACT_ID_REMITTANCE` | Auto-detectado | ID do contrato Remittance |

### IDs dos Contratos

Os IDs dos contratos são lidos automaticamente dos arquivos:
- `../contracts/kyc_registry_id.txt`
- `../contracts/rates_oracle_id.txt`
- `../contracts/remittance_id.txt`

## 🔄 Métodos de Deploy

### 1. Deploy Manual (Recomendado para primeira vez)

```bash
# No diretório kaleconnect-web
npm run deploy:testnet
```

Este script irá:
- ✅ Verificar dependências
- ✅ Ler IDs dos contratos automaticamente
- ✅ Configurar variáveis de ambiente na Vercel
- ✅ Executar build local para validação
- ✅ Fazer deploy para produção

### 2. Deploy via Vercel CLI

```bash
# Build e deploy direto
npm run vercel:build
npm run vercel:deploy:prod
```

### 3. Deploy Automático via GitHub Actions

O deploy automático acontece:
- **Push para `main`**: Deploy para produção
- **Pull Request**: Deploy de preview
- **Push para `develop`**: Deploy de preview

## 🔧 Configuração de Secrets no GitHub

Para o CI/CD funcionar, configure os seguintes secrets no seu repositório GitHub:

### Secrets Necessários
1. **VERCEL_TOKEN**: Token de acesso da Vercel
   - Obter em: https://vercel.com/account/tokens
   
2. **VERCEL_ORG_ID**: ID da organização Vercel
   - Encontrar em: Settings → General do projeto na Vercel
   
3. **VERCEL_PROJECT_ID**: ID do projeto Vercel
   - Encontrar em: Settings → General do projeto na Vercel

### Como Configurar Secrets
1. Vá para o repositório no GitHub
2. Settings → Secrets and variables → Actions
3. Clique em "New repository secret"
4. Adicione cada secret com seu valor correspondente

## 📁 Estrutura de Arquivos

```
kaleconnect-web/
├── .env-testnet              # Configurações de ambiente para testnet
├── deploy-testnet.sh         # Script de deploy manual
├── vercel.json              # Configurações da Vercel
├── next.config.ts           # Configurações do Next.js otimizadas
└── DEPLOY_TESTNET.md        # Esta documentação

.github/
└── workflows/
    └── deploy-testnet.yml   # GitHub Action para CI/CD
```

## ⚙️ Configurações de Segurança

### Headers de Segurança Configurados
- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **X-XSS-Protection**: 1; mode=block
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains
- **Content-Security-Policy**: Configurado para permitir conexões com testnet

### CORS
Configurado para permitir APIs externas:
- Stellar Testnet RPC
- Albedo Wallet
- Freighter Wallet

## 🧪 Testando o Deploy

### 1. Verificar Build Local
```bash
npm run build:testnet
```

### 2. Verificar Tipos TypeScript
```bash
npm run type-check
```

### 3. Executar Linting
```bash
npm run lint
```

## 📊 Monitoramento

### URLs de Produção
- **Principal**: https://kaleconnect-testnet.vercel.app
- **Dashboard Vercel**: https://vercel.com/dashboard

### Logs e Debugging
1. **Vercel Dashboard**: Logs em tempo real
2. **GitHub Actions**: Logs de CI/CD
3. **Browser DevTools**: Console para debugging client-side

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro: "IDs dos contratos não encontrados"**
   ```bash
   # Verificar se os contratos foram deployados
   ls -la ../contracts/*_id.txt
   ```

2. **Erro de variáveis de ambiente**
   ```bash
   # Verificar configuração na Vercel
   vercel env ls
   ```

3. **Erro de build**
   ```bash
   # Limpar cache e tentar novamente
   rm -rf .next
   npm run build
   ```

4. **Erro de conexão com Freighter**
   - Verificar se Content-Security-Policy permite conexões
   - Confirmar rede selecionada no Freighter (Testnet)

### Comandos de Debug

```bash
# Verificar status do projeto Vercel
vercel inspect

# Ver logs em tempo real
vercel logs

# Verificar configuração
vercel env ls
```

## 📈 Otimizações Aplicadas

### Build Optimizations
- ✅ Bundle splitting automático
- ✅ Tree shaking para reduzir tamanho
- ✅ Compressão de assets
- ✅ Otimização de imagens (WebP/AVIF)
- ✅ Minificação de CSS e JS

### Performance
- ✅ Lazy loading de componentes
- ✅ Prefetch de rotas críticas
- ✅ Cache inteligente de assets
- ✅ Service worker configurado

## 🔄 Workflow de Desenvolvimento

### 1. Desenvolvimento Local
```bash
npm run dev              # Desenvolvimento com hot reload
npm run dev:testnet      # Com configurações específicas testnet
```

### 2. Testing
```bash
npm run lint             # Verificar código
npm run type-check       # Verificar tipos
npm run build            # Build de produção
```

### 3. Deploy
```bash
npm run deploy:testnet   # Deploy manual
# ou fazer push para main (deploy automático)
```

## 📞 Suporte

Para problemas ou dúvidas:

1. **Documentação Vercel**: https://vercel.com/docs
2. **Documentação Stellar**: https://developers.stellar.org/
3. **GitHub Issues**: Criar issue no repositório do projeto

---

**✅ Deploy configurado com sucesso!**

Sua aplicação estará disponível na Vercel com:
- 🌐 Rede Stellar Testnet
- 🔄 Deploy automático via GitHub
- 🛡️ Configurações de segurança aplicadas
- 📊 Monitoramento em tempo real
