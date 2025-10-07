import React from 'react';
import Slider from 'react-slick';
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
    className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
      direction === 'prev' ? 'left-0 md:-left-5' : 'right-0 md:-right-5'
    }`}
  >
    <svg className="w-16 h-16 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } }
  ]
};

const Team = () => {
    return (
        <div>
            <div className="text-center mb-24">
                <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                        Meet Our Team
                    </span>
                </h1>
                <p className="text-5xl sm:text-6xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
                    The passionate individuals driving mental health awareness and empowerment
                </p>
                <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-10"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
            {[
                {
                image: "/team/founder1.png",
                name: "Maya Menon",
                role: "Founder",
                bio: "A superb communicator, Maya Devi Menon adorns many hats. A post graduate in IT from Monash University, Australia, she has experience as an IT professional both in India and abroad. Having captivating teaching and presentation skills, she finds time to take classes for school and college students on a variety of subjects like spoken english, cloud computing, wireless networks. At Mind Empowered, Maya is the mastermind behind visualisation, strategy, and fundraising."
                },
                {
                image: "/team/founder2.png",
                name: "Sreela Menon",
                role: "Co-Founder",
                bio: "An excellent human resource manager. Post her MBA from Birla Institute of Management Technology in Delhi, she has worked for 12 years in Recruitments as well as Learning and Development centers of corporates like E-lixir Web Solutions and Oracle Financial Software Services. At Mind Empowered, Sreela is responsible for the Finance and operations simultaneously offering freelance training in areas such as Behaviour Training, Softskill Development, Interview Etiquette and Corporate recruitment."
                },
                {
                image: "/team/jaya.jpg",
                name: "Jayashree Menon",
                role: "Sr. Researcher",
                bio: "An MSc, B.Ed, from MG University, Kerala,Jayshree Menon is a highly skilled and versatile professional. As an excellent researcher, Jayshree conducts in-depth research on a variety of topics for webinars and events. Additionally, she is instrumental in identifying and engaging experts for our Mental Health events, ensuring that we provide the highest quality of information and support to our audience."
                },
                {
                image: "/team/anoopa.jpg",
                name: "Anoopa Krishnan",
                role: "Creative Director",
                bio: "An MA in English Literature, Anoopa Krishnan is a creative and enthusiastic digital marketing professional specialising in Search Engine Optimization and Social Media Marketing. At Mind Empowered, Anoopa has been the driving force behind the exponential growth of our digital portfolio, expanding it tenfold. Her expertise in SEO and social media strategies has significantly increased our online presence and engagement."
                },
                {
                image: "/team/barathi.jpg",
                name: "Bharti Jaravta",
                role: "Art Therapist, Counselling Psychologist",
                bio: "At Mind Empowered, Bharti Jaravta serves as a dedicated Art Therapist, using her expertise to help individuals express themselves through the medium of art. With a B.Ed and an M.Phil in Counselling Psychology, she brings a deep understanding of the therapeutic process to her work. Bharti guides our audience in using art as a powerful form of communication, helping them increase self-awareness."
                },
                {
                image: "/team/Jessica.jpeg",
                name: "Jessica Susan John",
                role: "Designer",
                bio: "Jessica is a creative self-taught designer with a BCom degree. She has worked on various projects, including designing posters, newsletters, and websites for Mind Empowered. With her passion for design and a background in social volunteering, she brings fresh ideas and enthusiasm to every project she undertakes."
                }
            ].map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col">
                <div className="flex flex-col items-center text-center h-full">
                    <div className="relative w-[32rem] h-[32rem] lg:w-[36rem] lg:h-[36rem] mb-16">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="rounded-full w-full h-full object-cover border-4 border-[#ff7612]/20 shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff7612]/10 to-transparent" />
                    </div>
                    
                    <h3 className="text-8xl sm:text-9xl font-bold text-[#461711] mb-6 tracking-wide">{member.name}</h3>
                    <h4 className="font-semibold text-[#ff7612] mb-8 text-5xl sm:text-6xl">{member.role}</h4>
                    
                    <div className="flex-grow flex items-center">
                    <p className="text-5xl sm:text-6xl text-gray-700 leading-relaxed tracking-wide">
                        {member.bio}
                    </p>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* ME Empowerment Coaches Section */}
            <div className="mt-16 lg:mt-24">
                <div className="text-center mb-24">
                    <h2 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
                        ME Empowerment Coaches
                    </h2>
                    <p className="text-5xl sm:text-6xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
                        Meet our dedicated team of mental health professionals and empowerment coaches
                    </p>
                    <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-10"></div>
                </div>
                
                <div className="bg-gradient-to-br from-[#f5f0de] to-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
                    <Slider {...sliderSettings}>
                        {imageFilenames.map((filename, index) => {
                        const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
                        
                        return (
                            <div key={index} className="px-2">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="text-center">
                                <div className="relative mb-6">
                                    <img
                                    src={`${s3BucketURL}${filename}`} 
                                    alt={trainerName} 
                                    className="w-full h-[48rem] object-contain rounded-xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105 mx-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                                </div>
                                <div className="text-5xl font-bold text-[#461711] leading-tight">
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
            <div className="mt-16 lg:mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40rem] items-center">
                    {/* Image Column */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 lg:col-span-1">
                        <img
                        src="https://me-website-assets.s3.ap-south-1.amazonaws.com/ytp_collab/ytp.jpeg"
                        alt="International Collaboration - The Yellow Tulip Project"
                        className="w-full h-auto rounded-xl shadow-lg"
                        />
                    </div>

                    {/* Text Column */}
                    <div className="text-center lg:text-left lg:col-span-2">
                        <h2 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
                            International Collaboration
                        </h2>
                        <p className="text-5xl sm:text-6xl text-gray-600 mx-auto lg:mx-0 leading-relaxed">
                            Partnering globally to break mental health stigma
                        </p>
                        <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto lg:mx-0 rounded-full mt-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;