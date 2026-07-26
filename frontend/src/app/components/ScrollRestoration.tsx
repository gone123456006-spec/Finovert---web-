import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Store scroll positions for each route
const scrollPositions = new Map<string, number>();

export function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const key = location.pathname + location.search;
    
    // Save current scroll position before unmounting
    const saveScroll = () => {
      scrollPositions.set(key, window.scrollY);
    };

    // Restore scroll position on mount
    const savedPosition = scrollPositions.get(key);
    if (savedPosition !== undefined) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 0);
    } else {
      // New page, scroll to top
      window.scrollTo(0, 0);
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      scrollPositions.set(key, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("beforeunload", saveScroll);

    return () => {
      saveScroll();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [location]);

  return null;
}
