import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker, captureInstallPrompt } from "./utils/pwa";
import { featureFlags } from "./utils/featureFlags";

// Register PWA service worker if enabled
if (featureFlags.PWA_ENABLED) {
  registerServiceWorker();
  captureInstallPrompt();
}

createRoot(document.getElementById("root")!).render(<App />);
