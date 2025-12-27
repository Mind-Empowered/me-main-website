import React from 'react';
import { translations } from "../translations";

const Story = ({ language }) => {
    return (
        <div className="relative isolate">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 -z-10 w-72 h-72 bg-[#ff7612]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 -z-10 w-96 h-96 bg-[#ffdb5b]/10 rounded-full blur-3xl" />

            {/* Section Header */}
            <div className="text-center mb-16 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#461711]/5 text-[#461711] text-xs font-bold tracking-widest uppercase mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]"></span>
                    Our Narrative
                </div>
                <h1 className={`font-extrabold text-[#461711] mb-6 leading-tight ${language === 'ml' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'}`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7612] to-[#ffdb5b]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                        {translations.story.title[language]}
                    </span>
                </h1>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 rounded-full"></div>
                <p className={`text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium ${language === 'ml' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.story.subtitle[language]}
                </p>
            </div>

            {/* Main Content: Illustration & Text */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 md:mb-32">
                {/* Illustration Column */}
                <div className="lg:col-span-5 order-2 lg:order-1 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/50 shadow-xl transform transition-transform duration-500 group-hover:scale-[1.03]">
                        <img
                            src="/mestory.svg"
                            alt="Mind Empowered Story Illustration"
                            className="w-full h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                    {/* Floating Accent */}
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#ff7612]/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }} />
                </div>

                {/* Text Content Column */}
                <div className={`lg:col-span-7 order-1 lg:order-2 space-y-6 text-gray-700 leading-relaxed ${language === 'ml' ? 'text-lg md:text-xl' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    <div className="relative">
                        <span className="absolute -left-8 -top-8 text-8xl text-[#ff7612]/10 font-serif leading-none select-none">“</span>
                        <p className="relative z-10">
                            <span className="font-extrabold text-[#461711] text-2xl">Mind Empowered (ME)</span> {translations.story.p1[language]} <span className="font-bold text-[#ff7612] border-b-2 border-[#ff7612]/20">{translations.story.p1_author[language]}</span>{translations.story.p1_cont[language]}
                        </p>
                    </div>

                    <p className="opacity-90">
                        {translations.story.p2[language]}
                    </p>

                    <div className="relative py-8 md:py-10">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ff7612] to-[#ffdb5b] rounded-full" />
                        <blockquote className="pl-8">
                            <p className={`font-bold text-[#461711] italic leading-snug ${language === 'ml' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                                {translations.story.quote[language]}
                            </p>
                        </blockquote>
                    </div>

                    <p className="opacity-90">
                        {translations.story.p3[language]}
                    </p>

                    <div className="pt-4 flex items-center gap-4 text-[#461711]">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#ff7612]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="font-bold">
                            {translations.story.p4[language]} <span className="text-[#ff7612] bg-[#ff7612]/10 px-2 py-0.5 rounded-md">{translations.story.p4_date[language]}</span>{translations.story.p4_cont[language]}
                        </p>
                    </div>
                </div>
            </div>

            {/* ME Story Cinema/Video Section */}
            <div className="mt-20 md:mt-32">
                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#461711] mb-2" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                        {language === 'ml' ? 'ഞങ്ങളുടെ യാത്ര കാണുക' : 'Experience Our Journey'}
                    </h3>
                    <p className="text-gray-500 font-medium">A visual recount of our impact and milestones</p>
                </div>

                <div className="max-w-5xl mx-auto px-4 md:px-0">
                    <div className="relative group">
                        {/* Dramatic Glow behind video */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                        <div className="relative rounded-[1.8rem] overflow-hidden shadow-2xl bg-black border-[6px] border-white ring-1 ring-gray-200">
                            <video
                                className="w-full h-auto aspect-video object-cover"
                                controls
                                playsInline
                                preload="metadata"
                                title="Mind Empowered Journey 2025"
                                aria-label="A video showcasing the journey and impact of Mind Empowered organization in 2025"
                            >
                                <source src="/ME_Video_2025.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Video Footer Detail */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md">
                            <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center gap-3">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7612] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7612]"></span>
                                </span>
                                <span className="text-sm font-bold text-[#461711] uppercase tracking-wider">
                                    ME Impact Documentary 2025
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Story;