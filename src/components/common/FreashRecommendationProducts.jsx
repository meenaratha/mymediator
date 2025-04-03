import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance.js";
import IMAGES from "../../utils/images";
import { Navigate, useNavigate } from "react-router-dom";
const PropertyCard = ({ item, category }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const handlePropertyClick = () => {
    navigate("/property-details");
  };
  const handleBikeClick = () => {
    navigate("/bike-details");
  };
  return (
    <>
      {category === "properties" && (
        <Card
          className={`${
            isMobile ? " max-w-[300px]" : ""
          }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer`}
          onClick={handlePropertyClick}
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

            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <SquareFootIcon />
                <span className="ml-1 text-sm">{item.size}</span>
              </div>

              <div className="flex items-center">
                <BedIcon />
                <span className="ml-1 text-sm">{item.room}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-500">{item.year}</span>
              <span className="font-bold text-lg">₹ {item.price}L</span>
            </div>
          </CardContent>
        </Card>
      )}

      {category === "electronics" && (
        <Card
          className={`${
            isMobile ? " max-w-[300px]" : ""
          }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto`}
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
              <span className="font-bold text-lg">₹ {item.price}L</span>
            </div>
          </CardContent>
        </Card>
      )}

      {category === "cars" && (
        <Card
          className={`${
            isMobile ? " max-w-[300px]" : ""
          }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto`}
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
      )}
      {category === "bikes" && (
        <Card
          className={`${
            isMobile ? " max-w-[300px]" : ""
          }  max-w-[275px]  w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto`}
          onClick={handleBikeClick}
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
      )}
    </>
  );
};

