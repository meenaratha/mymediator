import IMAGES from "@/utils/images.js";
import React, { useState } from "react";
import { DynamicInputs } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  setErrors,
  setTouched,
  setFocusedField ,
} from "../redux/salehouseformslice";
import { saleHouseFormSchema } from "../validation/saleHouseFormSchema";
const HouseSaleForm = () => {
  const dispatch = useDispatch();
  const { formData, errors, touched } = useSelector(
    (state) => state.salehouseform
  );
  const focusedField = useSelector((state) => state.salehouseform.focusedField);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ name, value }));
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("✅ Validated data:", formData);
    } catch (err) {
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
  return (
    <>
      <div
        className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl
    shadow-[0_0_10px_rgba(176,_176,_176,_0.25)]
     mx-auto border border-[#b9b9b9] bg-[#f6f6f6] "
      >
        <h1 className="text-center text-xl font-medium text-[#02487C] mb-8 ">
          Sale ( Houses & Apartment )
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
                value={formData.propertyName}
                className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter property name"
                onBlur={handleBlur}
                error={errors.propertyName}
                touched={touched.propertyName}
                focusedField={focusedField}
              />
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
    </>
  );
};

export default HouseSaleForm;
