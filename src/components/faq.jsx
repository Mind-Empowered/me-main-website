import React, { useState } from "react";
import { translations } from "../translations";

const Accordion = ({ title, data, isOpen, toggleAccordion, language }) => {
  const contentRef = React.useRef(null);

  return (
    <div
      className={`transition-all duration-500 rounded-2xl border h-fit ${isOpen
        ? "bg-orange-50/40 border-[#ff7612]/30 shadow-lg"
        : "bg-white border-gray-100"
        }`}
    >
      <button
        className="w-full p-5 text-left flex justify-between items-center group focus:outline-none"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span
          className={`font-bold text-base md:text-lg tracking-tight transition-colors duration-300 pr-4 ${isOpen ? "text-[#ff7612]" : "text-[#461711]"
            }`}
          style={{ fontFamily: language === "ml" ? "Manjari, sans-serif" : "inherit" }}
        >
          {title}
        </span>
        <div
          className={`flex-shrink-0 p-2 rounded-xl transition-all duration-500 ${isOpen
            ? "bg-[#ff7612] text-white rotate-180"
            : "bg-gray-100 text-gray-500"
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px" }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div
          className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed text-sm md:text-base"
          style={{ fontFamily: language === "ml" ? "Manjari, sans-serif" : "inherit" }}
        >
          <div className="h-0.5 w-10 bg-[#ff7612]/20 mb-3 rounded-full" />
          {data}
        </div>
      </div>
    </div>
  );
};

const FAQ = ({ language }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const toggleAccordion = (key) => {
    setActiveIndex(activeIndex === key ? null : key);
  };

  const allItems = translations.accordions;
  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const handleViewMore = () => {
    if (visibleCount === 4) {
      setVisibleCount(6);
    } else {
      setVisibleCount(allItems.length);
    }
  };

  return (
    <div className="relative isolate w-full">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 w-48 h-48 bg-[#461711]/5 rounded-full blur-2xl opacity-50" />

      {/* Header */}
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-[#ff7612] text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
          Support Center
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#461711] mb-4 leading-tight"
          style={{ fontFamily: language === "ml" ? "Manjari, sans-serif" : "inherit" }}
        >
          {translations.faq.title[language]}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-5 rounded-full"></div>
        <p
          className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
          style={{ fontFamily: language === "ml" ? "Manjari, sans-serif" : "inherit" }}
        >
          {translations.faq.subtitle[language]}
        </p>
      </div>

      {/* Single-column accordion list */}
      <div className="flex flex-col gap-4 mb-10">
        {visibleItems.map((accordion) => (
          <Accordion
            key={accordion.key}
            title={accordion.title[language]}
            data={accordion.data[language]}
            isOpen={activeIndex === accordion.key}
            toggleAccordion={() => toggleAccordion(accordion.key)}
            language={language}
          />
        ))}
      </div>

      {/* View More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleViewMore}
            className="group flex items-center gap-3 px-8 py-3.5 bg-white border-2 border-[#ff7612]/20 rounded-2xl font-bold text-[#461711] hover:bg-[#ff7612] hover:text-white hover:border-[#ff7612] transition-all duration-300 shadow-xl shadow-orange-100/50 hover:shadow-[#ff7612]/20 active:scale-95"
          >
            <span className="text-sm uppercase tracking-widest">
              {visibleCount === 4 ? (language === 'en' ? 'View 2 More' : '2 എണ്ണം കൂടി കാണുക') : (language === 'en' ? 'View All Questions' : 'എല്ലാ ചോദ്യങ്ങളും കാണുക')}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 group-hover:translate-y-1 ${visibleCount !== 4 ? 'animate-bounce' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQ;
