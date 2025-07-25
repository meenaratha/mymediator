import IMAGES from "@/utils/images.js";
import {
  Navigate,
  useNavigate,
  useLocation,
  Link,
  NavLink,
} from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { api } from "../../api/axios"; // Adjust the import path as needed
import { Skeleton, Box, Card, CardContent } from "@mui/material";

const Sell = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  // State management
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // Store the full category object
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categories");

        if (response.data.status && response.data.data) {
          const categoriesData = response.data.data;
          setCategories(categoriesData);

          // Set the first category as active by default
          if (categoriesData.length > 0) {
            const firstCategory = categoriesData[0];
            setActiveCategory(firstCategory); // Store the full object
            // Load subcategories for the first category
            await fetchSubcategories(firstCategory.id);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  const fetchSubcategories = async (categoryId) => {
    try {
      setSubcategoriesLoading(true);
      const response = await api.get(`/categories/${categoryId}/subcategories`);

      if (response.data.status && response.data.data) {
        setSubcategories(response.data.data);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Handler to switch categories
  const handleCategoryClick = async (categoryId) => {
    console.log("Clicked category ID:", categoryId);
    console.log("Current active category:", activeCategory);

    // If already selected, skip
    if (activeCategory?.id === categoryId) {
      console.log("Category already active, skipping");
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );

    console.log("Found selected category:", selectedCategory);

    if (selectedCategory) {
      setActiveCategory(selectedCategory); // ✅ Store the full object
      await fetchSubcategories(categoryId);
    }
  };

  // Get fallback image for categories
  const getCategoryImage = (category) => {
    const categoryImages = {
      property: IMAGES.propertycategory,
      electronics: IMAGES.electronicscategory,
      cars: IMAGES.carcategory,
      bikes: IMAGES.bikecategory,
    };

    // Use API image if available, otherwise use local fallback
    if (category.image_url) {
      return category.image_url;
    }

    return categoryImages[category.slug] || IMAGES.propertycategory;
  };

  // Loading component with skeleton
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  // Categories skeleton loader
  const CategoriesSkeletonLoader = () => (
    <div className="bg-white rounded-lg shadow-md p-6 flex-1 h-[fit-content]">
      <Skeleton
        variant="text"
        width="60%"
        height={32}
        sx={{ mx: "auto", mb: 3 }}
        animation="wave"
      />

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden">
              <div className="absolute bottom-0 w-full h-1/3 bg-gray-200"></div>

              <Skeleton
                variant="circular"
                width={64}
                height={64}
                animation="wave"
                sx={{ mb: 1 }}
              />

              <div className="relative z-[10] pt-8">
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  animation="wave"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Subcategories skeleton loader
  const SubcategoriesSkeletonLoader = () => (
    <div className="flex flex-col gap-4 flex-1">
      {[1, 2, 3, 4, 5].map((item) => (
        <Card
          key={item}
          className="shadow-sm"
          sx={{
            borderRadius: 2,
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          <CardContent className="!p-4">
            <div className="flex justify-between items-center">
              <Skeleton
                variant="text"
                width="70%"
                height={24}
                animation="wave"
              />
              <Skeleton
                variant="circular"
                width={30}
                height={30}
                animation="wave"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Individual subcategory skeleton (for when switching categories)
  const SubcategoryItemSkeleton = () => (
    <Card
      className="shadow-sm animate-pulse"
      sx={{
        borderRadius: 2,
        backgroundColor: "grey.50",
      }}
    >
      <CardContent className="!p-4">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="65%" height={24} animation="wave" />
          <Skeleton
            variant="circular"
            width={30}
            height={30}
            animation="wave"
          />
        </div>
      </CardContent>
    </Card>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center p-8">
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-10">
        <div className="max-w-[780px] w-full flex flex-col md:flex-row gap-6">
          <CategoriesSkeletonLoader />
          <SubcategoriesSkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-10">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="max-w-[780px] w-full flex flex-col md:flex-row gap-6">
        {/* Left Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6 flex-1 h-[fit-content]">
          <h2 className="text-center text-xl font-bold text-[#012D49] mb-6">
            Select Categories
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => {
              const isActive = activeCategory?.id === category.id;
              console.log(
                `Category ${category.name} (ID: ${category.id}) is active:`,
                isActive
              );

              return (
                <div key={category.id} className="flex flex-col items-center">
                  <div
                    onClick={() => handleCategoryClick(category.id)}
                    className={`${
                      isActive
                        ? "bg-[#012D49]"
                        : "bg-[#FFFFFF] border border-[#E6E6E6]"
                    } rounded-lg w-full aspect-square flex flex-col gap-2 items-center justify-center mb-2 relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                  >
                    <div
                      className="absolute bottom-0 w-full h-1/3 border border-[#A5BBC9] transition-all duration-300"
                      style={{
                        background: isActive
                          ? "#02487C"
                          : "linear-gradient(90deg, rgba(200, 214, 224, 0.61) 0%, rgba(176, 213, 234, 0.61) 100%)",
                      }}
                    ></div>
                    <img
                      src={getCategoryImage(category)}
                      alt={category.name}
                      className={`w-25 h-25 object-contain transition-all duration-300 ${
                        isActive ? "" : ""
                      }`}
                      onError={(e) => {
                        // Fallback to local image if API image fails
                        e.target.src = getCategoryImage({
                          slug: category.slug,
                        });
                      }}
                    />
                    <span
                      className={`text-sm font-medium text-center pt-8 transition-colors duration-300 ${
                        isActive ? "text-white" : "text-black"
                      } relative z-[10]`}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Subcategories Section */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Show active category title */}
          {activeCategory && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
              <h3 className="text-lg font-semibold text-[#012D49] text-center">
                {activeCategory.name} Subcategories
              </h3>
            </div>
          )}

          {subcategoriesLoading ? (
            // Show skeleton for individual items when switching categories
            <>
              {[1, 2, 3, 4].map((item) => (
                <SubcategoryItemSkeleton key={item} />
              ))}
            </>
          ) : subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <Card
                key={subcategory.id}
                component={Link}
                to={`/${activeCategory?.slug}/${
                  subcategory.slug
                }/${subcategory.id}`}
                state={{ subName: subcategory.name }}
                className="shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-l-4 border-transparent hover:border-l-[#012D49]"
                sx={{
                  borderRadius: 2,
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    boxShadow: 3,
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <CardContent className="!p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 hover:text-[#012D49] transition-colors duration-200">
                      {subcategory.name}
                    </span>
                    <img
                      src={IMAGES.doublearrow}
                      alt="Go to subcategory"
                      className="w-[30px] h-[30px] transition-transform duration-200 hover:translate-x-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm" sx={{ borderRadius: 2 }}>
              <CardContent className="!p-8 text-center">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <div className="text-gray-500">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    No subcategories available
                  </p>
                  <p className="text-gray-400 text-sm">
                    This category doesn't have any subcategories yet.
                  </p>
                </Box>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sell;
