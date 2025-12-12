import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import IMAGES from "@/utils/images";

const SearchItemesCard = ({ item, category: rawCategory }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  // Normalize category (also fallback to item.type for search results)
  const category = (() => {
    const c = rawCategory || item?.type;
    if (c === "electronics" || c === "electronic") return "electronics";
    return c;
  })();

  const handleClick = () => {
    switch (category) {
      case "property":
        navigate(`/properties/${item.action_slug || item.id}`);
        break;
      case "bike":
        navigate(`/bike/${item.action_slug || item.id}`);
        break;
      case "car":
        navigate(`/car/${item.action_slug || item.id}`);
        break;
      case "electronics":
        navigate(`/electronic/${item.action_slug || item.id}`);
        break;
      default:
        console.warn("Unknown category:", category);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    const numPrice = parseFloat(price);
    if (Number.isNaN(numPrice)) return "Price on request";

    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)}L`;
    } else if (numPrice >= 1000) {
      return `₹${(numPrice / 1000).toFixed(1)}K`;
    }
    return `₹${numPrice.toLocaleString()}`;
  };

  const getLocation = () => {
    const parts = [item.city, item.district, item.state].filter(Boolean);
    return parts.join(", ") || "Location not specified";
  };

  const getFallbackImage = () => {
    switch (category) {
      case "property":
        return IMAGES.property1;
      case "bike":
        return IMAGES.bike1;
      case "car":
        return IMAGES.car1;
      case "electronics":
        return IMAGES.mac1;
      default:
        return IMAGES.propertybanner1;
    }
  };

  const displayPrice = formatPrice(item.price || item.amount);

  return (
    <Card
      className={`${
        isMobile ? "max-w-[300px]" : ""
      } max-w-[275px] w-full rounded-lg shadow-md overflow-hidden hover:shadow-lg mx-auto cursor-pointer transition-shadow duration-200`}
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={item.image_url || getFallbackImage()}
          alt={item.title || item.property_name}
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.target.src = getFallbackImage();
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-blue-900 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
            {item.subcategory || category}
          </span>
        </div>
        {item.status === "sold" && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sold
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3
          className="font-bold text-lg truncate"
          title={item.title || item.property_name}
        >
          {item.title || item.property_name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <LocationOnIcon sx={{ color: red[500], fontSize: 16 }} />
          <span className="truncate ml-1">{getLocation()}</span>
        </div>

        {/* Category-specific details */}
        {category === "property" && (
          <div className="flex items-center mt-2 space-x-4">
            {item.plot_area && (
              <div className="flex items-center">
                <SquareFootIcon style={{ fontSize: 14 }} />
                <span className="ml-1 text-sm">{item.plot_area} Sq.ft</span>
              </div>
            )}
            {item.bhk && (
              <div className="flex items-center">
                <BedIcon style={{ fontSize: 14 }} />
                <span className="ml-1 text-sm">{item.bhk}</span>
              </div>
            )}
          </div>
        )}

        {(category === "bike" || category === "car") && (
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600 flex-wrap gap-2">
            {item.brand && (
              <span className="font-medium truncate max-w-[120px] overflow-hidden whitespace-nowrap">
                {item.brand}
              </span>
            )}

            {item.kilometers && (
              <div className="flex items-center">
                <SpeedIcon style={{ fontSize: 14 }} />
                <span className="ml-1">{item.kilometers}k km</span>
              </div>
            )}
          </div>
        )}

        {category === "electronics" && (
          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
            {item.brand && (
              <span className="font-medium truncate max-w-[80px] overflow-hidden whitespace-nowrap">
                {item.brand}
              </span>
            )}
            {item.subcategory && (
              <div className="flex items-center truncate max-w-[100px] overflow-hidden whitespace-nowrap">
                <DevicesIcon style={{ fontSize: 14 }} />
                <span className="ml-1 truncate">{item.subcategory}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
          {item.year && (
            <div className="flex items-center">
              <CalendarTodayIcon style={{ fontSize: 14 }} />
              <span className="ml-1">{item.year}</span>
            </div>
          )}
          <span className="font-bold text-lg">{displayPrice}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchItemesCard;
