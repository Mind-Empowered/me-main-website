import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './services/supabase-client';
import { ROLE_HOME_PATHS, resolveUserRole } from './services/authRoles';
import CalendarPopup from './components/CalendarPopup';
import NewsletterPopup from './components/NewsletterPopup';

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
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [dashboardPath, setDashboardPath] = React.useState(null);
  const [profileUser, setProfileUser] = React.useState(null);
  const [profileRole, setProfileRole] = React.useState(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = React.useState(false);
  const profilePopupRef = React.useRef(null);
  const profileButtonRef = React.useRef(null);

  const handleScrollToSection = (ref) => {
    scrollToSection(ref);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  React.useEffect(() => {
    let mounted = true;

    const applySession = async (session) => {
      if (!session?.user) {
        if (mounted) {
          setDashboardPath(null);
          setProfileUser(null);
          setProfileRole(null);
          setIsProfilePopupOpen(false);
        }
        return;
      }

      const role = await resolveUserRole(session.user);
      const nextPath = ROLE_HOME_PATHS[role] || "/signin";

      if (mounted) {
        setDashboardPath(nextPath);
        setProfileUser(session.user);
        setProfileRole(role);
      }
    };

    const initializeAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      await applySession(data?.session || null);
    };

    initializeAuthState();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(session);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!isProfilePopupOpen) return;

    const handlePointerDown = (event) => {
      if (profilePopupRef.current?.contains(event.target) || profileButtonRef.current?.contains(event.target)) {
        return;
      }

      setIsProfilePopupOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isProfilePopupOpen]);

  const handleLogout = async () => {
    setIsProfilePopupOpen(false);
    setIsMobileMenuOpen(false);
    await supabase.auth.signOut();
    setDashboardPath(null);
    setProfileUser(null);
    setProfileRole(null);
    navigate('/', { replace: true });
  };

  const profileName = profileUser?.user_metadata?.full_name || profileUser?.user_metadata?.name || profileUser?.user_metadata?.display_name || profileUser?.email?.split('@')[0] || 'Member';
  const profileEmail = profileUser?.email || '';
  const profileInitials = profileName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'ME';
  const profileRoleLabel = profileRole ? profileRole.toLowerCase() : 'member';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
        ? 'bg-white/85 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(70,23,17,0.1)] py-1'
        : 'bg-black/10 backdrop-blur-xl shadow-none py-3'
        }`}
    >
      <div className="relative grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center h-16 lg:h-20 px-4 sm:px-6 lg:px-12 gap-3 lg:gap-6">
        <div className="flex-shrink-0 justify-self-start">
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative h-10 w-10 sm:h-14 sm:w-14 bg-white rounded-full p-0.5 shadow-md overflow-hidden transition-all duration-500 group-hover:scale-105 group-active:scale-95 ring-2 ring-[#ff7612]/20">
              <img src="/brand/logo.jpeg" alt="Mind Empowered Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="block transition-transform duration-300 group-hover:translate-x-1">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-none tracking-tight transition-colors duration-300 ${scrolled ? 'text-[#461711] drop-shadow-sm' : 'text-white drop-shadow-md'}`}>
                Mind Empowered
              </h1>
              <p className={`font-bold tracking-[0.2em] mt-1 transition-colors duration-300 uppercase ${scrolled ? 'text-[#ff7612]' : 'text-white/80'} ${language === 'ml' ? 'text-[9px] sm:text-[10px] md:text-xs' : 'text-[10px] sm:text-[11px] md:text-xs'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                #MEFORYOUTH
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center justify-self-center space-x-2 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink key={item.key} item={item} scrollToSection={handleScrollToSection} scrolled={scrolled} />
          ))}
        </div>

        {/* Right-side actions — grouped tightly */}
        <div className="hidden lg:flex items-center justify-self-end gap-2">
          {/* Calendar */}
          <CalendarPopup language={language} scrolled={scrolled} />

          {/* Newsletter */}
          <NewsletterPopup scrolled={scrolled} />

          {profileUser ? (
            <>
              <div
                className="relative"
                onMouseEnter={() => setIsProfilePopupOpen(true)}
                onMouseLeave={() => setIsProfilePopupOpen(false)}
              >
                <button
                  ref={profileButtonRef}
                  onClick={() => navigate(dashboardPath || '/signin')}
                  aria-label="Open profile menu"
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-md ${scrolled ? 'border-[#ff7612]/35 bg-white text-[#461711] hover:scale-105' : 'border-white/20 bg-white/10 text-white hover:bg-white/15 hover:scale-105'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 0112 15c2.485 0 4.735 1.007 6.364 2.636M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 1a9 9 0 10-18 0 9 9 0 0018 0z" />
                  </svg>
                </button>

               

                {isProfilePopupOpen && (
                  <div ref={profilePopupRef} className="absolute right-0 top-full z-[80] mt-3 w-80 overflow-hidden rounded-3xl border border-[#ff7612]/15 bg-white/95 shadow-[0_30px_80px_-20px_rgba(70,23,17,0.35)] backdrop-blur-2xl">
                    <div className="bg-gradient-to-r from-[#461711] to-[#7a3012] px-5 py-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-sm font-black tracking-wider">
                          {profileInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-black">{profileName}</p>
                          <p className="truncate text-xs uppercase tracking-[0.2em] text-white/75">{profileRoleLabel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 px-5 py-4 text-[#461711]">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7612]">Email</p>
                        <p className="mt-1 break-all text-sm font-semibold text-[#5d4037]">{profileEmail}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7612]">Role</p>
                        <p className="mt-1 text-sm font-semibold text-[#5d4037]">{profileRoleLabel}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
               <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Logout"
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-md ${scrolled ? 'border-red-200 bg-white text-red-400 hover:text-red-600 hover:border-red-400 hover:scale-105' : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/15 hover:text-white hover:scale-105'}`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className={`px-5 py-2.5 rounded-full font-bold text-xs lg:text-sm tracking-[0.05em] uppercase transition-all duration-300 border shadow-sm ${scrolled
                  ? 'text-[#461711] border-[#461711]/15 hover:border-[#ff7612] hover:text-[#ff7612] hover:bg-[#ff7612]/5'
                  : 'text-white border-white/20 hover:border-white hover:bg-white/10'
                  }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full font-bold text-xs lg:text-sm tracking-[0.05em] uppercase bg-[#ff7612] hover:bg-[#e45a00] text-white hover:shadow-[0_4px_15px_rgba(255,118,18,0.25)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center justify-self-end">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ff7612] ${scrolled ? 'text-[#461711] hover:bg-black/5' : 'text-white hover:bg-white/10'}`}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative w-[24px] h-[16px]">
              <span className={`absolute right-0 block h-[2px] bg-current transform transition-all duration-300 ease-in-out rounded-full ${isMobileMenuOpen ? 'top-[7px] w-[24px] rotate-45' : 'top-0 w-[24px]'}`}></span>
              <span className={`absolute right-0 block h-[2px] bg-current transform transition-all duration-300 ease-in-out rounded-full ${isMobileMenuOpen ? 'top-[7px] w-0 opacity-0' : 'top-[7px] w-[16px]'}`}></span>
              <span className={`absolute right-0 block h-[2px] bg-current transform transition-all duration-300 ease-in-out rounded-full ${isMobileMenuOpen ? 'top-[7px] w-[24px] -rotate-45' : 'top-[14px] w-[20px]'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`
          lg:hidden absolute left-4 right-4 top-full mt-2 bg-white/95 backdrop-blur-2xl shadow-[0_40px_100px_-10px_rgba(70,23,17,0.3)] border border-[#ff7612]/20 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-3xl
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}
        `}>
        <div className="px-5 pt-6 pb-8 space-y-1">
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
              onClick={() => document && document.querySelector('[aria-label="Newsletter updates"]')?.click()}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-[#461711] rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 5h-14a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm0 0l-7 5-7-5" />
              </svg>
              <span>{language === 'en' ? 'Newsletter' : 'വാർത്താക്കുറിപ്പ്'}</span>
            </button>

            <div className="pt-2">
              {profileUser ? (
                <>
                  <Link
                    to={dashboardPath || '/signin'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[#461711] transition-all duration-300 hover:bg-[#ff7612]/5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#461711] text-sm font-black text-white">{profileInitials}</span>
                    <span className="text-lg font-black">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 block w-full text-left px-4 py-3 text-[#461711] rounded-lg font-semibold text-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-5 py-3 text-[#461711] hover:text-[#ff7612] hover:bg-[#ff7612]/5 border border-[#461711]/15 hover:border-[#ff7612] rounded-2xl font-bold text-base transition-all duration-300 shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#ff7612] to-[#e45a00] text-white hover:opacity-95 rounded-2xl font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;