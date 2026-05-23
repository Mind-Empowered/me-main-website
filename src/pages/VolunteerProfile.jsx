import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import ParticipatedEventsSection from "../components/profile/ParticipatedEventsSection";
import { supabase } from "../services/supabase-client";
import { useState, useEffect } from "react";

const VolunteerProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

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
                    .eq('emailID', authUser.email)  //  Use email
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

    if (loading) return <div className="flex justify-center items-center h-full"><img src="../../public/brand/logo.gif" alt="Loading" className="" /></div>;  // replace with loading indicator
    if (!user) return <div>User not found</div>

    return (
        <div className="min-h-screen bg-[#F5EDE0] overflow-hidden">
            <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]"/>
            <main className="flex">
                <div className="p-6 w-2/3 mx-auto space-y-6">
                    <ProfileCard user={user} onUserUpdate={setUser} />
                    <AboutSection user={user} onUserUpdate={setUser} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SkillsSection user={user} />
                        <UpcomingEventsSection user={user} />
                    </div>
                </div>
                <div className="p-6 w-1/3 mx-auto">
                    <ParticipatedEventsSection user={user} />
                </div>
            </main>
        </div>
    );
};

export default VolunteerProfile;