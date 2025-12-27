import React, { useState } from "react";
import { translations } from "../translations";

const Accordion = ({ title, data, isOpen, toggleAccordion, language }) => {
  const contentRef = React.useRef(null);

  return (
    <div className={`mb-4 transition-all duration-500 rounded-2xl border ${isOpen ? 'bg-orange-50/30 border-[#ff7612]/30 shadow-lg' : 'bg-white border-gray-100 hover:border-[#ff7612]/20 hover:shadow-md'}`}>
      <button
        className="w-full p-5 text-left flex justify-between items-center group focus:outline-none"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
      >
        <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#ff7612]' : 'text-[#461711] group-hover:text-[#ff7612]'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          {title}
        </span>
        <div className={`p-2 rounded-xl transition-all duration-500 ${isOpen ? 'bg-[#ff7612] text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-[#ff7612]'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed text-base md:text-lg" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
          <div className="h-0.5 w-12 bg-[#ff7612]/20 mb-4 rounded-full" />
          {data}
        </div>
      </div>
    </div>
  );
};

const ContactTile = ({ icon, label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#ff7612]/20 hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff7612] group-hover:bg-[#ff7612] group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</div>
      <div className="text-sm font-bold text-[#461711] truncate max-w-[150px] md:max-w-none">
        {href.replace('mailto:', '').replace('https://', '')}
      </div>
    </div>
  </a>
);

const FAQ = ({ language }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const toggleAccordion = (key) => {
    setActiveIndex(activeIndex === key ? null : key);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, subject, message } = formData;
    const mailtoLink = `mailto:Mindempowered2020@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="relative isolate px-4 md:px-0">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 w-[30%] h-[30%] bg-[#461711]/5 rounded-full blur-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* FAQ Column */}
        <div className="space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-[#ff7612] text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
              Support Center
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#461711] mb-6 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.faq.title[language]}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.faq.subtitle[language]}
            </p>
          </div>

          <div className="space-y-2">
            {translations.accordions.map((accordion) => (
              <Accordion
                key={accordion.key}
                title={accordion.title[language]}
                data={accordion.data[language]}
                isOpen={activeIndex === accordion.key}
                toggleAccordion={() => toggleAccordion(accordion.key)}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* Contact Column */}
        <div className="space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#461711]/5 text-[#461711] text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#461711]"></span>
              Contact Us
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#461711] mb-6 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.faq.contactTitle[language]}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.faq.contactSubtitle[language]}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff7612]/10 to-transparent rounded-bl-full" />

            <h3 className="text-2xl font-bold text-[#461711] mb-8" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
              {translations.faq.formTitle[language]}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formName[language]}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formEmail[language]}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formSubject[language]}</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{translations.faq.formMessage[language]}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff7612] outline-none transition-all resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full group relative overflow-hidden rounded-xl bg-[#461711] p-4 font-bold text-white transition-all hover:bg-[#ff7612] active:scale-95 shadow-lg shadow-orange-900/10"
                style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {translations.faq.formButton[language]}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactTile
              label="Connect"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
              href="https://www.linkedin.com/company/mind-empowered/"
            />
            <ContactTile
              label="Instagram"
              icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" /></svg>}
              href="https://www.instagram.com/mind.empowered/"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
