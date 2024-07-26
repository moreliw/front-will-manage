# Build stage
FROM node:14.17.5 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:1.21-alpine
COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]