import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import {Inventory} from './pages/Inventory';
import { checkInventory } from './pages/Inventory';
import DoctorPage from './pages/doctor';
import {Prescription, loadPriscription }from './pages/prescription';
import {PrescriptionTemplate} from './component/PrescriptionTemplate';
const router = createBrowserRouter([
  {
    path: "/inventory",
    loader: checkInventory,
    element: (
      <Inventory />
    ),
  },
  {
    path: "/doctor",
    element: (
      <DoctorPage />
    ),
  },
  {
    path: "/",
    loader: loadPriscription,
    element: (
      <Prescription/>
    ),
  },
  {
    path: "/pdf",
    element: (
      <PrescriptionTemplate/>
    ),
  },
]);





createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
