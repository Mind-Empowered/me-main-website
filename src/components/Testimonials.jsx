// src/components/Testimonials.jsx

import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const tempTestimonials = [];
      for (let index = 1; index < 8; index++) {
        tempTestimonials.push({
          original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
          thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
        });
      }
      setTestimonials(tempTestimonials);
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError(err.message);
    }
  }, []);

  if (error) {
    return (
      <div className="text-red-600">
        Error loading testimonials: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="testimonial-container">
          <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
            Testimonials
          </div>
          <div className="mx-28 mt-10">
            {testimonials.length > 0 ? (
              <ImageGallery 
                items={testimonials} 
                autoPlay={false} 
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                additionalClass="testimonial-card hover:transform hover:translate-y-[-5px] transition-all duration-300"
              />
            ) : (
              <div>Loading testimonials...</div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Testimonials;
