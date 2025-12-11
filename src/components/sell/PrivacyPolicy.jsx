import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
const PrivacyPolicy = () => {
 
 const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrivacy = async () => {
    try {
      const res = await api.get("privacy");

      if (res.data.success && res.data.content) {
        setContent(res.data.content);
      }
    } catch (e) {
      console.error("Failed to load privacy:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);
  return (
    <div className=" p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-[#0f1c5e] text-2xl font-bold text-center mb-6">
       Privay Policy
      </h1>
      
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div
          className="space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}


    </div>
  );
};

export default PrivacyPolicy;