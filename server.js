require("dotenv").config();
const express = require("express");
const cors = require("cors");
const youtubedl_exec = require("youtube-dl-exec");
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

// Verificar qué binario de yt-dlp usar
let youtubedl = youtubedl_exec.create("/usr/bin/yt-dlp");
console.log("🛠️ Usando youtube-dl-exec con:", youtubedl.binary);

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

// Ruta de descarga
app.post("/download", async (req, res) => {
    let { url, format } = req.body;
    if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url);

    try {
        console.log(`🔍 Obteniendo metadata para: ${url}`);
        const metadata = await youtubedl(url, { dumpSingleJson: true });
        console.log(`🎬 Video encontrado: "${metadata.title}" (${metadata.format_note})`);

        const title = metadata.title.replace(/[<>:"/\\|?*]+/g, "");

        if (format === "both") {
            const mp4File = path.join(outputPath, `${title}.mp4`);
            const mp3File = path.join(outputPath, `${title}.mp3`);
            const zipPath = path.join(outputPath, `${title}.zip`);

            console.log("📥 Descargando MP4...");
            await youtubedl(url, { output: mp4File, format: "mp4" });

            console.log("📥 Descargando MP3...");
            await youtubedl(url, { output: mp3File, extractAudio: true, audioFormat: "mp3" });

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
            let filename, outputFile, options;
            if (format === "mp4") {
                filename = `${title}.mp4`;
                outputFile = path.join(outputPath, filename);
                options = { output: outputFile, format: "mp4" };
            } else {
                filename = `${title}.mp3`;
                outputFile = path.join(outputPath, filename);
                options = { output: outputFile, extractAudio: true, audioFormat: "mp3" };
            }

            console.log(`📥 Descargando en formato ${format.toUpperCase()}...`);
            await youtubedl(url, options);

            console.log(`✅ Descarga completada: ${outputFile}`);
            res.setHeader("X-Filename", filename);
            res.download(outputFile, filename, () => {
                fs.unlinkSync(outputFile);
            });
        }
    } catch (error) {
        console.error("❌ Error en la descarga:", error.message);
        res.status(500).json({ error: "Error en la descarga", details: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));