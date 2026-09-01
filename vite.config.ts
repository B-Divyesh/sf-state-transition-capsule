import { defineConfig } from "vite";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const siteOutput = fileURLToPath(new URL("./dist/site", import.meta.url));

function cacheVersion(files: readonly string[]): string {
  // Hash paths and bytes so edits to non-hashed HTML or images also roll the shell forward.
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(join(siteOutput, file)));
  }
  return `stc-${hash.digest("hex").slice(0, 12)}`;
}

function emittedFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? emittedFiles(file) : [relative(siteOutput, file)];
  });
}

function publicUrl(file: string): string {
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
  return `/${file}`;
}

function replaceMeta(document: string, selector: RegExp, value: string): string {
  return document.replace(selector, value);
}

function emitDemoDocument(): void {
  const home = readFileSync(join(siteOutput, "index.html"), "utf8");
  const demo = [
    [/<meta name="description" content="[^"]*"\s*\/?\s*>/, '<meta name="description" content="Try two sample run files in the State Transition Capsule comparison viewer." />'],
    [/<link rel="canonical" href="[^"]*"\s*\/?\s*>/, '<link rel="canonical" href="https://state-transition-capsule.sociobot.in/demo" />'],
    [/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, '<meta property="og:title" content="Demo — State Transition Capsule" />'],
    [/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, '<meta property="og:description" content="Try two sample run files and find the first changed field." />'],
    [/<meta property="og:url" content="[^"]*"\s*\/?\s*>/, '<meta property="og:url" content="https://state-transition-capsule.sociobot.in/demo" />'],
    [/<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/, '<meta name="twitter:title" content="Demo — State Transition Capsule" />'],
    [/<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/, '<meta name="twitter:description" content="Try two sample run files and find the first changed field." />'],
    [/<title>[^<]*<\/title>/, '<title>Demo — State Transition Capsule</title>']
  ].reduce((document, [selector, replacement]) => replaceMeta(document, selector as RegExp, replacement as string), home);
  mkdirSync(join(siteOutput, "demo"), { recursive: true });
  writeFileSync(join(siteOutput, "demo", "index.html"), demo);
}

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
        notFound: new URL("./site/404.html", import.meta.url).pathname,
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
    closeBundle() {
      emitDemoDocument();
      // Vite removes empty HTML entry chunks after Rollup's generateBundle
      // phase, but leaves their sourcemaps. Scan the final output instead of
      // predicting it from Rollup's intermediate bundle.
      const files = emittedFiles(siteOutput)
        .filter((file) => file !== "sw.js" && !file.endsWith(".map") && file !== "staticwebapp.config.json")
        .sort();
      const urls = files.map(publicUrl);
      const cache = cacheVersion(files);
      writeFileSync(join(siteOutput, "sw.js"), `const CACHE=${JSON.stringify(cache)};const ASSETS=${JSON.stringify(urls)};
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok&&response.type==="basic"){const copy=response.clone();void caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>event.request.mode==="navigate"?caches.match("/"):Response.error())));});`);
    }
  }]
});
