/* Offline cache for ATS25 Weather Station GitHub Pages, v0.4 */
'use strict';
const CACHE='ats25-weather-v04-20261120';
const ASSETS=['./','./index.html'];
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
 Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ats25-weather-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])
));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const cp=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',cp));}
   return response;
  }).catch(async()=>{
   return await caches.match('./index.html')||new Response('ATS25 Weather Station kan ikke åbnes offline endnu. Åbn appen én gang online.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }));
 }else event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
