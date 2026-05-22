import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";

const SkillsSection = ({ user }) => {
    const [skills, setSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (user?.skills) {
            setSkills(user.skills);
        }
    }, [user]);

    // Add skill to state
    const addSkill = () => {
        if (inputValue.trim()) {
            setSkills([...skills, inputValue]);
            setInputValue('');
        }
    };

    // Remove skill from state
    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    // Save to database
    const saveSkills = async () => {
        const { error } = await supabase
            .schema('me_dataspace')
            .from('users')
            .update({ skills })
            .eq('emailID', user.emailID);
        
        if (error) {
            console.log('Error saving skills:', error);
        } else {
            console.log('Skills saved!');
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            
            {/* Display skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                    <span key={index} className="bg-[#F5EDE0] text-[#8A7060] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill} 
                        <button onClick={() => removeSkill(index)}>×</button>
                    </span>
                ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border rounded"
                />
                <button onClick={addSkill} className="px-4 py-2 bg-[#A64200] text-white rounded">
                    Add
                </button>
            </div>

            {/* Save button */}
            <button 
                onClick={saveSkills}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Save Skills
            </button>
        </div>
    );
};

export default SkillsSection;