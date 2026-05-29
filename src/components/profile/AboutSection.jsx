import { supabase } from "../../services/supabase-client";
import { useState } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const AboutSection = ({ user}) => {
    const { language } = useLanguage();
    
    return (
        <>
            <div className="bg-white text-[#8A7060] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{translations.profile.about[language]}</h2>
                </div>
                <p className="text-gray-600">
                    {user?.bio || translations.profile.bioPlaceholder[language]}
                </p>
            </div>

        </>
    );
};

export default AboutSection;