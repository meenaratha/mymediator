import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
const AccountDeleteModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    
  };

  if (!isOpen) return (
    <div className="flex justify-center items-center h-64">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Show Modal
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative overflow-hidden p-2 z-99">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <CloseIcon  size={20} />
        </button>
        
        {/* Header */}
        <div className="p-3 ">
          <h2 className="text-center font-semibold text-lg">Terms and conditions</h2>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <p className="text-center text-gray-700 mb-6">
            Are you sure you want to delete your account? This action cannot be undone and deletes the account while it does. If your data changes afterwards, you won't be able to recover your account again.
          </p>
          
          {/* Button */}
          <div className="flex justify-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-12 rounded-md transition-colors"
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeleteModal;