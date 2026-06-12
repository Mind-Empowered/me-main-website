import { useState } from "react";
import { FaThLarge, FaImages, FaCalendarAlt, FaCalendarDay, FaTasks, FaEnvelope, FaUsers, FaSignOutAlt, FaBars, FaTimes, FaHome, FaCog, FaLanguage, FaMusic, FaHistory, FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import { useLanguage } from "../../contexts/LanguageContext";

const Sidebar = ({ onCloseMobile }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (onCloseMobile) onCloseMobile();
        await supabase.auth.signOut();
        navigate("/");
    };

    const handleBackToHome = () => {
        if (onCloseMobile) onCloseMobile();
        navigate("/");
    };


    const menu = [
        {
            title: "Overview",
            items: [
                {
                    label: "Dashboard",
                    icon: <FaThLarge />,
                    path: "/admin/dashboard",
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    label: "Photo Gallery",
                    icon: <FaImages />,
                    path: "/admin/photogallery",
                },
                {
                    label: "Events",
                    icon: <FaCalendarDay />,
                    path: "/admin/events",
                },
                {
                    label: "Projects",
                    icon: <FaTasks />,
                    path: "/admin/projects",
                },
                {
                    label: "News Letter",
                    icon: <FaEnvelope />,
                    path: "/admin/newsletter",
                },
                {
                    label: "Calendar",
                    icon: <FaCalendarAlt />,
                    path: "/admin/calendar",
                },
            ],
        },
        {
            title: "Community",
            items: [
                {
                    label: "Volunteers",
                    icon: <FaUsers />,
                    path: "/admin/volunteers",
                },
                {
                    label: "Activity Log",
                    icon: <FaHistory />,
                    path: "/admin/activity",
                },
                {
                    label: "Notifications",
                    icon: <FaBell />,
                    path: "/admin/notifications",
                },
            ],
        },
    ];

    return (
        <aside className={`${isExpanded ? "w-64" : "w-[80px]"} h-screen bg-[#2C1A0E] py-4 px-3 flex flex-col gap-4 text-white transition-all duration-300 relative shrink-0`}>
            {/* Header / Logo */}
            <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} px-2`}>
                {isExpanded && (
                    <NavLink 
                        to="/admin/dashboard" 
                        onClick={() => { if (onCloseMobile) onCloseMobile(); }}
                        className="flex items-center gap-2.5 overflow-hidden shrink-0"
                    >
                        <img src="/brand/logo.jpeg" alt="logo" className="w-8 h-8 rounded-full shrink-0" />
                        <div className="whitespace-nowrap">
                            <p className="text-[#E8954A] font-bold text-xs">Admin Panel</p>
                        </div>
                    </NavLink>
                )}
                <button 
                    onClick={() => {
                        if (window.innerWidth < 768) {
                            if (onCloseMobile) onCloseMobile();
                        } else {
                            setIsExpanded(!isExpanded);
                        }
                    }}
                    className="text-gray-400 hover:text-white shrink-0 p-1 rounded transition-colors"
                >
                    {isExpanded ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>
            
            <hr className="border-[#462a17]"></hr>
            
            {/* menu items */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 scrollbar-hide">
                {menu.map((section, index) => (
                    <div key={index} className="flex flex-col gap-1.5">
                        {isExpanded && <h3 className="text-[10px] uppercase text-gray-500 font-semibold px-2 tracking-wider">{section.title}</h3>}
                        <ul className="flex flex-col gap-0.5">
                            {section.items.map((item, itemIndex) => (
                                <NavLink 
                                    key={itemIndex} 
                                    to={item.path} 
                                    onClick={() => { if (onCloseMobile) onCloseMobile(); }}
                                    title={!isExpanded ? item.label : ""} 
                                    className={({ isActive }) =>
                                        `flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center'} gap-3 py-2 rounded-lg transition shrink-0 ${isActive
                                            ? "bg-[#C1622A] text-white"
                                            : "hover:bg-[#C1622A]/20 text-gray-400 hover:text-white"
                                        }`
                                    }
                                >
                                    <span className="text-base shrink-0">{item.icon}</span>
                                    {isExpanded && <span className="whitespace-nowrap text-[13px] font-semibold">{item.label}</span>}
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* bottom actions */}
            <div className="mt-auto flex flex-col gap-1 border-t border-[#462a17] pt-3">
                <NavLink 
                    to="/admin/settings"
                    onClick={() => { if (onCloseMobile) onCloseMobile(); }}
                    title={!isExpanded ? "Settings" : ""}
                    className={({ isActive }) => 
                        `flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center'} gap-3 py-2 rounded-lg w-full transition shrink-0 ${isActive ? "bg-[#C1622A] text-white" : "text-gray-300 hover:bg-[#C1622A]/20 hover:text-white"}`
                    }
                >
                    <FaCog className="text-base shrink-0" />
                    {isExpanded && <span className="whitespace-nowrap font-semibold text-[13px]">Settings</span>}
                </NavLink>

                <button 
                    onClick={handleBackToHome}
                    title={!isExpanded ? "Back to Home" : ""}
                    className={`flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center'} gap-3 py-2 rounded-lg w-full text-gray-300 hover:bg-[#C1622A]/20 hover:text-white transition shrink-0`}
                >
                    <FaHome className="text-base shrink-0" />
                    {isExpanded && <span className="whitespace-nowrap font-semibold text-[13px]">Back to Home</span>}
                </button>

                <button 
                    onClick={handleLogout}
                    title={!isExpanded ? "Logout" : ""}
                    className={`flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center'} gap-3 py-2 rounded-lg w-full bg-[#C1622A] text-white hover:bg-[#a8521f] transition shrink-0`}
                >
                    <FaSignOutAlt className="text-base shrink-0" />
                    {isExpanded && <span className="whitespace-nowrap font-semibold text-[13px]">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;