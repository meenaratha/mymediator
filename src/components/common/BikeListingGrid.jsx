import React from "react";
import { Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";

const BikeCard = ({ item }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <Card
      className={`${
        isMobile ? "max-w-[300px]" : ""
      } max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto`}
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.productname}
          className="w-full h-36 object-cover"
        />
      </div>

      <CardContent className="p-3">
        <h3 className="font-bold text-lg">{item.productname}</h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500] }} />
          <span>{item.location}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {item.year} - {item.distance}
          </span>
          <span className="font-bold text-lg">₹ {item.price}L</span>
        </div>
      </CardContent>
    </Card>
  );
};

const BikeListingGrid = () => {
  const bikes = [
    {
      id: 1,
      productname: "Royal Enfield Classic 350",
      image: IMAGES.bike1,
      location: "West Mambalam, Chennai",
      year: 2022,
      distance: "5,000 km",
      price: "1.85",
    },
    {
      id: 2,
      productname: "Bajaj Pulsar NS200",
      image: IMAGES.bike2,
      location: "Adyar, Chennai",
      year: 2023,
      distance: "2,000 km",
      price: "1.25",
    },
    {
      id: 3,
      productname: "KTM Duke 200",
      image: IMAGES.bike3,
      location: "T Nagar, Chennai",
      year: 2021,
      distance: "12,000 km",
      price: "1.55",
    },
    {
      id: 4,
      productname: "Honda CB Hornet 160R",
      image: IMAGES.bike4,
      location: "Anna Nagar, Chennai",
      year: 2023,
      distance: "1,500 km",
      price: "0.95",
    },
    {
      id: 5,
      productname: "Yamaha FZ S V3",
      image: IMAGES.bike5,
      location: "Velachery, Chennai",
      year: 2022,
      distance: "7,000 km",
      price: "0.85",
    },
    {
      id: 6,
      productname: "TVS Apache RTR 160",
      image: IMAGES.bike6,
      location: "Porur, Chennai",
      year: 2022,
      distance: "8,500 km",
      price: "0.75",
    },
    {
      id: 7,
      productname: "Suzuki Gixxer SF",
      image: IMAGES.bike7,
      location: "Nungambakkam, Chennai",
      year: 2023,
      distance: "3,000 km",
      price: "1.15",
    },
    {
      id: 8,
      productname: "Hero Splendor Plus",
      image: IMAGES.bike8,
      location: "Mylapore, Chennai",
      year: 2022,
      distance: "6,000 km",
      price: "0.65",
    },
    {
      id: 9,
      productname: "Royal Enfield Bullet 350",
      image: IMAGES.bike9,
      location: "Kodambakkam, Chennai",
      year: 2023,
      distance: "4,500 km",
      price: "1.75",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {bikes.map((item) => (
          <BikeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BikeListingGrid;
