import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateFormData, clearFormData } from '../redux/enquiryFormSlice';
import Feedback from '../components/common/Feedback';

const EnquiryForm = ({onClose}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.enquiryForm);
  const [feedbackPopup, setFeedbackPopup] =  useState(false);

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
      message: formState.message || ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
      // Dispatch to Redux store
      dispatch(clearFormData());
      setFeedbackPopup(true); // Show feedback popup after submission
      // Don't reset form here - do it after closing the feedback
    }
  });

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
  
  return (
    <>
   {/* Feedback popup - Make sure this is rendered at a high z-index */}
   {feedbackPopup ? (
        <Feedback onClose={handleFeedbackClose} />
      ):

 (
  <div className="fixed inset-0 flex items-center justify-center bg-[#27272791]
     bg-opacity-50 z-999 backdrop-blur-md">
      <div className="bg-white rounded-lg p-6 w-full max-w-[600px] mx-auto relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#0f1c5e]">Enquiry Now</h2>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter name"
                className={`w-full px-3 py-2 border ${formik.errors.name && formik.touched.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                autoFocus
              />
              {formik.errors.name && formik.touched.name && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail ID</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter e-mail ID"
                className={`w-full px-3 py-2 border ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
              <input
                id="mobile"
                name="mobile"
                type="text"
                placeholder="Enter Mobile number"
                className={`w-full px-3 py-2 border ${formik.errors.mobile && formik.touched.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
              {formik.errors.mobile && formik.touched.mobile && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.mobile}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp number</label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                placeholder="Enter WhatsApp number"
                className={`w-full px-3 py-2 border ${formik.errors.whatsapp && formik.touched.whatsapp ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.whatsapp}
              />
              {formik.errors.whatsapp && formik.touched.whatsapp && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.whatsapp}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter Message"
              rows="4"
              className={`w-full px-3 py-2 border ${formik.errors.message && formik.touched.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
            ></textarea>
            {formik.errors.message && formik.touched.message && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.message}</p>
            )}
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="w-[170px] bg-[#0f1c5e] hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Submit
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