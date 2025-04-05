import React, { useEffect, useRef } from "react";
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
  focusedField, // 👈 get from props
}) => {
  // Append error class if needed
  const inputClasses = `${className} ${
    touched && error ? "border border-red-500" : ""
  }`;
  const inputRef = useRef(null);
  useEffect(() => {
    if (focusedField === name && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current.focus();

      // 👇 Optional: clear after focusing once (using Redux)
      setTimeout(() => {
        dispatch(clearFocusedField()); // Requires useDispatch()
      }, 100);
    }
  }, [focusedField, name]);

  return (
    <>
      {type === "select" ? (
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
            Select an option
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
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
