import "./styles.css";

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js"));
}
