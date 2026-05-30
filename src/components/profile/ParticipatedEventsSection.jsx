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
                    .select("eventID, title, description, fromDateTime, toDateTime, venue, eventURL, agenda, bannerURL, bannerAltText")
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
                        venue: event?.venue || null,
                        eventURL: event?.eventURL || null,
                        agenda: event?.agenda || null,
                        bannerURL: event?.bannerURL || null,
                        bannerAltText: event?.bannerAltText || null,
                    };
                });

                // Sort by participated date (most recent first)
                merged.sort(
                    (a, b) =>
                        new Date(b.participatedAt) - new Date(a.participatedAt)
                );

                setParticipatedEvents(merged);
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
    const paginatedEvents = participatedEvents.slice(
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
                    {translations.profile.participatedEvents[language]}
                </h2>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-3 text-[#8A7060]">
                {translations.profile.participatedEvents[language]}
            </h2>

            {participatedEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    {translations.profile.noEvents[language]}
                </p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-1 items-start">
                        {paginatedEvents.map((event) => (
                            <div 
                                key={event.id}
                                className="border rounded-xl hover:shadow-lg transition cursor-pointer flex flex-col bg-white overflow-hidden h-fit"
                                onClick={() => setExpandedEventId(expandedEventId === event.id ? null : event.id)}
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
                                {expandedEventId === event.id && (
                                    <div className="px-3 pb-3 pt-2 border-t animate-fade-in text-sm text-gray-700">
                                        <div className="space-y-3">
                                            {event.date && (
                                                <div className="text-xs text-gray-500 font-medium">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                            )}
                                            {event.description && (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-xs">Description</h4>
                                                    <p className="text-xs">{event.description}</p>
                                                </div>
                                            )}
                                            {event.fullDetails && (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-xs">Details</h4>
                                                    <p className="whitespace-pre-wrap text-xs">{event.fullDetails}</p>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <div>
                                                    <span className="font-bold text-gray-800 text-xs">End Time:</span>
                                                    <p className="text-xs">{event.toDateTime ? new Date(event.toDateTime).toLocaleString() : 'N/A'}</p>
                                                </div>
                                                {event.venue && (
                                                    <div>
                                                        <span className="font-bold text-gray-800 text-xs">Venue:</span>
                                                        <p className="text-xs">{event.venue}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {event.eventURL && (
                                                <div>
                                                    <span className="font-bold text-gray-800 text-xs">Event Website</span>
                                                    <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="block text-[#A64200] hover:underline break-all text-xs">
                                                        {event.eventURL}
                                                    </a>
                                                </div>
                                            )}
                                            {event.agenda && (
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-xs">Agenda</h4>
                                                    <p className="whitespace-pre-wrap text-xs">{event.agenda}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center border-t pt-4 mt-auto gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition font-medium ${
                                        currentPage === i 
                                            ? 'bg-[#A64200] text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ParticipatedEventsSection;

