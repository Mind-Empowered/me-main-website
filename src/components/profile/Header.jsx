import { FaSignOutAlt, FaCog, FaEdit, FaMusic, FaLanguage, FaKey } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import { useState, useEffect, useRef } from "react";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";
import ChangePasswordModal from "./ChangePasswordModal";

const Header = ({ bgcolour, tcolour, logout, logo: logoProp, onEditClick }) => {
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const settingsRef = useRef(null);
    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('bgMusicEnabled');
        return saved === null ? true : saved === 'true';
    });

    useEffect(() => {
        const handleCustomChange = (e) => setSoundEnabled(e.detail);
        window.addEventListener('bgMusicChanged', handleCustomChange);
        return () => window.removeEventListener('bgMusicChanged', handleCustomChange);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        navigate("/");
    };

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        localStorage.setItem('bgMusicEnabled', newValue);
        window.dispatchEvent(new CustomEvent('bgMusicChanged', { detail: newValue }));
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ml' : 'en');
    };

    return (
        <>
            <header className={`flex items-center justify-between p-4 ${bgcolour}`}>
                <Link to="/" className="flex justify-center items-center gap-3 cursor-pointer group">
                    {/* logo */}
                    <div className={`flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full p-0.5 shadow-md overflow-hidden ring-2 ring-[#ff7612]/20 transition-transform duration-300 group-hover:scale-105 ${logoProp}`}>
                        <img src="/brand/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="block transition-transform duration-300 group-hover:translate-x-1">
                        <h1 className={`text-xl sm:text-2xl md:text-3xl font-black leading-none tracking-tight ${tcolour}`}>
                            Mind Empowered
                        </h1>
                        <p className={`font-bold tracking-[0.2em] mt-1 uppercase text-[#ff7612] text-[9px] sm:text-[10px]`} style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                            #MEFORYOUTH
                        </p>
                    </div>
                </Link>
                <div className="flex items-center gap-3 relative" ref={settingsRef}>
                    <button
                        onClick={() => navigate('/')}
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-[#7A3A00] border border-[#7A3A00]/20 rounded-xl hover:bg-[#FAF7F2] transition font-semibold shadow-sm text-sm"
                    >
                        {language === 'ml' ? 'ഹോമിലേക്ക് മടങ്ങുക' : 'Back to Home'}
                    </button>
                    
                    {/* Settings Dropdown Button */}
                    <button
                        className="bg-white text-[#A64200] p-3 rounded-xl border border-[#A64200]/20 hover:bg-[#FAF7F2] transition focus:outline-none focus:ring-2 focus:ring-[#A64200] flex items-center justify-center shadow-sm"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        title="Settings"
                    >
                        <FaCog className="text-xl" />
                    </button>

                    {/* Settings Menu */}
                    {isSettingsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                            <div className="p-2 space-y-1">
                                {onEditClick && (
                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(false);
                                            onEditClick();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#A64200] rounded-xl transition"
                                    >
                                        <FaEdit className="text-[#A64200]" />
                                        {language === 'ml' ? 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക' : 'Edit Profile'}
                                    </button>
                                )}
                                
                                <button
                                    onClick={toggleLanguage}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#A64200] rounded-xl transition"
                                >
                                    <FaLanguage className="text-[#A64200] text-lg" />
                                    {language === 'en' ? 'മലയാളം' : 'English'}
                                </button>
                                
                                <button
                                    onClick={toggleSound}
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#A64200] rounded-xl transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaMusic className="text-[#A64200]" />
                                        {language === 'ml' ? 'പശ്ചാത്തല സംഗീതം' : 'Music'}
                                    </div>
                                    <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${soundEnabled ? 'bg-[#A64200]' : 'bg-gray-300'}`}>
                                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </button>

                                <div className="h-px bg-gray-100 my-1" />

                                <button
                                    onClick={() => {
                                        setIsSettingsOpen(false);
                                        setIsPasswordModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#FAF7F2] hover:text-[#A64200] rounded-xl transition"
                                >
                                    <FaKey className="text-[#A64200]" />
                                    {language === 'ml' ? 'പാസ്‌വേഡ് മാറ്റുക' : 'Change Password'}
                                </button>
                                
                                <button
                                    onClick={handleLogout}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition ${logout}`}
                                >
                                    <FaSignOutAlt className="text-red-500" />
                                    {language === 'ml' ? 'ലോഗ്ഔട്ട്' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />
        </>
    );
};

export default Header;