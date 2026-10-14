# Environment Variables

Complete inventory of every environment variable across all workspaces.

---

## 1. Backend — `backend/src/config/env.ts`

The single `env` object (`config/env.ts:1-20`). Loaded via a side-effect
`import "dotenv/config"` in `db/index.ts:4`; `config/env.ts` itself has **no**
dotenv import and relies on that transitive side effect.

| Line | Variable | Default | Notes |
|---|---|---|---|
| `:2` | `PORT` | `4000` | `Number(...)` |
| `:3` | `DATABASE_URL` | `""` | Empty ⇒ demo in-memory mode |
| `:4` | `JWT_SECRET` | `"change-me"` | ⚠️ Default is a known secret |
| `:5` | `NODE_ENV` | `"development"` | `isProduction()` checks `=== "production"` (`:26-28`) |
| `:6-9` | `CORS_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Split on `,`, trimmed, empties filtered |
| `:10-12` | `PUBLIC_API_URL` | `""` (trailing `/` stripped) | Falls back to `https://${RAILWAY_PUBLIC_DOMAIN}` |
| `:11` | `RAILWAY_PUBLIC_DOMAIN` | — | ⚠️ Undocumented in `.env.example` |
| `:13` | `PUBLIC_SITE_URL` | `http://localhost:3000` | Trailing `/` stripped. Used in classroom email links |
| `:14` | `AUTO_MIGRATE` | `true` | Only `AUTO_MIGRATE=false` disables it |
| `:15` | `R2_BUCKET` | `""` | |
| `:16` | `R2_ACCESS_KEY` | `""` | |
| `:17` | `R2_SECRET_KEY` | `""` | |
| `:18` | `R2_ENDPOINT` | `""` | |
| `:19` | `R2_PUBLIC_URL` | `""` | Trailing `/` stripped. Direct CDN links |

```ts
export function isR2Configured() {   // :22-24
  return Boolean(env.r2Bucket && env.r2AccessKey && env.r2SecretKey && env.r2Endpoint);
}
```

All four R2 vars are required together. A partial set logs a warning and falls
back to local disk.

## 2. Backend — read outside `config/env.ts`

`backend/src/utils/mail.ts` reads `process.env` **directly**, bypassing the
`env` object.

| Line | Variable | Default |
|---|---|---|
| `:13` | `SMTP_HOST`, `SMTP_USER`, `NOTIFY_EMAIL` | — (`smtpConfigured()` needs all three) |
| `:17` | `SMTP_PORT` | `"587"` |
| `:19` | `SMTP_HOST` | — |
| `:23-24` | `SMTP_USER`, `SMTP_PASS` | — |
| `:30` | `SMTP_FROM` | `SMTP_USER` → `"noreply@boardnotes.com"` |
| `:34` | `NOTIFY_EMAIL` | — |

## 3. Backend — drizzle-kit

`backend/drizzle.config.ts`

| Line | Variable |
|---|---|
| `:13` | `DATABASE_URL`, fallback `postgresql://postgres:postgres@localhost:5433/boardnotes` |

`.env` is loaded explicitly at `:2,6` via `dotenv.config({ path: ... })`.

## 4. Backend — database pool

`backend/src/db/index.ts`

| Line | Variable |
|---|---|
| `:7` | `DATABASE_URL` (pool connection string) |
| `:16` | `DATABASE_URL` (`isDbConfigured` check) |

## 5. Frontend

Six references total. No `import.meta.env` anywhere.

| File:Line | Variable | Default | Purpose |
|---|---|---|---|
| `frontend/next.config.ts:5` | `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Rewrite destinations for `/book-covers`, `/uploads`, `/demo-pdfs` |
| `frontend/src/lib/api-client.ts:1` | `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL for **every** API call |
| `frontend/next.config.ts:28` | `NODE_ENV` | Next-provided | `images.dangerouslyAllowLocalIP: NODE_ENV === "development"` |
| `frontend/src/app/robots.ts:4` | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `Sitemap:` directive |
| `frontend/src/app/sitemap.ts:3` | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Absolute URLs for 100+ sitemap entries |
| `frontend/src/lib/constants.ts:9` | `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` | `https://whatsapp.com/channel/0029Vb5PkniD38CY2Nks972r` | WhatsApp channel link; validated absolute at `:10-11` |

⚠️ `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` is **not declared** in either
`frontend/.env.example` or `frontend/.env.local` — it is code-default only.

⚠️ `NEXT_PUBLIC_API_URL` is read in **two independent places**
(`next.config.ts:5` and `lib/api-client.ts:1`). The file comment at
`next.config.ts:2-4` warns they must match, but nothing enforces it.

⚠️ `NEXT_PUBLIC_*` values are **inlined at build time**. Changing the API URL
requires a rebuild, not just a restart.

---

## 6. Consolidated variable list — 21 names

### Backend (17)

