import React from "react";
import { createRoot } from "react-dom/client";
import "~/ui/themes/base.css";
import "~/ui/themes/command-dark.css";
import "~/ui/themes/command-light.css";
import "~/ui/themes/high-contrast.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
