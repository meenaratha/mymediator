import React, { useState } from 'react';


const Feedback = ({onClose}) => {
  const [rating, setRating] = useState(0);
  const totalStars = 5;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    console.log('Submitted rating:', rating);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div 
     className="fixed inset-0 bg-[rgba(39,39,39,0.57)] backdrop-blur-[10px] flex items-center justify-center z-[998]">
      <div className="bg-[#003B6D] p-8 rounded-[20px] shadow-lg max-w-[420px] w-full mx-4 transform transition-all duration-300 ease-in-out">
        <h2 className="text-white text-[28px] font-semibold mb-8 text-center">
          Share your Feedback
        </h2>
        
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(totalStars)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleStarClick(index + 1)}
              className="focus:outline-none transform transition-transform hover:scale-110 cursor-pointer"
            >
              <svg
                className={`w-12 h-12 ${
                  index < rating ? 'text-[#FF5722]' : 'text-white'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="flex justify-center w-full">
          <button
            onClick={handleSubmit}
            className="w-[280px] bg-white text-black text-lg font-medium py-3 px-6 rounded-[12px] cursor-pointer
            transform transition-all duration-300 ease-in-out
            hover:bg-gray-50 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
