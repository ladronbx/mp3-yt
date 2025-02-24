require('dotenv').config();
const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 10000;
const DOWNLOADS_DIR = path.join(__dirname, "downloads");

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

function isValidYouTubeUrl(url) {
    try {
        const urlObj = new URL(url);
        return ["youtube.com", "youtu.be"].some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false;
    }
}

function cleanYouTubeUrl(url) {
    const urlObj = new URL(url);
    return `https://www.youtube.com/watch?v=${urlObj.searchParams.get("v")}`;
}

app.post("/download", async (req, res) => {
    let { url, format } = req.body;
    if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url);

    try {
        const metadata = await youtubedl(url, { dumpSingleJson: true });
        const title = metadata.title.replace(/[<>:"/\\|?*]+/g, "");
        
        if (!title) {
            return res.status(500).json({ error: "No se pudo obtener el título del video." });
        }

        const fileBasePath = path.join(DOWNLOADS_DIR, title);
        
        if (format === "both") {
            const mp4File = `${fileBasePath}.mp4`;
            const mp3File = `${fileBasePath}.mp3`;
            const zipFile = `${fileBasePath}.zip`;

            await youtubedl(url, { output: mp4File, format: "mp4", ffmpegLocation: "/usr/bin/ffmpeg" });
            await youtubedl(url, { output: mp3File, extractAudio: true, audioFormat: "mp3" });

            const output = fs.createWriteStream(zipFile);
            const archive = archiver("zip", { zlib: { level: 9 } });

            archive.pipe(output);
            archive.append(fs.createReadStream(mp4File), { name: `${title}.mp4` });
            archive.append(fs.createReadStream(mp3File), { name: `${title}.mp3` });
            await archive.finalize();

            output.on("close", () => {
                res.setHeader("X-Filename", `${title}.zip`);
                res.download(zipFile, `${title}.zip`, () => {
                    [zipFile, mp4File, mp3File].forEach(file => fs.existsSync(file) && fs.unlinkSync(file));
                });
            });
        } else {
            const isMp4 = format === "mp4";
            const filePath = `${fileBasePath}.${isMp4 ? "mp4" : "mp3"}`;
            const options = isMp4
                ? { output: filePath, format: "mp4", ffmpegLocation: "/usr/bin/ffmpeg" }
                : { output: filePath, extractAudio: true, audioFormat: "mp3" };

            await youtubedl(url, options);

            res.setHeader("X-Filename", path.basename(filePath));
            res.download(filePath, path.basename(filePath), () => {
                fs.existsSync(filePath) && fs.unlinkSync(filePath);
            });
        }
    } catch (error) {
        console.error("Error en la descarga:", error);
        res.status(500).json({ error: "Error al descargar el archivo" });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
