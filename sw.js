/* Offline PWA. Solo recursos locales, caché limitada y actualización versionada. */
const CACHE='dead-cabin-404-v3-0-rc6';
const SHELL=['./','./index.html','./CARTAS-24.html','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-180.png','./css/style.css','./css/premium.css','./css/cinematic.css','./css/illustration.css','./css/edition18.css','./css/edition20.css','./css/edition21.css','./css/edition22.css','./css/edition23.css','./css/edition24.css','./css/edition25.css','./css/edition211.css','./css/edition30.css','./css/edition30rc2.css','./css/edition30rc6.css','./js/engine.js','./js/art.js','./js/premium-art.js','./js/chapter-art.js','./js/audio.js','./js/horror-director.js','./js/feedback.js','./js/card-ui.js','./js/telemetry.js','./js/tension.js','./js/atmosphere.js','./js/scene-art.js','./js/app.js','./js/cinematic.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dead-cabin-404-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone))}return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
  return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone))}return response}))) });