| Variable | Required in prod | Default | Safe default? |
|---|:---:|---|:---:|
| `PORT` | — | `4000` | ✅ |
| `NODE_ENV` | ✅ | `development` | ⚠️ must be `production` |
| `DATABASE_URL` | ✅ | `""` | ⚠️ empty ⇒ data loss on restart |
| `JWT_SECRET` | ✅ | `change-me` | ❌ **known secret** |
| `CORS_ORIGINS` | ✅ | `http://localhost:3000,http://127.0.0.1:3000` | ❌ dev-only origins |
| `PUBLIC_API_URL` | recommended | `""` | ✅ |
| `RAILWAY_PUBLIC_DOMAIN` | — | — | ✅ (Railway auto-set) |
| `PUBLIC_SITE_URL` | recommended | `http://localhost:3000` | ⚠️ wrong links in emails |
| `AUTO_MIGRATE` | — | `true` | ✅ |
| `R2_BUCKET` | optional | `""` | ✅ |
| `R2_ACCESS_KEY` | optional | `""` | ✅ |
| `R2_SECRET_KEY` | optional | `""` | ✅ |
| `R2_ENDPOINT` | optional | `""` | ✅ |
| `R2_PUBLIC_URL` | optional | `""` | ✅ |
| `SMTP_HOST` | optional | `""` | ✅ |
| `SMTP_PORT` | optional | `587` | ✅ |
| `SMTP_USER` | optional | `""` | ✅ |
| `SMTP_PASS` | optional | `""` | ✅ |
| `SMTP_FROM` | optional | `SMTP_USER` → `noreply@boardnotes.com` | ✅ |
| `NOTIFY_EMAIL` | optional | `""` | ✅ |

### Frontend (3)

| Variable | Required in prod | Default |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` |
| `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` | — | code default |

---

## 7. Template files

### `backend/.env.example`

Active values:

```env
PORT=4000
NODE_ENV=development
AUTO_MIGRATE=true
JWT_SECRET=boardnotes-dev-secret-change-me
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Commented out:

```env
# DATABASE_URL=postgresql://postgres:postgres@localhost:5433/boardnotes
# PUBLIC_API_URL=https://api.your-domain.com
# PUBLIC_SITE_URL=https://your-domain.com
# NOTIFY_EMAIL=admin@boardnotes.com
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=noreply@boardnotes.com
# R2_BUCKET=boardnotes-pdfs
# R2_ACCESS_KEY=
# R2_SECRET_KEY=
# R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
# R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

⚠️ `RAILWAY_PUBLIC_DOMAIN` and `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` are absent.

⚠️ The file contains mojibake in its comments — em-dashes were written as
`�?"` in several places (`# PostgreSQL �?"`, `# JWT secret ... �?"`,
`# Public URL of this API (optional �?"`). Cosmetic, but worth cleaning.

### `frontend/.env.example` / `frontend/.env.local`

Both contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Current working-tree state

`backend/.env` currently has `PORT`, `NODE_ENV`, `JWT_SECRET`, and
`CORS_ORIGINS` set; `DATABASE_URL`, `PUBLIC_API_URL`, `PUBLIC_SITE_URL`,
`NOTIFY_EMAIL`, all `SMTP_*`, and all `R2_*` are commented out. `AUTO_MIGRATE`
is absent, so it defaults to `true`.

Both `backend/.env` and `frontend/.env.local` are **gitignored** by
`.gitignore:39` (`.env*`) — confirmed via `git check-ignore -v`.

---

## 8. Production minimum

```env
# backend
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/boardnotes
JWT_SECRET=<64+ random chars>
CORS_ORIGINS=https://boardnotes.com,https://www.boardnotes.com
PUBLIC_API_URL=https://api.boardnotes.com
PUBLIC_SITE_URL=https://boardnotes.com
AUTO_MIGRATE=true
```

```env
# frontend
NEXT_PUBLIC_API_URL=https://api.boardnotes.com
NEXT_PUBLIC_SITE_URL=https://boardnotes.com
```

Optional blocks:

```env
# Cloudflare R2 — all four required
R2_BUCKET=boardnotes-pdfs
R2_ACCESS_KEY=<key>
R2_SECRET_KEY=<secret>
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

```env
# Email — all three required for smtpConfigured()
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=<user>
SMTP_PASS=<pass>
SMTP_FROM=noreply@boardnotes.com
NOTIFY_EMAIL=admin@boardnotes.com
```

## 9. Startup validation

`backend/src/server.ts:11-22` emits warnings — never errors — for:

| Condition | Warning |
|---|---|
| `DATABASE_URL` unset | `"CMS data will not persist."` |
| `jwtSecret === "change-me"` or contains `"dev-secret"` | `"Set a strong JWT_SECRET in production."` |
| Partial R2 config (1–3 of 4) | Incomplete R2 set |

The server **always starts** regardless. See
[`ISSUES-AND-RISKS.md`](./ISSUES-AND-RISKS.md#6-production-starts-with-the-default-jwt-secret).
