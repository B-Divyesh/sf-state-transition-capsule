const baseUrl = new URL(process.env.LIVE_BASE_URL ?? "https://state-transition-capsule.sociobot.in/");
const routes = ["/", "/demo", "/privacy/", "/terms/", "/404.html"];
const pages = new Map();
const checked = new Map();

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, { redirect: "follow", ...options });
  if (response.status < 200 || response.status >= 400) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response;
}

for (const route of routes) {
  const url = new URL(route, baseUrl);
  const response = await fetchChecked(url);
  pages.set(url.pathname, await response.text());
}

const hrefs = new Set(
  [...pages.values()].flatMap((html) =>
    [...html.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1])
  )
);

for (const href of hrefs) {
  if (href.startsWith("mailto:")) continue;
  if (href.includes("/checkout")) throw new Error(`Purchase link must remain hidden until registration: ${href}`);

  const url = new URL(href, baseUrl);
  const fragment = url.hash;
  url.hash = "";
  const key = url.href;
  let body = checked.get(key);
  if (body === undefined) {
    const response = await fetchChecked(url);
    body = await response.text();
    checked.set(key, body);
  }
  if (fragment && url.origin === baseUrl.origin) {
    const id = decodeURIComponent(fragment.slice(1));
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\bid=["']${escaped}["']`).test(body)) {
      throw new Error(`${href} points to a missing fragment`);
    }
  }
}

let missingRouteStatus = null;
if (process.env.CHECK_DEPLOYMENT_404 !== "0") {
  const missingUrl = new URL("/__polish_3_missing_route__", baseUrl);
  const missing = await fetch(missingUrl, { redirect: "manual" });
  const missingBody = await missing.text();
  if (missing.status !== 404 || !missingBody.includes("This page does not exist")) {
    throw new Error(`${missingUrl} did not return the designed HTTP 404`);
  }
  missingRouteStatus = missing.status;
}

console.log(JSON.stringify({
  baseUrl: baseUrl.href,
  routes: routes.length,
  uniqueLinks: hrefs.size,
  fetchedLinks: checked.size,
  checkoutLinks: 0,
  missingRouteStatus
}, null, 2));
