import { Suspense, useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation, useRoutes } from "react-router-dom";
import routes from "./routes";
import "./App.scss";
import LoadingPage from "./pages/loading";
import { user } from "./api/index";
import { getToken } from "./utils/index";
import { useDispatch } from "react-redux";
import { loginAction } from "./store/user/loginUserSlice";

const G_ID = import.meta.env.VITE_G_ID || "";
if (G_ID) {
  ReactGA.initialize(G_ID);
}

const App = () => {
  const dispatch = useDispatch();
  const Views = () => useRoutes(routes);

  if (getToken()) {
    user.detail().then((res: any) => {
      const data = res.data;
      dispatch(loginAction(data));
    });
  }

  const location = useLocation();
  useEffect(() => {
    if (!G_ID) {
      return;
    }
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Views />
    </Suspense>
  );
};

export default App;
