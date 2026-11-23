
FROM node:22.14.0 AS build

WORKDIR /app

COPY package*.json ./

# Configuración de npm para conexiones lentas
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build -- --mode prod


FROM nginxinc/nginx-unprivileged:1.28-alpine AS production

USER root

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/frontend.conf /etc/nginx/conf.d/frontend.conf

COPY --from=build /app/dist /usr/share/nginx/html

USER nginx

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
