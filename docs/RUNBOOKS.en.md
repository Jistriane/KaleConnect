# 📚 Operational Runbooks — KaleConnect (EN)

**Operational procedures for deployment, monitoring, incidents, and maintenance.**

Practical guides for production operations: automated deployment, emergency rollback, incident response, system monitoring, and maintenance procedures. Includes the new real data features and advanced interface.

## 1) Web Deploy (Vercel)
- Pre: environment variables configured (equivalent to `.env.local`).
- Steps:
  1. Merge into `main`
  2. Vercel builds and deploys automatically
  3. Validate `/api/health`
- Rollback: Vercel -> Deployments -> Promote previous

## 2) Web Deploy (Docker)
```bash
cd kaleconnect-web
# build
docker build -t kaleconnect-web:$(git rev-parse --short HEAD) .
# run
docker run -d --name kale-web -p 3000:3000 --env-file .env.local kaleconnect-web:$(git rev-parse --short HEAD)
# logs
docker logs -f kale-web
```
- Rollback: `docker stop && docker rm`, then start previous tag

## 3) Smart Contracts Deploy (Soroban)
- Pre: Rust+WASM, Soroban CLI, admin keys, target network (testnet/mainnet).
```bash
rustup target add wasm32-unknown-unknown
cd contracts
cargo build -p remittance --release --target wasm32-unknown-unknown
# Example (adjust paths/flags)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/remittance.wasm \
  --network testnet \
  --source <ADMIN_SECRET_OR_ALIAS>
```
- Post: record deployed addresses in a secure `.env` or platform secret.

## 4) Incidents
- Severity: S1 (outage), S2 (degradation), S3 (minor bugs)
- Immediate actions:
  - Gather logs (`./dev.sh logs`, Vercel logs, Docker logs)
  - Check `/api/health` and external deps (Horizon, Eliza)
  - If regression: immediate rollback
- Communication: timeline, impact, suspected cause, corrective actions

## 5) Monitoring & Alerts
- Healthcheck: `/api/health`
- Logs: Vercel/Docker + aggregation (e.g., Loki, Datadog)
- Suggested metrics: latency, 5xx rate, auth success, failed quotes/remittances
- Alerts: latency/5xx thresholds, Horizon/Eliza availability

## 6) Pre-deploy Checklist
- [ ] Lint and tests green (`npm run lint`, `./dev.sh test`)
- [ ] Environment variables updated
- [ ] Contract schema changes documented
- [ ] Backups/rollback plans ready

## 7) Post-mortem (template)
- Incident summary
- Timeline
- Impact
- Root cause
- What worked / what didn’t
- Preventive actions and owners
