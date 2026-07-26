import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import "./styles/index.css";

// Remove initial loader once React is ready
const loader = document.querySelector('.finovert-loader');
if (loader) {
  loader.remove();
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);