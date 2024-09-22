import "./App.css";
import { ImageZoom } from "./ImageZoom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useState } from "react";

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
          className={`float-right transform ${
            props.isOpen ? "rotate-180" : "rotate-0"
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
      <div>
        <img src="/landing-bg.gif" alt="landing-bg" className="w-full" />
      </div>
      <div className="absolute top-0 w-full">
        <nav className="bg-[#ffdb5b] flex w-full justify-between place-items-center px-20">
          <div>
            <img src="/logo192.png" alt="logo192" className="h-12" />
          </div>
          <div className="flex gap-4 nav-links">
            <div>Mission</div>
            <div>FAQs</div>
            <div>Calendar</div>
            <div>Story</div>
            <div>Team</div>
            <div>Mission</div>
          </div>
        </nav>
        <div className="grid place-items-center pt-28">
          <div className="uppercase text-7xl font-bold tracking-widest text-center text-[#461711]">
            Mind <br /> Empowered
          </div>
          <div className="italic font-thin text-[#461711] text-4xl pt-6">
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
      <div className="flex mx-32 gap-20 justify-center" id="mission">
        <div className="flex w-100 justify-center gap-10 mt-20">
          <div>
            <img src="/vision.png" alt="mission" className="w-80" />
          </div>
          <div>
            <div className="text-5xl font-bold italic color-[#461711]">
              Our Vision
            </div>
            <div className="mt-2 text-xl">
              Empowering every{" "}
              <span className="inline-highlight-1">Individual</span> with{" "}
              <span className="inline-highlight-1">Emotional Resilience</span>{" "}
              to navigate life.
            </div>
          </div>
        </div>
        <div className="flex w-100 justify-center gap-10 mt-20">
          <div>
            <img src="/mission.png" alt="mission" className="w-80" />
          </div>
          <div>
            <div className="text-5xl font-bold italic color-[#461711]">
              Our Mission
            </div>
            <div className="mt-2 text-xl">
              Championing the cause of mental health through{" "}
              <span className="inline-highlight-1">Awareness</span>,{" "}
              <span className="inline-highlight-1">Education</span>,{" "}
              <span className="inline-highlight-1">Advocacy</span> and Creating
              an empathetic community.
            </div>
          </div>
        </div>
      </div>

      <div className="px-28 flex mt-10 justify-center gap-20">
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
            <PhotoView src="/NLJune2024.jpg">
              <img src="/NLJune2024.jpg" alt="" width={600} />
            </PhotoView>
          </PhotoProvider>
        </div>
      </div>

      <div className="px-28 py-10 mt-5 bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="text-3xl font-bold color-[#461711] w-full">
          Our Objectives
        </div>
        <div className="mt-10 flex justify-between">
          <div className="flex gap-4">
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
      <div className="px-28 mt-10">
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
      <div className="flex justify-between px-28 py-4 mt-10 bg-gradient-to-tr from-[#f5f0de] to-white">
        <div className="w-full">
          <div className="text-3xl font-bold color-[#461711] border-b-4 pb-2 w-full">
            Calendar
          </div>
          <div className="flex mt-5 bg-[#ffdb5b] p-2 gap-2">
            <div>
              <select defaultValue={"august"}>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>
            <div>
              <select defaultValue={"2024"}>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-2 self-start align-baseline">
            <img
              src="/august2024.jpg"
              alt="august2024"
              className="self-start"
              width={600}
              height={600}
            />
            <div className="flex flex-wrap p-4 gap-5">
              <ImageZoom
                src="/starlet-hackathon.jpg"
                alt="starlet-hackathon"
                className="self-start"
                width="200"
                height="200"
              />

              <ImageZoom
                src="/sampleevent.png"
                alt="starlet-hackathon"
                className="self-start"
                width="200"
                height="200"
              />
              <ImageZoom
                src="/starlet-hackathon.jpg"
                alt="starlet-hackathon"
                className="self-start"
                width="200"
                height="200"
              />
              <ImageZoom
                src="/sampleevent.png"
                alt="starlet-hackathon"
                className="self-start"
                width="200"
                height="200"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          Testimonials
        </div>
        <div className="mx-28 mt-10">
          <ImageGallery items={testimonials} autoPlay={false} />
        </div>
      </div>

      <div>
        <div className="text-3xl font-bold color-[#461711] pb-2 w-100 text-center mt-10">
          Meet Our Team
        </div>
        <div className="flex place-items-start justify-center mt-10 w-100">
          <div className="flex flex-col justify-start place-items-center gap-5">
            <img
              src="/founder1.png"
              alt=""
              className="rounded-full"
              width={200}
              height={200}
            />
            <p className="px-10 w-[500px]">
              A superb communicator, Maya Menon adorns many hats . A post
              graduate in IT from Monash University, Australia, she has over a
              decade's experience as an IT professional both in India and
              abroad.Having captivating teaching and presentation skills she
              finds time to take classes for school and college students on a
              variety of subjects like spoken english,universal human values,
              cloud computing, wireless networks and artificial intelligence.
              Her passion for learning is matched by her dedication to mental
              health. Maya recently earned a certification from NIMHANS on urban
              mental health initiatives, proving she's as committed to wellbeing
              as she is to technology. At Mind Empowered, Maya is the mastermind
              behind visualization, strategy, and fundraising. In short, Maya
              Menon is not just an IT professional or a teacher; she's a
              powerhouse of knowledge and positivity, lighting up every room she
              enters and every project she undertakes.
            </p>
          </div>
          <div className="flex flex-col justify-start place-items-center gap-5">
            <img
              src="/founder2.png"
              alt=""
              className="rounded-full"
              width={200}
              height={200}
            />
            <p className="px-10 w-[500px]">
              An excellent human resource manager. Post her MBA from Birla
              Institute of Management Technology in Delhi, she has worked for 12
              years in Recruitments as well as Learning and Development centers
              of corporates like E-lixir Web Solutions and Oracle Financial
              Software Services. At Mind Empowered, Sreela is responsible for
              the Finance and operations simultaneously offering freelance
              training in areas such as Behaviour Training, Softskill
              Development, Interview Etiquette and Corporate recruitment. She is
              currently undergoing a certification in Fundamental Legal Literacy
              with focus on Mental health.
            </p>
          </div>
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

      <div className="px-28">
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
    </div>
  );
}

export default App;
