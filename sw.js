// 오프라인에서도 열리도록 앱 파일을 저장해 두고, 인터넷이 되면 새 버전을 받아요.
const CACHE="grammar-step-v1";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  // 페이지는 새 버전 우선, 안 되면 저장본
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp));return r}).catch(()=>caches.match("./index.html")));
    return;
  }
  // 그 밖의 파일(아이콘, 글꼴)은 저장본 우선
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok||r.type==="opaque"){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
});
