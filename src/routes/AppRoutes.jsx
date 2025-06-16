// src/routes/AppRoutes.js
import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import SellerRoutes from "./SellerRoutes";
import { NotFoundPage, LoginRequiredPage } from "../auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main User Routes - All users (buyers and sellers) use these */}
      {UserRoutes()}

      {/* Legacy Seller Routes - For backward compatibility */}
      {SellerRoutes()}

      {/* Auth required page */}
      <Route path="/login-required" element={<LoginRequiredPage />} />

      {/* 404 Not Found - catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
