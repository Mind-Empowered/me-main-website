import React, { useState } from "react";

const Accordion = ({ title, data, isOpen, toggleAccordion }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="group w-full p-4 md:p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-gray-50"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className="font-bold text-lg md:text-xl text-[#461711] pr-4 tracking-wide transition-colors duration-300 group-hover:text-[#ff7612]">{title}</span>
        <span className={`flex-shrink-0 transform ${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-300 text-[#ff7612]`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white text-gray-700 leading-relaxed text-base md:text-lg border-t border-gray-100 tracking-wide">
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [accordions, setAccordion] = useState([
    {
      key: 0,
      title: "How can ME help me?",
      data: "ME conducts free webinars every Saturday with mental, physical and personality development experts to give you an access to reliable information and guide you on your path towards healing and happiness. ME puts forth an open forum where you feel safe to discuss your emotions without the fear of being ridiculed or misunderstood."
    },
    {
      key: 1,
      title: "Why should I attend these sessions and speak up about my issues?",
      data: "ME provides you with a platform to interact with mental health experts from all around the globe for free. Instead of clearing your doubts via google, which may not always be a reliable source, you can get in touch with these professionals every Saturday 4:00pm to 5:00pm for free. Online sessions can be attended from the comfort of your homes Anonymity is preserved."
    },
    {
      key: 2,
      title: "How can we ensure that our identity is not revealed?",
      data: "In order to ensure anonymity, we don't force our participants to switch on the camera or unmute themselves during our online sessions. The students are free to use the chat box to interact with the experts."
    },
    {
      key: 3,
      title: "How can I send across my queries directly to the experts?",
      data: "ME floats a Google form periodically wherein you are free to anonymously send in any queries. Our panel doctors answer these queries during the month-end sessions."
    },
  ]);

  const toggleAccordion = (key) => {
    // If the clicked accordion is already open, close it. Otherwise, open it.
    const newIndex = activeIndex === key ? null : key;
    setActiveIndex(newIndex);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 md:mb-6 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
            Frequently Asked Questions
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Find answers to common questions about our programs and services
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-4 md:mt-6"></div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {accordions.map((accordion) => (
          <Accordion
            key={accordion.key}
            title={accordion.title}
            data={accordion.data}
            isOpen={activeIndex === accordion.key}
            toggleAccordion={() => toggleAccordion(accordion.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
