const CACHE_NAME = '2021teonubaQEssEA';
const FILES_TO_CACHE = [
    './sw.js',
    './assets/js/script.min.js',
    './assets/img/FORMATO_CONFIRMACION.jpg',
    'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js',
    'assets/bootstrap/js/bootstrap.min.js',
    'assets/js/jquery.min.js',
    'assets/bootstrap/css/bootstrap.min.css',
    'assets/css/styles.min.css',
    'https://fonts.googleapis.com/css?family=Alata&amp;display=swap',
    'https://fonts.googleapis.com/css?family=Alfa+Slab+One&amp;display=swap',
    'https://fonts.googleapis.com/css?family=Montserrat&amp;display=swap',
    'https://fonts.googleapis.com/css?family=Montserrat+Alternates&amp;display=swap'

];

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    var keepList = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNameList => {
            return Promise.all(cacheNameList.map(cacheName => {
                if (keepList.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            }));
        })
    );
});

/* self.addEventListener('fetch', function(event) {
    /* console.log('On fetch');
    console.log(event.request); */
/* 
    if (event.request.method != 'GET') return;

    event.respondWith(
        fetch(event.request).catch(() => {
           // return caches.match('./404.html');
        })
    );
}); */



function fetchAndCache(url) {
    return fetch(url)
        .then((response) => {
            // comprobación de se recibe una respuesta valida
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return caches.open(CACHE_NAME)
                .then((cache) => {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch((error) => {
            /* console.log('Request failed:', error); */
            // Puede devolver una página 404 personalizada fuera de línea aquí
        });
}

/* self.addEventListener('fetch', event => {
    /* console.log(event.request.url); */
   /*  if (event.request.method !== "GET") return;
    if (event.request.url.indexOf('/api/') !== -1) {
        event.respondWith(fetchAndCache(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetchAndCache(event.request);
            })
        );
    }
}); */

self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((r) => {
            console.log('[Servicio Worker] Obteniendo recurso: '+e.request.url);
        return r || fetch(e.request).then((response) => {
                  return caches.open(CACHE_NAME).then((cache) => {
            console.log('[Servicio Worker] Almacena el nuevo recurso: '+e.request.url);
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  });

function getExpenses(cb) {
    apiClient(`${serverUrl}api/expense`)
        .catch(() => caches.match(`${serverUrl}api/expense`))
        .then(response => response.json())
        .then(cb);
}

function getExpense(expenseId, cb) {
    apiClient(`${serverUrl}api/expense/${expenseId}`)
        .catch(() => caches.match(`${serverUrl}api/expense/${expenseId}`))
        .then(response => response.json())
        .then(cb);
}