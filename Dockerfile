# Etapa 1: Construir a aplicação Angular
FROM node:16 AS build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o código do projeto
COPY . .

# Construa a aplicação Angular
RUN npm run build --prod

# Etapa 2: Servir a aplicação usando nginx
FROM nginx:1.21-alpine

# Copie os arquivos de build do Angular para o diretório nginx
COPY --from=build /app/dist/seu-projeto-angular /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Inicie o servidor nginx
CMD ["nginx", "-g", "daemon off;"]
