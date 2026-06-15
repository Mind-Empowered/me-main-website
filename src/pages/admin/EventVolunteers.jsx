import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import {
  FaSpinner,
  FaArrowLeft,
  FaUsers,
  FaClock,
  FaCheck,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { logActivity } from "../../services/activityLog";
import { sendNotification } from "../../services/notificationService";

const EventVolunteers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Event metadata state
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);

  // Volunteers states
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);
  const [attendanceUpdating, setAttendanceUpdating] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("All"); // All, Attended, Registered

  // Walk-in states
  const [showWalkinPanel, setShowWalkinPanel] = useState(false);
  const [walkinSearch, setWalkinSearch] = useState("");
  const [walkinResults, setWalkinResults] = useState([]);
  const [walkinLoading, setWalkinLoading] = useState(false);
  const [walkinAdding, setWalkinAdding] = useState({});

  useEffect(() => {
    fetchEventDetails();
    fetchVolunteers();
  }, [id]);

  const fetchEventDetails = async () => {
    setEventLoading(true);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .select("*")
        .eq("eventID", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      toast.error("Failed to load event details");
    } finally {
      setEventLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    setVolunteersLoading(true);
    try {
      const { data: participations, error: pErr } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id, participant_id, created_at, registered_as")
        .eq("event_id", id)
        .in("registered_as", ["registered", "volunteer", "attended", "cancelled"]);

      if (pErr) throw pErr;

      if (!participations?.length) {
        setRegisteredVolunteers([]);
        return;
      }

      const userIDs = participations.map((p) => p.participant_id);
      const { data: users, error: uErr } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID, firstName, lastName, emailID, photo, preferences")
        .in("userID", userIDs);

      if (uErr) throw uErr;

      const mappedVolunteers = participations.map((p) => {
        const user = (users || []).find((u) => u.userID === p.participant_id);
        
        // Find cancellation reason if applicable
        let cancelReason = null;
        if (p.registered_as === "cancelled" && user?.preferences?.cancellationHistory) {
          const historyEntry = user.preferences.cancellationHistory.find(h => String(h.eventId) === String(id));
          if (historyEntry) {
            cancelReason = historyEntry.reason;
          }
        }

        return {
          participationId: p.id,
          registeredAt: p.created_at,
          registeredAs: p.registered_as,
          attended: p.registered_as === "attended",
          cancelled: p.registered_as === "cancelled",
          cancelReason,
          ...(user || { firstName: "Unknown", lastName: "", emailID: "—", userID: p.participant_id }),
        };
      });

      setRegisteredVolunteers(mappedVolunteers);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      toast.error("Failed to load volunteer list");
    } finally {
      setVolunteersLoading(false);
    }
  };

  const handleToggleAttendance = async (participationId, currentlyAttended, volName) => {
    setAttendanceUpdating((prev) => ({ ...prev, [participationId]: true }));
    const newStatus = currentlyAttended ? "registered" : "attended";
    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .update({ registered_as: newStatus })
        .eq("id", participationId);

      if (error) throw error;

      setRegisteredVolunteers((prev) =>
        prev.map((v) =>
          v.participationId === participationId
            ? { ...v, attended: !currentlyAttended, registeredAs: newStatus }
            : v
        )
      );

      toast.success(
        currentlyAttended
          ? `Marked ${volName} as registered (not attended)`
          : `Marked ${volName} as attended!`
      );

      await logActivity({
        action: 'TOGGLE_ATTENDANCE',
        description: `Marked volunteer ${volName} as ${newStatus} for event: ${event?.title || id}`,
        entity_type: 'event',
        entity_id: id,
      });
    } catch (err) {
      console.error("Error updating attendance:", err);
      toast.error("Failed to update attendance status");
    } finally {
      setAttendanceUpdating((prev) => ({ ...prev, [participationId]: false }));
    }
  };

  const handleWalkinSearch = async (query) => {
    setWalkinSearch(query);
    if (!query.trim() || query.trim().length < 2) {
      setWalkinResults([]);
      return;
    }
    setWalkinLoading(true);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID, firstName, lastName, emailID, photo")
        .eq("role", "VOLUNTEER")
        .or(`firstName.ilike.%${query}%,lastName.ilike.%${query}%,emailID.ilike.%${query}%`)
        .limit(8);

      if (error) throw error;

      // Exclude volunteers already registered
      const registeredIds = new Set(registeredVolunteers.map((v) => v.userID));
      const filtered = (data || []).filter((u) => !registeredIds.has(u.userID));
      setWalkinResults(filtered);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed");
    } finally {
      setWalkinLoading(false);
    }
  };

  const handleAddWalkin = async (volunteer) => {
    setWalkinAdding((prev) => ({ ...prev, [volunteer.userID]: true }));
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .insert({
          event_id: id,
          participant_id: volunteer.userID,
          registered_as: "attended",
        })
        .select("id, created_at")
        .single();

      if (error) throw error;

      // Add to registered list immediately
      const newVol = {
        participationId: data.id,
        registeredAt: data.created_at,
        registeredAs: "attended",
        attended: true,
        userID: volunteer.userID,
        firstName: volunteer.firstName,
        lastName: volunteer.lastName,
        emailID: volunteer.emailID,
        photo: volunteer.photo,
      };

      setRegisteredVolunteers((prev) => [...prev, newVol]);
      setWalkinResults((prev) => prev.filter((v) => v.userID !== volunteer.userID));
      toast.success(`${volunteer.firstName} ${volunteer.lastName} added and marked attended!`);

      // Send a notification to all volunteers
      try {
        await sendNotification({
          title: "New Event Registration",
          body: `${volunteer.firstName} ${volunteer.lastName} has registered as a volunteer for ${event?.title || "event"}.`,
          type: "broadcast",
          priority: "normal",
          target: "all",
          metadata: {
            eventID: id,
            volunteerName: `${volunteer.firstName} ${volunteer.lastName}`
          },
          createdBy: "admin"
        });
      } catch (notifErr) {
        console.error("Failed to send walk-in notification:", notifErr);
      }

      await logActivity({
        action: 'ADD_WALKIN',
        description: `Added walk-in volunteer ${volunteer.firstName} ${volunteer.lastName} as attended for event: ${event?.title || id}`,
        entity_type: 'event',
        entity_id: id,
      });
    } catch (err) {
      if (err.code === "23505") {
        toast.error("This volunteer is already registered.");
      } else {
        console.error("Failed to add walk-in:", err);
        toast.error("Failed to add volunteer");
      }
    } finally {
      setWalkinAdding((prev) => ({ ...prev, [volunteer.userID]: false }));
    }
  };

  const getStatus = (from, to) => {
    const now = new Date();
    if (new Date(from) > now) return "Upcoming";
    if (new Date(from) <= now && new Date(to) >= now) return "Ongoing";
    return "Completed";
  };

  // Filter and search logic
  const filteredVolunteers = registeredVolunteers.filter((v) => {
    // Search filter
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.firstName.toLowerCase().includes(q) ||
      v.lastName.toLowerCase().includes(q) ||
      v.emailID.toLowerCase().includes(q);

    // Tab filter
    if (!matchesSearch) return false;
    if (filterTab === "Attended") return v.attended && !v.cancelled;
    if (filterTab === "Registered") return !v.attended && !v.cancelled;
    if (filterTab === "Cancelled") return v.cancelled;
    return true;
  });

  // Stats
  const totalCount = registeredVolunteers.filter((v) => !v.cancelled).length;
  const attendedCount = registeredVolunteers.filter((v) => v.attended).length;
  const registeredOnlyCount = totalCount - attendedCount;
  const cancelledCount = registeredVolunteers.filter((v) => v.cancelled).length;

  const isEventFuture = (() => {
    if (!event) return true;
    const eventDate = new Date(event.fromDateTime);
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate > today;
  })();

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {/* Back to Events Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm mb-6 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-sm"
      >
        <FaArrowLeft size={12} />
        Back
      </button>

      {/* Header Panel */}
      {eventLoading ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-[#C1622A] text-2xl" />
        </div>
      ) : event ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
          {event.bannerURL && (
            <div className="w-full h-32 md:h-48 overflow-hidden relative">
              <img
                src={event.bannerURL}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <span className="text-[10px] font-bold bg-[#C1622A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {event.is_project ? "Project Occurence" : "Standard Event"}
                </span>
                <h1 className="text-xl md:text-2xl font-bold mt-1">{event.title}</h1>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {!event.bannerURL && (
              <div className="mb-4">
                <span className="text-[10px] font-bold bg-[#C1622A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {event.is_project ? "Project Occurence" : "Standard Event"}
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{event.title}</h1>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(event.fromDateTime).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Time</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(event.fromDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                    {new Date(event.toDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase">Venue</p>
                  <p className="font-semibold text-gray-800 truncate max-w-[200px]" title={event.venue}>
                    {event.venue || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 text-center">
          <p className="text-gray-500">Event details could not be found.</p>
        </div>
      )}

      {/* Grid: 2 columns (Registered list on left/right, Walk-in on other) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Volunteer Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats & Filters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 text-[#C1622A] px-4 py-2 rounded-xl border border-orange-100 flex flex-col items-center">
                <span className="text-2xl font-bold">{totalCount}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total</span>
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 flex flex-col items-center">
                <span className="text-2xl font-bold">{attendedCount}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Attended</span>
              </div>
              <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 flex flex-col items-center">
                <span className="text-2xl font-bold">{registeredOnlyCount}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Registered</span>
              </div>
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-100 flex flex-col items-center">
                <span className="text-2xl font-bold">{cancelledCount}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cancelled</span>
              </div>
            </div>

            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl flex-wrap justify-center sm:justify-start">
              {["All", "Attended", "Registered", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filterTab === tab
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Volunteer List */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search registered volunteers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 min-h-[300px]">
              {volunteersLoading ? (
                <div className="flex justify-center items-center py-20">
                  <FaSpinner className="animate-spin text-[#C1622A] text-2xl" />
                </div>
              ) : filteredVolunteers.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-base font-semibold">No volunteers found</p>
                  <p className="text-xs mt-1">
                    {searchQuery ? "Try refining your search terms." : "No registrations for this occurrence yet."}
                  </p>
                </div>
              ) : (
                filteredVolunteers.map((vol) => (
                  <div
                    key={vol.participationId}
                    className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {vol.photo ? (
                        <img
                          src={vol.photo}
                          alt={vol.firstName}
                          className="w-11 h-11 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-orange-100 text-[#C1622A] flex items-center justify-center font-bold text-sm uppercase border border-orange-200">
                          {vol.firstName[0]}
                          {vol.lastName ? vol.lastName[0] : ""}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm truncate">
                          {vol.firstName} {vol.lastName}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">{vol.emailID}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Registered: {new Date(vol.registeredAt).toLocaleDateString()}
                        </p>
                        {vol.cancelled && vol.cancelReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded border border-red-100 text-xs text-red-800">
                            <span className="font-bold">Reason for cancellation:</span> {vol.cancelReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {vol.cancelled ? (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-lg border border-red-200">
                          Cancelled
                        </span>
                      ) : attendanceUpdating[vol.participationId] ? (
                        <span className="text-xs text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          <FaSpinner className="animate-spin text-orange-500" size={10} />
                          Saving...
                        </span>
                      ) : (
                        <button
                          disabled={isEventFuture}
                          onClick={() =>
                            handleToggleAttendance(
                              vol.participationId,
                              vol.attended,
                              `${vol.firstName} ${vol.lastName}`
                            )
                          }
                          title={isEventFuture ? "Attendance can only be marked on or after the event date" : ""}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            isEventFuture
                              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                              : vol.attended
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <FaCheck size={10} className={vol.attended ? "text-green-600" : "opacity-30"} />
                          {vol.attended ? "Attended" : "Mark Attended"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Walk-in Addition Sidebar Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FaUserPlus className="text-[#C1622A]" />
              Add Walk-in
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Register a volunteer who showed up at the venue without prior online registration. They will be marked as "Attended" immediately.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={walkinSearch}
                  onChange={(e) => handleWalkinSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C1622A]"
                />
              </div>

              {walkinLoading && (
                <div className="flex justify-center py-4">
                  <FaSpinner className="animate-spin text-[#C1622A]" />
                </div>
              )}

              {!walkinLoading && walkinSearch.length >= 2 && walkinResults.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No unregistered volunteers found.
                </p>
              )}

              {walkinResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {walkinResults.map((u) => (
                    <div
                      key={u.userID}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {u.photo ? (
                          <img
                            src={u.photo}
                            alt={u.firstName}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#C1622A] flex items-center justify-center text-xs font-bold uppercase">
                            {u.firstName[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">{u.emailID}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddWalkin(u)}
                        disabled={walkinAdding[u.userID] || isEventFuture}
                        title={isEventFuture ? "Walk-ins can only be added on or after the event date" : ""}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 border ${
                          isEventFuture
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                            : "bg-[#C1622A] hover:bg-[#a8521f] text-white border-transparent disabled:opacity-50"
                        }`}
                      >
                        {walkinAdding[u.userID] ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventVolunteers;
