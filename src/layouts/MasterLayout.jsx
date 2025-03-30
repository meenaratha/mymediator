import { Outlet } from "react-router-dom";
import { Header, Footer, AppFooter } from "@/components";

const MasterLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      {/* Mobile App Download Section */}
      <AppFooter />
      <Footer />
    </>
  );
};

export default MasterLayout;
