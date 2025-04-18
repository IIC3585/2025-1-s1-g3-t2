const inputFile = document.getElementById("input-file");

const blackWhiteBtn = document.getElementById("black-and-white");
const blurBtn = document.getElementById("blur");
const darkenBtn = document.getElementById("darken");
const edgesBtn = document.getElementById("edges");
const lightenBtn = document.getElementById("lighten");
const resetBtn = document.getElementById("reset");

const canvas = document.getElementById("canvas");
const canvasEffect = document.getElementById("canvas-effect");
const ctx = canvas.getContext("2d");
const ctxEffect = canvasEffect.getContext("2d");
const reader = new FileReader();

let imageDataOriginal = null;
let imageDataWorking = null;
let scaledWidth = 0;
let scaledHeight = 0;
let offsetX = 0;
let offsetY = 0;

let blackWhiteCopy, lightenCopy, darkenCopy, blurCopy, edgesCopy;

Module.onRuntimeInitialized = () => {
  blackWhiteCopy = Module.cwrap("apply_black_and_white", null, ["number", "number", "number"]);
  lightenCopy = Module.cwrap("apply_lighten", null, ["number", "number", "number"]);
  darkenCopy = Module.cwrap("apply_darken", null, ["number", "number", "number"]);
  blurCopy = Module.cwrap("apply_blur", null, ["number", "number", "number"]);
  edgesCopy = Module.cwrap("apply_edges", null, ["number", "number", "number"]);
};

inputFile.onchange = () => {
  const file = inputFile.files[0];
  if (file) {
    reader.readAsDataURL(file);
  }
};

reader.onload = (event) => {
  const img = new Image();

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
  };

  img.src = event.target.result;
};

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

  // actualizar imagen de trabajo con el resultado
  imageDataWorking = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  Module._free(ptr);
}

blackWhiteBtn.onclick = () => applyEffect(blackWhiteCopy);
lightenBtn.onclick = () => applyEffect(lightenCopy);
darkenBtn.onclick = () => applyEffect(darkenCopy);
blurBtn.onclick = () => applyEffect(blurCopy);
edgesBtn.onclick = () => applyEffect(edgesCopy);

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
