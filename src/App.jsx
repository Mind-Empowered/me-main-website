import "./App.css";
import { ImageZoom } from "./ImageZoom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useEffect, useRef, useState } from "react";
import Gallery from './components/gallery';
import Calender from "./components/Calender";
import axios from "axios";

// Accordion.js

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


  let testimonials = [];
  for (let index = 1; index < 8; index++) {
    testimonials.push({
      original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
      thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/testimonials/2024/ME_testimonials+(${index}).jpg`,
    });
  }
  let photoGallery = [];
  for (let index = 0; index < 18; index++) {
    photoGallery.push({
      original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
      thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/gallery/2024/Mind+Empowered+Activities-images-${index}.jpg`,
    });
  }
  let trainersGallery = [];
  for (let index = 1; index < 7; index++) {
    trainersGallery.push({
      original: `https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/Trainer+${index}.jpeg`,
      thumbnail: `https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/Trainer+${index}.jpeg`,
    });
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

  //Scroll Navigation

  const missionRef = useRef(null);
  const faqsRef = useRef(null);
  const calendarRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);

  // Add this state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update the scroll behavior to be more precise
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
    <div>
      <div>
        <img src="/landing-bg.gif" alt="landing-bg" className="w-full" />
      </div>
      <div className="absolute top-0 w-full">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#ffdb5b] shadow-md transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <img src="/logo192.png" alt="logo192" className="h-12 w-20 md:h-16 md:w-28" />
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
                  onClick={() => scrollToSection(faqsRef)}
                  className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
                >
                  FAQs
                </button>
                <button 
                  onClick={() => scrollToSection(calendarRef)}
                  className="text-[#461711] hover:text-[#ff7612] font-medium transition-colors duration-200"
                >
                  Calendar
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

        <div className="grid place-items-center pt-20 md:pt-28">
          <div className="uppercase text-4xl md:text-7xl font-bold tracking-widest text-center text-[#461711]">
            Mind <br /> Empowered
          </div>
          <div className="italic font-thin text-[#461711] text-2xl md:text-4xl pt-4 md:pt-6">
            Illuminating minds. Transforming lives.
          </div>
          <div className="font-thin text-[#461711] text-2xl pt-6">
            #MEforYouth
          </div>
        </div>
      </div>
      <div className="z-2 bottom-6 right-6 fixed">
        <div className="bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full">
          <img src="/logo192.png" alt="chat" className="w-20" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mx-4 md:mx-32 gap-10 md:gap-20 justify-center" id="mission">
        <div className="flex w-100 justify-center gap-10 mt-20">
          <div>
            <img src="/vision.png" alt="mission" className="w-80" />
          </div>
          <div>
            <div className="text-5xl font-bold italic color-[#461711]">
              Our Vision
            </div>
            <div className="mt-2 text-xl">
              Empowering {" "}
              <span className="inline-highlight-1">Individuals</span> {" "}
              to navigate life with{" "}
              <span className="inline-highlight-1">Emotional Resilience</span>.{" "}

            </div>
          </div>
        </div>

        <div className="sm:flex w-100 justify-center gap-10 mt-20">
          <div>
            <img src="/mission.png" alt="mission" className="w-80" />
          </div>
          <div>
            <div ref={missionRef} className="text-5xl  font-bold italic color-[#461711]">
              Our Mission
            </div>
            <div className="mt-2 text-xl">
              Championing the cause of mental health through{" "}
              <span className="inline-highlight-1 ">Awareness</span>,{" "}
              <span className="inline-highlight-1">Education</span>,{" "}
              <span className="inline-highlight-1">Advocacy</span> and Creating
              an empathetic community.
            </div>
          </div>
        </div>
      </div>

      {/* <div className="text-base md:text-3xl lg:text-7xl">
          This text will change size on different screen widths.
        </div> */}


      <div className="px-4 md:px-28 flex flex-col md:flex-row mt-10 justify-center gap-10 md:gap-20">
        <div>
          <div className="text-3xl font-semibold text-[#461711] mt-10">
            Stay Informed with Our Newsletter
          </div>
          <div>
            <p className="mt-10 mb-2">
              Subscribe to receive updates and lates news on mail.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="border-2 border-[#461711] rounded-md p-2"
              />
              <input
                type="button"
                value="Subscribe"
                className="rounded-md border-2 text-white font-bold bg-[#461711] p-2"
              />
            </div>
          </div>
          <div></div>
          <img src="/newsletter-gh.png" alt="" className="w-80" />
          <div>
            <PhotoProvider>
              <div className="italic mb-2">Our previous newsletters</div>
              <div className="flex gap-4">
                <PhotoView src="/NLAugust2024.jpeg">
                  <img src="/NLAugust2024.jpeg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NLJuly2024.jpeg">
                  <img src="/NLJuly2024.jpeg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NLJune2024.jpg">
                  <img src="/NLJune2024.jpg" alt="" width={100} />
                </PhotoView>
                <PhotoView src="/NLMay2024.jpg">
                  <img src="/NLMay2024.jpg" alt="" width={100} />
                </PhotoView>
              </div>
            </PhotoProvider>
          </div>
        </div>
        <div className="w-100">
          <PhotoProvider>
            <PhotoView src="/NLSept2024.jpeg">
              <img src="/NLSept2024.jpeg" alt="" width={600} />
            </PhotoView>
          </PhotoProvider>
        </div>
      </div>

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

      <div ref={calendarRef}>
        {/* <Calender /> */}
      </div>

      <div className="flex justify-center my-3">
        <img
          src="/novEvent.jpg"
          alt="august2024"
          className="self-start"
          width={600}
          height={600}
        />
        {/* <div className="flex flex-wrap p-4 gap-5">
          <ImageZoom
            src="/starlet-hackathon.jpg"
            alt="starlet-hackathon"
            className="self-start"
            width="200"
            height="200"
          />

          {/* <ImageZoom
            src="/sampleevent.png"
            alt="starlet-hackathon"
            className="self-start"
            width="200"
            height="200"
          /> */}
          {/* <ImageZoom
            src="/starlet-hackathon.jpg"
            alt="starlet-hackathon"
            className="self-start"
            width="200"
            height="200"
          /> */}
          {/* <ImageZoom
            src="/sampleevent.png"
            alt="starlet-hackathon"
            className="self-start"
            width="200"
            height="200"
          /> */}
        {/* </div>  */}
      </div>

      <div>
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          Testimonials
        </div>
        <div className="mx-28 mt-10">
          <ImageGallery items={testimonials} autoPlay={false} />
        </div>
      </div>

      <div ref={teamRef} className="text-3xl font-bold color-[#461711] w-full text-center mt-10 mb-10">
        The Team
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/founder1.png"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Maya Menon</h1>
          <h2 className="font-bold">Founder</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            A superb communicator, Maya Devi Menon adorns many hats. A post graduate in IT from Monash University, Australia, she has experience as an IT professional both in India and abroad. Having captivating teaching and presentation skills, she finds time to take classes for school and college students on a variety of subjects like spoken english, cloud computing, wireless networks. At Mind Empowered, Maya is the mastermind behind visualisation, strategy, and fundraising.
          </p>
        </div>
        
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/founder2.png"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Sreela Menon</h1>
          <h2 className="font-bold">Co-Founder</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            An excellent human resource manager. Post her MBA from Birla Institute of Management Technology in Delhi, she has worked for 12 years in Recruitments as well as Learning and Development  centers of corporates like E-lixir Web Solutions and Oracle Financial Software Services. At Mind Empowered, Sreela is responsible for the Finance and operations simultaneously offering freelance training in areas such as Behaviour Training, Softskill Development, Interview Etiquette  and Corporate recruitment.
          </p>
        </div>
        
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/jaya.jpg"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Jayashree Menon</h1>
          <h2 className="font-bold">Sr. Researcher</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            An MSc, B.Ed, from MG University, Kerala,Jayshree Menon is a highly skilled and versatile professional. As an excellent researcher, Jayshree conducts in-depth research on a variety of topics for webinars and events. Additionally, she is instrumental in identifying and engaging experts for our Mental Health events, ensuring that we provide the highest quality of information and support to our audience.Beyond her research capabilities, Jayshree also contributes significantly to Social Outreach and Volunteer Management. Her efforts in these areas help to expand our reach, engage with the community, and effectively manage our volunteer programs, all of which are essential to the success of our initiatives.
          </p>
        </div>
        
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/anoopa.jpg"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Anoopa Krishnan</h1>
          <h2 className="font-bold">Creative Director</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            An MA in English Literature, Anoopa Krishnan is a creative and enthusiastic digital marketing professional specialising in Search Engine Optimization and Social Media Marketing. At Mind Empowered, Anoopa has been the driving force behind the exponential growth of our digital portfolio, expanding it tenfold. Her expertise in SEO and social media strategies has significantly increased our online presence and engagement. In addition to her digital marketing prowess, Anoopa is also our talented creative designer, responsible for the eye-catching posters that attract and engage our audiences.
          </p>
        </div>
        
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/barathi.jpg"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Bharti Jaravta</h1>
          <h2 className="font-bold">Art Therapist, Counselling Psychologist</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            At Mind Empowered, Bharti Jaravta serves as a dedicated Art Therapist, using her expertise to help individuals express themselves through the medium of art. With a B.Ed and an M.Phil in Counselling Psychology, she brings a deep understanding of the therapeutic process to her work. Bharti guides our audience in using art as a powerful form of communication, helping them increase self-awareness and address a wide range of personal challenges. Her approach enables participants to explore their emotions, gain insight into their experiences, and find new ways to cope with and overcome the issues they face.
          </p>
        </div>
        
        <div className="flex flex-col justify-start place-items-center gap-5">
          <img
            src="/Jessica.jpeg"
            alt=""
            className="rounded-full w-48 h-48 object-cover"
          />
          <h1 className="text-xl font-bold">Jessica Susan John</h1>
          <h2 className="font-bold">Designer</h2>
          <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
            Jessica is a creative self-taught designer with a BCom degree. She has worked on various projects, including designing posters, newsletters, and websites for Mind Empowered. With her passion for design and a background in social volunteering, she brings fresh ideas and enthusiasm to every project she undertakes.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          <Gallery />
        </div>
      </div>
      <div className="bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          Photo Gallery
        </div>
        <div className="mx-28 mt-10">
          <ImageGallery items={photoGallery} autoPlay={true} />
        </div>
      </div>

      <div ref={faqsRef} className="px-4 md:px-28">
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
            />
          ))}
        </div>
      </div>
      <div className="bg-[#461711] text-white p-10 mt-10 text-center">
        Mind Empowered © 2024
      </div>
    </div >
  );
}

export default App;
