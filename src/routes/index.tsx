import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import { InitPage } from "../pages/init";

// 懒加载
const LoginPage = lazy(() => import("../pages/login"));
const IndexPage = lazy(() => import("../pages/index"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <InitPage />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
];

export default routes;
