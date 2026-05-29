import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaUser, FaSeedling, FaInstagram, FaGithub, FaLinkedin, FaTimes } from "react-icons/fa";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const ProfileCard = ({ user, onUserUpdate, onViewMore, onEditClick }) => {
    const { language } = useLanguage();

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white rounded-3xl p-6 flex flex-col shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                {/* Left: Avatar + Info */}
                <div className="flex gap-4 md:gap-6 items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white flex-shrink-0 bg-white/20 flex items-center justify-center overflow-hidden shadow-sm">
                        {user.photo ? (
                            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FaUser className="text-3xl md:text-5xl" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold truncate leading-tight">{user.firstName} {user.lastName}</h2>
                        <p className="text-white/80 text-sm mt-1 truncate">{user.emailID}</p>
                        <div className="mt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#7A3A00] rounded-full text-xs font-semibold shadow-sm">
                                <FaSeedling className="text-green-500" /> {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto mt-4 sm:mt-0 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
                    {/* View More Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-5 py-2 border border-white rounded-full text-xs sm:text-sm font-semibold hover:bg-white/20 active:bg-white/30 transition shrink-0 shadow-sm"
                    >
                        {isExpanded ? (translations.profile.viewLess?.[language] || "View Less") : translations.profile.viewMore[language]}
                    </button>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-end items-center shrink-0">
                        {user.socials?.instagram && (
                            <a
                                href={user.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
                            >
                                <FaInstagram className="text-lg cursor-pointer" />
                            </a>
                        )}
                        {user.socials?.github && (
                            <a
                                href={user.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
                            >
                                <FaGithub className="text-lg cursor-pointer" />
                            </a>
                        )}
                        {user.socials?.linkedin && (
                            <a
                                href={user.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
                            >
                                <FaLinkedin className="text-lg cursor-pointer" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* About / Bio Section (Always visible) */}
            <div className="mt-6 border-t border-white/20 pt-6 text-white/90">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-white/70">
                    {translations.profile.about?.[language] || "About"}
                </h3>
                <p className="text-sm leading-relaxed max-w-3xl">
                    {user?.bio || translations.profile.bioPlaceholder?.[language] || "Tell us about yourself..."}
                </p>
            </div>

            {/* Expandable Section */}
            {isExpanded && (
                <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in">
                    {/* Work / Education */}
                    <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                        <h3 className="text-lg font-bold mb-3 text-white">
                            {translations.profile.workEducation?.[language] || "Work / Education"}
                        </h3>
                        {user.workspace_name ? (
                            <>
                                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                                    {user.is_working ? translations.profile.companyName[language] : translations.profile.collegeName[language]}
                                </p>
                                <p className="text-xl font-bold text-white">{user.workspace_name}</p>
                            </>
                        ) : (
                            <p className="text-white/50 italic text-sm">Not provided</p>
                        )}
                    </div>

                    {/* Addresses */}
                    <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                        <h3 className="text-lg font-bold mb-3 text-white">Addresses</h3>
                        {(user.address?.permanentAddress?.building || user.address?.presentAddress?.building) ? (
                            <div className="space-y-4">
                                {user.address?.permanentAddress?.building && (
                                    <div>
                                        <p className="font-semibold text-white text-sm mb-1">{translations.profile.permanentAddress[language]}</p>
                                        <p className="text-white/80 text-sm leading-relaxed">
                                            {user.address.permanentAddress.building}, {user.address.permanentAddress.street}, {user.address.permanentAddress.area}<br/>
                                            {user.address.permanentAddress.city}, {user.address.permanentAddress.state} - {user.address.permanentAddress.pincode}<br/>
                                            {user.address.permanentAddress.country}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-white/50 italic text-sm">Not provided</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;
