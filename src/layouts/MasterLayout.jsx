import { Outlet } from "react-router-dom";
import { Header, Footer } from "@/components";

const MasterLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MasterLayout;
