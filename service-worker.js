const CACHE="brewboard-v1";
const FILES=["./","./index.html","./css/style.css","./js/app.js","./assets/coffee.svg","./assets/chai.svg","./assets/samosa.svg","./assets/maggi.svg","./assets/sandwich.svg","./assets/fries.svg","./assets/soda.svg","./assets/puff.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("./index.html")))));