import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";
import CloseIcon from "@mui/icons-material/Close";

const RegisterOTPVerificationModal = ({
  setOtpVerificationModal,
  onResend,
  onVerified,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0); // seconds
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Focus on active input
  useEffect(() => {
    if (inputRefs[activeInput]?.current) {
      inputRefs[activeInput].current.focus();
    }
  }, [activeInput]);

  // Timer for resend
  useEffect(() => {
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
  }, [resendDisabled, timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      setActiveInput(index + 1);
    }

    if (index === 3 && value !== "" && !newOtp.includes("")) {
      setTimeout(() => {
        handleVerify();
      }, 300);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      setIsSubmitting(true);
      try {
        if (typeof onVerified === "function") {
          await onVerified(otpCode);
        }
        // if success, parent will close modal via setOtpVerificationModal(false)
      } catch (e) {
        console.error("OTP verify failed", e);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResend = async () => {
    if (typeof onResend === "function") {
      await onResend();
    }
    setOtp(["", "", "", ""]);
    setActiveInput(0);
    setResendDisabled(true);
    setTimer(120); // 2 minutes as requested
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
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
            onClick={() => setOtpVerificationModal(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>

          {/* Left side - Form */}
          <div className="p-8 md:w-1/2 text-center">
            <div className="mb-6">
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
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
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
                      onClick={handleResend}
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
              onClick={handleVerify}
              disabled={isSubmitting || otp.some((digit) => !digit)}
              className={`py-2 px-4 rounded-full ${
                isSubmitting || otp.some((digit) => !digit)
                  ? "bg-[#004175a6] text-white w-[180px] py-3 px-4 rounded-full cursor-not-allowed"
                  : "bg-[#004175] text-white w-[180px] py-3 px-4 rounded-full cursor-pointer hover:bg-blue-900"
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
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

export default RegisterOTPVerificationModal;
