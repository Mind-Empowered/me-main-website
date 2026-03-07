import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { translations } from '../translations';

const EventHighlight = ({ language }) => {
    const t = translations.dhritiHighlight;
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                            <img src="/brand/mascot.svg" className="w-8 h-8" alt="Dhriti Mascot" />
                            <h3 className="text-xl md:text-2xl font-black text-[#461711] tracking-tight">Dhriti: Exploring Mental Health</h3>
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
                            src="https://dhriti.mind-empowered.org/"
                            className="absolute inset-0 w-full h-full border-none"
                            title="Dhriti Website"
                            allow="autoplay"
                        />
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    return (
        <section id="dhriti-highlight" className="py-20 relative overflow-hidden">
            <ModalPortal />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl shadow-orange-200/50 border border-white p-8 lg:p-12 relative overflow-hidden group">

                    {/* Flying Mascot Butterfly */}
                    <div
                        onClick={() => setIsPopupOpen(true)}
                        className="absolute cursor-pointer z-20 animate-flutter group-hover:pause-animation"
                        style={{
                            left: '10%',
                            top: '15%',
                        }}
                    >
                        <div className="relative hover:scale-125 transition-transform duration-300">
                            <img
                                src="/brand/mascot.svg"
                                alt="Dhriti Mascot"
                                className="w-16 h-16 drop-shadow-[0_10px_10px_rgba(255,118,18,0.3)] animate-flap"
                            />
                            <div className="absolute -top-10 left-12 bg-white px-3 py-1.5 rounded-xl border border-orange-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                <span className="text-xs font-bold text-[#461711]">Click to Explore Dhriti!</span>
                                <div className="absolute -bottom-1 left-2 w-2 h-2 bg-white border-b border-r border-orange-100 rotate-45"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                        {/* Text Content */}
                        <div className="lg:col-span-5 order-2 lg:order-1 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-[#ff7612] text-xs font-bold tracking-widest uppercase mb-6">
                                <span className="w-2 h-2 rounded-full bg-[#ff7612] animate-pulse"></span>
                                Flagship Event Showcase
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#461711] mb-6 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {t.title[language]}
                            </h2>

                            <p className="text-lg text-orange-600 font-semibold mb-4 italic" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {t.subtitle[language]}
                            </p>

                            <p className="text-gray-600 leading-relaxed text-lg mb-10" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {t.description[language]}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                                    <div className="text-[#ff7612] font-bold text-lg mb-1">{t.stats.attendees[language]}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-[#461711]/60 font-bold">Community</div>
                                </div>
                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                                    <div className="text-[#ff7612] font-bold text-lg mb-1">{t.stats.impact[language]}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-[#461711]/60 font-bold">Activities</div>
                                </div>
                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-center">
                                    <div className="text-[#ff7612] font-bold text-lg mb-1">{t.stats.energy[language]}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-[#461711]/60 font-bold">Standard</div>
                                </div>
                            </div>
                        </div>

                        {/* Video Content */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="relative">
                                {/* Glow Effect static */}
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] rounded-[2.2rem] blur opacity-40"></div>

                                <div className="relative bg-black rounded-[2rem] overflow-hidden aspect-video shadow-2xl border-4 border-white">
                                    <video
                                        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                                        src="/events/Dhriti.mp4"
                                        poster="/events/dhrithi.png"
                                        controls
                                        playsInline
                                        title="Dhriti Event Video"
                                    ></video>
                                </div>
                            </div>
                        </div>

                    </div>
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
                .pause-animation {
                    animation-play-state: paused;
                }
                .pause-animation .animate-flap {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default EventHighlight;
