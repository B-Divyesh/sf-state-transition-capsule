import { defineConfig } from "vite";

export default defineConfig({
  root: "site",
  publicDir: "public",
  build: {
    outDir: "../dist/site",
    emptyOutDir: true,
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      input: {
        home: new URL("./site/index.html", import.meta.url).pathname,
        privacy: new URL("./site/privacy/index.html", import.meta.url).pathname,
        terms: new URL("./site/terms/index.html", import.meta.url).pathname
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 4173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  },
  plugins: [{
    name: "capsule-offline-shell",
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle).filter((file) => !file.endsWith(".map"));
      const urls = ["/", "/privacy/", "/terms/", ...files.map((file) => `/${file}`)];
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: `const CACHE="stc-v1";const ASSETS=${JSON.stringify(urls)};self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return response}).catch(()=>e.request.mode==="navigate"?caches.match("/"):undefined)))})`
      });
    }
  }]
});
