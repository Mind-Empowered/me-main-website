import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import { supabase } from "../services/supabase-client";
import { useState, useEffect } from "react";

const VolunteerProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                // console.log('Auth user email:', authUser?.email);

                if (!authUser?.email) {
                    console.log('No auth user found');
                    setLoading(false);
                    return;
                }

                // Query by email instead of userID
                const { data, error } = await supabase
                    .schema('me_dataspace')
                    .from('users')
                    .select('*')
                    .eq('emailID', authUser.email)  // ← Use email instead
                    .single();

                // console.log('Query error:', error);
                // console.log('User data:', data);

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

    if (loading) return <div>Loading profile...</div>;
    if (!user) return <div>User not found</div>


    return (
        <div className="min-h-screen bg-[#F5EDE0] overflow-hidden">
            <Header user={user} />
            <main className="p-6 w-2/3 mx-auto space-y-6">
                <ProfileCard user={user} />
                <AboutSection user={user} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkillsSection />
                    <UpcomingEventsSection />
                </div>
            </main>
        </div>
    );
};

export default VolunteerProfile;