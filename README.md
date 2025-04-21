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


## 📚 Recursos consultados

- [Instalación de Emscripten](https://emscripten.org/docs/getting_started/downloads.html)  
- [Implementación de WebAssembly - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=_8T9T6MQ1fU&list=PLysLvOneEETPM_YbEyZcJ35_3pSdrj33O&index=1&ab_channel=MichaelGrieco)
- [PWA From Scratch - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=sFsRylCQblw)
- [PWA Push Notifications](https://www.youtube.com/watch?v=N9zpRvFRmj8)
- [PWA Push Notifiactions Tutorial - Lista de reproducción en YouTube](https://www.youtube.com/watch?v=3bvWX7bgwV8)

