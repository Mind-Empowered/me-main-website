import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaTimes, FaSpinner, FaChevronRight, FaChevronLeft, FaMapMarkerAlt, FaUtensils, FaClock } from "react-icons/fa";
import { SectionSkeleton } from "./ProfileSkeletons";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";
import toast from "react-hot-toast";
import { sendNotification } from "../../services/notificationService";

const UpcomingEventsSection = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]); // Array of registered eventID strings
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [registerStatus, setRegisterStatus] = useState({}); // { eventId: 'success' | 'error' | 'already' }
  const [currentPage, setCurrentPage] = useState(0);
  const [filterType, setFilterType] = useState("all"); // "all" | "you"
  const EVENTS_PER_PAGE = 5;

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // 1. Get logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        let currentUserId = null;
        let fetchedUserData = null;
        if (user) {
          // Get user details
          const { data: userData } = await supabase
            .schema("me_dataspace")
            .from("users")
            .select("userID, emailID, firstName, lastName, gender")
            .eq("emailID", user.email)
            .single();

          if (userData) {
            fetchedUserData = userData;
            setDbUser(userData);
            currentUserId = userData.userID;

            // 2. Fetch registrations
            const { data: regs } = await supabase
              .schema("me_dataspace")
              .from("event_participation")
              .select("event_id")
              .eq("participant_id", userData.userID)
              .in("registered_as", ["registered", "volunteer", "attended"]);
            
            if (regs) {
              setUserRegistrations(regs.map((r) => r.event_id));
            }
          }
        }

        // 3. Fetch upcoming events
        const { data, error } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("*")
          .gt("fromDateTime", new Date().toISOString())
          .order("fromDateTime", { ascending: true });

        if (error) {
          console.error("Error fetching events:", error);
        } else {
          // Filter out female-only events if the user is not female
          const filteredEvents = (data || []).filter((event) => {
            if (event.female_only) {
              return fetchedUserData?.gender?.toLowerCase() === "female";
            }
            return true;
          });
          setEvents(filteredEvents);
        }
      } catch (err) {
        console.error("Exception loading profile events:", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleRegisterAsVolunteer = async (event) => {
    if (!dbUser) {
      toast.error("Please sign in to register.");
      return;
    }
    setRegisteringEventId(event.eventID);
    setRegisterStatus(prev => ({ ...prev, [event.eventID]: null }));

    try {
      const isRegistered = userRegistrations.includes(event.eventID);

      if (isRegistered) {
        // Unregister
        const { error } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .delete()
          .eq("participant_id", dbUser.userID)
          .eq("event_id", event.eventID);

        if (error) throw error;
        setUserRegistrations(prev => prev.filter(id => id !== event.eventID));
        toast.success("Successfully unregistered!");
      } else {
        // Register
        const { error: insertError } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .insert([
            {
              participant_id: dbUser.userID,
              event_id: event.eventID,
              registered_as: "registered",
            },
          ]);

        if (insertError) throw insertError;
        setUserRegistrations(prev => [...prev, event.eventID]);
        setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'success' }));
        toast.success("Successfully registered!");

        // Send a notification to all volunteers
        try {
          await sendNotification({
            title: "New Event Registration",
            body: `${dbUser.firstName} ${dbUser.lastName} has registered as a volunteer for ${event.title}.`,
            type: "broadcast",
            priority: "normal",
            target: "all",
            metadata: {
              eventID: event.eventID,
              volunteerName: `${dbUser.firstName} ${dbUser.lastName}`
            },
            createdBy: dbUser.emailID
          });
        } catch (notifErr) {
          console.error("Failed to send registration notification:", notifErr);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterStatus(prev => ({ ...prev, [event.eventID]: 'error' }));
      toast.error("Failed to update registration status.");
    } finally {
      setRegisteringEventId(null);
    }
  };

  const toggleProjectExpanded = (pId) => {
    setExpandedProjects(prev =>
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };

  // Group events by parent_project_id
  const groupedEvents = [];
  const projectGroups = {};

  events.forEach((event) => {
    if (event.is_project && event.parent_project_id) {
      if (!projectGroups[event.parent_project_id]) {
        projectGroups[event.parent_project_id] = [];
      }
      projectGroups[event.parent_project_id].push(event);
    } else {
      groupedEvents.push({ type: "event", data: event });
    }
  });

  Object.keys(projectGroups).forEach((pId) => {
    const occurrences = projectGroups[pId];
    occurrences.sort((a, b) => new Date(a.fromDateTime) - new Date(b.fromDateTime));
    groupedEvents.push({
      type: "project",
      parent_project_id: pId,
      data: occurrences[0],
      occurrences,
    });
  });

  // Sort chronological based on earliest day
  groupedEvents.sort((a, b) => new Date(a.data.fromDateTime) - new Date(b.data.fromDateTime));

  // Filter based on "For You" (registered) vs "For All"
  const filteredGroupedEvents = groupedEvents.filter((item) => {
    if (filterType === "all") return true;
    
    // "For You": User must be registered for this event or at least one occurrence of this project
    if (item.type === "event") {
      return userRegistrations.includes(item.data.eventID);
    } else {
      return item.occurrences.some((occ) => userRegistrations.includes(occ.eventID));
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGroupedEvents.length / EVENTS_PER_PAGE);
  const paginatedItems = filteredGroupedEvents.slice(
    currentPage * EVENTS_PER_PAGE,
    (currentPage + 1) * EVENTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  if (loading) return <SectionSkeleton titleWidth="w-44" itemCount={4} cardHeight="h-28" />;

  return (
    <>
      <div className="bg-white rounded-2xl p-5 flex flex-col h-full shadow-sm">
        {/* Header and Filter Tab */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-[#8A7060]">
            {translations.profile.upcoming[language]}
          </h2>
          
          {/* For You / For All Filters */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => { setFilterType("all"); setCurrentPage(0); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                filterType === "all" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              For All
            </button>
            <button
              onClick={() => { setFilterType("you"); setCurrentPage(0); }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                filterType === "you" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              For You
            </button>
          </div>
        </div>

        {filteredGroupedEvents.length === 0 ? (
          <p className="text-gray-600 italic py-6 text-center">
            {filterType === "you" ? "You haven't registered for any upcoming events/projects yet." : "No upcoming events or projects."}
          </p>
        ) : (
          <>
            <div className="space-y-3 flex-1 mb-3 overflow-y-auto pr-1" style={{ maxHeight: '60vh' }}>
              {paginatedItems.map((item) => {
                if (item.type === "event") {
                  const event = item.data;
                  const isRegistered = userRegistrations.includes(event.eventID);
                  const isExpanded = expandedEventId === event.eventID;

                  return (
                    <div
                      key={event.eventID}
                      className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer bg-white"
                      onClick={() => setExpandedEventId(isExpanded ? null : event.eventID)}
                    >
                      <div className="flex gap-3">
                        {event.bannerURL && (
                          <img
                            src={event.bannerURL}
                            alt={event.bannerAltText || event.title}
                            className="w-16 h-16 object-cover rounded"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 flex justify-between">
                          <div>
                            <h3 className="text-base font-bold text-[#A64200]">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">
                                {new Date(event.fromDateTime).toLocaleDateString()} at{" "}
                                {new Date(event.fromDateTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              {event.status && event.status !== "published" && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    event.status === "postponed"
                                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                      : event.status === "cancelled"
                                        ? "bg-red-100 text-red-600 border border-red-200"
                                        : "bg-gray-100 text-gray-600 border border-gray-200"
                                  }`}
                                >
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                              )}
                            </div>
                            {event.is_food_available && (
                              <div className="flex items-center gap-1 mt-1.5 text-xs text-green-600">
                                <FaUtensils size={10} />
                                <span>Food Provided</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegisterAsVolunteer(event);
                            }}
                            disabled={registeringEventId === event.eventID || event.status === "cancelled"}
                            className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition self-start ${
                              event.status === "cancelled"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                : isRegistered
                                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  : "bg-[#A64200] text-white hover:bg-[#8a3600]"
                            }`}
                          >
                            {registeringEventId === event.eventID ? (
                              <FaSpinner className="animate-spin" size={12} />
                            ) : isRegistered ? (
                              "✓ Registered"
                            ) : event.status === "cancelled" ? (
                              "Cancelled"
                            ) : (
                              translations.profile.register[language]
                            )}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t animate-fade-in text-xs text-gray-700 space-y-3" onClick={(e) => e.stopPropagation()}>
                          {event.description && (
                            <div>
                              <h4 className="font-bold text-gray-800">Description</h4>
                              <p className="mt-0.5 leading-relaxed">{event.description}</p>
                            </div>
                          )}
                          
                          {event.fullDetails && (
                            <div>
                              <h4 className="font-bold text-gray-800">Details</h4>
                              <p className="whitespace-pre-wrap mt-0.5 leading-relaxed">{event.fullDetails}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div>
                              <span className="font-bold text-gray-500 text-[10px] uppercase">Venue</span>
                              {event.venue ? (
                                event.venue.split(" | ").map((v, i) => (
                                  <div key={i} className="mt-0.5">
                                    <p className="text-gray-800 font-semibold">{v}</p>
                                    {event.venue_url?.split(" | ")[i] && (
                                      <a
                                        href={event.venue_url.split(" | ")[i]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-[#A64200] hover:underline"
                                      >
                                        <FaMapMarkerAlt size={9} />
                                        View on Map
                                      </a>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-800 font-semibold">TBD</p>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-gray-500 text-[10px] uppercase">Duration</span>
                              <p className="text-gray-800 font-semibold mt-0.5">
                                {new Date(event.fromDateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(event.toDateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Multi-day Project Group card
                  const isExpanded = expandedProjects.includes(item.parent_project_id);
                  const registeredCount = item.occurrences.filter((occ) => userRegistrations.includes(occ.eventID)).length;

                  return (
                    <div
                      key={item.parent_project_id}
                      className="border rounded-lg p-3 bg-orange-50/10 hover:shadow-md transition cursor-pointer"
                      onClick={() => toggleProjectExpanded(item.parent_project_id)}
                    >
                      <div className="flex gap-3">
                        {item.data.bannerURL ? (
                          <img
                            src={item.data.bannerURL}
                            alt={item.data.title}
                            className="w-16 h-16 object-cover rounded border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#F7F2EC] rounded flex items-center justify-center border text-[10px] font-bold text-gray-400">PRJ</div>
                        )}
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                                Project
                              </span>
                              {registeredCount > 0 && (
                                <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                                  Registered for {registeredCount} days
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mt-1">
                              {item.data.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.occurrences.length} dates scheduled starting {new Date(item.occurrences[0].fromDateTime).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            className="text-xs font-semibold text-[#A64200] hover:underline mt-1 focus:outline-none"
                          >
                            {isExpanded ? "Hide Dates" : "Show Dates"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t animate-fade-in text-xs text-gray-700 space-y-3" onClick={(e) => e.stopPropagation()}>
                          {item.data.description && (
                            <div>
                              <h4 className="font-bold text-gray-800">About Project</h4>
                              <p className="mt-0.5 leading-relaxed">{item.data.description}</p>
                            </div>
                          )}

                          {item.data.venue && (
                            <div className="text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">Venue:</span>
                              {item.data.venue.split(" | ").map((v, i) => (
                                <div key={i} className="ml-4 mt-0.5">
                                  <span>{v}</span>
                                  {item.data.venue_url?.split(" | ")[i] && (
                                    <a
                                      href={item.data.venue_url.split(" | ")[i]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 ml-2 text-[10px] text-[#A64200] hover:underline"
                                    >
                                      <FaMapMarkerAlt size={9} />
                                      View on Map
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Occurrence List with checkboxes */}
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Select days you can participate:</h4>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {item.occurrences.map((occ, idx) => {
                                const isOccRegistered = userRegistrations.includes(occ.eventID);
                                return (
                                  <label
                                    key={occ.eventID}
                                    className={`flex items-center justify-between p-2 rounded-lg border transition cursor-pointer select-none ${
                                      isOccRegistered ? "border-green-200 bg-green-50/40" : "border-gray-100 bg-white hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isOccRegistered}
                                        disabled={registeringEventId === occ.eventID || occ.status === "cancelled"}
                                        onChange={() => handleRegisterAsVolunteer(occ)}
                                        className="w-4 h-4 accent-[#A64200] cursor-pointer"
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                                          Day {idx + 1}: {new Date(occ.fromDateTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", weekday: "short" })}
                                          {occ.status && occ.status !== "published" && (
                                            <span
                                              className={`text-[9px] font-bold px-1 py-0.2 rounded ${
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
                                        <span className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                          <FaClock size={9} />
                                          {new Date(occ.fromDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(occ.toDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                      </div>
                                    </div>
                                    {registeringEventId === occ.eventID && (
                                      <FaSpinner className="animate-spin text-[#A64200]" size={12} />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === 0
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === totalPages - 1
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
