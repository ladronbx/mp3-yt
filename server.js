const express = require("express");
const cors = require("cors");
const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad: Limitar tamaño de JSON
app.use(express.json({ limit: "1mb" }));

// Seguridad: Configuración de CORS
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["POST"]
};
app.use(cors(corsOptions));

// Seguridad: Rate Limit (máximo 10 peticiones cada 15 minutos)
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 70, // Máximo 100 descargas por IP en 1 hora
    message: "Has alcanzado el límite de descargas. Intenta más tarde."
});

app.use("/download", limiter);

app.use(express.static("public"));

function isValidYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);
}

function cleanYouTubeUrl(url) {
    const urlObj = new URL(url);
    return `https://www.youtube.com/watch?v=${urlObj.searchParams.get("v")}`;
}

app.post("/download", async (req, res) => {
    let { url } = req.body;
    if (!url || !isValidYouTubeUrl(url)) {
        return res.status(400).json({ error: "Enlace no válido. Solo se permiten enlaces de YouTube." });
    }

    url = cleanYouTubeUrl(url); // 🔹 Limpia la URL para evitar listas de reproducción

    const outputPath = path.join(__dirname, "downloads");
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    try {
        // Asegurar que solo se descarga el video sin lista de reproducción
        const metadata = await youtubedl(url, { dumpSingleJson: true });

        const title = metadata.title.replace(/[<>:"/\\|?*]+/g, ""); // Evita caracteres inválidos
        const filename = `${title}.mp3`;
        const outputFile = path.join(outputPath, filename);

        await youtubedl(url, {
            output: outputFile,
            extractAudio: true,
            audioFormat: "mp3",
        });

        res.setHeader("X-Filename", filename);
        res.download(outputFile, filename, () => {
            fs.unlinkSync(outputFile);
        });
    } catch (error) {
        res.status(500).json({ error: "Error al descargar el audio" });
    }
});


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
