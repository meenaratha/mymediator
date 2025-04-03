import React from "react";
import { Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";

const ElectronicsCard = ({ item }) => {
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
          <span className="text-sm text-gray-500">{item.year}</span>
          <span className="font-bold text-lg">₹ {item.price}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ElectronicsListingGrid = () => {
  const electronics = [
    {
      id: 1,
      productname: "HP C17 Laptop",
      image: IMAGES.mac1,
      location: "West Mambalam, Chennai",
      year: 2022,
      price: "45,000",
    },
    {
      id: 2,
      productname: "Dell Inspiron 15",
      image: IMAGES.mac3,
      location: "Adyar, Chennai",
      year: 2023,
      price: "52,000",
    },
    {
      id: 3,
      productname: "MacBook Air M1",
      image: IMAGES.mac4,
      location: "T Nagar, Chennai",
      year: 2022,
      price: "78,000",
    },
    {
      id: 4,
      productname: 'Samsung 55" Smart TV',
      image: IMAGES.mac5,
      location: "Anna Nagar, Chennai",
      year: 2023,
      price: "49,999",
    },
    {
      id: 5,
      productname: "LG Refrigerator",
      image: IMAGES.mac6,
      location: "Velachery, Chennai",
      year: 2021,
      price: "35,000",
    },
    {
      id: 6,
      productname: "Bosch Washing Machine",
      image: IMAGES.mac7,
      location: "Porur, Chennai",
      year: 2022,
      price: "28,500",
    },
    {
      id: 7,
      productname: "Sony PlayStation 5",
      image: IMAGES.mac8,
      location: "Nungambakkam, Chennai",
      year: 2023,
      price: "42,990",
    },
    {
      id: 8,
      productname: "iPhone 13 Pro",
      image: IMAGES.mac9,
      location: "Mylapore, Chennai",
      year: 2022,
      price: "89,900",
    },
    {
      id: 9,
      productname: "Lenovo ThinkPad",
      image: IMAGES.mac10,
      location: "Kodambakkam, Chennai",
      year: 2023,
      price: "65,000",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {electronics.map((item) => (
          <ElectronicsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ElectronicsListingGrid;
