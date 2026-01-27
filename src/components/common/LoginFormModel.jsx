import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import IMAGES from "@/utils/images.js";
import "../../styles/Login.css";
import { useAuth } from "../../auth/AuthContext";
import { api } from "../../api/axios";
import { generateToken } from "../../notifications/firebase";
// import { requestFirebaseToken } from "../../firebaseold";
const LoginFormModel = ({
  setSignupFormModel,
  setLoginFormModel,
  setForgotPasswordModal,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = window.innerWidth < 768;

  // Refs for form fields
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Effect to handle autofocus on error fields
  useEffect(() => {
    if (errors.mobileNumber || errors.phone) {
      if (phoneInputRef.current) {
        const input = phoneInputRef.current.querySelector("input");
        if (input) input.focus();
      }
    } else if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [errors]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "mobileNumber":
        if (!value) return "Mobile number is required";
        if (value.length < 10) return "Please enter a valid mobile number";
        return null;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
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
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobileNumber: value });
    const error = validateField("mobileNumber", value);
    setErrors((prev) => ({ ...prev, mobileNumber: error, phone: null }));
  };

  // Helper function to map backend field names to frontend field names
  const mapBackendFieldToFrontend = (backendField) => {
    const fieldMapping = {
      phone: "mobileNumber",
      mobile: "mobileNumber",
      mobile_number: "mobileNumber",
      email: "mobileNumber", // In case backend uses email field for login
      username: "mobileNumber", // In case backend uses username
      // Add more mappings as needed
    };
    return fieldMapping[backendField] || backendField;
  };

  // Helper function to handle backend validation errors
  const handleBackendErrors = (errorData) => {
    const newErrors = {};

    // Handle different error response formats
    if (errorData) {
      // Format 1: { errors: { field: ['error message'] } }
      if (errorData.errors) {
        Object.keys(errorData.errors).forEach((field) => {
          const frontendField = mapBackendFieldToFrontend(field);
          const errorMessages = errorData.errors[field];

          if (Array.isArray(errorMessages)) {
            newErrors[frontendField] = errorMessages[0]; // Take first error
          } else {
            newErrors[frontendField] = errorMessages;
          }
        });
      }

      // Format 2: { field_errors: { field: 'error message' } }
      else if (errorData.field_errors) {
        Object.keys(errorData.field_errors).forEach((field) => {
          const frontendField = mapBackendFieldToFrontend(field);
          newErrors[frontendField] = errorData.field_errors[field];
        });
      }

      // Format 3: { validation_errors: [...] }
      else if (
        errorData.validation_errors &&
        Array.isArray(errorData.validation_errors)
      ) {
        errorData.validation_errors.forEach((error) => {
          if (error.field) {
            const frontendField = mapBackendFieldToFrontend(error.field);
            newErrors[frontendField] = error.message || error.error;
          }
        });
      }

      // Format 4: Direct field mapping { phone: 'error', password: 'error' }
      else {
        Object.keys(errorData).forEach((field) => {
          if (field !== "message") {
            const frontendField = mapBackendFieldToFrontend(field);
            newErrors[frontendField] = errorData[field];
          }
        });
      }
    }

    return newErrors;
  };

  // API call function for login
  const loginUser = async (userData) => {
    try {
      const response = await api.post("/login", {
        phone: userData.mobileNumber,
        password: userData.password,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Login API error:", error);

      // Handle axios error response
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error:
            error.response.data?.message || "Login failed. Please try again.",
          data: error.response.data || null,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: "Network error. Please check your connection and try again.",
          data: null,
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: error.message || "Login failed. Please try again.",
          data: null,
        };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors

    try {
      // 2️⃣ Get Firebase token
      // const fcmToken = await requestFirebaseToken();
      const fcmToken = await generateToken();
      console.log("Login FCM Token:", fcmToken);
      // Option 1: Use the existing auth context login method
      const result = await login({
        phone: formData.mobileNumber,
        password: formData.password,
        fcm_token: fcmToken,// ✅ sent to backend
      });

      if (result.success) {
        // Reset form
        setFormData({
          mobileNumber: "",
          password: "",
        });
        setErrors({});
        setLoginFormModel(false);
        // IMPORTANT: reset tour flag for new user
        localStorage.removeItem("homeTourDone");
       
        // Navigate to dashboard
        // navigate("/profile-edit");
        navigate("/");
      } else {
        // Handle API errors
        let errorData = null;

        // For the auth context, error data might be in result.data
        if (result.data) {
          errorData = result.data;
        }

        // Handle field-specific errors
        const fieldErrors = handleBackendErrors(errorData);

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          // If no field-specific errors, show general error
          setErrors({
            general: result.error || "Login failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Unexpected login error:", error);

      // For axios errors, check error.response.data
      let errorData = null;
      if (error.response && error.response.data) {
        errorData = error.response.data;
      }

      const fieldErrors = handleBackendErrors(errorData);

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center overflow-y-auto justify-center z-999 bg-[#000000a8] bg-opacity-50 p-4"
        style={{ backdropFilter: "blur(10px)", scrollbarWidth: "none" }}
      >
        <div
          className={`bg-white rounded-xl overflow-hidden shadow-lg max-w-4xl mx-auto w-full md:flex relative ${
            isMobile
              ? "fixed top-[2%] left-1/2 -translate-x-1/2"
              : "relative md:top-[16%]"
          }`}
        >
          <button
            onClick={() => {
              if (!isSubmitting) {
                setLoginFormModel(false);
              }
            }}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <CloseIcon />
          </button>

          <div className="p-8 md:w-1/2">
            <div className="mb-6 text-center">
              <h2 className="font-bold text-xl py-2 text-gray-900">
                Welcome Back!
              </h2>
              <p className="text-gray-600 text-sm">
                Login to buy and sell items
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* General Error Message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errors.general}
                </div>
              )}

              {/* Mobile Number Field */}
              <div className="mb-4" ref={phoneInputRef}>
                <PhoneInput
                  defaultCountry="IN"
                  value={formData.mobileNumber}
                  onChange={handlePhoneChange}
                  placeholder="Mobile Number"
                  className={`w-full px-3 py-1 outline-none ${
                    errors.mobileNumber || errors.phone ? "border-red-500" : ""
                  } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                  disabled={isSubmitting}
                />
                {(errors.mobileNumber || errors.phone) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobileNumber || errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2 border-[#CCCBCB] ${
                    errors.password ? "border-red-500" : "border-[#CCCBCB]"
                  } ${isSubmitting ? "opacity-50" : ""}`}
                >
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter the password"
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
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end mb-6">
                <div
                  className="text-red-500 text-sm cursor-pointer hover:underline"
                  onClick={() => {
                    if (!isSubmitting) {
                      setForgotPasswordModal(true);
                      setLoginFormModel(false);
                    }
                  }}
                >
                  Forgot Password ?
                </div>
              </div>

              {/* Login Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-[250px] bg-[#02487C] text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>

              {/* Signup Link */}
              <div className="mt-4 text-center flex flex-wrap justify-center gap-2">
                <span className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                </span>
                <p
                  className="text-[#000000] text-sm font-medium cursor-pointer hover:underline"
                  onClick={() => {
                    if (!isSubmitting) {
                      setSignupFormModel(true);
                      setLoginFormModel(false);
                    }
                  }}
                >
                  Sign up
                </p>
              </div>
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:block md:w-1/2 bg-white">
            <div className="h-full p-8 flex items-center justify-center">
              <img
                src={IMAGES.loginbanner}
                alt="Login Illustration"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginFormModel;
