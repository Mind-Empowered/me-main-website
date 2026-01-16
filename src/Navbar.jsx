import React from 'react';

const NavLink = ({ item, scrollToSection, scrolled, isMobile = false }) => {
  const desktopClasses = `font-semibold text-sm lg:text-base tracking-wider transition-all duration-300 py-2 px-3 rounded-md border-b-2 ${scrolled
    ? 'text-[#461711] hover:text-[#ff7612] hover:bg-[#ffdb5b]/10 border-transparent hover:border-[#ff7612]'
    : 'text-white hover:text-gray-200 border-transparent hover:border-gray-200'
    }`;

  const mobileClasses = `block w-full text-left px-4 py-3 text-[#461711] hover:bg-[#ff7612]/10 rounded-lg font-semibold text-lg transition-all duration-300 border-l-4 border-transparent hover:border-[#ff7612]`;

  return (
    <button onClick={() => scrollToSection(item.ref)} className={isMobile ? mobileClasses : desktopClasses}>
      {item.name}
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/20 backdrop-blur-xl shadow-lg border-b border-white/10' : 'bg-black/30 backdrop-blur-xl shadow-none border-b border-transparent'
        }`}
    >
      <div className="relative flex items-center justify-between h-16 lg:h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full p-1 shadow-lg">
              <img src="/logo192.png" alt="Mind Empowered Logo" className="h-8 w-auto sm:h-12 object-contain" />
            </div>
            <div className="block">
              <h1 className={`text-base sm:text-lg md:text-xl font-bold leading-tight tracking-wide ${scrolled ? 'text-[#461711]' : 'text-white'}`}>
                Mind Empowered
              </h1>
              <p className={`font-medium tracking-wide ${scrolled ? 'text-[#ff7612]' : 'text-gray-200'} ${language === 'ml' ? 'text-[0.6rem] sm:text-xs md:text-sm' : 'text-xs sm:text-sm md:text-base'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                #MEforYouth
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center space-x-4">
          {navItems.map((item) => (
            <NavLink key={item.key} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} />
          ))}
        </div>

        <div className="hidden lg:flex items-center ml-4">
          <button
            onClick={openDonateModal}
            className={`px-4 py-2 rounded-full font-bold shadow-md transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${scrolled
              ? 'bg-[#461711] text-white hover:bg-[#ff7612]'
              : 'bg-white text-[#461711] hover:bg-[#ffdb5b]'
              }`}
          >
            <svg className={`w-4 h-4 ${scrolled ? 'text-[#ffdb5b]' : 'text-[#ff7612]'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {language === 'en' ? 'Donate' : 'സംഭാവന'}
          </button>
        </div>

        {/* Language Switcher */}
        <div className="hidden lg:flex items-center ml-4 group relative">
          <button
            onClick={openLanguageModal}
            aria-label="Change Language"
            className={`p-2 rounded-full transition-all duration-300 ${scrolled ? 'text-[#461711] hover:bg-[#ff7612]/20' : 'text-white hover:bg-white/20'
              }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
          <div className="absolute top-full mt-2 -right-2 w-max bg-black/70 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {language === 'en' ? 'Change to മലയാളം' : 'Change to English'}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-[#ffdb5b] bg-black/20 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#ff7612] transition-all duration-300"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`
          lg:hidden bg-white shadow-lg border-t border-[#ff7612]/20 overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} isMobile />
          ))}

          {/* Mobile Donate Button */}
          <div className="px-4 py-2 mt-2">
            <button
              onClick={openDonateModal}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-[#461711] text-white hover:bg-[#ff7612] transition-colors shadow-md"
            >
              <svg className="w-5 h-5 text-[#ffdb5b]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {language === 'en' ? 'Donate for ME' : 'സംഭാവന നൽകുക'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-2">
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-[#461711] hover:bg-[#ff7612]/10 rounded-lg font-semibold text-lg transition-all duration-300"
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