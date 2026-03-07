const Hero = ({ language, openDonateModal, openVolunteerModal }) => {
    return (
        <div className="absolute inset-0">
            {/* Centered Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center -mt-20 sm:mt-0">
                    <h1
                        className="text-5xl leading-[1.1] sm:text-4xl md:text-5xl lg:text-7xl font-black animate-fade-in-up"
                        style={{ textShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] via-[#ff7612] to-[#ffdb5b] bg-[length:200%_auto] animate-gradient-slow">
                            Mind Empowered
                        </span>
                    </h1>

                    <p
                        className="text-base sm:text-lg md:text-xl text-[#461711] mt-4 font-bold tracking-tight animate-fade-in-up-delay max-w-lg leading-relaxed"
                        style={{ textShadow: '0 2px 4px rgba(255, 255, 255, 0.5)' }}
                    >
                        Illuminating minds. Transforming lives.
                    </p>
                </div>
            </div>

            {/* Buttons fixed at the bottom area */}
            <div className="absolute bottom-20 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 animate-fade-in-up-delay-2">
                <button
                    onClick={openDonateModal}
                    className="group relative w-full sm:w-auto px-10 py-4 bg-[#461711] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-[#ff7612] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-[#ffdb5b]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                        Donate Now
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>

                <button
                    onClick={openVolunteerModal}
                    className="group w-full sm:w-auto px-10 py-4 bg-white/30 backdrop-blur-md text-[#461711] border-2 border-[#461711]/20 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-white hover:border-transparent transition-all duration-500 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4 text-[#ff7612]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" /></svg>
                    Volunteer Now
                </button>
            </div>
        </div>
    );
};

export default Hero;