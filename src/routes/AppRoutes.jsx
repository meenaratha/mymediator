import { Route, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {UserRoutes()}
        </Routes>
    </>
  );
};

export default AppRoutes;
