import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function MegaMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo and Search */}
            <div className="flex items-center space-x-4">
              <img src="logo-url" alt="Logo" className="w-12 h-12" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="What is in your mind?"
                  className="border rounded-full px-4 py-2 w-64"
                />
              </div>
            </div>

            {/* Right Actions (Location, Profile, Sell Button) */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <button className="text-gray-600 text-sm flex items-center">
                  <span className="material-icons">location_on</span>
                  Chennai, Tamil Nadu
                </button>
              </div>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-full">
                Sell
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-300">
                {/* Profile Avatar */}
              </div>
            </div>
          </div>

          {/* Categories and Megamenu */}
          <div className="border-t py-4 relative">
            <div className="flex items-center space-x-8">
              {/* All Categories with Dropdown */}
              <div>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="font-semibold text-gray-800 hover:text-blue-600"
                >
                  All Categories
                </button>
              </div>

              {/* Other Main Categories */}
              <div className="flex space-x-6 text-gray-700">
                <button className="hover:text-blue-600">Property</button>
                <button className="hover:text-blue-600">Electronics</button>
                <button className="hover:text-blue-600">Car</button>
                <button className="hover:text-blue-600">Bike</button>
              </div>
            </div>

            {/* Mega Menu Dropdown */}
            {menuOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg z-50 p-6 rounded-lg max-w-md w-full">
                <div className="grid grid-cols-2 gap-4">
                  {/* Property Section */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-gray-900">
                      Property
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>For Sale: Houses & Apartments</li>
                      <li>For Rent: Houses & Apartments</li>
                      <li>Lands & Plots</li>
                      <li>For Rent: Shops & Offices</li>
                    </ul>
                  </div>

                  {/* Electronics Section */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-gray-900">
                      Electronics
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>TVs</li>
                      <li>Kitchen & Other Appliances</li>
                      <li>Computers & Laptops</li>
                      <li>Fridges</li>
                    </ul>
                  </div>

                  {/* Bike Section */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-gray-900">
                      Bike
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>Motorcycles</li>
                      <li>Scooters</li>
                      <li>Spare Parts</li>
                      <li>Bicycles</li>
                    </ul>
                  </div>

                  {/* Car Section */}
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-gray-900">
                      Car
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>Cars</li>
                      <li>Scooters</li>
                      <li>Spare Parts</li>
                      <li>Bicycles</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-xs bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Property Image */}
        <img
          src="https://placehold.co/400" // Dummy image
          alt="Property"
          className="w-full h-48 object-cover"
        />

        {/* Property Details */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900">Dinesh House</h3>

          <p className="text-sm text-gray-700 mt-1">(3 BHK)</p>

          {/* Location Section */}
          <div className="flex items-center space-x-2 mt-2 text-gray-700">
            <LocationOnIcon className="text-red-500" />
            <p className="text-sm">West Mambalam</p>
          </div>

          {/* Property Info Section */}
          <div className="flex justify-between items-center mt-3 text-gray-900">
            {/* Square Footage */}
            <div className="flex items-center space-x-1 text-sm">
              <CropSquareIcon />
              <p>800 Sq. Ft</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-1 text-sm font-semibold">
              <AttachMoneyIcon />
              <p>6.9 L</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MegaMenu;
