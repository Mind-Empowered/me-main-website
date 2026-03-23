import { translations } from "../translations";

const WhoAmI = ({ language }) => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-transparent">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff7612]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffdb5b]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Column */}
          <div className="w-full lg:w-1/2 group">
            <div className="relative">
              {/* Image Frame/Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-white p-3 rounded-[2rem] shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                <img 
                  src="/who-am-i.png" 
                  alt="Who Am I" 
                  className="w-full h-auto rounded-[1.5rem] object-cover"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 bg-[#461711] text-white px-6 py-4 rounded-2xl shadow-xl hidden md:block animate-bounce-gentle">
                  <p className="text-sm font-bold tracking-wider uppercase">#DiscoverSelf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff7612]/10 border border-[#ff7612]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ff7612] animate-ping"></span>
              <span className="text-xs font-bold text-[#461711] tracking-widest uppercase" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.whoAmI.title[language]}
              </span>
            </div>

            <h2 className={`font-bold text-[#461711] mb-6 leading-tight ${language === 'ml' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'}`}>
              <span className="block italic text-[#ff7612] mb-2">{translations.whoAmI.subtitle[language]}</span>
            </h2>

            <p className={`text-gray-700 leading-relaxed ${language === 'ml' ? 'text-base lg:text-lg' : 'text-lg lg:text-xl font-light'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.whoAmI.description[language]}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
