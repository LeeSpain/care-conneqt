import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import i18n from "./i18n/config";

// Set HTML lang attribute
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.split('-')[0];
});
document.documentElement.lang = i18n.language.split('-')[0];

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <App />
  </Suspense>
);
