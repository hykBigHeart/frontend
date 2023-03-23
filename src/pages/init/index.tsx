import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";
import { saveConfigAction } from "../../store/system/systemConfigSlice";
import { Header } from "../../compenents";

interface Props {
  config: Map<string, string>;
}

export const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  dispatch(saveConfigAction(props.config));

  return (
    <>
      <div>
        <Header></Header>
        <Outlet />
      </div>
    </>
  );
};
