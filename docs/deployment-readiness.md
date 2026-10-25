# Deployment readiness

## Status: not approved for production deployment

Critical workflows can be reviewed locally, but **production release is not approved** until:

1. Attach or approve licensed PDF assets for every advertised past-paper session that should show Download.
2. Resolve the Class 9 2027 “onward” interpretation with the client.
3. Complete browser QA against a running stack (`node scripts/browser-qa.mjs`) with evidence in `docs/qa-browser-results.json`.
4. Run migrations + smoke tests against the isolated QA database (`docker-compose.qa.yml`), never against production.
5. Change demo passwords and set strong `JWT_SECRET` / `CORS_ORIGINS` for the target environment.

## Safe local QA sequence

```bash
docker compose -f docker-compose.qa.yml up -d
cp backend/.env.qa.example backend/.env   # or merge DATABASE_URL only
cd backend && npm run db:migrate && npm run dev
# other terminal:
cd frontend && npm run dev
npm test -w backend
node scripts/browser-qa.mjs
```

No deployment action was taken in this session.
