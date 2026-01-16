import "./App.css";
import { useRef, useState, useEffect } from "react";

import { FaWheelchair } from 'react-icons/fa';
import Draggable from 'react-draggable';
import Navbar from "./Navbar"; // Corrected import path
import {
  Hero,
  VisionMission,
  Newsletter,
  Objectives,
  Story,
  EventCalendar,
  Testimonials,
  Team,
  Photogallery,
  FAQ,
  Ytp,
  DonateModal,
} from "./components";
import { translations } from "./translations";

// --- Accessibility Constants for maintainability ---
const FONT_SIZE_KEYS = ['small', 'normal', 'large', 'xlarge'];
const FONT_SIZE_CLASSES = {
  small: 'font-size-small',
  normal: 'font-size-normal',
  large: 'font-size-large',
  xlarge: 'font-size-xlarge',
};
// ----------------------------------------------------

function App() {
  const missionRef = useRef(null);
  const faqsRef = useRef(null);
  const calendarRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);

  const [language, setLanguage] = useState('en');

  // State for the new language selection flow
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(null);

  const handleLanguageSelect = (lang) => {
    if (lang !== language) {
      setTargetLanguage(lang);
      setIsLanguageModalOpen(false);
      setIsConfirmModalOpen(true);
    } else {
      setIsLanguageModalOpen(false);
    }
  };

  const handleConfirmTranslation = () => {
    if (targetLanguage) {
      setLanguage(targetLanguage);
    }
    setIsConfirmModalOpen(false);
    setTargetLanguage(null);
  };

  // --- Data-driven navigation ---
  const navItems = [
    { name: translations.nav.mission[language], ref: missionRef, key: 'mission' },
    { name: translations.nav.story[language], ref: storyRef, key: 'story' },
    { name: translations.nav.team[language], ref: teamRef, key: 'team' },
    { name: translations.nav.calendar[language], ref: calendarRef, key: 'calendar' },
    { name: translations.nav.faqs[language], ref: faqsRef, key: 'faqs' },
    { name: translations.nav.contact[language], ref: faqsRef, key: 'contact' },
  ];
  // -----------------------------

  // --- Data-driven footer social links ---
  const socialLinks = [
    {
      href: "https://www.instagram.com/mind.empowered/",
      label: "Instagram",
      icon: <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg>
    },
    {
      href: "https://www.linkedin.com/company/mind-empowered/",
      label: "LinkedIn",
      icon: <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
    },
    {
      href: "mailto:Mindempowered2020@gmail.com",
      label: "Email",
      icon: <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75C0 3.784.784 3 1.75 3zM2.5 4.5v.815l9.5 6.333 9.5-6.333V4.5a.25.25 0 00-.25-.25H2.75a.25.25 0 00-.25.25zM2.5 19.5h19v-12.03l-9.532 6.355a.75.75 0 01-.936 0L2.5 7.47V19.5z" /></svg>
    }
  ];
  // ---------------------------------------

  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- State with localStorage persistence ---
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('reducedMotion') === 'true');
  const [readableFont, setReadableFont] = useState(() => localStorage.getItem('readableFont') === 'true');
  const [highlightLinks, setHighlightLinks] = useState(() => localStorage.getItem('highlightLinks') === 'true');
  const [contentScale, setContentScale] = useState(() => parseInt(localStorage.getItem('contentScale'), 10) || 100);
  const [lineHeight, setLineHeight] = useState(() => parseFloat(localStorage.getItem('lineHeight')) || 1.6);
  const [letterSpacing, setLetterSpacing] = useState(() => parseFloat(localStorage.getItem('letterSpacing')) || 0);
  const [wordSpacing, setWordSpacing] = useState(() => parseFloat(localStorage.getItem('wordSpacing')) || 0);
  const [hideImages, setHideImages] = useState(() => localStorage.getItem('hideImages') === 'true');
  const [bigCursor, setBigCursor] = useState(() => localStorage.getItem('bigCursor') === 'true');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('reducedMotion', reducedMotion);
    localStorage.setItem('readableFont', readableFont);
    localStorage.setItem('highlightLinks', highlightLinks);
    localStorage.setItem('contentScale', contentScale);
    localStorage.setItem('lineHeight', lineHeight);
    localStorage.setItem('letterSpacing', letterSpacing);
    localStorage.setItem('wordSpacing', wordSpacing);
    localStorage.setItem('hideImages', hideImages);
    localStorage.setItem('bigCursor', bigCursor);
    localStorage.setItem('darkMode', darkMode);
  }, [fontSize, highContrast, reducedMotion, readableFont, highlightLinks, contentScale, lineHeight, letterSpacing, wordSpacing, hideImages, bigCursor, darkMode]);
  // -----------------------------------------

  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const targetPosition = ref.current.getBoundingClientRect().top + window.scrollY - 192; // Navbar offset
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1000; // Scroll duration in milliseconds (1 second)
    let startTime = null;

    // Easing function for a smooth start and end
    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    // Use requestAnimationFrame for a smooth, browser-optimized animation
    if (!reducedMotion) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition); // Fallback for reduced motion
    }
  };

  // Accessibility functions
  const increaseFontSize = () => {
    const currentIndex = FONT_SIZE_KEYS.indexOf(fontSize);
    if (currentIndex < FONT_SIZE_KEYS.length - 1) {
      setFontSize(FONT_SIZE_KEYS[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const currentIndex = FONT_SIZE_KEYS.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(FONT_SIZE_KEYS[currentIndex - 1]);
    }
  };

  const resetAccessibility = () => {
    setFontSize('normal');
    setHighContrast(false);
    setReducedMotion(false);
    setReadableFont(false);
    setHighlightLinks(false);
    setContentScale(100);
    setLineHeight(1.6);
    setLetterSpacing(0);
    setWordSpacing(0);
    setHideImages(false);
    setBigCursor(false);
    setDarkMode(false);
  };

  const increaseContentScale = () => setContentScale(s => Math.min(s + 10, 150));
  const decreaseContentScale = () => setContentScale(s => Math.max(s - 10, 80));

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Refactored: Remove all possible font-size classes
    Object.values(FONT_SIZE_CLASSES).forEach(className => root.classList.remove(className));
    // Refactored: Add only the current, full class name from the map
    root.classList.add(FONT_SIZE_CLASSES[fontSize]);

    root.classList.toggle('high-contrast', highContrast);
    root.classList.toggle('reduced-motion', reducedMotion);
    root.classList.toggle('readable-font', readableFont);
    root.classList.toggle('highlight-links', highlightLinks);
    root.style.setProperty('--line-height', lineHeight);
    root.style.setProperty('--letter-spacing', `${letterSpacing}em`);
    root.style.setProperty('--word-spacing', `${wordSpacing}em`);
    root.classList.toggle('hide-images', hideImages);
    root.classList.toggle('big-cursor', bigCursor);
    root.classList.toggle('dark-mode', darkMode);
  }, [fontSize, highContrast, reducedMotion, readableFont, highlightLinks, lineHeight, letterSpacing, wordSpacing, hideImages, bigCursor, darkMode]);

  // Handle navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 isolate">
      {/* Fixed Background GIF */}
      <div className="fixed inset-0 -z-10">
        <img src="/landing-bg.gif" alt="landing-bg" className="w-full h-screen object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>


      {/* Navbar */}
      <Navbar
        navItems={navItems}
        scrollToSection={scrollToSection}
        scrolled={scrolled}
        language={language}
        openLanguageModal={() => setIsLanguageModalOpen(true)}
        openDonateModal={() => setIsDonateModalOpen(true)}
        missionRef={missionRef}
      />

      {/* Hero Section Spacer */}
      <div className="relative h-screen">
        <Hero language={language} />
      </div>

      {/* Accessibility Menu - Now controlled by the floating button */}
      {showAccessibilityMenu && (
        <Draggable handle=".drag-handle" bounds="body">
          <div className="accessibility-menu fixed right-4 bottom-20 sm:right-6 sm:bottom-24 w-[90vw] max-w-xs bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 sm:p-4 z-40 animate-fade-in-fast cursor-default">
            {/* The handle for dragging the menu */}
            <h3 className="drag-handle text-lg sm:text-xl font-bold text-[#461711] mb-3 text-center cursor-move" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.title[language]}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.fontSize[language]}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={decreaseFontSize} className="px-2 py-0.5 text-xs bg-gray-200 rounded-md hover:bg-gray-300 font-bold">A-</button>
                  <span className="text-xs text-gray-600 font-bold w-14 text-center capitalize">{fontSize}</span>
                  <button onClick={increaseFontSize} className="px-2 py-0.5 text-xs bg-gray-200 rounded-md hover:bg-gray-300 font-bold">A+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.highContrast[language]}</span>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${highContrast ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {highContrast ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.reducedMotion[language]}</span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${reducedMotion ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {reducedMotion ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.dyslexiaFriendly[language]}</span>
                <button
                  onClick={() => setReadableFont(!readableFont)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${readableFont ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {readableFont ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.highlightLinks[language]}</span>
                <button
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${highlightLinks ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {highlightLinks ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.darkMode[language]}</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${darkMode ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {darkMode ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.hideImages[language]}</span>
                <button
                  onClick={() => setHideImages(!hideImages)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${hideImages ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {hideImages ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.bigCursor[language]}</span>
                <button
                  onClick={() => setBigCursor(!bigCursor)}
                  className={`px-3 py-1 text-xs rounded-md font-bold w-14 text-center ${bigCursor ? 'bg-[#ff7612] text-white' : 'bg-gray-200'}`}
                >
                  {bigCursor ? translations.nav.on[language] : translations.nav.off[language]}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="lineHeight" className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.lineHeight[language]}</label>
                <div className="flex items-center space-x-2">
                  <input id="lineHeight" type="range" min="1.2" max="2.5" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} className="w-24" />
                  <span className="text-xs text-gray-600 font-bold w-10 text-right">{lineHeight.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="letterSpacing" className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.letterSpacing[language]}</label>
                <div className="flex items-center space-x-2">
                  <input id="letterSpacing" type="range" min="0" max="0.2" step="0.01" value={letterSpacing} onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} className="w-24" />
                  <span className="text-xs text-gray-600 font-bold w-10 text-right">{letterSpacing.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="wordSpacing" className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.wordSpacing[language]}</label>
                <div className="flex items-center space-x-2">
                  <input id="wordSpacing" type="range" min="0" max="0.5" step="0.05" value={wordSpacing} onChange={(e) => setWordSpacing(parseFloat(e.target.value))} className="w-24" />
                  <span className="text-xs text-gray-600 font-bold w-10 text-right">{wordSpacing.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-800 font-semibold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>{translations.accessibility.contentScale[language]}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={decreaseContentScale} className="px-2 py-0.5 text-xs bg-gray-200 rounded-md hover:bg-gray-300 font-bold">-</button>
                  <span className="text-xs text-gray-600 font-bold w-14 text-center">{contentScale}%</span>
                  <button onClick={increaseContentScale} className="px-2 py-0.5 text-xs bg-gray-200 rounded-md hover:bg-gray-300 font-bold">+</button>
                </div>
              </div>
              <button
                onClick={resetAccessibility}
                className="w-full px-3 py-1.5 text-xs bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-bold mt-2" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}
              >
                {translations.accessibility.resetAll[language]}
              </button>
            </div>
          </div>
        </Draggable>
      )}

      {/* Accessibility Icon */}
      <button
        onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
        className="z-40 bottom-4 right-4 sm:bottom-6 sm:right-6 fixed transition-transform hover:scale-110 cursor-pointer animate-[pulse-gentle_3s_infinite] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#ff7612] rounded-full"
        aria-label="Open Accessibility Menu"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30 p-3 sm:p-4 flex items-center justify-center">
          <FaWheelchair className="w-6 h-6 sm:w-7 sm:h-7 text-[#461711]" />
        </div>
      </button>

      {/* Language Selection Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={() => setIsLanguageModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl md:text-2xl font-bold text-[#461711] mb-6 text-center">Choose a Language</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`w-full text-left p-4 rounded-lg text-lg font-semibold transition-all duration-200 border-2 ${language === 'en' ? 'bg-[#ff7612] text-white border-transparent' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'}`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageSelect('ml')}
                className={`w-full text-left p-4 rounded-lg text-lg font-semibold transition-all duration-200 border-2 ${language === 'ml' ? 'bg-[#ff7612] text-white border-transparent' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'}`}
                style={{ fontFamily: 'Manjari, sans-serif' }}
              >
                മലയാളം
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={() => setIsConfirmModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl md:text-2xl font-bold text-[#461711] mb-4">Confirm Language Change</h3>
            <p className="text-gray-600 mb-8">
              Are you sure you want to translate the website to {targetLanguage === 'ml' ? 'Malayalam' : 'English'}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTranslation}
                className="px-6 py-2 rounded-lg font-semibold bg-[#461711] hover:bg-[#ff7612] text-white transition-all duration-200"
              >
                Yes, Translate
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        language={language}
      />

      {/* Main Content Sections */}
      <div
        className="bg-gradient-to-b from-[#fdfbf5] to-[#f5f0de] transition-transform duration-300"
        style={{ transform: `scale(${contentScale / 100})`, transformOrigin: 'top center' }}
      >
        <section ref={missionRef} className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <VisionMission language={language} />
          </div>
        </section>

        <section className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Newsletter language={language} />
          </div>
        </section>

        <section className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Objectives language={language} />
          </div>
        </section>

        <section ref={storyRef} className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Story language={language} />
          </div>
        </section>

        <section className="content-section py-16 md:py-24 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Ytp language={language} />
          </div>
        </section>

        <section ref={teamRef} className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Team language={language} />
          </div>
        </section>

        <section ref={calendarRef} className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
              <EventCalendar language={language} />
              <Testimonials language={language} />
            </div>
          </div>
        </section>

        <section className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <Photogallery language={language} />
          </div>
        </section>

        <section ref={faqsRef} className="content-section py-12 md:py-16 lg:py-20 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8">
            <FAQ language={language} />
          </div>
        </section>

      </div>

      <footer className="bg-[#461711] text-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-8 md:py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            {/* Column 1: Brand */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Mind Empowered</h3>
              <p className="text-sm text-white/70 max-w-md mx-auto md:mx-0" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                {translations.footer.subtitle[language]}
              </p>
            </div>

            {/* Column 2: Connect */}
            <div className="text-center md:text-right">
              <h4 className="font-semibold text-white mb-3">{translations.footer.connect[language]}</h4>
              <div className="flex justify-center md:justify-end gap-4">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#ffdb5b] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1" aria-label={link.label}>
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center border-t border-white/10 py-4">
            <p className="text-xs text-white/50">© {new Date().getFullYear()} Mind Empowered. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
