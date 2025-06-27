import React from "react";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

const RotatingIcon = ({ children, duration = 2, size = 24 }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: duration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </motion.div>
  );
};

const LoadMoreButton = ({
  onClick,
  loading = false,
  disabled = false,
  loadingText = "Loading...",
  buttonText = "Load More",
  className = "",
}) => {
  const isDisabled = loading || disabled;

  return (
    <div className="flex justify-center w-full my-6">
      <button
        onClick={!isDisabled ? onClick : undefined}
        disabled={isDisabled}
        className={`
          relative min-w-[140px] bg-[#004175] text-white font-medium py-3 px-6 rounded-full 
          flex items-center justify-center space-x-2 
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[#004175] focus:ring-opacity-50
          ${
            isDisabled
              ? "opacity-60 cursor-not-allowed bg-gray-400"
              : "hover:bg-[#00355f] hover:shadow-lg transform hover:scale-105 cursor-pointer"
          }
          ${className}
        `}
        aria-label={loading ? `Loading more content` : "Load more content"}
        type="button"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <RotatingIcon size={20}>
              <CircularProgress
                size={18}
                thickness={4}
                sx={{
                  color: "white",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
            </RotatingIcon>
            <span className="text-sm font-medium">{loadingText}</span>
          </div>
        ) : (
          <span className="text-sm font-medium">{buttonText}</span>
        )}
      </button>
    </div>
  );
};

LoadMoreButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  loadingText: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

export default LoadMoreButton;
