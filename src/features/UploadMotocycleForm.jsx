
import React, { useEffect, useState } from "react";
import { DynamicInputs } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import {
  setFormData,
  setErrors,
  setTouched,
  setFocusedField,
  clearFocusedField,
  addFiles,
  removeFile,
  clearFiles
} from "../redux/salehouseformslice";
import { saleHouseFormSchema } from "../validation/saleHouseFormSchema";
const UploadMotocycleForm = () => {
  const dispatch = useDispatch();
  const { formData, errors, touched } = useSelector(
    (state) => state.salehouseform
  );
  const focusedField = useSelector((state) => state.salehouseform.focusedField);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({
    images: [],
    videos: []
  });

  // Update preview URLs when formData.images or formData.videos change
  useEffect(() => {
    // Clean up previous object URLs to avoid memory leaks
    previewUrls.images.forEach(url => URL.revokeObjectURL(url.url));
    previewUrls.videos.forEach(url => URL.revokeObjectURL(url.url));
    
    // Create new object URLs for images
    const imageUrls = formData.images ? formData.images.map(file => ({
      file,
      url: URL.createObjectURL(file)
    })) : [];
    
    // Create new object URLs for videos
    const videoUrls = formData.videos ? formData.videos.map(file => ({
      file,
      url: URL.createObjectURL(file)
    })) : [];
    
    setPreviewUrls({
      images: imageUrls,
      videos: videoUrls
    });
    
    // Clean up function to revoke object URLs when component unmounts
    return () => {
      imageUrls.forEach(item => URL.revokeObjectURL(item.url));
      videoUrls.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [formData.images, formData.videos]);

  // Console log to verify Redux state updates
  useEffect(() => {
    console.log("Form data updated:", formData);
    console.log("Images:", formData.images?.length || 0);
    console.log("Videos:", formData.videos?.length || 0);
  }, [formData]);

  // Handle input change and clear error
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...formData, [name]: value }));

    // Clear any existing error for this field when user starts typing
    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: "" }));
    }
  };

  // Handle field blur for validation
  const handleBlur = async (e) => {
    const { name } = e.target;
    dispatch(setTouched(name));
    try {
      await saleHouseFormSchema.validateAt(name, formData);
      dispatch(setErrors({ ...errors, [name]: "" }));
    } catch (err) {
      dispatch(setErrors({ ...errors, [name]: err.message }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    const allFieldsTouched = {};
    Object.keys(formData).forEach((key) => {
      allFieldsTouched[key] = true;
    });
    dispatch({
      type: "salehouseform/setAllTouched",
      payload: allFieldsTouched,
    });

    try {
      await saleHouseFormSchema.validate(formData, { abortEarly: false });
      console.log("✅ Validated data:", formData);
      // Handle successful form submission here
    } catch (err) {
      console.log("❌ Validation errors:", err.inner);
      
      const formattedErrors = {};
      err.inner.forEach((e) => {
        formattedErrors[e.path] = e.message;
      });
      dispatch(setErrors(formattedErrors));

      // Autofocus first field with error
      if (err.inner && err.inner.length > 0) {
        const firstErrorField = err.inner[0].path;
        dispatch(setFocusedField(firstErrorField));
      }
    }
  };

  // Handle file selection with validation
  const handleFileChange = async (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    // Filter files based on type
    const filteredFiles = type === "images" 
      ? selectedFiles.filter(file => file.type.startsWith('image/'))
      : selectedFiles.filter(file => file.type.startsWith('video/'));

    if (filteredFiles.length === 0) {
      dispatch(
        setErrors({
          ...errors,
          [type]: `Only ${type === 'images' ? 'image' : 'video'} files are allowed`,
        })
      );
      dispatch(setTouched(type));
      return;
    }

    // Clear any previous errors for this field
    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    // Use the addFiles action to update Redux store
    dispatch(addFiles({ type, files: filteredFiles }));
    
    // For debugging
    console.log(`Added ${filteredFiles.length} files to ${type}`);

    // Validate the files right after adding them
    try {
      const updatedFiles = [...(formData[type] || []), ...filteredFiles];
      await saleHouseFormSchema.validateAt(type, { [type]: updatedFiles });
    } catch (err) {
      dispatch(
        setErrors({
          ...errors,
          [type]: err.message,
        })
      );
      dispatch(setTouched(type));
    }
  };

  // Handle file drag-and-drop with validation
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length === 0) return;

    // Filter files based on type
    const filteredFiles = type === "images" 
      ? droppedFiles.filter(file => file.type.startsWith('image/'))
      : droppedFiles.filter(file => file.type.startsWith('video/'));

    if (filteredFiles.length === 0) {
      dispatch(
        setErrors({
          ...errors,
          [type]: `Only ${type === 'images' ? 'image' : 'video'} files are allowed`,
        })
      );
      dispatch(setTouched(type));
      return;
    }

    // Clear any previous errors for this field
    if (errors[type]) {
      dispatch(
        setErrors({
          ...errors,
          [type]: "",
        })
      );
    }

    // Use the addFiles action to update Redux store
    dispatch(addFiles({ type, files: filteredFiles }));
    
    // For debugging
    console.log(`Added ${filteredFiles.length} files to ${type} via drop`);

    // Validate the files right after adding them
    try {
      const updatedFiles = [...(formData[type] || []), ...filteredFiles];
      await saleHouseFormSchema.validateAt(type, { [type]: updatedFiles });
    } catch (err) {
      dispatch(
        setErrors({
          ...errors,
          [type]: err.message,
        })
      );
      dispatch(setTouched(type));
    }
  };

  // Remove a specific file
  const handleRemoveFile = async (type, index) => {
    // Use the removeFile action to update Redux store
    dispatch(removeFile({ type, index }));
    
    console.log(`Removed file at index ${index} from ${type}`);

    // Clear error if files were invalid but now are valid
    if (errors[type]) {
      try {
        const updatedFiles = [...formData[type]];
        updatedFiles.splice(index, 1);
        await saleHouseFormSchema.validateAt(type, { [type]: updatedFiles });
        dispatch(setErrors({ ...errors, [type]: "" }));
      } catch (err) {
        // Keep the error updated
        dispatch(setErrors({ ...errors, [type]: err.message }));
      }
    }
  };

  // Clear all files for a specific type
  const handleClearFiles = (type) => {
    // Use the clearFiles action to update Redux store
    dispatch(clearFiles(type));
    
    console.log(`Cleared all files from ${type}`);

    // Clear any errors for this field
    if (errors[type]) {
      dispatch(setErrors({ ...errors, [type]: "" }));
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
      <h1 className="text-center text-xl font-medium text-[#02487C] mb-8">
       Upload Motorcycle
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Name
            </label>
            <DynamicInputs
              type="text"
              name="propertyName"
              id="propertyName"
              onChange={handleChange}
              value={formData.propertyName || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter property name"
              onBlur={handleBlur}
              error={errors.propertyName}
              touched={touched.propertyName}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Mobile number
            </label>
            <DynamicInputs
              type="text"
              name="mobileNumber"
              id="mobileNumber"
              onChange={handleChange}
              value={formData.mobileNumber || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white
               focus:outline-none "
              placeholder="Enter mobile number"
              onBlur={handleBlur}
              error={errors.mobileNumber}
              touched={touched.mobileNumber}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Bedrooms
            </label>
            <DynamicInputs
              type="select"
              name="bedrooms"
              id="bedrooms"
              onChange={handleChange}
              value={formData.bedrooms || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full
                border border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select bedrooms"
              onBlur={handleBlur}
              error={errors.bedrooms}
              touched={touched.bedrooms}
              focusedField={focusedField}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4+", label: "4+" },
              ]}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Type
            </label>
            <DynamicInputs
              type="select"
              name="propertyType"
              id="propertyType"
              onChange={handleChange}
              value={formData.propertyType || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Select property type"
              onBlur={handleBlur}
              error={errors.propertyType}
              touched={touched.propertyType}
              focusedField={focusedField}
              options={[
                { value: "apartment", label: "Apartment" },
                { value: "house", label: "House" },
                { value: "villa", label: "Villa" },
              ]}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Bathrooms
            </label>
            <DynamicInputs
              type="select"
              name="bathrooms"
              id="bathrooms"
              onChange={handleChange}
              value={formData.bathrooms || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select bathrooms"
              onBlur={handleBlur}
              error={errors.bathrooms}
              touched={touched.bathrooms}
              focusedField={focusedField}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4+", label: "4+" },
              ]}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Furnished
            </label>
            <DynamicInputs
              type="select"
              name="furnished"
              id="furnished"
              onChange={handleChange}
              value={formData.furnished || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full 
              border border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select the option"
              onBlur={handleBlur}
              error={errors.furnished}
              touched={touched.furnished}
              focusedField={focusedField}
              options={[
                { value: "furnished", label: "Furnished" },
                { value: "semi-furnished", label: "Semi-furnished" },
                { value: "unfurnished", label: "Unfurnished" },
              ]}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Listed by
            </label>
            <DynamicInputs
              type="select"
              name="listedBy"
              id="listedBy"
              onChange={handleChange}
              value={formData.listedBy || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border
                border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select Listed"
              onBlur={handleBlur}
              error={errors.listedBy}
              touched={touched.listedBy}
              focusedField={focusedField}
              options={[
                { value: "owner", label: "Owner" },
                { value: "agent", label: "Agent" },
                { value: "builder", label: "Builder" },
              ]}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Super Buildup area ( SQ.FT )
            </label>
            <DynamicInputs
              type="select"
              name="superBuildupArea"
              id="superBuildupArea"
              onChange={handleChange}
              value={formData.superBuildupArea || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select SQ.FT"
              onBlur={handleBlur}
              error={errors.superBuildupArea}
              touched={touched.superBuildupArea}
              focusedField={focusedField}
              options={[
                { value: "500-1000", label: "500-1000" },
                { value: "1000-1500", label: "1000-1500" },
                { value: "1500-2000", label: "1500-2000" },
                { value: "2000+", label: "2000+" },
              ]}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Carpet area SQ . FT
            </label>
            <DynamicInputs
              type="select"
              name="carpetArea"
              id="carpetArea"
              onChange={handleChange}
              value={formData.carpetArea || ""}
              className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Select carpet SQ. FT"
              onBlur={handleBlur}
              error={errors.carpetArea}
              touched={touched.carpetArea}
              focusedField={focusedField}
              options={[
                { value: "400-800", label: "400-800" },
                { value: "800-1200", label: "800-1200" },
                { value: "1200-1600", label: "1200-1600" },
                { value: "1600+", label: "1600+" },
              ]}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Floor No
            </label>
            <DynamicInputs
              type="text"
              name="floorNo"
              id="floorNo"
              onChange={handleChange}
              value={formData.floorNo || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter Floor no"
              onBlur={handleBlur}
              error={errors.floorNo}
              touched={touched.floorNo}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Building Direction
            </label>
            <DynamicInputs
              type="text"
              name="buildingDirection"
              id="buildingDirection"
              onChange={handleChange}
              value={formData.buildingDirection || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border 
              border-[#bfbfbf] bg-white focus:outline-none "
              placeholder="Enter Building Direction"
              onBlur={handleBlur}
              error={errors.buildingDirection}
              touched={touched.buildingDirection}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Total Floors
            </label>
            <DynamicInputs
              type="text"
              name="totalFloors"
              id="totalFloors"
              onChange={handleChange}
              value={formData.totalFloors || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter total floors"
              onBlur={handleBlur}
              error={errors.totalFloors}
              touched={touched.totalFloors}
              focusedField={focusedField}
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Amount
            </label>
            <DynamicInputs
              type="text"
              name="amount"
              id="amount"
              onChange={handleChange}
              value={formData.amount || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf]
               bg-white focus:outline-none "
              placeholder="Enter amount"
              onBlur={handleBlur}
              error={errors.amount}
              touched={touched.amount}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Description
            </label>
            <DynamicInputs
              type="text"
              name="description"
              id="description"
              onChange={handleChange}
              value={formData.description || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf]
               bg-white focus:outline-none h-[45px]"
              placeholder="Enter Description"
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Car parking
            </label>
            <DynamicInputs
              type="text"
              name="carParking"
              id="carParking"
              onChange={handleChange}
              value={formData.carParking || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter car parking"
              onBlur={handleBlur}
              error={errors.carParking}
              touched={touched.carParking}
              focusedField={focusedField}
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter Address
            </label>
            <DynamicInputs
              type="text"
              name="address"
              id="address"
              onChange={handleChange}
              value={formData.address || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter Address"
              onBlur={handleBlur}
              error={errors.address}
              touched={touched.address}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter State
            </label>
            <DynamicInputs
              type="text"
              name="state"
              id="state"
              onChange={handleChange}
              value={formData.state || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter State"
              onBlur={handleBlur}
              error={errors.state}
              touched={touched.state}
              focusedField={focusedField}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter District
            </label>
            <DynamicInputs
              type="text"
              name="district"
              id="district"
              onChange={handleChange}
              value={formData.district || ""}
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] 
              bg-white focus:outline-none "
              placeholder="Enter District"
              onBlur={handleBlur}
              error={errors.district}
              touched={touched.district}
              focusedField={focusedField}
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Image Upload */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Image Upload
            </label>
            <DynamicInputs
              type="file-image"
              name="images"
              id="image-upload"
              handleFileChange={(e) => handleFileChange(e, "images")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "images")}
              isDragging={isDragging}
              error={errors.images}
              touched={touched.images}
              accept="image/*"
            />

            {/* Display image file previews and clear icon */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">Selected Images: {formData.images.length}</p>
                  <button
                    type="button"
                    onClick={() => handleClearFiles("images")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon sx={{ cursor: "pointer" }} />
                  </button>
                </div>
                <ul className="mt-2 flex flex-wrap gap-[10px]">
                  {previewUrls.images.map((item, index) => (
                    <li
                      key={index}
                      className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                    >
                      <div className="w-[140px] h-[140px] rounded-[10px] object-cover">
                        <img
                          src={item.url}
                          alt={`Image ${index}`}
                          title={item.file.name}
                          className="object-cover w-[100%] h-[100%] rounded-[10px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("images", index)}
                        className="absolute top-[-15px] border border-[#bfbfbf] right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                      >
                        <ClearIcon fontSize="small" />
                      </button>
                    </li>
                  ))}
                </ul>
                {touched.images && errors.images && (
                  <p className="text-red-500 text-xs mt-2 px-4">
                    {errors.images}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Video Upload
            </label>
            <DynamicInputs
              type="file-video"
              name="videos"
              id="video-upload"
              handleFileChange={(e) => handleFileChange(e, "videos")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "videos")}
              isDragging={isDragging}
              error={errors.videos}
              touched={touched.videos}
              accept="video/*"
            />

            {/* Display video file previews and clear icon */}
            {formData.videos && formData.videos.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">Selected Videos: {formData.videos.length}</p>
                  <button
                    type="button"
                    onClick={() => handleClearFiles("videos")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon sx={{ cursor: "pointer" }} />
                  </button>
                </div>
                <ul className="mt-2">
                  {previewUrls.videos.map((item, index) => (
                    <li
                      key={index}
                      className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                    >
                      <div className="mt-2">
                        <video
                          src={item.url}
                          controls
                          className="w-[250px] h-[170px] rounded-[10px]"
                          title={item.file.name}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("videos", index)}
                        className="absolute top-[-15px] border border-[#bfbfbf] right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                      >
                        <ClearIcon fontSize="small" />
                      </button>
                    </li>
                  ))}
                </ul>
                {touched.videos && errors.videos && (
                  <p className="text-red-500 text-xs mt-2 px-4">
                    {errors.videos}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description text area */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2 px-4">
            Description
          </label>

          <DynamicInputs
            type="textarea"
            name="longdescription"
            id="longdescription"
            onChange={handleChange}
            value={formData.longdescription || ""}
            className="w-full max-w-[100%] h-[90px] px-4 py-3 rounded-[10px] border border-[#bfbfbf] 
              bg-white focus:outline-none "
            placeholder="Enter description"
            onBlur={handleBlur}
            error={errors.longdescription}
            touched={touched.longdescription}
            focusedField={focusedField}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer bg-[#02487c] text-white
             text-lg font-medium rounded-full px-10 py-3 hover:bg-blue-900 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};


export default UploadMotocycleForm
