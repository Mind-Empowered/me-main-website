import React from 'react';
import CalendarPopup from './components/CalendarPopup';

const NavLink = ({ item, scrollToSection, scrolled, isMobile = false }) => {
  const desktopClasses = `relative font-bold text-xs lg:text-sm tracking-[0.1em] uppercase transition-all duration-300 py-2.5 px-4 rounded-full group overflow-hidden ${scrolled
    ? 'text-[#461711] hover:text-[#ff7612]'
    : 'text-white/90 hover:text-white'
    }`;

  const mobileClasses = `block w-full text-left px-5 py-4 text-[#461711] rounded-2xl font-black text-lg transition-all duration-300 border-2 border-transparent hover:border-[#ff7612]/20 hover:bg-[#ff7612]/5 hover:pl-8 shadow-sm`;

  return (
    <button onClick={() => scrollToSection(item.ref)} className={isMobile ? mobileClasses : desktopClasses}>
      {/* Premium Pill Background Glow (Desktop) */}
      {!isMobile && (
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out -z-10 rounded-full" />
      )}
      <span className="relative z-10 block transition-transform duration-300">
        {item.name}
      </span>
      {/* Animated Dot Indicator */}
      {!isMobile && (
        <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:bottom-0 ${scrolled ? 'bg-[#ff7612]' : 'bg-white'}`} style={{ transform: 'translate(-50%, 0)' }}></span>
      )}
    </button>
  );
};

const Navbar = ({ navItems, scrollToSection, scrolled, language, openLanguageModal, openDonateModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleScrollToSection = (ref) => {
    scrollToSection(ref);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
        ? 'bg-white/85 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(70,23,17,0.1)] py-1'
        : 'bg-black/10 backdrop-blur-xl shadow-none py-3'
        }`}
    >
      <div className="relative flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-12">
        <div className="flex-shrink-0">
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative h-10 w-10 sm:h-14 sm:w-14 bg-white rounded-full p-0.5 shadow-md overflow-hidden transition-all duration-500 group-hover:scale-105 group-active:scale-95 ring-2 ring-[#ff7612]/20">
              <img src="/brand/logo.jpeg" alt="Mind Empowered Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="block transition-transform duration-300 group-hover:translate-x-1">
              <h1 className={`text-base sm:text-lg md:text-xl font-bold leading-tight tracking-wide transition-colors duration-300 ${scrolled ? 'text-[#461711]' : 'text-white'}`}>
                Mind Empowered
              </h1>
              <p className={`font-medium tracking-wide transition-colors duration-300 ${scrolled ? 'text-[#ff7612]' : 'text-gray-200'} ${language === 'ml' ? 'text-[0.6rem] sm:text-xs md:text-sm' : 'text-xs sm:text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                #MEforYouth
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center space-x-2 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink key={item.key} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} />
          ))}
        </div>

        {/* Right-side actions — grouped tightly */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Donate */}


          {/* Calendar */}
          <CalendarPopup language={language} scrolled={scrolled} />

          <div className="relative">
            <button
              onClick={openLanguageModal}
              aria-label="Change Language"
              className={`p-2 rounded-full transition-all duration-300 hover:bg-black/10 hover:scale-110 active:scale-95 group ${scrolled ? 'text-[#461711]' : 'text-white'
                }`}
            >
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-xl text-white bg-black/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#ff7612] transition-all duration-300 hover:bg-[#ff7612]/20 group"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative w-6 h-6">
              <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`
          lg:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-[#ff7612]/20 overflow-hidden transition-all duration-500 ease-in-out rounded-b-3xl mx-4 mt-2
          ${isMobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'}
        `}>
        <div className="px-4 pt-4 pb-6 space-y-1">
          {navItems.map((item, idx) => (
            <div
              key={item.name}
              style={{ transitionDelay: `${idx * 50}ms` }}
              className={`transition-all duration-500 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
            >
              <NavLink item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} isMobile />
            </div>
          ))}



          <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
            {/* Mobile Calendar */}
            <button
              onClick={() => document && document.querySelector('[aria-label="Event Calendar"]')?.click()}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-[#461711] rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {language === 'en' ? 'Event Calendar' : 'ഇവന്റ് കലണ്ടർ'}
              </span>
            </button>

            <button
              onClick={openLanguageModal}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-[#461711] rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;