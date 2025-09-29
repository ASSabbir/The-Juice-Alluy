import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {  RouterProvider } from "react-router-dom";
import { Route } from "./Route.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={Route} />
    </AuthProvider>
  </StrictMode>
);
