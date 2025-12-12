import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IMAGES from "@/utils/images.js";
import "../../styles/Login.css";
import { api } from "../../api/axios";
import Swal from "sweetalert2";

const PasswordResetModel = ({
  setPasswordResetModel,
  setLoginFormModel,
  phone, // +91987690693 from parent
}) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = window.innerWidth < 768;

  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  useEffect(() => {
    if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    } else if (errors.confirmPassword && confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.focus();
    }
  }, [errors]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Single field validation
  const validateField = (name, value) => {
    switch (name) {
      case "password":
        if (!value) return "Password is required";
        // strong password rule
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        if (!passwordRegex.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        return null;
      case "confirmPassword":
        if (!value) return "Confirm Password is required";
        if (value !== formData.password) return "Passwords do not match";
        return null;
      default:
        return null;
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const res = await api.post("/forget-password", {
        phone: phone,
        purpose: "password_reset",
        new_password: formData.password,
        new_password_confirmation: formData.confirmPassword,
      });

      await Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "Your password has been updated. Please login with your new password.",
        confirmButtonColor: "#02487C",
      });

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setPasswordResetModel(false);
      setLoginFormModel(true);
      console.log("Password reset success:", res.data);
    } catch (error) {
      console.error("Password reset API error:", error);
      const data = error.response?.data;
      const msg =
        (typeof data?.data === "string" && data.data) ||
        data?.message ||
        "Unable to reset password. Please try again.";
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center overflow-y-auto justify-center z-50 bg-[#000000a8] bg-opacity-50 p-4"
        style={{ backdropFilter: "blur(10px)", scrollbarWidth: "none" }}
      >
        <div
          className={`bg-white rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto w-full md:flex relative ${
            isMobile
              ? "fixed top-[2%] left-1/2 -translate-x-1/2"
              : "relative md:top-[16%]"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              if (!isSubmitting) setPasswordResetModel(false);
            }}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>

          {/* Left side - Form */}
          <div className="p-8 md:w-1/2">
            <div className="mb-6 text-center">
              <h2 className="font-bold text-xl py-2 text-gray-900">
                Password Reset
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              {/* New Password */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2 border-[#CCCBCB]
                  ${errors.password ? "border-red-500" : "border-gray-300"}
                  ${isSubmitting ? "opacity-50" : ""}`}
                >
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-1 outline-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2 border-[#CCCBCB]
                  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }
                  ${isSubmitting ? "opacity-50" : ""}`}
                >
                  <input
                    ref={confirmPasswordInputRef}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-1 outline-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-500 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-[250px] bg-[#02487C] text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:block md:w-1/2 bg-white">
            <div className="h-full p-8 flex items-center justify-center">
              <img
                src={IMAGES.otpbanner}
                alt="Password Reset Illustration"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetModel;
