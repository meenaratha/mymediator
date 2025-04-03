import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import IMAGES from "@/utils/images.js";
import "../../styles/Login.css";
import LoginFormModel from "./LoginFormModel";
const PasswordResetModel = ({ onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const isMobile = window.innerWidth < 768;

  // Refs for form fields
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  // Effect to handle autofocus on error fields
  useEffect(() => {
    if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    } else if (errors.confirmPassword && confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.focus();
    }
  }, [errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return null;
      case "confirmPassword":
        if (!value) return "Confirm Password is required";
        if (value !== formData.password) return "Passwords do not match";
      default:
        return null;
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when typing and validate on-the-fly
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);

      // You can add your API call here
      // Example:
      // loginUser(formData)
      //   .then(response => {
      //     // Handle successful login
      //     resetFormAndNavigate();
      //   })
      //   .catch(error => {
      //     console.error('Login failed:', error);
      //   });
      setShowLoginModal(true);
      // For now, we'll just simulate a successful login
      resetFormAndNavigate();
    }
  };

  const resetFormAndNavigate = () => {
    // Reset the form
    setFormData({
      password: "",
      confirmPassword: "",
    });

    // Clear any errors
    setErrors({});
    // Close the modal if needed
    if (onClose) {
      onClose();
    }
    navigate("/");
  };

  return (
    <>
      {showLoginModal && (
        <LoginFormModel onClose={() => setShowLoginModal(false)} />
      )}
      <div
        className="fixed inset-0 flex items-center overflow-y-auto justify-center z-50 bg-[#000000a8] bg-opacity-50 p-4"
        style={{ backdropFilter: "blur(10px)", scrollbarWidth: "none" }}
      >
        <div
          className={`bg-white rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto w-full md:flex relative ${
            isMobile ? "top-[19%]" : "top-[16%]"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
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
              {/* Password Field */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2  border-[#CCCBCB]
                  ${errors.password ? "" : ""}`}
                >
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter the password"
                    className="w-full px-3 py-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2  border-[#CCCBCB]
                  ${errors.confirmPassword ? "" : ""}`}
                >
                  <input
                    ref={confirmPasswordInputRef}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter the password"
                    className="w-full px-3 py-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-500 focus:outline-none"
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

              {/* password reset Button */}
              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="w-full max-w-[250px] bg-[#02487C] text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Reset Password
                </button>
              </div>
              {/* Sign Up Link */}
              {/* <div className="mt-4 text-center">
                <span className="text-gray-600 text-sm">
                  Didn't have account ?{" "}
                </span>
                <a href="#" className="text-blue-600 text-sm font-medium">
                  Sign up
                </a>
              </div> */}
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:block md:w-1/2 bg-white">
            <div className="h-full p-8 flex items-center justify-center">
              <img
                src={IMAGES.otpbanner}
                alt="OTP Illustration"
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
