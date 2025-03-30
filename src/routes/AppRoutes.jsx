import { Routes } from "react-router-dom";
import { UserRoutes, SellerRoutes } from "@/components";

const AppRoutes = () => {
  return (
    <>
      <Routes>{UserRoutes()}</Routes>
      <Routes>{SellerRoutes()}</Routes>
    </>
  );
};

export default AppRoutes;
