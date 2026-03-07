import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { translations } from '../translations';

const imageFilenames = [
    "Akhil T S, Kerala.jpeg", "Angana Mukherjee Sharma, Mumbai.jpeg", "Anoop Krishnan, Canada.jpeg",
    "Anu Suraj, Kochi.jpeg", "Anupama Menon,United Kingdom.jpg", "Arjun Gupta, Delhi.jpeg",
    "Asha Khatri, Jaipur.jpeg", "Ashika Shetty, Bengaluru.jpg", "Ashrita Mahajan,Vadodara.jpeg",
    "Ashwini N.V, Bengaluru.jpeg", "Atika Shukla,Singapore .jpeg", "Avani Prasad,Ranchi .jpeg",
    "Aysha Nawreen,Hyderabad.jpeg", "B V Ramalakshmi,Kerala.jpeg", "Bharti Jaravta,Gurgaon.png",
    "Charumathi.png", "Cini Padmanabhan,Kerala.jpeg", "Cristelle Hart Singh,Kerala.jpeg",
    "Dhanya Ravi,Bengaluru .jpeg", "Dr. Ananya Sinha, Bengaluru.jpeg", "Dr. Sowmya Putturaju,Bengaluru .jpeg",
    "Dr. Vani Kulhalli,Mumbai.jpeg", "Dr. Vishal Indla,Hyderabad .jpeg", "Dr.Bino Mary Chacko,Kerala.jpeg",
    "Dr.Femi Abdulla, Kerala.jpeg", "Dr.Pramod Chandran,Kerala.png", "Dr.Pritesh Goutam, Bhopal.png",
    "Dr.Priya Nair, Hyderabad.jpeg", "Dr.Priya Puri, Kolkatta.jpeg", "Dr.Saroj Menon,Kerala.jpeg",
    "Dr.Sneha Naik Samant, Mumbai.png", "Eeshani Chakraverty, Mumbai.png", "Gajalakshmi K, Tamilnadu .JPG",
    "Gayathri,Kerala.jpeg", "Himaja A,Bengaluru.jpeg", "Jaya Nila,Bengaluru.jpeg",
    "Jennifer Tavares,Bengaluru.jpeg", "Jereesh Elias,UAE .jpeg", "Katherine David,Chennai.jpeg",
    "Kavya EcoFeminist, Kerala.jpeg", "Krishnan Nair, Bengaluru.jpeg", "Lakshmi Kashyap,Bengaluru.jpeg",
    "Manasa Ram, Vishakhapatnam.jpeg", "Manjiri Deshpande Shenoy,Mumbai.jpeg", "Manju Goel, Bengaluru.jpeg",
    "Mariya Biju,Kerala.jpeg", "Maxine Jardiner, Australia .png", "Meghna Girish, Kerala.png",
    "Mukund Nair,Gurugram.png"
];

const s3BucketURL = "https://me-website-assets.s3.ap-south-1.amazonaws.com/trainers/";

/* ─────────────────────────────────────────────
   Member Detail Modal
───────────────────────────────────────────── */
const MemberModal = ({ member, language, onClose }) => {
    // Close on ESC key
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!member) return null;

    return ReactDOM.createPortal(
        <div
            className="team-modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-label={member.name[language]}
        >
            <div className="team-modal-card">
                {/* Close Button */}
                <button className="team-modal-close" onClick={onClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Decorative header gradient */}
                <div className="team-modal-header-bg" />

                <div className="team-modal-body">
                    {/* Photo */}
                    <div className="team-modal-photo-wrap">
                        <div className="team-modal-glow-ring" />
                        <div className="team-modal-photo-inner">
                            <img
                                src={member.image}
                                alt={member.name[language]}
                                className="team-modal-photo"
                            />
                        </div>
                    </div>

                    {/* Name & Role */}
                    <h2 className="team-modal-name">{member.name[language]}</h2>
                    <div className="team-modal-role">{member.role[language]}</div>

                    {/* Bio */}
                    <p
                        className="team-modal-bio"
                        style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}
                    >
                        {member.bio[language]}
                    </p>

                    {/* Decorative dots */}
                    <div className="team-modal-dots">
                        <span /><span /><span />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ─────────────────────────────────────────────
   Main Team Component
