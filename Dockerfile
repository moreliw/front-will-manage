FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Certifique-se de que você está usando o build de produção do Angular
RUN npm run build --prod

FROM nginx:1.21-alpine

# Remova o conteúdo padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie os arquivos de build do Angular para o diretório do Nginx
COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
