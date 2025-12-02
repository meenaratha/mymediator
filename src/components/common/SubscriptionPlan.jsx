import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
import { api } from "../../api/axios";
import { useEffect, useState } from "react";

const SubscriptionPlan = () => {
  // JSON data for pricing plans
  const pricingData = [
    {
      id: 1,
      title: "BASIC",
      price: 500,
      color: "purple",
      iconUrl: IMAGES.basicSubscription,
      features: [
        "Subscription Only Per Per Month",
        "100 Coupons per uploads",
        "Unlimited Offers"
      ]
    },
    {
      id: 2,
      title: "PREMIUM",
      price: 500,
      color: "blue",
      iconUrl: IMAGES.premiumSubscription,
      features: [
        "Subscription Only Per Per Month",
        "100 Coupons per uploads", 
        "Unlimited Offers"
      ]
    },
    {
      id: 3,
      title: "PRO",
      price: 500,
      color: "orange",
      iconUrl: IMAGES.propremiumimg,
      features: [
        "Subscription Only Per Per Month",
        "100 Coupons per uploads",
        "Unlimited Offers"
      ]
    }
  ];

  // Function to get appropriate color classes based on plan type
  // const getColorClasses = (color) => {
  //   const colorMap = {
  //     purple: {
  //       text: "text-purple-600",
  //       bg: "bg-purple-600",
  //       hover: "hover:bg-purple-700"
  //     },
  //     blue: {
  //       text: "text-blue-700",
  //       bg: "bg-blue-700",
  //       hover: "hover:bg-blue-800"
  //     },
  //     orange: {
  //       text: "text-orange-600",
  //       bg: "bg-orange-600",
  //       hover: "hover:bg-orange-700"
  //     }
  //   };
  //   return colorMap[color];
  // };


  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);

   // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      const res = await api.get("plans");

      setPlans(res.data.plans);
      setSubscription(res.data.subscription);
    } catch (err) {
      console.error("Error loading subscription plans:", err);
    }
  };

   useEffect(() => {
    fetchPlans();
  }, []);

// Color classes based on plan name
  const getColorClasses = (name) => {
    const map = {
      Silver: {
        text: "text-purple-600",
        bg: "bg-purple-600",
        hover: "hover:bg-purple-700",
        icon: IMAGES.basicSubscription,
      },
      Gold: {
        text: "text-blue-700",
        bg: "bg-blue-700",
        hover: "hover:bg-blue-800",
        icon: IMAGES.premiumSubscription,
      },
      Platinum: {
        text: "text-orange-600",
        bg: "bg-orange-600",
        hover: "hover:bg-orange-700",
        icon: IMAGES.propremiumimg,
      },
    };

    return map[name] || map["Silver"];
  };

  // Handle Subscribe
  const handleSubscribe = (planId) => {
    console.log("Subscribe clicked for plan:", planId);
    // Call your payment/razorpay flow here
  };


  return (
    <>
      <div className="w-full relative overflow-hidden py-12 px-4 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${IMAGES.subscriptionbg})` }}>
       
        <div className="max-w-6xl mx-auto">
          <h1 className="pb-10 text-center text-2xl md:text-3xl font-bold mb-12 text-gray-800">Choose your best plan</h1>
          
          <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan) => {
            const colors = getColorClasses(plan.name);
              
              return (
                <>
                
                 <div key={plan.id} className="relative bg-white rounded-xl shadow-md p-6 flex flex-col">
                  <div className={`font-bold text-center mb-6 text-lg uppercase ${colors.text}`}>
                    {plan.name}
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <img src={colors.icon} alt={`${plan.name} icon`} className="w-8 h-8" />
                  </div>
                  
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-gray-800 text-xl font-bold">₹</span>
                    <span className="text-gray-800 text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1 uppercase"> PER {plan.billing_cycle}</span>
                  </div>
                  
                  <ul className="flex-grow space-y-4 mb-8">
                  
                      <li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">Limit: {plan.limit} Profiles </span>
                      </li>

                       <li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600"> Duration: {plan.duration}  Days</span>
                      </li>
                      <li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">Billing: {plan.billing_cycle}</span>
                      </li>
                  
                  </ul>
                  
                  <button  onClick={() => handleSubscribe(plan.id)}  className={`${colors.bg}
                  text-white py-2 px-4 rounded-full ${colors.hover}
                   transition-colors w-full text-sm font-medium`}>
                    Subscribe
                  </button>


{subscription?.active && subscription.plan && (
                <div className="absolute top-[-22%] left-[25%]  ">
 <div className="flex justify-center mb-10">
    <div className="bg-green-100 border border-green-300 rounded-xl px-6 py-4 text-center shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold text-green-700 mb-2">
        Active Plan: {subscription.plan.name}
      </h2>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">Start Date:</span>{" "}
        {new Date(subscription.starts_at).toLocaleDateString("en-IN")}
      </p>

      <p className="text-gray-700 text-sm">
        <span className="font-medium">End Date:</span>{" "}
        {new Date(subscription.ends_at).toLocaleDateString("en-IN")}
      </p>
    </div>
  </div>
                </div>
              )}



                </div>



             
                </>
               
              );
            })}
          </div>

           {/* Show current subscription status */}
        {subscription && (
          <div className="text-center mt-8 text-gray-700">
            {subscription.active ? (
              <p className="text-green-600 font-medium">
                Active Plan: {subscription.plan?.name} (Ends: {subscription.ends_at})
              </p>
            ) : (
              <p className="text-red-500 font-medium">No active subscription</p>
            )}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlan;