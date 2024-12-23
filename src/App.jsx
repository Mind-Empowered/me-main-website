import "./App.css";

import { ImageZoom } from "./ImageZoom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "react-photo-view/dist/react-photo-view.css";
import { useEffect, useRef, useState } from "react";

import TrainersGallery from './components/gallery';
import EventCalendar from "./components/Calender";
import Newsletter from "./components/Newsletter";
import Team from "./components/team";

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

function App() {
  // Add error state
  const [error, setError] = useState(null);

  // Add error handling for testimonials and photoGallery
  const [testimonials, setTestimonials] = useState([]);
  const [photoGallery, setPhotoGallery] = useState([]);

  useEffect(() => {
    try {
      // Move the testimonials creation into useEffect
      let tempTestimonials = [];
      for (let index = 1; index < 8; index++) {
        tempTestimonials.push({
          original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
          thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
        });
      }
      setTestimonials(tempTestimonials);

      // Move the photoGallery creation into useEffect
      let tempPhotoGallery = [];
      for (let index = 0; index < 18; index++) {
        tempPhotoGallery.push({
          original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
          thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
        });
      }
      setPhotoGallery(tempPhotoGallery);
    } catch (err) {
      console.error("Error initializing galleries:", err);
      setError(err.message);
    }
  }, []);

  // Add error boundary in the return
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading the application: {error}
        </div>
      </div>
    );
  }

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

  const missionRef = useRef(null);
  const faqsRef = useRef(null);
  const calendarRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (ref) => {
    const offset = 80; // height of navbar + some padding
    const elementPosition = ref.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };


  return (
    <div className="min-h-screen">
      <div className="relative">
        <img src="/landing-bg.gif" alt="landing-bg" className="w-full h-screen object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffdb5b]/95 backdrop-blur-sm shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <img 
                src="/logo192.png" 
                alt="logo192" 
                className="h-12 w-auto md:h-16 object-contain" 
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection(missionRef)}
                className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
              >
                Mission
              </button>
              
              <button 
                onClick={() => scrollToSection(storyRef)}
                className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
              >
                Story
              </button>
              <button 
                onClick={() => scrollToSection(teamRef)}
                className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection(calendarRef)}
                className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
              >
                Calendar
              </button>
              <button 
                onClick={() => scrollToSection(faqsRef)}
                className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
              >
                FAQs
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#461711] hover:text-[#ff7612] hover:bg-[#ffdb5b] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ff7612] transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-[#ffdb5b] shadow-lg`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection(missionRef)}
              className="block w-full text-left px-3 py-2 text-[#461711] hover:bg-[#ff7612]/10 rounded-md font-medium transition-colors duration-200"
            >
              Mission
            </button>
            <button
              onClick={() => scrollToSection(faqsRef)}
              className="block w-full text-left px-3 py-2 text-[#461711] hover:bg-[#ff7612]/10 rounded-md font-medium transition-colors duration-200"
            >
              FAQs
            </button>
            <button
              onClick={() => scrollToSection(calendarRef)}
              className="block w-full text-left px-3 py-2 text-[#461711] hover:bg-[#ff7612]/10 rounded-md font-medium transition-colors duration-200"
            >
              Calendar
            </button>
            <button
              onClick={() => scrollToSection(storyRef)}
              className="block w-full text-left px-3 py-2 text-[#461711] hover:bg-[#ff7612]/10 rounded-md font-medium transition-colors duration-200"
            >
              Story
            </button>
            <button
              onClick={() => scrollToSection(teamRef)}
              className="block w-full text-left px-3 py-2 text-[#461711] hover:bg-[#ff7612]/10 rounded-md font-medium transition-colors duration-200"
            >
              Team
            </button>
          </div>
        </div>
      </nav>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="uppercase text-4xl md:text-7xl font-extrabold tracking-wider animate-fade-in">
          <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Mind <br /> Empowered
          </span>
        </div>
        <div className="italic font-semibold text-2xl md:text-4xl pt-4 md:pt-6 animate-fade-in-delay">
          <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Illuminating minds. Transforming lives.
          </span>
        </div>
        <div className="font-black text-2xl pt-6 animate-fade-in-delay-2 tracking-wide">
          <span className="text-[#ffdb5b] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-shadow-[0_4px_8px_rgba(0,0,0,0.8)] hover:text-white transition-colors duration-300 font-mono">
            #MEforYouth
          </span>
        </div>
      </div>

      <div className="z-2 bottom-6 right-6 fixed transition-transform hover:scale-110 cursor-pointer">
        <div className="bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full shadow-lg">
          <img src="/logo192.png" alt="chat" className="w-20" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mx-4 md:mx-32 gap-10 md:gap-20 justify-center mt-20">
        <div className="mission-vision-container">
          <div className="mission-vision-card">
            <div className="flex flex-col items-center gap-6">
              <img src="/vision.png" alt="vision" className="w-48 h-48 object-contain" />
              <div>
                <h2 className="text-4xl font-bold italic color-[#461711] mb-4">Our Vision</h2>
                <p className="text-xl">
                  Empowering{" "}
                  <span className="inline-highlight-1">Individuals</span>{" "}
                  to navigate life with{" "}
                  <span className="inline-highlight-1">Emotional Resilience</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mission-vision-card">
            <div className="flex flex-col items-center gap-6">
              <img src="/mission.png" alt="mission" className="w-48 h-48 object-contain" />
              <div>
                <h2 ref={missionRef} className="text-4xl font-bold italic color-[#461711] mb-4">
                  Our Mission
                </h2>
                <p className="text-xl">
                  Championing the cause of mental health through{" "}
                  <span className="inline-highlight-1">Awareness</span>,{" "}
                  <span className="inline-highlight-1">Education</span>,{" "}
                  <span className="inline-highlight-1">Advocacy</span> and Creating
                  an empathetic community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Newsletter />     

      <div className="px-4 md:px-28 py-10 mt-5 bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="text-3xl font-bold color-[#461711] w-full">
          Our Objectives
        </div>
        <div className="mt-10 flex flex-col md:flex-row justify-between gap-10">
          <div className="flex   gap-4 ">
            <img src="/obj1.png" alt="obj1" width={160} />
            <div>
              <div className="text-xl font-semibold">
                Self Awareness through
              </div>
              <ul className="list-disc">
                <li>Webinars</li>
                <li>Mental Health Workshops</li>
                <li>Offline Events</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-6">
            <img src="/obj2.png" alt="obj2" width={160} />
            <div>
              <div className="text-xl font-semibold">
                Self-Expression through
              </div>
              <ul className="list-disc">
                <li>Events for showcasing skills</li>
                <li>Volunteering for Community Initiatives</li>
                <li>Support Groups</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-6">
            <img src="/obj3.png" alt="obj3" width={160} />
            <div>
              <div className="text-xl font-semibold">
                Self Sufficiency through
              </div>
              <ul className="list-disc">
                <li>Technical Workshops</li>
                <li>Creative Workshops</li>
                <li>Soft Skills Workshops</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div ref={storyRef} className="px-28 mt-10">
        <div className="text-3xl font-bold color-[#461711] w-full">
          ME Story
        </div>
        <div className="flex gap-10 mt-5">
          <div>
            Mind Empowered (ME) is a charitable organization based in India.
            <br />
            <br />
            It is the brainchild of Maya Menon and her sister - two sisters who
            resonate positivity and happiness wherever they go. During the
            lockdown period, the sisters started conducting free online classes
            on Spoken English and Interview Skills for college students across
            India.
            <br />
            Through close association with students, they realized Gen-Z was
            grappling with Anxiety, Sexual abuse, Depression, Mood swings, Fear,{" "}
            Anger, Loneliness, Low self-esteem, Body shaming, Cyberbullying,{" "}
            Stress, Substance addiction. Many were experiencing Insomnia Eating
            disorders, Domestic violence, Social seclusion and Suicidal
            thoughts. Personality disorders facing myriad mental health issues
            in ways they never did before.
            <br />
            The sisters realized there was a strong need to eliminate stigma
            associated with mental illness from our society. Hence, the idea of
            an open forum to help the students came to life by forming "ME". ME
            started off in October 2020 on World Mental Health Day, with
            enriching and inspiring online sessions for the youth conducted by
            our expert Empowering Coaches, completely free of charge. ME
            reiterates, "Don't Suffer in Silence. Let's talk About Mental
            Health".
          </div>
          <img src="/mestory.svg" alt="mestory" />
        </div>
      </div>

      <div ref={calendarRef} className="px-4 md:px-28 py-10">
        <div className="text-3xl font-bold color-[#461711] mb-8">
          Events
        </div>
        <EventCalendar />
      </div>

      <div className="testimonial-section">
        <div className="testimonial-container">
          <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
            Testimonials
          </div>
          <div className="mx-28 mt-10">
            {testimonials.length > 0 ? (
              <ImageGallery 
                items={testimonials} 
                autoPlay={false} 
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                additionalClass="testimonial-card hover:transform hover:translate-y-[-5px] transition-all duration-300"
              />
            ) : (
              <div>Loading testimonials...</div>
            )}
          </div>
        </div>
      </div>

      <div ref={teamRef} className="px-4 md:px-28 py-10">
        <Team />
      </div>     

      <div className="bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          <TrainersGallery />
        </div>
      </div>
      
      <div className="bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="gallery-wrapper">
          <div className="gallery-title">
            Photo Gallery
          </div>
          <div className="mx-28 mt-10">
            {photoGallery.length > 0 ? (
              <ImageGallery 
                items={photoGallery} 
                autoPlay={true}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                additionalClass="gallery-item hover:transform hover:translate-y-[-5px] transition-all duration-300"
              />
            ) : (
              <div>Loading gallery...</div>
            )}
          </div>
        </div>
      </div>

      <div ref={faqsRef} className="px-4 md:px-28 my-20">
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
      <div className="bg-gradient-to-r from-[#461711] to-[#ff7612] text-white p-10 mt-10 text-center">
        Mind Empowered © 2024
      </div>
    </div>
  );
}

export default App;
