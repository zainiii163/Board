# BoardNotes Monorepo

This repository is split into separate workspaces for the frontend app, backend API, shared contracts, and product docs.

## Structure

- `frontend/` - Next.js 16 app
- `backend/` - Express + TypeScript API
- `shared/` - shared domain/types package
- `docs/` - project requirements and product documents

## Local PostgreSQL setup

1. Install PostgreSQL locally and create a database named `boardnotes`.
2. Create a local user with access to that database, or use the default example credentials below.
3. Copy the sample environment file:

```bash
cp backend/.env.example backend/.env
```

4. Update `backend/.env` if your local PostgreSQL credentials differ.

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/boardnotes
```

## Database migrations and seed

From the repository root:

```bash
npm install
```

Then in the backend workspace:

```bash
cd backend
npx drizzle-kit generate
npx drizzle-kit migrate
npx tsx src/db/seed.ts
```

If you are using a local PostgreSQL instance with the default credentials above, the demo content will be inserted into the `boards`, `classes`, `subjects`, `chapters`, `exercises`, `questions`, and `solution_steps` tables.

## Running the app

From the repo root:

```bash
npm run dev:backend
npm run dev:frontend
```

The api runs on `http://localhost:4000` and the frontend on `http://localhost:3000`.

## Demo API checks

The main demo flow is:

- `GET /api/boards`
- `GET /api/boards/:slug`
- `GET /api/boards/:slug/classes/:classSlug`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise`
- `GET /api/boards/:slug/classes/:classSlug/subjects/:subject/chapters/:chapter/exercises/:exercise/q/:questionNum`

The backend gracefully falls back to the bundled demo content when the database is unavailable, and it uses PostgreSQL whenever `DATABASE_URL` is configured.
