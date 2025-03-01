import { Card, CardContent } from "@mui/material";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices

const PropertyCard = ({ property }) => {
  // Detect mobile devices
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <Card
      className={`${
        isMobile ? " max-w-[300px]" : ""
      }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto`}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-36 object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
          {property.label}
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg">{property.name}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          {/* Location icon */}
          <svg className="h-4 w-4 text-gray-500 mr-1" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            />
          </svg>
          <span>{property.size}</span>
        </div>

        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            {/* Bed icon */}
            <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h2v-3h18v3h2V9c0-2.21-1.79-4-4-4z"
              />
            </svg>
            <span className="ml-1 text-sm">{property.bedrooms} beds</span>
          </div>

          <div className="flex items-center">
            {/* Bath icon */}
            <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 7c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.21-1.79-4-4-4S5 4.79 5 7h2zm5 10H2v-2h10v2zm-1-4H4c-1.1 0-2-.9-2-2h14c0 1.1-.9 2-2 2h-3zM17 7h-2c0-1.1-.9-2-2-2s-2 .9-2 2H9c0-2.21 1.79-4 4-4s4 1.79 4 4z"
              />
            </svg>
            <span className="ml-1 text-sm">{property.bathrooms} bath</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">{property.year}</span>
          <span className="font-bold text-lg">₹ {property.price}L</span>
        </div>
      </CardContent>
    </Card>
  );
};

const PropertyListingGrid = () => {
  const properties = [
    {
      id: 1,
      name: "Minsod House",
      image: IMAGES.mac1,
      size: "25 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "65",
      label: "Featured",
    },
    {
      id: 2,
      name: "Soujaiy House",
      image: IMAGES.mac2,
      size: "24 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "53",
      label: "Featured",
    },
    {
      id: 3,
      name: "Xandite House",
      image: IMAGES.mac3,
      size: "26 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "59",
      label: "Featured",
    },
    {
      id: 4,
      name: "Kaltet House",
      image: IMAGES.mac4,
      size: "25 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "69",
      label: "Featured",
    },
    {
      id: 5,
      name: "KanetXo House",
      image: IMAGES.mac5,
      size: "28 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "62",
      label: "Featured",
    },
    {
      id: 6,
      name: "Gloselt House",
      image: IMAGES.mac6,
      size: "24 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "66",
      label: "Featured",
    },
    {
      id: 7,
      name: "Minzal House",
      image: IMAGES.mac7,
      size: "26 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "56",
      label: "Featured",
    },
    {
      id: 8,
      name: "Soujaiy House",
      image: IMAGES.mac8,
      size: "25 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "52",
      label: "Featured",
    },
    {
      id: 9,
      name: "Martela House",
      image: "/api/placeholder/235/150",
      size: "27 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "61",
      label: "Featured",
    },
    {
      id: 10,
      name: "Minsod House",
      image: "/api/placeholder/235/150",
      size: "25 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "65",
      label: "Featured",
    },
    {
      id: 11,
      name: "Soujaiy House",
      image: "/api/placeholder/235/150",
      size: "24 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "53",
      label: "Featured",
    },
    {
      id: 12,
      name: "Xandite House",
      image: "/api/placeholder/235/150",
      size: "26 sqm",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "59",
      label: "Featured",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyListingGrid;
