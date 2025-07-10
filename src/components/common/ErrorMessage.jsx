import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ErrorOutline, 
  SearchOff, 
  Home,
  RefreshOutlined 
} from "@mui/icons-material";

const ErrorMessage = ({ error, onRetry }) => {
     const navigate = useNavigate();
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <ErrorOutline sx={{ fontSize: 40, color: '#dc2626' }} />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Something Went Wrong
          </h2>
          
          {/* Error Message */}
          <p className="text-gray-600 mb-2">
            We encountered an error while loading the property details.
          </p>
          
          {/* Technical Error (if available) */}
          {error?.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 font-mono">
                {error.message}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <RefreshOutlined sx={{ fontSize: 20, mr: 1 }} />
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 transition-colors duration-200 flex items-center justify-center"
            >
              <Home sx={{ fontSize: 20, mr: 1 }} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage