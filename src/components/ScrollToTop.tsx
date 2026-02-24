import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main window
    window.scrollTo(0, 0);

    // Also scroll any overflow-auto containers (dashboard layouts)
    requestAnimationFrame(() => {
      document.querySelectorAll('.overflow-auto, .overflow-y-auto').forEach((el) => {
        el.scrollTop = 0;
      });
    });
  }, [pathname]);

  return null;
};
