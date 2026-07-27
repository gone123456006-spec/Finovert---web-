import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import "./styles/index.css";

const rootEl = document.getElementById("root")!;
const root = createRoot(rootEl);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Remove initial loader AFTER React first paint using double-RAF
// This ensures content is visible before removing the skeleton
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.querySelector('.finovert-loader');
    if (loader) {
      (loader as HTMLElement).style.transition = 'opacity 0.2s ease-out';
      (loader as HTMLElement).style.opacity = '0';
      setTimeout(() => loader.remove(), 220);
    }
  });
});