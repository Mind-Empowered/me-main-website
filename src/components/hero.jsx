const Hero = () => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 -translate-y-40">
            <h1 
                className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-bold animate-fade-in-up"
                style={{ textShadow: '0 3px 15px rgba(0, 0, 0, 0.4)' }}
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdb5b] to-[#ff7612]">
                    Mind Empowered
                </span>
            </h1>
            <p 
                className="text-3xl sm:text-4xl md:text-5xl text-[#461711] mt-8 font-medium tracking-wide animate-fade-in-up-delay"
                style={{ textShadow: '0 1px 3px rgba(255, 255, 255, 0.3)' }}
            >
                Illuminating minds. Transforming lives.
            </p>
        </div>
    );
};

export default Hero;