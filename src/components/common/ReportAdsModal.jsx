import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import { api } from "../../api/axios.js";

const ReportAdsModal = ({ 
  isOpen, 
  onClose, 
  adId, 
  adType = "property", // property, car, bike, electronics
  adTitle = "Advertisement" 
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Report reasons options
  const reportReasons = [
    { value: "Fake or misleading information", label: "Fake or Misleading Information" },
    { value: "Spam or duplicate posting", label: "Spam or Duplicate Posting" },
    { value: "Inappropriate content", label: "Inappropriate Content" },
    { value: "Fraudulent listing", label: "Fraudulent Activity" },
    { value: "Posted in wrong category", label: "Posted in Wrong Category" },
    { value: "Unreasonably overpriced", label: "Unreasonably Overpriced" },
    { value: "Item already sold", label: "Item Already Sold" },
    { value: "Copyright violation", label: "Copyright Violation" },
    { value: "Contains personal information", label: "Contains Personal Information" },
    { value: "Other", label: "Other" }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.reason.trim()) {
      newErrors.reason = "Please select a reason for reporting";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const reportData = {
        reportable_type: adType,
        reportable_id: adId,
        reason: formData.reason,
        description: formData.description.trim()
      };

      const response = await api.post('/report', reportData);

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          reason: "",
          description: ""
        });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
      
      // Handle backend validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = {};
        const errorData = error.response.data.errors;
        
        // Map backend field names to frontend field names
        const fieldMapping = {
          'reason': 'reason',
          'description': 'description',
          'reportable_type': 'general',
          'reportable_id': 'general'
        };

        Object.keys(errorData).forEach(field => {
          const frontendField = fieldMapping[field] || field;
          if (Array.isArray(errorData[field])) {
            backendErrors[frontendField] = errorData[field][0];
          } else {
            backendErrors[frontendField] = errorData[field];
          }
        });

        setErrors(backendErrors);
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Failed to submit report. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        reason: "",
        description: ""
      });
      setErrors({});
      setSubmitStatus(null);
      onClose();
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-999 p-4"
     style={{backdropFilter:"blur(5px)", background:"#000000a3"}}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <ReportIcon className="text-red-500 mr-2" />
            <h2 className="text-xl text-center font-bold text-gray-900">Report Ads</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ad Info */}
          {/* <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Reporting: {adTitle}</p>
            <p className="text-xs text-gray-500">ID: {adId} | Type: {adType}</p>
          </div> */}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                ✓ Report submitted successfully! Thank you for your feedback.
              </p>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Reporting <span className="text-red-500">*</span>
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide detailed information about why you're reporting this ad..."
                rows={4}
                maxLength={500}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">Minimum 10 characters required</p>
                )}
                <p className="text-xs text-gray-400">
                  {formData.description.length}/500
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            {/* <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> False reports may result in account restrictions. 
                All reports are reviewed by our moderation team.
              </p>
            </div> */}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : submitStatus === 'success' ? (
                  '✓ Submitted'
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportAdsModal;