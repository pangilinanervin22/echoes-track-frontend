import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import "./global.scss";
import RootLayout from "./pages";
import Scan from "./pages/Scan/Scan";
import Search from "./pages/Search/Search";
import Admin from "./pages/Admin/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    caseSensitive: false,
    element: (<RootLayout />),
    children: [
      {
        path: "/scan",
        element: <Scan />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);