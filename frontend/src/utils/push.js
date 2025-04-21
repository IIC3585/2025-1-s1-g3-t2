const publicKey = 'BPFqi1nh3Wo63O8B8CN2ouaIDqT0fD155Ie90BMGovcDCvJlw4Vrwi3LpgHBJadTro0eUHiIBkacZ4HU2jhVKKo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
  .replace(/-/g, '+')
  .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

const saveSubscription = async (sub) => {
    const response = await fetch('https://two025-1-s1-g3-t2.onrender.com/save-subs', {
        method : 'post',
        headers : {'Content-type': 'application/json'},
        body: JSON.stringify(sub)
    })
}
export async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    console.log('Suscripción exitosa:', JSON.stringify(subscription));
    const response = await saveSubscription(subscription);
  } catch (err) {
    console.error('Error al suscribirse: ', err);
  }
}
