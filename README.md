# 🎵 MP3-YT: Conversor de Audio desde YouTube  

Bienvenido a **MP3-YT**, una aplicación web diseñada con **fines educativos** y para la **experimentación con tecnologías web**. Esta herramienta permite convertir enlaces de YouTube en archivos de **audio MP3** de manera sencilla y rápida. 🎶✨  

---

## ⚠️ **Aviso Importante**  

🛠️ **MP3-YT no debe usarse para descargar contenido protegido por derechos de autor sin autorización.**  

Este software está diseñado exclusivamente para **uso personal y legal**, con contenido del cual poseas los derechos necesarios.  

🔴 **No se pretende fomentar ni apoyar la piratería ni el uso ilegal de contenido protegido.**  
📣 **El usuario es el único responsable del uso que haga de esta aplicación.**  

---

## 🚀 **Características**  
✔️ **Conversión de videos de YouTube a MP3** 👅  
✔️ **Detección automática de playlists** 🎵  
✔️ **Interfaz minimalista y fácil de usar** 🎨  
✔️ **Código abierto y transparente** 💻  
✔️ **Protección contra abuso con límites de solicitudes** ⛔  

---

## 🎵 **Detección Inteligente de Playlists**  

MP3-YT es capaz de **identificar automáticamente si el enlace ingresado pertenece a una playlist de YouTube**. Si esto ocurre, la aplicación te brindará una opción especial para gestionar la descarga de varios audios de manera más eficiente.  

💡 **IMPORTANTE:**  
- Esta funcionalidad está integrada en la aplicación y **debe usarse de forma responsable**.  
- **No se permite descargar contenido sin autorización del propietario de los derechos.**  
- El usuario **debe asegurarse de cumplir con la legalidad vigente** en su país.  

📉 **Para más detalles, descarga el repositorio y pruébalo por ti mismo.**  

---

## 🛠 **Tecnologías Utilizadas**  
Este proyecto está construido con las siguientes tecnologías:

- **Node.js** 🟢 - Backend y ejecución de comandos  
- **Express.js** 🚀 - Servidor web  
- **CORS** 🔗 - Manejo de restricciones de acceso  
- **express-rate-limit** ⏳ - Protección contra uso excesivo  
- **youtube-dl-exec** 🎥 - Conversión de YouTube a MP3  

📅 **Todas las librerías utilizadas son de código abierto.**  

---

## 💽 **Instalación y Uso**  

### 1⃣ **Instalar Node.js**  
Si no tienes Node.js instalado en tu ordenador, sigue estos pasos:  

1. Descarga e instala **Node.js** desde su página oficial: [https://nodejs.org/](https://nodejs.org/)  
2. Para verificar que la instalación fue exitosa, abre la **Terminal** (en Windows, busca "CMD" o "Símbolo del sistema") y escribe:  
   ```bash
   node -v
   ```  
   Esto debe mostrar un número de versión, por ejemplo: `v18.16.0`  

---

### 2⃣ **Descargar el Proyecto**  
Para obtener MP3-YT en tu ordenador, sigue estos pasos:

1. **Descarga Git** si no lo tienes instalado: [https://git-scm.com/](https://git-scm.com/)  
2. Abre una **Terminal** y escribe:
   ```bash
   git clone https://github.com/ladronbx/mp3-yt.git
   ```  
   Esto descargará el código en tu ordenador.  

---

### 3⃣ **Instalar Dependencias**  
1. En la **Terminal**, ve a la carpeta del proyecto:
   ```bash
   cd mp3-yt
   ```
2. Instala las librerías necesarias con:
   ```bash
   npm install
   ```
   Esto descargará todos los archivos necesarios para que funcione la aplicación.  

---

### 4⃣ **Ejecutar el Servidor**  
Para iniciar MP3-YT, ejecuta este comando en la **Terminal**:
```bash
node server.js
```
Si todo está bien, verás un mensaje como este:
```
Servidor corriendo en http://localhost:10000
```

---

### 5⃣ **Usar la Aplicación**  
1. Abre tu navegador (Chrome, Firefox, Edge, etc.)  
2. Escribe en la barra de direcciones: **http://localhost:10000**  
3. Pega un enlace de YouTube y presiona "Descargar MP3"  
4. 🎧 **Listo!** El audio se descargará en tu dispositivo.  

---

## 🎯 **Errores Comunes y Soluciones**  

### 🔥 Error: "node no se reconoce como un comando"  
**Solución:** Node.js no está instalado o no está en la variable de entorno. Reinstálalo y reinicia tu ordenador.  

### 🛡️ Error: "npm command not found"  
**Solución:** Node.js incluye npm. Asegúrate de que esté bien instalado ejecutando:
```bash
node -v
npm -v
```

### 🛠️ Error: "El servidor no arranca"  
**Solución:** Verifica que escribiste bien `node server.js` y que no hay otros programas usando el puerto 10000.  

---

## 🌟 **Contribuciones**  
Si tienes ideas para mejorar MP3-YT, ¡envía un pull request o reporta un issue! 🤝  

---

## 📄 **Licencia**  
Este proyecto está bajo la **Licencia MIT**, lo que significa que puedes usar, modificar y compartir el código, pero siempre **bajo tu propia responsabilidad**.  

---

📩 **Contacto:** ladronbienve@gmail.com  
💖 **Hecho con amor para fines educativos.**  

