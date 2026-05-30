import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaTimes, FaSpinner, FaChevronRight, FaChevronLeft, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import { SectionSkeleton } from "./ProfileSkeletons";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const UpcomingEventsSection = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registerStatus, setRegisterStatus] = useState({}); // { eventId: 'success' | 'error' | 'already' }
  const [currentPage, setCurrentPage] = useState(0);
  const EVENTS_PER_PAGE = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("*")
          .in("status", ["published", "postponed", "cancelled"])
          .gt("fromDateTime", new Date().toISOString())
          .order("fromDateTime", { ascending: true });

        if (error) {
          console.log("Error fetching events:", error);
          setLoading(false);
          return;
        }

        setEvents(data || []);
      } catch (err) {
        console.error("Exception:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleVolunteerClick = (event) => {
    setExpandedEventId(expandedEventId === event.eventID ? null : event.eventID);
  };

  const handleRegisterAsVolunteer = async (event) => {
    setRegisteringEventId(event.eventID);
    setRegisterStatus(prev => ({ ...prev, [event.eventID]: null }));

    try {
      // Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Auth User error:", userError);
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
        setRegisteringEventId(null);
        return;
      }

      console.log("Auth User:", user.email);
      console.log("Event ID:", event.eventID);

      // Get user info from database by email
      const { data: userData, error: userDataError } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID")
        .eq("emailID", user.email)
        .single();

      if (userDataError) {
        console.error("User lookup error:", userDataError);
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
        setRegisteringEventId(null);
        return;
      }

      if (!userData) {
        console.error("User not found in database");
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
        setRegisteringEventId(null);
        return;
      }

      console.log("User data:", userData);

      // FIXED: Check if user is already registered for this event BEFORE inserting
      const { data: existingRegistration, error: checkError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id")
        .eq("participant_id", userData.userID)
        .eq("event_id", event.eventID)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Check error:", checkError);
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
        setRegisteringEventId(null);
        return;
      }

      if (existingRegistration) {
        console.log("User already registered for this event");
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'already' }));
        setRegisteringEventId(null);
        return;
      }

      console.log("Attempting to insert registration...");

      const { data: insertedData, error: insertError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .insert([
          {
            participant_id: userData.userID,
            event_id: event.eventID,
            registered_as: "volunteer",
          },
        ])
        .select();

      if (insertError) {
        if (
          insertError.code === "23505" ||
          insertError.message?.includes("duplicate") ||
          insertError.message?.includes("Duplicate")
        ) {
          setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'already' }));
          setRegisteringEventId(null);
          return;
        }

        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
        setRegisteringEventId(null);
        return;
      }

      console.log("Registration successful:", insertedData);
      setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'success' }));
    } catch (err) {
      console.error("Unexpected error:", err);
      setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
    } finally {
      setRegisteringEventId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const paginatedEvents = events.slice(
    currentPage * EVENTS_PER_PAGE,
    (currentPage + 1) * EVENTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <SectionSkeleton titleWidth="w-44" itemCount={4} cardHeight="h-28" />;

  return (
    <>
      <div className="bg-white rounded-2xl p-5 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-3 text-[#8A7060]">
          {translations.profile.upcomingEvents[language]}
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No upcoming events</p>
        ) : (
          <>
            <div className="space-y-2 flex-1 mb-3 overflow-y-auto pr-1" style={{ maxHeight: '60vh' }}>
              {paginatedEvents.map((event) => (
                <div
                  key={event.eventID}
                  className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer"
                  onClick={() => setExpandedEventId(expandedEventId === event.eventID ? null : event.eventID)}
                >
                  <div className="flex gap-3">
                    {event.bannerURL && (
                      <img
                        src={event.bannerURL}
                        alt={event.bannerAltText || event.title}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="flex-1 flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#A64200]">
                          {event.title}
                        </h3>
                        {/* Status Badge */}
                        {event.status && (
                          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-1 ${event.status === "published" ? "bg-green-100 text-green-700" :
                            event.status === "draft" ? "bg-gray-100 text-gray-600" :
                              event.status === "postponed" ? "bg-yellow-100 text-yellow-700" :
                                event.status === "cancelled" ? "bg-red-100 text-red-600" :
                                  "bg-gray-100 text-gray-600"
                            }`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(event.fromDateTime).toLocaleDateString()} at{" "}
                          {new Date(event.fromDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {/* Food Badge */}
                        {event.is_food_available && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                            <FaUtensils size={12} />
                            <span>Food Provided</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVolunteerClick(event);
                        }}
                        className="mt-3 px-4 py-2 bg-[#A64200] text-white rounded-xl hover:bg-[#8a3600] transition self-start"
                      >
                        {expandedEventId === event.eventID ? (translations.profile.viewLess?.[language] || "Hide Details") : translations.profile.register[language]}
                      </button>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterAsVolunteer(event);
                         
                        }}
                        disabled={
                          registeringEventId === event.eventID ||
                          registerStatus[event.eventID] === "success" ||
                          registerStatus[event.eventID] === "already" ||
                          event.status === "cancelled"  
                        }
                        className={`mt-3 px-4 py-2 bg-[#A64200] text-white rounded-xl hover:bg-[#8a3600] transition self-start font-medium flex items-center justify-center gap-2 ${
                            event.status === "cancelled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#A64200] hover:bg-[#8a3600]"
                          }`}
                      >
                        {expandedEventId === event.eventID ? (translations.profile.viewLess?.[language] || "Hide Details") : translations.profile.register[language]}                      
                      </button> */}
                    </div>
                  </div>

                  {/* Expanded Dropdown Details */}
                  {expandedEventId === event.eventID && (
                    <div className="mt-4 pt-4 border-t animate-fade-in text-sm text-gray-700">
                      <div className="space-y-4">
                        {event.description && (
                          <div>
                            <h4 className="font-bold text-gray-800">Description</h4>
                            <p>{event.description}</p>
                          </div>
                        )}

                        {event.fullDetails && (
                          <div>
                            <h4 className="font-bold text-gray-800">Event Details</h4>
                            <p className="whitespace-pre-wrap">{event.fullDetails}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-bold text-gray-800">Start Time</span>
                            <p>{new Date(event.fromDateTime).toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-bold text-gray-800">End Time</span>
                            <p>{new Date(event.toDateTime).toLocaleString()}</p>
                          </div>
                        </div>

                        {event.venue && (
                          <div>
                            <span className="font-bold text-gray-800">Venue</span>
                            <p>{event.venue}</p>
                          </div>
                        )}

                        {event.reg_deadline && (
                          <div>
                            <span className="font-bold text-gray-800">Registration Deadline</span>
                            <p>{new Date(event.reg_deadline).toLocaleDateString()}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          {event.max_participants != null && (
                            <div>
                              <span className="font-bold text-gray-800">Max Participants</span>
                              <p>{event.max_participants}</p>
                            </div>
                          )}
                          {event.max_volunteers != null && (
                            <div>
                              <span className="font-bold text-gray-800">Max Volunteers</span>
                              <p>{event.max_volunteers}</p>
                            </div>
                          )}
                        </div>

                        {event.eventURL && (
                          <div>
                            <span className="font-bold text-gray-800">Event Website</span>
                            <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="block text-[#A64200] hover:underline break-all">
                              {event.eventURL}
                            </a>
                          </div>
                        )}

                        {event.agenda && (
                          <div>
                            <h4 className="font-bold text-gray-800">Agenda</h4>
                            <p className="whitespace-pre-wrap">{event.agenda}</p>
                          </div>
                        )}

                        {/* Status Messages */}
                        {registerStatus[event.eventID] === "success" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                            ✅ You have successfully registered as a volunteer!
                          </div>
                        )}
                        {registerStatus[event.eventID] === "already" && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 font-medium">
                            ⚠️ You are already registered for this event.
                          </div>
                        )}
                        {registerStatus[event.eventID] === "error" && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                            ❌ Registration failed. Please try again.
                          </div>
                        )}

                        {/* Registration Button */}
                        <div className="flex justify-end pt-2">
                          {/* <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegisterAsVolunteer(event);
                            }}
                            disabled={
                              registeringEventId === event.eventID ||
                              registerStatus[event.eventID] === "success" ||
                              registerStatus[event.eventID] === "already"
                            }
                            className={`px-6 py-2 rounded-lg transition font-medium text-white flex items-center justify-center gap-2 ${registerStatus[event.eventID] === "success" || registerStatus[event.eventID] === "already"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#A64200] hover:bg-[#8a3600]"
                              }`}
                          > */}
                          <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterAsVolunteer(event);
                         
                        }}
                        disabled={
                          registeringEventId === event.eventID ||
                          registerStatus[event.eventID] === "success" ||
                          registerStatus[event.eventID] === "already" ||
                          event.status === "cancelled"  
                        }
                        className={`mt-3 px-4 py-2 bg-[#A64200] text-white rounded-xl hover:bg-[#8a3600] transition self-start font-medium flex items-center justify-center gap-2 ${
                            event.status === "cancelled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#A64200] hover:bg-[#8a3600]"
                          }`}
                      >
                            {registeringEventId === event.eventID ? (
                              <>
                                <FaSpinner className="animate-spin" size={14} />
                                Registering...
                              </>
                            ) : registerStatus[event.eventID] === "success" ? (
                              "✓ Registered"
                            ) : registerStatus[event.eventID] === "already" ? (
                              "Already Registered"
                            ) : (
                              "Register as Volunteer"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${currentPage === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <FaChevronLeft size={14} />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${currentPage === totalPages - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#A64200] text-white hover:bg-[#8a3600]"
                    }`}
                >
                  Next
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>


    </>
  );
};

export default UpcomingEventsSection;