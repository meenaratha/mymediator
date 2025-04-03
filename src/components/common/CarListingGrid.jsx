import React from "react";
import { Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { red } from "@mui/material/colors";
import IMAGES from "@/utils/images.js";
import { useMediaQuery } from "react-responsive";

const CarCard = ({ item }) => {
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

const CarListingGrid = () => {
  const cars = [
    {
      id: 1,
      productname: "Maruti Suzuki Swift",
      image: IMAGES.car1,
      location: "West Mambalam, Chennai",
      year: 2022,
      distance: "25,000 km",
      price: "5.85",
    },
    {
      id: 2,
      productname: "Hyundai Creta",
      image: IMAGES.car2,
      location: "Adyar, Chennai",
      year: 2023,
      distance: "12,000 km",
      price: "12.5",
    },
    {
      id: 3,
      productname: "Toyota Innova",
      image: IMAGES.car3,
      location: "T Nagar, Chennai",
      year: 2021,
      distance: "42,000 km",
      price: "15.75",
    },
    {
      id: 4,
      productname: "Honda City",
      image: IMAGES.car4,
      location: "Anna Nagar, Chennai",
      year: 2023,
      distance: "8,000 km",
      price: "9.65",
    },
    {
      id: 5,
      productname: "Mahindra XUV700",
      image: IMAGES.car5,
      location: "Velachery, Chennai",
      year: 2022,
      distance: "32,000 km",
      price: "18.2",
    },
    {
      id: 6,
      productname: "Tata Nexon",
      image: IMAGES.car6,
      location: "Porur, Chennai",
      year: 2022,
      distance: "28,500 km",
      price: "8.25",
    },
    {
      id: 7,
      productname: "Kia Seltos",
      image: IMAGES.car7,
      location: "Nungambakkam, Chennai",
      year: 2023,
      distance: "15,000 km",
      price: "14.5",
    },
    {
      id: 8,
      productname: "Maruti Suzuki Baleno",
      image: IMAGES.car8,
      location: "Mylapore, Chennai",
      year: 2022,
      distance: "20,000 km",
      price: "7.2",
    },
    {
      id: 9,
      productname: "Hyundai i20",
      image: IMAGES.car1,
      location: "Kodambakkam, Chennai",
      year: 2023,
      distance: "7,500 km",
      price: "6.8",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 justify-items-center">
        {cars.map((item) => (
          <CarCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CarListingGrid;
