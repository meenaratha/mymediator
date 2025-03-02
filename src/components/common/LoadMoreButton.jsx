import React from "react";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";

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
      style={{ display: "inline-flex", width: size, height: size }}
    >
      {children}
    </motion.div>
  );
};

// Example usage with the "Load more" button
const LoadMoreButton = ({ onClick, loading = false }) => {
  return (
    <div className="flex justify-center w-full">
      <button
        onClick={onClick}
        disabled={loading}
        className="cursor-pointer bg-[#004175] text-white font-medium py-3 px-6 rounded-full flex items-center justify-center space-x-2 w-full max-w-[fit-content] mx-auto hover:bg-[#00355f] transition-colors duration-300"
      >
        <RotatingIcon>
          <CircularProgress size={20} thickness={4} color="inherit" />
        </RotatingIcon>
        <span className="ml-2">Load more</span>
      </button>
    </div>
  );
};

export default LoadMoreButton;
