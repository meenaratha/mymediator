import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaUser, FaListAlt, FaHistory, FaClipboardList, FaFileContract, FaShieldAlt, FaTrash, FaBars, FaTimes } from 'react-icons/fa';


const SellerSidebarMenus = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <FaUser className="w-5 h-5" />, title: "My details", path: "/my-details" },
    { icon: <FaListAlt className="w-5 h-5" />, title: "Enquiry list", path: "/seller-enquiry-list" },
    { icon: <FaHistory className="w-5 h-5" />, title: "Subscription History", path: "/subscription-history" },
    { icon: <FaClipboardList className="w-5 h-5" />, title: "My Post details", path: "/my-post-details" },
    { icon: <FaFileContract className="w-5 h-5" />, title: "Terms and Conditions", path: "/terms" },
    { icon: <FaShieldAlt className="w-5 h-5" />, title: "Privacy policy", path: "/privacy-policy" },
    { icon: <FaTrash className="w-5 h-5" />, title: "Delete Account", path: "/delete-account" },
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

  
  return (
    <>SellerSidebarMenus</>
  )
}

export default SellerSidebarMenus