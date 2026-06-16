import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase-client";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, 
  FaClock, FaExclamationCircle, FaTimes, FaUtensils, FaSpinner 
} from "react-icons/fa";
import toast from "react-hot-toast";
import { sendNotification } from "../services/notificationService";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [registeringEventId, setRegisteringEventId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all occurrences for this project
        const { data: eventsData, error: eventsError } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("*")
          .eq("parent_project_id", id)
          .order("fromDateTime", { ascending: true });

        if (eventsError) throw eventsError;
        
        if (eventsData && eventsData.length > 0) {
          setOccurrences(eventsData);
          setProjectData(eventsData[0]); // Use first occurrence for main details
        } else {
          setLoading(false);
          return; // No project found
        }

        // Fetch Current User & Registrations
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .schema("me_dataspace")
            .from("users")
            .select("userID, emailID, firstName, lastName, preferences")
            .eq("emailID", user.email)
            .single();

          if (userData) {
            setDbUser(userData);
            
            const eventIds = eventsData.map(e => e.eventID);
            const { data: regData } = await supabase
              .schema("me_dataspace")
              .from("event_participation")
              .select("event_id, registered_as")
              .eq("participant_id", userData.userID)
              .in("event_id", eventIds);

            if (regData) {
              const registeredIds = regData
                .filter(r => ["registered", "volunteer", "attended"].includes(r.registered_as))
                .map(r => r.event_id);
              setUserRegistrations(registeredIds);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRegisterAsVolunteer = async (occ) => {
    if (!dbUser) return toast.error("Please sign in.");
    setRegisteringEventId(occ.eventID);

    try {
      const isRegistered = userRegistrations.includes(occ.eventID);

      if (isRegistered) {
        // Unregister
        const { error } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .delete()
          .eq("participant_id", dbUser.userID)
          .eq("event_id", occ.eventID);

        if (error) throw error;
        setUserRegistrations(prev => prev.filter(eid => eid !== occ.eventID));
        toast.success("Successfully unregistered from this date!");
      } else {
        // Register
        const { error: insertError } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .insert([{
            participant_id: dbUser.userID,
            event_id: occ.eventID,
            registered_as: "registered",
          }]);

        if (insertError) throw insertError;
        setUserRegistrations(prev => [...prev, occ.eventID]);
        toast.success("Successfully registered for this date!");

        await sendNotification({
          title: "New Project Registration",
          body: `${dbUser.firstName} ${dbUser.lastName} has registered as a volunteer for ${projectData.title} (Day).`,
          type: "broadcast",
          priority: "normal",
          target: "all",
          metadata: { eventID: occ.eventID, parent_project_id: id, volunteerName: `${dbUser.firstName} ${dbUser.lastName}` },
          createdBy: dbUser.emailID
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration action failed.");
    } finally {
      setRegisteringEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A64200]"></div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-[#7A3A00] mb-2">Project Not Found</h1>
        <p className="text-[#8A7060] mb-6">The project you are looking for does not exist.</p>
        <button onClick={() => navigate("/volunteer-profile")} className="text-white bg-[#C1622A] px-6 py-2 rounded-lg shadow-md hover:bg-[#A64200] transition font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const registeredCount = userRegistrations.length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pb-12">
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm px-6 lg:px-12 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition text-[#8A7060]">
          <FaArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-[#461711] truncate">{projectData.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12 items-start">
          
          <div className="flex flex-col gap-8">
            {(projectData.bannerURL || projectData.image_url) && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <img src={projectData.bannerURL || projectData.image_url} alt={projectData.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="lg:hidden block">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
                  Project
                </span>
                {projectData.female_only && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider rounded-full border border-pink-200">
                    Female Only
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#461711] leading-tight tracking-tight">
                {projectData.title}
              </h1>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-[#E9E0D8] p-6 md:p-10 space-y-8">
              {projectData.description && (
                <div>
                  <h3 className="text-2xl font-bold text-[#7A3A00] mb-4">About the Project</h3>
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {projectData.description}
                  </div>
                </div>
              )}
              {projectData.fullDetails && (
                <div>
                  <h3 className="text-2xl font-bold text-[#7A3A00] mb-4">Full Details</h3>
                  <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap bg-[#FAF7F2] p-6 rounded-2xl border border-[#E9E0D8]">
                    {projectData.fullDetails}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl p-8">
              <div className="hidden lg:block mb-6 border-b border-[#E9E0D8] pb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
                    Project
                  </span>
                  {projectData.female_only && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider rounded-full border border-pink-200">
                      Female Only
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-[#461711] leading-tight">
                  {projectData.title}
                </h1>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                    {projectData.venue ? (
                      projectData.venue.split(" | ").map((v, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="text-gray-800 font-medium">{v}</p>
                          {projectData.venue_url?.split(" | ")[i] && (
                            <a
                              href={projectData.venue_url.split(" | ")[i]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-bold text-[#C1622A] hover:text-[#A64200] transition"
                            >
                              <FaMapMarkerAlt size={10} />
                              Open in Maps
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-800 font-medium">{projectData.location || "TBD"}</p>
                    )}
                  </div>
                </div>

                {projectData.meetingPoint && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                      <FaUsers size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Meeting Point</p>
                      <p className="text-gray-800 font-medium leading-relaxed">{projectData.meetingPoint}</p>
                    </div>
                  </div>
                )}
                
                {projectData.is_food_available && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <FaUtensils className="text-green-600" size={16} />
                    <span className="font-bold text-green-700 text-sm tracking-wide">Food Provided</span>
                  </div>
                )}
              </div>

              {/* Registration Occurrences */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">Select Dates ({occurrences.length})</h3>
                  {registeredCount > 0 && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                      Registered for {registeredCount}
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {occurrences.map((occ, idx) => {
                    const isOccRegistered = userRegistrations.includes(occ.eventID);
                    return (
                      <label
                        key={occ.eventID}
                        className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                          isOccRegistered ? "border-green-200 bg-green-50/40 shadow-sm" : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isOccRegistered}
                            disabled={registeringEventId === occ.eventID || occ.status === "cancelled"}
                            onChange={() => handleRegisterAsVolunteer(occ)}
                            className="w-5 h-5 accent-[#A64200] cursor-pointer rounded border-gray-300"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 flex items-center gap-2">
                              Day {idx + 1}: {new Date(occ.fromDateTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", weekday: "short" })}
                              {occ.status && occ.status !== "published" && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    occ.status === "postponed"
                                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                      : occ.status === "cancelled"
                                        ? "bg-red-100 text-red-600 border border-red-200"
                                        : "bg-gray-100 text-gray-600 border border-gray-200"
                                  }`}
                                >
                                  {occ.status.charAt(0).toUpperCase() + occ.status.slice(1)}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FaClock size={10} />
                              {new Date(occ.fromDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {occ.toDateTime ? new Date(occ.toDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : 'TBD'}
                            </span>
                          </div>
                        </div>
                        {registeringEventId === occ.eventID && (
                          <FaSpinner className="animate-spin text-[#A64200]" size={14} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
