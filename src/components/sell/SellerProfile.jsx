import React from 'react';
import IMAGES from "@/utils/images.js";

const SellerProfile = () => {
  // Sample property data
  const properties = [
    {
      id: 1,
      type: 'Dinesh House',
      beds: 3,
      baths: 3,
      sqft: 502,
      price: 8.91,
      image: IMAGES.property1,
    },
    {
      id: 2,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property2,
    },
    {
      id: 3,
      type: 'Dinesh House',
      beds: 3,
      baths: 3,
      sqft: 502,
      price: 8.91,
      image: IMAGES.property3,
    },
    {
      id: 4,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property3,
    },
    {
      id: 5,
      type: 'Dinesh House',
      beds: 3,
      baths: 3,
      sqft: 502,
      price: 8.91,
      image: IMAGES.property4,
    },
    {
      id: 6,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property6,
    },
    {
      id: 7,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property7,
    },
    {
      id: 8,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property1,
    },
    {
      id: 9,
      type: 'Dinesh House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 9.91,
      image: IMAGES.property1,
    },
    {
      id: 10,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 8.91,
      image: IMAGES.property1,
    },
    {
      id: 11,
      type: 'Kavin House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 8.91,
      image: IMAGES.property1,
    },
    {
      id: 12,
      type: 'Sanjay House',
      beds: 3,
      baths: 3,
      sqft: 505,
      price: 8.91,
      image: IMAGES.property1,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-gray-50">
      {/* Seller Info Section - Responsive layout with stacked buttons on mobile */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-20 h-20 overflow-hidden rounded-full">
            <img 
              src={IMAGES.profile}
              alt="Kalai" 
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-xl font-bold truncate max-w-xs">Kalai</h1>
        </div>
        
        {/* Buttons below name on mobile, side-by-side on larger screens */}
        <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto">
          <button className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
              <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            <span className="whitespace-nowrap">Enquiry</span>
          </button>
          <button className="flex items-center gap-2 bg-white text-blue-900 border border-blue-900 px-4 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
            </svg>
            <span className="whitespace-nowrap">Call</span>
          </button>
        </div>
      </div>

      {/* Property Grid - Responsive columns: 1 on mobile, 2 on medium, 3 on large, 6 on xl */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="relative h-32 overflow-hidden">
              <img 
                src={property.image} 
                alt={property.type} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full" title={property.type}>
                  {property.type}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 overflow-hidden">
                <div className="flex items-center flex-shrink-0">
                  <span className="inline-block mr-1 whitespace-nowrap">{property.beds} bhk</span>
                  <span className="mx-1 flex-shrink-0">|</span>
                </div>
                <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-water flex-shrink-0" viewBox="0 0 16 16">
                    <path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65z"/>
                  </svg>
                  <span className="ml-1 overflow-hidden text-ellipsis">{property.baths} bathrooms</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-rulers flex-shrink-0" viewBox="0 0 16 16">
                    <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1zm15 11v-1h-1v-1h-1v1h-1v1h1v1h1v-1zM6 11v1H5v1h1v1h1v-1h1v-1H7v-1z"/>
                  </svg>
                  <span className="ml-1 overflow-hidden text-ellipsis">{property.sqft} sq. ft</span>
                </div>
                <div className="flex items-center font-semibold flex-shrink-0">
                  <span className="text-sm whitespace-nowrap">₹ {property.price} L</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProfile;