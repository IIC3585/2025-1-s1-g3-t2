# backend-t2-web

Para correr es npm install y npm run dev

## 🔌 Endpoints del Backend

```javascript```

`POST /save-subs `
Guarda las subscripciones push, provenientes del frontend al permitir las notificaciones.

`GET /notify-saved `
Envía una notificación cuando se guarda una imagen.

`GET /notify-cleared `
Envía una notificación cuando se eliminan las imagenes guardadas.

`GET /notify-filter `
Envía una notificación cuando se aplica un filtro.

`GET /send-notification `
Se puede enviar una notificación desde el servidor al cargar este endpoint.
