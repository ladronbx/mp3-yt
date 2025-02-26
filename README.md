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

## ❗ Posibles Errores y Soluciones

### 🔥 Error: `node no se reconoce como un comando`
**Causa:** Node.js no está instalado o no está en la variable de entorno.  

**Solución:**  
1. Reinstala [Node.js](https://nodejs.org/).  
2. Reinicia tu computadora.  
3. Verifica la instalación ejecutando:  
   ```sh
   node -v
   ```
   
📌 **Windows:** Si el problema persiste, agrega manualmente la ruta de Node.js en las variables de entorno:  
   1. Abre **Ejecutar** (`Win + R`), escribe `sysdm.cpl` y presiona **Enter**.  
   2. Ve a la pestaña **Opciones avanzadas** → **Variables de entorno**.  
   3. En **Variables del sistema**, edita `Path` y agrega la ruta de Node.js (ejemplo: `C:\Program Files\nodejs\`).  

---

### 🛡️ Error: `npm command not found`
**Causa:** npm no está instalado o hay un problema con Node.js.  

**Solución:**  
1. Asegúrate de que Node.js está instalado.  
2. Verifica la instalación con:  
   ```sh
   node -v
   npm -v
   ```
3. Si el problema persiste:  
   - 📌 **Windows:** Reinstala Node.js y marca la opción **"Agregar npm a la ruta del sistema"**.  
   - 📌 **Mac/Linux:** Reinstala npm con:  
     ```sh
     curl -L https://www.npmjs.com/install.sh | sh
     ```

---

### ⚠️ Error: `spawn yt-dlp ENOENT`
**Causa:** `yt-dlp` no está instalado o no está en la ruta del sistema.  

**Solución:**  
1. Verifica si `yt-dlp` está instalado ejecutando:  
   ```sh
   yt-dlp --version
   ```
2. Si no está instalado, usa uno de estos métodos:  

   - 📌 **Mac (con Homebrew - recomendado):**  
     ```sh
     brew install yt-dlp
     ```
   - 📌 **Mac/Linux (recomendado con `pip`)**:  
     ```sh
     pip install yt-dlp
     ```
   - 📌 **Windows (recomendado con `pip`)**:  
     ```sh
     py -m pip install yt-dlp
     ```
   - 📌 **Instalación con npm (opcional)**:  
     ```sh
     npm install -g yt-dlp
     ```
   - 📌 **Descarga manual (Mac/Linux)**:  
     ```sh
     sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
     sudo chmod a+rx /usr/local/bin/yt-dlp
     ```
   - 📌 **Descarga manual (Windows)**:  
     1. Descarga `yt-dlp.exe` desde [GitHub](https://github.com/yt-dlp/yt-dlp/releases/latest).  
     2. Guárdalo en `C:\Windows\System32` o en la misma carpeta del proyecto.  

3. **Verifica la ruta del sistema:**  
   - 📌 **Mac/Linux:**  
     ```sh
     which yt-dlp
     ```
   - 📌 **Windows (PowerShell):**  
     ```powershell
     Get-Command yt-dlp
     ```

Si no aparece ninguna ruta, agrégala manualmente:  

- 📌 **Mac/Linux (`~/.zshrc` o `~/.bashrc`)**:  
  ```sh
  export PATH=$PATH:/usr/local/bin
  ```
  Luego, recarga con:  
  ```sh
  source ~/.zshrc
  ```

- 📌 **Windows:** Agrega la ruta de `yt-dlp.exe` en las **Variables de entorno** (ver pasos en el primer error).

---

### 🛠️ Error: `El servidor no arranca`
**Causa:** El servidor no está ejecutándose o el puerto 10000 está en uso.  

**Solución:**  
1. Asegúrate de ejecutar correctamente el servidor con:  
   ```sh
   node server.js
   ```
2. Verifica si el puerto **10000** está en uso:  

   - 📌 **Mac/Linux:**  
     ```sh
     lsof -i :10000
     ```
   - 📌 **Windows (PowerShell):**  
     ```powershell
     netstat -ano | findstr :10000
     ```
     
3. Si hay un proceso ocupando el puerto, ciérralo:  

   - 📌 **Mac/Linux:**  
     ```sh
     kill -9 <PID>
     ```
   - 📌 **Windows (CMD como Administrador):**  
     ```sh
     taskkill /PID <PID> /F
     ```

4. Vuelve a iniciar el servidor:  
   ```sh
   node server.js
   ```

---

### 🐛 Error: `Error: listen EADDRINUSE: address already in use`
**Causa:** Otro proceso está usando el puerto **10000**.  

**Solución:**  
1. Encuentra el proceso que usa el puerto con:  
   - 📌 **Mac/Linux:**  
     ```sh
     lsof -i :10000
     ```
   - 📌 **Windows (PowerShell):**  
     ```powershell
     netstat -ano | findstr :10000
     ```
2. Mata el proceso con:  
   - 📌 **Mac/Linux:**  
     ```sh
     kill -9 <PID>
     ```
   - 📌 **Windows:**  
     ```sh
     taskkill /PID <PID> /F
     ```
3. Inicia nuevamente el servidor con:  
   ```sh
   node server.js
   ```


---

## 🌟 **Contribuciones**  
Si tienes ideas para mejorar MP3-YT, ¡envía un pull request o reporta un issue! 🤝  

---

## 📄 **Licencia**  
Este proyecto está bajo la **Licencia MIT**, lo que significa que puedes usar, modificar y compartir el código, pero siempre **bajo tu propia responsabilidad**.  

---

📩 **Contacto:** ladronbienve@gmail.com  
💖 **Hecho con amor para fines educativos.**  

