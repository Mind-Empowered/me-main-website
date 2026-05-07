import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { translations } from '../translations';

const EventHighlight = ({ language }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const highlights = [
        {
            id: 'dhriti',
            t: translations.dhritiHighlight,
            media: {
                type: 'video',
                src: '/events/Dhriti.mp4',
                poster: '/events/dhrithi.png'
            },
            theme: {
                bg: 'bg-orange-50/50',
                border: 'border-orange-100',
                text: 'text-orange-600',
                accent: 'bg-[#ff7612]',
                glow: 'from-[#ff7612] to-[#ffdb5b]',
                shadow: 'shadow-orange-200/50',
                tag: 'bg-orange-100 text-[#ff7612]'
            },
            mascot: '/brand/mascot.svg',
            siteUrl: 'https://dhriti.mind-empowered.org/',
            stats: [
                { label: 'Community', value: translations.dhritiHighlight.stats.attendees[language] },
                { label: 'Activities', value: translations.dhritiHighlight.stats.impact[language] },
                { label: 'Standard', value: translations.dhritiHighlight.stats.energy[language] }
            ]
        },
        {
            id: 'starlet',
            t: translations.starletHighlight,
            media: {
                type: 'image',
                src: '/starlet/Starlet.gif',
            },
            theme: {
                bg: 'bg-blue-50/50',
                border: 'border-blue-100',
                text: 'text-blue-600',
                accent: 'bg-[#0a2e5c]',
                glow: 'from-[#0a2e5c] to-[#f9d423]',
                shadow: 'shadow-blue-200/50',
                tag: 'bg-blue-100 text-[#0a2e5c]'
            },
            mascot: '/starlet/Logo.png',
            siteUrl: 'https://forms.gle/iThpACLBpYH3Q6go6', 
            stats: [
                { label: 'Innovators', value: translations.starletHighlight.stats.participants[language] },
                { label: 'Projects', value: translations.starletHighlight.stats.projects[language] },
                { label: 'Energy', value: translations.starletHighlight.stats.innovation[language] }
            ]
        }
    ];

    const current = highlights[currentIndex];

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % highlights.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    // Modal Component
    const ModalPortal = () => {
        if (!isPopupOpen) return null;

        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => setIsPopupOpen(false)}
                />
                <div className="relative bg-white w-full max-w-7xl h-[85vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 border-orange-200 flex flex-col transform transition-all duration-300 scale-100">
                    <div className="flex justify-between items-center p-6 bg-orange-50/50 border-b border-orange-100 relative z-10">
                        <div className="flex items-center gap-4">
                            <img src={current.mascot} className="w-10 h-10 object-contain" alt="Mascot" />
                            <h3 className="text-xl md:text-2xl font-black text-[#461711] tracking-tight">{current.t.title[language]}</h3>
                        </div>
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="group flex items-center gap-2 bg-[#461711] text-white px-5 py-2.5 rounded-2xl hover:bg-[#ff7612] transition-all duration-300 shadow-lg"
                        >
                            <span className="font-bold text-sm">Close</span>
                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 w-full bg-gray-50 relative">
                        <iframe
                            src={current.siteUrl}
                            className="absolute inset-0 w-full h-full border-none"
                            title="Highlight Website"
                            allow="autoplay"
                        />
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <section id="event-highlight" className="py-20 relative overflow-hidden">
            <ModalPortal />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                
                {/* Navigation Arrows */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-xl text-[#461711] hover:bg-[#ff7612] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 lg:opacity-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-xl text-[#461711] hover:bg-[#ff7612] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 lg:opacity-100"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className={`bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl ${current.theme.shadow} border border-white p-8 lg:p-12 relative overflow-hidden group`}>

                        {/* Dhriti Mascot Animation */}
                        {current.id === 'dhriti' && (
                            <div
                                onClick={() => setIsPopupOpen(true)}
                                className="absolute cursor-pointer z-20 animate-flutter"
                                style={{
                                    left: '10%',
                                    top: '15%',
                                }}
                            >
                                <div className="relative">
                                    <img
                                        src={current.mascot}
                                        alt="Mascot"
                                        className="w-16 h-16 animate-flap drop-shadow-xl"
                                    />
                                    <div className="absolute -top-10 left-12 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        <span className="text-xs font-bold text-[#461711]">Explore Dhriti!</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                            {/* Text Content */}
                            <div className="lg:col-span-5 order-2 lg:order-1 relative z-10">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${current.theme.tag} text-xs font-bold tracking-widest uppercase mb-6`}>
                                    <span className={`w-2 h-2 rounded-full ${current.theme.accent} animate-pulse`}></span>
                                    Flagship Event Showcase
                                </div>

                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#461711] mb-6 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                    {current.t.title[language]}
                                </h2>

                                <p className={`text-lg ${current.theme.text} font-semibold mb-4 italic`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                    {current.t.subtitle[language]}
                                </p>

                                <p className="text-gray-600 leading-relaxed text-lg mb-10" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                    {current.t.description[language]}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    {current.stats.map((stat, idx) => (
                                        <div key={idx} className={`${current.theme.bg} p-4 rounded-2xl border ${current.theme.border} text-center`}>
                                            <div className={`${current.theme.text} font-bold text-lg mb-1`}>{stat.value}</div>
                                            <div className="text-[10px] uppercase tracking-widest text-[#461711]/60 font-bold">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {current.id === 'starlet' && (
                                    <button
                                        onClick={() => setIsPopupOpen(true)}
                                        className={`px-8 py-3 ${current.theme.accent} text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2`}
                                        style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}
                                    >
                                        {language === 'ml' ? 'സന്ദർശിക്കുക' : 'Visit Starlet'}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Media Content */}
                            <div className="lg:col-span-7 order-1 lg:order-2">
                                <div className="relative">
                                    <div className={`absolute -inset-1.5 bg-gradient-to-r ${current.theme.glow} rounded-[2.2rem] blur opacity-40`}></div>

                                    <div className="relative bg-black rounded-[2rem] overflow-hidden aspect-video shadow-2xl border-4 border-white">
                                        {current.media.type === 'video' ? (
                                            <video
                                                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                                                src={current.media.src}
                                                poster={current.media.poster}
                                                controls
                                                playsInline
                                            ></video>
                                        ) : (
                                            <img 
                                                src={current.media.src} 
                                                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                                                alt="Starlet Highlight"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-10">
                    {highlights.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-3 rounded-full transition-all duration-300 ${currentIndex === idx ? `w-12 ${current.theme.accent}` : 'w-3 bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes flutter {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    10% { transform: translate(150px, -20px) rotate(5deg); }
                    25% { transform: translate(300px, 40px) rotate(-5deg); }
                    40% { transform: translate(450px, -10px) rotate(8deg); }
                    55% { transform: translate(300px, 60px) rotate(-3deg); }
                    70% { transform: translate(100px, 20px) rotate(4deg); }
                    85% { transform: translate(-50px, -30px) rotate(-6deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes flap {
                    0%, 100% { transform: scaleX(1); }
                    50% { transform: scaleX(0.7); }
                }
                .animate-flutter {
                    animation: flutter 25s infinite linear;
                }
                .animate-flap {
                    animation: flap 0.3s infinite ease-in-out;
                    transform-origin: center;
                }
            `}</style>
        </section>
    );
};

export default EventHighlight;
