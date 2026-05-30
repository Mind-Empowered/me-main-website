import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaPlus } from "react-icons/fa";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const SkillsSection = ({ user }) => {
    const { language } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.skills) {
            setSkills(user.skills);
        }
    }, [user]);

    const saveSkillsToDB = async (updatedSkills) => {
        setSaving(true);
        const { error } = await supabase
            .schema('me_dataspace')
            .from('users')
            .update({ skills: updatedSkills })
            .eq('emailID', user.emailID)
            .select();

        if (error) console.error('Error saving skills:', error);
        setSaving(false);
    };

    const addSkill = () => {
        if (inputValue.trim()) {
            const updated = [...skills, inputValue.trim()];
            setSkills(updated);
            setInputValue('');
            saveSkillsToDB(updated);
        }
    };

    const removeSkill = (index) => {
        const updated = skills.filter((_, i) => i !== index);
        setSkills(updated);
        saveSkillsToDB(updated);
    };

    return (
        <div className="bg-white rounded-2xl p-5 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-3 text-[#8A7060]">
                {translations.profile.skills[language]}
            </h2>

            <div className="flex flex-wrap gap-2 mb-4 overflow-y-auto flex-1 content-start">
                {skills.map((skill, index) => (
                    <span key={index} className="bg-[#F5EDE0] text-[#8A7060] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button onClick={() => removeSkill(index)}>×</button>
                    </span>
                ))}
            </div>

            <div className="flex items-center gap-2 w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 min-w-0 h-12 px-4 border rounded-lg"
                />

                <button
                    onClick={addSkill}
                    className="shrink-0 flex items-center justify-center gap-1 h-12 px-4 border border-[#A64200] text-[#A64200] rounded-xl"
                >
                    <FaPlus />
                    <span>Add</span>
                </button>
            </div>
        </div>
    );
};

export default SkillsSection;