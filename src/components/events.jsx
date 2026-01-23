import { useState } from 'react';

export default function Events({ language, onRegister }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    const translations = {
        title: { en: 'Upcoming Events', ml: 'വരാനിരിക്കുന്ന പരിപാടികൾ' },
        subtitle: { en: 'Join us in our mission to break mental health stigma', ml: 'മാനസികാരോഗ്യ കളങ്കം തകർക്കാനുള്ള ഞങ്ങളുടെ ദൗത്യത്തിൽ ചേരൂ' },
        learnMore: { en: 'Learn More', ml: 'കൂടുതലറിയുക' },
        register: { en: 'Register Now', ml: 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക' },
        date: { en: 'Date', ml: 'തീയതി' },
        location: { en: 'Location', ml: 'സ്ഥലം' },
    };

    const events = [
        {
            id: 1,
            name: { en: 'Dhriti', ml: 'ധൃതി' },
            tagline: { en: 'Elevate yourself by yourself', ml: 'സ്വയം നിങ്ങളെത്തന്നെ ഉയർത്തുക' },
            description: {
                en: "Kerala's First Mental Health Festival",
                ml: 'കേരളത്തിലെ ആദ്യത്തെ മാനസികാരോഗ്യ ഉത്സവം'
            },
            longDescription: {
                en: "Join ME in Celebrating YOU at Dhriti, Fort Kochi. This Valentine's Day, we're breaking mental health stigma through celebration, art, and connection. A transformative festival dedicated to mental wellness and self-empowerment.",
                ml: "ഫോർട്ട് കൊച്ചിയിലെ ധൃതിയിൽ നിങ്ങളെ ആഘോഷിക്കാൻ ME-യോടൊപ്പം ചേരൂ. ഈ വാലന്റൈൻസ് ദിനം, ആഘോഷം, കല, ബന്ധം എന്നിവയിലൂടെ ഞങ്ങൾ മാനസികാരോഗ്യ കളങ്കം തകർക്കുകയാണ്. മാനസിക ക്ഷേമത്തിനും സ്വയം ശാക്തീകരണത്തിനും സമർപ്പിച്ചിരിക്കുന്ന ഒരു പരിവർത്തന ഉത്സവം."
            },
            date: { en: "February 14, 2026", ml: 'ഫെബ്രുവരി 14, 2026' },
            location: { en: 'Fort Kochi', ml: 'ഫോർട്ട് കൊച്ചി' },
            image: '/events/dhrithi.png',
            website: 'https://dhriti.mind-empowered.org/',
            featured: true,
        },
    ];

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF5] via-[#FFF8DC] to-[#FAF9F6]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />

            {/* Decorative Elements */}
            <div className="absolute top-10 left-[5%] w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-[5%] w-64 h-64 bg-[#800020]/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#800020] mb-4 font-serif">
                        {translations.title[language]}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
                    <p className="text-lg md:text-xl text-[#5D4037] max-w-3xl mx-auto">
                        {translations.subtitle[language]}
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            onMouseEnter={() => setHoveredCard(event.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`group relative animate-fade-in-up ${event.featured ? 'lg:col-span-2' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(128,0,32,0.2)] border-2 border-[#D4AF37]/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(128,0,32,0.3)] hover:-translate-y-2">
                                {/* Event Image */}
                                <div className="relative h-64 md:h-80 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.name[language]}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Event Name Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif drop-shadow-lg">
                                            {event.name[language]}
                                        </h3>
                                        <p className="text-lg md:text-xl text-white/90 italic drop-shadow-md">
                                            {event.tagline[language]}
                                        </p>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <p className="text-xl md:text-2xl font-semibold text-[#800020] mb-3">
                                            {event.description[language]}
                                        </p>
                                        <p className="text-base md:text-lg text-[#5D4037] leading-relaxed">
                                            {event.longDescription[language]}
                                        </p>
                                    </div>

                                    {/* Event Meta */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-start gap-3 p-4 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20">
                                            <svg className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-semibold text-[#800020]/70 mb-1">{translations.date[language]}</p>
                                                <p className="text-base font-medium text-[#800020]">{event.date[language]}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-[#800020]/5 rounded-xl border border-[#800020]/20">
                                            <svg className="w-6 h-6 text-[#800020] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-semibold text-[#800020]/70 mb-1">{translations.location[language]}</p>
                                                <p className="text-base font-medium text-[#800020]">{event.location[language]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={onRegister}
                                            className="flex-1 px-8 py-3 bg-[#800020] text-white rounded-full font-semibold text-center hover:bg-[#A0153E] transition-all duration-300 shadow-[0_4px_14px_rgba(128,0,32,0.3)] hover:shadow-[0_6px_20px_rgba(128,0,32,0.4)] hover:-translate-y-0.5 cursor-pointer"
                                        >
                                            {translations.register[language]}
                                        </button>
                                        <a
                                            href={event.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-8 py-3 bg-white text-[#800020] border-2 border-[#800020] rounded-full font-semibold text-center hover:bg-[#800020] hover:text-white transition-all duration-300"
                                        >
                                            {translations.learnMore[language]}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
