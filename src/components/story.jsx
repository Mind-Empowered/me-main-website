import { translations } from "../translations";

const Story = ({ language }) => {
    return (
<div>
  {/* Section Header */}
  <div className="text-center mb-8 md:mb-12">
    <h1 className={`font-bold text-[#461711] mb-4 leading-none ${language === 'ml' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-3xl sm:text-4xl md:text-5xl'}`}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
        {translations.story.title[language]}
      </span>
    </h1>
    <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-4 rounded-full"></div>
    <p className={`text-gray-600 max-w-3xl mx-auto leading-relaxed ${language === 'ml' ? 'text-sm sm:text-base md:text-lg' : 'text-base sm:text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
      {translations.story.subtitle[language]}
    </p>
  </div>
  
  {/* Story and Image Section */}
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
    <div className="flex justify-center items-center h-full lg:col-span-1">
      <img src="/mestory.svg" alt="ME Story Illustration" className="w-full h-full object-contain" />
    </div>
    <div className={`space-y-4 text-gray-700 leading-relaxed lg:col-span-3 ${language === 'ml' ? 'text-sm' : 'text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
      <p>
        <span className="font-bold text-[#461711]">Mind Empowered (ME)</span> {translations.story.p1[language]} <span className="font-semibold text-[#ff7612]">{translations.story.p1_author[language]}</span>{translations.story.p1_cont[language]}
      </p>
      <p>
        {translations.story.p2[language]}
      </p>
      <p>
        {translations.story.p3[language]}
      </p>
      <blockquote className="border-l-4 border-[#ffdb5b] pl-4 py-2 my-4 bg-gray-50 rounded-r-lg">
        <p className={`font-semibold text-[#461711] italic ${language === 'ml' ? 'text-base' : 'text-lg'}`}>
          {translations.story.quote[language]}
        </p>
      </blockquote>
      <p>
        {translations.story.p4[language]} <span className="font-semibold text-[#ff7612]">{translations.story.p4_date[language]}</span>{translations.story.p4_cont[language]}
      </p>
    </div>
  </div>

  {/* Objectives Section */}
  <div className="mt-16 md:mt-20">
    <div className="text-center mb-8 md:mb-12" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
      <h2 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl sm:text-2xl md:text-3xl' : 'text-2xl sm:text-3xl md:text-4xl'}`} >
        {translations.story.objectivesTitle[language]}
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto rounded-full"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Self Awareness Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj1.png" alt="Self Awareness" className="w-8 h-8 object-contain" />
          </div>
          <h3 className={`font-bold text-[#461711] ${language === 'ml' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.story.obj1_title[language]}
          </h3>
        </div>
        <p className={`text-gray-600 mb-3 flex-grow leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.story.obj1_text[language]}
        </p>
        <ul className={`space-y-2 text-gray-700 leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj1_li1[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj1_li2[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj1_li3[language]}
          </li>
        </ul>
      </div>

      {/* Self Expression Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj2.png" alt="Self Expression" className="w-8 h-8 object-contain" />
          </div>
          <h3 className={`font-bold text-[#461711] ${language === 'ml' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.story.obj2_title[language]}
          </h3>
        </div>
        <p className={`text-gray-600 mb-3 flex-grow leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.story.obj2_text[language]}
        </p>
        <ul className={`space-y-2 text-gray-700 leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj2_li1[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj2_li2[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj2_li3[language]}
          </li>
        </ul>
      </div>

      {/* Self Sufficiency Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/obj3.png" alt="Self Sufficiency" className="w-8 h-8 object-contain" />
          </div>
          <h3 className={`font-bold text-[#461711] ${language === 'ml' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
            {translations.story.obj3_title[language]}
          </h3>
        </div>
        <p className={`text-gray-600 mb-3 flex-grow leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {translations.story.obj3_text[language]}
        </p>
        <ul className={`space-y-2 text-gray-700 leading-relaxed ${language === 'ml' ? 'text-xs md:text-sm' : 'text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj3_li1[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj3_li2[language]}
          </li>
          <li className="flex items-center">
             <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3"></span>
            {translations.story.obj3_li3[language]}
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
    );
};

export default Story;