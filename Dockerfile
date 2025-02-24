# Usar una imagen base de Node.js con yt-dlp preinstalado
FROM node:18

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y ffmpeg curl

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 10000

# Comando de inicio
CMD ["npm", "start"]
