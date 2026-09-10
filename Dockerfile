FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY backend/package.json backend/
RUN npm ci

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w backend
EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
