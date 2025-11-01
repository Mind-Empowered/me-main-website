
import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { translations } from "../translations";
import "react-image-gallery/styles/css/image-gallery.css";

const Testimonials = ({ language }) => {
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
    <div>
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.testimonials.title[language]}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.testimonials.subtitle[language]}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-gray-100">
          {testimonials.length > 0 ? (
            <ImageGallery 
              items={testimonials} 
              autoPlay={true}
              slideInterval={5000}
              showPlayButton={false}
              showFullscreenButton={true}
              showNav={true}
              showThumbnails={true}
              showBullets={false}
              additionalClass="testimonial-gallery"
              renderLeftNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="absolute left-0 md:-left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              renderRightNav={(onClick, disabled) => (
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="absolute right-0 md:-right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            />
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-lg text-gray-600 font-medium">
                  Loading testimonials...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
