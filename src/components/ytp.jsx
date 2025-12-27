import React from 'react';
import { translations } from '../translations';

const Ytp = ({ language }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-[#ff7612]/10 to-[#ffdb5b]/20 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-[#461711]/5 to-transparent rounded-full blur-2xl -z-10" />

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 p-8 lg:p-16">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#ff7612]/10 text-[#ff7612] text-sm font-bold tracking-wider uppercase mb-6">
                            Global Impact
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#461711] mb-6 leading-tight" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.team.collabTitle[language]}
                        </h2>

                        <div className="w-20 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] rounded-full mb-8 mx-auto lg:mx-0"></div>

                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 font-medium" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            {translations.team.collabSubtitle[language]}
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Active Collaboration
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-[#ff7612]"></span>
                                The Yellow Tulip Project
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative group">
                            {/* Image Frame/Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#ff7612]/20 to-[#ffdb5b]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative bg-white p-3 rounded-2xl shadow-xl border border-gray-100 transform transition-transform duration-500 group-hover:scale-[1.02]">
                                <img
                                    src="https://me-website-assets.s3.ap-south-1.amazonaws.com/ytp_collab/ytp.jpeg"
                                    alt="International Collaboration - The Yellow Tulip Project"
                                    className="w-full h-auto rounded-xl shadow-inner"
                                />
                            </div>

                            {/* Badge on Image */}
                            <div className="absolute -bottom-6 -right-6 lg:right-4 bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 flex items-center gap-4 hidden sm:flex">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] flex items-center justify-center text-white shadow-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[#461711]">Partnering</div>
                                    <div className="text-xs text-gray-500">Breaking Stigma Globally</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ytp;