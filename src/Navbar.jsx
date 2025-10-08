import React from 'react';

const NavLink = ({ item, scrollToSection, scrolled, isMobile = false }) => {
  const desktopClasses = `font-semibold text-xl xl:text-7xl tracking-wider transition-all duration-300 py-2 px-3 rounded-md border-b-2 ${
    scrolled
      ? 'text-[#461711] hover:text-[#ff7612] hover:bg-[#ffdb5b]/10 border-transparent hover:border-[#ff7612]'
      : 'text-white hover:text-gray-200 border-transparent hover:border-gray-200'
  }`;

  const mobileClasses = `block w-full text-left px-4 py-3 text-[#461711] hover:bg-[#ff7612]/10 rounded-lg font-semibold text-base transition-all duration-300 border-l-4 border-transparent hover:border-[#ff7612]`;

  return (
    <button onClick={() => scrollToSection(item.ref)} className={isMobile ? mobileClasses : desktopClasses}>
      {item.name}
    </button>
  );
};

const Navbar = ({ navItems, scrollToSection, scrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleScrollToSection = (ref) => {
    scrollToSection(ref);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/20 backdrop-blur-xl shadow-lg border-b border-white/10' : 'bg-black/30 backdrop-blur-xl shadow-none border-b border-transparent'
      }`}
    >
      <div className="relative flex items-center justify-between h-24 lg:h-48 px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full p-2 shadow-lg">
              <img src="/logo192.png" alt="Mind Empowered Logo" className="h-16 w-auto sm:h-20 lg:h-40 object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-2xl md:text-4xl lg:text-7xl font-bold leading-tight tracking-wide ${scrolled ? 'text-[#461711]' : 'text-white'}`}>
                Mind Empowered
              </h1>
              <p className={`text-2xl md:text-3xl lg:text-4xl font-medium tracking-wide ${scrolled ? 'text-[#ff7612]' : 'text-gray-200'}`}>
                #MEforYouth
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center space-x-[28rem]">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} />
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-3 rounded-lg text-white hover:text-[#ffdb5b] bg-black/20 hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#ff7612] transition-all duration-300"
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
      <div id="mobile-menu" className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-lg border-t border-[#ff7612]/20`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} isMobile />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;