import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import ParticipatedEventsSection from "../components/profile/ParticipatedEventsSection";
import FullProfileDetails from "../components/profile/FullProfileDetails";
import { supabase } from "../services/supabase-client";
import { useState, useEffect } from "react";

const VolunteerProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'full'

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

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>; 
    if (!user) return <div className="flex items-center justify-center min-h-screen">User not found</div>

    // Show full profile view
    if (viewMode === 'full') {
        return (
            <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
                <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" logo="block"/>
                
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto px-4 py-6">
                        {/* Back Button */}
                        <button 
                            onClick={() => setViewMode('card')}
                            className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-[#7A3A00] text-white rounded-lg hover:bg-[#8B3D00] transition font-semibold"
                        >
                            ← Back to Overview
                        </button>

                        {/* Full Profile Details */}
                        <FullProfileDetails user={user} />
                    </div>
                </main>
            </div>
        );
    }

    // Show card view (default)
    return (
        <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" logo="block"/>
            
            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto">
                    {/* Left Column - Main Content */}
                    <div className="w-full lg:flex-1 space-y-6">
                        <ProfileCard 
                            user={user} 
                            onUserUpdate={setUser}
                            onViewMore={() => setViewMode('full')}
                        />
                        <AboutSection user={user} onUserUpdate={setUser} />
                        
                        {/* Skills and Participated Events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkillsSection user={user} />
                            <ParticipatedEventsSection user={user} />
                        </div>
                    </div>

                    {/* Right Sidebar - Upcoming Events */}
                    <aside className="w-full lg:w-1/3 flex-shrink-0">
                        <UpcomingEventsSection user={user} />
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default VolunteerProfile;