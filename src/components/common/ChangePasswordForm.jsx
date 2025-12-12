import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { api } from "../../api/axios";
import Swal from "sweetalert2";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateField = (name, value, allValues) => {
    switch (name) {
      case "currentPassword":
        if (!value) return "Current password is required";
        return null;
      case "newPassword":
        if (!value) return "New password is required";
        // at least 8 chars, one upper, one lower, one number, one special
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        if (!passwordRegex.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        if (value === allValues.currentPassword) {
          return "New password must be different from current password";
        }
        return null;
      case "confirmPassword":
        if (!value) return "Please confirm your new password";
        if (value !== allValues.newPassword) {
          return "Passwords do not match";
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValues = { ...formData, [name]: value };
    setFormData(nextValues);
    const error = validateField(name, value, nextValues);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      await api.post("/forget-password", {
       purpose: "change_password",
      new_password: formData.newPassword,
      new_password_confirmation: formData.confirmPassword,
      });


       // SweetAlert success
    await Swal.fire({
      icon: "success",
      title: "Password Changed",
      text: "Your password has been updated successfully.",
      confirmButtonColor: "#02487C",
    });
      // reset on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // TODO: show success toast
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Change password error:", error);
      const msg =
        error.response?.data?.message ||
        "Unable to change password. Please try again.";
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <>
    <div className="flex justify-center items-center my-8">
    
     <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Change Password
      </h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Current password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div
            className={`flex items-center border rounded-md p-2 bg-[#FCFCFC]
            border-[#CCCBCB] ${
              errors.currentPassword ? "border-red-500" : "border-gray-300"
            } ${isSubmitting ? "opacity-50" : ""}`}
          >
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-1 py-1 outline-none bg-[#FCFCFC]"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              className="text-gray-500 focus:outline-none"
              disabled={isSubmitting}
            >
              {show.current ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div
            className={`flex items-center border rounded-md p-2 bg-[#FCFCFC]
            border-[#CCCBCB] ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            } ${isSubmitting ? "opacity-50" : ""}`}
          >
            <input
              type={show.newPass ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-1 py-1 outline-none bg-[#FCFCFC]"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => toggleShow("newPass")}
              className="text-gray-500 focus:outline-none"
              disabled={isSubmitting}
            >
              {show.newPass ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div
            className={`flex items-center border rounded-md p-2 bg-[#FCFCFC]
            border-[#CCCBCB] ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } ${isSubmitting ? "opacity-50" : ""}`}
          >
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-1 py-1 outline-none bg-[#FCFCFC]"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="text-gray-500 focus:outline-none"
              disabled={isSubmitting}
            >
              {show.confirm ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#02487C] text-white py-2 rounded-[20px] hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
    
    </div>
    </>
   
  );
};

export default ChangePasswordForm;
