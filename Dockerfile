# Usa una imagen base con Node.js y Python
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias
RUN apk add --no-cache python3 py3-pip ffmpeg curl

# Instalar yt-dlp con pip
RUN pip install --no-cache-dir yt-dlp

# Verificar instalación de yt-dlp
RUN echo "Verificando yt-dlp..." && python3 -m yt_dlp --version

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install --only=production

COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
