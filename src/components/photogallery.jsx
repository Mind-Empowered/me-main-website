import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Photogallery = () => {
    const [error, setError] = useState(null);
    const [photoGallery, setPhotoGallery] = useState([]);

    useEffect(() => {
        try {
        let tempPhotoGallery = [];
        for (let index = 0; index < 18; index++) {
            tempPhotoGallery.push({
            original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
            thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
            });
        }
        setPhotoGallery(tempPhotoGallery);
        } catch (err) {
        console.error("Error initializing galleries:", err);
        setError(err.message);
        }
    }, []);

    if (error) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-600">
            Error loading the application: {error}
            </div>
        </div>
        );
    }

    return (
        <div className="p-4">
            <div className="gallery-wrapper">
          <div className="text-3xl text-[#461711] font-bold color-[#461711] w-full text-center">
            Photo Gallery
          </div>
          <div className="mx-28 mt-10">
            {photoGallery.length > 0 ? (
              <ImageGallery 
                items={photoGallery} 
                autoPlay={true}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                additionalClass="gallery-item hover:transform hover:translate-y-[-5px] transition-all duration-300"
              />
            ) : (
              <div>Loading gallery...</div>
            )}
          </div>
        </div>
        </div>
    );
}

export default Photogallery;

