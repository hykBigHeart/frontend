import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system, user } from "../api";
import { SystemConfigStoreInterface } from "../store/system/systemConfigSlice";

import { getToken } from "../utils";
import { InitPage } from "../pages/init";
import CoursePage from "../pages/course";
import IndexPage from "../pages/index";
import LatestLearnPage from "../pages/latest-learn";
import LoginPage from "../pages/login";

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.config();
        let userRes: any = await user.detail();
        resolve({
          default: (
            <InitPage configData={configRes.data} loginData={userRes.data} />
          ),
        });
      } catch (e) {
        console.error("系统初始化失败", e);
      }
    });
  });
} else {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
  RootPage = <InitPage />;
}

// 懒加载
// const LoginPage = lazy(() => import("../pages/login"));
// const IndexPage = lazy(() => import("../pages/index"));
// const CoursePage = lazy(() => import("../pages/course"));
// const LatestLearnPage = lazy(() => import("../pages/latest-learn"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: RootPage,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/course/:courseId",
        element: <CoursePage />,
      },
      {
        path: "/latest-learn",
        element: <LatestLearnPage />,
      },
    ],
  },
];

export default routes;
