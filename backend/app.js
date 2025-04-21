const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const webpush = require("web-push");

dotenv.config();

const apiKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:balliendewh@gmail.com',
  apiKeys.publicKey,
  apiKeys.privateKey
);

const app = express();
const port = 3000;

app.use(cors({origin: ['https://2025-1-s1-g3-t2.vercel.app', 'http://localhost:5173']}));
app.use(express.json());
app.use(morgan("dev"));


const subData = [];

app.get("/", (req, res) => {
  console.log("✅ Server corriendo");
  res.send("Server para mandar notificaciones");
});

app.post("/save-subs", (req, res) => {
  const sub = req.body;

  if (!sub || !sub.endpoint) {
    return res.status(400).json({ error: "Suscripción inválida" });
  }

  const yaExiste = subData.find(s => s.endpoint === sub.endpoint);
  if (!yaExiste) {
    subData.push(sub);
    console.log("✅ Suscripción guardada:", sub.endpoint);
  } else {
    console.log("ℹ️ Suscripción ya registrada");
  }

  res.json({ status: "Success!" });
});

const enviarNotificacion = async (payload, res, label) => {
  if (subData.length === 0) {
    return res.status(400).json({ error: "No hay suscriptores" });
  }

  let enviados = 0;
  const indicesExpirados = [];

  // Recorremos cada suscripción
  for (let i = 0; i < subData.length; i++) {
    const suscriptor = subData[i];
    try {
      await webpush.sendNotification(suscriptor, JSON.stringify(payload));
      enviados++;
      console.log(`📤 Notificación de ${label} enviada a ${suscriptor.endpoint}`);
    } catch (err) {
      console.error(`❌ Error con ${suscriptor.endpoint}:`, err);
      // Si la subscripción expiró o es inválida, la marcamos para eliminarla
      if (err.statusCode === 410 || err.statusCode === 404) {
        indicesExpirados.push(i);
      }
    }
  }

  // Eliminamos las suscripciones expiradas (desde el final hacia el inicio)
  for (let idx of indicesExpirados.sort((a, b) => b - a)) {
    console.warn(`⚠️ Eliminando suscripción caducada: ${subData[idx].endpoint}`);
    subData.splice(idx, 1);
  }

  // Devolvemos un resumen
  res.json({
    status: `Notificación de ${label}: ${enviados} envíos, ${indicesExpirados.length} eliminaciones`,
    enviados,
    eliminadas: indicesExpirados.length
  });
};


app.get("/send-notification", (req, res) => {
  const payload = {
    title: "📣 Recordatorio",
    body: "Acuérdate de modificar tus imágenes antes de publicarlas",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png"
  };
  enviarNotificacion(payload, res, "recordatorio");
});

app.get("/notify-saved", (req, res) => {
  const payload = {
    title: "📸 Imagen guardada",
    body: "Tu imagen ha sido guardada correctamente.",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png"
  };
  enviarNotificacion(payload, res, "imagen guardada");
});

app.get("/notify-cleared", (req, res) => {
  const payload = {
    title: "🗑️ Imágenes eliminadas",
    body: "Todas tus imágenes guardadas han sido eliminadas.",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png"
  };
  enviarNotificacion(payload, res, "imágenes eliminadas");
});

app.get("/notify-filter", (req, res) => {
  const payload = {
    title: "🎨 Filtro aplicado",
    body: "¡Has aplicado un nuevo filtro a tu imagen!",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png"
  };
  enviarNotificacion(payload, res, "filtro");
});

// 🛠️ Manejo global de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error inesperado:", err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

app.listen(port, () => {
  console.log(`🚀 Server escuchando en http://localhost:${port}`);
});
