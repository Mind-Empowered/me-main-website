import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import { useEffect, useState } from "react";
import { FaUser, FaSeedling, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

const ProfileCard = ({ user }) => {
    
    return (
        <div className="bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white rounded-3xl p-12 flex items-start justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white flex-shrink-0 bg-white/20 flex items-center justify-center">
                    {user.photo ? (
                        <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <FaUser className="text-2xl" />
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <p className="text-white/80">{user.emailID}</p>
                    <div>
                        <span className="inline-block mt-2 px-3 py-1 bg-white text-[#7A3A00] rounded-full text-sm">
                        <FaSeedling className="inline text-green-500" />  {user.role}
                    </span>
                    </div>
                </div>
            </div>
            {/* Right: Edit Profile Button */}
            <div className="flex flex-col  gap-12">
                <button className="px-4 py-2 border border-white rounded-full text-sm font-semibold hover:bg-white/10">
                ✏️ Edit profile
            </button>
            <div className="flex gap-4 mt-4 justify-between"> 
                <FaInstagram className="text-2xl" />
                <FaGithub className="text-2xl" />
                <FaLinkedin className="text-2xl" /> 
            </div>
            </div>
        </div>
    );
};

export default ProfileCard;