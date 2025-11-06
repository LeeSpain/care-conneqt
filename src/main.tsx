import { createRoot } from "react-dom/client";
import { StrictMode, Suspense } from "react";
import App from "./App.tsx";
import "./index.css";
import i18n from "./i18n/config";

// Set HTML lang attribute after i18n is ready
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng?.split('-')[0] || 'en';
});

// Set initial language when i18n is initialized
if (i18n.isInitialized) {
  document.documentElement.lang = i18n.language?.split('-')[0] || 'en';
} else {
  i18n.on('initialized', () => {
    document.documentElement.lang = i18n.language?.split('-')[0] || 'en';
  });
}

// Optimized loading screen component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-pulse">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
      </div>
      <p className="text-sm text-muted-foreground">Loading Care Conneqt...</p>
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <App />
    </Suspense>
  </StrictMode>
);
