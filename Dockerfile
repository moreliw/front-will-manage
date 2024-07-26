# Etapa de construção
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa de produção
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
