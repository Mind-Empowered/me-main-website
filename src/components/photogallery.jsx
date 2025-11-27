import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { translations } from "../translations";

// Generate an array of image filenames from ME1.jpeg to ME51.jpeg
const imageFilenames = [
  "ME1.jpeg", "ME2.jpeg", "ME3.jpeg", "ME4.jpeg", "ME5.jpeg",
  "ME6.jpeg", "ME7.jpeg", "ME8.jpeg", "ME9.jpeg", "ME10.jpeg",
  "ME11.jpeg", "ME12.jpeg", "ME13.jpeg", "ME14.jpeg", "ME15.jpeg",
  "ME16.jpeg", "ME17.jpeg", "ME18.jpeg", "ME19.jpeg", "ME20.jpeg",
  "ME21.jpeg", "ME22.jpeg", "ME23.jpeg", "ME24.jpeg", "ME25.jpg",
  "ME26.jpg", "ME27.jpeg", "ME28.jpeg", "ME29.jpeg", "ME30.jpeg",
  "ME31.jpeg", "ME32.jpeg", "ME33.jpeg", "ME34.jpeg", "ME35.png",
  "ME36.png", "ME37.jpeg", "ME38.jpg", "ME39.jpeg", "ME40.jpeg",
  "ME41.jpeg", "ME42.jpeg", "ME43.jpeg", "ME44.jpeg", "ME45.jpeg",
  "ME46.jpeg", "ME47.jpeg", "ME48.jpeg", "ME49.jpg", "ME50.jpeg",
  "ME51.jpeg"
];

const photoGallery = imageFilenames.map((filename, index) => ({
  original: `/gallery/${filename}`,
  thumbnail: `/gallery/${filename}`,
  originalAlt: `Mind Empowered Activity ${index + 1}`,
  thumbnailAlt: `Mind Empowered Activity ${index + 1} thumbnail`,
}));

const Photogallery = ({ language }) => {
    return (
        <div>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                  {translations.gallery.title[language]}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.gallery.subtitle[language]}
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-4 lg:p-6 border border-gray-100">
              {photoGallery.length > 0 && (
                <ImageGallery 
                  items={photoGallery} 
                  autoPlay={false}
                  slideOnThumbnailOver={true}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  showThumbnails={true}
                  showBullets={false}
                  useBrowserFullscreen={true}
                  disableKeyDown={false}
                  additionalClass="photo-gallery-enhanced"
                  renderLeftNav={(onClick, disabled) => (
                    <button
                      onClick={onClick}
                      disabled={disabled}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-[#ff7612]"
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-[#ff7612]"
                    >
                      <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  renderFullscreenButton={(onClick, isFullscreen) => (
                    <button
                      onClick={onClick}
                      className="absolute bottom-2 right-2 z-20 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#ff7612]"
                    >
                      <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isFullscreen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9v4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v-4.5M15 15h4.5m0 0l5.25 5.25" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                        )}
                      </svg>
                    </button>
                  )}
                />
              )}
            </div>
        </div>
    );
}

export default Photogallery;
