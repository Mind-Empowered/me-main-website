import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../services/supabase-client";
import { FaEdit, FaTrash, FaSpinner, FaTimes, FaUser, FaSearch, FaDownload, FaFilter } from "react-icons/fa";
import { AdminListSkeleton } from "../../components/adminDashboard/AdminSkeletons";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import toast from "react-hot-toast";
import { logActivity } from "../../services/activityLog";
import EditProfileModal from "../../components/profile/EditProfileModal";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState(""); // eventID or ""

  // Pagination State
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0); // reset to first page on new search
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Reset page when event filter changes
  useEffect(() => {
    setPage(0);
  }, [selectedEventFilter]);

  // Fetch all events for the filter dropdown (once)
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .schema("me_dataspace")
        .from("events")
        .select("eventID, title")
        .order("fromDateTime", { ascending: false });
      setAllEvents(data || []);
    };
    fetchEvents();
  }, []);

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fromIndex = page * PAGE_SIZE;
      const toIndex = fromIndex + PAGE_SIZE - 1;

      // If filtering by event, we need to fetch volunteer IDs from participations first
      let allowedVolunteerIds = null;
      if (selectedEventFilter) {
        const { data: parts } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .select("participant_id")
          .eq("event_id", selectedEventFilter);
        allowedVolunteerIds = [...new Set((parts || []).map(p => p.participant_id))];
        if (allowedVolunteerIds.length === 0) {
          setVolunteers([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
      }

      // Build main query
      let query = supabase
        .schema("me_dataspace")
        .from("users")
        .select("*", { count: "exact" })
        .eq("role", "VOLUNTEER")
        .order("created_at", { ascending: false })
        .range(fromIndex, toIndex);

      if (debouncedSearch.trim()) {
        query = query.or(
          `firstName.ilike.%${debouncedSearch.trim()}%,lastName.ilike.%${debouncedSearch.trim()}%,emailID.ilike.%${debouncedSearch.trim()}%`
        );
      }

      if (allowedVolunteerIds) {
        query = query.in("userID", allowedVolunteerIds);
      }

      const { data: volunteersData, error: volunteersError, count } = await query;

      if (count !== null) setTotalCount(count);
      if (volunteersError) throw volunteersError;

      if (!volunteersData || volunteersData.length === 0) {
        setVolunteers([]);
        setLoading(false);
        return;
      }

      const volunteerIds = volunteersData.map(v => v.userID);

      const { data: participationsData, error: participationsError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("participant_id, event_id")
        .in("participant_id", volunteerIds)
        .eq("registered_as", "attended");

      if (participationsError) throw participationsError;

      const eventIds = [...new Set((participationsData || []).map(p => p.event_id))];
      let eventsMap = new Map();
      if (eventIds.length > 0) {
        const { data: eventsData } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("eventID, title")
          .in("eventID", eventIds);
        (eventsData || []).forEach(e => eventsMap.set(e.eventID, e.title));
      }

      const volunteersWithEvents = volunteersData.map((volunteer) => {
        const myParticipations = (participationsData || []).filter(p => p.participant_id === volunteer.userID);
        const myEvents = myParticipations.map(p => eventsMap.get(p.event_id)).filter(Boolean);
        return { ...volunteer, events: myEvents };
      });

      setVolunteers(volunteersWithEvents);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setError(err.message || "Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedEventFilter]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const fromIndex = page * PAGE_SIZE;
  const toIndex = fromIndex + PAGE_SIZE - 1;

  // ─── CSV Export ────────────────────────────────────────────────────────────
  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      // Fetch all matching volunteers (no pagination limit for export)
      let allowedVolunteerIds = null;
      if (selectedEventFilter) {
        const { data: parts } = await supabase
          .schema("me_dataspace")
          .from("event_participation")
          .select("participant_id")
          .eq("event_id", selectedEventFilter);
        allowedVolunteerIds = [...new Set((parts || []).map(p => p.participant_id))];
      }

       let query = supabase
        .schema("me_dataspace")
        .from("users")
        .select("firstName, lastName, emailID, city, state, country, bloodGroup, dateOfBirth, created_at, preferences, address, emergencyInfo")
        .eq("role", "VOLUNTEER")
        .order("created_at", { ascending: false });

      if (debouncedSearch.trim()) {
        query = query.or(
          `firstName.ilike.%${debouncedSearch.trim()}%,lastName.ilike.%${debouncedSearch.trim()}%,emailID.ilike.%${debouncedSearch.trim()}%`
        );
      }
      if (allowedVolunteerIds) {
        query = query.in("userID", allowedVolunteerIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      const eventTitle = selectedEventFilter
        ? allEvents.find(e => e.eventID === selectedEventFilter)?.title || "event"
        : "all";

      const headers = ["First Name", "Last Name", "Email", "City", "State", "Country", "Blood Group", "Date of Birth", "Gender", "WhatsApp", "Volunteer Skills", "Joined On"];
      const rows = (data || []).map(v => [
        v.firstName || "",
        v.lastName || "",
        v.emailID || "",
        v.city || v.address?.permanentAddress?.city || v.address?.presentAddress?.city || "",
        v.state || v.address?.permanentAddress?.state || v.address?.presentAddress?.state || "",
        v.country || v.address?.permanentAddress?.country || v.address?.presentAddress?.country || "",
        v.bloodGroup || v.emergencyInfo?.bloodGroup || "",
        v.dateOfBirth || "",
        v.preferences?.gender || "",
        v.preferences?.whatsapp || "",
        v.preferences?.skills ? v.preferences.skills.join("; ") : "",
        v.created_at ? new Date(v.created_at).toLocaleDateString("en-GB") : "",
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `volunteers_${eventTitle.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${rows.length} volunteers`);
    } catch (err) {
      toast.error("Export failed: " + err.message);
    } finally {
      setExportLoading(false);
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("users")
        .delete()
        .eq("userID", confirmDeleteId);
      if (error) throw error;
      toast.success("Volunteer deleted successfully");
      await logActivity({ action: 'DELETE_VOLUNTEER', description: `Deleted volunteer ${editingVolunteer?.firstName || confirmDeleteId}`, entity_type: 'volunteer', entity_id: confirmDeleteId });
      fetchVolunteers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete volunteer: " + err.message);
    }
    setConfirmDeleteId(null);
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setShowEditModal(true);
  };

  const toggleRow = (id) => setExpandedRowId(expandedRowId === id ? null : id);

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingVolunteer(null);
  };

  const handleUserUpdated = () => {
    fetchVolunteers();
  };

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">

      {/* ─── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40 shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaTimes size={12} />
            </button>
          )}
        </div>

        {/* Event Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <select
            value={selectedEventFilter}
            onChange={e => setSelectedEventFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1622A]/40 shadow-sm appearance-none min-w-[200px] text-gray-700"
          >
            <option value="">All Events</option>
            {allEvents.map(ev => (
              <option key={ev.eventID} value={ev.eventID}>{ev.title}</option>
            ))}
          </select>
        </div>

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          disabled={exportLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C1622A] text-white rounded-xl text-sm font-semibold hover:bg-[#a8521f] transition disabled:opacity-60 shadow-sm"
        >
          {exportLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaDownload size={14} />}
          Export CSV
        </button>
      </div>

      {/* Count label */}
      <p className="text-sm text-gray-500 mb-3">
        {loading ? "Loading..." : `Showing ${totalCount === 0 ? 0 : fromIndex + 1}–${Math.min(toIndex + 1, totalCount)} of ${totalCount} volunteers`}
        {selectedEventFilter && (
          <span className="ml-2 text-[#C1622A] font-medium">
            · Filtered by: {allEvents.find(e => e.eventID === selectedEventFilter)?.title}
          </span>
        )}
      </p>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading volunteers</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchVolunteers} className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Retry</button>
        </div>
      )}

      {/* Loading State */}
      {loading && <div className="mt-4"><AdminListSkeleton rows={5} /></div>}

      {/* Empty State */}
      {!loading && volunteers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-lg">No volunteers found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery || selectedEventFilter ? "Try adjusting your search or filter." : "Volunteers will appear here once they register."}
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && volunteers.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-4 bg-[#EFE7DD] text-[#6B4B2A] text-sm font-semibold p-4">
            <p>Member</p>
            <p>Email</p>
            <p>Events Attended</p>
            <p className="text-center">Actions</p>
          </div>

          <div className="overflow-auto max-h-[80vh]">
            {volunteers.map((volunteer) => (
              <div key={volunteer.userID} className="border-t border-gray-100 flex flex-col">
                <div 
                  className="flex flex-col sm:flex-row sm:items-center lg:grid lg:grid-cols-4 lg:items-center p-4 gap-3 lg:gap-4 cursor-pointer hover:bg-gray-50 transition" 
                  onClick={() => toggleRow(volunteer.userID)}
                >
                  <div className="flex items-center justify-between sm:justify-start gap-3 min-w-0 flex-1 lg:flex-none">
                    <div className="flex items-center gap-3 min-w-0">
                      {volunteer.photo ? (
                        <img src={volunteer.photo} alt="profile" className="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy" decoding="async" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><FaUser className="text-gray-400" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold lg:font-medium text-gray-700 truncate">{volunteer.firstName} {volunteer.lastName}</p>
                        <p className="text-gray-400 text-xs lg:hidden truncate mt-0.5">{volunteer.emailID}</p>
                      </div>
                    </div>
                    {/* Mobile Actions */}
                    <div className="flex sm:hidden items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(volunteer); }} className="border p-2 rounded-xl hover:bg-blue-100 transition text-blue-600 bg-white" title="Edit"><FaEdit size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(volunteer.userID); }} className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition" title="Delete"><FaTrash size={14} /></button>
                    </div>
                  </div>
                  <p className="hidden lg:block text-gray-600 text-sm truncate">{volunteer.emailID}</p>
                  <div className="flex flex-wrap gap-2 lg:pl-0 mt-1 sm:mt-0">
                    {volunteer.events && volunteer.events.length > 0 ? (
                      volunteer.events.map((event, index) => (
                        <span key={index} className="bg-orange-100 text-[#B86B2B] px-2 py-0.5 rounded-full text-xs font-semibold">{event}</span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs lg:text-sm">No events attended</span>
                    )}
                  </div>
                  <div className="hidden sm:flex items-center lg:justify-center gap-3 mt-1 sm:mt-0">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(volunteer); }} className="border p-2.5 lg:p-2 rounded-xl lg:rounded-lg hover:bg-blue-100 transition text-blue-600 bg-white" title="Edit"><FaEdit size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(volunteer.userID); }} className="bg-red-50 text-red-600 p-2.5 lg:p-2 rounded-xl lg:rounded-lg hover:bg-red-100 transition" title="Delete"><FaTrash size={14} /></button>
                  </div>
                </div>

                {expandedRowId === volunteer.userID && (
                  <div className="bg-[#FAF7F2] p-6 border-t border-gray-100 text-sm animate-fade-in shadow-inner">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">About</h4>
                        <p className="text-gray-800 leading-relaxed">{volunteer.bio || "No bio provided."}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">Details</h4>
                        <p className="text-gray-800 mb-1">
                          <span className="font-medium">Location:</span>{" "}
                          {[
                            volunteer.city || volunteer.address?.permanentAddress?.city || volunteer.address?.presentAddress?.city,
                            volunteer.state || volunteer.address?.permanentAddress?.state || volunteer.address?.presentAddress?.state,
                            volunteer.country || volunteer.address?.permanentAddress?.country || volunteer.address?.presentAddress?.country
                          ].filter(Boolean).join(", ") || "Not specified"}
                        </p>
                        {volunteer.preferences?.gender && <p className="text-gray-800 mb-1"><span className="font-medium">Gender:</span> {volunteer.preferences.gender}</p>}
                        {volunteer.preferences?.whatsapp && <p className="text-gray-800 mb-1"><span className="font-medium">WhatsApp:</span> {volunteer.preferences.whatsapp}</p>}
                        {volunteer.preferences?.languages?.length > 0 && <p className="text-gray-800 mb-1"><span className="font-medium">Languages:</span> {volunteer.preferences.languages.join(", ")}</p>}
                        {volunteer.preferences?.skills?.length > 0 && <p className="text-gray-800 mt-2"><span className="font-medium">Skills:</span> {volunteer.preferences.skills.join(", ")}</p>}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">Vital Info</h4>
                        <p className="text-gray-800 mb-1">
                          <span className="font-medium">Blood Group:</span>{" "}
                          {volunteer.bloodGroup || volunteer.emergencyInfo?.bloodGroup || "N/A"}
                        </p>
                        <p className="text-gray-800 mb-1"><span className="font-medium">DOB:</span> {volunteer.dateOfBirth || "N/A"}</p>
                        {volunteer.emergencyInfo && (
                          <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-red-800 font-semibold mb-1 text-xs uppercase">Emergency Contact</p>
                            <p className="text-red-900 font-medium">{volunteer.emergencyInfo.contactName || "N/A"}</p>
                            <p className="text-red-700">{volunteer.emergencyInfo.contactPhone || volunteer.emergencyInfo.contactNumber || "N/A"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > PAGE_SIZE && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-500">Page {page + 1} of {Math.ceil(totalCount / PAGE_SIZE)}</span>
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition bg-gray-50 text-gray-700 font-medium flex-1 sm:flex-none text-center">Previous</button>
                <button disabled={(page + 1) * PAGE_SIZE >= totalCount} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition bg-gray-50 text-gray-700 font-medium flex-1 sm:flex-none text-center">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <EditProfileModal
        user={editingVolunteer}
        isOpen={showEditModal && !!editingVolunteer}
        onClose={closeEditModal}
        onUserUpdate={handleUserUpdated}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Delete Volunteer?"
        message="Are you sure you want to delete this volunteer? Their attendance records will also be removed."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Volunteers;
