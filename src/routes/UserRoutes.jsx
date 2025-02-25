import { Route } from "react-router-dom";
import Header from "../components/common/Header";
const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<Header />} />
    </>
  );
};

export default UserRoutes;
