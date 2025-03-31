import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";

const SellerElectronicsTabContent = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Customer inquiry data
  const customerDetails = {
    name: "Kesavan kumar",
    mobileNumber: "9654853214",
    email: "Kesavankumar.03@gmail.com",
    whatsappNumber: "9654853214",
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
  };

  // Initial properties with expanded state
  const initialProperties = [
    {
      id: 1,
      title: "Raju House",
      location: "Anna Nagar chennai puraisvakkam",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: true,
    },
    {
      id: 2,
      title: "Dinesh House",
      location: "Anna Nagar",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: false,
    },
    {
      id: 3,
      title: "Mani House",
      location: "Anna Nagar",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: false,
    },
    {
      id: 4,
      title: "Dinesh House",
      location: "Anna Nagar",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: false,
    },
    {
      id: 5,
      title: "Dinesh House",
      location: "Anna Nagar",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: false,
    },
    {
      id: 6,
      title: "Mani House",
      location: "Anna Nagar",
      type: "Individual",
      bhk: "2BHK",
      sqft: 800,
      price: 10000,
      expanded: false,
    },
  ];

  // State for property cards with expanded state
  const [properties, setProperties] = useState(initialProperties);

  // Toggle expanded state for a property
  const toggleExpand = (id) => {
    setProperties(
      properties.map((property) =>
        property.id === id
          ? { ...property, expanded: !property.expanded }
          : property
      )
    );
  };

  // First, update your handleDelete function
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter((property) => property.id !== id));
    }
  };

  return (
    <>
      <div className="mymediator-seller-tab-content">
        {/* Action Buttons - Centered */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button className="bg-[#0b1645] text-white py-2 px-4 rounded-md font-medium">
            Post enquiry
          </button>
          <button className="bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 font-medium">
            Property enquiry
          </button>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1  gap-4 px-2">
          {properties.map((property) => (
            <div key={property.id} className="rounded-lg  overflow-hidden ">
              <div
                className="p-3 bg-white rounded-lg cursor-pointer "
                style={{
                  boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                  border: "1px solid #D7D7D7",
                }}
                onClick={() => toggleExpand(property.id)}
              >
                <div className="flex">
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={IMAGES.propertydetails}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between pb-[10px]">
                      <h3
                        className="font-bold w-1/2"
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={property.title}
                      >
                        {property.title}
                      </h3>
                      <div
                        className="flex items-center  justify-end  overflow-hidden w-1/2"
                        style={{
                          maxWidth: isMobile ? "100px" : "150px",
                          minWidth: isMobile ? "90px" : "100px",
                          width: "100%",
                        }}
                        title={property.location}
                      >
                        <LocationOnIcon
                          style={{ fontSize: 16 }}
                          className="mr-1 text-red-500"
                        />
                        <span className="text-sm truncate">
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm mt-1 flex items-center flex-wrap">
                      <span className="mr-2">{property.type}</span>
                      <span className="border border-gray-300 rounded px-1 mr-2">
                        {property.bhk}
                      </span>
                      <span className="flex items-center">
                        <AspectRatioIcon
                          style={{ fontSize: 16 }}
                          className="mr-1"
                        />
                        {property.sqft} Sq. Ft
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pb-[10px]">
                      <div className="font-bold">
                        ₹ {property.price.toLocaleString()}
                      </div>
                      <button
                        className=" text-sm flex items-center cursor-pointer"
                        onClick={() => toggleExpand(property.id)}
                      >
                        View more
                        {property.expanded ? (
                          <KeyboardArrowUpIcon
                            style={{ fontSize: 22 }}
                            className="ml-1 text-red-500  font-bold "
                          />
                        ) : (
                          <KeyboardArrowDownIcon
                            style={{ fontSize: 22 }}
                            className="ml-1 text-red-500  font-bold"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Box (conditionally rendered based on expanded state) */}
              {property.expanded && (
                <div
                  className="mt-1 border-t border-gray-200 p-4 bg-gray-50 rounded-lg  "
                  style={{
                    boxShadow: "0px 0.96px 3.83px 0px #A9A9A940",
                    border: "1px solid #D7D7D7",
                  }}
                >
                  <div className="">
                    <div className="flex">
                      <div className=" text-sm pb-[15px]">
                        <strong>Name :</strong> &nbsp; {customerDetails.name}
                      </div>

                      <button className="text-blue-500 ml-auto cursor-pointer">
                        <DeleteIcon
                          style={{ fontSize: 20 }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card expansion toggle
                            handleDelete(property.id);
                          }}
                        />
                      </button>
                    </div>

                    <div className="  text-sm pb-[15px]">
                      <strong>Mobile number :</strong> &nbsp;
                      {customerDetails.mobileNumber}
                    </div>

                    <div className="  text-sm pb-[15px]">
                      <strong>E-mail Id :</strong> &nbsp;
                      {customerDetails.email}
                    </div>

                    <div className="pb-[15px] text-sm">
                      <strong> Whatsapp number :</strong>&nbsp;{" "}
                      {customerDetails.whatsappNumber}
                    </div>

                    <div className=" text-sm align-top overflow-hidden line-clamp-4 ">
                      <strong> Message :</strong> &nbsp;{" "}
                      {customerDetails.message}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SellerElectronicsTabContent;
