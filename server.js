require("dotenv").config();
const express = require("express");
const cors = require("cors");
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const archiver = require("archiver");

const ytDlpBinary = path.join(__dirname, "yt-dlp");

async function ensureYtDlp() {
    if (!fs.existsSync(ytDlpBinary)) {
        console.log("⚡ Descargando yt-dlp...");
        await YTDlpWrap.downloadFromGithub(ytDlpBinary);
        console.log("✅ yt-dlp instalado correctamente.");
    } else {
        console.log("✔️ yt-dlp ya está instalado.");
    }
}
ensureYtDlp();

const app = express();
const PORT = process.env.PORT || 10000;
const DOWNLOADS_DIR = "/tmp";

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(express.static("public"));

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 70,
    message: "Has alcanzado el límite de descargas. Intenta más tarde."
});

app.use("/download", limiter);

if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

const ytDlp = new YTDlpWrap();

function isValidYouTubeUrl(url) {
    console.log("🔍 Verificando URL:", url);
    try {
        const urlObj = new URL(url);
        const valid = ["youtube.com", "youtu.be"].some(domain => urlObj.hostname.includes(domain));
        console.log("✅ URL válida:", valid);
        return valid;
    } catch (error) {
        console.error("❌ Error al verificar la URL:", error);
        return false;
    }
}

function cleanYouTubeUrl(url) {
    console.log("🧹 Limpiando URL:", url);
    const urlObj = new URL(url);
    const cleanedUrl = `https://www.youtube.com/watch?v=${urlObj.searchParams.get("v")}`;
    console.log("🔧 URL limpia:", cleanedUrl);
    return cleanedUrl;
}

app.post("/download", async (req, res) => {
    let { url, format } = req.body;
    console.log("📥 Solicitud recibida:", { url, format });

    if (!url || !isValidYouTubeUrl(url)) {
        console.log("🚫 Enlace no válido:", url);
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url);

    const ytDlp = new YTDlpWrap();

    async function ensureYtDlp() {
        try {
            const binaryPath = ytDlp.getBinaryPath();
            if (!binaryPath || !fs.existsSync(binaryPath)) {
                console.log("⚡ Descargando yt-dlp...");
                await YTDlpWrap.downloadFromGithub();
                console.log("✅ yt-dlp instalado correctamente.");
            } else {
                console.log("✔️ yt-dlp ya está instalado.");
            }
        } catch (error) {
            console.error("❌ Error al descargar yt-dlp:", error);
            process.exit(1);
        }
    }
    
    // Asegurar que yt-dlp esté disponible antes de iniciar el servidor
    ensureYtDlp();
    



    try {
        console.log("📄 Obteniendo metadatos del video...");
        const metadata = await ytDlp.execPromise([url, "--dump-json"]);
        const metadataJson = JSON.parse(metadata);
        console.log("🎥 Metadatos obtenidos - Título:", metadataJson.title);

        const title = metadataJson.title.replace(/[<>:"/\\|?*]+/g, "");
        console.log("📛 Título del video:", title);

        if (!title) {
            console.error("❌ No se pudo obtener el título del video.");
            return res.status(500).json({ error: "No se pudo obtener el título del video." });
        }

        const fileBasePath = path.join(DOWNLOADS_DIR, title);
        console.log("📂 Ruta base del archivo:", fileBasePath);

        if (format === "both") {
            console.log("📦 Descargando ambos formatos (mp4 y mp3)...");
            const mp4File = `${fileBasePath}.mp4`;
            const mp3File = `${fileBasePath}.mp3`;
            const zipFile = `${fileBasePath}.zip`;

            await ytDlp.execPromise([url, "-f", "mp4", "-o", mp4File]);
            console.log("🎬 Archivo MP4 descargado:", mp4File);
            await ytDlp.execPromise([url, "-f", "bestaudio", "--extract-audio", "--audio-format", "mp3", "-o", mp3File]);
            console.log("🎶 Archivo MP3 descargado:", mp3File);

            const output = fs.createWriteStream(zipFile);
            const archive = archiver("zip", { zlib: { level: 9 } });

            archive.pipe(output);
            archive.append(fs.createReadStream(mp4File), { name: `${title}.mp4` });
            archive.append(fs.createReadStream(mp3File), { name: `${title}.mp3` });
            await archive.finalize();
            console.log("📦 Archivo ZIP creado:", zipFile);

            output.on("close", () => {
                res.setHeader("X-Filename", `${title}.zip`);
                res.download(zipFile, `${title}.zip`, () => {
                    console.log("✅ Descarga completada, eliminando archivos temporales...");
                    [zipFile, mp4File, mp3File].forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
                });
            });
        } else {
            console.log("📥 Descargando solo formato:", format);
            const isMp4 = format === "mp4";
            const filePath = `${fileBasePath}.${isMp4 ? "mp4" : "mp3"}`;
            const options = isMp4
                ? ["-f", "mp4", "-o", filePath]
                : ["-f", "bestaudio", "--extract-audio", "--audio-format", "mp3", "-o", filePath];

            await ytDlp.execPromise([url, ...options]);
            console.log("📥 Archivo descargado:", filePath);

            res.setHeader("X-Filename", path.basename(filePath));
            res.download(filePath, path.basename(filePath), () => {
                console.log("✅ Descarga completada, eliminando archivo temporal...");
                fs.existsSync(filePath) && fs.unlinkSync(filePath);
            });
        }
    } catch (error) {
        console.error("❌ Error en la descarga:", error);
        res.status(500).json({ error: "Error al descargar el archivo" });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
