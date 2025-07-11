import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiForFiles } from '@/api/axios';
import Swal from 'sweetalert2';
import { ArrowLeft, User, Phone, Mail, MapPin, Camera, Edit3 } from 'lucide-react';

const ProfileEditScreen = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Optional - for edit mode
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Removed edit mode - this is always a profile update form
  const [currentUserId, setCurrentUserId] = useState(null);
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const addressInputRef = useRef(null);

  // Validation schema - simplified to match backend rules
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .max(255, 'Name must be less than 255 characters'),
    phone: Yup.string()
      .required('Phone is required'),
    email: Yup.string()
      .email('Invalid email format')
      .nullable(),
    address: Yup.string()
      .nullable()
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    }
  });

  // Fetch profile data using /getuser/profile endpoint
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching profile data from /getuser/profile');
      
      const response = await apiForFiles.get('/getuser/profile');
      console.log('Profile response:', response.data);

      if (response.data.success || response.data.data) {
        const userData = response.data.data || response.data;
        setProfileData(userData);
        setCurrentUserId(userData.id);
        
        // Auto-populate form with existing data
        formik.setValues({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || userData.mobile_number || '',
          address: userData.address || ''
        });

        // Set profile image preview
        if (userData.image_url) {
          setImagePreview(userData.image_url);
        }

        console.log('Profile data loaded and form populated');
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      
      if (error.response?.status === 401) {
        setError('Please login to update profile');
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for profile update
  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);
    
    // Clear any previous field errors
    formik.setErrors({});

    try {
      console.log('Submitting profile update:', values);
      console.log('Profile image selected:', profileImage);

      // Create FormData for file upload support
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      
      // Email is nullable, only append if not empty
      if (values.email && values.email.trim()) {
        formData.append('email', values.email);
      }
      
      // Address is nullable, only append if not empty
      if (values.address && values.address.trim()) {
        formData.append('address', values.address);
      }
      
      // Add profile image if selected
      if (profileImage) {
        formData.append('image', profileImage);
        console.log('Image file added to FormData:', {
          name: profileImage.name,
          size: profileImage.size,
          type: profileImage.type
        });
      }

      // Add _method for Laravel PATCH request
      formData.append('_method', 'POST');

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], 'FILE:', pair[1].name, pair[1].size, 'bytes');
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      // Use /profile/update endpoint
      const response = await apiForFiles.post('/profile/update', formData);

      console.log('Profile update response:', response.data);

      if (response.data.success) {
        // Get user ID from response
        const userIdFromResponse = response.data.data.id;
        console.log('User ID from profile update:', userIdFromResponse);
        
        // Update current user ID and profile data
        setCurrentUserId(userIdFromResponse);
        setProfileData(response.data.data);

        // Show success alert
        await Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been updated successfully.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true
        });

        // Navigate to profile edit page
        // navigate(`/profile-edit`);
        navigate(0);
        
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Handle Laravel validation errors - map to specific fields
        const backendErrors = error.response.data.errors;
        const formikErrors = {};
        
        console.log('Backend validation errors:', backendErrors);
        
        // Map backend field errors to formik field errors
        Object.keys(backendErrors).forEach(field => {
          const errorMessages = backendErrors[field];
          const errorMessage = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
          
          // Map backend field names to formik field names
          switch (field) {
            case 'name':
              formikErrors.name = errorMessage;
              break;
            case 'phone':
              formikErrors.phone = errorMessage;
              break;
            case 'email':
              formikErrors.email = errorMessage;
              break;
            case 'address':
              formikErrors.address = errorMessage;
              break;
            case 'image':
              // Show image error as a general error since there's no image field in form
              setError(`Image Error: ${errorMessage}`);
              break;
            default:
              // For any other fields, add to general error
              setError(`${field}: ${errorMessage}`);
          }
        });
        
        // Set the field errors in formik
        formik.setErrors(formikErrors);
        
        // Auto-focus the first field with an error
        setTimeout(() => {
          const fieldOrder = ['name', 'phone', 'email', 'address'];
          const refMap = {
            name: nameInputRef,
            phone: phoneInputRef,
            email: emailInputRef,
            address: addressInputRef
          };
          
          for (const fieldName of fieldOrder) {
            if (formikErrors[fieldName] && refMap[fieldName]?.current) {
              refMap[fieldName].current.focus();
              console.log(`Auto-focused field: ${fieldName}`);
              break;
            }
          }
        }, 100);
        
        // If there are field errors, don't show general error alert
        if (Object.keys(formikErrors).length === 0) {
          // Only show alert if no field-specific errors
          const generalMessage = error.response.data.message || 'Please check your input and try again';
          setError(generalMessage);
          
          Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: generalMessage,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
          });
        }
      } else {
        // Handle other types of errors
        let errorMessage = 'Failed to update profile';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage = 'Please login to update profile';
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to perform this action';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later';
        }

        setError(errorMessage);

        // Show error alert for non-validation errors
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: errorMessage,
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Clear any previous image errors
      setError(null);
      
      console.log('Image file selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Image Error: Please select a valid image file');
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (2MB max to match backend)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image Error: Image size must be less than 2MB');
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // File is valid, store it
      setProfileImage(file);
      console.log('Image file stored in state');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        console.log('Image preview created');
      };
      reader.readAsDataURL(file);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []); // Removed userId dependency since we're not using it anymore

  // Auto-focus name field after data loads
  useEffect(() => {
    if (!loading && profileData && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [loading, profileData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="">
        <div className=" mx-auto px-4 py-4">
          <div className="w-full max-w-full flex items-center justify-center">
  <h1 className="text-xl font-semibold text-center text-gray-900">
    Update Profile
  </h1>
</div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Image Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Edit photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            {profileData?.name || 'User'}
          </h2>
          <p className="text-gray-600 text-sm">Tap the camera icon to change photo</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="relative">
              <input
                ref={nameInputRef}
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.name && formik.touched.name
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                disabled={submitting}
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>

          {/* Mobile Number Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <input
                ref={phoneInputRef}
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter mobile number"
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.phone && formik.touched.phone
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                disabled={submitting}
              />
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            {formik.errors.phone && formik.touched.phone && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email ID <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                placeholder="Enter email ID (optional)"
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.email && formik.touched.email
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled={submitting}
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            {formik.errors.email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <textarea
                ref={addressInputRef}
                id="address"
                name="address"
                placeholder="Enter your address (optional)"
                rows="3"
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.address && formik.touched.address
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                disabled={submitting}
              />
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            {formik.errors.address && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.address}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !formik.isValid}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
              submitting || !formik.isValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
            } flex items-center justify-center`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Updating Profile...
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 mr-2" />
                Update Profile
              </>
            )}
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default ProfileEditScreen;