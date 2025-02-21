require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");  // Reemplazo de youtube-dl-exec
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(cors());

// Límite de descargas
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 70,
    message: "Has alcanzado el límite de descargas. Intenta más tarde."
});
app.use("/download", limiter);
app.use(express.static("public"));

// Verificar si yt-dlp está instalado
exec("which yt-dlp", (err, stdout) => {
    if (err || !stdout.trim()) {
        console.error("❌ yt-dlp no está instalado o no se encuentra en la ruta.");
        process.exit(1);
    } else {
        console.log(`🛠️ Usando yt-dlp desde: ${stdout.trim()}`);
    }
});

// Función para validar URL de YouTube
function isValidYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);
}

function cleanYouTubeUrl(url) {
    const urlObj = new URL(url);
    return `https://www.youtube.com/watch?v=${urlObj.searchParams.get("v")}`;
}

// Definir directorio de descargas
const outputPath = path.join(__dirname, "downloads");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Función para ejecutar yt-dlp
function ejecutarYtDlp(comando) {
    return new Promise((resolve, reject) => {
        exec(comando, (error, stdout, stderr) => {
            if (error) {
                console.error("❌ Error al ejecutar yt-dlp:", stderr);
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
}

// Ruta de descarga
app.post("/download", async (req, res) => {
    let { url, format } = req.body;
    if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url);

    try {
        console.log(`🔍 Obteniendo metadata para: ${url}`);
        const metadataRaw = await ejecutarYtDlp(`yt-dlp -j "${url}"`);
        const metadata = JSON.parse(metadataRaw);

        console.log(`🎬 Video encontrado: "${metadata.title}" (${metadata.format_note})`);

        const title = metadata.title.replace(/[<>:"/\\|?*]+/g, "");

        if (format === "both") {
            const mp4File = path.join(outputPath, `${title}.mp4`);
            const mp3File = path.join(outputPath, `${title}.mp3`);
            const zipPath = path.join(outputPath, `${title}.zip`);

            console.log("📥 Descargando MP4...");
            await ejecutarYtDlp(`yt-dlp -f mp4 -o "${mp4File}" "${url}"`);

            console.log("📥 Descargando MP3...");
            await ejecutarYtDlp(`yt-dlp -x --audio-format mp3 -o "${mp3File}" "${url}"`);

            console.log("📦 Creando ZIP...");
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            archive.pipe(output);
            archive.append(fs.createReadStream(mp4File), { name: `${title}.mp4` });
            archive.append(fs.createReadStream(mp3File), { name: `${title}.mp3` });
            await archive.finalize();

            output.on("close", () => {
                console.log(`✅ ZIP creado: ${zipPath}`);
                res.setHeader("X-Filename", `${title}.zip`);
                res.download(zipPath, `${title}.zip`, () => {
                    fs.unlinkSync(zipPath);
                    fs.unlinkSync(mp4File);
                    fs.unlinkSync(mp3File);
                });
            });

        } else {
            let filename, outputFile, comando;
            if (format === "mp4") {
                filename = `${title}.mp4`;
                outputFile = path.join(outputPath, filename);
                comando = `yt-dlp -f mp4 -o "${outputFile}" "${url}"`;
            } else {
                filename = `${title}.mp3`;
                outputFile = path.join(outputPath, filename);
                comando = `yt-dlp -x --audio-format mp3 -o "${outputFile}" "${url}"`;
            }

            console.log(`📥 Descargando en formato ${format.toUpperCase()}...`);
            await ejecutarYtDlp(comando);

            console.log(`✅ Descarga completada: ${outputFile}`);
            res.setHeader("X-Filename", filename);
            res.download(outputFile, filename, () => {
                fs.unlinkSync(outputFile);
            });
        }
    } catch (error) {
        console.error("❌ Error en la descarga:", error);
        res.status(500).json({ error: "Error en la descarga", details: error });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
