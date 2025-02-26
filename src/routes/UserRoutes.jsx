import { Route } from "react-router-dom";
import HomePage from "../Pages/UserFlow/HomePage";
const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
    </>
  );
};

export default UserRoutes;
