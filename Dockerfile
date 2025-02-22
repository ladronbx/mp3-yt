# Imagen de Node.js con ffmpeg y yt-dlp preinstalados
FROM jrottenberg/ffmpeg:4.4-alpine AS ffmpeg
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar yt-dlp con pip (más confiable en entornos sin apt-get)
RUN apk add --no-cache python3 py3-pip && pip install yt-dlp

# Copiar archivos de la aplicación
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
