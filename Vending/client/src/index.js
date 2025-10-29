import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import Thank from "./pages/Thank";
import Dispense from "./pages/dispense";
import { Counter, checkStock } from "./pages/Counter";
import Vital from "./pages/vitals";
import { ThemeProvider } from './context/ThemeContext';
import VitalReport from "./pages/vital-report";

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
]);

// ✅ Wrap RouterProvider with ThemeProvider
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
