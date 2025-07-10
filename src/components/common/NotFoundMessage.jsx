import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ErrorOutline, 
  SearchOff, 
  Home,
  RefreshOutlined 
} from "@mui/icons-material";
const NotFoundMessage = () => {
     const navigate = useNavigate();
  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchOff sx={{ fontSize: 40, color: '#6b7280' }} />
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Property Not Found
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sorry, we couldn't find the property you're looking for. 
            It may have been removed or the link might be incorrect.
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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

export default NotFoundMessage