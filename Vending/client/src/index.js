import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/homePage";
import ErrorPage from "./pages/error";
import Scanner from "./pages/qrScanner";
import Thank from "./pages/thankYou";
import Dispense from "./pages/dispense";
import { Counter, checkStock } from "./pages/medCounter";
import Vital from "./pages/vitals";
import { ThemeProvider } from './context/ThemeContext';
import VitalReport from "./pages/vitalReport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "scan",
    element: <Scanner />,
  },
  {
    path: "thank",
    element: <Thank />,
  },
  {
    path: "vital",
    element: <Vital />,
  },
  {
    path: "vital-report",
    element: <VitalReport />,
  },
  {
    path: "dispense-med",
    element: <Dispense />,
  },
  {
    path: "counter",
    loader: checkStock,
    element: <Counter />,
  },
  {
    path: "error",
    element: <ErrorPage />,
  },
]);

// ✅ Wrap RouterProvider with ThemeProvider
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
