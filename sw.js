const CACHE='hisui-guide-shell-v3';
const shell=['./','./index.html','./favicon.svg','./site.webmanifest'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(shell)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL('./',self.location.href).pathname))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){
      const clone=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,clone)));
    }
    return response;
  }).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
});
