require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(cors());

const { exec } = require("child_process");

function runYtDlp(url, options) {
    return new Promise((resolve, reject) => {
        // const command = `/opt/homebrew/bin/yt-dlp ${options} "${url}"`;
        const command = `yt-dlp ${options} "${url}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error ejecutando yt-dlp: ${stderr}`);
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
}

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 70,
    message: "Has alcanzado el límite de descargas. Intenta más tarde."
});

app.use("/download", limiter);
app.use(express.static("public"));

function isValidYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);
}

function cleanYouTubeUrl(url) {
    try {
        const urlObj = new URL(url);
        return `https://www.youtube.com/watch?v=${urlObj.searchParams.get("v")}`;
    } catch (error) {
        return null;
    }
}

app.post("/download", async (req, res) => {
    let { url, format } = req.body;
    if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url);
    if (!url) {
        return res.status(400).json({ error: "URL inválida" });
    }

    // const outputPath = path.join(__dirname, "downloads");
    const outputPath = "/tmp";
    
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    try {
        // const metadata = await youtubedl(url, { dumpSingleJson: true });
        const metadataJson = await runYtDlp(url, "--dump-json");
        const metadata = JSON.parse(metadataJson);

        const title = metadata.title.replace(/[<>:"/\\|?*]+/g, "");
        const filesToDelete = [];

        if (format === "both") {
            const mp4File = path.join(outputPath, `${title}.mp4`);
            const mp3File = path.join(outputPath, `${title}.mp3`);

            await runYtDlp(url, `-f mp4 -o "${mp4File}" --ffmpeg-location ffmpeg`);
            await runYtDlp(url, `-x --audio-format mp3 -o "${mp3File}"`);            

            filesToDelete.push(mp4File, mp3File);

            const zipPath = path.join(outputPath, `${title}.zip`);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver("zip", { zlib: { level: 9 } });

            archive.pipe(output);
            archive.append(fs.createReadStream(mp4File), { name: `${title}.mp4` });
            archive.append(fs.createReadStream(mp3File), { name: `${title}.mp3` });
            await archive.finalize();

            output.on("close", () => {
                res.setHeader("X-Filename", `${title}.zip`);
                res.download(zipPath, `${title}.zip`, (err) => {
                    if (!err) {
                        filesToDelete.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
                    }
                });
            });

        } else {
            let filename, outputFile, options;

            if (format === "mp4") {
                filename = `${title}.mp4`;
                outputFile = path.join(outputPath, filename);
                options = { output: outputFile, format: "mp4", ffmpegLocation: "ffmpeg" };
            } else {
                filename = `${title}.mp3`;
                outputFile = path.join(outputPath, filename);
                options = { output: outputFile, extractAudio: true, audioFormat: "mp3" };
            }

            await runYtDlp(url, format === "mp4" ? `-f mp4 -o "${outputFile}" --ffmpeg-location ffmpeg` : `-x --audio-format mp3 -o "${outputFile}"`);

            filesToDelete.push(outputFile);

            res.setHeader("X-Filename", filename);
            res.download(outputFile, filename, (err) => {
                if (!err) {
                    filesToDelete.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
                }
            });
        }
    } catch (error) {
        console.error("Error en la descarga:", error);
        res.status(500).json({ error: "Error al descargar el archivo" });
    }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
