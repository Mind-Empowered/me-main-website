import React, { useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const newsletters = [
  { src: "/NL/NLAugust2025.png", alt: "August 2025 Newsletter" },
  { src: "/NL/NLJuly2025.png", alt: "July 2025 Newsletter" },
  { src: "/NL/NLJune2025.png", alt: "June 2025 Newsletter" },
  { src: "/NL/NLMay2025.png", alt: "May 2025 Newsletter" },
  { src: "/NL/NLapril2025.jpeg", alt: "April 2025 Newsletter" },
  { src: "/NL/NLmarch2025.jpeg", alt: "March 2025 Newsletter" },
  { src: "/NL/NLfeb2025.jpeg", alt: "February 2025 Newsletter" },
  { src: "/NL/NLjan2025.jpeg", alt: "January 2025 Newsletter" },
  { src: "/NL/NLdecember2024.png", alt: "December 2024 Newsletter" },
  { src: "/NL/NLnov2024.jpg", alt: "November 2024 Newsletter" },
  { src: "/NL/NLOct2024.jpg", alt: "October 2024 Newsletter" },
  { src: "/NL/NLSept2024.jpeg", alt: "September 2024 Newsletter" },
  { src: "/NL/NLAugust2024.jpeg", alt: "August 2024 Newsletter" },
  { src: "/NL/NLJuly2024.jpeg", alt: "July 2024 Newsletter" },
  { src: "/NL/NLJune2024.jpg", alt: "June 2024 Newsletter" },
  { src: "/NL/NLMay2024.jpg", alt: "May 2024 Newsletter" },
];

// The latest newsletter is always the first one in the array.
const latestNewsletter = newsletters[0];

const Newsletter = () => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        const scrollAmount = 300; // Adjust scroll amount as needed
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div>
          <div className="text-center mb-28">
            <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                Stay Informed
              </span>
            </h1>
            <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-10 rounded-full"></div>
            <p className="text-5xl sm:text-6xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
              Subscribe to receive updates and latest news via email
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20 items-start">
            {/* Newsletter Subscription */}
            <div className="space-y-8 lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-16 lg:p-24 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  {/* Left Column: Text and Form */}
                  <div className="space-y-12">
                    <h2 className="text-8xl sm:text-9xl font-bold text-[#461711] mb-6">
                      Newsletter Subscription
                    </h2>
                    <p className="text-5xl sm:text-6xl text-gray-600 leading-relaxed">
                      Get the latest updates on our mental health initiatives, upcoming events, and resources delivered directly to your inbox.
                    </p>
                    <div className="max-w-3xl w-full">
                      <div className="flex flex-col sm:flex-row gap-12">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          className="flex-1 border-8 border-[#461711] rounded-2xl p-14 text-6xl placeholder:text-5xl focus:ring-8 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
                        />
                        <button
                          className="rounded-2xl text-white font-bold bg-[#461711] px-28 py-14 hover:bg-[#ff7612] transition-all duration-300 text-6xl shadow-2xl hover:shadow-2xl transform hover:-translate-y-2"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Right Column: Image */}
                  <div className="flex items-center justify-center">
                    <img src="/newsletter-gh.png" alt="Newsletter Graphic" className="w-full max-w-4xl" />
                  </div>
              </div>
              </div>

              {/* Previous Newsletters */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-hidden">
                <h2 className="text-8xl sm:text-9xl font-bold text-[#461711] mb-12 text-center">
                  Previous Newsletters
                </h2>
                <div className="relative">
                    <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-6 shadow-lg transition-all duration-300">
                        <svg className="w-12 h-12 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <PhotoProvider maskOpacity={0.9}>
                    <div ref={scrollContainerRef} className="relative w-full h-[48rem] flex items-center overflow-x-hidden">
                        <div className="flex animate-marquee hover:pause group/gallery">
                        {[...newsletters.slice(1), ...newsletters.slice(1)].map((newsletter, index) => (
                            <div key={index} className="group/item flex-shrink-0 mx-8">
                            <PhotoView src={newsletter.src}>
                                <div className="w-[36rem] h-[48rem] rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-2xl">
                                <img 
                                    src={newsletter.src} 
                                    alt={newsletter.alt} 
                                    className="w-full h-full object-cover cursor-pointer" 
                                />
                                </div>
                            </PhotoView>
                            </div>
                        ))}
                        </div>
                    </div>
                    </PhotoProvider>
                    <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-6 shadow-lg transition-all duration-300">
                        <svg className="w-12 h-12 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
              </div>
            </div>

            {/* Latest Newsletter Display */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <h2 className="text-8xl sm:text-9xl font-bold text-[#461711] mb-12">
                  Latest Newsletter
                </h2>
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 p-4">
                  <PhotoProvider maskOpacity={0.9}>
                    <PhotoView src={latestNewsletter.src}>
                      <img 
                        src={latestNewsletter.src} 
                        alt={latestNewsletter.alt} 
                        className="cursor-pointer w-full h-auto object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
       );
    };

export default Newsletter;