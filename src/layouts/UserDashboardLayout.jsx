import { Outlet, Link, useLocation } from "react-router-dom";
import { Header, Footer, HeroSection,AccountDeleteModel } from "@/components";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaListAlt,
  FaHistory,
  FaClipboardList,
  FaFileContract,
  FaShieldAlt,
  FaTrash,
  FaBars,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

const UserDashboardLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaUser className="w-5 h-5" />,
      title: "My details",
      path: "#",
    },
    {
      icon: <FaListAlt className="w-5 h-5" />,
      title: "Enquiry list",
      path: "/seller-enquiry-list",
    },
    {
      icon: <FaHistory className="w-5 h-5" />,
      title: "Subscription History",
      path: "/seller-subscription-history-plan",
    },
    {
      icon: <FaClipboardList className="w-5 h-5" />,
      title: "My Post details",
      path: "/seller-post-details",
    },
    {
      icon: <FaFileContract className="w-5 h-5" />,
      title: "Terms and Conditions",
      path: "/terms-and-conditions",
    },
    {
      icon: <FaShieldAlt className="w-5 h-5" />,
      title: "Privacy policy",
      path: "/privacy-policy",
    },
    // {
    //   icon: <FaTrash className="w-5 h-5" />,
    //   title: "Delete Account",
    //   path: "/delete-account",
    // },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebarOnMobile = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

const [accountDelete, setAccountDelete] = useState(false);

  const handleDeleteAccount = () => {
    setAccountDelete(true);
  };
  return (
    <>
      {/* Header with fixed height */}
      <Header />
      {!isMobile && <HeroSection tittle="Dinesh Kumar" />}

      <div className="flex flex-col min-h-screen max-w-[1200px] mx-auto">
        <div className="flex flex-1">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={closeSidebarOnMobile}
            ></div>
          )}

          {/* Sidebar - styled to match the image */}
          <aside
            className={`fixed inset-y-0 left-0  w-72 transform  
          transition-transform duration-300 ease-in-out top-[-100px] md:mt-[10px] md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isMobile ? "z-1000 top-[80px] bg-[#fff] " : "z-100"}`}
          >
            {isMobile && (
              <button
                className="absolute top-[20px] right-[10px] bg-white rounded-full p-1"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes className="text-black w-5 h-5 " />
              </button>
            )}

            {/* User Profile */}
            <div className="bg-navy-900 text-white p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={IMAGES.userImg}
                    alt="User Profile"
                    className="w-[90px] h-[90px] rounded-full border-4 border-white"
                  />
                  <button className="absolute top-0 right-0 bg-white rounded-full p-1">
                    <FaEdit className="text-black w-4 h-4" />
                  </button>
                </div>
                {/* <h2 className="mt-4 text-xl font-semibold">Dinesh Kumar</h2> */}
              </div>
            </div>

            {/* Navigation - styled to match the image */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "bg-[#0b1645] text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#0b1645]"
                      }`}
                      onClick={closeSidebarOnMobile}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
                <li><Link to="#"
                className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
                       accountDelete == true
                          ? "bg-[#0b1645] text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#0b1645]"
                      }`}
                  onClick={handleDeleteAccount}> <span className="mr-3"><FaTrash className="w-5 h-5" /></span>
                      <span className="font-medium">Delete Account</span></Link></li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Header */}
            <header
              className="h-[96px] w-[100%] relative  shadow-sm z-10 md:hidden h-16 bg-cover bg-center"
              style={{
                backgroundImage: `url(${IMAGES.heroBanner})`, // Replace with your image path
              }}
            >
              {/* Background Overlay */}
              <div className="absolute inset-0 bg-[#00000052] bg-opacity-50"></div>
              <div className="px-4 h-full flex items-center justify-between relative z-10">
                {/* <button
                className="p-2 rounded-md text-[#fff] hover:bg-[#fff] focus:outline-none"
                onClick={toggleSidebar}
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button> */}
                <motion.button
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(255, 255, 255, 0.7)",
                      "0 0 0 4px rgba(255, 255, 255, 0.7)",
                      "0 0 0 0 rgba(255, 255, 255, 0.7)",
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="w-15 h-15 rounded-full   text-[#fff] hover:bg-[#fff] focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <img
                    src={IMAGES.userImg}
                    alt="User Profile"
                    className="w-15 h-15 rounded-full"
                  />
                </motion.button>
                <div className="text-xl font-semibold text-[#fff]">
                  Dinesh Kumar
                </div>
                <div className="w-10"></div> {/* Spacer for alignment */}
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-4   border-l-2 border-l-solid border-l-gray-300">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <Footer />
      {accountDelete && <AccountDeleteModel onClose={() => setAccountDelete(false)} />}
    </>
  );
};

export default UserDashboardLayout;
