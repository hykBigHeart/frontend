import { Outlet } from "react-router-dom";

interface Props {}

export const InitPage = (props: Props) => {
  return (
    <>
      <Outlet />
    </>
  );
};
