import { Outlet } from "react-router-dom";
import { Footer, Header } from "../../../compenents";
import { Suspense } from "react";
import LoadingPage from "../../loading";

const WithHeaderWithFooter = () => {
  return (
    <>
      <Header></Header>
      <Suspense fallback={<LoadingPage height="100vh" />}>
        <Outlet />
      </Suspense>
      <Footer></Footer>
    </>
  );
};

export default WithHeaderWithFooter;
