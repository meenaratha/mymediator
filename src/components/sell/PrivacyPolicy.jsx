import React from 'react';

const PrivacyPolicy = () => {
  // JSON data for privacy policy content
  const policyData = {
    title: "Privacy Policy",
    sections: [
      {
        id: 1,
        question: "Why do we use it?",
        content: [
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        ]
      },
      {
        id: 2,
        question: "Why do we use it?",
        content: [
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
        ]
      }
    ]
  };

  return (
    <div className=" p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-blue-800 text-2xl font-bold text-center mb-6">
        {policyData.title}
      </h1>
      
      <div className="space-y-6">
        {policyData.sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h2 className="font-bold text-lg mb-2">
              {section.question}
            </h2>
            
            <div className="space-y-4">
              {section.content.map((paragraph, index) => (
                <p key={index} className="text-gray-800 text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;