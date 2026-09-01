import "./styles.css";

const ROUTE_FOCUS_KEY = "stc:route-focus";

function focusRouteHeading(): void {
  const heading = document.querySelector<HTMLElement>("main h1");
  const announcer = document.getElementById("route-announcer");
  const shouldFocus = document.referrer.startsWith(location.origin) || sessionStorage.getItem(ROUTE_FOCUS_KEY) === "1";
  if (!heading || !shouldFocus) return;
  sessionStorage.removeItem(ROUTE_FOCUS_KEY);
  window.setTimeout(() => {
    heading.focus({ preventScroll: true });
    if (announcer) announcer.textContent = document.title;
  }, 0);
}

focusRouteHeading();
window.addEventListener("pageshow", focusRouteHeading);
window.addEventListener("pagehide", () => sessionStorage.setItem(ROUTE_FOCUS_KEY, "1"));

if (import.meta.env.PROD && "serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js"));
}
