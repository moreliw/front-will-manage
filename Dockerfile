# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

# Serve stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]