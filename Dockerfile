# Usa una imagen base con Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache python3 py3-pip ffmpeg \
    && pip install --no-cache-dir yt-dlp

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install --only=production

COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
