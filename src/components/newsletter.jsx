import { useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { translations } from '../translations';

const newsletters = [
  { src: "/NL/2025/NLNov2025.jpg", alt: "November 2025 Newsletter" },
  { src: "/NL/2025/NLOct2025.jpg", alt: "October 2025 Newsletter" },
  { src: "/NL/2025/NLSept2025.jpg", alt: "September 2025 Newsletter" },
  { src: "/NL/2025/NLAugust2025.png", alt: "August 2025 Newsletter" },
  { src: "/NL/2025/NLJuly2025.png", alt: "July 2025 Newsletter" },
  { src: "/NL/2025/NLJune2025.png", alt: "June 2025 Newsletter" },
  { src: "/NL/2025/NLMay2025.png", alt: "May 2025 Newsletter" },
  { src: "/NL/2025/NLapril2025.jpeg", alt: "April 2025 Newsletter" },
  { src: "/NL/2025/NLmarch2025.jpeg", alt: "March 2025 Newsletter" },
  { src: "/NL/2025/NLfeb2025.jpeg", alt: "February 2025 Newsletter" },
  { src: "/NL/2025/NLjan2025.jpeg", alt: "January 2025 Newsletter" },
  { src: "/NL/2024/NLdecember2024.png", alt: "December 2024 Newsletter" },
  { src: "/NL/2024/NLnov2024.jpg", alt: "November 2024 Newsletter" },
  { src: "/NL/2024/NLOct2024.jpg", alt: "October 2024 Newsletter" },
  { src: "/NL/2024/NLSept2024.jpeg", alt: "September 2024 Newsletter" },
  { src: "/NL/2024/NLAugust2024.jpeg", alt: "August 2024 Newsletter" },
  { src: "/NL/2024/NLJuly2024.jpeg", alt: "July 2024 Newsletter" },
  { src: "/NL/2024/NLJune2024.jpg", alt: "June 2024 Newsletter" },
  { src: "/NL/2024/NLMay2024.jpg", alt: "May 2024 Newsletter" },
];

// The latest newsletter is always the first one in the array.
const latestNewsletter = newsletters[0];

const Newsletter = ({ language }) => {
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
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" >
            {translations.newsletter.title[language]}
          </span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.newsletter.subtitle[language]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Latest Newsletter Display (Mobile: Order 1, Desktop: Order 2) */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="text-center" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#461711] mb-6" >
              {translations.newsletter.latestTitle[language]}
            </h2>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 p-2">
              <PhotoProvider maskOpacity={0.9}>
                <PhotoView src={latestNewsletter.src}>
                  <img
                    src={latestNewsletter.src}
                    alt={latestNewsletter.alt}
                    className="cursor-pointer w-full h-auto object-cover transition-transform duration-300"
                  />
                </PhotoView>
              </PhotoProvider>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-6 lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column: Text and Form */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#461711]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                  {translations.newsletter.formTitle[language]}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                  {translations.newsletter.formSubtitle[language]}
                </p>
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder={translations.newsletter.formPlaceholder[language]}
                      className="flex-1 border-2 border-[#461711] rounded-lg p-3 text-base placeholder:text-base focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all duration-200"
                    />
                    <button
                      className="rounded-lg text-white font-bold bg-[#461711] px-6 py-3 transition-all duration-300 text-base shadow-lg" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}
                    >
                      {translations.newsletter.formButton[language]}
                    </button>
                  </div>
                </div>
              </div>
              {/* Right Column: Image */}
              <div className="flex items-center justify-center">
                <img src="/newsletter-gh.png" alt="Newsletter Graphic" className="w-full max-w-sm" />
              </div>
            </div>
          </div>

          {/* Previous Newsletters */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#461711] mb-6 text-center" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.newsletter.previousTitle[language]}
            </h2>
            <div className="relative">
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow-lg transition-all duration-300">
                <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <PhotoProvider maskOpacity={0.9}>
                <div ref={scrollContainerRef} className="relative w-full h-[8rem] flex items-center overflow-x-hidden">
                  <div className="flex animate-marquee group/gallery">
                    {[...newsletters.slice(1), ...newsletters.slice(1)].map((newsletter, index) => (
                      <div key={index} className="flex-shrink-0 mx-2 sm:mx-4">
                        <PhotoView src={newsletter.src}>
                          <div className="w-[5rem] h-[7rem] sm:w-[6rem] sm:h-[8rem] rounded-lg overflow-hidden shadow-md transition-all duration-300">
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
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-2 shadow-lg transition-all duration-300">
                <svg className="w-6 h-6 text-[#461711]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;