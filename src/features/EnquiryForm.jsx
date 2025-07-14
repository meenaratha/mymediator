import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateFormData, clearFormData } from '../redux/enquiryFormSlice';
import Feedback from '../components/common/Feedback';
import { api } from '../api/axios';
const EnquiryForm = ({ onClose, propertyData, vendorData, enquirableType  }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.enquiryForm);
  const [feedbackPopup, setFeedbackPopup] =  useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

   // Determine the enquirable data from either propertyData or vendorData
  const enquirableData = propertyData || vendorData;
  const enquirableId = enquirableData?.id;

   console.log('EnquiryForm props:', {
    enquirableType,
    enquirableId,
    enquirableData,
    propertyData,
    vendorData
  });

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
    whatsapp: Yup.string().matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits').required('WhatsApp number is required'),
    message: Yup.string().required('Message is required')
  });

 // Initialize formik
  const formik = useFormik({
    initialValues: {
      name: formState.name || '',
      email: formState.email || '',
      mobile: formState.mobile || '',
      whatsapp: formState.whatsapp || '',
      message: formState.message || `I'm interested in this ${enquirableType}. Please provide more details.`
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!enquirableId) {
        setSubmitError('Unable to submit enquiry. Missing required information.');
        return;
      }

      setIsSubmitting(true);
      setSubmitError('');

      try {
        // Prepare the payload according to your API requirements
        const payload = {
          enquirable_type: enquirableType,
          enquirable_id: enquirableId,
          name: values.name,
          mobile_number: values.mobile,
          whatsapp_number: values.whatsapp,
          email: values.email,
          message: values.message
        };

        console.log('Submitting enquiry with payload:', payload);

        // Submit to API
        const response = await api.post('/enquiry/store', payload);
        
        console.log('Enquiry submitted successfully:', response.data);

        // Clear form data from Redux
        dispatch(clearFormData());
        
        // Show success feedback
        setFeedbackPopup(true);

      } catch (error) {
        console.error('Error submitting enquiry:', error);
        
        // Handle different error scenarios
        if (error.response?.data?.message) {
          setSubmitError(error.response.data.message);
        } else if (error.response?.status === 422) {
          setSubmitError('Please check your input and try again.');
        } else if (error.response?.status === 401) {
          setSubmitError('Please login to submit an enquiry.');
        } else {
          setSubmitError('Failed to submit enquiry. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Update Redux state on form changes
  useEffect(() => {
    dispatch(updateFormData(formik.values));
  }, [formik.values, dispatch]);


  // Update Redux state on form changes
  useEffect(() => {
    dispatch(updateFormData(formik.values));
  }, [formik.values, dispatch]);

  // Handle closing feedback popup
  const handleFeedbackClose = () => {
    setFeedbackPopup(false);
    formik.resetForm();
    if (onClose) {
      onClose();
    }
  };

  // Handle form close
  const handleClose = () => {
    setSubmitError('');
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Feedback popup - Make sure this is rendered at a high z-index */}
      {feedbackPopup ? (
        <Feedback
          onClose={handleFeedbackClose}
          rateableData={enquirableData}
          rateableType={enquirableType}
        />
      ) : (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[#27272791]
     bg-opacity-50 z-999 backdrop-blur-md"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-[600px] mx-auto relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#0f1c5e]">Enquiry Now</h2>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    className={`w-full px-3 py-2 border ${
                      formik.errors.name && formik.touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    autoFocus
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    E-mail ID
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter e-mail ID"
                    className={`w-full px-3 py-2 border ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile number
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    placeholder="Enter Mobile number"
                    className={`w-full px-3 py-2 border ${
                      formik.errors.mobile && formik.touched.mobile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile}
                  />
                  {formik.errors.mobile && formik.touched.mobile && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    WhatsApp number
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="text"
                    placeholder="Enter WhatsApp number"
                    className={`w-full px-3 py-2 border ${
                      formik.errors.whatsapp && formik.touched.whatsapp
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.whatsapp}
                  />
                  {formik.errors.whatsapp && formik.touched.whatsapp && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter Message"
                  rows="4"
                  className={`w-full px-3 py-2 border ${
                    formik.errors.message && formik.touched.message
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.message}
                ></textarea>
                {formik.errors.message && formik.touched.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.message}
                  </p>
                )}
              </div>

              {/* Error Message Display */}
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !enquirableId}
                  className={`w-[170px] ${
                    isSubmitting || !enquirableId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#0f1c5e] hover:bg-blue-800"
                  } text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryForm;