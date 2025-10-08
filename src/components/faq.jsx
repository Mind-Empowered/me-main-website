import React, { useState } from "react";

function Accordion(props) {
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="group w-full p-12 lg:p-16 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:bg-gray-50"
          onClick={props.toggleAccordion}
        >
          <span className="font-bold text-4xl lg:text-6xl text-[#461711] pr-8 tracking-wide transition-colors duration-300 group-hover:text-[#ff7612]">{props.title}</span>
          <span
            className={`flex-shrink-0 transform ${props.isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-300 text-[#ff7612]`}
          >
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {props.isOpen && (
          <div className="p-12 lg:p-16 bg-gradient-to-r from-gray-50 to-white text-gray-700 leading-relaxed text-4xl border-t border-gray-100 tracking-wide">
            <p className="text-5xl">{props.data}</p>
          </div>
        )}
      </div>
    );
  }

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [accordions, setAccordion] = useState([
    {
      key: 0,
      title: "How can ME help me?",
      data: "ME conducts free webinars every Saturday with mental, physical and personality development experts to give you an access to reliable information and guide you on your path towards healing and happiness. ME puts forth an open forum where you feel safe to discuss your emotions without the fear of being ridiculed or misunderstood.",
      isOpen: false,
    },
    {
      key: 1,
      title: "Why should I attend these sessions and speak up about my issues?",
      data: "ME provides you with a platform to interact with mental health experts from all around the globe for free. Instead of clearing your doubts via google, which may not always be a reliable source, you can get in touch with these professionals every Saturday 4:00pm to 5:00pm for free. Online sessions can be attended from the comfort of your homes Anonymity is preserved.",
      isOpen: false,
    },
    {
      key: 2,
      title: "How can we ensure that our identity is not revealed?",
      data: "In order to ensure anonymity, we don't force our participants to switch on the camera or unmute themselves during our online sessions. The students are free to use the chat box to interact with the experts.",
      isOpen: false,
    },
    {
      key: 3,
      title: "How can I send across my queries directly to the experts?",
      data: "ME floats a Google form periodically wherein you are free to anonymously send in any queries. Our panel doctors answer these queries during the month-end sessions.",
      isOpen: false,
    },
  ]);

  const toggleAccordion = (accordionkey) => {
    const updatedAccordions = accordions.map((accord) => {
      if (accord.key === accordionkey) {
        return { ...accord, isOpen: !accord.isOpen };
      } else {
        return { ...accord, isOpen: false };
      }
    });

    setAccordion(updatedAccordions);
  };

  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-10 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
            Frequently Asked Questions
          </span>
        </h1>
        <p className="text-5xl sm:text-6xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
          Find answers to common questions about our programs and services
        </p>
        <div className="w-36 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full mt-10"></div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {accordions.map((accordion) => (
          <Accordion
            key={accordion.key}
            title={accordion.title}
            data={accordion.data}
            isOpen={accordion.isOpen}
            toggleAccordion={() => toggleAccordion(accordion.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
