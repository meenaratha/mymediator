import Logo from "../../assets/images/common/logo.png";
import Profile from "../../assets/images/common/android-chrome-192x192.png";
import "../../assets/css/header.css";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors"; // Ensure deepPurple is imported
const Header = () => {
  return (
    <>
      <section className="w-full h-[140px] hidden md:block">
        {/* top bar */}
        <div className="w-full h-[70px] border-b-[1px] border-b-solid border-b-[rgba(225,225,225,1)]">
          <div className="flex max-w-[1200px] mx-auto px-2.5 mymediator__container">
            <div className="w-[150px] bg-gray-200 h-[70px]">
              <img src={Logo} alt="" className="relative z-[99] h-[140px]" />
            </div>
            <div className="w-[100%]  h-[70px] flex items-center gap-5 px-3 justify-between">
              {/* search box */}
              <div className="flex items-center w-full max-w-md px-4 py-2 border border-gray-300 rounded-full shadow-sm">
                <SearchIcon className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="what in your mind ?"
                  className="w-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* notification box */}
              <div className="flex gap-10 items-center">
                <Badge
                  badgeContent={2}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "rgba(24, 166, 11, 1)", // Custom badge color
                      color: "white", // Text color inside badge
                    },
                  }}
                >
                  <NotificationsIcon style={{ color: "black" }} />
                </Badge>

                {/* sell button */}

                <button class="px-4 py-2 text-black font-semibold rounded-[10px] border-2 mymediator__sell_button">
                  Sell
                </button>

                <Avatar
                  alt="Remy Sharp"
                  src={Profile}
                  sx={{ width: 56, height: 56, bgcolor: deepPurple[500] }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* header start */}
        <div className="w-full h-[70px] bg-white mymediator__header">
          <div className="flex max-w-[1200px] mx-auto  px-2.5 mymediator__container">
            <div className="w-[150px] bg-gray-200 h-[70px]"></div>
            <div className="w-[100%]  h-[70px]"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
