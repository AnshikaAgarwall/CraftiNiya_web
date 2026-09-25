import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Automatically reload tab if a new Vercel deployment replaced chunk hashes
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
<StrictMode>
<BrowserRouter>
<App />
</BrowserRouter>
</StrictMode>
);