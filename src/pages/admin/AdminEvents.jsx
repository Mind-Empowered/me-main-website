import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import {
  FaSpinner,
  FaTimes,
  FaUsers,
  FaClock,
  FaCheck,
  FaSearch,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import {
  AdminStatsSkeleton,
  AdminTableSkeleton,
} from "../../components/adminDashboard/AdminSkeletons";
import ConfirmModal from "../../components/adminDashboard/ConfirmModal";
import toast from "react-hot-toast";
import { logActivity } from "../../services/activityLog";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [volunteerCounts, setVolunteerCounts] = useState({});
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusUpdating, setStatusUpdating] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const [showVolunteersModal, setShowVolunteersModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [attendanceUpdating, setAttendanceUpdating] = useState({});
  const [volunteerSearchQuery, setVolunteerSearchQuery] = useState("");

  // Walk-in volunteer state
  const [walkinSearch, setWalkinSearch] = useState("");
  const [walkinResults, setWalkinResults] = useState([]);
  const [walkinLoading, setWalkinLoading] = useState(false);
  const [walkinAdding, setWalkinAdding] = useState({});
  const [showWalkinPanel, setShowWalkinPanel] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchVolunteerCounts = async (eventsList) => {
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("event_id")
        .in("registered_as", ["volunteer", "attended"]);
      if (error) throw error;
      const counts = {};
      eventsList.forEach((event) => {
        counts[event.eventID] = (data || []).filter(
          (r) => r.event_id === event.eventID,
        ).length;
      });
      setVolunteerCounts(counts);
    } catch (err) {
      console.error("Error fetching volunteer counts:", err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .select("*")
        .order("fromDateTime", { ascending: true });
      if (error) throw error;

      //  Auto-update completed events
      const now = new Date();
      const updatedEvents = (data || []).map((event) => {
        const isCompleted = new Date(event.toDateTime) < now;
        if (isCompleted && event.status === "published") {
          // Update in DB
          supabase
            .schema("me_dataspace")
            .from("events")
            .update({ status: "completed" })
            .eq("eventID", event.eventID)
            .then(() => {
              logActivity({
                action: "UPDATE_STATUS",
                description: `Auto-marked event as completed: ${event.title}`,
                entity_type: "event",
                entity_id: event.eventID,
              });
            });
          return { ...event, status: "completed" };
        }
        return event;
      });

      setEvents(updatedEvents);
      if (updatedEvents) fetchVolunteerCounts(updatedEvents);
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .delete()
        .eq("eventID", confirmDeleteId);

      if (error) throw error;

      toast.success("Event deleted");
      await logActivity({
        action: "DELETE_EVENT",
        description: `Deleted event`,
        entity_type: "event",
        entity_id: confirmDeleteId,
      });
      setEvents(events.filter((e) => e.eventID !== confirmDeleteId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event: " + err.message);
    }
    setConfirmDeleteId(null);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    const pad = (n) => String(n).padStart(2, "0");
    const toDateStr = (d) =>
      d
        ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
        : "";
    const toTimeStr = (d) =>
      d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "";
    const fromDT = event.fromDateTime ? new Date(event.fromDateTime) : null;
    const toDT = event.toDateTime ? new Date(event.toDateTime) : null;

    // reg_deadline may be a full ISO string or date only
    let reg_deadline = "";
    if (event.reg_deadline) {
      // datetime-local input needs "YYYY-MM-DDTHH:mm"
      const d = new Date(event.reg_deadline);
      reg_deadline = `${toDateStr(d)}T${toTimeStr(d)}`;
    }

    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      agenda: event.agenda || "",
      venues: event.venue
        ? event.venue.split(" | ").map((v, i) => ({
            venue: v,
            mapUrl: (event.venue_url || "").split(" | ")[i] || "",
          }))
        : [{ venue: "", mapUrl: "" }],
      max_participants: event.max_participants ?? "",
      max_volunteers: event.max_volunteers ?? "",
      bannerURL: event.bannerURL || "",
      bannerFile: null,
      reg_deadline,
      fromDate: toDateStr(fromDT),
      fromTime: toTimeStr(fromDT),
      toDate: toDateStr(toDT),
      toTime: toTimeStr(toDT),
      is_food_available: event.is_food_available ?? false,
      eventURL: event.eventURL || "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInput = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleEditVenueChange = (index, field, value) => {
    const updated = [...editFormData.venues];
    updated[index][field] = value;
    setEditFormData((p) => ({ ...p, venues: updated }));
  };

  const addEditVenue = () => {
    if (editFormData.venues.length >= 5) return;
    setEditFormData((p) => ({
      ...p,
      venues: [...p.venues, { venue: "", mapUrl: "" }],
    }));
  };

  const removeEditVenue = (index) => {
    const updated = editFormData.venues.filter((_, i) => i !== index);
    setEditFormData((p) => ({ ...p, venues: updated }));
  };
  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditFormData((p) => ({
        ...p,
        bannerURL: ev.target.result,
        bannerFile: file,
      }));
    reader.readAsDataURL(file);
  };

  const uploadBanner = async (file, eventID) => {
    const ext = file.name.split(".").pop();
    const fileName = `event_banner_${eventID}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("events")
      .upload(fileName, file);
    if (error) throw new Error("Upload failed: " + error.message);
    return supabase.storage.from("events").getPublicUrl(fileName).data
      .publicUrl;
  };

  const isValidURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isValidGoogleMapsURL = (url) => {
    if (!url) return true;
    try {
      const u = new URL(url);
      const validHosts = [
        "maps.google.com",
        "www.google.com",
        "goo.gl",
        "maps.app.goo.gl",
      ];
      return validHosts.some(
        (h) => u.hostname === h || u.hostname.endsWith("." + h),
      );
    } catch {
      return false;
    }
  };

  const validateEditForm = () => {
    const errs = [];
    const now = new Date();

    if (!editFormData.title.trim()) errs.push("Event name is required.");
    else if (editFormData.title.trim().length < 3)
      errs.push("Event name must be at least 3 characters.");

    if (!editFormData.description.trim())
      errs.push("Short description is required.");
    else if (editFormData.description.trim().length < 10)
      errs.push("Description must be at least 10 characters.");

    if (editFormData.eventURL && !isValidURL(editFormData.eventURL))
      errs.push("Event URL must start with http:// or https://.");

    if (!editFormData.fromDate || !editFormData.fromTime)
      errs.push("Start date and time are required.");
    if (!editFormData.toDate || !editFormData.toTime)
      errs.push("End date and time are required.");

    if (
      editFormData.fromDate &&
      editFormData.fromTime &&
      editFormData.toDate &&
      editFormData.toTime
    ) {
      const startDT = new Date(
        `${editFormData.fromDate}T${editFormData.fromTime}`,
      );
      const endDT = new Date(`${editFormData.toDate}T${editFormData.toTime}`);
      if (endDT <= startDT)
        errs.push("End date & time must be after the start.");
      if (editFormData.reg_deadline) {
        const regDT = new Date(editFormData.reg_deadline);
        if (regDT >= startDT)
          errs.push("Registration deadline must be before the event start.");
        if (regDT >= endDT)
          errs.push("Registration deadline must be before the event end.");
      }
    }

    (editFormData.venues || []).forEach((v, i) => {
      if (v.mapUrl && !isValidURL(v.mapUrl))
        errs.push(
          `Venue ${i + 1}: Map URL must start with http:// or https://.`,
        );
      else if (v.mapUrl && !isValidGoogleMapsURL(v.mapUrl))
        errs.push(`Venue ${i + 1}: Map URL must be a valid Google Maps link.`);
    });
    if (editFormData.max_participants !== "") {
      const val = parseInt(editFormData.max_participants);
      if (isNaN(val) || val < 1)
        errs.push("Max participants must be a positive number.");
      else if (val > 100000)
        errs.push("Max participants value seems too large.");
    }

    if (
      editFormData.max_volunteers !== "" &&
      isNaN(parseInt(editFormData.max_volunteers))
    )
      errs.push("Volunteers needed must be a number.");

    return errs;
  };

  const handleSaveEdit = async () => {
    const validationErrors = validateEditForm();
    if (validationErrors.length > 0) {
      setEditError(validationErrors.join("\n"));
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      let bannerURL = editingEvent.bannerURL || null;
      if (editFormData.bannerFile)
        bannerURL = await uploadBanner(
          editFormData.bannerFile,
          editingEvent.eventID,
        );
      else if (
        editFormData.bannerURL &&
        !editFormData.bannerURL.startsWith("data:")
      )
        bannerURL = editFormData.bannerURL;

      const fromDateTime = new Date(
        `${editFormData.fromDate}T${editFormData.fromTime}`,
      ).toISOString();
      const toDateTime = new Date(
        `${editFormData.toDate}T${editFormData.toTime}`,
      ).toISOString();

      const updates = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        agenda: editFormData.agenda.trim() || null,
        venue:
          editFormData.venues
            .map((v) => v.venue.trim())
            .filter(Boolean)
            .join(" | ") || null,
        venue_url:
          editFormData.venues
            .map((v) => v.mapUrl.trim())
            .filter(Boolean)
            .join(" | ") || null,
        max_participants:
          editFormData.max_participants !== ""
            ? parseInt(editFormData.max_participants)
            : null,
        max_volunteers:
          editFormData.max_volunteers !== ""
            ? parseInt(editFormData.max_volunteers)
            : null,
        bannerURL,
        reg_deadline: editFormData.reg_deadline
          ? new Date(editFormData.reg_deadline).toISOString()
          : null,
        fromDateTime,
        toDateTime,
        is_food_available: editFormData.is_food_available,
        eventURL: editFormData.eventURL.trim() || null,

        status:
          editingEvent.status === "published"
            ? "postponed"
            : editingEvent.status,
      };

      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .update(updates)
        .eq("eventID", editingEvent.eventID);
      if (error) throw error;
      setEvents(
        events.map((e) =>
          e.eventID === editingEvent.eventID ? { ...e, ...updates } : e,
        ),
      );
      setShowEditModal(false);
      toast.success("Event updated and postponed!");
      await logActivity({
        action: "EDIT_EVENT",
        description: `Updated and postponed event: ${editFormData.title}`,
        entity_type: "event",
        entity_id: editingEvent.eventID,
      });
    } catch (err) {
      if (err.code === "23505" && err.message?.includes("eventURL"))
        setEditError(
          "This Event URL is already used by another event. Please use a different URL.",
        );
      else setEditError(err.message || "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewVolunteers = async (event) => {
    setSelectedEvent(event);
    setRegisteredVolunteers([]);
    setVolunteerSearchQuery("");
    setWalkinSearch("");
    setWalkinResults([]);
    setShowWalkinPanel(false);
    setVolunteersLoading(true);
    setShowVolunteersModal(true);
    try {
      const { data: participations, error: pErr } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id, participant_id, created_at, registered_as")
        .eq("event_id", event.eventID)
        .in("registered_as", ["volunteer", "attended"]);
      if (pErr) throw pErr;
      if (!participations?.length) {
        setVolunteersLoading(false);
        return;
      }

      const ids = participations.map((p) => p.participant_id);
      const { data: users, error: uErr } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID, firstName, lastName, emailID, photo")
        .in("userID", ids);
      if (uErr) throw uErr;

      setRegisteredVolunteers(
        participations.map((p) => {
          const user = (users || []).find((u) => u.userID === p.participant_id);
          return {
            participationId: p.id,
            registeredAt: p.created_at,
            attended: p.registered_as === "attended",
            ...(user || { firstName: "Unknown", lastName: "", emailID: "—" }),
          };
        }),
      );
    } catch (err) {
      alert("Failed to fetch volunteers: " + err.message);
    } finally {
      setVolunteersLoading(false);
    }
  };

  const handleToggleAttendance = async (participationId, currentlyAttended) => {
    setAttendanceUpdating((prev) => ({ ...prev, [participationId]: true }));
    const newStatus = currentlyAttended ? "volunteer" : "attended";

    // Get volunteer info BEFORE updating state
    const volunteer = registeredVolunteers.find(
      (v) => v.participationId === participationId,
    );

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
            ? { ...v, attended: !currentlyAttended }
            : v,
        ),
      );

      // Now log with the volunteer info
      await logActivity({
        action: "TOGGLE_ATTENDANCE",
        description: `Marked ${volunteer?.firstName} ${volunteer?.lastName} as ${newStatus === "attended" ? "attended" : "not attended"}`,
        entity_type: "event_participation",
        entity_id: participationId,
      });
    } catch (err) {
      alert("Failed to update attendance: " + err.message);
    } finally {
      setAttendanceUpdating((prev) => ({ ...prev, [participationId]: false }));
    }
  };
  // Admin-set status config
  const ADMIN_STATUSES = [
    {
      value: "published",
      label: "Published",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "draft",
      label: "Draft",
      color: "bg-gray-100 text-gray-600 border-gray-200",
    },
    {
      value: "postponed",
      label: "Postponed",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-600 border-red-200",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  ];

  const getAdminStatusStyle = (statusVal) =>
    ADMIN_STATUSES.find((s) => s.value === statusVal)?.color ||
    "bg-gray-100 text-gray-600 border-gray-200";

  const handleUpdateAdminStatus = async (eventID, newStatus) => {
    setStatusUpdating((prev) => ({ ...prev, [eventID]: true }));
    try {
      const event = events.find((e) => e.eventID === eventID);
      const oldStatus = event?.status || "published";

      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .update({ status: newStatus })
        .eq("eventID", eventID);
      if (error) throw error;

      setEvents((prev) =>
        prev.map((e) =>
          e.eventID === eventID ? { ...e, status: newStatus } : e,
        ),
      );
      toast.success("Status updated");

      // Log the status change
      await logActivity({
        action: "UPDATE_STATUS",
        description: `Changed event status from ${oldStatus} to ${newStatus}: ${event?.title}`,
        entity_type: "event",
        entity_id: eventID,
      });
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [eventID]: false }));
    }
  };

  // Search all volunteers for walk-in addition
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
        .or(
          `firstName.ilike.%${query}%,lastName.ilike.%${query}%,emailID.ilike.%${query}%`,
        )
        .limit(10);
      if (error) throw error;

      // Exclude volunteers already in the modal list
      const alreadyIn = new Set(registeredVolunteers.map((v) => v.userID));
      setWalkinResults((data || []).filter((u) => !alreadyIn.has(u.userID)));
    } catch (err) {
      toast.error("Search failed: " + err.message);
    } finally {
      setWalkinLoading(false);
    }
  };

  // Add walk-in volunteer directly with 'attended' status
  const handleAddWalkin = async (volunteer) => {
    if (!selectedEvent) return;
    setWalkinAdding((prev) => ({ ...prev, [volunteer.userID]: true }));
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .insert({
          event_id: selectedEvent.eventID,
          participant_id: volunteer.userID,
          registered_as: "attended",
        })
        .select("id, created_at")
        .single();

      if (error) throw error;

      // Add to the registered list immediately
      setRegisteredVolunteers((prev) => [
        ...prev,
        {
          participationId: data.id,
          registeredAt: data.created_at,
          attended: true,
          userID: volunteer.userID,
          firstName: volunteer.firstName,
          lastName: volunteer.lastName,
          emailID: volunteer.emailID,
          photo: volunteer.photo,
        },
      ]);

      // Update volunteer count
      setVolunteerCounts((prev) => ({
        ...prev,
        [selectedEvent.eventID]: (prev[selectedEvent.eventID] || 0) + 1,
      }));

      // Remove from walk-in results
      setWalkinResults((prev) =>
        prev.filter((v) => v.userID !== volunteer.userID),
      );
      toast.success(
        `${volunteer.firstName} ${volunteer.lastName} marked as attended!`,
      );
      await logActivity({
        action: "ADD_WALKIN",
        description: `Marked ${volunteer.firstName} ${volunteer.lastName} as walk-in attended`,
        entity_type: "event",
        entity_id: selectedEvent.eventID,
      });
    } catch (err) {
      if (err.code === "23505") {
        toast.error("This volunteer is already registered for this event.");
      } else {
        toast.error("Failed to add volunteer: " + err.message);
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

  const getDay = (dt) => (dt ? new Date(dt).getDate() : "");
  const getMonth = (dt) =>
    dt ? new Date(dt).toLocaleString("default", { month: "short" }) : "";
  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";
  const statusStyle = (s) =>
    s === "Ongoing"
      ? "text-green-600"
      : s === "Upcoming"
        ? "text-yellow-500"
        : "text-gray-400";

  const totalEvents = events.length;
  const ongoingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Ongoing",
  ).length;
  const upcomingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Upcoming",
  ).length;
  const completedCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Completed",
  ).length;
  const filteredEvents = events.filter((e) => {
    const timeStatus = getStatus(e.fromDateTime, e.toDateTime);
    const passesTimeFilter = filter === "All" || timeStatus === filter;
    const passesAdminFilter =
      statusFilter === "All" || (e.status || "published") === statusFilter;
    return passesTimeFilter && passesAdminFilter;
  });
  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C97736]";
  const attendedCount = registeredVolunteers.filter((v) => v.attended).length;
  const filteredVolunteers = registeredVolunteers.filter((v) => {
    const q = volunteerSearchQuery.toLowerCase();
    return (
      v.firstName.toLowerCase().includes(q) ||
      v.lastName.toLowerCase().includes(q) ||
      v.emailID.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading events</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-5 mt-5">
          <AdminStatsSkeleton cards={4} />
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="h-10 w-full max-w-sm rounded-full bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] animate-pulse mb-4" />
            <AdminTableSkeleton rows={3} columns={4} />
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          {[
            {
              label: "Total Events",
              count: totalEvents,
              color: "border-orange-400",
            },
            { label: "Ongoing", count: ongoingCount, color: "border-blue-400" },
            {
              label: "Upcoming",
              count: upcomingCount,
              color: "border-green-400",
            },
            {
              label: "Completed",
              count: completedCount,
              color: "border-purple-400",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className={`bg-white p-4 rounded-xl border-t-4 ${color}`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <h1 className="text-3xl font-bold">{count}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs: Time-based + Admin Status */}
      {!loading && (
        <div className="flex flex-col gap-2 mt-5">
          {/* Time-based tabs */}
          <div className="flex gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-xs text-gray-400 self-center mr-1 font-medium">
              Schedule:
            </span>
            {["All", "Ongoing", "Upcoming", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${filter === f ? "bg-[#F7F2EC] text-gray-700 border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Admin status filter */}
          <div className="flex gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-xs text-gray-400 self-center mr-1 font-medium">
              Status:
            </span>
            {["All", ...ADMIN_STATUSES.map((s) => s.value)].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition border ${
                  statusFilter === s
                    ? "bg-[#C97736] text-white border-[#C97736]"
                    : "border-gray-200 text-gray-500 hover:border-[#C97736] hover:text-[#C97736]"
                }`}
              >
                {s === "All"
                  ? "All"
                  : ADMIN_STATUSES.find((x) => x.value === s)?.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-5">
          <p className="text-gray-500">
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}events found
          </p>
        </div>
      )}

      {/* 2-column card grid */}
      {!loading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 overflow-y-auto max-h-[60vh] pr-1">
          {filteredEvents.map((event) => {
            const status = getStatus(event.fromDateTime, event.toDateTime);
            const volunteerCount = volunteerCounts[event.eventID] || 0;
            return (
              <div
                key={event.eventID}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center bg-[#A64200] rounded-lg w-12 h-12 flex-shrink-0">
                      <span className="text-lg font-bold text-white leading-none">
                        {getDay(event.fromDateTime)}
                      </span>
                      <span className="text-[10px] font-semibold text-white uppercase">
                        {getMonth(event.fromDateTime)}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800 text-base leading-tight">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <FaClock size={10} />
                        <span>{formatTime(event.fromDateTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {/* Auto time-based status */}
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${statusStyle(status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
                      {status}
                    </span>
                    {/* Admin-set status dropdown */}
                    <div className="relative">
                      {statusUpdating[event.eventID] ? (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FaSpinner className="animate-spin" size={10} />{" "}
                          Saving...
                        </span>
                      ) : (
                        <select
                          value={event.status || "published"}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdateAdminStatus(
                              event.eventID,
                              e.target.value,
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border cursor-pointer appearance-none pr-5 ${getAdminStatusStyle(event.status || "published")}`}
                          title="Set admin status"
                        >
                          {ADMIN_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FaUsers size={10} />
                      {volunteerCount}
                      {event.max_volunteers
                        ? `/${event.max_volunteers}`
                        : ""}{" "}
                      volunteers
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 px-4 pb-3">
                  {event.bannerURL ? (
                    <img
                      src={event.bannerURL}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 flex-1">
                    {event.description}
                  </p>
                </div>

                <div className="flex border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5"
                    title="Edit"
                  >
                    <FaEdit size={14} />
                    <span className="hidden md:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(event.eventID)}
                    className="flex-1 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5"
                    title="Delete"
                  >
                    <FaTrash size={12} />
                    <span className="hidden md:inline">Delete</span>
                  </button>

                  {/* Draft: Show Publish Button */}
                  {event.status === "draft" && (
                    <button
                      onClick={() =>
                        handleUpdateAdminStatus(event.eventID, "published")
                      }
                      disabled={statusUpdating[event.eventID]}
                      className="flex-1 py-2.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5 disabled:opacity-60"
                      title="Publish this event"
                    >
                      {statusUpdating[event.eventID] ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        "✓ Publish"
                      )}
                    </button>
                  )}

                  {/* Published & NOT Completed: Show Postpone & Cancel */}
                  {event.status === "published" &&
                    getStatus(event.fromDateTime, event.toDateTime) !==
                      "Completed" && (
                      <>
                        <button
                          onClick={() => handleEdit(event)}
                          className="flex-1 py-2.5 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5"
                          title="Edit and reschedule event"
                        >
                          <span>⏸ Postpone</span>
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateAdminStatus(event.eventID, "cancelled")
                          }
                          disabled={statusUpdating[event.eventID]}
                          className="flex-1 py-2.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5 disabled:opacity-60"
                          title="Cancel this event"
                        >
                          {statusUpdating[event.eventID] ? (
                            <FaSpinner className="animate-spin" size={12} />
                          ) : (
                            "✕ Cancel"
                          )}
                        </button>
                      </>
                    )}

                  {/* Postponed & NOT Completed: Show Cancel Button Only */}
                  {event.status === "postponed" &&
                    getStatus(event.fromDateTime, event.toDateTime) !==
                      "Completed" && (
                      <button
                        onClick={() =>
                          handleUpdateAdminStatus(event.eventID, "cancelled")
                        }
                        disabled={statusUpdating[event.eventID]}
                        className="flex-1 py-2.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium transition border-r border-gray-100 flex items-center justify-center gap-1.5 disabled:opacity-60"
                        title="Cancel this event"
                      >
                        {statusUpdating[event.eventID] ? (
                          <FaSpinner className="animate-spin" size={12} />
                        ) : (
                          "✕ Cancel"
                        )}
                      </button>
                    )}
                  <button
                    onClick={() => handleViewVolunteers(event)}
                    className="flex-grow py-2.5 text-sm text-white bg-[#C97736] hover:bg-[#a85f27] font-medium transition flex items-center justify-center gap-1.5 px-2"
                    title="View Volunteers"
                  >
                    <FaUsers size={14} />
                    <span className="hidden md:inline">View Volunteers</span>
                    <span className="inline md:hidden">View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Event
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Sticky error banner */}
            {editError && (
              <div className="px-5 py-3 bg-red-50 border-b border-red-200">
                <p className="text-red-700 text-xs font-semibold mb-1">
                  Please fix the following:
                </p>
                <ul className="space-y-0.5">
                  {editError.split("\n").map((e, i) => (
                    <li
                      key={i}
                      className="text-red-600 text-xs flex items-start gap-1.5"
                    >
                      <span className="flex-shrink-0 mt-0.5">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Banner */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Banner
                </label>
                {editFormData.bannerURL && (
                  <img
                    src={editFormData.bannerURL}
                    alt="preview"
                    className="w-full h-28 object-cover rounded-lg border border-gray-200 mb-2"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg cursor-pointer hover:bg-gray-200">
                  Change Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerFileChange}
                  />
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Event Name *
                </label>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInput}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Agenda */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Details / Agenda
                </label>
                <textarea
                  name="agenda"
                  value={editFormData.agenda}
                  onChange={handleEditInput}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Event URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Event URL
                </label>
                <input
                  name="eventURL"
                  value={editFormData.eventURL}
                  onChange={handleEditInput}
                  placeholder="https://example.com/event"
                  className={inputCls}
                />
              </div>

              {/* Start Date & Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="fromDate"
                    value={editFormData.fromDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="fromTime"
                    value={editFormData.fromTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="toDate"
                    value={editFormData.toDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="toTime"
                    value={editFormData.toTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>

              {/* Venue + Map URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Venue / Location & Map URL
                </label>
                {(editFormData.venues || []).map((v, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-2 mb-2 items-start"
                  >
                    <input
                      value={v.venue}
                      onChange={(e) =>
                        handleEditVenueChange(i, "venue", e.target.value)
                      }
                      placeholder="e.g. Community Hall"
                      className={inputCls}
                    />
                    <div className="flex gap-1 items-center">
                      <input
                        value={v.mapUrl}
                        onChange={(e) =>
                          handleEditVenueChange(i, "mapUrl", e.target.value)
                        }
                        placeholder="https://maps.google.com/..."
                        className={`${inputCls} flex-1`}
                      />
                      {editFormData.venues.length > 1 && (
                        <button
                          onClick={() => removeEditVenue(i)}
                          className="text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          <FaTimes size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {editFormData.venues.length < 5 && (
                  <button
                    onClick={addEditVenue}
                    className="text-xs text-[#C97736] hover:underline mt-1"
                  >
                    + Add another venue
                  </button>
                )}
              </div>
              {/* Registration Deadline */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="reg_deadline"
                  value={editFormData.reg_deadline}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>

              {/* Max Participants + Max Volunteers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={editFormData.max_participants}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Volunteers Needed
                  </label>
                  <input
                    type="number"
                    name="max_volunteers"
                    value={editFormData.max_volunteers}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Food Provided */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_food_available"
                  id="is_food_available"
                  checked={editFormData.is_food_available}
                  onChange={handleEditInput}
                  className="w-5 h-5 accent-[#C97736] cursor-pointer"
                />
                <label
                  htmlFor="is_food_available"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Food Provided
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 py-2 bg-[#C97736] text-white rounded-lg text-sm hover:bg-[#a85f27] flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={13} /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Volunteers Modal ── */}
      {showVolunteersModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[100vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Volunteers
                </h2>
                <p className="text-sm text-gray-500">{selectedEvent.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowWalkinPanel(!showWalkinPanel);
                    setWalkinSearch("");
                    setWalkinResults([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition border ${
                    showWalkinPanel
                      ? "bg-[#C97736] text-white border-[#C97736]"
                      : "bg-white text-[#C97736] border-[#C97736] hover:bg-orange-50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Walk-in
                </button>
                <button
                  onClick={() => setShowVolunteersModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Walk-in Panel */}
            {showWalkinPanel && (
              <div className="px-5 py-4 bg-orange-50 border-b border-orange-200">
                <h3 className="text-sm font-bold text-[#C97736] mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Mark Walk-in Attendance
                </h3>
                <p className="text-xs text-orange-700 mb-3">
                  Search for a volunteer who showed up without registering and
                  mark them as attended directly.
                </p>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search volunteer by name or email..."
                    value={walkinSearch}
                    onChange={(e) => handleWalkinSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C97736] bg-white"
                    autoFocus
                  />
                </div>
                {walkinLoading && (
                  <div className="flex justify-center py-3">
                    <FaSpinner className="animate-spin text-[#C97736]" />
                  </div>
                )}
                {!walkinLoading &&
                  walkinSearch.length >= 2 &&
                  walkinResults.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-3">
                      No volunteers found. They may already be registered.
                    </p>
                  )}
                {walkinResults.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {walkinResults.map((v) => (
                      <div
                        key={v.userID}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 border border-orange-100"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#C97736] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {v.firstName?.charAt(0)}
                          {v.lastName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {v.firstName} {v.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {v.emailID}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddWalkin(v)}
                          disabled={!!walkinAdding[v.userID]}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold transition disabled:opacity-60"
                        >
                          {walkinAdding[v.userID] ? (
                            <FaSpinner className="animate-spin" size={10} />
                          ) : (
                            <FaCheck size={10} />
                          )}
                          Mark Attended
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 space-y-3">
              {registeredVolunteers.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Attended:{" "}
                    <span className="font-semibold text-green-600">
                      {attendedCount}
                    </span>
                    <span className="text-gray-400">
                      {" "}
                      / {registeredVolunteers.length}
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">
                    Check to mark as attended
                  </span>
                </div>
              )}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={volunteerSearchQuery}
                  onChange={(e) => setVolunteerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C97736]"
                />
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto min-h-0">
              {volunteersLoading ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="animate-spin text-[#C97736] text-2xl" />
                </div>
              ) : registeredVolunteers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No volunteers registered yet.
                </p>
              ) : filteredVolunteers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No volunteers match your search.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
                  {filteredVolunteers.map((v) => (
                    <div
                      key={v.participationId}
                      className={`flex items-center gap-4 p-4 border rounded-lg transition ${v.attended ? "border-green-200 bg-green-50" : "border-gray-100 bg-gray-50"}`}
                    >
                      <button
                        onClick={() =>
                          handleToggleAttendance(v.participationId, v.attended)
                        }
                        disabled={!!attendanceUpdating[v.participationId]}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${v.attended ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white hover:border-green-400"}`}
                        title={
                          v.attended
                            ? "Mark as not attended"
                            : "Mark as attended"
                        }
                      >
                        {attendanceUpdating[v.participationId] ? (
                          <FaSpinner className="animate-spin" size={12} />
                        ) : v.attended ? (
                          <FaCheck size={12} />
                        ) : null}
                      </button>

                      {v.photo ? (
                        <img
                          src={v.photo}
                          alt="profile"
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#C97736] text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">
                          {v.firstName?.charAt(0)}
                          {v.lastName?.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-base ${v.attended ? "text-green-800" : "text-gray-800"}`}
                        >
                          {v.firstName} {v.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {v.emailID}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(v.registeredAt)}
                        </p>
                      </div>

                      {v.attended && (
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full flex-shrink-0">
                          Attended
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200">
              <button
                onClick={() => setShowVolunteersModal(false)}
                className="w-full py-2 bg-[#C97736] text-white rounded-lg text-sm hover:bg-[#a85f27]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Delete Event?"
        message="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default Events;
