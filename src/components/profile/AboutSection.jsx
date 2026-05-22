import { supabase } from "../../services/supabase-client";
import { useState, useEffect } from "react";

const AboutSection = ({ user }) => {
    return (
        <div className="bg-white text-[#8A7060] rounded-2xl p-6 ">
            <h2 className="text-2xl font-bold mb-4">ABOUT</h2>
            <p className="text-gray-600">
                {user?.about || "This is the about section for the volunteer profile."}
            </p>
            <button className="mt-4 px-4 py-2 bg-[#F0B04C] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400">
                edit
            </button>
        </div>
    );
};

export default AboutSection;
