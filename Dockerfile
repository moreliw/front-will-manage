# Build
FROM node:12.18.4-alpine3.12 as node
WORKDIR /app
COPY package.json /app/
#RUN npm i npm@latest -g
RUN npm install
COPY ./ /app/

RUN npm run build:#{environment}# --configuration --output-path=/dist
# RUN npm run build --configuration  --output-path=/dist

# When the container starts, replace the env.js with values from environment variables
#CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# Rodar a aplicação
#FROM nginx:1.13
#COPY --from=node /app/dist/ /usr/share/nginx/html
#COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

#CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

#EXPOSE 80




FROM nginx:1.12-alpine
COPY --from=build /app/dist/front-will-manage /usr/share/nginx/html

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/environment.ts > /usr/share/nginx/html/environment.prod.ts && exec nginx -g 'daemon off;'"]

EXPOSE 80