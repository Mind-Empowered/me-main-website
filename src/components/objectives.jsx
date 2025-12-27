import { translations } from "../translations";

const Objectives = ({ language }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className={`font-bold text-[#461711] mb-6 leading-tight ${language === 'ml' ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.story.objectivesTitle[language]}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 rounded-full"></div>
                <p className={`text-gray-600 font-medium max-w-3xl mx-auto ${language === 'ml' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.story.subtitle[language]}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Self Awareness Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                            <img src="/obj1.png" alt={translations.story.obj1_title[language]} className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
                        </div>
                        <h3 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-3xl lg:text-4xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj1_title[language]}
                        </h3>
                        <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj1_text[language]}
                        </p>
                        <ul className={`space-y-3 text-left w-full ${language === 'ml' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj1_li1[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj1_li2[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj1_li3[language]}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Self Expression Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                            <img src="/obj2.png" alt={translations.story.obj2_title[language]} className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
                        </div>
                        <h3 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-3xl lg:text-4xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj2_title[language]}
                        </h3>
                        <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj2_text[language]}
                        </p>
                        <ul className={`space-y-3 text-left w-full ${language === 'ml' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj2_li1[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj2_li2[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj2_li3[language]}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Self Sufficiency Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-md mb-6">
                            <img src="/obj3.png" alt={translations.story.obj3_title[language]} className="w-16 h-16 lg:w-18 lg:h-18 object-contain" />
                        </div>
                        <h3 className={`font-bold text-[#461711] mb-4 ${language === 'ml' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-3xl lg:text-4xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj3_title[language]}
                        </h3>
                        <p className={`text-gray-600 mb-4 font-medium ${language === 'ml' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.story.obj3_text[language]}
                        </p>
                        <ul className={`space-y-3 text-left w-full ${language === 'ml' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj3_li1[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj3_li2[language]}
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="w-2 h-2 bg-[#ff7612] rounded-full mr-3 flex-shrink-0"></span>
                                {translations.story.obj3_li3[language]}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Objectives;
