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
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```


## 🔧 Librerías principales

| Librería         | Uso                                                                 |
|------------------|---------------------------------------------------------------------|
| Workbox          | Precaching de recursos para offline                                 |
| IndexedDB        | Almacenamiento de imágenes procesadas                               |
| Web-Push         | Notificaciones en tiempo real                                       |
| Vite PWA Plugin  | Configuración y registro automático de Service Worker y manifest    |
