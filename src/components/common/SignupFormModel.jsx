import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import IMAGES from "@/utils/images.js";
import "../../styles/Login.css";
import { api } from "../../api/axios";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";

const SignupFormModel = ({ setLoginFormModel, setSignupFormModel }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const isMobileMedia = useMediaQuery({ maxWidth: 767 });

  // step: "signup" | "otp"
  const [step, setStep] = useState("signup");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [allError, setAllError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for form fields
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // OTP state (local to this component)
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0); // seconds

  // Autofocus on error fields (signup step)
  useEffect(() => {
    if (step !== "signup") return;
    if (errors.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if ((errors.mobileNumber || errors.phone) && phoneInputRef.current) {
      const input = phoneInputRef.current.querySelector("input");
      if (input) input.focus();
    } else if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [errors, step]);

  // OTP: focus active input
  useEffect(() => {
    if (step !== "otp") return;
    if (inputRefs[activeInput]?.current) {
      inputRefs[activeInput].current.focus();
    }
  }, [activeInput, step]);

  // OTP timer effect
  useEffect(() => {
    if (step !== "otp") return;
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled, timer, step]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return null;
      // case "email":
      //   if (!value) return "Email is required";
      //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      //     return "Please enter a valid email";
      //   return null;
      case "mobileNumber":
        if (!value) return "Mobile number is required";
        return null;
      case "password":
        if (!value) return "Password is required";
          // at least 8 chars, one upper, one lower, one number, one special
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

      if (!passwordRegex.test(value)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, mobileNumber: value }));
    const error = validateField("mobileNumber", value);
    setErrors((prev) => ({
      ...prev,
      mobileNumber: error,
      phone: null,
    }));
  };

  // Map backend field names to frontend
  const mapBackendFieldToFrontend = (backendField) => {
    const fieldMapping = {
      phone: "mobileNumber",
      mobile: "mobileNumber",
      mobile_number: "mobileNumber",
    };
    return fieldMapping[backendField] || backendField;
  };

  // Handle backend validation errors
  const handleBackendErrors = (errorData) => {
    const newErrors = {};
    if (errorData) {
      if (errorData.errors) {
        Object.keys(errorData.errors).forEach((field) => {
          const frontendField = mapBackendFieldToFrontend(field);
          const errorMessages = errorData.errors[field];
          newErrors[frontendField] = Array.isArray(errorMessages)
            ? errorMessages[0]
            : errorMessages;
        });
      } else if (errorData.field_errors) {
        Object.keys(errorData.field_errors).forEach((field) => {
          const frontendField = mapBackendFieldToFrontend(field);
          newErrors[frontendField] = errorData.field_errors[field];
        });
      } else if (
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
      
      // else {
      //   Object.keys(errorData).forEach((field) => {
      //     if (field !== "message") {
      //       const frontendField = mapBackendFieldToFrontend(field);
      //       newErrors[frontendField] = errorData[field];
      //     }
      //   });
      // }


      else {
      // handle { message: "...", data: "Invalid OTP." }
      if (typeof errorData.data === "string") {
        // treat as OTP error
        newErrors.otp = errorData.data;
      }

      Object.keys(errorData).forEach((field) => {
        if (field !== "message" && field !== "data") {
          const frontendField = mapBackendFieldToFrontend(field);
          newErrors[frontendField] = errorData[field];
        }
      });
    }
    }
    return newErrors;
  };

  // Final registration after OTP verify
  const completeRegistration = async (otpCode) => {
    setOtpSubmitting(true);
    try {
      const res = await api.post("/register", {
        phone: formData.mobileNumber,
        purpose: "registration",
        otp: otpCode,
        // email: formData.email,
        name: formData.name.trim(),
        password: formData.password,
      });
// SweetAlert success
    await Swal.fire({
      icon: "success",
      title: "Registration Successful",
      text: "Your account has been created. Please login to continue.",
      confirmButtonColor: "#02487C",
    });
      setFormData({
        name: "",
        // email: "",
        mobileNumber: "",
        password: "",
      });
      setErrors({});
      setStep("signup");
      setSignupFormModel(false);
      setLoginFormModel(true);
      console.log("Registration successful:", res.data);
    } catch (error) {
    
      console.error("Registration API error:", error);
      const errorData = error.response?.data || null;
       
      const fieldErrors = handleBackendErrors(errorData);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        const firstKey = Object.keys(fieldErrors)[0];
  const firstFieldError = fieldErrors[firstKey];

  setAllError(
    firstFieldError ||
      errorData?.message ||
      "Something went wrong. Please check the highlighted fields."
  );
      } 
      
    else {
  const backendMessage = errorData?.message;
  const backendData = errorData?.data;
  const fullMessage =
    typeof backendData === "string"
      ? `${backendMessage || "Error"}: ${backendData}`
      : backendMessage || "Registration failed. Please try again.";
  setErrors({});
  setAllError(fullMessage);
}
      // stay on OTP step so user can retry
    } finally {
      setOtpSubmitting(false);
    }
  };

  // Submit: send OTP (signup step)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await api.post("/send-otp", {
        phone: formData.mobileNumber,
        purpose: "registration",
      });

      // switch to OTP screen
      setStep("otp");
      // reset OTP UI
      setOtp(["", "", "", ""]);
      setActiveInput(0);
      setResendDisabled(false);
      setTimer(0);
    } catch (error) {
      console.error("Send OTP error:", error);
      const msg =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setErrors((prev) => ({
        ...prev,
        phone: msg,
        mobileNumber: msg,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP (OTP step)
  const handleResendOtp = async () => {
    try {
      await api.post("/send-otp", {
        phone: formData.mobileNumber,
        purpose: "registration",
      });
      setOtp(["", "", "", ""]);
      setActiveInput(0);
      setResendDisabled(true);
      setTimer(120); // 2 minutes
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      setActiveInput(index + 1);
    }

    if (index === 3 && value !== "" && !newOtp.includes("")) {
      setTimeout(() => {
        handleOtpVerify();
      }, 300);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  const handleOtpVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      await completeRegistration(otpCode);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const closeHandler = () => {
    if (step === "otp") {
      // back to signup instead of closing everything
      setStep("signup");
    } else {
      setSignupFormModel(false);
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
          {/* Close / Back Button */}
          <button
            onClick={closeHandler}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors cursor-pointer"
            disabled={isSubmitting || otpSubmitting}
          >
            <CloseIcon />
          </button>

          {/* Left side content */}
          {step === "signup" ? (
            <div className="p-8 md:w-1/2">
              <div className="mb-6 text-center">
                <h2 className="font-bold text-xl py-2 text-gray-900">
                  Sign up
                </h2>
                <p className="text-gray-600 text-sm">
                  Create your account to get started
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errors.general}
                  </div>
                )}

                {/* NAME */}
                <div className="mb-4" ref={nameInputRef}>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none bg-[#FCFCFC]
                     focus:border-blue-500 
                     border-[#CCCBCB] box-shadow-[ 0px 0.84px 3.36px 0px #C6C6C640] ${
                       errors.name ? "border-red-500" : "border-gray-300"
                     } ${
                       isSubmitting
                         ? "opacity-50 cursor-not-allowed"
                         : ""
                     }`}
                    placeholder="Full Name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                {/* <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none bg-[#FCFCFC]
                     focus:border-blue-500 
                     border-[#CCCBCB] box-shadow-[ 0px 0.84px 3.36px 0px #C6C6C640] ${
                       errors.email ? "border-red-500" : "border-gray-300"
                     } ${
                       isSubmitting
                         ? "opacity-50 cursor-not-allowed"
                         : ""
                     }`}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div> */}

                {/* Phone Input */}
                <div className="mb-4" ref={phoneInputRef}>
                  <PhoneInput
                    defaultCountry="IN"
                    value={formData.mobileNumber}
                    onChange={handlePhoneChange}
                    placeholder="Mobile Number"
                    disabled={isSubmitting}
                    className={`${
                      errors.mobileNumber || errors.phone
                        ? "border-red-500"
                        : ""
                    } ${
                      isSubmitting
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  />
                  {(errors.mobileNumber || errors.phone) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mobileNumber || errors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div
                    className={`flex items-center border rounded-md p-2 bg-[#FCFCFC] 
                    border-[#CCCBCB] box-shadow-[ 0px 0.84px 3.36px 0px #C6C6C640]
                    ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                    ${isSubmitting ? "opacity-50" : ""}`}
                  >
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter the password"
                      className="w-full px-1 py-1 outline-none bg-[#FCFCFC]"
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

                {/* Send OTP Button */}
                <div className="flex justify-center mt-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-[250px] bg-[#02487C] text-white py-2 rounded-[20px] hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>

                {/* Login Link */}
                <div className="mt-4 text-center flex flex-wrap justify-center gap-2">
                  <span className="text-gray-600 text-sm">
                    Already have an account?{" "}
                  </span>
                  <p
                    className="text-[#02487C] text-sm font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      if (!isSubmitting) {
                        setSignupFormModel(false);
                        setLoginFormModel(true);
                      }
                    }}
                  >
                    Login
                  </p>
                </div>
              </form>
            </div>
          ) : (
            // OTP screen
            <div className="p-8 md:w-1/2 text-center">
              <div className="mb-6">

                {/* General Error Message for OTP / register */}
 {allError && (
  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
    {allError}
  </div>
)}

 
                <h2 className="font-[700] text-[20px] py-2 text-gray-900">
                  OTP Verification
                </h2>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  Enter your OTP code here
                </Typography>
              </div>

              <div className="flex justify-center space-x-4 mb-8">
                {otp.map((digit, index) => (
                  <Box
                    key={index}
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border border-[#CECECE] 
                    ${digit ? "bg-blue-800 text-white" : "bg-gray-100"}`}
                  >
                    <input
                      ref={inputRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-[50px] h-[50px] text-center text-xl font-semibold rounded-full border border-[#CECECE] outline-none 
                      ${digit ? "bg-[#004175] text-white" : "bg-gray-100"}`}
                    />
                  </Box>
                ))}
              </div>

              <div className="text-center mb-6">
                <Typography variant="body2" className="text-gray-600">
                  {resendDisabled && timer > 0 ? (
                    <span>Resend available in {formatTime(timer)}</span>
                  ) : (
                    <>
                      Don't received code?{" "}
                      <button
                        onClick={handleResendOtp}
                        className="text-black font-semibold hover:underline ml-1"
                        disabled={resendDisabled}
                      >
                        Resend
                      </button>
                    </>
                  )}
                </Typography>
              </div>

              <button
                onClick={handleOtpVerify}
                disabled={
                  otpSubmitting || otp.some((digit) => !digit)
                }
                className={`py-2 px-4 rounded-full ${
                  otpSubmitting || otp.some((digit) => !digit)
                    ? "bg-[#004175a6] text-white w-[180px] py-3 px-4 rounded-full cursor-not-allowed"
                    : "bg-[#004175] text-white w-[180px] py-3 px-4 rounded-full cursor-pointer hover:bg-blue-900"
                }`}
              >
                {otpSubmitting ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          {/* Right side - Illustration */}
          <div className="hidden md:block md:w-1/2 bg-white">
            <div className="h-full p-8 flex items-center justify-center">
              <img
                src={step === "otp" ? IMAGES.otpbanner : IMAGES.signupbanner}
                alt="Signup / OTP Illustration"
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
