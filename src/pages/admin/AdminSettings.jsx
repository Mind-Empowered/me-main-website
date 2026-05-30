import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaLock, FaGlobe, FaSave, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaLinkedin, FaCog, FaSlidersH, FaMusic, FaLanguage, FaEye, FaEyeSlash } from "react-icons/fa";
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
        <div className="h-screen bg-[#F5F0E8] overflow-auto">
            {/* Topbar */}
            <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#461711] flex items-center gap-2">
                        <FaCog className="text-[#C1622A]" /> Admin Settings
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage site configuration and security</p>
                </div>
            </div>

            <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab("site")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "site" ? "bg-[#C1622A] text-white" : "text-gray-600 hover:bg-orange-50 hover:text-[#C1622A]"}`}
                        >
                            <FaGlobe /> Site Configuration
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "security" ? "bg-[#C1622A] text-white" : "text-gray-600 hover:bg-orange-50 hover:text-[#C1622A]"}`}
                        >
                            <FaLock /> Security
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${activeTab === "preferences" ? "bg-[#C1622A] text-white" : "text-gray-600 hover:bg-orange-50 hover:text-[#C1622A]"}`}
                        >
                            <FaSlidersH /> Preferences
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {isLoadingSettings ? (
                        <div className="animate-fade-in-fast">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-64 shrink-0">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                        <SkeletonBlock className="h-4 w-32 mb-4" />
                                        <div className="space-y-2">
                                            <SkeletonBlock className="h-12 w-full rounded-lg" />
                                            <SkeletonBlock className="h-12 w-full rounded-lg" />
                                            <SkeletonBlock className="h-12 w-full rounded-lg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                        <SkeletonBlock className="h-6 w-48 mb-4" />
                                        <SkeletonBlock className="h-10 w-full mb-4 rounded-xl" />
                                        <SkeletonBlock className="h-40 w-full rounded-2xl" />
                                    </div>

                                    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                        <SkeletonBlock className="h-5 w-40 mb-3" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <SkeletonBlock className="h-12 w-full rounded-lg" />
                                            <SkeletonBlock className="h-12 w-full rounded-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* --- Site Configuration Tab --- */}
                            {activeTab === "site" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in-fast">
                                    <h2 className="text-xl font-bold text-[#461711] mb-6">Contact & Social Links</h2>

                                    {siteMessage.text && (
                                        <div className={`p-4 rounded-lg mb-6 text-sm font-semibold ${siteMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                            {siteMessage.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleSiteUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400" /> Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={siteSettings.email}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <FaPhone className="text-gray-400" /> Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={siteSettings.phone}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" /> Physical Address
                                            </label>
                                            <textarea
                                                required
                                                rows="2"
                                                value={siteSettings.address}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50 resize-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" /> Google Maps Embed URL
                                            </label>
                                            <input
                                                type="url"
                                                value={siteSettings.map_url || ""}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, map_url: e.target.value })}
                                                placeholder="https://www.google.com/maps/embed?pb=..."
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" /> Google Maps URL
                                            </label>
                                            <input
                                                type="url"
                                                value={siteSettings.map|| ""}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, map: e.target.value })}
                                                placeholder="https://www.google.com/maps/.."
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                            />
                                        </div>

                                        <hr className="border-gray-100" />

                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-700">Social Media URLs</h3>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                                    <FaInstagram className="text-pink-600" /> Instagram URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={siteSettings.instagram_url}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                                    <FaLinkedin className="text-blue-600" /> LinkedIn URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={siteSettings.linkedin_url}
                                                    onChange={(e) => setSiteSettings({ ...siteSettings, linkedin_url: e.target.value })}
                                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSavingSite}
                                                className="bg-[#C1622A] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a8521f] transition disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <FaSave /> {isSavingSite ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* --- Security Tab --- */}
                            {activeTab === "security" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in-fast">
                                    <h2 className="text-xl font-bold text-[#461711] mb-2">Change Password</h2>
                                    <p className="text-gray-500 text-sm mb-6">Update your admin account password.</p>

                                    {passwordMessage.text && (
                                        <div className={`p-4 rounded-lg mb-6 text-sm font-semibold ${passwordMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    required
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(prev => !prev)}
                                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C1622A] hover:text-[#a8521f] transition"
                                                >
                                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C1622A]/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C1622A] hover:text-[#a8521f] transition"
                                                >
                                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSavingPassword}
                                                className="w-full bg-[#461711] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#ff7612] transition disabled:opacity-50"
                                            >
                                                {isSavingPassword ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* --- Preferences Tab --- */}
                            {activeTab === "preferences" && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in-fast">
                                    <h2 className="text-xl font-bold text-[#461711] mb-2">Dashboard Preferences</h2>
                                    <p className="text-gray-500 text-sm mb-6">Manage your local admin dashboard settings.</p>

                                    <div className="space-y-4 max-w-md">
                                        <button
                                            onClick={toggleLanguage}
                                            className="w-full flex items-center justify-between px-4 py-4 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-[#FAF7F2] border border-gray-200 rounded-xl transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaLanguage className="text-[#C1622A] text-lg" />
                                                Dashboard Language
                                            </div>
                                            <span className="text-[#C1622A]">{language === 'en' ? 'English' : 'മലയാളം (Malayalam)'}</span>
                                        </button>

                                        <button
                                            onClick={toggleSound}
                                            className="w-full flex items-center justify-between px-4 py-4 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-[#FAF7F2] border border-gray-200 rounded-xl transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaMusic className="text-[#C1622A]" />
                                                Background Music
                                            </div>
                                            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${soundEnabled ? 'bg-[#C1622A]' : 'bg-gray-300'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
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
