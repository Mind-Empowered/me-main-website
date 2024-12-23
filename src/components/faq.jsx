import React, { useState } from "react";

function Accordion(props) {
    return (
      <div className="border rounded-md mb-1">
        <button
          className="w-full p-4 text-left bg-gray-200
                          hover:bg-gray-300 transition duration-300"
          onClick={props.toggleAccordion}
        >
          {props.title}
          <span
            className={`float-right transform ${props.isOpen ? "rotate-180" : "rotate-0"
              }
              transition-transform duration-300`}
          >
            &#9660;
          </span>
        </button>
        {props.isOpen && <div className="p-4 bg-white">{props.data}</div>}
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
    <div className="p-4">
      <div className="text-3xl font-bold color-[#461711] pb-2 w-100 mt-10">
          FAQs
        </div>
        <div className="mt-5">
          {accordions.map((accordion) => (
            <Accordion
              key={accordion.key}
              title={accordion.title}
              data={accordion.data}
              isOpen={accordion.isOpen}
              toggleAccordion={() => toggleAccordion(accordion.key)}
              className="hover:shadow-md transition-shadow duration-300"
            />
          ))}
        </div>
    </div>
  );
};

export default FAQ;
