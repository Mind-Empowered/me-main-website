import { useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaTimes, FaLock } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!passwords.oldPassword) {
            return toast.error("Please enter your current password");
        }
        
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            // 1. Get current user's email
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Could not find active user session");

            // 2. Verify old password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: passwords.oldPassword,
            });

            if (signInError) {
                throw new Error("Incorrect old password");
            }

            // 3. Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwords.newPassword
            });

            if (updateError) throw updateError;
            
            toast.success("Password updated successfully!");
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setIsResetting(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Could not find active user session");

            // Assuming /reset-password is your app's reset route configured in Supabase
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            toast.success("Password reset email sent! Check your inbox.");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up-fast">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                            <FaLock className="text-[#A64200] text-lg" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            {language === 'ml' ? 'പാസ്‌വേഡ് മാറ്റുക' : 'Change Password'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#A64200] transition">
                        <FaTimes size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-gray-600 uppercase">
                                {language === 'ml' ? 'പഴയ പാസ്‌വേഡ്' : 'Old Password'}
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={isResetting}
                                className="text-xs font-bold text-[#A64200] hover:text-[#8B3D00] hover:underline transition"
                            >
                                {isResetting ? 'Sending...' : 'Forgot Password?'}
                            </button>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Enter current password"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 transition-colors text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">
                            {language === 'ml' ? 'പുതിയ പാസ്‌വേഡ്' : 'New Password'}
                        </label>
                        <input
                            type="password"
                            required
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 transition-colors text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">
                            {language === 'ml' ? 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക' : 'Confirm Password'}
                        </label>
                        <input
                            type="password"
                            required
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A64200]/50 transition-colors text-gray-800"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#A64200] hover:bg-[#8B3D00] transition shadow-sm disabled:opacity-50"
                        >
                            {loading ? (language === 'ml' ? 'അപ്ഡേറ്റ് ചെയ്യുന്നു...' : 'Updating...') : (language === 'ml' ? 'പാസ്‌വേഡ് അപ്ഡേറ്റ് ചെയ്യുക' : 'Update Password')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
