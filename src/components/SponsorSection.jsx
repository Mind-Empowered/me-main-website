import React from 'react';
import { translations } from "../translations";

const SponsorSection = ({ language, onSponsorClick }) => {
    const manjariFont = language === 'ml' ? { fontFamily: 'Manjari, sans-serif' } : {};
    const t = translations.sponsor;

    return (
        <section id="sponsor-section" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white to-orange-50/30">
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-orange-100/40 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/2 -left-32 w-[25rem] h-[25rem] bg-orange-200/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left Column: Poster Showcase */}
                    <div className="w-full lg:w-5/12 order-2 lg:order-1">
                        <div className="relative group">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-6 bg-white rounded-[3rem] shadow-2xl shadow-orange-200/50 -rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                            
                            <div className="relative bg-white p-3 rounded-[2.5rem] shadow-xl border border-orange-100 overflow-hidden transform transition-all duration-500 group-hover:translate-y-[-8px]">
                                <img 
                                    src="/sponsor.png" 
                                    alt="Sponsor a Girl Poster" 
                                    className="w-full h-auto rounded-[2rem] shadow-inner"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* High-Impact Floating Badge */}
                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] text-white p-5 rounded-3xl shadow-[0_15px_30px_rgba(255,118,18,0.3)] rotate-12 group-hover:rotate-6 transition-all duration-500 flex flex-col items-center">
                                    <span className="font-black text-2xl tracking-tighter leading-none">₹1000</span>
                                    <p className="text-[10px] uppercase tracking-widest font-bold mt-1 opacity-90 text-[#461711]">Contribution</p>
                                </div>
                            </div>

                            {/* Trust Indicator */}
                            <div className="mt-10 flex items-center justify-center gap-3 text-orange-800/60 font-bold text-xs uppercase tracking-widest animate-fade-in">
                                <span className="w-12 h-[1px] bg-orange-200" />
                                Your support changes lives
                                <span className="w-12 h-[1px] bg-orange-200" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative & Action */}
                    <div className="w-full lg:w-7/12 order-1 lg:order-2 text-center lg:text-left">
                        {/* Starlet Brand Integration */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6 mb-10 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-orange-100 shadow-xl flex items-center justify-center p-2 overflow-hidden transition-transform duration-500 hover:rotate-6">
                                    <img 
                                        src="/starlet/Logo.png" 
                                        className="w-full h-full object-contain" 
                                        alt="Starlet Logo" 
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#461711] leading-[1.1]" style={manjariFont}>
                                    {t.title[language]}
                                </h2>
                                <div className="h-1.5 w-32 bg-[#ff7612] rounded-full mt-4 mx-auto lg:mx-0 shadow-sm" />
                            </div>
                        </div>
                        
                        <div className="relative mb-12">
                            <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed" style={manjariFont}>
                                {t.description[language]}
                            </p>
                            {/* Decorative Quote Mark */}
                            <div className="absolute -top-10 -left-10 text-[12rem] text-orange-100/50 font-serif pointer-events-none select-none">“</div>
                        </div>

                        {/* Action Hub */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-5">
                            <button
                                onClick={onSponsorClick}
                                className="group relative overflow-hidden px-10 py-5 bg-[#461711] text-white rounded-[1.25rem] font-black text-lg shadow-[0_20px_40px_rgba(70,23,17,0.3)] hover:shadow-[0_20px_40px_rgba(255,118,18,0.4)] transition-all duration-300 active:scale-95"
                                style={manjariFont}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                <span className="flex items-center justify-center gap-3">
                                    {t.button[language]}
                                    <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </button>
                            
                            <button
                                onClick={() => window.open('https://m-lp.co/mindempo?utm_medium=campaign_page_share&utm_source=copy', 'Campaign', 'width=800,height=900,scrollbars=yes')}
                                className="px-10 py-5 bg-white text-[#461711] border-2 border-[#461711]/10 rounded-[1.25rem] font-black text-lg shadow-xl hover:bg-[#461711] hover:text-white hover:border-[#461711] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                                style={manjariFont}
                            >
                                {t.campaignButton[language]}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </button>
                        </div>

                        {/* Policy Note - Refined as a floating callout */}
                        <div className="mt-16 inline-flex items-center gap-4 bg-orange-100/50 backdrop-blur-sm border border-orange-200/50 px-6 py-4 rounded-3xl">
                            <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.566.908v5.612c0 4.39-2.73 8.351-6.84 9.92a1 1 0 01-.72 0c-4.11-1.569-6.84-5.53-6.84-9.92V5.808a1 1 0 01.566-.907zM10 10.858v-4.14a1 1 0 10-2 0v4.14a2 2 0 104 0h-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm md:text-base text-orange-900 font-bold italic text-left leading-tight" style={manjariFont}>
                                {language === 'ml' 
                                    ? '* നിങ്ങളുടെ സംഭാവനയുടെ 100% വിദ്യാർത്ഥികളുടെ ഫീസിലേക്ക് നേരിട്ട് പോകുന്നു.' 
                                    : '* 100% of your donation goes directly towards the student\'s participation fees.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SponsorSection;
