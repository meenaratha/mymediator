import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import IMAGES from "@/utils/images.js";
import { api } from "../../api/axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Razorpay from "razorpay"; // Add this import
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
  const [loading, setLoading] = useState(false); // ← ADD THIS
  const [loadingPlanId, setLoadingPlanId] = useState(null);
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


 // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay payment integration with dynamic script loading
  const handleRazorpayPayment = async (orderData, planName) => {
    console.log("🧾 Opening Razorpay with:", orderData);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      Swal.fire({
        icon: "error",
        title: "Payment Error!",
        text: "Payment gateway not available. Please try again later.",
        confirmButtonColor: "#EF4444",
      });
      return;
    }

    const options = {
      key: orderData.razorpay_key,
      amount: orderData.amount.toString(), // amount in paise as string
      currency: orderData.currency,
      name: orderData.name,
      description: `Subscription to ${planName}`,
      order_id: orderData.razorpay_order_id,
      handler: async function (response) {
        console.log("✅ Payment Success:", response);
        try {
          await fetchPlans();
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Subscription activated successfully!",
            confirmButtonColor: "#10B981",
            timer: 3000,
          });
        } catch (error) {
          console.error("Refresh error:", error);
        }
      },
      prefill: {
        name: orderData.name,
        email: orderData.email || "",
        contact: orderData.phone,
      },
      theme: {
        color: "#10B981",
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment Failed:", response.error);
        Swal.fire({
          icon: "error",
          title: "Payment Failed!",
          text: response.error.description || "Payment failed. Please try again.",
          confirmButtonColor: "#EF4444",
        });
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay init error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error!",
        text: "Unable to initialize payment. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  // Handle subscription request
  const handleSubscribe = async (planId) => {
    setLoadingPlanId(planId);
    try {
      const payload = { plan_id: planId };
      const response = await api.post("subscribe", payload);

      console.log("📡 Subscribe API Response:", response.data);

      if (response.data.success) {
        const currentPlan = plans.find((p) => p.id === planId);

        await handleRazorpayPayment(
          {
            razorpay_key: response.data.razorpay_key,
            amount: response.data.amount,
            currency: response.data.currency,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            razorpay_order_id: response.data.razorpay_order_id,
          },
          currentPlan?.name || "Premium Plan"
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription Failed!",
          text: response.data.message || "Subscription creation failed.",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (error) {
      console.error("❌ Subscription error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response) {
        errorMessage = error.response.statusText || "Server error.";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Swal.fire({
        icon: "error",
        title: "Subscription Failed!",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };


  return (
    <>
      <div className="w-full relative overflow-hidden py-12 px-4 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${IMAGES.subscriptionbg})` }}>
       
        <div className="max-w-6xl mx-auto">
          <h1 className="pb-10 text-center text-2xl md:text-3xl font-bold mb-12 text-gray-800">Choose your best plan</h1>
          
          <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan) => {
            const colors = getColorClasses(plan.name);
               const isActivePlan =
    subscription?.active && subscription.plan && subscription.plan.id === plan.id;
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
                  
                  {plan.limit && (
<li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">Limit: {plan.limit} Profiles </span>
                      </li>
                  )}
                      
{plan.duration && (
 <li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600"> Duration: {plan.duration}  Days</span>
                      </li>
)}
                      
                      {plan.billing_cycle && (
 <li className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">Billing: {plan.billing_cycle}</span>
                      </li>
                      )}
                     
                  
                  </ul>
                  
                  <button  
                  //  disabled={loadingPlanId === plan.id || isActivePlan}
                  disabled={plan.current === false}
                    onClick={() => handleSubscribe(plan.id)} 
                   className={`py-2 px-4 rounded-full transition-colors w-full text-sm font-medium 
                    flex items-center justify-center
                     ${
                      isActivePlan
                        ? 'bg-green-500 cursor-not-allowed text-white'
                        : `${colors.bg} ${colors.hover} text-white`
                    }
                    
                    
                    ${plan.current === false ? 'cursor-not-allowed opacity-[0.5]':'cursor-pointer'}
                    
                    
                    `}>
                   {loadingPlanId === plan.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subscribing...
                      </>
                    ) : isActivePlan ? (
                      '✅ Active'
                    ) : (
                      'Subscribe'
                    )}
                  </button>


{/* {subscription?.active && subscription.plan && (
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
              )} */}


                {isActivePlan && (
        <div className="absolute top-[-22%] left-[20%]">
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
              {new Date(subscription.ends_at).toLocaleDateString("en-IN") || "N/A"}
            </p>
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