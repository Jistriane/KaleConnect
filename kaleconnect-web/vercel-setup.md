# Guia de Configuração Vercel - KaleConnect Testnet

## 🎯 Resumo Executivo

Este guia fornece instruções passo-a-passo para configurar o deploy automático do KaleConnect na Vercel usando a rede testnet do Stellar.

## 📋 Checklist de Configuração

### ✅ Pré-requisitos
- [ ] Conta Vercel criada
- [ ] Conta GitHub conectada à Vercel
- [ ] Vercel CLI instalado (`npm i -g vercel`)
- [ ] Contratos Soroban deployados na testnet
- [ ] IDs dos contratos disponíveis em `../contracts/*_id.txt`

### ✅ Configuração Initial
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] GitHub Actions habilitado
- [ ] Secrets do repositório configurados

## 🔧 Passo-a-Passo

### 1. Importar Projeto na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Import Project"
3. Selecione seu repositório GitHub
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `kaleconnect-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Configurar Variáveis de Ambiente

Na dashboard da Vercel → Settings → Environment Variables:

```env
# Rede Stellar
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE = Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC = https://soroban-testnet.stellar.org:443

# Contratos (auto-lidos do ../contracts/)
NEXT_PUBLIC_CONTRACT_ID_KYC = [ID_DO_CONTRACT_KYC]
NEXT_PUBLIC_CONTRACT_ID_RATES = [ID_DO_CONTRACT_RATES]  
NEXT_PUBLIC_CONTRACT_ID_REMITTANCE = [ID_DO_CONTRACT_REMITTANCE]

# Configurações de produção
NODE_ENV = production
```

### 3. Configurar GitHub Secrets

No GitHub → Settings → Secrets and variables → Actions:

| Secret | Como Obter |
|--------|------------|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel → Settings → General (Team ID) |
| `VERCEL_PROJECT_ID` | Vercel → Project Settings → General |

### 4. Executar Deploy Manual (Primeira Vez)

```bash
cd kaleconnect-web
npm run deploy:testnet
```

Este comando irá:
- ✅ Verificar dependências
- ✅ Ler IDs dos contratos automaticamente  
- ✅ Configurar variáveis na Vercel
- ✅ Fazer build local para validação
- ✅ Deploy para produção

## 🔄 Workflows Configurados

### Deploy Automático
- **Trigger**: Push para `main`
- **Ambiente**: Production
- **URL**: https://kaleconnect-testnet.vercel.app

### Deploy Preview  
- **Trigger**: Pull Request
- **Ambiente**: Preview
- **URL**: Gerada automaticamente

### Validação Contínua
- **Trigger**: Qualquer commit
- **Jobs**: 
  - Lint
  - Type check
  - Build verification

## 📊 Monitoramento

### Dashboard Vercel
- **Analytics**: Métricas de performance
- **Logs**: Logs em tempo real
- **Deployments**: Histórico de deploys

### GitHub Actions
- **Status**: Status de builds
- **Logs**: Logs detalhados de CI/CD
- **Artifacts**: Arquivos de build

## 🐛 Resolução de Problemas

### Erro: "Contract IDs not found"
```bash
# Verificar se contratos existem
ls -la ../contracts/*_id.txt

# Re-deploy dos contratos se necessário
cd ../contracts
make deploy-testnet
```

### Erro: "Environment variables missing"
```bash
# Verificar variáveis na Vercel
vercel env ls

# Reconfigurar se necessário
vercel env add NEXT_PUBLIC_SOROBAN_RPC
```

### Erro: "Build failed"
```bash
# Build local para debug
npm run build

# Verificar logs na Vercel
vercel logs
```

### Erro: "Freighter connection failed"
1. Verificar CSP headers em `next.config.ts`
2. Confirmar rede testnet no Freighter
3. Verificar variável `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`

## 🔐 Segurança

### Headers Configurados
- ✅ Content Security Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options  
- ✅ Referrer Policy
- ✅ XSS Protection
- ✅ HSTS

### CORS
- ✅ APIs permitidas: Stellar testnet RPC
- ✅ Carteiras: Freighter, Albedo, xBull
- ✅ Métodos: GET, POST, PUT, DELETE, OPTIONS

## 📈 Performance

### Otimizações Aplicadas
- ✅ Bundle splitting
- ✅ Tree shaking
- ✅ Image optimization (WebP/AVIF)
- ✅ CSS minification
- ✅ JavaScript compression
- ✅ Service worker caching

### Métricas Esperadas
- **First Load**: < 1s
- **LCP**: < 2.5s  
- **FID**: < 100ms
- **CLS**: < 0.1

## 🚀 Deploy Production Ready

Após configuração completa, o deploy estará pronto com:

- ✅ **Rede**: Stellar Testnet
- ✅ **RPC**: https://soroban-testnet.stellar.org:443
- ✅ **Contratos**: Auto-configurados
- ✅ **Segurança**: Headers aplicados
- ✅ **Performance**: Otimizada
- ✅ **CI/CD**: Automático via GitHub
- ✅ **Monitoramento**: Dashboards ativos

---

**🎉 Deploy configurado com sucesso!**

Sua aplicação KaleConnect está agora rodando na Vercel com configuração profissional para a rede testnet do Stellar.
