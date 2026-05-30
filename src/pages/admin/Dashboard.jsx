import { useNavigate } from "react-router-dom";
import {
  FaCalendarPlus,
  FaImage,
  FaUserPlus,
  FaPaperPlane,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaSyncAlt,
  FaMapMarkerAlt,
  FaUtensils,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import UploadPhotoModal from "../../components/adminDashboard/UploadPhotoModal";
import AddVolunteerModal from "../../components/adminDashboard/AddVolunteerModal";
import { AdminListSkeleton, AdminStatsSkeleton } from "../../components/adminDashboard/AdminSkeletons";

const Dashboard = () => {
  const quickActions = [
    { label: "Add Event", icon: FaCalendarPlus, path: "/admin/newevent" },
    { label: "Upload Photo", icon: FaImage, action: () => setShowUpload(true) },
    {
      label: "Add Volunteer",
      icon: FaUserPlus,
      action: () => setShowAddVolunteer(true),
    },
    { label: "Send Newsletter", icon: FaPaperPlane, path: "/admin/newsletter" },
  ];

  const navigate = useNavigate();

  const [showUpload, setShowUpload] = useState(false);
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [volunteerCount, setVolunteerCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [newThisWeek, setNewThisWeek] = useState(0);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    
    // Convert local today to UTC for Supabase query
    const now = new Date();
    const startOfTodayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const today = startOfTodayLocal.toISOString(); 

    // date one week ago
    const oneWeekAgoLocal = new Date(startOfTodayLocal);
    oneWeekAgoLocal.setDate(oneWeekAgoLocal.getDate() - 7);
    const oneWeekAgo = oneWeekAgoLocal.toISOString();
    
    // start of the year
    const startOfYearLocal = new Date(now.getFullYear(), 0, 1);
    const startOfYear = startOfYearLocal.toISOString();

    try {
      const [
        { count: volunteers },
        { count: eventscount },
        { count: weeklyNew },
        { count: upcoming },
        { data: events },
        { count: registrations },
      ] = await Promise.all([
        supabase
          .schema("me_dataspace")
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "VOLUNTEER"),
        
        supabase
          .schema("me_dataspace")
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("fromDateTime", startOfYear),
          
        supabase
          .schema("me_dataspace")
          .from("users")
          .select("*", { count: "exact", head: true })
          .gte("created_at", oneWeekAgo),
          
        supabase
          .schema("me_dataspace")
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("fromDateTime", today),
          
        supabase
          .schema("me_dataspace")
          .from("events")
          // .select(" admin_status")  implement status
          .select("eventID, title, fromDateTime, toDateTime, bannerURL, max_participants, max_volunteers, is_food_available, description, venue, venue_url")
          .gte("fromDateTime", today)
          .order("fromDateTime", { ascending: true })
          .limit(6),

        supabase
          .schema("me_dataspace")
          .from("event_participation")
          .select("*", { count: "exact", head: true }),
      ]);

      setVolunteerCount(volunteers || 0);
      setEventCount(eventscount || 0);
      setNewThisWeek(weeklyNew || 0);
      setUpcomingEventsCount(upcoming || 0);
      setUpcomingEvents(events || []);
      setTotalRegistrations(registrations || 0);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    fetchStats().finally(() => setIsLoading(false));
  }, []);



  return (
    <>
      <div className="p-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {quickActions.map(({ label, icon: Icon, path, action }) => (
            <button
              key={label}
              onClick={action || (() => navigate(path))}
              className="bg-white rounded-xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition text-center"
            >
              <div className="bg-[#C1622A] text-white p-3 rounded-lg">
                <Icon size={20} />
              </div>
              <span className="text-sm text-gray-600">{label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h3 className="font-semibold text-gray-600 text-sm">Dashboard Overview</h3>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-gray-400">
                Last updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => fetchStats().finally(() => setIsLoading(false))}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-[#C1622A] hover:text-[#C1622A] transition disabled:opacity-50 shadow-sm"
            >
              <FaSyncAlt className={isLoading ? 'animate-spin' : ''} size={12} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        {isLoading ? (
          <div className="mb-6">
            <AdminStatsSkeleton cards={2} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Volunteers</p>
                <h2 className="text-4xl font-bold text-gray-800">{volunteerCount}</h2>
                <p className="text-green-600 text-xs mt-2">▲ {newThisWeek} joined this week</p>
              </div>
              <FaUsers className="text-[#C1622A] text-2xl opacity-40" />
            </div>
            <div className="bg-white rounded-xl p-5 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Events This Year</p>
                <h2 className="text-4xl font-bold text-gray-800">{eventCount}</h2>
                <p className="text-green-600 text-xs mt-2">▲ {upcomingEventsCount} upcoming</p>
              </div>
              <FaCalendarAlt className="text-[#C1622A] text-2xl opacity-40" />
            </div>
            <div className="bg-white rounded-xl p-5 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Registrations</p>
                <h2 className="text-4xl font-bold text-gray-800">{totalRegistrations}</h2>
                <p className="text-blue-500 text-xs mt-2">across all events</p>
              </div>
              <FaClipboardList className="text-[#C1622A] text-2xl opacity-40" />
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-5 ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Upcoming Events</h3>
          </div>
          {isLoading ? (
            <AdminListSkeleton rows={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => {
                const isExpanded = expandedEventId === event.eventID;
                const statusColors = {
                  Draft: "bg-gray-100 text-gray-600 border-gray-200",
                  Published: "bg-green-50 text-green-700 border-green-200",
                  Completed: "bg-blue-50 text-blue-700 border-blue-200",
                  Cancelled: "bg-red-50 text-red-700 border-red-200",
                  Postponed: "bg-orange-50 text-orange-700 border-orange-200",
                };
                const statusClass = statusColors[event.admin_status] || "bg-gray-100 text-gray-600 border-gray-200";

                return (
                  <div
                    key={event.eventID}
                    onClick={() => setExpandedEventId(isExpanded ? null : event.eventID)}
                    className={`flex flex-col border border-gray-200 hover:border-[#C1622A]/50 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                      isExpanded ? "ring-1 ring-[#C1622A]/30 border-[#C1622A]/40" : ""
                    }`}
                  >
                    {/* Top Row: Image & Primary Info */}
                    <div className="flex items-start gap-4">
                      {event.bannerURL ? (
                        <img
                          src={event.bannerURL}
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-100 shadow-sm"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#F7F2EC] rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                          <FaCalendarAlt className="text-[#C1622A]/40 text-xl" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-6 relative">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                          <FaClock className="text-gray-400" size={12} />
                          <span>
                            {new Date(event.fromDateTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                            {" at "}
                            {new Date(event.fromDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                        
                        {/* Chevron Expand Indicator */}
                        <div className="absolute right-0 top-1 text-gray-400 hover:text-[#C1622A] transition-colors">
                          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content Area */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}>
                      {/* Separator */}
                      <hr className="border-gray-100 mb-4" />

                      {/* Detail Rows */}
                      <div className="space-y-3.5 text-xs text-gray-600">
                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 items-center">
                          {event.admin_status && (
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusClass}`}>
                              {event.admin_status}
                            </span>
                          )}
                          {event.is_food_available && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-200 bg-orange-50 text-orange-700 flex items-center gap-1">
                              <FaUtensils size={9} /> Food Available
                            </span>
                          )}
                        </div>

                        {/* Date Range Detail */}
                        <div className="flex items-start gap-2.5">
                          <FaClock className="text-[#C1622A] mt-0.5 flex-shrink-0" size={13} />
                          <div>
                            <p className="font-semibold text-gray-700 font-sans">Date & Time</p>
                            <p className="text-gray-500 mt-0.5">
                              <span className="font-medium text-gray-600">Starts:</span>{" "}
                              {new Date(event.fromDateTime).toLocaleString("en-GB", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                            {event.toDateTime && (
                              <p className="text-gray-500 mt-0.5">
                                <span className="font-medium text-gray-600">Ends:</span>{" "}
                                {new Date(event.toDateTime).toLocaleString("en-GB", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Location Detail */}
                        {event.venue && (
                          <div className="flex items-start gap-2.5">
                            <FaMapMarkerAlt className="text-[#C1622A] mt-0.5 flex-shrink-0" size={13} />
                            <div>
                              <p className="font-semibold text-gray-700 font-sans">Location</p>
                              <p className="text-gray-500 mt-0.5">{event.venue}</p>
                              {event.venue_url && (
                                <a
                                  href={event.venue_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[#C1622A] hover:underline font-medium inline-block mt-1"
                                >
                                  View on Google Maps →
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Capacity Details */}
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <div>
                            <p className="font-semibold text-gray-500 text-[10px] uppercase">Max Volunteers</p>
                            <p className="font-bold text-gray-800 text-sm mt-0.5">{event.max_volunteers || "No limit"}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 text-[10px] uppercase">Max Participants</p>
                            <p className="font-bold text-gray-800 text-sm mt-0.5">{event.max_participants || "No limit"}</p>
                          </div>
                        </div>

                        {/* Description Detail */}
                        {event.description && (
                          <div className="flex items-start gap-2.5 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#C1622A]/10">
                            <FaInfoCircle className="text-[#C1622A] mt-0.5 flex-shrink-0" size={13} />
                            <div>
                              <p className="font-semibold text-gray-700 font-sans">About Event</p>
                              <p className="text-gray-600 mt-1 leading-relaxed text-[11px] whitespace-pre-line">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Photo upload modal */}
        {showUpload && (
          <UploadPhotoModal
            onClose={() => setShowUpload(false)}
            onSuccess={() => console.log("uploaded!")}
          />
        )}
        {/* Add Volunteer Modal */}
        {showAddVolunteer && (
          <AddVolunteerModal
            onClose={() => setShowAddVolunteer(false)}
            onSuccess={() => {
              setShowAddVolunteer(false);
              fetchStats(); // refresh volunteer count
            }}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;
