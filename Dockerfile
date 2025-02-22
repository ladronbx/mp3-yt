# Usa una imagen oficial de Node.js
FROM node:18

# Instalar dependencias del sistema (ffmpeg y yt-dlp)
RUN apt-get update && apt-get install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

# Instalar dependencias de forma más estable
RUN npm ci --only=production

# Copiar el resto de los archivos
COPY . .

# Asegurar permisos de ejecución para `yt-dlp`
RUN chmod +x /usr/local/bin/yt-dlp

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
