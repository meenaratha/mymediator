import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent } from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BedIcon from "@mui/icons-material/Bed";
import DevicesIcon from "@mui/icons-material/Devices";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { red } from "@mui/material/colors";
import { useMediaQuery } from "react-responsive";
import IMAGES from "@/utils/images";
import { useNavigate as useNavForCard } from "react-router-dom";
import { api } from "../../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const useQueryParams = () => new URLSearchParams(useLocation().search);


const SearchLoadingSkeleton = ({ count = 10 }) => (
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="max-w-[275px] w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-36 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);




// Card component
const PropertyCard = ({ item, category: rawCategory }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavForCard();

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
    if (numPrice >= 10000000) return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
    if (numPrice >= 100000) return `₹${(numPrice / 100000).toFixed(1)}L`;
    if (numPrice >= 1000) return `₹${(numPrice / 1000).toFixed(1)}K`;
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

// Search page
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useQueryParams();

  const initialQuery = params.get("query") || "";
  const initialPage = Number(params.get("page") || 1);

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [listings, setListings] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Sync local state with URL when it changes externally
  useEffect(() => {
    const q = params.get("query") || "";
    const p = Number(params.get("page") || 1);
    setSearchTerm(q);
    setPage(p);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

   // ✅ Helper function
 const getLocationFromStorage = () => {
  try {
    const selectedLocationStr = localStorage.getItem("selectedLocation");
    if (!selectedLocationStr) return null;

    const selectedLocation = JSON.parse(selectedLocationStr);
    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      return null;
    }

    return {
      latitude: parseFloat(selectedLocation.latitude),
      longitude: parseFloat(selectedLocation.longitude),
    };
  } catch (error) {
    console.error("Error reading selectedLocation from localStorage:", error);
    return null;
  }
};



const fetchSearch = async (q, p) => {
  if (!q.trim()) {
    setListings([]);
    setTotal(0);
    setLastPage(1);
    return;
  }
  setLoading(true);
  try {
    const location = getLocationFromStorage();
    const params = { search: q, page: p };

    if (location) {
      params.latitude = location.latitude;
      params.longitude = location.longitude;
    }

    const res = await api.get("/search-all-listings", { params });
    const result = res.data?.data;
    setListings(result?.data || []);
    setTotal(result?.total || 0);
    setLastPage(result?.last_page || 1);
  } catch (err) {
    console.error("Search failed", err);
    toast.error("Failed to load search results");
    setListings([]);
    setTotal(0);
    setLastPage(1);
  } finally {
    setLoading(false);
  }
};


  // Refetch whenever query/page from URL changes
  useEffect(() => {
    const q = params.get("query") || "";
    const p = Number(params.get("page") || 1);
    fetchSearch(q, p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}&page=1`);
  };

  const handlePageChange = (newPage) => {
    navigate(
      `/search?query=${encodeURIComponent(searchTerm)}&page=${newPage}`
    );
  };

  const currentQuery = params.get("query") || "";

  return (
    <div className="container mx-auto px-4 py-10 pt-[10px]">
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-0 max-w-[500px] w-full mx-auto my-10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-0 px-3 py-4 flex-1 text-sm"
          placeholder="Search..."
        />
        <button
          type="submit"
          className="bg-[#02487C] text-white px-4 py-2 rounded-0 text-sm"
        >
          Search
        </button>
      </form>

      <h1 className="text-xl font-semibold mb-4 mt-4">
        Search results for:{" "}
        <span className="text-blue-600">{currentQuery}</span>
      </h1>

      {loading ? (
         <SearchLoadingSkeleton count={10} />
      ) : listings.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
            {listings.map((item) => (
              <PropertyCard
                key={`${item.type}-${item.id}`}
                item={item}
                category={item.type}
              />
            ))}
          </div>
<div className="flex items-center justify-center gap-4 flex-col">
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="w-10 h-10 cursor-pointer flex justify-center items-center rounded-[50%] border text-sm disabled:opacity-50 bg-blue-900 text-white"
            >
            <ChevronLeft/>  
            </button>
           
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= lastPage}
              className="w-10 h-10 cursor-pointer flex justify-center items-center  rounded-[50%] border text-sm disabled:opacity-50  bg-blue-900 text-white"
            >
             <ChevronRight/> 
            </button>
          </div>
           <span className="text-sm text-gray-600">
              Page {page} of {lastPage} (showing {listings.length} of {total})
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
