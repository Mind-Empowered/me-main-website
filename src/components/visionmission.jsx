const VisionMission = () => {
  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold text-[#461711] mb-8 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
            Our Vision & Mission
          </span>
        </h1>
        <div className="w-32 h-2 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-8 rounded-full"></div>
        <p className="text-5xl sm:text-6xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          The guiding principles that drive our commitment to mental health empowerment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Vision Card */}
        <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="p-24 lg:p-32 flex flex-col items-center gap-24">
            <div className="flex-shrink-0 w-80 h-80 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#ff7612]/20 group-hover:to-[#ffdb5b]/30">
              <img
                src="/vision.png"
                alt="vision"
                className="w-56 h-56 object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-8xl lg:text-9xl font-bold text-[#461711] mb-10">
                Our Vision
              </h2>
              <p className="text-5xl lg:text-6xl text-gray-700 leading-relaxed">
                Empowering{" "}
                <span className="text-[#ff7612] font-bold">Individuals</span>{" "}
                to navigate life with{" "}
                <span className="text-[#ff7612] font-bold">Emotional Resilience</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="p-24 lg:p-32 flex flex-col items-center gap-24">
            <div className="flex-shrink-0 w-80 h-80 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#ff7612]/20 group-hover:to-[#ffdb5b]/30">
              <img
                src="/mission.png"
                alt="mission"
                className="w-56 h-56 object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-8xl lg:text-9xl font-bold text-[#461711] mb-10">
                Our Mission
              </h2>
              <p className="text-5xl lg:text-6xl text-gray-700 leading-relaxed">
                Championing the cause of mental health through{" "}
                <span className="text-[#ff7612] font-bold">Awareness</span>,{" "}
                <span className="text-[#ff7612] font-bold">Education</span>,{" "}
                <span className="text-[#ff7612] font-bold">Advocacy</span> and
                creating an empathetic community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
