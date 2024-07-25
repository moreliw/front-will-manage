# Etapa 1: Construir a aplicação Angular
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Verificar os arquivos copiados
RUN ls -al /app

# Construa a aplicação Angular
RUN npm run build

# Verificar o diretório de build
RUN ls -al /app/dist/front-will-manage

# Etapa 2: Servir a aplicação usando nginx
FROM nginx:1.21-alpine

COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html

# Verificar os arquivos copiados para o Nginx
RUN ls -al /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
