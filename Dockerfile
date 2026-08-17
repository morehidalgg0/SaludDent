# Multi-stage Dockerfile para Despliegue en la Nube (Render, Railway, Fly.io, VPS)
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "server/index.js"]
