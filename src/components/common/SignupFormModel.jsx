import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import IMAGES from "@/utils/images.js";
import "../../styles/Login.css";
const SignupFormModel = ({ setLoginFormModel ,setSignupFormModel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const isMobile = window.innerWidth < 768;

  // Refs for form fields
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Effect to handle autofocus on error fields
  useEffect(() => {
    // Focus on the first field with an error
    if (errors.name) {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    } else if (errors.mobileNumber) {
      if (phoneInputRef.current) {
        // Focus on the phone input container's input element
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
      case "name":
        if (!value) return "Name is required";
        return null;
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

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobileNumber: value });

    // Validate phone on change
    const error = validateField("mobileNumber", value);
    setErrors((prev) => ({ ...prev, mobileNumber: error }));
  };

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

      // For now, we'll just simulate a successful login
      resetFormAndNavigate();
    }
  };

  const resetFormAndNavigate = () => {
    // Reset the form
    setFormData({
      name: "",
      mobileNumber: "",
      password: "",
    });

    // Clear any errors
    setErrors({});
    setSignupFormModel(false);
    setLoginFormModel(true);
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
            onClick={()=>{
              setSignupFormModel(false);
            }}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>

          {/* Left side - Form */}
          <div className="p-8 md:w-1/2">
            <div className="mb-6 text-center">
              <h2 className="font-bold text-xl py-2 text-gray-900">Sign up</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="mb-4" ref={nameInputRef}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none bg-[#FCFCFC]
                   focus:border-blue-500 
                   border-[#CCCBCB] box-shadow-[ 0px 0.84px 3.36px 0px #C6C6C640] ${
                     errors.name ? "border-red-500" : "border-gray-300"
                   }`}
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone Input Field using react-phone-input-2 */}
              <div className="mb-4" ref={phoneInputRef}>
                <PhoneInput
                  defaultCountry="IN"
                  value={formData.mobileNumber}
                  onChange={handlePhoneChange}
                  placeholder="Mobile Number"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <div
                  className={`flex items-center border rounded-md p-2 bg-[#FCFCFC] 
                  border-[#CCCBCB] box-shadow-[ 0px 0.84px 3.36px 0px #C6C6C640];
]
                  ${errors.password ? "" : ""}`}
                >
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter the password"
                    className="w-full px-1 py-1 outline-none bg-[#FCFCFC]"
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

              {/* Login Button */}
              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="w-full max-w-[250px] bg-[#02487C] text-white py-2 rounded-[20px] hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
              {/*login Link */}
              {/* <div className="mt-4 text-center">
                <span className="text-gray-600 text-sm">
                  Do you have account ?{" "}
                </span>
                <a href="#" className="text-blue-600 text-sm font-medium">
                 Login
                </a>
              </div> */}
            </form>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden md:block md:w-1/2 bg-white">
            <div className="h-full p-8 flex items-center justify-center">
              <img
                src={IMAGES.signupbanner}
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

export default SignupFormModel;
