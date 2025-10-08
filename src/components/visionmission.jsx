const VisionMission = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#461711] mb-4 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
            Our Vision & Mission
          </span>
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          The guiding principles that drive our commitment to mental health empowerment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12 flex flex-col items-center gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#ff7612]/20 group-hover:to-[#ffdb5b]/30">
              <img
                src="/vision.png"
                alt="vision"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#461711] mb-4">
                Our Vision
              </h2>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
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
          <div className="p-8 lg:p-12 flex flex-col items-center gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#ff7612]/20 group-hover:to-[#ffdb5b]/30">
              <img
                src="/mission.png"
                alt="mission"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl lg:text-4xl font-bold text-[#461711] mb-4">
                Our Mission
              </h2>
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
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
