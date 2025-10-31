import '../App.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const imageFilenames = [
  "Akhil T S, Kerala.jpeg",
"Angana Mukherjee Sharma, Mumbai.jpeg",
"Anoop Krishnan, Canada.jpeg",
"Anu Suraj, Kochi.jpeg",
"Anupama Menon,United Kingdom.jpg",
"Arjun Gupta, Delhi.jpeg",
"Asha Khatri, Jaipur.jpeg",
"Ashika Shetty, Bengaluru.jpg",
"Ashrita Mahajan,Vadodara.jpeg",
"Ashwini N.V, Bengaluru.jpeg",
"Atika Shukla,Singapore .jpeg",
"Avani Prasad,Ranchi .jpeg",
"Aysha Nawreen,Hyderabad.jpeg",
"B V Ramalakshmi,Kerala.jpeg",
"Bharti Jaravta,Gurgaon.png",
"Charumathi.png",
"Cini Padmanabhan,Kerala.jpeg",
"Cristelle Hart Singh,Kerala.jpeg",
"Dhanya Ravi,Bengaluru .jpeg",
"Dr. Ananya Sinha, Bengaluru.jpeg",
"Dr. Sowmya Putturaju,Bengaluru .jpeg",
"Dr. Vani Kulhalli,Mumbai.jpeg",
"Dr. Vishal Indla,Hyderabad .jpeg",
"Dr.Bino Mary Chacko,Kerala.jpeg",
"Dr.Femi Abdulla, Kerala.jpeg",
"Dr.Pramod Chandran,Kerala.png",
"Dr.Pritesh Goutam, Bhopal.png",
"Dr.Priya Nair, Hyderabad.jpeg",
"Dr.Priya Puri, Kolkatta.jpeg",
"Dr.Saroj Menon,Kerala.jpeg",
"Dr.Sneha Naik Samant, Mumbai.png",
"Eeshani Chakraverty, Mumbai.png",
"Gajalakshmi K, Tamilnadu .JPG",
"Gayathri,Kerala.jpeg",
"Himaja A,Bengaluru.jpeg",
"Jaya Nila,Bengaluru.jpeg",
"Jennifer Tavares,Bengaluru.jpeg",
"Jereesh Elias,UAE .jpeg",
"Katherine David,Chennai.jpeg",
"Kavya EcoFeminist, Kerala.jpeg",
"Krishnan Nair, Bengaluru.jpeg",
"Lakshmi Kashyap,Bengaluru.jpeg",
"Manasa Ram, Vishakhapatnam.jpeg",
"Manjiri Deshpande Shenoy,Mumbai.jpeg",
"Manju Goel, Bengaluru.jpeg",
"Mariya Biju,Kerala.jpeg",
"Maxine Jardiner, Australia .png",
"Meghna Girish, Kerala.png",
"Mukund Nair,Gurugram.png"
];



  const s3BucketURL = "https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/";
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  
  const TrainersGallery = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#461711] mb-6">
            ME Empowerment Coaches
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 font-medium mb-8">
            Meet our dedicated team of mental health professionals and empowerment coaches
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
          <Slider {...settings}>
            {imageFilenames.map((filename, index) => {
              const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
              
              return (
                <div key={index} className="px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="text-center">
                      <div className="relative mb-4">
                        <img
                          src={`${s3BucketURL}${filename}`} 
                          alt={trainerName} 
                          className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 mx-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                      </div>
                      <div className="text-lg lg:text-xl font-bold text-[#461711] leading-tight">
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
    );
  };
  
  export default TrainersGallery;