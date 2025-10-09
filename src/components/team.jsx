import React from 'react';
import Slider from 'react-slick';
import { translations } from '../translations';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const imageFilenames = [
  "Akhil T S, Kerala.jpeg", "Angana Mukherjee Sharma, Mumbai.jpeg", "Anoop Krishnan, Canada.jpeg",
  "Anu Suraj, Kochi.jpeg", "Anupama Menon,United Kingdom.jpg", "Arjun Gupta, Delhi.jpeg",
  "Asha Khatri, Jaipur.jpeg", "Ashika Shetty, Bengaluru.jpg", "Ashrita Mahajan,Vadodara.jpeg",
  "Ashwini N.V, Bengaluru.jpeg", "Atika Shukla,Singapore .jpeg", "Avani Prasad,Ranchi .jpeg",
  "Aysha Nawreen,Hyderabad.jpeg", "B V Ramalakshmi,Kerala.jpeg", "Bharti Jaravta,Gurgaon.png",
  "Charumathi.png", "Cini Padmanabhan,Kerala.jpeg", "Cristelle Hart Singh,Kerala.jpeg",
  "Dhanya Ravi,Bengaluru .jpeg", "Dr. Ananya Sinha, Bengaluru.jpeg", "Dr. Sowmya Putturaju,Bengaluru .jpeg",
  "Dr. Vani Kulhalli,Mumbai.jpeg", "Dr. Vishal Indla,Hyderabad .jpeg", "Dr.Bino Mary Chacko,Kerala.jpeg",
  "Dr.Femi Abdulla, Kerala.jpeg", "Dr.Pramod Chandran,Kerala.png", "Dr.Pritesh Goutam, Bhopal.png",
  "Dr.Priya Nair, Hyderabad.jpeg", "Dr.Priya Puri, Kolkatta.jpeg", "Dr.Saroj Menon,Kerala.jpeg",
  "Dr.Sneha Naik Samant, Mumbai.png", "Eeshani Chakraverty, Mumbai.png", "Gajalakshmi K, Tamilnadu .JPG",
  "Gayathri,Kerala.jpeg", "Himaja A,Bengaluru.jpeg", "Jaya Nila,Bengaluru.jpeg",
  "Jennifer Tavares,Bengaluru.jpeg", "Jereesh Elias,UAE .jpeg", "Katherine David,Chennai.jpeg",
  "Kavya EcoFeminist, Kerala.jpeg", "Krishnan Nair, Bengaluru.jpeg", "Lakshmi Kashyap,Bengaluru.jpeg",
  "Manasa Ram, Vishakhapatnam.jpeg", "Manjiri Deshpande Shenoy,Mumbai.jpeg", "Manju Goel, Bengaluru.jpeg",
  "Mariya Biju,Kerala.jpeg", "Maxine Jardiner, Australia .png", "Meghna Girish, Kerala.png",
  "Mukund Nair,Gurugram.png"
];

const CustomArrow = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-300 ${
      direction === 'prev' ? 'left-0 md:-left-4' : 'right-0 md:-right-4'
    }`}
  >
    <svg className="w-5 h-5 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {direction === 'prev' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      )}
    </svg>
  </button>
);

const s3BucketURL = "https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/";
const sliderSettings = {
  dots: true, infinite: true, speed: 500, slidesToShow: 5, slidesToScroll: 1,
  autoplay: true, autoplaySpeed: 2000,
  nextArrow: <CustomArrow direction="next" />,
  prevArrow: <CustomArrow direction="prev" />,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
    { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } }
  ]
};

const Team = ({ language }) => {
    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                        {translations.team.title[language]}
                    </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {translations.team.subtitle[language]}
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {translations.teamMembers.map((member) => (
                <div key={member.key} className="bg-white rounded-xl shadow-xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col">
                <div className="flex flex-col items-center text-center h-full">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="rounded-full w-full h-full object-cover border-2 border-gray-200 shadow-md"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff7612]/10 to-transparent" />
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-[#461711] mb-1 tracking-wide">{member.name[language]}</h3>
                    <h4 className="font-semibold text-[#ff7612] mb-2 text-sm sm:text-base">{member.role[language]}</h4>
                    
                    <div className="flex-grow flex items-center">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed tracking-wide" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                        {member.bio[language]}
                    </p>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* ME Empowerment Coaches Section */}
            <div className="mt-8 lg:mt-12">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#461711] mb-4 leading-none">
                        {translations.team.coachesTitle[language]}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {translations.team.coachesSubtitle[language]}
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4"></div>
                </div>
                
                <div className="bg-gradient-to-br from-[#f5f0de] to-white rounded-xl shadow-xl p-4 md:p-8 border border-gray-100">
                    <Slider {...sliderSettings}>
                        {imageFilenames.map((filename) => {
                        const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
                        
                        return (
                            <div key={trainerName} className="px-2 md:px-4">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-center">
                                <div className="relative mb-4">
                                    <img
                                    src={`${s3BucketURL}${filename}`} 
                                    alt={trainerName} 
                                    className="w-full h-24 sm:h-32 object-contain rounded-xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 mx-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                                </div>
                                <div className="text-sm md:text-base font-bold text-[#461711] leading-tight">
                                    {trainerName}
                                </div>
                                </div>
                            </div>
                            </div>
                        );
                        })}
                    </Slider>
                </div>
            </div>

            {/* International Collaboration Section */}
            <div className="mt-8 lg:mt-12">
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 items-center">
                    {/* Image Column */}
                    <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100 lg:col-span-1 order-2 lg:order-1">
                        <img
                        src="https://me-website-assets.s3.ap-south-1.amazonaws.com/ytp_collab/ytp.jpeg"
                        alt="International Collaboration - The Yellow Tulip Project"
                        className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Text Column */}
                    <div className="text-center lg:text-left lg:col-span-2 order-1 lg:order-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#461711] mb-4 leading-none">
                            {translations.team.collabTitle[language]}
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {translations.team.collabSubtitle[language]}
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto lg:mx-0 rounded-full mt-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;