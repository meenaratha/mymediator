import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearFocusedField } from "../redux/salehouseformslice";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

const DynamicInputs = ({
  type,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  className,
  options = [],
  placeholder,
  focusedField,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging,
  handleFileChange,
  accept
}) => {
  // Get dispatch from Redux
  const dispatch = useDispatch();

  // Append error class if needed
  const inputClasses = `${className} ${
    touched && error ? "border border-red-500" : ""
  }`;

  const inputRef = useRef(null);

  useEffect(() => {
    if (focusedField === name && inputRef.current) {
      // Always scroll smoothly to the element
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Focus the element after a slight delay to ensure smooth scrolling completes
      setTimeout(() => {
        inputRef.current.focus();

        // Clear focused field after focusing
        setTimeout(() => {
          dispatch(clearFocusedField());
        }, 100);
      }, 300);
    }
  }, [focusedField, name, dispatch]);

  if (type === "file-image") {
    return (
      <>
        <div
          className={`w-full max-w-sm h-14 px-6 rounded-[10px] border border-[#bfbfbf] 
          bg-white h-[100px] flex items-center justify-center space-x-4 ${
            isDragging ? "border-blue-500 bg-blue-50" : ""
          } ${touched && error ? "border-red-500" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            id={id}
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={accept || "image/*"}
          />
          <label htmlFor={id} className="cursor-pointer flex items-center justify-center">
            <FileUploadIcon className="text-gray-700 mr-2" />
            <span className="text-gray-700">Upload Images</span>
          </label>
          <ImageIcon className="text-gray-700" />
        </div>
        {touched && error && !isDragging && (
          <p className="text-red-500 text-xs mt-2 px-4">{error}</p>
        )}
      </>
    );
  }

  if (type === "file-video") {
    return (
      <>
        <div
          className={`w-full max-w-sm h-14 px-6 rounded-[10px] border border-[#bfbfbf] 
          bg-white h-[100px] flex items-center justify-center space-x-4 ${
            isDragging ? "border-blue-500 bg-blue-50" : ""
          } ${touched && error ? "border-red-500" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            name={name}
            id={id}
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={accept || "video/*"}
          />
          <label htmlFor={id} className="cursor-pointer flex items-center justify-center">
            <FileUploadIcon className="text-gray-700 mr-2" />
            <span className="text-gray-700">Upload Videos</span>
          </label>
          <VideoCameraBackIcon className="text-gray-700" />
        </div>
        {touched && error && !isDragging && (
          <p className="text-red-500 text-xs mt-2 px-4">{error}</p>
        )}
      </>
    );
  }

  return (
    <>
      {type === "select" ? (
        <div className="relative">
          <select
            ref={inputRef}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClasses}
            placeholder={placeholder}
          >
            <option value="" disabled>
              {placeholder || "Select an option"}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 h-[50px]">
            <KeyboardArrowDownIcon className="text-gray-500" />
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          ref={inputRef}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          ref={inputRef}
          placeholder={placeholder}
        />
      )}

      {/* Show error message if field is touched and has error */}
      {touched && error && (
        <p className="text-red-500 text-xs mt-2 px-4">{error}</p>
      )}
    </>
  );
};

export default DynamicInputs;