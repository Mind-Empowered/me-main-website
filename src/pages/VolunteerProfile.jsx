import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import SkillsSection from "../components/profile/SkillsSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import ParticipatedEventsSection from "../components/profile/ParticipatedEventsSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import EmergencyInfoSection from "../components/profile/EmergencyInfoSection";
import FullProfileDetails from "../components/profile/FullProfileDetails";
import { supabase } from "../services/supabase-client";
import { useState, useEffect } from "react";
import { VolunteerProfileSkeleton } from "../components/profile/ProfileSkeletons";
import { translations } from "../translations";
import { useLanguage } from "../contexts/LanguageContext";
import EditProfileModal from "../components/profile/EditProfileModal";

const VolunteerProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'full'
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser?.email) {
                    console.log('No auth user found');
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .schema('me_dataspace')
                    .from('users')
                    .select('*')
                    .eq('emailID', authUser.email)
                    .single();

                if (error) {
                    console.log('Error fetching user:', error.message);
                    setLoading(false);
                    return;
                }

                setUser(data);
            } catch (err) {
                console.error('Exception:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <VolunteerProfileSkeleton />; 
    if (!user) return <div className="flex items-center justify-center min-h-screen">User not found</div>

    // Show full profile view
    if (viewMode === 'full') {
        return (
            <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
                <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" logo="block" onEditClick={() => setIsEditModalOpen(true)}/>
                
                <main className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                        {/* Back Button and Edit Button */}
                        <div className="flex justify-between items-center mb-6">
                            <button 
                                onClick={() => setViewMode('card')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A3A00] text-white rounded-lg hover:bg-[#8B3D00] transition font-semibold"
                            >
                                ← {translations.profile.backToOverview[language]}
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#7A3A00] border border-[#7A3A00] rounded-lg hover:bg-[#FAF7F2] transition font-semibold shadow-sm"
                            >
                                {translations.profile.editProfile[language]}
                            </button>
                        </div>

                        {/* Full Profile Details */}
                        <FullProfileDetails user={user} onEditClick={() => setIsEditModalOpen(true)} />
                    </div>
                </main>
                <EditProfileModal 
                    user={user} 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onUserUpdate={setUser} 
                />
            </div>
        );
    }

    // Show card view (default)
    return (
        <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" logo="block" onEditClick={() => setIsEditModalOpen(true)}/>
            
            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto">
                <div className="flex flex-col xl:flex-row gap-4 px-4 sm:px-6 lg:px-8 py-4 w-full">
                    {/* Left Column - Main Content */}
                    <div className="w-full xl:flex-1 space-y-4">
                        <ProfileCard 
                            user={user} 
                            onUserUpdate={setUser}
                            onViewMore={() => setViewMode('full')}
                            onEditClick={() => setIsEditModalOpen(true)}
                        />
                        
                        {/* Middle Row Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <PreferencesSection user={user} />
                            <EmergencyInfoSection user={user} />
                            <SkillsSection user={user} />
                        </div>
                        
                        {/* Bottom Row - Full Width */}
                        <div className="w-full">
                            <ParticipatedEventsSection user={user} />
                        </div>
                    </div>

                    {/* Right Sidebar - Upcoming Events */}
                    <aside className="w-full xl:w-1/3 flex-shrink-0">
                        <UpcomingEventsSection user={user} />
                    </aside>
                </div>
            </main>
            <EditProfileModal 
                user={user} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onUserUpdate={setUser} 
            />
        </div>
    );
};

export default VolunteerProfile;