───────────────────────────────────────────── */
const Team = ({ language }) => {
    const scrollRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeMember, setActiveMember] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    // Intersection Observer for mobile animations
    useEffect(() => {
        const observerOptions = {
            root: scrollRef.current,
            threshold: 0.6,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveMember(entry.target.getAttribute('data-key'));
                }
            });
        }, observerOptions);

        const cards = scrollRef.current?.querySelectorAll('.team-card');
        cards?.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [language]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            setScrollProgress(progress);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const coachesExtended = [...imageFilenames, ...imageFilenames];

    return (
        <div className="relative isolate">
            <style>{`
                /* ── Marquee ── */
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-infinite {
                    display: flex;
                    width: max-content;
                    animation: marquee 60s linear infinite;
                }

                /* ── Team card compact ── */
                .team-card-active .glow-ring { opacity: 1; transform: rotate(180deg); }
                .team-card-active img         { filter: grayscale(0); transform: scale(1.05); }

                /* ── Modal overlay ── */
                .team-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: rgba(0,0,0,0.55);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: modalFadeIn 0.25s ease;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Modal card ── */
                .team-modal-card {
                    position: relative;
                    background: #fff;
                    border-radius: 2rem;
                    max-width: 480px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 32px 80px rgba(70,23,17,0.22);
                    animation: modalSlideUp 0.3s cubic-bezier(.22,.68,0,1.3);
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }

                /* ── Decorative header band ── */
                .team-modal-header-bg {
                    height: 110px;
                    background: linear-gradient(135deg, #ff7612 0%, #ffdb5b 100%);
                    border-radius: 2rem 2rem 0 0;
                }

                /* ── Close button ── */
                .team-modal-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    z-index: 10;
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255,255,255,0.85);
                    backdrop-filter: blur(4px);
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: #461711;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                /* ── Modal body ── */
                .team-modal-body {
                    padding: 0 2rem 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                /* ── Modal photo ── */
                .team-modal-photo-wrap {
                    position: relative;
                    width: 120px; height: 120px;
                    margin-top: -60px;
                    margin-bottom: 1.25rem;
                    flex-shrink: 0;
                }
                .team-modal-glow-ring {
                    position: absolute;
                    inset: -6px;
                    background: linear-gradient(135deg, #ff7612, #ffdb5b);
                    border-radius: 50%;
                    opacity: 0.9;
                    animation: spinSlow 8s linear infinite;
                }
                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                .team-modal-photo-inner {
                    position: absolute;
                    inset: 4px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 4px 20px rgba(70,23,17,0.15);
                }
                .team-modal-photo {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }

                /* ── Modal text ── */
                .team-modal-name {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #461711;
                    margin: 0 0 0.4rem;
                    letter-spacing: -0.02em;
                }
                .team-modal-role {
                    display: inline-block;
                    padding: 0.25rem 1rem;
                    border-radius: 999px;
                    background: #fff3e8;
                    border: 1px solid #ffdcc0;
                    color: #ff7612;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 1.4rem;
                    letter-spacing: 0.01em;
                }
                .team-modal-bio {
                    color: #555;
                    line-height: 1.75;
                    font-size: 0.97rem;
                    margin: 0 0 1.25rem;
                }
                .team-modal-dots {
                    display: flex; gap: 8px; justify-content: center;
                }
                .team-modal-dots span {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff7612, #ffdb5b);
                    opacity: 0.7;
                }
                .team-modal-dots span:nth-child(2) { opacity: 0.5; }
                .team-modal-dots span:nth-child(3) { opacity: 0.3; }

                /* ── Compact card styles ── */
                .team-member-card {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 1.5rem 1.25rem;
                    background: #fff;
                    border-radius: 1.5rem;
                    box-shadow: 0 4px 20px rgba(70,23,17,0.06);
                    border: 1px solid #f5f0ee;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .team-member-card:hover {
                    box-shadow: 0 10px 30px rgba(70,23,17,0.12);
                    transform: translateY(-4px);
                    border-color: #ff7612/20;
                }
                .team-member-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #ff7612, #ffdb5b);
                    border-radius: 1.5rem 1.5rem 0 0;
                }

                .team-card-photo-wrap {
                    position: relative;
                    width: 100px; height: 100px;
                    margin-bottom: 1rem;
                }
                .team-card-glow {
                    position: absolute;
                    inset: -4px;
                    background: linear-gradient(135deg, #ff7612, #ffdb5b);
                    border-radius: 50%;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .team-member-card:hover .team-card-glow {
                    opacity: 0.15;
                }
                .team-card-photo-inner {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 2px 10px rgba(70,23,17,0.1);
                }
                .team-card-photo-inner img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                    transition: transform 0.5s ease;
                }
                .team-member-card:hover .team-card-photo-inner img {
                    transform: scale(1.1);
                }
                .team-card-name {
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: #461711;
                    margin: 0 0 0.25rem;
                    letter-spacing: -0.01em;
                }
                .team-card-role {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #ff7612;
                    background: #fff3e8;
                    border: 1px solid #ffdcc0;
                    padding: 0.15rem 0.6rem;
                    border-radius: 999px;
                    margin-bottom: 0.75rem;
                    max-width: 90%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .team-card-cta {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #461711;
                    opacity: 0.6;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transition: all 0.3s ease;
                }
                .team-member-card:hover .team-card-cta {
                    opacity: 1;
                    color: #ff7612;
                    gap: 6px;
                }
            `}</style>

            {/* ── Background Decoration ── */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl animate-pulse" />

            {/* ── Section Header ── */}
            <div className="text-center mb-16 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 text-[#ff7612] text-xs font-bold tracking-widest uppercase mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7612]" />
                    Our Leadership
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-[#461711] mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7612] to-[#ffdb5b]">
                        {translations.team.title[language]}
                    </span>
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mb-6 rounded-full" />
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                    {translations.team.subtitle[language]}
                </p>
            </div>

            {/* ── Team Cards Grid ── */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar"
                >
                    {translations.teamMembers.map((member) => (
                        <div
                            key={member.key}
                            data-key={member.key}
                            className={`team-card flex-shrink-0 w-[85vw] sm:w-[45vw] md:w-full snap-center md:snap-align-none ${activeMember === member.key ? 'team-card-active' : ''}`}
                        >
                            <button
                                className="team-member-card w-full"
                                onClick={() => setSelectedMember(member)}
                                aria-label={`View ${member.name[language]}'s profile`}
                            >
                                {/* Photo */}
                                <div className="team-card-photo-wrap">
                                    <div className="team-card-glow" />
                                    <div className="team-card-photo-inner">
                                        <img src={member.image} alt={member.name[language]} />
                                    </div>
                                </div>

                                {/* Name */}
                                <p className="team-card-name">{member.name[language]}</p>

                                {/* Role / Status */}
                                <span className="team-card-role">{member.role[language]}</span>

                                {/* "View profile" hint */}
                                <span className="team-card-cta">
                                    View profile
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Progress */}
                <div className="md:hidden mt-4 px-12">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#ffdb5b] to-[#ff7612] transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(255,118,18,0.3)]"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── ME Empowerment Coaches Section ── */}
            <div className="mt-24 lg:mt-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 w-64 h-64 bg-yellow-50/50 rounded-full blur-3xl" />

                <div className="text-center mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#461711]/5 text-[#461711] text-xs font-bold tracking-widest uppercase mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#461711]" />
                        Expert Mentorship
                    </div>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-[#461711] mb-6">
                        {translations.team.coachesTitle[language]}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {translations.team.coachesSubtitle[language]}
                    </p>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] mx-auto mt-6 rounded-full" />
                </div>

                <div className="relative group/marquee bg-white py-12 border-y border-gray-50">
                    <div className="animate-marquee-infinite">
                        {coachesExtended.map((filename, index) => {
                            const trainerName = filename.substring(0, filename.lastIndexOf('.')).trim();
                            return (
                                <div
                                    key={`${trainerName}-${index}`}
                                    className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[15vw] mx-4 bg-white rounded-3xl p-6 shadow-md border border-gray-100 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffdb5b] to-[#ff7612] origin-left" />
                                    <div className="text-center">
                                        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gray-50 aspect-square flex items-center justify-center p-4">
                                            <img
                                                src={`${s3BucketURL}${filename}`}
                                                alt={trainerName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="text-xs md:text-sm font-black text-[#ff7612] px-2 uppercase tracking-wide">
                                            {trainerName}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                </div>
            </div>

            {/* ── Member Detail Modal ── */}
            {selectedMember && (
                <MemberModal
                    member={selectedMember}
                    language={language}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </div>
    );
};

export default Team;
