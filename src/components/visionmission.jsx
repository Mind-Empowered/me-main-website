import { translations } from "../translations";

const VisionMission = ({ language }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className={`font-bold text-[#461711] mb-4 leading-none ${language === 'ml' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.visionMission.title[language]}
          </span>
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
        <p className={`text-gray-600 max-w-3xl mx-auto leading-relaxed ${language === 'ml' ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.visionMission.subtitle[language]}
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
              <h2 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl lg:text-3xl' : 'text-2xl lg:text-4xl'}`}>
                {translations.visionMission.visionTitle[language]}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${language === 'ml' ? 'text-sm lg:text-base' : 'text-base lg:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.visionMission.visionText[language]}
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
              <h2 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl lg:text-3xl' : 'text-2xl lg:text-4xl'}`}>
                {translations.visionMission.missionTitle[language]}
              </h2>
              <p className={`text-gray-700 leading-relaxed ${language === 'ml' ? 'text-sm lg:text-base' : 'text-base lg:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.visionMission.missionText[language]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
