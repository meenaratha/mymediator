import { Routes } from "react-router-dom";
import { UserRoutes, SellerRoutes } from "@/components";

const AppRoutes = () => {
  return (
    <Routes>
      {UserRoutes()}
      {SellerRoutes()}
    </Routes>
  );
};

export default AppRoutes;
