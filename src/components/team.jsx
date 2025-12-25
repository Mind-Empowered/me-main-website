import React, { useRef, useState, useEffect } from 'react';
import { translations } from '../translations';

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

const s3BucketURL = "https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/";

const Team = ({ language }) => {
    const scrollRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeMember, setActiveMember] = useState(null);

    // Intersection Observer for mobile animations
    useEffect(() => {
        const observerOptions = {
            root: scrollRef.current,
            threshold: 0.6, // Trigger when 60% of card is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveMember(entry.target.getAttribute('data-key'));
                }
            });
        }, observerOptions);

        const cards = scrollRef.current?.querySelectorAll('.team-card');
        cards?.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [language]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            setScrollProgress(progress);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Double the coach list for seamless infinite scroll
    const coachesExtended = [...imageFilenames, ...imageFilenames];

    return (
        <div className="relative isolate">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-infinite {
                    display: flex;
                    width: max-content;
                    animation: marquee 60s linear infinite;
                }
                .animate-marquee-infinite:hover {
                    animation-play-state: paused;
                }
                .team-card-active .glow-ring { opacity: 1; transform: rotate(180deg); }
                .team-card-active img { filter: grayscale(0); transform: scale(1.1); }
                .team-card-active .pulse-tag { transform: scale(1); }
                `}
            </style>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl animate-pulse" />

            <div className="text-center mb-16 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-[#ff7612] text-xs font-bold tracking-widest uppercase mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
                    Our Leadership
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-[#461711] mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7612] to-[#ffdb5b]">
                        {translations.team.title[language]}
                    </span>
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 rounded-full"></div>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                    {translations.team.subtitle[language]}
                </p>
            </div>

            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar"
                >
                    {translations.teamMembers.map((member) => (
                        <div
                            key={member.key}
                            data-key={member.key}
                            className={`team-card flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-full snap-center md:snap-align-none bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col group overflow-hidden relative ${activeMember === member.key ? 'team-card-active md:group-hover:team-card-active' : ''}`}
                        >
                            {/* Card Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ff7612]/5 to-transparent rounded-bl-full -z-0 transition-transform duration-500 group-hover:scale-150" />

                            <div className="relative z-10 p-8 flex flex-col items-center text-center h-full">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8">
                                    {/* Rotating Glow Ring */}
                                    <div className="glow-ring absolute -inset-2 bg-gradient-to-tr from-[#ff7612] to-[#ffdb5b] rounded-full blur-md opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />

                                    <div className="relative w-full h-full rounded-full p-1.5 bg-white shadow-xl">
                                        <img
                                            src={member.image}
                                            alt={member.name[language]}
                                            className="rounded-full w-full h-full object-cover grayscale md:group-hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>

                                    {/* Active Pulse Tag */}
                                    <div className="pulse-tag absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#ff7612] transform scale-0 md:group-hover:scale-100 transition-transform duration-500 delay-100">
                                        <div className="w-2 h-2 bg-[#ff7612] rounded-full animate-ping" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-[#461711] mb-2 tracking-tight group-hover:text-[#ff7612] transition-colors duration-300">
                                    {member.name[language]}
                                </h3>
                                <div className="px-4 py-1 rounded-full bg-orange-50 text-[#ff7612] text-sm font-bold mb-6 border border-orange-100">
                                    {member.role[language]}
                                </div>

                                <div className="flex-grow flex flex-col">
                                    <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-6 group-hover:line-clamp-none transition-all duration-500" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                        {member.bio[language]}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-100 flex justify-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-orange-200 group-hover:bg-[#ff7612] transition-colors duration-300" />
                                        <div className="w-2 h-2 rounded-full bg-orange-200 group-hover:bg-[#ff7612] transition-colors duration-300 delay-75" />
                                        <div className="w-2 h-2 rounded-full bg-orange-200 group-hover:bg-[#ff7612] transition-colors duration-300 delay-150" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Progress Indicator for Team */}
                <div className="md:hidden mt-4 px-12">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#ffdb5b] to-[#ff7612] transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(255,118,18,0.3)]"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ME Empowerment Coaches Section - Automatic Infinite Marquee */}
            <div className="mt-24 lg:mt-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-64 h-64 bg-yellow-50/50 rounded-full blur-3xl" />

                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#461711]/5 text-[#461711] text-xs font-bold tracking-widest uppercase mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#461711]"></span>
                        Expert Mentorship
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-[#461711] mb-6">
                        {translations.team.coachesTitle[language]}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {translations.team.coachesSubtitle[language]}
                    </p>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="relative group/marquee bg-white py-12 border-y border-gray-50">
                    <div className="animate-marquee-infinite">
                        {coachesExtended.map((filename, index) => {
                            const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
                            return (
                                <div
                                    key={`${trainerName}-${index}`}
                                    className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[15vw] mx-4 bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffdb5b] to-[#ff7612] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                    <div className="text-center">
                                        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-50 aspect-square flex items-center justify-center p-4">
                                            <img
                                                src={`${s3BucketURL}${filename}`}
                                                alt={trainerName}
                                                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="text-xs md:text-sm font-black text-[#461711] leading-tight group-hover:text-[#ff7612] transition-colors duration-300 px-2 uppercase tracking-wide">
                                            {trainerName}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Faded edges for better premium look */}
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default Team;
