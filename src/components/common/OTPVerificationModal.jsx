import React, { useState, useRef, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import CloseIcon from "@mui/icons-material/Close";
const OTPVerificationModal = ({ onVerify, onResend, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (inputRefs[activeInput] && inputRefs[activeInput].current) {
      inputRefs[activeInput].current.focus();
    }
  }, [activeInput]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value !== "" && index < 3) {
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        onVerify(otpCode);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleResend = () => {
    onResend();
    // Reset OTP fields
    setOtp(["", "", "", ""]);
    setActiveInput(0);
  };

  return (
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
        <div className="p-8 md:w-1/2 text-center">
          <div className="mb-6 ">
            <h2
              variant="h5"
              className="font-[700] text-[20px] py-2 text-gray-900"
            >
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
                className={`w-[50px] h-[50px] rounded-full flex items-center justify-center border border-[#CECECE] ${
                  index === 0 && digit
                    ? "bg-blue-800 text-white"
                    : "bg-gray-100"
                }`}
              >
                <input
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-[50px] h-[50px] text-center text-xl font-semibold rounded-full border border-[#CECECE] outline-none ${
                    index === 0 && digit
                      ? "bg-[#004175] text-white"
                      : "bg-gray-100"
                  }`}
                />
              </Box>
            ))}
          </div>

          <div className="text-center  mb-6">
            <Typography variant="body2" className="text-gray-600">
              Don't received code?{" "}
              <button
                onClick={handleResend}
                className="text-black font-semibold hover:underline"
              >
                Resend
              </button>
            </Typography>
          </div>

          <button
            onClick={handleVerify}
            disabled={isSubmitting || otp.some((digit) => !digit)}
            className={`py-2 px-4 rounded-full ${
              isSubmitting || otp.some((digit) => !digit)
                ? "bg-[#004175a6] text-white w-[180px] py-3 px-4 rounded-full cursor-not-allowed" // Light blue and not-allowed cursor
                : "bg-[#004175] text-white w-[180px] py-3 px-4 rounded-full cursor-pointer  hover:bg-blue-900"
            }`}
          >
            Verify
          </button>
        </div>

        {/* Right side - Illustration */}
        <div className=" md:block md:w-1/2 bg-white">
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
  );
};

export default OTPVerificationModal;
