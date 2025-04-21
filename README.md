# Trabajo 2: Web Assembly y PWAs

Aplicación web progresiva (PWA) para procesamiento de imágenes con WebAssembly (WASM), que incluye service workers con funcionamiento offline, notificaciones push y almacenamiento usando indexeddb.

# Frontend
## Setup
### Moverse al directorio
```sh
cd frontend/
```

### Instalar las dependencias
```sh
npm install
```

### Entorno de desarrollo
```sh
npm run dev
```

### Construcción para producción
```sh
npm run build
```
Para las notificaciones también hay que correr el backend.

# Backend
## Setup
### Moverse al directorio
```sh
cd backend/
```

### Instalar las dependencias
```sh
npm install
```

### Entorno de desarrollo y producción
```sh
npm run dev
```

### Crear el archivo .env
```sh
VAPID_PUBLIC_KEY='BPFqi1nh3Wo63O8B8CN2ouaIDqT0fD155Ie90BMGovcDCvJlw4Vrwi3LpgHBJadTro0eUHiIBkacZ4HU2jhVKKo'

VAPID_PRIVATE_KEY='d9ts6uWNvlZWvXKvLT3pZxKoJYD49bhpxduL3iMvEmo'
```
## Deploy
El frontend se encuentra en https://2025-1-s1-g3-t2.vercel.app/

## 🔧 Librerías principales

| Librería         | Uso                                                                 |
|------------------|---------------------------------------------------------------------|
| Workbox          | Precaching de recursos para offline                                 |
| IndexedDB        | Almacenamiento de imágenes procesadas                               |
| Web-Push         | Notificaciones en tiempo real                                       |
| Vite PWA Plugin  | Configuración y registro automático de Service Worker y manifest    |
| Emscripten       | Compilación del código C/C++ a WebAssembly                          |


## Funciones en C para WebAssembly

> 📌 **Nota**: Cada función definida en C debe llevar la etiqueta `EMSCRIPTEN_KEEPALIVE` justo arriba de su definición. Esto permite que las funciones se mantengan accesibles desde JavaScript cuando el código se ejecuta como WebAssembly.


### Tipos de datos utilizados

```c
typedef struct {
    uint8_t r, g, b;
} RGB;
```

### Funciones

Se modelaron 4 funciones, cada una recibe como parámetros:
- `image`: Puntero al arreglo de píxeles RGB de la imagen.
- `width`: Ancho de la imagen.
- `height`: Alto de la imagen.

Además, niguna función retorna un valor, sino que modifica la imagen en el mismo puntero.
Cada función se encarga de aplicar un filtro:

#### `void apply_black_and_white(RGB* image, int width, int height)`

Convierte una imagen a escala de grises. Calcula el promedio de los canales rojo, verde y azul para cada píxel y asigna ese valor a todos los canales.

---

#### `void apply_blur(RGB* image, int width, int height)`

Aplica un desenfoque simple utilizando el promedio de los píxeles vecinos (filtro de caja 3x3).

---

#### `void apply_darken(RGB* image, int width, int height)`

Oscurece cada píxel de la imagen restando 30 unidades a cada canal de color, sin que los valores bajen de 0.

---

#### `void apply_edges(RGB* image, int width, int height)`

Detecta bordes usando un filtro basado en el kernel de realce (tipo Laplaciano). Resalta los cambios bruscos en el color de los píxeles vecinos.

---

#### `void apply_lighten(RGB* image, int width, int height)`

Aclara la imagen aumentando cada canal de color en 20 unidades, sin exceder el máximo de 255.

---

### Consideraciones

- El comando de compilación debe verse así:
    
```bash
emcc ruta/archivo.c -o ruta/archivo_compilado.js 
-s NO_EXIT_RUNTIME=1 
-s EXPORTED_RUNTIME_METHODS='["cwrap"]' 
-s EXPORTED_FUNCTIONS='["_apply_black_and_white", "_apply_blur", "_apply_darken", "_apply_edges", "_apply_lighten", "_malloc", "_free"]'
```

## 📚 Recursos consultados

- [Instalación de Emscripten](https://emscripten.org/docs/getting_started/downloads.html)  
- [Implementación de WebAssembly - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=_8T9T6MQ1fU&list=PLysLvOneEETPM_YbEyZcJ35_3pSdrj33O&index=1&ab_channel=MichaelGrieco)
- [PWA From Scratch - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=sFsRylCQblw)
- [PWA Push Notifications](https://www.youtube.com/watch?v=N9zpRvFRmj8)
- [PWA Push Notifiactions Tutorial - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=3bvWX7bgwV8)

