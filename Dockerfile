# Usa una imagen oficial de Node.js
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./

# Instalar dependencias de npm y yt-dlp
RUN npm ci --only=production && npm install -g yt-dlp

# Copiar el resto de los archivos
COPY . .

# Asegurar permisos de ejecución para yt-dlp
RUN chmod +x $(which yt-dlp)

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
