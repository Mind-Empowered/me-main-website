import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaLock, FaGlobe, FaSave, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaCog, FaSlidersH, FaMusic, FaLanguage, FaEye, FaEyeSlash, FaCheck, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import { AdminListSkeleton, SkeletonBlock } from "../../components/adminDashboard/AdminSkeletons";

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("site");
    const { language, setLanguage } = useLanguage();

    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('bgMusicEnabled');
        return saved === null ? true : saved === 'true';
    });

    useEffect(() => {
        const handleCustomChange = (e) => setSoundEnabled(e.detail);
        window.addEventListener('bgMusicChanged', handleCustomChange);
        return () => window.removeEventListener('bgMusicChanged', handleCustomChange);
    }, []);

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        localStorage.setItem('bgMusicEnabled', newValue);
        window.dispatchEvent(new CustomEvent('bgMusicChanged', { detail: newValue }));
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ml' : 'en');
    };

    // Site Configuration State
    const [siteSettings, setSiteSettings] = useState({
        email: "",
        phone: "",
        address: "",
        instagram_url: "",
        linkedin_url: ""
    });
    const [isSavingSite, setIsSavingSite] = useState(false);
    const [siteMessage, setSiteMessage] = useState({ type: "", text: "" });

    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    // Password State
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch Site Settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoadingSettings(true);
            try {
                const { data, error } = await supabase
                    .schema("me_dataspace")
                    .from("site_settings")
                    .select("*")
                    .eq("id", 1)
                    .single();

                if (data && !error) {
                    setSiteSettings(data);
                }
            } catch (err) {
                // keep existing behavior; show message in UI if needed
            } finally {
                setIsLoadingSettings(false);
            }
        };
        fetchSettings();
    }, []);

    // Handle Site Configuration Update
    const handleSiteUpdate = async (e) => {
        e.preventDefault();
        setIsSavingSite(true);
        setSiteMessage({ type: "", text: "" });

        try {
            const { error } = await supabase
                .schema("me_dataspace")
                .from("site_settings")
                .update({
                    email: siteSettings.email,
                    phone: siteSettings.phone,
                    address: siteSettings.address,
                    instagram_url: siteSettings.instagram_url,
                    linkedin_url: siteSettings.linkedin_url,
                    map_url: siteSettings.map_url,
                    map: siteSettings.map,
                    updated_at: new Date().toISOString()
                })
                .eq("id", 1);

            if (error) throw error;
            setSiteMessage({ type: "success", text: "Site configuration updated successfully!" });
        } catch (error) {
            setSiteMessage({ type: "error", text: "Failed to update settings. " + error.message });
        } finally {
            setIsSavingSite(false);
        }
    };

    // Handle Password Update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSiteMessage({ type: "", text: "" });
        setPasswordMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }

        setIsSavingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            setPasswordMessage({ type: "success", text: "Password updated successfully!" });
            setPasswordData({ newPassword: "", confirmPassword: "" });
        } catch (error) {
            setPasswordMessage({ type: "error", text: "Failed to update password. " + error.message });
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-[#F7F2EC] min-h-screen">
            {/* Header section (aligned with standard Admin page layouts) */}
            <div className="flex items-center gap-3 mb-6">
                <FaCog className="text-[#C1622A] text-xl" />
                <div>
                    <h1 className="text-xl font-bold text-[#461711] flex items-center gap-2">
                        Admin Settings
                    </h1>
                </div>
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full shadow-sm">System & Security</span>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-2">

                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col gap-1.5">
                        <button
                            onClick={() => setActiveTab("site")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "site" ? "bg-[#C1622A] text-white shadow-sm" : "text-gray-600 hover:bg-[#FAF7F2] hover:text-[#C1622A]"}`}
                        >
                            <FaGlobe /> Site Configuration
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "security" ? "bg-[#C1622A] text-white shadow-sm" : "text-gray-600 hover:bg-[#FAF7F2] hover:text-[#C1622A]"}`}
                        >
                            <FaLock /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "preferences" ? "bg-[#C1622A] text-white shadow-sm" : "text-gray-600 hover:bg-[#FAF7F2] hover:text-[#C1622A]"}`}
                        >
                            <FaSlidersH /> Preferences
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {isLoadingSettings ? (
                        <div className="animate-fade-in-fast space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                                <SkeletonBlock className="h-6 w-48 mb-6 rounded-lg" />
                                <div className="space-y-4">
                                    <SkeletonBlock className="h-12 w-full rounded-xl" />
                                    <SkeletonBlock className="h-12 w-full rounded-xl" />
                                    <SkeletonBlock className="h-24 w-full rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* --- Site Configuration Tab --- */}
                            {activeTab === "site" && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 animate-fade-in-fast">
                                    <div className="border-b border-gray-100 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-[#461711]">Contact & Social Links</h2>
                                        <p className="text-xs text-gray-500 mt-1">Manage public contact details and social media profile URLs.</p>
                                    </div>

                                    {siteMessage.text && (
                                        <div className={`p-4 rounded-xl mb-6 text-sm font-medium border flex items-center gap-2.5 ${
                                            siteMessage.type === "success" 
                                                ? "bg-green-50/50 border-green-200 text-green-700" 
                                                : "bg-red-50/50 border-red-200 text-red-700"
                                        }`}>
                                            {siteMessage.type === "success" ? <FaCheck className="flex-shrink-0" /> : <FaExclamationTriangle className="flex-shrink-0" />}
                                            <span>{siteMessage.text}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSiteUpdate} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400 text-xs" /> Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={siteSettings.email}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                    <FaPhone className="text-gray-400 text-xs" /> Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={siteSettings.phone}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400 text-xs" /> Physical Address
                                            </label>
                                            <textarea
                                                required
                                                rows="2"
                                                value={siteSettings.address}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm resize-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400 text-xs" /> Google Maps Embed URL
                                            </label>
                                            <input
                                                type="url"
                                                value={siteSettings.map_url || ""}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, map_url: e.target.value })}
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400 text-xs" /> Google Maps URL
                                            </label>
                                            <input
                                                type="url"
                                                value={siteSettings.map || ""}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, map: e.target.value })}
                                                placeholder="https://www.google.com/maps/.."
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                            />
                                        </div>

                                        <hr className="border-gray-100 my-6" />

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Social Media Links</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                        <FaInstagram className="text-pink-600 text-xs" /> Instagram URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={siteSettings.instagram_url}
                                                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                        <FaLinkedin className="text-blue-600 text-xs" /> LinkedIn URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={siteSettings.linkedin_url}
                                                        onChange={(e) => setSiteSettings({ ...siteSettings, linkedin_url: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSavingSite}
                                                className="bg-[#C1622A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#a8521f] transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                            >
                                                {isSavingSite ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                                {isSavingSite ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* --- Security Tab --- */}
                            {activeTab === "security" && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 animate-fade-in-fast">
                                    <div className="border-b border-gray-100 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-[#461711]">Change Password</h2>
                                        <p className="text-xs text-gray-500 mt-1">Update your admin account security password.</p>
                                    </div>

                                    {passwordMessage.text && (
                                        <div className={`p-4 rounded-xl mb-6 text-sm font-semibold border flex items-center gap-2.5 ${
                                            passwordMessage.type === "success" 
                                                ? "bg-green-50/50 border-green-200 text-green-700" 
                                                : "bg-red-50/50 border-red-200 text-red-700"
                                        }`}>
                                            {passwordMessage.type === "success" ? <FaCheck className="flex-shrink-0" /> : <FaExclamationTriangle className="flex-shrink-0" />}
                                            <span>{passwordMessage.text}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    required
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(prev => !prev)}
                                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C1622A] transition-colors"
                                                >
                                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/30 focus:border-[#C1622A] transition-all duration-200 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C1622A] transition-colors"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSavingPassword}
                                                className="w-full bg-[#C1622A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#a8521f] transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                {isSavingPassword ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                                {isSavingPassword ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* --- Preferences Tab --- */}
                            {activeTab === "preferences" && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 animate-fade-in-fast">
                                    <div className="border-b border-gray-100 pb-4 mb-6">
                                        <h2 className="text-lg font-bold text-[#461711]">Dashboard Preferences</h2>
                                        <p className="text-xs text-gray-500 mt-1">Customize your local admin dashboard experience.</p>
                                    </div>

                                    <div className="space-y-4 max-w-md">
                                        <button
                                            onClick={toggleLanguage}
                                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 bg-white hover:bg-[#FAF7F2] border border-gray-200 rounded-xl transition-all duration-200 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <FaLanguage className="text-[#C1622A] text-xl" />
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">Dashboard Language</p>
                                                    <p className="text-xs text-gray-400 font-normal">Change language for translation content</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-3 py-1 bg-orange-50 border border-orange-100 rounded-lg text-[#C1622A]">
                                                {language === 'en' ? 'English' : 'മലയാളം'}
                                            </span>
                                        </button>

                                        <button
                                            onClick={toggleSound}
                                            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-700 bg-white hover:bg-[#FAF7F2] border border-gray-200 rounded-xl transition-all duration-200 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <FaMusic className="text-[#C1622A] text-lg" />
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">Background Music</p>
                                                    <p className="text-xs text-gray-400 font-normal">Toggle background audio for dashboard</p>
                                                </div>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${soundEnabled ? 'bg-[#C1622A]' : 'bg-gray-300'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