const FreashRecommendationProducts = () => {
  //    const [cardData, setCardData] = useState({
  //     properties: [],
  //     electronics: [],
  //     cars: [],
  //   });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //   const fetchDatas = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axiosInstance.get("/productcarddata.json");
  //       const newDatas = response.data || {
  //         properties: [],
  //         electronics: [],
  //         cars: [],
  //       };
  //       setCardData(newDatas);
  //       console.log("New Data:", newDatas);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchDatas();
  //   }, [page]);

  const cardData = {
    properties: [
      {
        id: 1,
        productname: "Minsod House",
        image: IMAGES.property1,
        location: "West Mambalam, Chennai",
        year: 2022,
        size: "800 Sq . Ft",
        room: "3 BHK",
        price: "65",
        label: "Featured",
      },
      {
        id: 2,
        productname: "Green Villa",
        image: IMAGES.property2,
        location: "Anna Nagar, Chennai",
        year: 2021,
        size: "1200 Sq . Ft",
        room: "4 BHK",
        price: "85",
        label: "New",
      },
      {
        id: 3,
        productname: "Luxury Apartment",
        image: IMAGES.property3,
        location: "T Nagar, Chennai",
        year: 2023,
        size: "950 Sq . Ft",
        room: "3 BHK",
        price: "75",
        label: "Exclusive",
      },
      {
        id: 4,
        productname: "Lake View Condo",
        image: IMAGES.property4,
        location: "Besant Nagar, Chennai",
        year: 2022,
        size: "1100 Sq . Ft",
        room: "3 BHK",
        price: "70",
        label: "Premium",
      },
      {
        id: 5,
        productname: "Seaside Cottage",
        image: IMAGES.property5,
        location: "ECR, Chennai",
        year: 2021,
        size: "1500 Sq . Ft",
        room: "5 BHK",
        price: "120",
        label: "Luxury",
      },
      {
        id: 6,
        productname: "Urban Studio",
        image: IMAGES.property6,
        location: "Velachery, Chennai",
        year: 2020,
        size: "600 Sq . Ft",
        room: "2 BHK",
        price: "50",
        label: "Affordable",
      },
      {
        id: 7,
        productname: "Heritage Bungalow",
        image: IMAGES.property7,
        location: "Mylapore, Chennai",
        year: 2019,
        size: "1800 Sq . Ft",
        room: "4 BHK",
        price: "140",
        label: "Classic",
      },
      {
        id: 8,
        productname: "City Center Apartment",
        image: IMAGES.property7,
        location: "Egmore, Chennai",
        year: 2023,
        size: "900 Sq . Ft",
        room: "3 BHK",
        price: "80",
        label: "New",
      },
      {
        id: 9,
        productname: "Garden Mansion",
        image: IMAGES.property6,
        location: "Kilpauk, Chennai",
        year: 2021,
        size: "1300 Sq . Ft",
        room: "4 BHK",
        price: "95",
        label: "Exclusive",
      },
      {
        id: 10,
        productname: "Downtown Loft",
        image: IMAGES.property5,
        location: "Nungambakkam, Chennai",
        year: 2022,
        size: "700 Sq . Ft",
        room: "2 BHK",
        price: "60",
        label: "Featured",
      },
    ],
    electronics: [
      {
        id: 1,
        productname: "Smart TV",
        location: "West Mambalam, Chennai",
        image: IMAGES.mac1,
        year: "2023",
        brand: "Samsung",
        price: "500",
        label: "New",
      },
      {
        id: 2,
        productname: "Laptop",
        location: "Anna Nagar, Chennai",
        image: IMAGES.mac2,
        year: "2022",
        brand: "Dell",
        price: "800",
        label: "Featured",
      },
      {
        id: 3,
        productname: "Smartphone",
        location: "Adyar, Chennai",
        image: IMAGES.mac3,
        year: "2023",
        brand: "Apple",
        price: "1200",
        label: "Latest",
      },
      {
        id: 4,
        productname: "Home Theater",
        location: "T Nagar, Chennai",
        image: IMAGES.mac4,
        year: "2021",
        brand: "Sony",
        price: "600",
        label: "Premium",
      },
      {
        id: 5,
        productname: "Gaming Console",
        location: "Besant Nagar, Chennai",
        image: IMAGES.mac5,
        year: "2023",
        brand: "Microsoft",
        price: "450",
        label: "New",
      },
      {
        id: 6,
        productname: "Refrigerator",
        location: "Velachery, Chennai",
        image: IMAGES.mac6,
        year: "2022",
        brand: "LG",
        price: "900",
        label: "Energy Efficient",
      },
      {
        id: 7,
        productname: "Smart Watch",
        location: "Guindy, Chennai",
        image: IMAGES.mac7,
        year: "2023",
        brand: "Fitbit",
        price: "300",
        label: "Trending",
      },
    ],
    cars: [
      {
        id: 1,
        productname: "Tesla Model S",
        location: "West Mambalam, Chennai",
        image: IMAGES.car1,
        distance: "100 km",
        year: "2023",
        model: "2023",
        price: "79990",
        label: "Electric",
      },
      {
        id: 2,
        productname: "BMW X5",
        location: "West Mambalam, Chennai",
        image: IMAGES.car2,
        distance: "200 km",
        year: "2022",
        model: "2022",
        price: "70990",
        label: "Luxury",
      },
      {
        id: 3,
        productname: "Audi Q7",
        image: IMAGES.car3,
        location: "West Mambalam, Chennai",
        distance: "150 km",
        year: "2023",
        model: "2023",
        price: "65990",
        label: "New",
      },
      {
        id: 4,
        productname: "Ford Mustang",
        image: IMAGES.car4,
        location: "West Mambalam, Chennai",
        distance: "300 km",
        year: "2021",
        model: "2021",
        price: "55990",
        label: "Sport",
      },
      {
        id: 5,
        productname: "Mercedes-Benz E-Class",
        image: IMAGES.car5,
        location: "West Mambalam, Chennai",
        distance: "500 km",
        year: "2020",
        model: "2020",
        price: "50990",
        label: "Luxury",
      },
      {
        id: 6,
        productname: "Honda Civic",
        image: IMAGES.car6,
        location: "West Mambalam, Chennai",
        distance: "400 km",
        year: "2021",
        model: "2021",
        price: "30990",
        label: "Affordable",
      },
      {
        id: 7,
        productname: "Jaguar F-Type",
        image: IMAGES.car7,
        location: "West Mambalam, Chennai",
        distance: "250 km",
        year: "2023",
        model: "2023",
        price: "85990",
        label: "Premium",
      },
      {
        id: 8,
        productname: "Porsche Cayenne",
        image: IMAGES.car8,
        location: "West Mambalam, Chennai",
        distance: "600 km",
        year: "2022",
        model: "2022",
        price: "99990",
        label: "Luxury",
      },
    ],
    bikes: [
      {
        id: 1,
        productname: "Norton Commando",
        location: "West Mambalam, Chennai",
        image: IMAGES.bike1,
        distance: "500 km",
        year: "2022",
        price: "12000",
        label: "Classic",
      },
      {
        id: 2,
        productname: "Harley-Davidson Street 750",
        location: "West Mambalam, Chennai",
        image: IMAGES.bike2,
        distance: "300 km",
        year: "2021",
        price: "10000",
        label: "Cruiser",
      },
      {
        id: 3,
        productname: "Ducati Monster",
        location: "West Mambalam, Chennai",
        image: IMAGES.bike3,
        distance: "200 km",
        year: "2023",
        price: "15000",
        label: "Sport",
      },
      {
        id: 4,
        productname: "BMW R 1250 GS",
        image: IMAGES.bike4,
        location: "West Mambalam, Chennai",
        distance: "400 km",
        year: "2023",
        price: "18000",
        label: "Adventure",
      },
      {
        id: 5,
        productname: "Royal Enfield Interceptor",
        image: IMAGES.bike5,
        location: "West Mambalam, Chennai",
        distance: "100 km",
        year: "2022",
        price: "7000",
        label: "Retro",
      },
      {
        id: 6,
        productname: "Kawasaki Ninja 650",
        image: IMAGES.bike6,
        location: "West Mambalam, Chennai",
        distance: "150 km",
        year: "2021",
        price: "12000",
        label: "Sport",
      },
      {
        id: 7,
        productname: "Honda CBR 1000RR",
        image: IMAGES.bike7,
        location: "West Mambalam, Chennai",
        distance: "600 km",
        year: "2023",
        price: "16000",
        label: "Superbike",
      },
      {
        id: 8,
        productname: "Triumph Tiger 900",
        image: IMAGES.bike8,
        location: "West Mambalam, Chennai",
        distance: "250 km",
        year: "2022",
        price: "19000",
        label: "Adventure",
      },
      {
        id: 9,
        productname: "Yamaha YZF R1",
        image: IMAGES.bike9,
        location: "West Mambalam, Chennai",
        distance: "350 km",
        year: "2023",
        price: "14000",
        label: "Sport",
      },
      {
        id: 10,
        productname: "Suzuki Hayabusa",
        image: IMAGES.bike10,
        location: "West Mambalam, Chennai",
        distance: "200 km",
        year: "2023",
        price: "16000",
        label: "Superbike",
      },
    ],
  };

  const combinedData = [
    ...(cardData.properties
      ? cardData.properties.map((item) => ({ ...item, category: "properties" }))
      : []),
    ...(cardData.electronics
      ? cardData.electronics.map((item) => ({
          ...item,
          category: "electronics",
        }))
      : []),
    ...(cardData.cars
      ? cardData.cars.map((item) => ({ ...item, category: "cars" }))
      : []),
    ...(cardData.bikes
      ? cardData.bikes.map((item) => ({ ...item, category: "bikes" }))
      : []),
  ];
  console.log("combined ata", combinedData);
  return (
    <div className="container mx-auto px-4 py-10 pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {combinedData.length > 0 ? (
          combinedData.map((item) => (
            <PropertyCard
              key={`${item.category}-${item.id}`}
              item={item}
              category={item.category}
            />
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default FreashRecommendationProducts;
