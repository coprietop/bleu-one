const CACHE='bleu-one-v77-finance-20260728';
const ASSETS=['./','index.html','styles-v75.css','app-v75.js','sales-simulator-v75.js','finance-simulator-v77.js','manifest.json','assets/logo-bleu.png','assets/sello-bleu-transparente.png','assets/ganadores-moto-primer-semestre-2026.jpg','assets/programa-mono-azul.jpg','assets/material-compartir-negocio.pdf'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request)))});
