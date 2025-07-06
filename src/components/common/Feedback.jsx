import React, { useState } from 'react';
import { api } from '@/api/axios';
import Swal from 'sweetalert2';
const Feedback = ({ onClose, rateableData, rateableType = 'property' }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showReviewInput, setShowReviewInput] = useState(false);
  const totalStars = 5;

  const rateableId = rateableData?.id;

  console.log('Feedback component props:', {
    rateableType,
    rateableId,
    rateableData
  });

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    // Show review input after rating selection
    if (selectedRating > 0) {
      setShowReviewInput(true);
    }
  };

// Simple success alert
  const showSuccessAlert = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Thank You!',
      text: 'Your rating has been submitted successfully.',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      allowOutsideClick: true,
      allowEscapeKey: true
    });
  };


  const handleSubmit = async () => {
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    if (!rateableId) {
      setSubmitError('Unable to submit rating. Missing required information.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare the payload according to your API requirements
      const payload = {
        rateable_type: rateableType,
        rateable_id: rateableId,
        rating: rating,
        review: review || `${rating} star rating for this ${rateableType}.`
      };

      console.log('Submitting rating with payload:', payload);

      // Submit to API
      const response = await api.post('/rating', payload);
      
      console.log('Rating submitted successfully:', response.data);
// Show simple success SweetAlert
      await showSuccessAlert();
      // Close the feedback modal after successful submission
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error submitting rating:', error);

     // Show error SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: error.response?.data?.message || 'Failed to submit rating. Please try again.',
        confirmButtonText: 'OK',
        allowOutsideClick: true,
        allowEscapeKey: true
      });
      
      // Handle different error scenarios
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.response?.status === 422) {
        setSubmitError('Please check your input and try again.');
      } else if (error.response?.status === 401) {
        setSubmitError('Please login to submit a rating.');
      } else {
        setSubmitError('Failed to submit rating. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(39,39,39,0.57)] backdrop-blur-[10px] flex items-center justify-center z-[9999]">
      <div className="bg-[#003B6D] p-8 rounded-[20px] shadow-lg max-w-[420px] w-full mx-4 transform transition-all duration-300 ease-in-out">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-white text-[28px] font-semibold mb-4 text-center">
          Share your Feedback
        </h2>

        {/* Item being rated */}
        {rateableData && (
          <p className="text-white text-center text-sm mb-6 opacity-90">
            Rating: {rateableData.property_name || rateableData.car_name || rateableData.bike_name || rateableData.product_name || rateableData.name}
          </p>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {submitError}
          </div>
        )}

        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-black">
            <strong>Debug:</strong> Type: {rateableType} | ID: {rateableId} | Has Data: {rateableData ? 'Yes' : 'No'}
          </div>
        )} */}
        
        {/* Star Rating */}
        <div className="flex justify-center gap-3 mb-6">
          {[...Array(totalStars)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleStarClick(index + 1)}
              disabled={isSubmitting}
              className="focus:outline-none transform transition-transform hover:scale-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Rating text */}
        {rating > 0 && (
          <p className="text-white text-center text-lg mb-4">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        )}

        {/* Review input (optional) */}
        {showReviewInput && (
          <div className="mb-6">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a review (optional)..."
              className="text-white border-white w-full p-3 rounded-lg text-black text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white"
              rows="3"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !rateableId}
            className={`w-[280px] ${
              isSubmitting || rating === 0 || !rateableId 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white hover:bg-gray-50 hover:scale-105 hover:shadow-lg active:scale-95'
            } text-black text-lg font-medium py-3 px-6 rounded-[12px] cursor-pointer
            transform transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;