import './pwa/registerSW.js';
import { saveImageToDB, getAllImages, clearImagesFromDB } from './utils/db.js';
import { subscribeUserToPush } from './utils/push.js';
import axios from 'axios';

let Module;
let blackWhiteCopy, lightenCopy, darkenCopy, blurCopy, edgesCopy;

const inputFile = document.getElementById("input-file");
const blackWhiteBtn = document.getElementById("black-and-white");
const blurBtn = document.getElementById("blur");
const darkenBtn = document.getElementById("darken");
const edgesBtn = document.getElementById("edges");
const lightenBtn = document.getElementById("lighten");
const resetBtn = document.getElementById("reset");
const saveBtn = document.getElementById("save");
const savedList = document.getElementById("saved-list");
const clearBtn = document.getElementById("clear");

const canvas = document.getElementById("canvas");
const canvasEffect = document.getElementById("canvas-effect");
const ctx = canvas.getContext("2d");
const ctxEffect = canvasEffect.getContext("2d");

let imageDataOriginal = null;
let imageDataWorking = null;
let scaledWidth = 0;
let scaledHeight = 0;
let offsetX = 0;
let offsetY = 0;

// 🟡 Pide permiso para notificaciones al inicio
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    console.log("🔔 Permiso de notificaciones:", permission);
  });
}

// Carga dinámica del script compilado sin MODULARIZE
function loadWasmModule() {
  return new Promise((resolve, reject) => {
    window.Module = {
      onRuntimeInitialized: () => {
        resolve(window.Module);
      }
    };

    const script = document.createElement("script");
    script.src = "/filters/filters.js"; // asegúrate que esté en /public/filters/
    script.onload = () => {
      if (!window.Module) reject("❌ No se cargó el módulo WASM");
    };
    script.onerror = () => reject("❌ Error cargando filters.js");
    document.body.appendChild(script);
  });
}

loadWasmModule().then((mod) => {
  Module = mod;
  initWASM();
});

function initWASM() {
  try {
    blackWhiteCopy = Module.cwrap("apply_black_and_white", null, ["number", "number", "number"]);
    lightenCopy = Module.cwrap("apply_lighten", null, ["number", "number", "number"]);
    darkenCopy = Module.cwrap("apply_darken", null, ["number", "number", "number"]);
    blurCopy = Module.cwrap("apply_blur", null, ["number", "number", "number"]);
    edgesCopy = Module.cwrap("apply_edges", null, ["number", "number", "number"]);

    blackWhiteBtn.onclick = () => handleEffect(blackWhiteCopy, "Blanco y Negro");
    lightenBtn.onclick = () => handleEffect(lightenCopy, "Aclarar");
    darkenBtn.onclick = () => handleEffect(darkenCopy, "Oscurecer");
    blurBtn.onclick = () => handleEffect(blurCopy, "Desenfocar");
    edgesBtn.onclick = () => handleEffect(edgesCopy, "Visualizar bordes");

    resetBtn.onclick = () => {
      if (!imageDataOriginal) return;
      imageDataWorking = new ImageData(
        new Uint8ClampedArray(imageDataOriginal.data),
        imageDataOriginal.width,
        imageDataOriginal.height
      );
      ctxEffect.clearRect(0, 0, canvas.width, canvas.height);
      ctxEffect.putImageData(imageDataWorking, offsetX, offsetY);
    };
  } catch (err) {
    console.error("❌ Error cargando funciones WASM", err);
  }
}

inputFile.onchange = () => {
  const file = inputFile.files[0];
  if (!file) return;

  const img = new Image();
  const objectURL = URL.createObjectURL(file);

  img.onload = () => {
    const maxWidth = canvas.width;
    const maxHeight = canvas.height;
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    scaledWidth = img.width * ratio;
    scaledHeight = img.height * ratio;
    offsetX = (maxWidth - scaledWidth) / 2;
    offsetY = (maxHeight - scaledHeight) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxEffect.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

    imageDataOriginal = ctx.getImageData(offsetX, offsetY, scaledWidth, scaledHeight);
    imageDataWorking = new ImageData(
      new Uint8ClampedArray(imageDataOriginal.data),
      imageDataOriginal.width,
      imageDataOriginal.height
    );

    ctxEffect.putImageData(imageDataWorking, offsetX, offsetY);
    URL.revokeObjectURL(objectURL);
  };

  img.src = objectURL;
};

