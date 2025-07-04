import React, { useState, useEffect, useRef } from "react";
import { Link ,useNavigate} from "react-router-dom";
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
const GOOGLE_MAP_LIBRARIES = ["places"];

const MobileHeader = ({ isFixed }) => {
   const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    "Chennai, Tamil Nadu"
  );
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const mobileLocationRef = useRef(null);
  const mobileAutocompleteRef = useRef(null); 
  const [locationLoading, setLocationLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });
  
  const categories = {
    Property: {
      icon: "",
      subCategories: [
        "For Sale: Houses & Apartments",
        "For Rent: Houses & Apartments",
        "Lands & Plots",
        "Commercial",
        "PG & Guest Houses",
      ],
    },
    Car: {
      icon: "",
      subCategories: [
        "Cars",
        "Commercial Vehicles",
        "Spare Parts",
        "Other Vehicles",
      ],
    },
    Electronics: {
      icon: "",
      subCategories: [
        "Mobile Phones",
        "Laptops",
        "TVs",
        "Cameras",
        "Games & Entertainment",
      ],
    },
    Bike: {
      icon: "",
      subCategories: ["Motorcycles", "Scooters", "Spare Parts", "Bicycles"],
    },
    Jobs: {
      icon: "",
      subCategories: [
        "Data Entry",
        "Sales & Marketing",
        "BPO & Telecaller",
        "Driver",
        "Office Assistant",
      ],
    },
  };
  const popularLocations = ["Kerala", "Tamil Nadu", "Punjab", "Maharashtra"];
  const fetchAndSetCurrentLocation = async () => {
    if (!window.google) return;
    setLocationLoading(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const components = results[0].address_components;
            const getComponent = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || "";

            const city =
              getComponent("locality") ||
              getComponent("administrative_area_level_2");
            const state = getComponent("administrative_area_level_1");
            const formatted =
              city && state
                ? results[0].formatted_address
                : `${city}, ${state}`;

            setSelectedLocation(formatted);
            setLocationQuery(formatted);
            localStorage.setItem("user_location", formatted);
            setIsLocationOpen(false);
          }
        }
      );
    } catch (err) {
      console.error("Geolocation error:", err);
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && window.innerWidth <= 768) {
      const savedLocation = localStorage.getItem("user_location");
      if (savedLocation) {
        setSelectedLocation(savedLocation);
      } else {
        fetchAndSetCurrentLocation();
      }
    }
  }, [isLoaded]);

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
    setSelectedLocation(location);
    setIsLocationOpen(false);
    setIsMenuOpen(false);
    localStorage.setItem("user_location", location);
  };



  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null); // Close if already open
    } else {
      setActiveCategory(category); // Open if closed
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prevIndex) =>
          prevIndex === Object.keys(categories).length - 1 ? 0 : prevIndex + 1
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSearchOpen, Object.keys(categories).length]);

  const [loginFormModel, setLoginFormModel] = useState(false);
  const [signupFormModel, setSignupFormModel] = useState(false);
  const [otpVerificationModal, setOtpVerificationModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [passwordResetModel, setPasswordResetModel] = useState(false);

  const handleLoginClick = () => {
    setLoginFormModel(true);
  };
  const handleNotificationClick = ()=>{
    navigate("/notification");
  }

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
            <button onClick={() => setIsSearchOpen(true)}>
              <SearchIcon className="text-gray-700" />
            </button>
            <Badge
              badgeContent={2}
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
                                  {Object.keys(categories)[placeholderIndex]}
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
                    {Object.keys(categories).map((category) => (
                      <div
                        key={category}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => setSearchQuery(category)}
                      >
                        <SearchIcon className="text-gray-400" />
                        <span className="text-gray-700">{category}</span>
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
                      mobileAutocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={() => {
                      const place = mobileAutocompleteRef.current.getPlace();
                      if (!place?.address_components) return;
                      const components = place.address_components;
                      const getComponent = (type) =>
                        components.find((c) => c.types.includes(type))
                          ?.long_name || "";
                      const city =
                        getComponent("locality") ||
                        getComponent("administrative_area_level_2");
                      const state = getComponent("administrative_area_level_1");
                      const address = place.formatted_address;
                      const location =
                        city && state ?address : `${city}, ${state}`  ;
                      setSelectedLocation(location);
                      setLocationQuery(location);
                      localStorage.setItem("user_location", location);
                      setIsLocationOpen(false);
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
                <div className="flex items-center gap-3 text-blue-600">
                  <GpsFixedIcon />
                  <div>
                    <div className="font-medium">Use current location</div>
                    <div className="text-sm text-gray-500">
                      Location blocked. Check browser/phone settings.
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Locations */}
              <div className="flex-1 overflow-auto">
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
              </div>
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

                {/* Categories */}
                <div className="border-t border-gray-200 pt-4">
                  <div
                    className="text-sm text-gray-500 mb-2 px-3"
                    onClick={handleLoginClick}
                  >
                    LOGIN / REGISTRATION
                  </div>
                  <div className="text-sm text-gray-500 mb-2 px-3">
                    CATEGORIES
                  </div>
                  <div className="space-y-1">
                    {Object.entries(categories).map(
                      ([category, { icon, subCategories }]) => (
                        <div key={category}>
                          <div
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                            onClick={() => handleCategoryClick(category)}
                          >
                            <span className="text-xl">{icon}</span>
                            <span className="text-gray-700">{category}</span>
                            <KeyboardArrowRightIcon
                              className={`text-gray-600 ml-auto transform transition-transform ${
                                activeCategory === category ? "rotate-90" : ""
                              }`}
                            />
                          </div>

                          {/* Submenu */}
                          <AnimatePresence>
                            {activeCategory === category && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-gray-50"
                              >
                                {subCategories.map((subCategory) => (
                                  <div
                                    key={subCategory}
                                    className="px-11 py-3 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                                  >
                                    {subCategory}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
