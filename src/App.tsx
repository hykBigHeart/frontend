import { useRoutes } from "react-router-dom";
import routes from "./routes";
import "./App.scss";
import { Suspense } from "react";
import LoadingPage from "./pages/loading";
import { user } from "./api/index";
import { getToken } from "./utils/index";
import { useDispatch } from "react-redux";
import { logoutAction } from "./store/user/loginUserSlice";

function App() {
  const Views = () => useRoutes(routes);
  const dispatch = useDispatch();
  const getUser = () => {
    user.detail().then((res: any) => {
      const data = res.data;
      dispatch(logoutAction(data.user));
    });
  };
  if (getToken()) {
    getUser();
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <Views />
    </Suspense>
  );
}

export default App;
