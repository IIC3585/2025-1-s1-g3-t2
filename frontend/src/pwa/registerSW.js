import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Una nueva versión está disponible. Puedes actualizar.');
  },
  onOfflineReady() {
    console.log('La aplicación está lista para funcionar sin conexión.');
  }
});
