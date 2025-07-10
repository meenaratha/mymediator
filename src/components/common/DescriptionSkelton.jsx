// components/BikeSkeleton.jsx
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const DescriptionSkeleton = () => {
  return (
    <>
      {/* BikeDetails Skeleton */}
     

      <div className="p-4">
        {/* Container for the two-column layout */}
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Left Column Skeleton (65%) */}
          <div className="md:w-2/3 w-full md:pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full border border-gray-200">
              {/* Upper section skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#E1E1E1] pb-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={64} height={20} />
                  </div>
                ))}
              </div>

              {/* Middle section skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-b border-[#E1E1E1]">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={80} height={20} />
                  </div>
                ))}
              </div>

              {/* Description skeleton */}
              <div className="pt-4">
                <Skeleton 
                  variant="text" 
                  width={128} 
                  height={32} 
                  sx={{ mb: 2 }} 
                />
                <div className="space-y-2">
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="75%" height={20} />
                  <Skeleton variant="text" width="50%" height={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton (35%) */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white p-6 shadow-lg rounded-lg h-full">
              {/* Profile Section Skeleton */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="ml-3">
                    <Skeleton variant="text" width={96} height={24} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width={64} height={20} />
                  </div>
                </div>
                <Skeleton variant="text" width={80} height={20} />
              </div>

              {/* Location Section Skeleton */}
              <div className="my-4">
                <div className="flex flex-col justify-center items-center max-w-sm mx-auto gap-[10px]">
                  <Skeleton 
                    variant="rectangular" 
                    width={150} 
                    height={150} 
                    sx={{ borderRadius: 2.5 }} 
                  />
                  <div className="flex items-center space-x-2">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width={128} height={20} />
                  </div>
                </div>
              </div>

              {/* Ad ID and Report Section Skeleton */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={64} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Details Skeleton */}
      <div className="p-4 rounded-xl shadow-lg bg-white w-full mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="grid grid-cols-2">
              <div className="flex gap-[15px] justify-between">
                <Skeleton variant="text" width={64} height={20} />
                <span>:</span>
              </div>
              <div className="px-[10px]">
                <Skeleton variant="text" width={80} height={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DescriptionSkeleton;