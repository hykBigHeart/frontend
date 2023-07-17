import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system, user } from "../api";
import { getToken } from "../utils";
// 页面加载
import { InitPage } from "../pages/init";
import LoginPage from "../pages/login";
//主页
const IndexPage = lazy(() => import("../pages/index"));
//课程相关
const CoursePage = lazy(() => import("../pages/course/index"));
const CoursePlayPage = lazy(() => import("../pages/course/video"));
//最近学习
const LatestLearnPage = lazy(() => import("../pages/latest-learn"));

import PrivateRoute from "../compenents/private-route";

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
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.config();

        resolve({
          default: <InitPage configData={configRes.data} />,
        });
      } catch (e) {
        console.error("系统初始化失败", e);
      }
    });
  });
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
        element: <PrivateRoute Component={<IndexPage />} />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/course/:courseId",
        element: <PrivateRoute Component={<CoursePage />} />,
      },
      {
        path: "/course/:courseId/hour/:hourId",
        element: <PrivateRoute Component={<CoursePlayPage />} />,
      },
      {
        path: "/latest-learn",
        element: <PrivateRoute Component={<LatestLearnPage />} />,
      },
    ],
  },
];

export default routes;
