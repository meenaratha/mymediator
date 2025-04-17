import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";

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
  const getColorClasses = (color) => {
    const colorMap = {
      purple: {
        text: "text-purple-600",
        bg: "bg-purple-600",
        hover: "hover:bg-purple-700"
      },
      blue: {
        text: "text-blue-700",
        bg: "bg-blue-700",
        hover: "hover:bg-blue-800"
      },
      orange: {
        text: "text-orange-600",
        bg: "bg-orange-600",
        hover: "hover:bg-orange-700"
      }
    };
    return colorMap[color];
  };

  return (
    <>
      <div className="w-full relative overflow-hidden py-12 px-4 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${IMAGES.subscriptionbg})` }}>
       
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-12 text-gray-800">Choose your best plan</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pricingData.map((plan) => {
              const colorClasses = getColorClasses(plan.color);
              
              return (
                <div key={plan.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                  <div className={`font-bold text-center mb-6 text-lg ${colorClasses.text}`}>
                    {plan.title}
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <img src={plan.iconUrl} alt={`${plan.title} icon`} className="w-8 h-8" />
                  </div>
                  
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-gray-800 text-xl font-bold">₹</span>
                    <span className="text-gray-800 text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1">PER MONTH</span>
                  </div>
                  
                  <ul className="flex-grow space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colorClasses.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`${colorClasses.bg} text-white py-2 px-4 rounded-full ${colorClasses.hover} transition-colors w-full text-sm font-medium`}>
                    Subscribe
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlan;