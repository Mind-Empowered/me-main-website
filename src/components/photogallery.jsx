import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const photoGallery = Array.from({ length: 18 }, (_, index) => ({
  original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
  thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
  originalAlt: `Mind Empowered Activity ${index + 1}`,
  thumbnailAlt: `Mind Empowered Activity ${index + 1} thumbnail`,
}));

const Photogallery = () => {
    return (
        <div>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                  Photo Gallery
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Capturing moments of empowerment and community engagement
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-4 lg:p-6 border border-gray-100">
              {photoGallery.length > 0 && (
                <ImageGallery 
                  items={photoGallery} 
                  autoPlay={false}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  showThumbnails={true}
                  showBullets={true}
                  useBrowserFullscreen={true}
                  disableKeyDown={false}
                  additionalClass="photo-gallery-enhanced"
                  renderLeftNav={(onClick, disabled) => (
                    <button
                      onClick={onClick}
                      disabled={disabled}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-[#ff7612]"
                    >
                      <svg className="w-8 h-8 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  renderRightNav={(onClick, disabled) => (
                    <button
                      onClick={onClick}
                      disabled={disabled}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-[#ff7612]"
                    >
                      <svg className="w-8 h-8 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  renderFullscreenButton={(onClick, isFullscreen) => (
                    <button
                      onClick={onClick}
                      className="absolute bottom-4 right-4 z-20 bg-white/95 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#ff7612]"
                    >
                      <svg className="w-8 h-8 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
