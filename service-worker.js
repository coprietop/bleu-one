const CACHE='bleu-tools-v1';
const ASSETS=['./','index.html','styles.css','app.js','manifest.json','assets/logo-bleu.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
