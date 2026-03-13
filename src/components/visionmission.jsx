import { translations } from "../translations";

const VisionMission = ({ language }) => {
  return (
    <div>
      {/* ── Section Header ─────────────────────────────── */}
      <div className="text-center mb-12">
        <h2 className={`font-bold text-[#461711] mb-4 leading-none ${language === 'ml' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.visionMission.title[language]}
          </span>
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
        <p className={`text-gray-600 max-w-3xl mx-auto leading-relaxed ${language === 'ml' ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.visionMission.subtitle[language]}
        </p>
      </div>

      {/* ── Vision & Mission Cards ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vision Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white overflow-hidden">
          <div className="p-8 lg:p-12 flex flex-col items-center gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/20 to-[#ffdb5b]/30 rounded-full flex items-center justify-center transition-all duration-300">
              <img
                src="/vision.png"
                alt="vision"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl lg:text-3xl' : 'text-2xl lg:text-4xl'}`}>
                {translations.visionMission.visionTitle[language]}
              </h3>
              <p className={`text-gray-700 leading-relaxed ${language === 'ml' ? 'text-sm lg:text-base' : 'text-base lg:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.visionMission.visionText[language]}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white overflow-hidden">
          <div className="p-8 lg:p-12 flex flex-col items-center gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/20 to-[#ffdb5b]/30 rounded-full flex items-center justify-center transition-all duration-300">
              <img
                src="/mission.png"
                alt="mission"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl lg:text-3xl' : 'text-2xl lg:text-4xl'}`}>
                {translations.visionMission.missionTitle[language]}
              </h3>
              <p className={`text-gray-700 leading-relaxed ${language === 'ml' ? 'text-sm lg:text-base' : 'text-base lg:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.visionMission.missionText[language]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 my-14">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff7612]/8 border border-[#ff7612]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
          <span className="text-xs font-bold text-[#461711] tracking-widest uppercase" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.story.objectivesTitle[language]}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* ── Core Objectives Cards ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Self Awareness */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-lg p-6 lg:p-8 border border-white flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-5">
              <img src="/obj1.png" alt={translations.story.obj1_title[language]} className="w-12 h-12 object-contain" />
            </div>
            <h3 className={`font-bold text-[#461711] mb-3 ${language === 'ml' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj1_title[language]}
            </h3>
            <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-sm sm:text-base' : 'text-sm sm:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj1_text[language]}
            </p>
            <ul className={`space-y-2 text-left w-full ${language === 'ml' ? 'text-sm' : 'text-sm'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj1_li1[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj1_li2[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj1_li3[language]}</li>
            </ul>
          </div>
        </div>

        {/* Self Expression */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-lg p-6 lg:p-8 border border-white flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-5">
              <img src="/obj2.png" alt={translations.story.obj2_title[language]} className="w-12 h-12 object-contain" />
            </div>
            <h3 className={`font-bold text-[#461711] mb-3 ${language === 'ml' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj2_title[language]}
            </h3>
            <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-sm sm:text-base' : 'text-sm sm:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj2_text[language]}
            </p>
            <ul className={`space-y-2 text-left w-full ${language === 'ml' ? 'text-sm' : 'text-sm'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj2_li1[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj2_li2[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj2_li3[language]}</li>
            </ul>
          </div>
        </div>

        {/* Self Sufficiency */}
        <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-lg p-6 lg:p-8 border border-white flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-5">
              <img src="/obj3.png" alt={translations.story.obj3_title[language]} className="w-12 h-12 object-contain" />
            </div>
            <h3 className={`font-bold text-[#461711] mb-3 ${language === 'ml' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj3_title[language]}
            </h3>
            <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-sm sm:text-base' : 'text-sm sm:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.story.obj3_text[language]}
            </p>
            <ul className={`space-y-2 text-left w-full ${language === 'ml' ? 'text-sm' : 'text-sm'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj3_li1[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj3_li2[language]}</li>
              <li className="flex items-center text-gray-700"><span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>{translations.story.obj3_li3[language]}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
