import React from 'react';
import { translations } from "../translations";

const Story = ({ language }) => {
    return (
        <div className="relative isolate">
            {/* ── Background Aesthetics ────────────────────────── */}
            <div className="absolute top-40 left-0 w-full h-[80%] bg-[#ff7612]/[0.02] -z-10 skew-y-3" />
            <div className="absolute top-0 left-1/4 -z-10 w-72 h-72 bg-[#ff7612]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 -z-10 w-96 h-96 bg-[#ffdb5b]/10 rounded-full blur-3xl" />

            {/* ── Section Header ──────────────────────────────── */}
            <div className="text-center mb-16 md:mb-24">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#461711]/5 text-[#461711] text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-[#461711]/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]" />
                    Our Narrative
                </div>
                <h2 className={`font-black text-[#461711] mb-8 tracking-tight leading-none ${language === 'ml' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-5xl sm:text-6xl md:text-7xl'}`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7612] via-[#ff7612] to-[#ffdb5b]" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                        {translations.story.title[language]}
                    </span>
                </h2>
                <div className="flex justify-center gap-1.5 mb-8">
                    <div className="w-12 h-1.5 bg-[#ff7612] rounded-full"></div>
                    <div className="w-3 h-1.5 bg-[#ffdb5b] rounded-full"></div>
                    <div className="w-3 h-1.5 bg-[#461711]/10 rounded-full"></div>
                </div>
                <p className={`text-gray-500 max-w-2xl mx-auto leading-relaxed font-semibold italic ${language === 'ml' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                    {translations.story.subtitle[language]}
                </p>
            </div>

            {/* ── Main Content Grid ────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-20 md:mb-40">

                {/* Left Column: Visual & Founding Details */}
                <div className="lg:col-span-6 space-y-12">
                    <div className="relative">
                        {/* Interactive Frame removed hover */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff7612]/20 to-[#ffdb5b]/30 rounded-[2.5rem] blur-2xl opacity-40" />

                        <div className="relative">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(70,23,17,0.2)] bg-black border-8 border-white ring-1 ring-gray-100">
                                <video
                                    className="w-full h-auto aspect-video object-cover"
                                    controls
                                    playsInline
                                    preload="metadata"
                                    title="Mind Empowered Journey 2025"
                                >
                                    <source src="/ME%20Video%202025.mp4" type="video/mp4" />
                                </video>
                            </div>


                        </div>
                    </div>

                    {/* Founding Details Card */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white shadow-xl shadow-orange-900/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 -mr-16 -mt-16 rounded-full" />

                        <div className="relative z-10 space-y-8">
                            <p className={`text-gray-700 font-medium leading-relaxed ${language === 'ml' ? 'text-lg md:text-xl' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {translations.story.p3[language]}
                            </p>

                            <div className="flex items-center gap-6 pt-4 border-t border-orange-100">
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#461711] font-black text-xl mb-1" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                        {translations.story.p4_date[language]}
                                    </p>
                                    <p className="text-[#ff7612] text-sm font-bold uppercase tracking-widest">A Movement Was Born</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Narrative & Philosophy */}
                <div className={`lg:col-span-6 pt-0 lg:pt-12 space-y-10 text-gray-700 leading-relaxed ${language === 'ml' ? 'text-lg md:text-xl' : 'text-lg md:text-xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>

                    <div className="relative">
                        <span className="absolute -left-12 -top-12 text-[12rem] text-[#ff7612]/5 font-serif leading-none select-none">"</span>
                        <div className="relative z-10 space-y-8">
                            <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#ff7612] first-letter:mr-3 first-letter:float-left pt-2">
                                <span className="font-black text-[#461711] text-2xl">Mind Empowered (ME)</span> {translations.story.p1[language]} <span className="text-[#ff7612] font-black underline decoration-4 decoration-orange-100 underline-offset-4">{translations.story.p1_author[language]}</span>{translations.story.p1_cont[language]}
                            </p>

                            <p className="opacity-80 font-medium">
                                {translations.story.p2[language]}
                            </p>
                        </div>
                    </div>

                    {/* Highly Stylized Quote Block */}
                    <div className="relative mt-20 pt-16">
                        {/* Visual Connector Line */}
                        <div className="absolute top-0 left-10 w-px h-16 bg-gradient-to-b from-orange-200 to-transparent" />

                        <div className="relative bg-gradient-to-br from-[#461711] to-[#2a0d0a] text-white p-12 md:p-14 rounded-[3rem] shadow-2xl shadow-orange-950/20 overflow-hidden">
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-8 right-10 text-white/10">
                                <svg className="w-24 h-24 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.899 14.899 16.017 16 16.017L21.017 16.017L21.017 21L14.017 21ZM14.017 14L14.017 11C14.017 9.899 14.899 9.017 16 9.017L21.017 9.017L21.017 14L14.017 14ZM5.017 21L5.017 18C5.017 16.899 5.899 16.017 7 16.017L12.017 16.017L12.017 21L5.017 21ZM5.017 14L5.017 11C5.017 9.899 5.899 9.017 7 9.017L12.017 9.017L12.017 14L5.017 14ZM12 6C12 5.4 12.1 4.8 12.2 4.3C12.3 3.9 12.5 3.5 12.8 3.1C13.1 2.8 13.5 2.5 14 2.2C14.5 2 15 1.9 15.4 1.9L15.8 1.9L15.8 5.4L15.4 5.4C14.9 5.4 14.5 5.5 14.2 5.7C13.9 5.9 13.8 6.2 13.8 6.5L13.8 7.6L15.8 7.6L15.8 11.1L12 11.1L12 6ZM3.1 6C3.1 5.4 3.2 4.8 3.3 4.3C3.4 3.9 3.6 3.5 3.9 3.1C4.2 2.8 4.6 2.5 5.1 2.2C5.6 2 6.1 1.9 6.5 1.9L6.9 1.9L6.9 5.4L6.5 5.4C6 5.4 5.6 5.5 5.3 5.7C5 5.9 4.9 6.2 4.9 6.5L4.9 7.6L6.9 7.6L6.9 11.1L3.1 11.1L3.1 6Z" />
                                </svg>
                            </div>

                            <blockquote className="relative z-10">
                                <p className={`font-black italic leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white to-orange-200 ${language === 'ml' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>
                                    {translations.story.quote[language]}
                                </p>
                            </blockquote>

                            <div className="mt-8 flex items-center gap-3">
                                <div className="h-0.5 w-12 bg-[#ff7612]" />
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60">The core philosophy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── YTP Collaboration Section ───────────────────── */}
            <div className="mt-20 lg:mt-32">
                {/* Advanced Divider */}
                <div className="flex items-center gap-6 mb-20">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-orange-200" />
                    <div className="flex items-center gap-3 px-6 py-2 rounded-full border-2 border-orange-100 bg-white shadow-sm">
                        <img src="/brand/mascot.svg" className="w-5 h-5" alt="Mascot" />
                        <span className="text-[10px] font-black text-[#461711] tracking-[0.2em] uppercase">Expanding Impact</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-orange-200 to-orange-200" />
                </div>

                <div className="relative overflow-hidden bg-white/40 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white p-8 md:p-16 lg:p-24">
                    {/* Artistic gradient background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/50 to-transparent -mr-80 -mt-80 rounded-full blur-[120px] -z-10" />

                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
                        {/* Text Block */}
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[#ff7612] text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-orange-500/20">
                                Global Partnership
                            </div>

                            <h3 className={`font-black text-[#461711] leading-none tracking-tighter ${language === 'ml' ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {translations.team.collabTitle[language]}
                            </h3>

                            <div className="space-y-6 text-gray-600 font-medium">
                                <p className="text-xl text-[#ff7612] font-black italic">
                                    {translations.team.collabSubtitle[language]}
                                </p>
                                <p className="leading-relaxed leading-[1.8] opacity-80">
                                    The Yellow Tulip Project (YTP) is a global mental health initiative dedicated to empowering young people and reducing stigma. Mind Empowered is the bridge bringing this global perspective to the youth of India — combining local heart with international expertise.
                                </p>
                            </div>

                            {/* Impact Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                {[
                                    { title: 'Global Reach', text: '3 Continents', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945' },
                                    { title: 'Youth First', text: 'Gen-Z Led', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z' },
                                    { title: 'Safe Space', text: 'Stigma-Free', icon: 'M9 12l2 2 4-4' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff7612] mb-4">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                            </svg>
                                        </div>
                                        <div className="text-[10px] font-black text-[#461711] uppercase tracking-wider mb-1 opacity-40">{stat.title}</div>
                                        <div className="text-sm font-black text-[#461711]">{stat.text}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <a
                                    href="https://www.theyellowtulipproject.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative inline-flex items-center gap-4 px-10 py-5 bg-[#461711] text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-2xl shadow-orange-950/20"
                                >
                                    <span>Explore YTP Global</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Image Frame */}
                        <div className="w-full lg:w-2/5">
                            <div className="relative">
                                <div className="absolute -inset-6 bg-gradient-to-br from-[#ff7612]/20 to-[#ffdb5b]/30 rounded-[3rem] blur-2xl opacity-30" />
                                <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-white transition-transform duration-500">
                                    <img
                                        src="https://me-website-assets.s3.ap-south-1.amazonaws.com/ytp_collab/ytp.jpeg"
                                        alt="International Collaboration"
                                        className="w-full h-auto rounded-[2.2rem] shadow-inner transition-all duration-700"
                                    />
                                    {/* Glass Link Tag */}
                                    <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#ff7612] flex items-center justify-center text-white shadow-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9" /></svg>
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-[#461711]">ME × YTP</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Alliance</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Story;