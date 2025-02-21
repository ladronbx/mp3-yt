function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.*[?&]v=([^&#]+).*$/;
    return regex.test(url);
}

function extractVideoId(url) {
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : null;
}

function searchVideo() {
    const url = document.getElementById("videoUrl").value;
    const playlistMessage = document.getElementById("playlistMessage");
    const playlistCommand = document.getElementById("playlistCommand");
    const commandContainer = document.getElementById("commandContainer");

    if (!url || !isValidYouTubeUrl(url)) {
        alert("Ingresa un enlace válido de YouTube");
        return;
    }

    const videoId = extractVideoId(url);
    if (videoId) {
        document.getElementById("videoThumbnail").src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }

    document.getElementById("inputContainer").classList.add("hidden");
    document.getElementById("videoContainer").classList.remove("hidden");

    if (url.includes("list=")) {
        playlistCommand.textContent = `yt-dlp -x --audio-format mp3 -o "%(title)s.%(ext)s" "${url}"`;
        playlistMessage.classList.remove("hidden");
        commandContainer.classList.add("hidden"); // Ocultar comando si es necesario
    } else {
        playlistMessage.classList.add("hidden");
    }
}

async function download(format) {
    const url = document.getElementById("videoUrl").value;
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerText = `⚠️ Descargando en formato ${format.toUpperCase()}...`;

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, format })
        });

        if (!response.ok) throw new Error("Error al descargar el archivo");

        // Convertir la respuesta a un blob (archivo binario)
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "archivo";

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match) {
                filename = match[1];
            }
        } else {
            filename = format === "both" ? "video_audio.zip" : `video.${format}`;
        }

        // Crear enlace para descargar y permitir seleccionar carpeta
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        statusMessage.innerText = "✅ Descarga completada. ¿Deseas buscar otro video?";
        document.getElementById("videoContainer").classList.add("hidden");
        document.getElementById("confirmationScreen").classList.remove("hidden");

    } catch (error) {
        console.error("Error en la descarga:", error);
        statusMessage.innerText = "❌ Error al descargar el archivo.";
    }
}

// Asignar el evento al botón al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const showCommandBtn = document.getElementById("showCommandBtn");
    if (showCommandBtn) {
        showCommandBtn.addEventListener("click", function () {
            document.getElementById("commandContainer").classList.toggle("hidden");
        });
    }
});

function copyToClipboard() {
    const text = document.getElementById("playlistCommand").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Comando copiado al portapapeles");
    }).catch(err => {
        console.error("Error al copiar: ", err);
    });
}

function resetSearch() {
    location.reload();
}

function sayGoodbye() {
    document.body.innerHTML = "<h1>¡Gracias, hasta la próxima! 👋</h1>";
}