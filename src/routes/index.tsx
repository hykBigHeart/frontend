import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system } from "../api";
import { SystemConfigStoreInterface } from "../store/system/systemConfigSlice";

import { InitPage } from "../pages/init";
import CoursePage from "../pages/course";
import IndexPage from "../pages/index";
import LatestLearnPage from "../pages/latest-learn";
import LoginPage from "../pages/login";

let config: SystemConfigStoreInterface = {
  systemApiUrl: "",
  systemPcUrl: "",
  systemH5Url: "",
  systemLogo: "",
  systemName: "",
  pcIndexFooterMsg: "",
  playerPoster: "",
  playerIsEnabledBulletSecret: false,
  playerBulletSecretText: "",
  playerBulletSecretColor: "",
  playerBulletSecretOpacity: "",
};

const Init = lazy(async () => {
  return new Promise<any>((resolve) => {
    system.config().then((res: any) => {
      //系统配置
      config.systemApiUrl = res.data["system-api-url"];
      config.systemH5Url = res.data["system-h5-url"];
      config.systemLogo = res.data["system-logo"];
      config.systemName = res.data["system-name"];
      config.systemPcUrl = res.data["system-pc-url"];
      config.pcIndexFooterMsg = res.data["pc-index-footer-msg"];

      //播放器配置
      config.playerPoster = res.data["player-poster"];
      config.playerIsEnabledBulletSecret =
        res.data["player-is-enabled-bullet-secret"] &&
        res.data["player-is-enabled-bullet-secret"] === "1"
          ? true
          : false;
      config.playerBulletSecretText = res.data["player-bullet-secret-text"];
      config.playerBulletSecretColor = res.data["player-bullet-secret-color"];
      config.playerBulletSecretOpacity =
        res.data["player-bullet-secret-opacity"];

      resolve({
        default: InitPage,
      });
    });
  });
});

// 懒加载
// const LoginPage = lazy(() => import("../pages/login"));
// const IndexPage = lazy(() => import("../pages/index"));
// const CoursePage = lazy(() => import("../pages/course"));
// const LatestLearnPage = lazy(() => import("../pages/latest-learn"));

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
