# 📚 Runbooks — KaleConnect (PT-BR)

Guias operacionais: deploy, rollback, incidentes e monitoração.

## 1) Deploy Web (Vercel)
- Pré: variáveis configuradas no projeto (equivalentes ao `.env.local`).
- Passos:
  1. Merge na `main`
  2. Vercel faz build e deploy automático
  3. Validar rota `/api/health`
- Rollback: Vercel -> Deployments -> Promote previous

## 2) Deploy Web (Docker)
```bash
cd kaleconnect-web
# build
docker build -t kaleconnect-web:$(git rev-parse --short HEAD) .
# run
docker run -d --name kale-web -p 3000:3000 --env-file .env.local kaleconnect-web:$(git rev-parse --short HEAD)
# logs
docker logs -f kale-web
```
- Rollback: `docker stop && docker rm` e subir tag anterior

## 3) Deploy de Smart Contracts (Soroban)
- Pré: Rust+WASM, Soroban CLI, chaves de admin e rede testnet/mainnet.
```bash
rustup target add wasm32-unknown-unknown
cd contracts
cargo build -p remittance --release --target wasm32-unknown-unknown
# Exemplo (ajuste caminhos/flags)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/remittance.wasm \
  --network testnet \
  --source <ADMIN_SECRET_OR_ALIAS>
```
- Pós: registrar endereços implantados em um `.env` seguro ou secret de plataforma.

## 4) Incidentes
- Severidade: S1 (parada), S2 (degradação), S3 (bugs menores)
- Ação imediata:
  - Coletar logs (`./dev.sh logs`, Vercel logs, Docker logs)
  - Checar `/api/health` e dependências externas (Horizon, Eliza)
  - Se regressão: rollback imediato
- Comunicação: anotar cronologia, impacto, causa provável, ações corretivas

## 5) Monitoração e Alertas
- Healthcheck: `/api/health`
- Logs: Vercel/Docker + agregação (ex.: Loki, Datadog)
- Métricas sugeridas: latência, erro 5xx, taxas de autenticação, falhas de cotação e remessas
- Alertas: threshold de latência e 5xx, indisponibilidade de Horizon/Eliza

## 6) Checklist de Pré-deploy
- [ ] Lint e testes ok (`npm run lint`, `./dev.sh test`)
- [ ] Variáveis de ambiente atualizadas
- [ ] Mudanças de schema contratuais documentadas
- [ ] Backups/configs de rollback prontos

## 7) Pós-mortem (modelo)
- Resumo do incidente
- Linha do tempo
- Impacto
- Causa raiz
- O que funcionou / o que não funcionou
- Ações preventivas e owners
