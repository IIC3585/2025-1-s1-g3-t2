# Trabajo 2: Web Assembly y PWAs

Aplicación web progresiva (PWA) para procesamiento de imágenes con WebAssembly (WASM), que incluye service workers con funcionamiento offline, notificaciones push y almacenamiento usando indexeddb.

# Frontend
## Setup
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

## 🔧 Librerías principales

| Librería         | Uso                                                                 |
|------------------|---------------------------------------------------------------------|
| Workbox          | Precaching de recursos para offline                                 |
| IndexedDB        | Almacenamiento de imágenes procesadas                               |
| Web-Push         | Notificaciones en tiempo real                                      |
| Vite PWA Plugin  | Configuración y registro automático de Service Worker y manifest           |
