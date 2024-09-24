import React from 'react';
import '../gallery.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const imageFilenames = [
    "Akhil T S.jpeg",
    "Anupama Menon.jpg",
    "Atika Shukla .jpeg",
    "Dr. Vishl Indla .jpeg",
    "eeshani.5c677898.png",
    "Femi.jpeg",
    "Himaja A.jpeg",
    "Mukund Nair.png",
    "Nisha Rao.jpeg",
    "Sajeev.jpeg",
    "Vivek U .jpeg",
    "Angana.jpeg",
    "Arjun Gupta 1 .jpeg",
    "Ashika Shetty .jpg",
    "Ashrita Mahajan - Counselling Psychologist,Fortis.jpeg",
    "Avani Prasad .jpeg",
    "Bharti-Vocals.png",
    "Bino Chacko.jpeg",
    "Cini Padmanabhan.jpeg",
    "Dr. Ananya Sinha.jpeg",
    "Dr. Bino Mary Chacko.jpeg",
    "Gayathri Nutritionist .jpeg",
    "Jereesh Elias .jpeg",
    "Katherine David .jpeg",
    "Krishnan Nair, CEO GeekTrust.jpeg",
    "Manasa.jpeg",
    "Manjiri Deshpande Shenoy.jpeg",
    "Nishan Nizar.png",
    "Ppiyanshi.jpeg",
    "Preeti Shahal Counseling Psychologist & Psychotherapist.jpeg",
    "Priya Nair.jpeg",
    "Priya Puri.jpeg",
    "Procheta Mahanta.jpeg",
    "Raashi Thakran.JPG",
    "Ronit Ranjan.jpeg",
    "Shalini Singh Psychological Counselor .jpeg",
    "Shriya Vashisht.png",
    "Siddharth Ak .jpeg",
    "Tiffany Brar .jpeg",
    "Tvishi Sharma.jpeg",
    "Vickineswarie Jagadharan-Professional Counsellor.jpeg",
    "Anoop Krishnan.jpeg",
    "Anu Suraj new.jpeg",
    "Asha Khatri.jpeg",
    "Ashwini N.V.jpeg",
    "Aysha Nawreen.jpeg",
    "B V Ramalakshmi.jpeg",
    "Charumathi.png",
    "Cristelle Hart Singh .jpeg",
    "Devraj Sir .jpeg",
    "Dhanya Ravi .jpeg",
    "Dr. Sowmya Putturaju .jpeg",
    "Dr. Vani Kulhalli.jpeg",
    "Gajalakshmi .JPG",
    "Jennifer Tavares.jpeg",
    "Lakshmi Kashyap.jpeg",
    "MANJU GOEL PSYCHOTHERAPIST.jpeg",
    "Mariya Biju.jpeg",
    "Meghna.png",
    "neetu thomas.jpeg",
    "\\lishi Arora .jpeg",
    "Niti Joshi .jpeg",
    "Prasanth Psy.jpeg",
    "Rathi Manoj.jpeg",
    "RJ Neena.jpg",
    "Sai Yuva.jpeg",
    "Sandhya Prasad.jpeg",
    "Saroj Menon.jpeg",
    "Savy Chawla .jpeg",
    "Shalini Singh.jpeg",
    "Shilok Mukkati,.jpeg",
    "Smitha Benny.jpg",
    "Sneha Naik.png",
    "Sowmya Puttaraju.jpeg",
    "Vani Kulhalli.jpeg",
    "Vinod RR Life Coach.png",
    "Jaya Nila.jpeg"
  ];

  const s3BucketURL = "https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/";
  const settings = {
    dots: true,              // Show navigation dots
    infinite: true,          // Infinite looping
    speed: 500,              // Speed of transitions
    slidesToShow: 3,         // Number of slides to show at once
    slidesToScroll: 1,       // Scroll one slide at a time
    autoplay: true,          // Automatically start slideshow
    autoplaySpeed: 3000,     // Delay between slide transitions (3 seconds)
  };
  
  const Gallery = () => {
    return (
      <div className="gallery-wrapper">
        <h1 className="gallery-title">Trainer Gallery</h1>
        <Slider {...settings}>
          {imageFilenames.map((filename, index) => {
            // Extract the name from the filename (before the last dot)
            const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
            
            return (
              <div key={index} className="gallery-item">
                <img
                  src={`${s3BucketURL}${filename}`} 
                  alt={trainerName} 
                  className="gallery-img"
                />
                <div className="caption">{trainerName}</div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  };
  
  export default Gallery;