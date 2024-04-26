import * as React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from "./Home";
import Scanner from "./Component/Scanner"
import Thank from "./Component/Thank";
import {Counter,checkStock} from "./Component/Counter";
import Vital from "./Component/Vitals";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home />
    ),
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
    path: "counter",
    loader: checkStock,
    element: 
      <Counter />
    ,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);