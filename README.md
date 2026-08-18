# BoardNotes Monorepo

This repository is now split into separate workspaces so the frontend and backend can evolve independently and integrate over API boundaries.

## Structure

- `frontend/` - Next.js web app
- `backend/` - TypeScript API starter
- `shared/` - shared contracts and reusable types
- `docs/` - product and requirements documents

## Run

From the repository root:

```bash
npm install
npm run dev:frontend
npm run dev:backend
```

## Initial integration direction

- Frontend reads from the backend over HTTP
- Backend exposes `/api/health` and `/api/catalog/boards`
- Shared package is reserved for API contracts and shared domain types
