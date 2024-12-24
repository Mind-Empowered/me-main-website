
const Team = () => {
    return (
        <div className="bg-gradient-to-tr from-[#f5f0de] to-white py-10">
            <div className="text-[#461711] text-3xl font-bold color-[#461711] w-full text-center mb-10">
            Meet Our Team
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-20 max-w-7xl mx-auto">
            {[
                {
                image: "/founder1.png",
                name: "Maya Menon",
                role: "Founder",
                bio: "A superb communicator, Maya Devi Menon adorns many hats. A post graduate in IT from Monash University, Australia, she has experience as an IT professional both in India and abroad. Having captivating teaching and presentation skills, she finds time to take classes for school and college students on a variety of subjects like spoken english, cloud computing, wireless networks. At Mind Empowered, Maya is the mastermind behind visualisation, strategy, and fundraising."
                },
                {
                image: "/founder2.png",
                name: "Sreela Menon",
                role: "Co-Founder",
                bio: "An excellent human resource manager. Post her MBA from Birla Institute of Management Technology in Delhi, she has worked for 12 years in Recruitments as well as Learning and Development centers of corporates like E-lixir Web Solutions and Oracle Financial Software Services. At Mind Empowered, Sreela is responsible for the Finance and operations simultaneously offering freelance training in areas such as Behaviour Training, Softskill Development, Interview Etiquette and Corporate recruitment."
                },
                {
                image: "/jaya.jpg",
                name: "Jayashree Menon",
                role: "Sr. Researcher",
                bio: "An MSc, B.Ed, from MG University, Kerala,Jayshree Menon is a highly skilled and versatile professional. As an excellent researcher, Jayshree conducts in-depth research on a variety of topics for webinars and events. Additionally, she is instrumental in identifying and engaging experts for our Mental Health events, ensuring that we provide the highest quality of information and support to our audience."
                },
                {
                image: "/anoopa.jpg",
                name: "Anoopa Krishnan",
                role: "Creative Director",
                bio: "An MA in English Literature, Anoopa Krishnan is a creative and enthusiastic digital marketing professional specialising in Search Engine Optimization and Social Media Marketing. At Mind Empowered, Anoopa has been the driving force behind the exponential growth of our digital portfolio, expanding it tenfold. Her expertise in SEO and social media strategies has significantly increased our online presence and engagement."
                },
                {
                image: "/barathi.jpg",
                name: "Bharti Jaravta",
                role: "Art Therapist, Counselling Psychologist",
                bio: "At Mind Empowered, Bharti Jaravta serves as a dedicated Art Therapist, using her expertise to help individuals express themselves through the medium of art. With a B.Ed and an M.Phil in Counselling Psychology, she brings a deep understanding of the therapeutic process to her work. Bharti guides our audience in using art as a powerful form of communication, helping them increase self-awareness."
                },
                {
                image: "/Jessica.jpeg",
                name: "Jessica Susan John",
                role: "Designer",
                bio: "Jessica is a creative self-taught designer with a BCom degree. She has worked on various projects, including designing posters, newsletters, and websites for Mind Empowered. With her passion for design and a background in social volunteering, she brings fresh ideas and enthusiasm to every project she undertakes."
                }
            ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-6">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="rounded-full w-full h-full object-cover border-4 border-[#ff7612]/20"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff7612]/10 to-transparent" />
                    </div>
                    
                    <h1 className="text-2xl font-bold text-[#461711] mb-1">{member.name}</h1>
                    <h2 className="font-semibold text-center text-[#ff7612] mb-4">{member.role}</h2>
                    
                    <div className="relative">
                    <p className="text-center px-4 max-w-lg h-32 overflow-y-auto scrollbar-thin hover:shadow-inner rounded-lg p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-white hover:to-[#f5f0de]/20">
                        {member.bio}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default Team;