function handleEffect(effectFunc, effectName) {
  applyEffect(effectFunc);
  showNotification(`Filtro aplicado: ${effectName}`);
}

function applyEffect(effectFunc) {
  if (!imageDataWorking) return;

  const rgbaData = imageDataWorking.data;
  const pixelCount = imageDataWorking.width * imageDataWorking.height;
  const rgbData = new Uint8Array(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    rgbData[i * 3] = rgbaData[i * 4];
    rgbData[i * 3 + 1] = rgbaData[i * 4 + 1];
    rgbData[i * 3 + 2] = rgbaData[i * 4 + 2];
  }

  const ptr = Module._malloc(rgbData.length);
  Module.HEAPU8.set(rgbData, ptr);
  effectFunc(ptr, imageDataWorking.width, imageDataWorking.height);
  const result = Module.HEAPU8.subarray(ptr, ptr + rgbData.length);
  const output = new Uint8ClampedArray(pixelCount * 4);

  for (let i = 0; i < pixelCount; i++) {
    output[i * 4] = result[i * 3];
    output[i * 4 + 1] = result[i * 3 + 1];
    output[i * 4 + 2] = result[i * 3 + 2];
    output[i * 4 + 3] = 255;
  }

  const imageData = new ImageData(output, imageDataWorking.width, imageDataWorking.height);
  ctxEffect.clearRect(0, 0, canvas.width, canvas.height);
  ctxEffect.putImageData(imageData, offsetX, offsetY);
  imageDataWorking = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
  Module._free(ptr);
}

saveBtn.onclick = async () => {
  if (!imageDataWorking) return;

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = scaledWidth;
  exportCanvas.height = scaledHeight;
  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.putImageData(imageDataWorking, 0, 0);

  exportCanvas.toBlob(async (blob) => {
    if (blob) {
      await saveImageToDB(`imagen-${Date.now()}`, blob);
      showSavedImages();
      showNotification("✅ Imagen guardada correctamente");
    }
  }, "image/png");
};

clearBtn.onclick = async () => {
  await clearImagesFromDB();
  showNotification("🗑️ Imágenes eliminadas correctamente");
  showSavedImages();
};

async function showSavedImages() {
  const images = await getAllImages();
  savedList.innerHTML = "";
  images.forEach(item => {
    const url = URL.createObjectURL(item.blob);
    const img = document.createElement("img");
    img.src = url;
    img.alt = item.name;
    savedList.appendChild(img);
  });
}

function showNotification(message) {
  const notify = async (url, logMsg, errorMsg) => {
    try {
      const online = navigator.onLine;
      if (!online) {
        console.warn("🚫 Sin conexión: no se puede enviar notificación push.");
        return;
      }

      const res = await axios.get(url); // Ahora usa axios
    } catch (err) {
      if (err.response) {
        console.error(`${errorMsg} (HTTP ${err.response.status})`, err.response.data);
      } else if (err.request) {
        console.error(`${errorMsg}: No se recibió respuesta del servidor`, err.request);
      } else {
        console.error(`${errorMsg}:`, err.message);
      }
    }
  };

  if (message.includes("guardada")) {
    notify(
      "http://localhost:3000/notify-saved",
      "📤 Notificación push de guardado enviada",
      "❌ Error enviando notificación push (guardado)"
    );
  }

  if (message.includes("eliminadas")) {
    notify(
      "http://localhost:3000/notify-cleared",
      "📤 Notificación push de eliminación enviada",
      "❌ Error enviando notificación push (eliminación)"
    );
  }

  if (message.includes("aplicado")) {
    notify(
      "http://localhost:3000/notify-filter",
      "📤 Notificación push de efecto enviada",
      "❌ Error enviando notificación push (efecto)"
    );
  }
}


window.addEventListener("DOMContentLoaded", () => {
  showSavedImages();
});

window.addEventListener("load", async () => {
  if ("Notification" in window) {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
    }

    console.log("✅ Notificaciones activadas automáticamente");
    await subscribeUserToPush();
  }
});
