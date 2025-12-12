import Logo from "../../assets/images/common/logo.png";
import Profile from "../../assets/images/common/android-chrome-192x192.png";
import "../../assets/css/header.css";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import Feedback from "./Feedback";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import MobileHeader from "./MobileHeader";
import LoginFormModel from "./LoginFormModel";
import SignupFormModel from "./SignupFormModel";
import ForgotPassword from "./ForgotPassword";
import OTPVerificationModal from "./OTPVerificationModal";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import PasswordResetModel from "./PasswordResetModel";
import { api } from "../../api/axios"; // Adjust the import path as needed
import { Skeleton } from "@mui/material";
import { useAuth } from "../../auth/AuthContext"; // Import the useAuth hook
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Heart, } from 'lucide-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IMAGES from "../../utils/images";
import { Tooltip } from "@mui/material";
import AddressAutocomplete from "./AddressAutocomplete";
const GOOGLE_MAP_LIBRARIES = ["places"];
import {
  fetchNotifications,
  markAsRead,
  markAsUnread,

} from "../../redux/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
    const dispatch = useDispatch();
    
    // Get state from Redux
    const { messages, unreadCount, error } = useSelector(
      (state) => state.notifications
    );
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth(); // Get auth state
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationShaking, setIsNotificationShaking] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

  // Dynamic data states
  const [categories, setCategories] = useState([]);
  const [megaMenuData, setMegaMenuData] = useState({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [hasLocationBeenSent, setHasLocationBeenSent] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Add profile menu state

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select location");
  // const [selectedLocation, setSelectedLocation] = useState({
  //   address: "Chennai, Tamil Nadu, India",
  //   latitude: 13.0827,
  //   longitude: 80.2707,
  // });
  const [recentLocations, setRecentLocations] = useState([]);
  const [popularLocations] = useState([
    "Chennai, Tamil Nadu",
   
  ]);
  const [address, setAddress] = useState([]);
  const [autocomplete, setAutocomplete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const autocompleteRef = useRef(null);

  // profile api

  // Local state for user profile data (independent of auth context)
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Function to fetch user profile directly from API
  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      setUserProfile(null);
      return;
    }
    console.log("isAuthenticated:", isAuthenticated);

    try {
      setProfileLoading(true);
      setProfileError(null);

      const response = await api.get("/getuser/profile");

      // Safely extract user profile
      const userData = response?.data?.data;

      if (userData && typeof userData === "object") {
        setUserProfile(userData);
      } else {
        throw new Error("User profile data is missing or invalid");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfileError(error.message);

      // If token is invalid, user will be logged out by axios interceptor
      if (error.response?.status === 401) {
        setUserProfile(null);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch profile when authentication status changes
  useEffect(() => {
    fetchUserProfile();
  }, [isAuthenticated]);


  useEffect(() => {
  if (isAuthenticated) {
    dispatch(fetchNotifications());
  }
}, [dispatch, isAuthenticated]);

  // Listen for profile update events from other components
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log("Header: Received profile update event");
      fetchUserProfile(); // Refresh profile data
    };

    const handleStorageChange = (event) => {
      if (event.key === "profileUpdated") {
        console.log("Header: Received storage update event");
        fetchUserProfile(); // Refresh profile data
      }
    };

    // Listen for custom events
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Auto-refresh profile data periodically (optional)
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      const interval = setInterval(() => {
        fetchUserProfile();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userProfile]);

  const getUserDisplayName = () => userProfile?.name || "User";

  const getUserAvatar = () =>
    userProfile?.image_url || IMAGES.placeholderprofile;

  const getUserPhone = () => userProfile?.mobile_number || "";

  const getUserEmail = () => userProfile?.email || "";

  const getUserInitials = () => {
    if (!userProfile) return "U";

    const name = getUserDisplayName();
    if (name.includes(" ")) {
      const names = name.split(" ");
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Add scroll event listener to check scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch categories and subcategories for megamenu
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await api.get("/categories");

        if (response.data.status && response.data.data) {
          const categoriesData = response.data.data;
          setCategories(categoriesData);

          // Create megamenu data structure
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

  // Send location to API when user enters the website

  // Load location from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      setSelectedLocation(loc.address || `${loc.city}, ${loc.state}`);
    }
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  useEffect(() => {
    const selected = localStorage.getItem("selectedLocation");
    if (!selected) {
      // Show popup after 1s if location not already selected
      setTimeout(() => {
        setIsLocationOpen(true);
      }, 1000);
    }
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       try {
  //         const res = await fetch(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
  //             import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  //           }`
  //         );
  //         const data = await res.json();
  //         const result = data.results[0];
  //         const address = result?.formatted_address || "";
  //         const components = result?.address_components || [];

  //         const getComponent = (type) =>
  //           components.find((c) => c.types.includes(type))?.long_name || "";

  //         const city =
  //           getComponent("locality") ||
  //           getComponent("sublocality") ||
  //           getComponent("administrative_area_level_2");

  //         const state = getComponent("administrative_area_level_1");
  //         const country = getComponent("country");

  //         const locationData = {
  //           address,
  //           city,
  //           state,
  //           country,
  //           latitude,
  //           longitude,
  //         };

  //         localStorage.setItem(
  //           "selectedLocation",
  //           JSON.stringify(locationData)
  //         );
  //         setSelectedLocation(address || `${city}, ${state}`);
  //       } catch (err) {
  //         console.error("Geocode error:", err);
  //       }
  //       setIsLoading(false);
  //     },
  //     (err) => {
  //       console.error("Geolocation error:", err);
  //       setIsLoading(false);
  //     }
  //   );
  // }, []);

  // Get current location on component mount
  useEffect(() => {
    const getInitialLocation = async () => {
      // Don't fetch if location is already saved
      const savedLocation = localStorage.getItem("selectedLocation");
      if (savedLocation) return;

      setIsLoading(true);

      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     async (position) => {
      //       const { latitude, longitude } = position.coords;
      //       try {
      //         const res = await fetch(
      //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
      //             import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      //           }`
      //         );
      //         const data = await res.json();
      //         const result = data.results[0];

      //         if (result) {
      //           const address = result.formatted_address || "";
      //           const components = result.address_components || [];

      //           const getComponent = (type) =>
      //             components.find((c) => c.types.includes(type))?.long_name ||
      //             "";

      //           const city =
      //             getComponent("locality") ||
      //             getComponent("sublocality") ||
      //             getComponent("administrative_area_level_2");

      //           const state = getComponent("administrative_area_level_1");
      //           const country = getComponent("country");

      //           const locationData = {
      //             address,
      //             city,
      //             state,
      //             country,
      //             latitude,
      //             longitude,
      //           };

      //           // Update state and localStorage
      //           handleLocationSelect(locationData);
      //         }
      //       } catch (err) {
      //         console.error("Geocode error:", err);
      //       }
      //       setIsLoading(false);
      //     },
      //     (err) => {
      //       console.error("Geolocation error:", err);
      //       setIsLoading(false);
      //     }
      //   );
      // } else {
      //   setIsLoading(false);
      // }
    };

    getInitialLocation();
  }, []);

  // const handleCurrentLocation = () => {
  //   setIsLoading(true);
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const lat = position.coords.latitude;
  //         const lng = position.coords.longitude;

  //         try {
  //           const res = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  //           );
  //           const data = await res.json();

  //           const newLocation = {
  //             address: data.display_name,
  //             city:
  //               data.address.city || data.address.town || data.address.village,
  //             state: data.address.state,
  //             country: data.address.country,
  //             latitude: lat,
  //             longitude: lng,
  //           };

  //           handleLocationSelect(newLocation);
  //         } catch (err) {
  //           console.error("Location fetch error", err);
  //         } finally {
  //           setIsLoading(false);
  //         }
  //       },
  //       () => setIsLoading(false)
  //     );
  //   } else {
  //     setIsLoading(false);
  //     alert("Geolocation not supported");
  //   }
  // };

  const handleCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            // Using Google Geocoding API instead of Nominatim for consistency
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }`
            );
            const data = await res.json();
            const result = data.results[0];

            if (result) {
              const components = result.address_components;
              const getComponent = (type) =>
                components.find((c) => c.types.includes(type))?.long_name || "";

              const newLocation = {
                address: result.formatted_address,
                city:
                  getComponent("locality") ||
                  getComponent("sublocality") ||
                  getComponent("administrative_area_level_2"),
                state: getComponent("administrative_area_level_1"),
                country: getComponent("country"),
                latitude: lat,
                longitude: lng,
              };

              handleLocationSelect(newLocation);
            }
          } catch (err) {
            console.error("Location fetch error", err);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          alert("Unable to get current location. Please select manually.");
        }
      );
    } else {
      setIsLoading(false);
      alert("Geolocation not supported by this browser");
    }
  };

  // Load recent locations when popup opens
  useEffect(() => {
    if (isLocationOpen) {
      const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
      setRecentLocations(saved);
    }
    document.body.style.overflow = isLocationOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocationOpen]);

  // Run when popup opens
  // useEffect(() => {
  //   if (isLocationOpen) {
  //     handleCurrentLocation();
  //   }
  // }, [isLocationOpen]);

  // Only run current location on initial load, not every time popup opens
  useEffect(() => {
    if (isLocationOpen && !localStorage.getItem("selectedLocation")) {
      handleCurrentLocation();
    }
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

      // const oldLocation = JSON.parse(
      //   localStorage.getItem("selectedLocation") || "{}"
      // );

      // if (JSON.stringify(oldLocation) !== JSON.stringify(completeLocation)) {
      //   localStorage.setItem(
      //     "selectedLocation",
      //     JSON.stringify(completeLocation)
      //   );
      //   window.location.reload();
      // }

      // Update recent locations
      const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
      const updated = [
        address,
        ...saved.filter((loc) => loc !== address),
      ].slice(0, 5);
      localStorage.setItem("recentLocations", JSON.stringify(completeLocation));
      setRecentLocations(completeLocation);

      console.log("Location updated:", completeLocation);
    } catch (error) {
      console.error("Error in handleLocationSelect:", error);
    }
  };

  useEffect(() => {
    const categoryNames = categories.map((cat) => cat.name);
    if (categoryNames.length > 0) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % categoryNames.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [categories]);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const handleSellBtnClick = () => {
    if(!isAuthenticated){
      setLoginFormModel(true);
    }
    else{
    navigate("/sell");

    }
  };

  const [loginFormModel, setLoginFormModel] = useState(false);
  const [signupFormModel, setSignupFormModel] = useState(false);
  const [otpVerificationModal, setOtpVerificationModal] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [passwordResetModel, setPasswordResetModel] = useState(false);
const [forgotPhone, setForgotPhone] = useState("");
  const handleLoginClick = () => {
    setLoginFormModel(true);
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleNotificationClick = () => {
    navigate("/notification");
  };

  const handleSearchKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    navigate(`/search?query=${encodeURIComponent(q)}`);
  }
};

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  // Handle profile navigation
  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
  };

  // Megamenu skeleton loader
  const MegaMenuSkeleton = () => (
    <div className="grid grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="space-y-4">
          <Skeleton variant="text" width="70%" height={24} />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((subItem) => (
              <Skeleton key={subItem} variant="text" width="90%" height={16} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  const locationDropdownRef = useRef(null);
  // const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const isLocationAllowed = () => {
    const savedLocation = localStorage.getItem("selectedLocation");
    return savedLocation !== null;
  };
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        if (isLocationAllowed()) {
          setIsLocationOpen(false); // ✅ allowed → close popup
        } else {
          setShake(true); // ❌ denied → shake + glow
          setTimeout(() => setShake(false), 600); // reset after animation
        }
      }
    };

    if (isLocationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationOpen, isLocationAllowed]);

  const handleTogglePopup = () => {
    if (isLocationAllowed()) {
      setIsLocationOpen((prev) => !prev); // ✅ allow opening/closing normally
    } else {
      // ❌ if location not allowed → just shake
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const allcategorymenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        allcategorymenuRef.current &&
        !allcategorymenuRef.current.contains(event.target)
      ) {
        setIsMegaMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  if (loadError) return <div>Google Maps failed to load.</div>;
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden relative z-[999]">
        <MobileHeader isFixed={isFixed} />
      </div>

      {/* Desktop Header */}
      <section
        className={`${
          isFixed ? "fixed" : "relative"
        } top-0 w-full h-[140px] hidden md:block z-[999]`}
      >
        {/* top bar */}
        <div className="w-full h-[70px] bg-[rgba(246,246,246,1)] border-b-[1px] border-b-solid border-b-[rgba(225,225,225,1)]">
          <div className="flex max-w-[1200px] mx-auto px-2.5 mymediator__container">
            <div className="w-[150px] bg-gray-200 h-[70px]">
              <img
                src={Logo}
                onClick={() => navigate("/")}
                alt=""
                className="relative z-[99] h-[140px] cursor-pointer "
              />
            </div>
            <div className="w-[100%] h-[70px] flex items-center gap-5 px-3 justify-between">
              {/* search box */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm search-container"
              >
                <SearchIcon className="text-gray-500 mr-2" />
                <div className="w-full relative">
                  <AnimatePresence>
                    {!searchQuery && (
                      <motion.div
                        className="search-placeholder"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-sm text-gray-500">Search</span>
                        <div className="placeholder-animation ml-1">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={placeholderIndex}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="text-sm text-gray-500 block"
                            >
                              {categories.length > 0
                                ? categories[placeholderIndex]?.name
                                : "Loading"}
                              ...
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
                     onKeyDown={handleSearchKeyDown}
                    className="w-full text-sm text-gray-700 focus:outline-none bg-transparent search-input"
                  />
                </div>
              </motion.div>

              {/* notification box */}
              <div className="flex gap-8 items-center">
                {isAuthenticated && (
                  <Tooltip title="View Wishlist" arrow>
                    <FavoriteIcon
                      className="w-[30px] h-[30px] text-red-600 cursor-pointer"
                      onClick={() => navigate("/wishlist")}
                    />
                  </Tooltip>
                )}

                    {isAuthenticated && (
                  <motion.div
                    animate={
                      isNotificationShaking
                        ? {
                            rotate: [0, -10, 10, -10, 10, 0],
                          }
                        : {
                            rotate: 0,
                          }
                    }
                    transition={{
                      duration: 1,
                      repeat: isNotificationShaking ? Infinity : 0,
                      repeatDelay: 2,
                    }}
                    className="cursor-pointer"
                    onMouseEnter={() => setIsNotificationShaking(false)}
                    onMouseLeave={() => setIsNotificationShaking(true)}
                  >
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
                  </motion.div>
                    )}
                {/* Conditional Login/Profile Section */}
                {loading ? (
                  // Show skeleton while loading auth state
                  <div className="flex items-center gap-4">
                    <Skeleton variant="rectangular" width={120} height={36} />
                    <Skeleton variant="circular" width={40} height={40} />
                  </div>
                ) : isAuthenticated ? (
                  // Show profile dropdown when authenticated
                  <div className="profile-menu-container relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={handleProfileClick}
                    >
                      <Avatar
                        sx={{ bgcolor: deepPurple[500], width: 40, height: 40 }}
                        alt={getUserDisplayName()}
                        src={getUserAvatar()}
                      >
                        {/* {!getUserAvatar() &&
                          getUserDisplayName().charAt(0).toUpperCase()} */}
                      </Avatar>
                      <div className="hidden lg:block">
                        <p className="text-sm font-medium text-gray-700">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getUserPhone() || "No phone number"}
                        </p>
                      </div>
                      <KeyboardArrowDownIcon
                        className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${
                          isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.div>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <p className="font-medium text-gray-900">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getUserPhone()}
                            </p>
                          </div>

                          <div className="py-2">
                            <motion.button
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                              onClick={() =>
                                handleProfileNavigation("/profile-edit")
                              }
                            >
                              <PersonIcon className="w-5 h-5" />
                              My Profile
                            </motion.button>

                            <motion.button
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                              onClick={() =>
                                handleProfileNavigation("/seller-enquiry-list")
                              }
                            >
                              <SettingsIcon className="w-5 h-5" />
                              Enquiry List
                            </motion.button>

                            <motion.button
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                              onClick={() =>
                                handleProfileNavigation("/subscription-plan")
                              }
                            >
                              <SettingsIcon className="w-5 h-5" />
                              Subscription
                            </motion.button>
                          </div>

                          <div className="border-t border-gray-100 py-2">
                            <motion.button
                              whileHover={{ backgroundColor: "#fef2f2" }}
                              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50"
                              onClick={handleLogout}
                            >
                              <LogoutIcon className="w-5 h-5" />
                              Sign Out
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Show login button when not authenticated
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="mymediator__sell_button"
                    onClick={handleLoginClick}
                    style={{ width: "100%" }}
                  >
                    Login / Sign up
                  </motion.button>
                )}

                {/* sell button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mymediator__sell_button"
                  onClick={handleSellBtnClick}
                >
                  Sell
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* header start */}
        <div className="w-full h-[70px] bg-white mymediator__header">
          <div className="flex max-w-[1200px] mx-auto px-2.5 mymediator__container">
            <div className="w-[150px] bg-gray-200 h-[70px]"></div>
            <div className="w-[100%] h-[70px] flex items-center pl-6">
              <motion.nav
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-10 text-[15px] font-medium"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 cursor-pointer relative"
                  ref={allcategorymenuRef}
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                >
                  <span className="text-gray-700">All Categories</span>
                  <motion.div
                    animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <KeyboardArrowDownIcon className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {isMegaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg p-6 z-50"
                      >
                        {isLoadingCategories ? (
                          <MegaMenuSkeleton />
                        ) : (
                          <div className="grid grid-cols-4 gap-8">
                            {Object.entries(megaMenuData).map(
                              ([category, data]) => (
                                <motion.div
                                  key={category}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 }}
                                  className="space-y-4"
                                >
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {data.title}
                                  </h3>
                                  <ul className="space-y-2">
                                    {data.items.length > 0 ? (
                                      data.items.map((item, index) => (
                                        <motion.li
                                          key={item.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                          }}
                                        >
                                          <Link
                                            to={`/filter/${data.slug}/${item.slug}/${item.id}`}
                                            className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                          >
                                            {item.name}
                                          </Link>
                                        </motion.li>
                                      ))
                                    ) : (
                                      <li className="text-gray-400 text-sm">
                                        No subcategories
                                      </li>
                                    )}
                                  </ul>
                                </motion.div>
                              )
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>




                {/* Dynamic category navigation */}
                {categories.map((category) => (
                  <div key={category.id} variants={itemVariants}>
                    <Link
                      to={`/${category.slug}`}
                      className="text-gray-700 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 ml-6 cursor-pointer border border-gray-300 rounded-full px-3 py-1.5 relative"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                  <LocationOnIcon className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700 max-w-[160px] ellipse  line-clamp-2 break-words">
                    {selectedLocation}
                  </span>
                  <motion.div
                    animate={{ rotate: isLocationOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <KeyboardArrowDownIcon className="w-5 h-5 text-gray-700" />
                  </motion.div>
                </motion.div>
              </motion.nav>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isLocationOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className={`${
                isLoading ? "" : "cursor-pointer"
              } fixed inset-0 bg-black z-999`}
              // ref={locationDropdownRef}
            />
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                x: shake ? [0, -10, 10, -10, 10, 0] : 0, // 👈 shake effect
                boxShadow: shake
                  ? "0 0 20px rgba(239,68,68,0.7)" // red glow during shake
                  : "0 0 0 rgba(0,0,0,0)", // fade out smoothly
                borderColor: shake ? "rgb(239,68,68)" : "transparent", // red border
              }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                x: { duration: 0.4 }, // faster shake
                boxShadow: { duration: 0.8, ease: "easeOut" }, // smooth glow fade
                borderColor: { duration: 0.8, ease: "easeOut" },
              }}
              className="z-1000 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px] bg-white rounded-lg shadow-lg "
            >
              <div
                ref={locationDropdownRef}
                className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar"
              >
                {/* Google Autocomplete */}
                <div className="mb-3">
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
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for area, street name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </Autocomplete>
                </div>

                {/* <AddressAutocomplete /> */}

                {/* Use Current Location */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer mb-3 border-b border-gray-200 pb-3"
                  onClick={handleCurrentLocation}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <GpsFixedIcon className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="text-blue-500 font-medium">
                    {isLoading ? "Getting location..." : "Use Current Location"}
                  </span>
                </motion.div>

                {/* Recent Locations */}
                {recentLocations.length > 0 && (
                  <div className="mb-3 border-b border-gray-200 pb-3">
                    <h3 className="text-sm text-gray-500 mb-2">
                      Recent Locations
                    </h3>
                    {recentLocations.map((location, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() =>
                          handleLocationSelect({
                            address: location,
                          })
                        }
                      >
                        <LocationOnIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{location}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Popular Locations */}
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">
                    Popular Locations
                  </h3>
                  {popularLocations.map((location, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() =>
                        handleLocationSelect({ address: location })
                      }
                    >
                      <LocationOnIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{location}</span>
                    </motion.div>
                  ))}
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
           setForgotPhone={setForgotPhone}
        />
      )}

      {otpVerificationModal && (
        <OTPVerificationModal
          setOtpVerificationModal={setOtpVerificationModal}
          setForgotPasswordModal={setForgotPasswordModal}
          setPasswordResetModel={setPasswordResetModel}
           phone={forgotPhone} 
        />
      )}

      {passwordResetModel && (
        <PasswordResetModel
           setPasswordResetModel={setPasswordResetModel}
    setLoginFormModel={setLoginFormModel}
    phone={forgotPhone} // phone saved from ForgotPassword
        />
      )}
    </>
  );
};

export default Header;
