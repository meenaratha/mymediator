import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/images/common/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LoginFormModel from "./LoginFormModel";
import SignupFormModel from "./SignupFormModel";
import ForgotPassword from "./ForgotPassword";
import OTPVerificationModal from "./OTPVerificationModal";
import PasswordResetModel from "./PasswordResetModel";
import { Loader } from "@googlemaps/js-api-loader";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";
import { api } from "../../api/axios"; // Import API
import { Skeleton } from "@mui/material"; // Import Skeleton for loading
import { useAuth } from "../../auth/AuthContext"; // Import auth context

const GOOGLE_MAP_LIBRARIES = ["places"];
import {
  fetchNotifications,
  markAsRead,
  markAsUnread,

} from "../../redux/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const MobileHeader = ({ isFixed }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth(); // Get auth state
 const dispatch = useDispatch();
  // Get state from Redux
     const { messages, unreadCount, error } = useSelector(
       (state) => state.notifications
     );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const mobileLocationRef = useRef(null);
  const mobileAutocompleteRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [recentLocations, setRecentLocations] = useState([]);

  const [locationLoading, setLocationLoading] = useState(false);

  // Dynamic data states
  const [categories, setCategories] = useState([]);
  const [megaMenuData, setMegaMenuData] = useState({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });


  useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchNotifications());
  }
}, [dispatch, isAuthenticated]);

  // Fetch categories and subcategories for mobile menu
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await api.get("/categories");

        if (response.data.status && response.data.data) {
          const categoriesData = response.data.data;
          setCategories(categoriesData);

          // Create megamenu data structure for mobile
          const megaMenuStructure = {};

          for (const category of categoriesData) {
            try {
              // Fetch subcategories for each category
              const subResponse = await api.get(
                `/categories/${category.id}/subcategories`
              );

              if (subResponse.data.status && subResponse.data.data) {
                megaMenuStructure[category.name] = {
                  title: category.name,
                  slug: category.slug,
                  id: category.id,
                  items: subResponse.data.data.map((sub) => ({
                    name: sub.name,
                    slug: sub.slug,
                    id: sub.id,
                  })),
                };
              } else {
                // If no subcategories, add empty items array
                megaMenuStructure[category.name] = {
                  title: category.name,
                  slug: category.slug,
                  id: category.id,
                  items: [],
                };
              }
            } catch (subError) {
              console.error(
                `Error fetching subcategories for ${category.name}:`,
                subError
              );
              megaMenuStructure[category.name] = {
                title: category.name,
                slug: category.slug,
                id: category.id,
                items: [],
              };
            }
          }

          setMegaMenuData(megaMenuStructure);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const popularLocations = ["Chennai, Tamil Nadu, India"];

  const fetchAndSetCurrentLocation = async () => {
    if (!window.google || !isLoaded) {
      alert("Maps not loaded yet. Please try again.");
      return;
    }

    setLocationLoading(true);

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Use Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        throw new Error("No location data found");
      }

      const result = data.results[0];
      const components = result.address_components;

      const getComponent = (type) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      const city =
        getComponent("locality") ||
        getComponent("sublocality") ||
        getComponent("administrative_area_level_2");

      const state = getComponent("administrative_area_level_1");
      const country = getComponent("country");
      
 const newLocation = {
   address: result.formatted_address,
   city:
     getComponent("locality") ||
     getComponent("sublocality") ||
     getComponent("administrative_area_level_2"),
   state: getComponent("administrative_area_level_1"),
   country: getComponent("country"),
   //  latitude: lat,
   //  longitude: lng,
   latitude, // ✅ correct
   longitude, // ✅ correct
 };
      // Create location object
      const locationData = {
        address: result.formatted_address,
        city,
        state,
        country,
        latitude,
        longitude,
      };

      // Update states and localStorage
      const displayLocation = result.formatted_address || `${city}, ${state}`;
      setSelectedLocation(displayLocation);
      setLocationQuery(displayLocation);
      localStorage.setItem("user_location", JSON.stringify(locationData));
      localStorage.setItem("selectedLocation", JSON.stringify(locationData));

      // Close location modal
      setIsLocationOpen(false);

    } catch (error) {
      console.error("Geolocation error:", error);

      let errorMessage = "Unable to get your location. ";

      if (error.code === 1) {
        errorMessage += "Please enable location access in your browser settings.";
      } else if (error.code === 2) {
        errorMessage += "Location information is unavailable.";
      } else if (error.code === 3) {
        errorMessage += "Location request timed out.";
      } else {
        errorMessage += "Please try again or select location manually.";
      }

      alert(errorMessage);
    } finally {
      setLocationLoading(false);
    }
  };



  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      setSelectedLocation(loc.address || `${loc.city}, ${loc.state}`);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isLocationOpen &&
        mobileLocationRef.current &&
        !mobileLocationRef.current.contains(event.target)
      ) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLocationOpen]);

  const handleLocationSelect = (location) => {
    try {
      const address =
        location.address ||
        `${location.city || ""}, ${location.state || ""}`.trim();

      // Ensure we have a valid address
      if (!address || address === ", ") {
        console.error("Invalid location data:", location);
        return;
      }

      // Create complete location object
      const completeLocation = {
        address: address,
        city: location.city || "",
        state: location.state || "",
        country: location.country || "",
        latitude: location.latitude || "13.0827",
        longitude: location.longitude || "80.2707",
      };

      // Update state
      setSelectedLocation(address);
      setIsLocationOpen(false);

      // Save to localStorage
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify(completeLocation)
      );
      window.location.reload();

      // Update recent locations
      const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
      const updated = [
        address,
        ...saved.filter((loc) => loc !== address),
      ].slice(0, 5);
      localStorage.setItem("recentLocations", JSON.stringify(updated));
      setRecentLocations(updated);

      console.log("Location updated:", completeLocation);
    } catch (error) {
      console.error("Error in handleLocationSelect:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null); // Close if already open
    } else {
      setActiveCategory(categoryName); // Open if closed
    }
  };

  // Handle subcategory click
  const handleSubcategoryClick = (
    categorySlug,
    subcategorySlug,
    subcategoryId
  ) => {
    setIsMenuOpen(false);
    navigate(`/filter/${categorySlug}/${subcategorySlug}/${subcategoryId}`);
  };

  // Handle category main click (when no subcategories)
  const handleCategoryMainClick = (categorySlug) => {
    setIsMenuOpen(false);
    navigate(`/${categorySlug}`);
  };

  useEffect(() => {
    if (isSearchOpen && categories.length > 0) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prevIndex) =>
          prevIndex === categories.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSearchOpen, categories.length]);

  const [loginFormModel, setLoginFormModel] = useState(false);
  const [signupFormModel, setSignupFormModel] = useState(false);
  const [otpVerificationModal, setOtpVerificationModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [passwordResetModel, setPasswordResetModel] = useState(false);

  const handleLoginClick = () => {
    setLoginFormModel(true);
    setIsMenuOpen(false);
  };

  const handleNotificationClick = () => {
    navigate("/notification");
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  // Handle profile navigation
  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Categories skeleton loader for mobile
  const CategoriesSkeleton = () => (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex items-center gap-3 p-3">
          <Skeleton variant="rectangular" width={24} height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton
            variant="rectangular"
            width={20}
            height={20}
            className="ml-auto"
          />
        </div>
      ))}
    </div>
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {/* Main Header */}
      <header
        className={`${
          isFixed ? "fixed" : "relative"
        } top-0 left-0 right-0 bg-white shadow-sm z-50`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Menu and Logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)}>
              <MenuIcon className="text-gray-700" />
            </button>
            <Link to="/">
              <img src={Logo} alt="logo" className="w-[100px]" />
            </Link>
          </div>

          {/* Location */}
          <div
            className="flex items-center gap-1 text-sm cursor-pointer"
            onClick={() => setIsLocationOpen(true)}
          >
            <LocationOnIcon className="text-gray-600 w-5 h-5" />
            <span className="truncate max-w-[120px]">{selectedLocation}</span>
            <KeyboardArrowDownIcon className="text-gray-600 w-5 h-5" />
          </div>

          {/* Search and Notification */}
          <div className="flex items-center gap-4">
            {/* <button onClick={() => setIsSearchOpen(true)}>
              <SearchIcon className="text-gray-700" />
            </button> */}

             {isAuthenticated && (
            <Badge
               badgeContent={unreadCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "rgba(24, 166, 11, 1)",
                  color: "white",
                },
              }}
            >
              <NotificationsIcon
                style={{ color: "black" }}
                onClick={handleNotificationClick}
              />
            </Badge>
             )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[60]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <button onClick={() => setIsSearchOpen(false)}>
                  <ArrowBackIcon className="text-gray-700" />
                </button>
                <div className="flex-1 relative">
                  <div className="flex items-center">
                    <SearchIcon className="text-gray-400 absolute left-3" />
                    <div className="relative flex-1">
                      <AnimatePresence>
                        {!searchQuery && (
                          <motion.div
                            className="absolute inset-y-0 left-0 flex items-center pl-10 pointer-events-none"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-gray-500">Search</span>
                            <div className="ml-1">
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={placeholderIndex}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="text-gray-500"
                                >
                                  {categories.length > 0
                                    ? categories[placeholderIndex]?.name
                                    : "Loading"}
                                </motion.span>
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-[#f2f3f5] focus:bg-white"
                        style={{ boxShadow: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
              {!searchQuery && (
                <div className="p-4">
                  <h3 className="text-sm text-gray-500 mb-3">
                    RECENT SEARCHES
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => setSearchQuery(category.name)}
                      >
                        <SearchIcon className="text-gray-400" />
                        <span className="text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Selection Overlay */}
      <AnimatePresence>
        {isLocationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[60]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <button onClick={() => setIsLocationOpen(false)}>
                  <ArrowBackIcon className="text-gray-700" />
                </button>
                <h2 className="text-lg font-medium">LOCATION</h2>
              </div>

              {/* Search */}
              <div className="p-4">
                {isLocationOpen && isLoaded && (
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = autocompleteRef.current.getPlace();
                      if (!place.address_components) return;

                      const components = place.address_components;

                      const getComponent = (type) =>
                        components.find((c) => c.types.includes(type))
                          ?.long_name || "";

                      const address = place.formatted_address;
                      const city =
                        getComponent("locality") ||
                        getComponent("sublocality") ||
                        getComponent("administrative_area_level_2");
                      const state = getComponent("administrative_area_level_1");
                      const country = getComponent("country");

                      const lat = place.geometry?.location?.lat();
                      const lng = place.geometry?.location?.lng();

                      const newLocation = {
                        address,
                        city,
                        state,
                        country,
                        latitude: lat,
                        longitude: lng,
                      };

                      handleLocationSelect(newLocation);
                    }}
                  >
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Search city, area or locality"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </Autocomplete>
                )}
              </div>

              {/* Use Current Location */}
              <div className="px-4 pb-4 border-b">
                <div
                  className="flex items-center gap-3 text-blue-600 cursor-pointer hover:bg-blue-50 p-3 rounded-lg"
                  onClick={fetchAndSetCurrentLocation}
                >
                  {locationLoading ? (
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <GpsFixedIcon />
                  )}
                  <div>
                    <div className="font-medium">
                      {locationLoading
                        ? "Getting location..."
                        : "Use current location"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {locationLoading
                        ? "Please wait..."
                        : "Get your current location automatically"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Locations */}
              {/* <div className="flex-1 overflow-auto">
                <div className="p-4">
                  <h3 className="text-sm text-gray-500 mb-3">
                    POPULAR LOCATIONS
                  </h3>
                  <div className="space-y-4">
                    {popularLocations.map((location) => (
                      <div
                        key={location}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <LocationOnIcon className="text-gray-400" />
                        <span className="text-gray-700">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Menu</h2>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <CloseIcon className="text-gray-700" />
                  </button>
                </div>

                {/* Location Selector */}
                <div
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer mb-4"
                  onClick={() => {
                    setIsLocationOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <LocationOnIcon className="text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-gray-500">
                      {selectedLocation}
                    </div>
                  </div>
                  <KeyboardArrowRightIcon className="text-gray-600 ml-auto" />
                </div>

                {/* Auth Section */}
                <div className="border-t border-gray-200 pt-4">
                  {loading ? (
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={20}
                      className="mb-4"
                    />
                  ) : isAuthenticated ? (
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2 px-3">
                        USER MENU
                      </div>
                      <div className="space-y-1">
                        <div
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() =>
                            handleProfileNavigation("/profile-edit")
                          }
                        >
                          <span className="text-gray-700">My Profile</span>
                          <KeyboardArrowRightIcon className="text-gray-600 ml-auto" />
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() =>
                            handleProfileNavigation("/seller-enquiry-list")
                          }
                        >
                          <span className="text-gray-700">Enquiry List</span>
                          <KeyboardArrowRightIcon className="text-gray-600 ml-auto" />
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() =>
                            handleProfileNavigation("/subscription-plan")
                          }
                        >
                          <span className="text-gray-700">Subscription</span>
                          <KeyboardArrowRightIcon className="text-gray-600 ml-auto" />
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleProfileNavigation("/wishlist")}
                        >
                          <span className="text-gray-700">My Wishlist</span>
                          <KeyboardArrowRightIcon className="text-gray-600 ml-auto" />
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg cursor-pointer"
                          onClick={handleLogout}
                        >
                          <span className="text-red-600">Sign Out</span>
                          <KeyboardArrowRightIcon className="text-red-600 ml-auto" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-blue-600 mb-4 px-3 cursor-pointer font-medium"
                      onClick={handleLoginClick}
                    >
                      LOGIN / REGISTRATION
                    </div>
                  )}

                  {/* sell */}
                  <Link
                    to="/sell"
                    className="space-y-1 mb-6 flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-gray-700">SELL</span>
                    <KeyboardArrowRightIcon
                      className={`text-gray-600 ml-auto transform transition-transform `}
                    />
                  </Link>

                  {/*   Categories */}
                  <div className="text-sm text-gray-500 mb-2 px-3">
                    CATEGORIES
                  </div>

                  <div className="space-y-1">

  {/* Dynamic category navigation */}
                {categories.map((category) => (
                  <div key={category.id} className="mb-4">
                   

                     <Link
                       to={`/${category.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-gray-700"> {category.name}</span>
                    </Link>
                  </div>
                ))}



                

                    
                  </div>

                  {/* Dynamic Sub Categories */}
                  <div className="text-sm text-gray-500 mb-2 px-3">
                    SUB CATEGORIES
                  </div>

                  {isLoadingCategories ? (
                    <CategoriesSkeleton />
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(megaMenuData).map(
                        ([categoryName, categoryData]) => (
                          <div key={categoryName}>
                            <div
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                              onClick={() => {
                                if (categoryData.items.length > 0) {
                                  handleCategoryClick(categoryName);
                                } else {
                                  handleCategoryMainClick(categoryData.slug);
                                }
                              }}
                            >
                              <span className="text-gray-700">
                                {categoryData.title}
                              </span>
                              {categoryData.items.length > 0 && (
                                <KeyboardArrowRightIcon
                                  className={`text-gray-600 ml-auto transform transition-transform ${
                                    activeCategory === categoryName
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>

                            {/* Submenu */}
                            <AnimatePresence>
                              {activeCategory === categoryName &&
                                categoryData.items.length > 0 && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden bg-gray-50"
                                  >
                                    {categoryData.items.map((subCategory) => (
                                      <div
                                        key={subCategory.id}
                                        className="px-11 py-3 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                          handleSubcategoryClick(
                                            categoryData.slug,
                                            subCategory.slug,
                                            subCategory.id
                                          )
                                        }
                                      >
                                        {subCategory.name}
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                            </AnimatePresence>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Components */}
      {loginFormModel && (
        <LoginFormModel
          setLoginFormModel={setLoginFormModel}
          setSignupFormModel={setSignupFormModel}
          setForgotPasswordModal={setForgotPasswordModal}
        />
      )}

      {signupFormModel && (
        <SignupFormModel
          setLoginFormModel={setLoginFormModel}
          setSignupFormModel={setSignupFormModel}
        />
      )}

      {forgotPasswordModal && (
        <ForgotPassword
          setForgotPasswordModal={setForgotPasswordModal}
          setLoginFormModel={setLoginFormModel}
          setOtpVerificationModal={setOtpVerificationModal}
        />
      )}

      {otpVerificationModal && (
        <OTPVerificationModal
          setOtpVerificationModal={setOtpVerificationModal}
          setForgotPasswordModal={setForgotPasswordModal}
          setPasswordResetModel={setPasswordResetModel}
        />
      )}

      {passwordResetModel && (
        <PasswordResetModel
          setOtpVerificationModal={setOtpVerificationModal}
          setPasswordResetModel={setPasswordResetModel}
          setLoginFormModel={setLoginFormModel}
        />
      )}
    </>
  );
};

export default MobileHeader;