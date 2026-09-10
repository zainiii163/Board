FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY backend/package.json backend/
RUN npm ci --workspace=backend --workspace=shared

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w shared
RUN npm run build -w backend

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/package.json ./
EXPOSE 4000
CMD ["node", "dist/server.js"]
