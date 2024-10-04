import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";

import "@stellar/design-system/build/styles.min.css";
import "@/styles.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
