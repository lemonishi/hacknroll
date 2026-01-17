# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM httpd:2.4-alpine AS server

COPY --from=build /app/dist /usr/local/apache2/htdocs

# Enable .htaccess overrides and mod_rewrite
RUN sed -i \
    -e 's/AllowOverride None/AllowOverride All/g' \
    -e 's/#LoadModule rewrite_module/LoadModule rewrite_module/' \
    /usr/local/apache2/conf/httpd.conf

# Expose Apache port
EXPOSE 80
