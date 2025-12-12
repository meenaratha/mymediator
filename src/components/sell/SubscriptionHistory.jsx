import React, { useState, useEffect } from "react";
import IMAGES from "../../utils/images.js";
import { useMediaQuery } from "react-responsive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Razorpay from "razorpay";
import { api } from "../../api/axios.js";
import Swal from "sweetalert2";

/* --------------------------------------------
   Skeleton Loader Component
-------------------------------------------- */
const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-4">
    <div className="h-10 w-10 bg-gray-300 rounded mb-3"></div>
    <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 w-full mb-1"></div>
    <div className="h-3 bg-gray-200 w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-200 w-2/4"></div>
  </div>
);

const SubscriptionCard = ({
  type,
  plan,
  startDate,
  endDate,
  price,
  expired,
  onRenew,
}) => {
  const getImage = () => {
    switch (type) {
      case "Basic":
        return (
          <img src={IMAGES.basicSubscription} className="w-12 h-12" alt="" />
        );
      case "Premium":
        return (
          <img src={IMAGES.premiumSubscription} className="w-12 h-12" alt="" />
        );
      default:
        return <img src={IMAGES.propremiumimg} className="w-12 h-12" alt="" />;
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
          {!expired && <span className="truncate">Ads on: {plan}</span>}
        </div>
        <div className="text-[10px] font-semibold text-gray-900 mt-1 flex items-center justify-between gap-2">
          <span className="truncate">End date: {endDate}</span>
          {!expired && (
            <span className="font-bold text-[16px] text-black">₹ {price}</span>
          )}
        </div>
        {expired && (
          <div className="text-[10px] font-semibold text-gray-900 mt-1 flex items-center justify-between gap-2">
            <span className="font-bold text-[16px] text-black">₹ {price}</span>
            <button
              onClick={() => onRenew()}
              className="mt-1 text-xs bg-[#02487C] text-white px-4 py-1 rounded-md cursor-pointer"
            >
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
  // const [subscriptions, setSubscriptions] = useState({
  //   new: [],
  //   expired: [],
  // });

  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const fetchSubscriptionHistory = async (page = 1) => {
    try {
      setLoading(true);

      // const response = await api.post("subscribe/history", {
      //   page: page, // send page number to backend
      // });

      const response = await api.get("/subscribe/history", {
        params: {
          page, // or page: page
        },
      });

      setSubscriptions(response.data.history);

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionHistory();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (
        document.querySelector(
          `script[src="https://checkout.razorpay.com/v1/checkout.js"]`
        )
      ) {
        return resolve(true); // already loaded
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRenew = async (subscription) => {
    try {
      const payload = { plan_id: subscription.plan_id };

      const res = await api.post(`renew/${subscription.id}`, payload);

      if (!res.data.razorpay_order_id) {
        alert("Invalid order response");
        return;
      }

      await openRazorpay(res.data, subscription.id);
    } catch (error) {
      console.error("Renew API error:", error);
    }
  };

//   const verifyPayment = async (paymentResponse, subscriptionId) => {
//     try {
//       const payload = {
//         razorpay_order_id: paymentResponse.razorpay_order_id,
//         razorpay_payment_id: paymentResponse.razorpay_payment_id,
//         razorpay_signature: paymentResponse.razorpay_signature,
//       };
//  console.log("Verify payload:", verifyPayload);
//       // const verifyRes = await api.post(`verify_payment/${subscriptionId}`, payload);
//       // const verifyRes = await api.post(`verify_payment`, payload);

//       // if (verifyRes.data.success) {
//       //   await fetchSubscriptionHistory();
//       //   Swal.fire({
//       //     icon: "success",
//       //     title: "Payment Verified!",
//       //     text: "Your subscription has been activated.",
//       //     confirmButtonColor: "#10B981",
//       //   });
//       // } else {
//       //   Swal.fire({
//       //     icon: "error",
//       //     title: "Verification Failed",
//       //     text: "Payment verification failed. Contact support.",
//       //   });
//       // }

//  await fetchSubscriptionHistory(); // refresh plans & subscription
//     await Swal.fire({
//       icon: "success",
//       title: "Payment Verified!",
//       text: "Your subscription has been activated.",
//       confirmButtonColor: "#10B981",
//     });


//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         icon: "error",
//         title: "Verification Error",
//         text: "Server verification failed. Try again.",
//       });
//     }
//   };



const verifyPayment = async (paymentResponse, subscriptionId) => {
  try {
    const payload = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    };

    console.log("Verify payload:", payload);

    // When backend is ready:
    // const verifyRes = await api.post(`verify_payment/${subscriptionId}`, payload);
    // if (!verifyRes.data.success) {
    //   throw new Error(verifyRes.data.message || "Verification failed");
    // }

    await fetchSubscriptionHistory(); // refresh history
    await Swal.fire({
      icon: "success",
      title: "Payment Verified!",
      text: "Your subscription has been activated.",
      confirmButtonColor: "#10B981",
    });
  } catch (err) {
    console.error("verifyPayment error:", err);

    const msgFromBackend =
      err?.response?.data?.message ||
      (typeof err?.response?.data?.data === "string" && err.response.data.data) ||
      err.message ||
      "Server verification failed. Try again.";

    Swal.fire({
      icon: "error",
      title: "Verification Error",
      text: msgFromBackend,
    });
  }
};







  const openRazorpay = async (orderData, subscriptionId) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Payment gateway failed to load");
      return;
    }

    const options = {
      key: orderData.razorpay_key,
      amount: orderData.amount.toString(),
      currency: "INR",
      name: "MyMediator",
      order_id: orderData.razorpay_order_id,

      handler: async function (response) {

        //  verify api call 

        await verifyPayment(response, subscriptionId);
        console.log("razorpay response", response);





  




      },

      prefill: {
        name: orderData.name,
        email: orderData.email,
        contact: orderData.phone,
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      alert("Payment failed");
    });

    rzp.open();
  };

  /* --------------------------------------------
     Helper for pagination buttons
  -------------------------------------------- */
  const Pagination = () => {
    const { current_page, total_pages } = pagination;

    if (total_pages <= 1) return null;

    return (
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => fetchSubscriptionHistory(current_page - 1)}
          disabled={current_page === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {current_page} / {total_pages}
        </span>

        <button
          onClick={() => fetchSubscriptionHistory(current_page + 1)}
          disabled={current_page === total_pages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto px-0">
        <h1 className="text-xl font-bold text-[#02487C] text-center mb-6">
          Subscription History
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {subscriptions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>

                <div
                  className={`grid gap-4 ${
                    isMobile || isTablet ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {subscriptions.map((sub, idx) => (
                    <SubscriptionCard
                      key={idx}
                      type={sub.plan_name}
                      startDate={sub.starts_at}
                      plan={sub.upload_limit}
                      endDate={sub.ends_at}
                      price={sub.plan_price}
                      expired={
                        sub.subscription_status === "expired" ||
                        sub.subscription_status === "pending"
                      }
                      onRenew={() => handleRenew(sub)}
                    />
                  ))}
                </div>

                <Pagination />
              </div>
            )}

            {/* Empty State */}
            {subscriptions.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No subscription history found.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SubscriptionHistory;
