import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";

import { getRouter } from "../src/router";
import "../src/styles.css";

const router = getRouter();
router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });

const container = document.getElementById("root")!;

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
