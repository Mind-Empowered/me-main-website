
const Hero = () => {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="uppercase text-4xl md:text-7xl font-extrabold tracking-wider animate-fade-in">
          <span className="text-[#461711] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            Mind <br /> Empowered
          </span>
        </div>
        <div className="italic font-semibold text-2xl md:text-4xl pt-4 md:pt-6 animate-fade-in-delay">
          <span className="text-[#461711] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Illuminating minds. Transforming lives.
          </span>
        </div>
        <div className="font-black text-2xl pt-6 animate-fade-in-delay-2 tracking-wide">
          <span className="text-[#ffdb5b] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-shadow-[0_4px_8px_rgba(0,0,0,0.8)] hover:text-white transition-colors duration-300 font-mono">
            #MEforYouth
          </span>
        </div>
      </div>
    );
};

export default Hero;