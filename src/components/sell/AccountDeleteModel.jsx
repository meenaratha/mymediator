// import React, { useState } from 'react';
// import CloseIcon from '@mui/icons-material/Close';
// const AccountDeleteModal = ({ onClose }) => {
 
  

//   return (
//     <div  style={{ backdropFilter: 'blur(10px)' }}
//      className="fixed inset-0 bg-[#31303085] bg-opacity-50 flex items-center justify-center p-4 z-999">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative overflow-hidden p-2 z-99">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
//           aria-label="Close"
//         >
//           <CloseIcon  size={20} />
//         </button>
        
//         {/* Header */}
//         <div className="p-3 ">
//           <h2 className="text-center font-semibold text-lg">Terms and conditions</h2>
//         </div>
        
//         {/* Content */}
//         <div className="p-5">
//           <p className="text-center text-gray-700 mb-6">
//             Are you sure you want to delete your account? This action cannot be undone and deletes the account while it does. If your data changes afterwards, you won't be able to recover your account again.
//           </p>
          
//           {/* Button */}
//           <div className="flex justify-center">
//             <button
//               className="cursor-pointer  bg-[#0f1c5e] hover:bg-blue-700 text-white font-medium py-2 px-12 rounded-md transition-colors"
//               onClick={onClose}
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountDeleteModal;

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const AccountDeleteModal = ({ onClose, onConfirm, isDeleting }) => {
  return (
    <div
      style={{ backdropFilter: "blur(10px)" }}
      className="fixed inset-0 bg-[#31303085] bg-opacity-50 flex items-center justify-center p-4 z-999"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative overflow-hidden p-2 z-99">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <CloseIcon size={20} />
        </button>

        {/* Header */}
        <div className="p-3">
          <h2 className="text-center font-semibold text-lg">Delete Account</h2>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-center text-gray-700 mb-6">
            Are you sure you want to delete your account? This action cannot be
            undone and deletes the account while it does. If your data changes
            afterwards, you won't be able to recover your account again.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-8 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="cursor-pointer bg-[#0f1c5e] hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition-colors disabled:opacity-50 min-w-[100px] flex items-center justify-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "OK"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 export default AccountDeleteModal;