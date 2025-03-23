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
import { useState, useEffect } from "react";
import MobileHeader from "./MobileHeader";
import Footer from "./Footer";
import OTPVerificationModal from "./OTPVerificationModal";

const megaMenuData = {
  Property: {
    title: "Property",
    items: [
      "For Sale: Houses & Apartments",
      "For Rent: Houses & Apartments",
      "Lands & Plots",
      "For Rent: Shops & Offices",
      "For Sale: Shops & Offices",
    ],
  },
  Electronics: {
    title: "Electronics",
    items: [
      "TVs",
      "Kitchen & Other Appliances",
      "Computers & Laptops",
      "Fridges",
      "ACs",
      "Washing Machines",
    ],
  },
  Bike: {
    title: "Bike",
    items: ["Motorcycles", "Scooters", "Spare Parts", "Bicycles"],
  },
  Car: {
    title: "Car",
    items: ["Cars", "Commercial Vehicles", "Spare Parts", "Other Vehicles"],
  },
};

const Header = () => {
  const navigate = useNavigate();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    "Chennai, Tamil Nadu"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationShaking, setIsNotificationShaking] = useState(true);
  const [isFixed, setIsFixed] = useState(false);

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

  const categories = ["Property", "Car", "Electronics", "Bike"];

  const locations = {
    recentLocation: [
      { title: "Use Current location", icon: "location_on" },
      { title: "Tamil Nadu", icon: "location_on" },
    ],
    popularLocation: ["Chennai, Tamil Nadu", "Ambattur"],
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
  };

  const handleCurrentLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const location =
              data.address.city || data.address.town || data.address.state;
            setSelectedLocation(location + ", " + data.address.state);
            setIsLoading(false);
            setIsLocationOpen(false);
          } catch (error) {
            console.error("Error fetching location:", error);
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % categories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
    navigate("/sell");
  };

  const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);

  const handleLoginClick = () => {
    setIsLoginPopupVisible(true);
  };

  const handleLoginClose = () => {
    setIsLoginPopupVisible(false);
  };

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
              <img src={Logo} alt="" className="relative z-[99] h-[140px]" />
            </div>
            <div className="w-[100%]  h-[70px] flex items-center gap-5 px-3 justify-between">
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
                              {categories[placeholderIndex]}...
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
                    className="w-full text-sm text-gray-700 focus:outline-none bg-transparent search-input"
                  />
                </div>
              </motion.div>

              {/* notification box */}
              <div className="flex gap-10 items-center">
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
                    badgeContent={2}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "rgba(24, 166, 11, 1)",
                        color: "white",
                      },
                    }}
                  >
                    <NotificationsIcon style={{ color: "black" }} />
                  </Badge>
                </motion.div>
                {/* login button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="mymediator__sell_button "
                  onClick={handleLoginClick}
                  style={{ width: "100%" }}
                >
                  Login / Sign up
                </motion.button>

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

                <Avatar
                  sx={{ bgcolor: deepPurple[500] }}
                  alt="Remy Sharp"
                  src={Profile}
                />
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
                                  {data.items.map((item, index) => (
                                    <motion.li
                                      key={item}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                      }}
                                    >
                                      <Link
                                        to={`/${category.toLowerCase()}/${item
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}`}
                                        className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                      >
                                        {item}
                                      </Link>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    to="/property"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Property
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    to="/electronics"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Electronics
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/car" className="text-gray-700 hover:text-blue-600">
                    Car
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    to="/bike"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Bike
                  </Link>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 ml-6 cursor-pointer border border-gray-300 rounded-full px-3 py-1.5 relative"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                  <LocationOnIcon className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">{selectedLocation}</span>
                  <motion.div
                    animate={{ rotate: isLocationOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <KeyboardArrowDownIcon className="w-5 h-5 text-gray-700" />
                  </motion.div>

                  <AnimatePresence>
                    {isLocationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg z-50"
                      >
                        <div className="p-3 max-h-[400px] overflow-y-auto custom-scrollbar">
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
                              {isLoading
                                ? "Getting location..."
                                : "Use Current Location"}
                            </span>
                          </motion.div>

                          {/* Recent Location */}
                          <div className="mb-3 border-b border-gray-200 pb-3">
                            <h3 className="text-sm text-gray-500 mb-2">
                              Recent Location
                            </h3>
                            {locations.recentLocation.map((item, index) => (
                              <motion.div
                                key={item.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.05,
                                }}
                                className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer"
                                onClick={() => handleLocationSelect(item.title)}
                              >
                                <LocationOnIcon className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">
                                  {item.title}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Popular Location */}
                          <div>
                            <h3 className="text-sm text-gray-500 mb-2">
                              Popular Location
                            </h3>
                            {locations.popularLocation.map(
                              (location, index) => (
                                <motion.div
                                  key={location}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: (index + 2) * 0.05,
                                  }}
                                  className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer"
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  <LocationOnIcon className="w-5 h-5 text-gray-600" />
                                  <span className="text-gray-700">
                                    {location}
                                  </span>
                                </motion.div>
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.nav>
            </div>
          </div>
        </div>
      </section>

      {/* login popup */}
      {isLoginPopupVisible && (
        <OTPVerificationModal onClose={handleLoginClose} />
      )}
    </>
  );
};

export default Header;
