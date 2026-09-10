FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY backend/package.json backend/

RUN npm ci
RUN npm install -g typescript

COPY . .

RUN tsc -p backend/tsconfig.json

EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
