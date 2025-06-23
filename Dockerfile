# Usar Node para construir
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Usar nginx para servir los archivos estáticos
FROM nginx:alpine

# Copiar build al directorio de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
