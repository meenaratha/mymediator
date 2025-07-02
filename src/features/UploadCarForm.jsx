import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { DynamicInputs } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { uploadCarFormSchema } from "../validation/uploadCarFormShema";
import { dropdownService } from "@/utils/propertyDropdownService";
import { apiForFiles } from "@/api/axios";
import { submitCarForm } from "@/utils/carFormService";
import {
  setFormData,
  updateFormField,
  setErrors,
  setTouched,
  setFocusedField,
  clearFocusedField,
  addFiles,
  removeFile,
  clearFiles,
  populateFormFromApi,
  setLoading,
  setApiError,
  resetForm,
  clearAutoPopulateData,
  selectIsAutoPopulating,
  setAllTouched,
} from "../redux/uploadcarFormSlice";

const UploadCarForm = () => {
  const dispatch = useDispatch();
  const { slug, id } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  const { formData, errors, touched, isLoading, apiError } = useSelector(
    (state) => state.uploadcarform
  );

  const [dropdownData, setDropdownData] = useState({
    states: [],
    districts: [],
    cities: [],
    carBrands: [],
    carModels: [],
    fuelTypes: [],
    transmissions: [],
  });

  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [deletedMediaIds, setDeletedMediaIds] = useState({
    images: [],
    videos: [],
  });

  // Load initial dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const [states, brands, fuelTypes, transmissions, ] =
          await Promise.all([
            dropdownService.getStates(),
            dropdownService.getcarBrand(),
            dropdownService.getfuelTypes(),
            dropdownService.gettransmissions(),
          ]);

        setDropdownData((prev) => ({
          ...prev,
          states: Array.isArray(states) ? states : [],
          carBrands: Array.isArray(brands) ? brands : [],
          fuelTypes: Array.isArray(fuelTypes) ? fuelTypes : [],
          transmissions: Array.isArray(transmissions) ? transmissions : [],
          districts: [],
          cities: [],
          carModels: [],
        }));
      } catch (error) {
        console.error("Failed to load dropdown data:", error);
        dispatch(
          setApiError("Failed to load form options. Please refresh the page.")
        );
      } finally {
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, [dispatch]);

  // Load districts when state changes
  const loadDistricts = useCallback(async (stateId) => {
    if (!stateId) return;
    setLoadingDistricts(true);
    try {
      const districts = await dropdownService.getDistricts(stateId);
      setDropdownData((prev) => ({
        ...prev,
        districts: Array.isArray(districts) ? districts : [],
        cities: [],
      }));
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDropdownData((prev) => ({ ...prev, districts: [], cities: [] }));
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  // Load cities when district changes
  const loadCities = useCallback(async (districtId) => {
    if (!districtId) return;
    setLoadingCities(true);
    try {
      const cities = await dropdownService.getCities(districtId);
      setDropdownData((prev) => ({
        ...prev,
        cities: Array.isArray(cities) ? cities : [],
      }));
    } catch (error) {
      console.error("Failed to load cities:", error);
      setDropdownData((prev) => ({ ...prev, cities: [] }));
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // Load car models when brand changes
  const loadCarModels = useCallback(async (brandId) => {
    if (!brandId) return;
    setLoadingModels(true);
    try {
      const models = await dropdownService.getcarModel(brandId);
      setDropdownData((prev) => ({
        ...prev,
        carModels: Array.isArray(models) ? models : [],
      }));
    } catch (error) {
      console.error("Failed to load car models:", error);
      setDropdownData((prev) => ({ ...prev, carModels: [] }));
    } finally {
      setLoadingModels(false);
    }
  }, []);

  // Handle dropdown changes
  useEffect(() => {
    if (formData.state_id) {
      loadDistricts(formData.state_id);
    }
  }, [formData.state_id, loadDistricts]);

  useEffect(() => {
    if (formData.district_id) {
      loadCities(formData.district_id);
    }
  }, [formData.district_id, loadCities]);

  useEffect(() => {
    if (formData.brand_id) {
      loadCarModels(formData.brand_id);
    }
  }, [formData.brand_id, loadCarModels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
    if (errors[name]) {
      dispatch(setErrors({ ...errors, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    dispatch(setTouched(name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    dispatch(setLoading(true));
    dispatch(setApiError(null));

    try {
      // Mark all fields as touched
      const allFieldsTouched = {};
      Object.keys(formData).forEach((key) => {
        allFieldsTouched[key] = true;
      });
      dispatch(setAllTouched(allFieldsTouched));

      // Validate form
      await uploadCarFormSchema.validate(formData, { abortEarly: false });

      // Submit form
      const result = await submitCarForm(formData, isEditMode);

      if (result.success) {
        alert(
          isEditMode ? "Car updated successfully!" : "Car created successfully!"
        );
        if (!isEditMode) {
          dispatch(resetForm());
        }
      } else {
        if (result.validationErrors) {
          dispatch(setErrors(result.validationErrors));
        }
        dispatch(setApiError(result.error || "Submission failed"));
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        dispatch(setErrors(validationErrors));
      } else {
        dispatch(setApiError(err.message || "An error occurred"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderDropdown = (name, label, options, loading = false) => (
    <div className="mb-4">
      <label className="block text-gray-800 font-medium mb-2 px-4">
        {label} *
      </label>
      <div className="relative">
        <select
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full max-w-sm px-4 py-3 rounded-full border border-[#bfbfbf] bg-white focus:outline-none appearance-none pr-10"
          disabled={loading}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      {errors[name] && touched[name] && (
        <p className="text-red-500 text-sm mt-1 px-4">{errors[name]}</p>
      )}
    </div>
  );

  if (loadingDropdowns) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-3xl w-full max-w-6xl shadow-[0_0_10px_rgba(176,_176,_176,_0.25)] mx-auto border border-[#b9b9b9] bg-[#f6f6f6]">
      <h1 className="text-center text-xl font-medium text-[#02487C] mb-8">
        {isEditMode ? "Edit Car" : "Upload Car"}
      </h1>

      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Car Title *
            </label>
            <DynamicInputs
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.title}
              touched={touched.title}
              placeholder="Enter car title"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Mobile Number *
            </label>
            <DynamicInputs
              type="text"
              name="mobile_number"
              value={formData.mobile_number || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.mobile_number}
              touched={touched.mobile_number}
              placeholder="Enter mobile number"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Year *
            </label>
            <DynamicInputs
              type="number"
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.year}
              touched={touched.year}
              placeholder="Enter year"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Kilometers *
            </label>
            <DynamicInputs
              type="number"
              name="kilometers"
              value={formData.kilometers || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.kilometers}
              touched={touched.kilometers}
              placeholder="Enter kilometers"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2 px-4">
              Price *
            </label>
            <DynamicInputs
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              touched={touched.price}
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {renderDropdown(
            "state_id",
            "State",
            dropdownData.states,
            loadingDropdowns
          )}
          {renderDropdown(
            "district_id",
            "District",
            dropdownData.districts,
            loadingDistricts
          )}
          {renderDropdown(
            "city_id",
            "City",
            dropdownData.cities,
            loadingCities
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {renderDropdown(
            "brand_id",
            "Brand",
            dropdownData.carBrands,
            loadingDropdowns
          )}
          {renderDropdown(
            "model_id",
            "Model",
            dropdownData.carModels,
            loadingModels
          )}
          {renderDropdown(
            "fuel_type_id",
            "Fuel Type",
            dropdownData.fuelTypes,
            loadingDropdowns
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {renderDropdown(
            "transmission_id",
            "Transmission",
            dropdownData.transmissions,
            loadingDropdowns
          )}
          
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-2 px-4">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-lg border border-[#bfbfbf] bg-white focus:outline-none"
            placeholder="Enter description"
            rows={4}
          />
          {errors.description && touched.description && (
            <p className="text-red-500 text-sm mt-1 px-4">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#02487c] text-white text-lg font-medium rounded-full px-10 py-3 hover:bg-blue-900 focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCarForm;
