import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system } from "../api";

import { InitPage } from "../pages/init";
import { SystemConfigStoreInterface } from "../store/system/systemConfigSlice";

let config: SystemConfigStoreInterface = {
  systemApiUrl: "",
  systemPcUrl: "",
  systemH5Url: "",
  systemLogo: "",
  systemName: "",
};

const Init = lazy(async () => {
  return new Promise<any>((resolve) => {
    system.config().then((res: any) => {
      config.systemApiUrl = res.data["system-api-url"];
      config.systemH5Url = res.data["system-h5-url"];
      config.systemLogo = res.data["system-logo"];
      config.systemName = res.data["system-name"];
      config.systemPcUrl = res.data["system-pc-url"];

      resolve({
        default: InitPage,
      });
    });
  });
});

// 懒加载
const LoginPage = lazy(() => import("../pages/login"));
const IndexPage = lazy(() => import("../pages/index"));
const CoursePage = lazy(() => import("../pages/course"));
const LatestLearnPage = lazy(() => import("../pages/latest-learn"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Init config={config} />,
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
