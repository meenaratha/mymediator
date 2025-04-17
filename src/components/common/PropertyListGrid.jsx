import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import { red } from "@mui/material/colors";
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
        {/* <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
          {property.label}
        </div> */}
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg">{property.name}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          {/* Location icon */}
          <LocationOnIcon sx={{ color: red[500] }} />
          <span>{property.location}</span>
        </div>

        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            {/* Bed icon */}
            <SquareFootIcon />
            <span className="ml-1 text-sm">{property.size} </span>
          </div>

          <div className="flex items-center">
            {/* Bath icon */}
            <BedIcon />

            <span className="ml-1 text-sm">{property.room} </span>
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
      image: IMAGES.property1,
      location: "West Mambalam, Chennai",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "65",
      label: "Featured",
    },
    {
      id: 2,
      name: "Soujaiy House",
      image: IMAGES.property2,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      bathrooms: 1,
      price: "53",
      label: "Featured",
    },
    {
      id: 3,
      name: "Xandite House",
      image: IMAGES.property3,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "59",
      label: "Featured",
    },
    {
      id: 4,
      name: "Kaltet House",
      image: IMAGES.property4,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "69",
      label: "Featured",
    },
    {
      id: 5,
      name: "KanetXo House",
      image: IMAGES.property5,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "62",
      label: "Featured",
    },
    {
      id: 6,
      name: "Gloselt House",
      image: IMAGES.property6,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "66",
      label: "Featured",
    },
    {
      id: 7,
      name: "Minzal House",
      image: IMAGES.property7,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "56",
      label: "Featured",
    },
    {
      id: 8,
      name: "Soujaiy House",
      image: IMAGES.property4,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "52",
      label: "Featured",
    },
    {
      id: 9,
      name: "Martela House",
      image: IMAGES.property5,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "61",
      label: "Featured",
    },
    {
      id: 10,
      name: "Minsod House",
      image: IMAGES.property6,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "65",
      label: "Featured",
    },
    {
      id: 11,
      name: "Soujaiy House",
      image: IMAGES.property2,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
      price: "53",
      label: "Featured",
    },
    {
      id: 12,
      name: "Xandite House",
      image: IMAGES.property3,
      location: "West Mambalam, Chennai",
      size: "800 Sq . Ft",
      year: 2022,
      bedrooms: 2,
      room: "3 BHK ",
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
