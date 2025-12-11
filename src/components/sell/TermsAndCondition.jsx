import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
const TermsAndConditions = () => {

   const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTerms = async () => {
    try {
      const res = await api.get("terms");

      if (res.data.success && res.data.content) {
        setContent(res.data.content);
      }
    } catch (e) {
      console.error("Failed to load terms:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 b">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-[#0B1544] mb-6">Terms & Conditions</h1>
        
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div
          className="space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      </div>
      
     
    </div>
  );
};

export default TermsAndConditions;