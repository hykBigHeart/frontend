import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
// import styles from "./index.module.scss";
import {
  SystemConfigStoreInterface,
  saveConfigAction,
} from "../../store/system/systemConfigSlice";
import { loginAction } from "../../store/user/loginUserSlice";
import { Header, NoHeader, Footer } from "../../compenents";
import { useParams, useLocation } from "react-router-dom";

interface Props {
  loginData?: any;
  configData?: any;
}

export const InitPage = (props: Props) => {
  const pathname = useLocation().pathname;
  const params = useParams();
  const dispatch = useDispatch();
  if (props.loginData) {
    dispatch(loginAction(props.loginData));
  }
  if (props.configData) {
    let config: SystemConfigStoreInterface = {
      //系统配置
      systemApiUrl: props.configData["system-api-url"],
      systemH5Url: props.configData["system-h5-url"],
      systemLogo: props.configData["system-logo"],
      systemName: props.configData["system-name"],
      systemPcUrl: props.configData["system-pc-url"],
      pcIndexFooterMsg: props.configData["system-pc-index-footer-msg"],
      //播放器配置
      playerPoster: props.configData["player-poster"],
      playerIsEnabledBulletSecret:
        props.configData["player-is-enabled-bullet-secret"] &&
        props.configData["player-is-enabled-bullet-secret"] === "1"
          ? true
          : false,
      playerBulletSecretText: props.configData["player-bullet-secret-text"],
      playerBulletSecretColor: props.configData["player-bullet-secret-color"],
      playerBulletSecretOpacity:
        props.configData["player-bullet-secret-opacity"],
    };
    dispatch(saveConfigAction(config));
  }

  return (
    <>
      <div>
        {pathname === "/login" && <NoHeader></NoHeader>}
        {pathname !== "/login" && !params.hourId && <Header></Header>}
        <Outlet />
        {pathname !== "/login" && !params.hourId && <Footer></Footer>}
      </div>
    </>
  );
};
