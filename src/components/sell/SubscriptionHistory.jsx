import React, { useState, useEffect } from "react";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Dummy JSON data
const dummySubscriptionData = {
  newSubscriptions: [
    {
      type: "Basic",
      startDate: "25/12/2023",
      plan: " 1",
      endDate: "31/03/2024",
      price: "1,000",
    },
    {
      type: "Basic",
      startDate: "25/12/2023",
      plan: " 2",
      endDate: "31/03/2024",
      price: "1,000",
    },
    {
      type: "Basic",
      startDate: "25/12/2023",
      plan: " 3",
      endDate: "31/03/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "12/01/2024",
      plan: " 10",
      endDate: "01/04/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "12/01/2024",
      plan: " 11",
      endDate: "01/04/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "12/01/2024",
      plan: " 12",
      endDate: "01/04/2024",
      price: "1,000",
    },
  ],
  expiredSubscriptions: [
    {
      type: "Pro",
      startDate: "05/10/2023",
      plan: " 5",
      endDate: "15/01/2024",
      price: "1,000",
    },
    {
      type: "Pro",
      startDate: "05/10/2023",
      plan: " 6",
      endDate: "15/01/2024",
      price: "1,000",
    },
    {
      type: "Pro",
      startDate: "05/10/2023",
      plan: " 7",
      endDate: "15/01/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "08/11/2023",
      plan: " 8",
      endDate: "20/02/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "08/11/2023",
      plan: " 9",
      endDate: "20/02/2024",
      price: "1,000",
    },
    {
      type: "Premium",
      startDate: "08/11/2023",
      plan: " 10",
      endDate: "20/02/2024",
      price: "1,000",
    },
  ],
};

const SubscriptionCard = ({
  type,
  plan,
  startDate,
  endDate,
  price,
  expired = false,
}) => {
  const getImage = () => {
    if (type === "Basic") {
      return (
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={IMAGES.basicSubscription}
            alt="Basic Subscription"
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else if (type === "Premium") {
      return (
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={IMAGES.premiumSubscription}
            alt="Premium Subscription"
            className="w-full h-full object-contain"
          />
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={IMAGES.propremiumimg}
            alt="Pro Subscription"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg px-2 py-4 flex items-start bg-white">
      {getImage()}
      <div className="ml-3 flex-1 min-w-0">
        <div className="font-semibold text-[14px] truncate pb-2">
          {type} Subscription plan
        </div>
        <div className="text-[10px] font-semibold text-gray-900 mt-1 flex items-center justify-between gap-2 pb-1">
          <span className="truncate">Starting date: {startDate}</span>
          {expired ? "" : <span className="truncate">Ads on: {plan}</span>}
        </div>
        <div className="text-[10px] font-semibold text-gray-900 mt-1 flex items-center justify-between gap-2">
          <span className="truncate">End date: {endDate}</span>
          {expired ? (
            ""
          ) : (
            <span className="font-bold text-[16px] text-black">₹ {price}</span>
          )}
        </div>
        {expired && (
          <div className="text-[10px] font-semibold text-gray-900 mt-1 flex items-center justify-between gap-2">
            <span className="font-bold text-[16px] text-black">₹ {price}</span>
            <button className="mt-1 text-xs bg-[#02487C] text-white px-4 py-1 rounded-md cursor-pointer">
              Renewal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SubscriptionHistory = () => {
  const isMobile = useMediaQuery({ maxWidth: 567 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 999 });

  // State for storing subscription data
  const [subscriptions, setSubscriptions] = useState({
    new: [],
    expired: [],
  });

  // Simulate data loading
  useEffect(() => {
    // Simulate a network delay
    const timer = setTimeout(() => {
      setSubscriptions({
        new: dummySubscriptionData.newSubscriptions,
        expired: dummySubscriptionData.expiredSubscriptions,
      });
    }, 500); // Simulate a half-second loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" mx-auto px-0">
      <h1 className="text-xl font-bold text-[#02487C] text-center mb-6">
        Subscription History
      </h1>

      {subscriptions.new.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">New</h2>
          <div
            className={`grid gap-4 lg:grid-cols-3 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
          >
            {subscriptions.new.map((sub, index) => (
              <SubscriptionCard
                key={`new-${index}`}
                type={sub.type}
                startDate={sub.startDate}
                plan={sub.plan}
                endDate={sub.endDate}
                price={sub.price}
                expired={false}
              />
            ))}
          </div>
        </div>
      )}

      {subscriptions.expired.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Expired</h2>
          <div
            className={`grid gap-4 lg:grid-cols-3 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
          >
            {subscriptions.expired.map((sub, index) => (
              <SubscriptionCard
                key={`expired-${index}`}
                type={sub.type}
                startDate={sub.startDate}
                plan={sub.plan}
                endDate={sub.endDate}
                price={sub.price}
                expired={true}
              />
            ))}
          </div>
        </div>
      )}

      {subscriptions.new.length === 0 && subscriptions.expired.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Loading subscription data...
        </div>
      )}
    </div>
  );
};

export default SubscriptionHistory;
