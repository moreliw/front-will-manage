# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

EXPOSE ${PORT:-80}
CMD ["nginx", "-g", "daemon off;"]
