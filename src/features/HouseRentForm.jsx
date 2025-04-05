import React, { useState } from "react";
// Import MUI icons
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
const HouseRentForm = () => {
  const [formData, setFormData] = useState({
    propertyName: "",
    mobileNumber: "",
    propertyType: "",
    propertyMethod: "",
    bedrooms: "",
    bathrooms: "",
    furnished: "",
    constructionStatus: "",
    listedBy: "",
    superBuildupArea: "",
    carpetArea: "",
    maintenance: "",
    totalFloors: "",
    carParking: "",
    buildingDirection: "",
    address: "",
    state: "",
    district: "",
    description: "",
    amount: "",
    images: [],
    videos: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [type]: [...prevFormData[type], ...selectedFiles],
    }));
  };

  // Handle file drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [type]: [...prevFormData[type], ...droppedFiles],
    }));
  };

  // Remove a specific file
  const handleRemoveFile = (type, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [type]: prevFormData[type].filter((_, i) => i !== index),
    }));
  };
  // Clear all files for a specific type
  const handleClearFiles = (type) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [type]: [],
    }));
  };

  return (
    <div
      className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl
    shadow-[0_0_10px_rgba(176,_176,_176,_0.25)]
     mx-auto border border-[#b9b9b9] bg-[#f6f6f6] "
    >
      <h1 className="text-center text-xl font-medium text-[#02487C] mb-8 ">
        Rent ( Houses & Apartment )
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Name
            </label>
            <input
              type="text"
              name="propertyName"
              placeholder="Enter property name"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.propertyName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Mobile number
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter mobile number"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.mobileNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Type
            </label>
            <div className="relative">
              <select
                name="propertyType"
                className="appearance-none w-full max-w-sm 
                px-4 py-3 rounded-full border border-[#bfbfbf] 
                bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select property type
                </option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Property Method
            </label>
            <div className="relative">
              <select
                name="propertyMethod"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.propertyMethod}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select property method
                </option>
                <option value="rent">Rent</option>
                <option value="lease">Lease</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Bedrooms
            </label>
            <div className="relative">
              <select
                name="bedrooms"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.bedrooms}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select bedrooms
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Bathrooms
            </label>
            <div className="relative">
              <select
                name="bathrooms"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.bathrooms}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select bathrooms
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Furnished
            </label>
            <div className="relative">
              <select
                name="furnished"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.furnished}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select the option
                </option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Construction Status
            </label>
            <div className="relative">
              <select
                name="constructionStatus"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.constructionStatus}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="ready-to-move">Ready to Move</option>
                <option value="under-construction">Under Construction</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Listed by
            </label>
            <div className="relative">
              <select
                name="listedBy"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.listedBy}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select Listed
                </option>
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Super Buildup area ( SQ.FT )
            </label>
            <div className="relative">
              <select
                name="superBuildupArea"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.superBuildupArea}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select SQ.FT
                </option>
                <option value="500-1000">500-1000</option>
                <option value="1000-1500">1000-1500</option>
                <option value="1500-2000">1500-2000</option>
                <option value="2000+">2000+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Carpet area SQ . FT
            </label>
            <div className="relative">
              <select
                name="carpetArea"
                className="appearance-none w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.carpetArea}
                onChange={handleInputChange}
              >
                <option value="" disabled selected>
                  Select carpet SQ. FT
                </option>
                <option value="400-800">400-800</option>
                <option value="800-1200">800-1200</option>
                <option value="1200-1600">1200-1600</option>
                <option value="1600+">1600+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <KeyboardArrowDownIcon className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Maintenance ( monthly )
            </label>
            <input
              type="text"
              name="maintenance"
              placeholder="Enter monthly Amount"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.maintenance}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Total Floors
            </label>
            <input
              type="text"
              name="totalFloors"
              placeholder="Enter total floors"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.totalFloors}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Car parking
            </label>
            <input
              type="text"
              name="carParking"
              placeholder="Enter car parking"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.carParking}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Building Direction
            </label>
            <input
              type="text"
              name="buildingDirection"
              placeholder="Enter Building Direction"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.buildingDirection}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter State"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Enter District
            </label>
            <input
              type="text"
              name="district"
              placeholder="Enter District"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.district}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2 px-4">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            className="w-full h-32 px-4 py-3 rounded-3xl border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Row 7 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              placeholder="Enter amount"
              className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 ">
              Image Upload
            </label>
            <div
              className={`w-full max-w-sm h-14 px-6 rounded-[10px] border border-[#bfbfbf] bg-white h-[100px] flex items-center justify-center space-x-4 ${
                isDragging ? "border-blue-500 bg-blue-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "images")}
            >
              <input
                type="file"
                name="images"
                multiple
                className="hidden"
                id="image-upload"
                onChange={(e) => handleFileChange(e, "images")}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <FileUploadIcon className="text-gray-700" />
              </label>
              <ImageIcon className="text-gray-700" />
            </div>

            {/* Display image file names and clear icon */}
            {formData.images.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">Selected Images:</p>
                  <button
                    onClick={() => handleClearFiles("images")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon sx={{ cursor: "pointer" }} />
                  </button>
                </div>
                <ul className="mt-2 flex flex-wrap gap-[10px]">
                  {formData.images.map((file, index) => {
                    let imgUrl = URL.createObjectURL(file);
                    return (
                      <li
                        key={index}
                        className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                      >
                        <div className="w-[140px] h-[140px]  rounded-[10px] object-cover">
                          <img
                            src={imgUrl}
                            alt={`Image ${index}`}
                            title={file.name}
                            className="object-cover w-[100%] h-[100%] rounded-[10px]"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveFile("images", index)}
                          className="absolute top-[-15px] border border-[#bfbfbf]  right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                        >
                          <ClearIcon fontSize="small" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Video Upload
            </label>
            <div
              className={`w-full max-w-sm h-14 px-6 rounded-[10px] border border-[#bfbfbf] bg-white h-[100px] flex items-center justify-center space-x-4 ${
                isDragging ? "border-blue-500 bg-blue-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "videos")}
            >
              <input
                type="file"
                name="videos"
                multiple
                className="hidden"
                id="video-upload"
                onChange={(e) => handleFileChange(e, "videos")}
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <FileUploadIcon className="text-gray-700" />
              </label>
              <VideoCameraBackIcon className="text-gray-700" />
            </div>

            {/* Display video file names and clear icon */}
            {formData.videos.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">Selected Videos:</p>
                  <button
                    onClick={() => setFormData({ ...formData, videos: [] })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon sx={{ cursor: "pointer" }} />
                  </button>
                </div>
                <ul className="mt-2">
                  {formData.videos.map((file, index) => {
                    let videoUrl = URL.createObjectURL(file);
                    return (
                      <li
                        key={index}
                        className="relative flex items-center justify-between p-2 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50 w-[fit-content]"
                      >
                        {/* <span
                          className="text-gray-700 truncate max-w-[200px] text-[12px]"
                          title={file.name}
                        >
                          {file.name}
                        </span> */}
                        <div className="mt-2">
                          <video
                            src={videoUrl}
                            controls
                            className="w-[250px] h-[170px]  rounded-[10px]"
                            title={file.name}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <button
                          onClick={() => handleRemoveFile("videos", index)}
                          className="absolute top-[-15px] border border-[#bfbfbf]  right-[-10px] z-10 text-red-500 hover:text-red-700 focus:outline-none cursor-pointer w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#fff]"
                        >
                          <ClearIcon fontSize="small" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer  bg-[#02487c] text-white text-lg font-medium rounded-full px-10 py-3 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default HouseRentForm;
