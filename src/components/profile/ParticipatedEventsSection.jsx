import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { SectionSkeleton } from "./ProfileSkeletons";
import { translations } from "../../translations";
import { useLanguage } from "../../contexts/LanguageContext";

const ParticipatedEventsSection = () => {
    const { language } = useLanguage();
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const EVENTS_PER_PAGE = 4;

    useEffect(() => {
        const fetchParticipatedEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current logged-in user
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error("Auth error:", userError);
                    setError("Failed to fetch user information");
                    setLoading(false);
                    return;
                }

                // Get user ID from database by email
                const { data: userData, error: userDataError } = await supabase
                    .schema("me_dataspace")
                    .from("users")
                    .select("userID")
                    .eq("emailID", user.email)
                    .single();

                if (userDataError) {
                    console.error("User lookup error:", userDataError);
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                if (!userData) {
                    console.error("User not found in database");
                    setError("User data not available");
                    setLoading(false);
                    return;
                }

                const userID = userData.userID;

                // Fetch participated events 
                const { data: participations, error: participationError } = await supabase
                    .schema("me_dataspace")
                    .from("event_participation")
                    .select("event_id, created_at")
                    .eq("participant_id", userID)
                    .eq("registered_as", "attended");

                if (participationError) {
                    console.error("Participation fetch error:", participationError);
                    setError("Failed to fetch participated events");
                    setLoading(false);
                    return;
                }

                if (!participations || participations.length === 0) {
                    setParticipatedEvents([]);
                    setLoading(false);
                    return;
                }

                // Get event details for all participated events
                const eventIds = participations.map((p) => p.event_id);
                const { data: events, error: eventsError } = await supabase
                    .schema("me_dataspace")
                    .from("events")
                    .select("eventID, title, description, fullDetails, fromDateTime, toDateTime, is_project, parent_project_id, venue, eventURL, agenda, bannerURL, bannerAltText")
                    .in("eventID", eventIds);

                if (eventsError) {
                    console.error("Events fetch error:", eventsError);
                    setError("Failed to fetch event details");
                    setLoading(false);
                    return;
                }

                // Merge participation data with event data
                const merged = participations.map((participation) => {
                    const event = (events || []).find(
                        (e) => e.eventID === participation.event_id
                    );
                    return {
                        id: participation.event_id,
                        participatedAt: participation.created_at,
                        title: event?.title || "Unknown Event",
                        description: event?.description || "",
                        date: event?.fromDateTime || null,
                        toDateTime: event?.toDateTime || null,
                        is_project: event?.is_project || false,
                        parent_project_id: event?.parent_project_id || null,
                        venue: event?.venue || "",
                        eventURL: event?.eventURL || "",
                        agenda: event?.agenda || "",
                        bannerURL: event?.bannerURL || null,
                        bannerAltText: event?.bannerAltText || null,
                    };
                });

                // Group multi-day projects
                const finalItems = [];
                const projectGroups = {};

                merged.forEach((item) => {
                    if (item.is_project && item.parent_project_id) {
                        if (!projectGroups[item.parent_project_id]) {
                            projectGroups[item.parent_project_id] = [];
                        }
                        projectGroups[item.parent_project_id].push(item);
                    } else {
                        finalItems.push({
                            type: "event",
                            id: item.id,
                            participatedAt: item.participatedAt,
                            data: item,
                        });
                    }
                });

                Object.keys(projectGroups).forEach((pId) => {
                    const occurrences = projectGroups[pId];
                    // Sort occurrences chronological (earliest first)
                    occurrences.sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                    // Sort occurrences by participatedAt to find the latest attended date
                    const latestParticipation = [...occurrences].sort((a, b) => new Date(b.participatedAt) - new Date(a.participatedAt))[0];
                    
                    finalItems.push({
                        type: "project",
                        id: pId,
                        participatedAt: latestParticipation.participatedAt,
                        data: occurrences[0], // Use earliest occurrence details
                        occurrences,
                    });
                });

                // Sort by participated date (most recent first)
                finalItems.sort(
                    (a, b) =>
                        new Date(b.participatedAt) - new Date(a.participatedAt)
                );

                setParticipatedEvents(finalItems);
                setLoading(false);
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        fetchParticipatedEvents();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(participatedEvents.length / EVENTS_PER_PAGE);
    const paginatedItems = participatedEvents.slice(
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

     if (loading) {
        return <SectionSkeleton titleWidth="w-52" itemCount={2} cardHeight="h-32" />;
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                    {translations.profile.participated[language]}
                </h2>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 flex flex-col h-full shadow-sm">
            <h2 className="text-2xl font-bold mb-3 text-[#8A7060]">
                {translations.profile.participated[language]}
            </h2>

            {participatedEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                    {translations.profile.noEvents[language]}
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-1 items-start">
                        {paginatedItems.map((item) => {
                            const isExpanded = expandedEventId === item.id;
                            
                            if (item.type === "event") {
                                const event = item.data;
                                return (
                                    <div 
                                        key={item.id}
                                        className="border rounded-xl hover:shadow-lg transition cursor-pointer flex flex-col bg-white overflow-hidden h-fit"
                                        onClick={() => setExpandedEventId(isExpanded ? null : item.id)}
                                    >
                                        {/* Event Poster */}
                                        <div className="h-32 w-full bg-gray-100 flex items-center justify-center">
                                            {event.bannerURL ? (
                                                <img 
                                                    src={event.bannerURL} 
                                                    alt={event.bannerAltText || event.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-xs">No Poster</div>
                                            )}
                                        </div>

                                        {/* Event Header */}
                                        <div className="p-3">
                                            <h3 className="text-md font-bold text-[#A64200] line-clamp-2">
                                                {event.title}
                                            </h3>
                                        </div>
                                        
                                        {/* Expanded Details */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 pt-2 border-t animate-fade-in text-sm text-gray-700" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-3">
                                                    {event.date && (
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    {event.description && (
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-xs">Description</h4>
                                                            <p className="text-xs mt-0.5 leading-relaxed">{event.description}</p>
                                                        </div>
                                                    )}
                                                    {event.fullDetails && (
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-xs">Details</h4>
                                                            <p className="whitespace-pre-wrap text-xs mt-0.5 leading-relaxed">{event.fullDetails}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <div>
                                                            <span className="font-bold text-gray-800 text-xs">End Time:</span>
                                                            <p className="text-xs mt-0.5">{event.toDateTime ? new Date(event.toDateTime).toLocaleString() : 'N/A'}</p>
                                                        </div>
                                                        {event.venue && (
                                                            <div>
                                                                <span className="font-bold text-gray-800 text-xs">Venue:</span>
                                                                <p className="text-xs mt-0.5">{event.venue}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {event.eventURL && (
                                                        <div>
                                                            <span className="font-bold text-gray-800 text-xs">Event Website</span>
                                                            <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="block text-[#A64200] hover:underline break-all text-xs mt-0.5">
                                                                {event.eventURL}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {event.agenda && (
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-xs">Agenda</h4>
                                                            <p className="whitespace-pre-wrap text-xs mt-0.5 leading-relaxed">{event.agenda}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            } else {
                                // Multi-day Project Group Card
                                const project = item.data;
                                const daysCount = item.occurrences.length;
                                return (
                                    <div 
                                        key={item.id}
                                        className="border rounded-xl hover:shadow-lg transition cursor-pointer flex flex-col bg-orange-50/10 overflow-hidden h-fit"
                                        onClick={() => setExpandedEventId(isExpanded ? null : item.id)}
                                    >
                                        {/* Project Poster */}
                                        <div className="h-32 w-full bg-gray-100 flex items-center justify-center relative">
                                            {project.bannerURL ? (
                                                <img 
                                                    src={project.bannerURL} 
                                                    alt={project.bannerAltText || project.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-xs">No Poster</div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded shadow-sm">
                                                    Project
                                                </span>
                                            </div>
                                        </div>

                                        {/* Project Header */}
                                        <div className="p-3">
                                            <h3 className="text-md font-bold text-[#A64200] line-clamp-2 relative pr-6">
                                                {project.title}
                                                <sup className="absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-bold text-white bg-orange-600 rounded-full inline-flex items-center justify-center">
                                                    {daysCount}
                                                </sup>
                                            </h3>
                                            <p className="text-[11px] text-gray-500 font-semibold mt-1">
                                                {language === 'en' 
                                                    ? `${translations.profile.participatedFor[language]} ${daysCount} ${translations.profile.daysCount[language]}` 
                                                    : `${daysCount} ${translations.profile.daysCount[language]} ${translations.profile.participatedFor[language]}`
                                                }
                                            </p>
                                        </div>
                                        
                                        {/* Expanded Project Details */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 pt-2 border-t animate-fade-in text-sm text-gray-700" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-3">
                                                    {project.description && (
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-xs">About Project</h4>
                                                            <p className="text-xs mt-0.5 leading-relaxed">{project.description}</p>
                                                        </div>
                                                    )}
                                                    {project.fullDetails && (
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-xs">Details</h4>
                                                            <p className="whitespace-pre-wrap text-xs mt-0.5 leading-relaxed">{project.fullDetails}</p>
                                                        </div>
                                                    )}
                                                    {project.venue && (
                                                        <div>
                                                            <span className="font-bold text-gray-800 text-xs">Venue:</span>
                                                            <p className="text-xs mt-0.5">{project.venue}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Attended Occurrences List */}
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-gray-800 text-xs">Attended Days:</span>
                                                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                                                            {item.occurrences.map((occ, idx) => (
                                                                <div key={occ.id} className="text-xs text-gray-600 flex flex-col bg-gray-50 p-1.5 rounded border border-gray-100">
                                                                    <span className="font-semibold text-gray-700">
                                                                        Day {idx + 1}: {new Date(occ.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", weekday: "short" })}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
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
                        <div className="flex items-center justify-between border-t pt-3 mt-auto">
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
    );
};

export default ParticipatedEventsSection;

