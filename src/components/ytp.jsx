import React from 'react';

const Ytp = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#461711] mb-6">
          International Collaboration
        </h1>
        <p className="text-xl lg:text-2xl text-gray-600 font-medium mb-8">
          Partnering globally to break mental health stigma
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full"></div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/10 rounded-2xl p-8">
            <img
              src="https://me-website-assets.s3.ap-south-1.amazonaws.com/ytp_collab/ytp.jpeg"
              alt="International Collaboration - The Yellow Tulip Project"
              className="w-full h-auto rounded-xl shadow-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ytp;