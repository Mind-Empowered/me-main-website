import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#461711]">
      
      {/* Full-screen Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          src="/404-animation.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Brand-colored gradient overlay to tie into the app's theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#461711]/70 via-[#461711]/50 to-[#461711]/90" />
      </div>
      
      {/* Logo */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <Link to="/" className="block">
          <div className="h-14 w-14 md:h-16 md:w-16 bg-white rounded-full p-1 shadow-2xl ring-2 ring-white/20 transition-transform duration-300 hover:scale-105 hover:ring-white/50">
            <img src="/brand/logo.jpeg" alt="Mind Empowered Logo" className="w-full h-full object-cover rounded-full" />
          </div>
        </Link>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center flex flex-col items-center mt-12 md:mt-0 animate-fade-in">
        
        <h1 className="text-[100px] md:text-[160px] lg:text-[200px] font-black text-white leading-none mb-2 md:mb-0 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] select-none opacity-90">
          404
        </h1>
        
        <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-lg leading-tight">
          Looks like this page lost its way
        </h2>
        
        <p className="text-base md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium drop-shadow-md">
          At Mind Empowered, we believe every setback is an opportunity to find a new path forward. Let's help you get back on track.
        </p>

        <Link 
          to="/" 
          className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-[#ff7612] border border-[#ff7612]/50 text-white rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-[#461711] hover:border-white hover:scale-105 transition-all duration-300 shadow-[0_8px_30px_rgba(255,118,18,0.4)] overflow-hidden"
        >
          <span className="relative z-10 uppercase tracking-widest text-sm md:text-base">Return Home</span>
          <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        
        {/* Footer Tagline */}
        <p className="mt-16 md:mt-24 text-white/60 font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs drop-shadow-md">
          Illuminating minds, transforming lives.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
