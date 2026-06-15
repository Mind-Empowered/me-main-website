import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase-client";
import { 
  FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, 
  FaClock, FaExclamationCircle, FaTimes, FaUtensils 
} from "react-icons/fa";
import toast from "react-hot-toast";
import { sendNotification } from "../services/notificationService";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Event Details
        const { data: eventData, error: eventError } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("*")
          .eq("eventID", id)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch Current User
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

            // Fetch Registration Status
            const { data: regData } = await supabase
              .schema("me_dataspace")
              .from("event_participation")
              .select("registered_as")
              .eq("participant_id", userData.userID)
              .eq("event_id", id)
              .single();

            if (regData && ["registered", "volunteer", "attended"].includes(regData.registered_as)) {
              setIsRegistered(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRegister = async () => {
    if (!dbUser) return toast.error("Please sign in.");
    setActionLoading(true);
    try {
      const { data: existingReg } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id")
        .eq("participant_id", dbUser.userID)
        .eq("event_id", event.eventID)
        .maybeSingle();

      if (existingReg) {
        const { error } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .update({ registered_as: "registered" })
          .eq("id", existingReg.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .insert({
            participant_id: dbUser.userID,
            event_id: event.eventID,
            registered_as: "registered",
          });
        if (error) throw error;
      }
      setIsRegistered(true);
      toast.success("Successfully registered for the event!");

      await sendNotification({
        title: "New Event Registration",
        body: `${dbUser.firstName} ${dbUser.lastName} has registered as a volunteer for ${event.title}.`,
        type: "broadcast",
        priority: "normal",
        target: "all",
        metadata: { eventID: event.eventID, volunteerName: `${dbUser.firstName} ${dbUser.lastName}` },
        createdBy: dbUser.emailID
      });
    } catch (err) {
      console.error(err);
      toast.error("Registration failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return toast.error("Please provide a reason for cancelling.");
    setActionLoading(true);
    try {
      // 1. Update participation to cancelled
      const { error: partError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .update({ registered_as: "cancelled" })
        .eq("participant_id", dbUser.userID)
        .eq("event_id", event.eventID);

      if (partError) throw partError;

      // 2. Update user preferences cancel stats
      const currentPrefs = dbUser.preferences || {};
      const newCancelCount = (currentPrefs.cancelCount || 0) + 1;
      const newCancelHistory = [
        ...(currentPrefs.cancellationHistory || []),
        { eventId: event.eventID, title: event.title, reason: cancelReason, date: new Date().toISOString() }
      ];

      const newPrefs = { ...currentPrefs, cancelCount: newCancelCount, cancellationHistory: newCancelHistory };
      
      const { error: userError } = await supabase
        .schema("me_dataspace")
        .from("users")
        .update({ preferences: newPrefs })
        .eq("userID", dbUser.userID);

      if (userError) throw userError;

      setIsRegistered(false);
      setShowCancelModal(false);
      setCancelReason("");
      toast.success("Registration cancelled successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Cancellation failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const isCancellationAllowed = () => {
    if (!event) return false;
    const eventDate = new Date(event.fromDateTime);
    const now = new Date();
    // Calculate difference in hours
    const diffTime = eventDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    // Disallow if less than 24 hours away (day before)
    return diffHours > 24;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A64200]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-[#7A3A00] mb-2">Event Not Found</h1>
        <p className="text-[#8A7060] mb-6">The event you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate("/volunteer-profile")} className="text-white bg-[#C1622A] px-6 py-2 rounded-lg shadow-md hover:bg-[#A64200] transition font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const startDate = new Date(event.fromDateTime);
  const endDate = event.toDateTime ? new Date(event.toDateTime) : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans pb-12">
      {/* Header Bar */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm px-6 lg:px-12 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-full transition text-[#8A7060]"
        >
          <FaArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-[#461711] truncate">{event.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12 items-start">
          
          {/* Main Content Column */}
          <div className="flex flex-col gap-8">
            {/* Cover Image */}
            {(event.bannerURL || event.image_url) && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 transition-colors duration-500"></div>
                <img src={event.bannerURL || event.image_url} alt={event.bannerAltText || event.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Mobile Title (Hidden on Desktop) */}
            <div className="lg:hidden block">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.female_only && (
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider rounded-full border border-pink-200">
                    Female Only
                  </span>
                )}
                {event.is_project && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
                    Project Event
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#461711] leading-tight tracking-tight">
                {event.title}
              </h1>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#E9E0D8] p-6 md:p-10 space-y-8">
              {event.description && (
                <div>
                  <h3 className="text-2xl font-bold text-[#7A3A00] mb-4">About the Event</h3>
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              )}
              
              {event.fullDetails && (
                <div>
                  <h3 className="text-2xl font-bold text-[#7A3A00] mb-4">Full Details</h3>
                  <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap bg-[#FAF7F2] p-6 rounded-2xl border border-[#E9E0D8]">
                    {event.fullDetails}
                  </div>
                </div>
              )}
              
              {!event.description && !event.fullDetails && (
                <p className="text-gray-500 italic text-center py-8">No additional details provided for this event.</p>
              )}
            </div>
          </div>

          {/* Sticky Sidebar Column */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl p-8">
              
              {/* Desktop Title (Hidden on Mobile) */}
              <div className="hidden lg:block mb-6 border-b border-[#E9E0D8] pb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.female_only && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider rounded-full border border-pink-200">
                      Female Only
                    </span>
                  )}
                  {event.is_project && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
                      Project Event
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-[#461711] leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* Key Details List */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                    <FaCalendarAlt size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                    <p className="text-gray-800 font-semibold">
                      {startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {endDate && startDate.toDateString() !== endDate.toDateString() && (
                      <p className="text-gray-600 text-sm mt-0.5">
                        to {endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                    <FaClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Time</p>
                    <p className="text-gray-800 font-semibold">
                      {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {endDate ? ` - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                    {event.venue ? (
                      event.venue.split(" | ").map((v, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="text-gray-800 font-medium">{v}</p>
                          {event.venue_url?.split(" | ")[i] && (
                            <a
                              href={event.venue_url.split(" | ")[i]}
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
                      <p className="text-gray-800 font-medium">{event.location || "TBD"}</p>
                    )}
                  </div>
                </div>

                {event.meetingPoint && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#FAF7F2] text-[#A64200] rounded-xl flex-shrink-0 shadow-sm border border-[#E9E0D8]">
                      <FaUsers size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Meeting Point</p>
                      <p className="text-gray-800 font-medium leading-relaxed">{event.meetingPoint}</p>
                    </div>
                  </div>
                )}
                
                {event.is_food_available && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <FaUtensils className="text-green-600" size={16} />
                    <span className="font-bold text-green-700 text-sm tracking-wide">Food Provided</span>
                  </div>
                )}
              </div>

              {/* Registration CTA */}
              <div className="border-t border-gray-100 pt-8 flex flex-col items-center">
                {isRegistered ? (
                  <div className="w-full text-center">
                    <div className="inline-flex items-center justify-center gap-2 w-full py-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-bold text-lg mb-4 shadow-sm">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      You're Registered!
                    </div>
                    
                    <div className="mt-2 flex flex-col items-center justify-center">
                      {!isCancellationAllowed() ? (
                        <div className="flex flex-col items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                          <FaExclamationCircle size={16} />
                          <span className="text-center font-medium">Cancellations are not permitted less than 24 hours before the event starts.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="text-gray-500 hover:text-red-600 font-semibold text-sm transition underline underline-offset-4"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={actionLoading}
                    className={`w-full py-4 rounded-2xl font-extrabold text-white text-lg tracking-wide transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 ${
                      actionLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#A64200] to-[#C1622A]"
                    }`}
                  >
                    {actionLoading ? "Processing..." : "Register as Volunteer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={20} />
            </button>
            
            <h3 className="text-2xl font-bold text-[#461711] mb-2">Cancel Registration</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to cancel? This action will be recorded. Please provide a reason so we can let the admins know.
            </p>
            
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Why are you cancelling?"
              className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-[#C1622A] focus:border-transparent transition resize-none mb-6 text-gray-800"
            />
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                Keep Registration
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading || !cancelReason.trim()}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
