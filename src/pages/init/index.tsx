import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
// import styles from "./index.module.scss";
import { saveConfigAction } from "../../store/system/systemConfigSlice";
import { Header, NoHeader, Footer } from "../../compenents";
import { useLocation } from "react-router-dom";

interface Props {
  config: Map<string, string>;
}

export const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  dispatch(saveConfigAction(props.config));
  const pathname = useLocation().pathname;

  return (
    <>
      <div>
        {pathname === "/login" && <NoHeader></NoHeader>}
        {pathname !== "/login" && <Header></Header>}
        <Outlet />
        {pathname !== "/login" && <Footer></Footer>}
      </div>
    </>
  );
};
