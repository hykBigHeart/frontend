import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { saveConfigAction } from "../../store/system/systemConfigSlice";

interface Props {
  config: Map<string, string>;
}

export const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  dispatch(saveConfigAction(props.config));

  return (
    <>
      <Outlet />
    </>
  );
};
